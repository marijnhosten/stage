/* */

/* SCREENS */

var $menu = $('.menu');
var $currentTag;
var $screenSaver = $('.screensaver');
var $alertScreen = $('.alertScreen');
var $stopScreen = $('.stopScreen');

var $introScreen = $('.introScreen');

var $kidsScreen = $('.kids');
var $teensScreen = $('.teens');
var $adultsScreen = $('.adults');

var $settings = {};
var $introData, $teenData, $adultData, $birds, $childData, $apptranslations;

var _userData = {};
var _language = 'NL';
var _birdID = 0;

var _nextUserData = {};
var _nextLanguage = '';

var _isLoggedIn = false;

var _socket;
var _exhibitID = 30;

/* */
var _tmrScreensaver;

/* */
$(document).ready(function () {


    initRFIDConnection();
    function initRFIDConnection() {
        try {
            _socket = io.connect('http://localhost:8081', {'force new connection': true});

            _socket.on('connect', onConnection);
            _socket.on('new_tag', onNewTag);
            _socket.on('same_tag', onSameTag);

            _socket.on('invalid_tag', onInvalidTagScanned);
        }
        catch (e) {
            console.warn('RFIDconnection failed');
        }


        function onConnection() {
            console.log('connection established');
        }

        function onNewTag(data) {
            console.log(_userData);
            console.log(data);
            if (!_userData[0] || _userData[0].visitor_personal_information.name != data[0].visitor_personal_information.name) {

                if (!_isLoggedIn) {
                    onLoginCompleteHandler(data);
                } else {
                    _nextUserData = data;
                    onNewTagScannedAlertScreen();
                }
            }
        }

        function onSameTag() {
            onAwaitYourTurnTag();
        }
    }

    startScreenSaver();
});


