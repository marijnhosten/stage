/* */

/* SCREENS */

var $menu = $('.menu');
var $currentTag;
var $screenSaver = $('.screensaver');
var $alertScreen = $('.alertScreen');
var $stopScreen = $('.stopScreen');
var $panorama_zones;
var _userData = {};
var _language = 'NL';
var $apptranslations;
var $titles;
var _nextUserData = {};
var _nextLanguage = '';

var _isLoggedIn = false;

var _socket;

/* */
var _tmrScreensaver;

var $accordeonData, $multitheme;


var _secondScan = false;

var $settings = {};
var $introData, $videoData, $birds;

var _exhibitID = 41;

/* */


/* */
$(document).ready(function () {

    initRFIDConnection();
    function initRFIDConnection() {
        _socket = io.connect('http://localhost:8081', {'force new connection': true});

        _socket.on('connect', onConnection);
        _socket.on('new_tag', onNewTag);
        _socket.on('same_tag', onSameTag);

        _socket.on('invalid_tag', onInvalidTagScanned);


        function onConnection() {
            console.log('connection established');
        }

        function onNewTag(data) {
            console.log(data);

            if (!_userData[0] || _userData[0].visitor_personal_information.name != data[0].visitor_personal_information.name) {

                if (!_isLoggedIn) {
                    onLoginCompleteHandler(data);
                } else {
                    console.log('nieuwe scan ja na login');

                    console.log(_nextUserData);

                    if (!_nextUserData[0]) {
                        _nextUserData = data;
                        onNewTagScannedAlertScreen();
                    } else {
                        _nextUserData = data;
                        $stopScreen.addClass('hidden');
                        onLoginCompleteHandler(_nextUserData);
                    }
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



    function animateScreensaver(title, scan, newTitle, newScan){

        var speed = 500;

        if(title.hasClass('right')){
            title.removeClass('right');
            title.animate({
                'margin-left': '110px'
            }, speed);


        }else {

            title.addClass('right');
            title.animate({
                'margin-left': '900px'
            }, speed, function(){
                title.css({
                    'margin-left': '-900px'
                });
                switchTitle(title);
            });


        }

        if(newTitle.hasClass('right')){
            newTitle.removeClass('right');
            newTitle.animate({
                'margin-left': '110px'
            }, speed);

        }else {

            newTitle.addClass('right');
            newTitle.animate({
                'margin-left': '900px'
            }, speed, function(){
                newTitle.css({
                    'margin-left': '-900px'
                });
                switchNewTitle(newTitle);
            });



        }

        if(scan.hasClass('right')){
            scan.removeClass('right');
            scan.animate({
                'margin-left': '0'
            }, speed);

        }else {

            scan.addClass('right');
            scan.animate({
                'margin-left': '900px'
            }, speed, function(){
                scan.css({
                    'margin-left': '-900px'
                });

                switchScan(scan);
            });
        }

        if(newScan.hasClass('right')){
            newScan.removeClass('right');
            newScan.animate({
                'margin-left': '0'
            }, speed);

        }else {

            newScan.addClass('right');
            newScan.animate({
                'margin-left': '900px'
            }, speed, function(){
                newScan.css({
                    'margin-left': '-910px'
                });

                switchNewScan(newScan);
            });
        }
    }

    function switchTitle(title){

        if(!changedLangNl){
            title.html('<span>' + $settings["titleEN"] + '</span>');
            changedLangNl = true;
        }else {
            title.html('<span>' + $settings["titleNL"] + '</span>');
            changedLangNl = false;
        }
    }

    function switchNewTitle(title){
        if(!changedLangFr){
            title.html('<span>' + $settings["titleDE"] + '</span>');
            changedLangFr = true;
        }else {
            title.html('<span>' + $settings["titleFR"] + '</span>');
            changedLangFr = false;
        }
    }

    function switchScan(scan){

        var txtScan = useGrep( $apptranslations, "identifier", "screensaver_scan");

        if(!changedLangNlScan){
            scan.html(txtScan["valueEN"]);
            changedLangNlScan = true;
        }else {
            scan.html(txtScan["valueNL"]);
            changedLangNlScan = false;
        }
    }

    function switchNewScan(scan){

        var txtScan = useGrep($apptranslations, "identifier", "screensaver_scan");
        if(!changedLangFrScan){
            scan.html(txtScan["valueDE"]);
            changedLangFrScan = true;
        }else {
            scan.html(txtScan["valueFR"]);
            changedLangFrScan = false;
        }
    }

    $screenSaver.off('click').on('click', onLoginCompleteHandler);
    $screenSaver.removeClass('hidden');

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

            $multitheme = data.exploratorium_multithemes[0];
            $accordeonData = $multitheme.exploratorium_multithemes_categories;
            $panorama_zones = data.exploratorium_choices[0].exploratorium_panoramas[0].exploratorium_panorama_zones;
            $introData = data.exemplumtafel_intro_images;
            $birds = data.birds;
            $apptranslations = data.apptranslations;
            $titles = data.exploratorium_choices[0].exploratorium_eats;
            $screenSaver.removeClass('hidden');

            rotateScreensaver();
        });
    }

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
        var imgName = "Schermbeeld_Exploratorium_1.png";

        $screenSaver.css({
            'background-color': '#f2f2f3'
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
}

function onLoginCompleteHandler(userData) {


    var _userData = [
        {
            "id": 3,
            "unique_tag": "0108f8c9b6",
            "project_id": 4,
            "visitor_personal_information_id": 2,
            "time_in": "2016-01-21T00:00:00+0000",
            "time_out": "2016-01-21T00:00:00+0000",
            "parameter1": null,
            "parameter2": null,
            "visitor_personal_information": {
                "id": 2,
                "name": "Alain Van Damme",
                "email": null,
                "age": 14,
                "nationality": "BE",
                "language_id": 4,
                "language": {
                    "id": 4,
                    "code": "NL",
                    "name": "Nederlands"
                }
            }
        },
        {
            "id": "0108f8c9b6",
            "visitor_id": 3,
            "bird_id": 3,
            "timestamp": "2016-01-12T07:56:13+0000",
            "bird": {
                "id": 9,
                "nameNL": "Kluut",
                "nameFR": null,
                "nameEN": null,
                "nameDE": null,
                "textNL": "",
                "textFR": null,
                "textEN": null,
                "textDE": null,
                "video": null,
                "image": null,
                "date_in": null,
                "date_out": null
            }
        }
    ];

    _nextUserData = {};
    //_userData = userData;
    _language = _userData[0].visitor_personal_information.language.code;
    _isLoggedIn = true;

    clearTimeout(_tmrScreensaver);
    initGlobalTimeOut();

    initMenu();
    function initMenu() {
        var stopButton = $('.stopButtonWrapper');

        $screenSaver.addClass('hidden');
        $menu.removeClass('hidden');
        stopButton.off('click').on('click', onMenuStopButtonHandler);
        var welk = useGrep($apptranslations, 'identifier', 'menu_welcome');
        stopButton.find('.text').html(useGrep($apptranslations, "identifier", "label_stop")["value" + _language]);
        $menu.find('.userName').html('<span>' + welk['value' + _language] +'</span> ' + _userData[0].visitor_personal_information.name);

        initChoiceScreen();
    }


    function onMenuStopButtonHandler() {

        stopGlobalTimeOut();

        setStopScreenText();
        function setStopScreenText() {
            var txt = useGrep($apptranslations, 'identifier', 'general_zekerstoppen');
            var ja = useGrep($apptranslations, 'identifier', 'general_yes');
            var nee = useGrep($apptranslations, 'identifier', 'general_no');
            $stopScreen.find('.text').html('<p class="zekerStoppen">'+  txt['value' + _language].toUpperCase() + '</p>');
            $stopScreen.find('#confirm').html('<p>'+  ja['value' + _language].toUpperCase() + '</p>');
            $stopScreen.find('#cancel').html('<p>'+  nee['value' + _language].toUpperCase() + '</p>');

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
        }
    }
}

function onConfirmStopHandler() {
    onGameOver();
}

function onNewTagScannedAlertScreen() {

    setAlertScreenText();
    function setAlertScreenText() {

        _nextLanguage = _nextUserData[0].visitor_personal_information.language.code;

        var txt = useGrep($apptranslations, 'identifier', 'general_scan_again');
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


}

function onTooLateTryAgain() {
    $stopScreen.find('#confirm').off('click').on('click', onConfirmStopHandler);
    $stopScreen.find('#cancel').off('click').on('click', onCancelStopHandler);

    setAlertScreenText();
    function setAlertScreenText() {
        _nextLanguage = _nextUserData.lang;
        var text = useGrep($apptranslations, 'identifier', 'general_too_late')['value' + _language].toUpperCase();

        $stopScreen.find('.text').html(text);
        $stopScreen.removeClass('hidden');
    }

    function onConfirmStopHandler() {
        console.log('OnTooLateTryAgain() opnieuw');
    }

    function onCancelStopHandler() {
        $stopScreen.addClass('hidden');
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

function onGameOver() {
    _isLoggedIn = false;

    $('.page').not('.screensaver').addClass('hidden');
    $('.hide').addClass('hidden');
    $('.menu').addClass('hidden');
    stopGlobalTimeOut();

    startScreenSaver();

    totalReset();
}
function totalReset() {
    location.reload();
}

function useGrep(arr, identifier, id) {
    var item = $.grep(arr, function(e) {
        return e[identifier] == id;
    });
    return item[0];
}


