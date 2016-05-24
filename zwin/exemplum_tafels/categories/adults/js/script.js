/**
 * Created by dries.delange on 7/01/2016.
 */

var arrFrappantTranslations = [];
var arrIDFicheTranslations = [];
arrFrappantTranslations.frapNL = "Fenomenaal!";
arrFrappantTranslations.frapFR = "Incroyable!";
arrFrappantTranslations.frapEN = "Amazing!";
arrFrappantTranslations.frapDE = "Fabelhaft!";
arrIDFicheTranslations.idNL = "ID";
arrIDFicheTranslations.idFR = "Carte ID";
arrIDFicheTranslations.idEN = "ID";
arrIDFicheTranslations.idDE = "ID-Karte";

function startAdult() {

    var NL = {
        'zomer': "Zomergast",
        'winter': "Wintergast",
        'jaar': "Het hele jaar",
        'grootte': "Grootte:",
        'gewicht': "Gewicht:",
        'spanwijdte': "Spanwijdte:",
        'aanwezig': 'Aanwezig in het Zwin'
    };
    var FR = {
        'zomer': "Estivant",
        'winter': "Hivernant",
        'jaar': "Toute l'année",
        'grootte': "Poids:",
        'gewicht': "Taille:",
        'spanwijdte': "Envergure:",
        'aanwezig': 'Présence au Zwin'
    };
    var DE = {
        'zomer': "Sommergast",
        'winter': "Wintergast",
        'jaar': "Ganzjährig",
        'grootte': "Größe:",
        'gewicht': "Gewicht:",
        'spanwijdte': "Spannweite:",
        'aanwezig': "Anwesenheit im Zwin"
    };
    var EN = {
        'zomer': "Summer visitor",
        'winter': "Winter visitor",
        'jaar': "All year round",
        'grootte': "Body length:",
        'gewicht': "Weight:",
        'spanwijdte': "Wingspan:",
        'aanwezig': "Presence in the Zwin"
    };

    var _hardTranslations = {'NL': NL, 'FR': FR, 'DE': DE, 'EN': EN};

    var arrAdultQuestions = [];
    var arrAdultImages = [];
    var arrAdultBirdImages = [];
    var arrAdultFrappants = [];

    var selectedBirdID = _userData[1].bird_id;
    var frappant;

    var imageState = 0;
    var $arrowLeft = $adultsScreen.find('.arrowLeft');
    var $arrowRight = $adultsScreen.find('.arrowRight');

    setAdultData();
    function setAdultData() {

        createQuestions();
        function createQuestions() {
            $adultsScreen.find('.questionMenu').empty();
            var html = "";

            arrAdultQuestions = $adultData.adult_exemplum_texts;
            arrAdultFrappants = $adultData.adult_exemplum_frappants;

            $.each(arrAdultQuestions, function (key, value) {
                if (value.bird_id == _birdID) {
                    html += '<div class="menuItem" id="adultQuestion' + value.id + '">';
                    html += '<div class="button pressable"><div></div></div>';
                    var txt = value['name' + _language];
                    var num = 59;
                    if (txt.indexOf("<span class='nouppercase'>&#223;</span>") > -1) {
                        var count = (txt.match(/<span class='nouppercase'>&#223;<\/span>/g) || []).length;
                        num += (39 * count);
                    }
                    if (txt.length <= num) {
                        txt = txt + '<br /><span class="hide">...</span>';
                    }
                    html += '<div class="text">' + txt + '</div>';
                    html += '</div>';
                }

                $adultsScreen.find('.questionMenu').html(html);
            });

            addFrappant(_birdID);

            setFirstQuestion();
            function setFirstQuestion() {

                var bird = {};
                $.each($introData, function (key, value) {
                    if (value.bird_id == _birdID) {
                        bird = value;
                    }
                    if ($introData.length == key + 1) {
                        $adultsScreen.find('.title').html('<span>' + bird['text_adult' + _language] + '</span>');
                    }
                });

                $('.menuItem:first-child').addClass('active');
                $('.questionMenu').find('.menuItem').off().on('click', onQuestionSelect);
                showAnswerAdultQuestion($('.menuItem:first-child')[0].id);
            }
        }

        initImageSlider();
        function initImageSlider() {
            arrAdultImages = $adultData.adult_exemplum_images;
            $.each(arrAdultImages, function (key, value) {
                if (value.bird_id == _birdID) {
                    arrAdultBirdImages.push(value);
                }
                if (arrAdultImages.length == key + 1) {
                    showBirdImages(arrAdultBirdImages);
                }
            });
        }

        setBirdMenu();
        function setBirdMenu() {
            $menu.find('.idKaartButtonWrapper .text').html(arrIDFicheTranslations['id' + _language]);
            $("#adultBird" + _birdID).prependTo(".adultBirdMenu").removeClass('greyed').addClass('selected');
        }
    }

    showScreen();
    function showScreen() {
        $introScreen.addClass('hidden');
        $adultsScreen.removeClass('hidden');
        $('.idKaartButtonWrapper').removeClass('hidden');
        $('.adultBirdMenu').removeClass('hidden');

        $('.adultBirdMenu').find('.item').on('click', onBirdSelect);
        $('.idKaartButtonWrapper').on('click', onIDCardClick);
    }

    function onBirdSelect(event) {
        $('.adultBirdMenu').find('.item').off();
        $('.adultBirdMenu').find('.item').addClass('greyed').removeClass('selected');
        $adultsScreen.find('.fiche').addClass('hidden');
        $(event.target).removeClass('greyed').addClass('selected');

        selectedBirdID = event.target.id.replace('adultBird', "");

        setTitle(selectedBirdID);
        function setTitle(id) {
            var bird = {};
            $.each($introData, function (key, value) {
                if (value.bird_id == id) {
                    bird = value;
                }
                if ($introData.length == key + 1) {
                    $adultsScreen.find('.title').html('<span>' + bird['text_adult' + _language] + '</span>');
                }
            });
        }

        moveItem(event.target);
        function moveItem(item) {
            var listWidth = $('.adultBirdMenu').innerWidth();
            var elemLeft = $(item).position();
            var moveLeft = listWidth - (listWidth - elemLeft.left);
            var liHtml = $(item).outerHTML();

            $(".item").each(function () {
                if ($(this).attr("id") == item.id) {
                    return false;
                }
                $(this).animate({"left": '+=' + 102}, 1000);
            });

            $(item).animate({"left": '-=' + moveLeft}, 1000, function () {
                item.remove();
                var oldHtml = $(".adultBirdMenu").html();
                $(".adultBirdMenu").html(liHtml + oldHtml);
                $(".item").attr("style", "");
                $('.adultBirdMenu').find('.item').off().on('click', onBirdSelect);
            });
        }

        getImages();
        function getImages() {
            arrAdultBirdImages = [];
            $.each(arrAdultImages, function (key, value) {
                if (value.bird_id == selectedBirdID) {
                    arrAdultBirdImages.push(value);
                }
                if (arrAdultImages.length == key + 1) {
                    showBirdImages(arrAdultBirdImages);
                }
            });
        }

        getQuestions();
        function getQuestions() {
            var html = '';
            $.each(arrAdultQuestions, function (key, value) {
                if (value.bird_id == selectedBirdID) {
                    html += '<div class="menuItem" id="adultQuestion' + value.id + '">';
                    html += '<div class="button pressable"><div></div></div>';
                    var txt = value['name' + _language];
                    var num = 59;
                    if (txt.indexOf("<span class='nouppercase'>&#223;</span>") > -1) {
                        var count = (txt.match(/<span class='nouppercase'>&#223;<\/span>/g) || []).length;
                        num += (39 * count);
                    }
                    if (txt.length <= num) {
                        txt = txt + '<br /><span class="hide">...</span>';
                    }
                    html += '<div class="text">' + txt + '</div>';
                    html += '</div>';
                }
                if (arrAdultQuestions.length == key + 1) {
                    $adultsScreen.find('.questionMenu').html(html);

                    addFrappant(selectedBirdID);
                    setFirstQuestion();
                    function setFirstQuestion() {
                        $('.menuItem:first-child').addClass('active');
                        $('.questionMenu').find('.menuItem').off().on('click', onQuestionSelect);
                        showAnswerAdultQuestion($('.menuItem:first-child')[0].id);
                    }
                }
            });
        }
    }

    function addFrappant(id) {
        frappant = null;
        $.each(arrAdultFrappants, function (key, value) {
            if (value.bird_id == id) {
                frappant = value;
            }
            if (arrAdultFrappants.length == key + 1) {
                var html = "";
                if (frappant) {
                    html = '<div class="menuItem" id="adultQuestion' + "X" + '">';
                    html += '<div class="button pressable"><div></div></div>';
                    var txt = arrFrappantTranslations['frap' + _language];
                    if (txt.length <= 59) {
                        txt = txt + '<br /><span class="hide">...</span>';
                    }
                    html += '<div class="text">' + txt + '</div>';
                    html += '</div>';
                }

                $adultsScreen.find('.questionMenu').append(html);
                setHeightAnswer();
            }
        });
    }

    function onQuestionSelect(event) {

        $('.menuItem').removeClass('active');
        $(event.target).addClass('active');

        showAnswerAdultQuestion(event.target.id);
    }

    function showAnswerAdultQuestion(id) {
        id = id.replace('adultQuestion', '');

        if (id == 'X') {
            if (frappant) {
                if (frappant['text' + _language] != null) {
                    $('.answerText').find('.text').html(frappant['text' + _language]);
                }
            } else {
                $('.answerText').find('.text').html(" ");
            }
        } else {
            $.each(arrAdultQuestions, function (key, value) {
                if (value.id == id) {
                    //console.log(value, value['text' + _language]);
                    $('.answerText').find('.text').html(value['text' + _language]);
                }
            });
        }
    }

    function showBirdImages(arrImages) {
        imageState = 0;
        $('.imageContainer').empty();
        $('.counter').empty();

        var htmlString = '';
        var counterHtml = '';

        for (var i = 0; i < arrImages.length; i++) {
            var item = arrImages[i];
            htmlString += '<div class="image" id="image' + i + '" x-order="' + i + '" style="background-image:url(' + item.image + ')"></div>';
            counterHtml += '<div class="tick" countervalue="' + i + '" id="counter' + i + '"></div>';
        }
        $('.imageContainer').html(htmlString);
        $('.imageSlider .counter').remove();
        $('.imageSlider').append('<div class="counter">' + counterHtml + '</div>');
        if (arrImages.length <= 1) {
            $('.counter').html(' ');
        }

        setCounter();
        addCounterClick(arrImages);
    }

    function setCounter() {
        $('.tick').removeClass('selected');
        $('#counter' + imageState + '').addClass('selected');
        $('.image').each(function (key, value) {
            if ($(value).attr('x-order') < imageState) $(value).removeClass('right').addClass('left');
            if ($(value).attr('x-order') > imageState) $(value).removeClass('left').addClass('right');
            if ($(value).attr('x-order') == imageState) $(value).removeClass('left right');
        });
        if (imageState == 0) {
            if (arrAdultBirdImages.length <= 1) {
                $arrowLeft.hide();
                $arrowRight.hide();
            } else {
                $arrowLeft.hide();
                $arrowRight.show();
            }
        } else if (imageState == arrAdultBirdImages.length - 1) {
            $arrowRight.hide();
            $arrowLeft.show();
        } else if (imageState > 0 || imageState < arrAdultBirdImages.length - 1) {
            $arrowRight.show();
            $arrowLeft.show();
        }
    }

    function addCounterClick(images) {
        var tick = $('.tick');
        var image = $('.imageSlider');
        image.off('swipeleft').on('swipeleft', imageSwipedLeft);
        image.off('swiperight').on('swiperight', imageSwipedRight);
        $arrowLeft.off().on('click', imageSwipedRight);
        $arrowRight.off().on('click', imageSwipedLeft);

        function imageSwipedRight(event) {
            if (imageState == 0) return;
            imageState--;
            setCounter();
        }

        function imageSwipedLeft(event) {
            if (imageState == images.length - 1) return;
            imageState++;
            setCounter();
        }
    }

    function setHeightAnswer() {
        var numElem = $(".questionMenu > div").length;
        var h = 850 - 80 - 15 - (numElem * 80);
        $('.answerText').css('height', h + 'px');
        $('.answerText .text').css('height', h + 'px');
    }

    function onIDCardClick() {

        var birdObj = $birds[selectedBirdID - 1];

        console.log(birdObj);

        loadIDContent();
        function loadIDContent() {

            var content = $('.content');
            $('.idKaartTitle .text').html(birdObj['name' + _language] + ' <span class="latin">' + birdObj['name_science'] + '</span>');

            //TERUG NAVIGEREN TEKST
            //$('.idKaartButtonWrapper .text').html(useGrep($apptranslations, "identifier", "general_back" + _language));

            var stukken = birdObj.video.split("/");
            var videoUrl = stukken[3] + '/' + stukken[4] + '/' + stukken[5];
            //videoUrl = "uploads/videos/test.webm";

            $('.adults .fiche .content .contentLinks .video')[0].src = videoUrl;
            $('.adults .fiche .content .contentLinks .video')[0].play();
            stopGlobalTimeOut();

            $('.adults .fiche .content .contentLinks .video')[0].addEventListener("ended", function(){
               resetGlobalTimeOut();
            });

            var stats = $('.adults .fiche .content .contentLinks .stats');
            $(stats).find('.gewicht .statsTitle').html(_hardTranslations[_language].gewicht);
            $(stats).find('.grootte .statsTitle').html(_hardTranslations[_language].grootte);
            $(stats).find('.spanwijdte .statsTitle').html(_hardTranslations[_language].spanwijdte);
            $(stats).find('.gewicht .man .value').html(birdObj['weight_male' + _language]);
            $(stats).find('.gewicht .vrouw .value').html(birdObj['weight_female' + _language]);
            $(stats).find('.grootte .value').html(birdObj['length' + _language]);
            $(stats).find('.spanwijdte .value').html(birdObj['span' + _language]);

            $('.adults .fiche .content .contentLinks .beschermingsStatus p').html(birdObj['status' + _language]);

            var aanwezig = $('.adults .fiche .content .contentRechts');

            var kaartImgUrl = "assets/img/ID-KAART/idkaart_" + birdObj["nameNL"] + ".jpg";
            var aanwezigImgUrl = "assets/img/aanwezigInZwin/aanwezigheid_" + birdObj["nameNL"] + ".jpg";

            $(aanwezig).find('.kaart').css({'background-image': 'url(' + kaartImgUrl + ')'});
            $(aanwezig).find('.aanwezigImg').css({'background-image': 'url(' + aanwezigImgUrl + ')'});
            $(aanwezig).find('.broed .value').html(_hardTranslations[_language].zomer);
            $(aanwezig).find('.winter .value').html(_hardTranslations[_language].winter);
            $(aanwezig).find('.jaar .value').html(_hardTranslations[_language].jaar);
            $(aanwezig).find('.aanwezigInZwin .value').html(_hardTranslations[_language].aanwezig);
        }


        showIDCardScreen();
        function showIDCardScreen() {
            if ($adultsScreen.find('.fiche').hasClass('hidden')) {
                $adultsScreen.find('.fiche').removeClass('hidden');
                $('.idKaartTitle').removeClass('hidden');
                $('.adultBirdMenu').addClass('hidden');
            } else {
                $adultsScreen.find('.fiche').addClass('hidden');
                $menu.find('.idKaartButtonWrapper .text').html(arrIDFicheTranslations['id' + _language]);
                $('.idKaartTitle .text').html('');
                $('.adultBirdMenu').removeClass('hidden');
                $('.adults .fiche .content .contentLinks .video')[0].load();
            }
        }
    }
}

(function ($) {
    $.fn.outerHTML = function () {
        return $(this).clone().wrap('<div></div>').parent().html();
    }
})(jQuery);