var changedLangNl = false;
var changedLangFr = false;
var changedLangNlScan = false;
var changedLangFrScan = false;
function startScreenSaver() {


    function rotateScreensaver() {

        var arrTitles = [$settings.titleNL, $settings.titleFR, $settings.titleNL, $settings.titleEN,
            $settings.titleNL, $settings.titleDE];
        var ssLabels = useGrep($apptranslations, 'identifier', 'screensaver_scan');
        var arrInfo = [ssLabels.valueNL, ssLabels.valueFR, ssLabels.valueNL, ssLabels.valueEN,
            ssLabels.valueNL, ssLabels.valueDE];


        $screenSaver.find('.text').html(arrInfo[0]);
        $screenSaver.find('.title').html(arrTitles[0]);

        //var birdName = _userData[1].bird["nameNL"].toLowerCase();
        //var imgName = birdName + ".tif";
        var imgName = "stern.png";

        $screenSaver.css({
            'background-image': 'url(./assets/img/' + imgName + ')'
        });

        var svTitle = $('.svTitle'), svScan = $('.svScan p');
        var svNewTitle = $('.svNewTitle'), svNewScan = $('.svNewScan p');

        switchTitle(svTitle);
        switchNewTitle(svNewTitle);
        switchScan(svScan);
        switchNewScan(svNewScan);

        _tmrScreensaver = setInterval(function () {

            animateScreensaver(svTitle, svScan, svNewTitle, svNewScan);

        }, 5000);
    }

    function animateScreensaver(title, scan, newTitle, newScan) {

        var speed = 500;

        if (title.hasClass('right')) {
            title.removeClass('right');
            title.animate({
                'margin-left': '110px'
            }, speed);


        } else {

            title.addClass('right');
            title.animate({
                'margin-left': '900px'
            }, speed, function () {
                title.css({
                    'margin-left': '-950px'
                });
                switchTitle(title);
            });


        }

        if (newTitle.hasClass('right')) {
            newTitle.removeClass('right');
            newTitle.animate({
                'margin-left': '110px'
            }, speed);

        } else {

            newTitle.addClass('right');
            newTitle.animate({
                'margin-left': '900px'
            }, speed, function () {
                newTitle.css({
                    'margin-left': '-950px'
                });
                switchNewTitle(newTitle);
            });


        }

        if (scan.hasClass('right')) {
            scan.removeClass('right');
            scan.animate({
                'margin-left': '0'
            }, speed);

        } else {

            scan.addClass('right');
            scan.animate({
                'margin-left': '900px'
            }, speed, function () {
                scan.css({
                    'margin-left': '-950px'
                });

                switchScan(scan);
            });
        }

        if (newScan.hasClass('right')) {
            newScan.removeClass('right');
            newScan.animate({
                'margin-left': '0'
            }, speed);

        } else {

            newScan.addClass('right');
            newScan.animate({
                'margin-left': '900px'
            }, speed, function () {
                newScan.css({
                    'margin-left': '-950px'
                });

                switchNewScan(newScan);
            });
        }
    }

    function switchTitle(title) {

        if (!changedLangNl) {
            title.html('<span>' + $settings["titleEN"] + '</span>');
            changedLangNl = true;
        } else {
            title.html('<span>' + $settings["titleNL"] + '</span>');
            changedLangNl = false;
        }
    }

    function switchNewTitle(title) {
        if (!changedLangFr) {
            title.html('<span>' + $settings["titleDE"] + '</span>');
            changedLangFr = true;
        } else {
            title.html('<span>' + $settings["titleFR"] + '</span>');
            changedLangFr = false;
        }
    }

    function switchScan(scan) {

        var txtScan = useGrep($apptranslations, "identifier", "screensaver_scan");

        if (!changedLangNlScan) {
            scan.html(txtScan["valueEN"]);
            changedLangNlScan = true;
        } else {
            scan.html(txtScan["valueNL"]);
            changedLangNlScan = false;
        }
    }

    function switchNewScan(scan) {

        var txtScan = useGrep($apptranslations, "identifier", "screensaver_scan");
        if (!changedLangFrScan) {
            scan.html(txtScan["valueDE"]);
            changedLangFrScan = true;
        } else {
            scan.html(txtScan["valueFR"]);
            changedLangFrScan = false;
        }
    }

    readJsonFile();
    function readJsonFile() {
        $.getJSON('uploads/json/data.json', function (data) {
            data = JSON.stringify(data);
            data = data.replace(/\\r\\n/g, '<br/>');
            data = data.replace(/\\/g, '/');
            data = data.replace(/\u00df/g, "<span class='nouppercase'>&#223;</span>");

            var regex = new RegExp("uploads\/project_4\/exhibit_" + _exhibitID + "\/", "g");
            data = data.replace(regex, '');
            data = data.replace(/uploads\/project_3\/exhibit_-1\//g, '');

            data = $.parseJSON(data);

            $introData = data.exemplumtafel_intro_images;
            $teenData = data.teen_exemplums[0];
            $adultData = data.adult_exemplums[0];
            $childData = data.children_games[0];
            $birds = data.birds;
            $settings = data.exemplumtafel_settings[0];
            $apptranslations = data.apptranslations;
            $screenSaver.removeClass('hidden');


            rotateScreensaver();
        });
    }
}

function onLoginCompleteHandler(userData) {
    _userData = userData;

    _language = _userData[0].visitor_personal_information.language.code;
    _birdID = _userData[1].bird_id;
    _isLoggedIn = true;

    clearTimeout(_tmrScreensaver);
    initGlobalTimeOut();

    initMenu();

    function initMenu() {
        $screenSaver.addClass('hidden');
        $menu.removeClass('hidden');
        $menu.find('.stopButtonWrapper').off('click').on('click', onMenuStopButtonHandler);

        var welk = useGrep($apptranslations, 'identifier', 'menu_welcome');
        $('.stopButtonWrapper').find('.text').html(useGrep($apptranslations, "identifier", "label_stop")["value" + _language]);

        $menu.find('.userName').html('<span>' + welk['value' + _language] + '</span> ' + _userData[0].visitor_personal_information.name);

        checkAgeCategory();
    }

    function checkAgeCategory() {
        var age = _userData[0].visitor_personal_information.age;
        if (age <= 9) {
            console.log('Age Category: kids,   age: ' + age);
            setIntroData('kids');
        } else if (age <= 16 && age >= 10) {
            $('body').addClass('dark');
            console.log('Age Category: teens,   age: ' + age);
            setIntroData('teens');
        } else if (age >= 17) {
            console.log('Age Category: adults. Skip intro,   age: ' + age);
            startAdult();
        }
    }

    function setIntroData(age) {

        setIntroScreen();
        function setIntroScreen() {
            var item = $introData[_userData[1].bird_id - 1];
            if (age == 'kids') {
                $introScreen.addClass('kids');
                $introScreen.find('.title').addClass('hidden');
                $('.textContainer').html($introData[_userData[1].bird_id - 1].text_childNL);
                $introScreen.find('.image').removeClass('hidden');
            } else if (age == 'teens') {
                $introScreen.find('.title').removeClass('hidden');
                $introScreen.find('.image').removeClass('hidden').removeClass('kids');
                $introScreen.find('.title').html('<p>' + item["text_teen" + _language] + '</p>');
                $introScreen.find('.image').css('background-image', 'url("' + item.image + '")');
            }
            showIntro();
        }

        function showIntro() {
            $introScreen.removeClass('hidden');
            $introScreen.find('.image').removeClass('hidden');
            $('.birdContainer').removeClass('hidden hide');
        }

        var item = useGrep($apptranslations, 'identifier', 'label_start');
        $('.birdContainer').find('.text').html(item['value' + _language]);
        $('.birdContainer').find('.button').off('click').on('click', onPlayButtonHandler);
        function onPlayButtonHandler() {
            $('.birdContainer .bird').addClass('hidden');
            $('.birdContainer .button').removeClass('play');
            if (age == 'kids') {
                startBeaksGame();
            } else if ('teens') {
                startTeens();
            }
        }
    }

    function onMenuStopButtonHandler() {

        stopGlobalTimeOut();

        setStopScreenText();
        function setStopScreenText() {
            var txt = useGrep($apptranslations, 'identifier', 'general_zekerstoppen');
            var ja = useGrep($apptranslations, 'identifier', 'general_yes');
            var nee = useGrep($apptranslations, 'identifier', 'general_no');
            $stopScreen.find('.text').html('<p class="zekerStoppen">' + txt['value' + _language].toUpperCase() + '</p>');
            $stopScreen.find('#confirm').html('<p>' + ja['value' + _language].toUpperCase() + '</p>');
            $stopScreen.find('#cancel').html('<p>' + nee['value' + _language].toUpperCase() + '</p>');

            $('.adults .fiche .content .contentLinks .video')[0].pause();
        }

        addStopScreenEvents();
        function addStopScreenEvents() {
            $stopScreen.find('#confirm').off('click').on('click', onConfirmStopHandler);
            $stopScreen.find('#cancel').off('click').on('click', onCancelStopHandler);
            $stopScreen.removeClass('hidden');
        }

        function onCancelStopHandler() {
            $stopScreen.addClass('hidden');
            initGlobalTimeOut();
            $('.adults .fiche .content .contentLinks .video')[0].play();
        }
    }


}

function onConfirmStopHandler() {
    onGameOver();
}

function onNewTagScannedAlertScreen() {
    $stopScreen.find('#confirm').off('click').on('click', onConfirmStopHandler);
    $stopScreen.find('#cancel').off('click').on('click', onCancelStopHandler);

    setAlertScreenText();
    function setAlertScreenText() {

        _nextLanguage = _nextUserData[0].visitor_personal_information.language.code;

        var txt = useGrep($apptranslations, 'identifier', 'general_zekerstoppen');
        var currentUserText = txt['value' + _language].toUpperCase();
        var nextUserText = txt['value' + _nextLanguage].toUpperCase();
        var text = '';

        if (_language == _nextLanguage) {
            text = currentUserText;
        } else {
            text = currentUserText + '<br />' + nextUserText;
        }

        $stopScreen.find('.text').html(text);
        $stopScreen.removeClass('hidden');
    }

    function onConfirmStopHandler() {
        _socket.emit('game_over');
        _isLoggedIn = false;

        $('.page').addClass('hidden');
        $('.menu').addClass('hidden');
        $('.hide').addClass('hidden');

        _userData = _nextUserData;
        _language = _nextLanguage;
        onLoginCompleteHandler(_nextUserData);
    }

    function onCancelStopHandler() {
        $stopScreen.addClass('hidden');
    }
}

function onTooLateTryAgain() {
    $stopScreen.find('#confirm').off('click').on('click', onConfirmStopHandler);
    $stopScreen.find('#cancel').off('click').on('click', onCancelStopHandler);

    setTooLateScreenText();
    function setTooLateScreenText() {
        _nextLanguage = _nextUserData.lang;
        $stopScreen.removeClass('hidden');

        var txt = useGrep($apptranslations, 'identifier', 'general_too_late')['value' + _language].toUpperCase();
        var ja = useGrep($apptranslations, 'identifier', 'general_yes');
        var nee = useGrep($apptranslations, 'identifier', 'general_no');

        $stopScreen.find('.text').html('<p class="zekerStoppen">' + txt+ '</p>');
        $stopScreen.find('#confirm').html('<p>' + ja['value' + _language].toUpperCase() + '</p>');
        $stopScreen.find('#cancel').html('<p>' + nee['value' + _language].toUpperCase() + '</p>');
    }

    function onConfirmStopHandler() {
        $stopScreen.addClass('hidden');
    }

    function onCancelStopHandler() {

        onGameOver();
    }
}

function onInvalidTagScanned() {
    if (_isLoggedIn) {
        return;
    }
    stopGlobalTimeOut();

    var $time = $('.time');

    $alertScreen.removeClass('hidden');
    $time.removeClass('hidden');
    $time.find('.unit').html('SEC');

    if (_language == "DE")$time.find('.unit').html('SEK');

    $('.alertScreen .alertTimer .timer').removeClass('fill');
    $('.buttonWrapper').css({'opacity': 0});
    $('.alertTimer').css({'left': '900px'});

    newCountDown();

    var _counter;
    var count;

    function newCountDown() {

        $('.alertScreen .alertTimer div').addClass('timer2');

        $(".timer2").circletimer({
            onComplete: timesUp,
            timeout: wait
        });

        count = 10;

        _counter = setInterval(timer, 1000);

        function timer() {

            count = count - 1;
            $time.find('.num').html(count);
            if (count <= -1) {
                clearInterval(_counter);
            }
        }

        function timesUp() {

            totalReset();
            clearInterval(_counter);
        }
    }

    $(".timer2").circletimer("start");

    var text = useGrep($apptranslations, 'identifier', 'general_invalid_ticket')['value' + _language].toUpperCase();
    $alertScreen.find('.text').html(text);


}

function onAwaitYourTurnTag() {
    if (_isLoggedIn) {
        return;
    }
    stopGlobalTimeOut();

    var $time = $('.time');

    $alertScreen.removeClass('hidden');
    $time.removeClass('hidden');
    $time.find('.unit').html('SEC');

    if (_language == "DE")$time.find('.unit').html('SEK');

    $('.alertScreen .alertTimer .timer').removeClass('fill');
    $('.buttonWrapper').css({'opacity': 0});
    $('.alertTimer').css({'left': '900px'});

    newCountDown();

    var _counter;
    var count;

    function newCountDown() {

        $('.alertScreen .alertTimer div').addClass('timer2');

        $(".timer2").circletimer({
            onComplete: timesUp,
            timeout: wait
        });

        count = 10;

        _counter = setInterval(timer, 1000);

        function timer() {

            count = count - 1;
            $time.find('.num').html(count);
            if (count <= -1) {
                clearInterval(_counter);
            }
        }

        function timesUp() {

            totalReset();
            clearInterval(_counter);
        }
    }

    $(".timer2").circletimer("start");

    var text = useGrep($apptranslations, 'identifier', 'general_wait_turn')['value' + _language].toUpperCase();
    $alertScreen.find('.text').html(text);
}

function onShowKidsScore(score) {
    var birdcontainer = $('.birdContainer');
    birdcontainer.find('.button').removeClass('text').find('div').html('<div class="pluim-' + score + '"></div>');
    birdcontainer.find('.text').html(useGrep($apptranslations, 'identifier', 'general_congrats')['value' + _language]);
    birdcontainer.find('.stars').removeClass('hidden');

    _socket.emit('game_over', {score: score, exhibitid: _exhibitID, visitorid: _userData[0].unique_tag});
    _socket.on('score_saved_complete', function () {
        setTimeout(onGameOver, 7000);
    });
}

function onGameOver() {
    _isLoggedIn = false;

    $('.page').not('.screensaver').addClass('hidden');
    $('.hide').addClass('hidden');
    $('.menu').addClass('hidden');
    stopGlobalTimeOut();

    totalReset();
}
function totalReset() {
    location.reload();
}
function useGrep(arr, identifier, id) {
    var item = $.grep(arr, function (e) {
        return e[identifier] == id;
    });
    return item[0];
}