/**
 * Created by arno.chauveau on 3/16/2016.
 */

(function topicSelector() {

    var topicSelector = $('#topicSelector');
    var amountOfSlides;
    var index = 1;
    var currentUrl = "";
    var currentObj;
    var items;
    var borderColor = "#ffffff";
    var kleinKleur = "";
    var titleColor = "";
    var coeff = 1;
    var oldCoeff = 0;
    var leftSwiped = false;
    var name;
    var extras = [];


    var barcoApi = require('../BarcoAPI/barcoApi.js');
    var navCircles = require('../navCircles.js');
    var screenSaver = require('../screensaver.js');


    function addTopics(filtered) {

        var htmlData = '';
        var position = 1;

        for (var i = 0; i < filtered.length; i++) {


            if(filtered[i] !== undefined){

                var topicId = filtered[i].GUID;
                var values = filtered[i].MetadataJson.Items;

                var BackgroundColor, BorderColor, Description, DescriptionColor,
                    ExtendedDescription, Priority, Size, Title, TitleColor;

                $.each(values, function (index, value) {

                    switch (value.MDKeyLabel) {
                        case "BackgroundColor":
                            BackgroundColor = value.MDKeyValue;
                            if (BackgroundColor === "") BackgroundColor = "#ffffff";
                            break;
                        case "BorderColor":
                            BorderColor = value.MDKeyValue;
                            if (value.MDKeyValue === "") BorderColor = "#000000";
                            break;
                        case "Description":
                            Description = value.MDKeyValue;
                            break;
                        case "DescriptionColor":
                            DescriptionColor = value.MDKeyValue;
                            if (DescriptionColor === "") DescriptionColor = "#000000";
                            break;
                        case "ExtendedDescription":
                            ExtendedDescription = value.MDKeyValue;
                            break;
                        case "Priority":
                            Priority = value.MDKeyValue;
                            break;
                        case "Size":
                            Size = value.MDKeyValue;
                            break;
                        case "Title":
                            Title = value.MDKeyValue;
                            break;
                        case "TitleColor":
                            TitleColor = value.MDKeyValue;
                            break;
                    }

                });

                htmlData += '<div id="topic' + i + '" class="topicContainer__topic position_' + position
                    + '" style="background-image: url(https://rna.barco.com/XManagerWeb/Xynco/handlers/assets.ashx?method=getasset&assetid=' + topicId + ');">'
                    + '<div class="circle_bottom"></div>' +
                    '<div class="topicContainer__topic__summary">' + Description + '</div>' +
                    '<div class="topicContainer__topic__title">' + Title + '</div>' +
                    '<div class="topicContainer__topic__text">' + ExtendedDescription + '</div>' +
                    '<div class="topicContainer__topic__choices hidden">' +
                    '<div class="topicContainer__topic__choice topicContainer__topic__choices__share hidden">SHARE</div>' +
                    '<div class="topicContainer__topic__choice topicContainer__topic__choices__close hidden">CLOSE</div>' +
                    '</div>' +
                    '</div>';

                position++;
                if (position == 4)position = 1;


                fillInColors(BackgroundColor, BorderColor, TitleColor, DescriptionColor, i);
            }
            topicSelector.find('.topicContainer').html(htmlData);
        }

    }

    function fillInColors(bg, brd, title, desc, i) {

        if (bg === "") bg = "#ffffff";
        if (brd === "") brd = "#ffffff";
        if (title === "") title = "#ffffff";
        if (desc === "") desc = "#000000";

        var topic = "#topic" + i;

        var rgb = convertHex(bg);

        setTimeout(function () {

            $(topic).css({
                'border': '3px solid ' + brd + ' '
            });

            $(topic).find('.topicContainer__topic__title').css({
                'color': title
            });

            $(topic).find('.topicContainer__topic__summary').css({
                'color': desc
            });

            $(topic).find('.circle_bottom').css({
                'background': '-webkit-linear-gradient(top, ' + rgb + ', 0) 25%, ' + rgb + ', 0) 75%, ' + rgb + ', 1) 75%, ' + rgb + ', 1) 100%)'
            });
        }, 500);
    }

    function convertHex(hex) {

        hex = hex.replace('#', '');

        var r = parseInt(hex.substring(0, 2), 16);

        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);

        return 'rgba(' + r + ',' + g + ',' + b;
    }

    function convertRGB(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function start() {

        enableDisableArrows();
        topicSelector.find('.topicContainer__topic').one('click', activateTopic);

        topicSelector.on('swipeleft', onRightArrowClicked);
        topicSelector.on('swiperight', onLeftArrowClicked);

        topicSelector.find('.page__arrow_left').on('click', onLeftArrowClicked);
        topicSelector.find('.page__arrow_right').on('click', onRightArrowClicked);

        topicSelector.find('.topicContainer').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function (e) {
                topicSelector.find('.topicContainer__topic').one('click', activateTopic);

            });

    }

    function onRightArrowClicked() {
        topicSelector.find('.topicContainer__topic').off();
        if (index == amountOfSlides)return;
        index++;
        leftSwiped = true;
        setSlider(index);
        enableDisableArrows();
        navCircles.updateIndex(index - 1);
        screenSaver.updateTimer(false, "rightarrowclicked");

    }

    function onLeftArrowClicked() {
        topicSelector.find('.topicContainer__topic').off();
        if (index == 1)return;
        index--;
        leftSwiped = false;
        setSlider(index);
        enableDisableArrows();
        navCircles.updateIndex(index - 1);
        screenSaver.updateTimer(false, "leftarrowclicked");
    }

    function enableDisableArrows() {
        topicSelector.find('.page__arrow').removeClass('inactive');

        if (index == amountOfSlides) {
            topicSelector.find('.page__arrow_right').addClass('inactive');
        }
        if (index == 1) {
            topicSelector.find('.page__arrow_left').addClass('inactive');
        }
    }


    function setSlider(index) {
        topicSelector.find('.topicContainer').css('margin-left', getLeftMargin(index) + 'px');

        function getLeftMargin(index) {

            if (index == 1) {
                coeff = 1;
                return 70;
            } else {

                var page = index - 1;
                var margin = 70;

                if (leftSwiped) {
                    coeff += index;
                } else {
                    coeff = oldCoeff - 2;
                }

                var total = ((page * 1920) - (margin * coeff));

                return '-' + total;
            }

        }

        if (leftSwiped) {
            oldCoeff = coeff;
            coeff = index;

        } else {
            oldCoeff = coeff;
            coeff -= index - 1;
        }
    }

    function enableDisableSliding(current) {
        if (current !== "") {
            topicSelector.off('swipeleft');
            topicSelector.off('swiperight');
        } else {
            topicSelector.on('swipeleft', onRightArrowClicked);
            topicSelector.on('swiperight', onLeftArrowClicked);
        }
    }

    function activateTopic() {

        screenSaver.updateTimer(false, "activateTopic");
        $('.navCircles').addClass('hidden');
        $('.closeButton').addClass('hidden');
        $('.backButton').removeClass('hidden').addClass('fadeInBackground');
        $('.backImg').removeClass('hidden').addClass('slideInBackButton');

        $('.shareToTotem').removeClass('hidden').addClass('fadeInBackground');
        $('.shareImg').removeClass('hidden').addClass('slideInShareButton');

        setTimeout(function () {
            $('.backImg').css({'left': '125px', 'opacity': 1});
            $('.shareImg').css({'left': '1650px', 'opacity': 1});
            $('.backButton').css({'opacity': 0.35});
            $('.shareToTotem').css({'opacity': 0.35});
            $('.blockBackButton').addClass('hidden');
        }, 3000);

        $('.topicContainer__topic__summary').addClass('hidden');
        $('.topicContainer__topic .circle_bottom').addClass('hidden');


        currentObj = this;

        if(currentObj.style.borderColor !== "initial" || !currentObj.style.borderColor.contains("NaN")){
            borderColor = currentObj.style.borderColor;
        }


        if($(currentObj).find('.topicContainer__topic__title').css('color') !== "rgb(255, 255, 255)"){
            titleColor = $(currentObj).find('.topicContainer__topic__title').css('color');
        }


        var rgb = borderColor.substring(4, borderColor.length - 1)
            .replace(/ /g, '')
            .split(',');

        $(currentObj).find('.topicContainer__topic__title').css({'color': 'rgb(255, 255, 255)'});

        borderColor = convertRGB(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));


        if(currentObj.style.backgroundImage.indexOf('circle_big')<0){
            currentUrl = currentObj.style.backgroundImage;
        }

        kleinKleur = borderColor;
        loadThumbnails(currentUrl, kleinKleur);

        setTimeout(function () {
            $('.topicContainer__topic__text').animate({
                'opacity': 1
            }, 1000);
        }, 500);


        currentObj.style.border = "none";
        currentObj.style.backgroundImage = "url('./assets/img/circle_big.png')";

        topicSelector.find('.sharedNotification').removeClass('active');
        var id = $(this).attr('id');
        topicSelector.find('.topicContainer__topic').off('click');
        $(this).addClass('topicContainer__topic_active');
        topicSelector.find('.page__arrow').addClass('inactive');
        topicSelector.find('.topicContainer__topic').not('.topicContainer__topic_active').addClass('topicContainer__topic_inactive');
        if ($('.topicContainer__topic_active').hasClass('shared'))return;

        enableDisableSliding(currentObj);
        getItemName(currentObj);
        showThumbnails(true);
    }

    function showThumbnails(show) {
        var small = $('.smallThumbnail'), big = $('.bigThumbnail');

        if (show) {
            small.removeClass('hidden').addClass('fadeInThumbnails');
            big.removeClass('hidden').addClass('fadeInThumbnails');

            setTimeout(function () {
                small.css({
                    'opacity': 1
                });
                big.css({
                    'opacity': 1
                });
            }, 2500);

        } else {
            small.addClass('hidden').removeClass('fadeInThumbnails');
            big.addClass('hidden').removeClass('fadeInThumbnails');

            setTimeout(function () {
                small.css({
                    'opacity': 0
                });
                big.css({
                    'opacity': 0
                });
            }, 500);
        }
    }

    function loadThumbnails(curUrl, brdColor) {

        var smallImg = curUrl, bigImg = "url(https://rna.barco.com/XManagerWeb/Xynco/handlers/assets.ashx?method=getasset&assetid=";
        var small = $('.smallThumbnail'), big = $('.bigThumbnail');

        var originalImgGUID = smallImg.split('id=')[1].slice(0, -2);

        $.each(extras, function (i, thumbNail) {

            var thumbNailName = thumbNail.Name.split('_')[0];

            $.each(items, function (j, item) {

                if(item !== undefined){
                    if (thumbNailName === item.Name.split('_')[0]) {

                        if (item.GUID === originalImgGUID) {
                            bigImg += thumbNail.GUID;

                            big.css({
                                'background-image': bigImg,
                                'border': '2px solid ' + brdColor + ' '
                            });
                            bigImg = "url(https://rna.barco.com/XManagerWeb/Xynco/handlers/assets.ashx?method=getasset&assetid=";
                        }
                    }
                }


            });
        });

        small.css({
            'background-image': smallImg,
            'border': '2px solid ' + brdColor + ' '
        });
        borderColor = brdColor;
        currentUrl = smallImg;
    }

    function getItemName(currentObj) {
        var selector = "#" + currentObj.getAttribute("id");
        name = $(selector).find('.topicContainer__topic__title')[0].innerHTML;
    }

    function closeTopic() {


        $(currentObj).find('.topicContainer__topic__title').css({
            'color': titleColor
        });

        titleColor = "";

        screenSaver.updateTimer(false, "closetopic");
        $('.bigThumbnail').css({
            'background-image': 'none',
            'border': 'none'
        });

        $('.blockBackButton').removeClass('hidden');
        $('.closeButton').removeClass('hidden');
        $('.backButton').addClass('hidden').removeClass('fadeInBackground');
        $('.backImg').addClass('hidden').removeClass('slideInBackButton');
        $('.shareToTotem').addClass('hidden').removeClass('fadeInBackground');
        $('.shareImg').addClass('hidden').removeClass('slideInShareButton').one('click', sendToTotem);

        setTimeout(function () {
            $('.backImg').css({'left': '-125px', 'opacity': 0});
            $('.shareImg').css({'left': '1920px', 'opacity': 0});
            $('.backButton').css({'opacity': 0});
            $('.shareToTotem').css({'opacity': 0});
        }, 100);

        $('.topicContainer__topic__summary').removeClass('hidden');
        $('.topicContainer__topic .circle_bottom').removeClass('hidden');

        $('.topicContainer__topic__text').css({
            'opacity': 0
        });

        topicSelector.find('.topicContainer__topic').removeClass('topicContainer__topic_inactive').removeClass('topicContainer__topic_active');
        topicSelector.find('.page__arrow').removeClass('inactive');
        enableDisableArrows();
        setTimeout(function () {
            topicSelector.find('.topicContainer__topic').off('click').one('click', activateTopic);
            topicSelector.find('.page__circleContainer').html('');
        }, 1000);

        borderColor = kleinKleur;

        if(currentUrl.indexOf('circle_big.png') < 0){
            currentObj.style.backgroundImage = currentUrl;

        }

        currentObj.style.border = "3px solid " + borderColor;
        currentObj = "";

        enableDisableSliding(currentObj);
        showThumbnails(false);
    }


    var sendToTotem = function () {
        screenSaver.updateTimer(false, "sendTototem");
        $.each(items, function (index, item) {

            if(item !== undefined){
                $.each(item.MetadataJson.Items, function (newIndex, newItem) {

                    if (newItem.MDKeyLabel === "Title") {

                        if (name === newItem.MDKeyValue) {
                            barcoApi.connectTotem(item);
                        }
                    }
                });
            }

        });

        $('.shareImg').css({
            'opacity': 0.25
        });
    };

    function filterItems(values) {

        var indexesToRemove = [];

        for (var i = 0; i < values.length; i++) {

            var items = values[i].MetadataJson.Items;
            var strikeOne = false;
            var strikeTwo = false;
            var strikeThree = false;

            $.each(items, function (index, item) {

                switch (item.MDKeyLabel) {

                    case "Description":
                        if (item.MDKeyValue === "") {
                            strikeOne = true;
                        }
                        break;

                    case "ExtendedDescription":
                        if (item.MDKeyValue === "") {
                            strikeTwo = true;
                        }
                        break;

                    case "Title":
                        if (item.MDKeyValue === "") {
                            strikeThree = true;
                        }
                        break;
                }
            });

            if(strikeOne && strikeTwo && strikeThree){
                indexesToRemove.push(i);
            }
        }


        for(var j = 0; j < indexesToRemove.length; j++){
            delete values[indexesToRemove[j]];
        }
        return values;
    }

    var closeSelected = function () {
        closeTopic();
    };

    var showData = function (data, extra) {
        items = data;
        extras = extra;


        var filtered = filterItems(items);
        filtered.reverse();


        var i = 0;

        for( var item in filtered){
            console.log(item);
            i++;
        }

        amountOfSlides = Math.ceil(i / 3);

        console.log(i);

        navCircles.makeCircles(amountOfSlides);
        addTopics(filtered);
    };


    module.exports.start = start;
    module.exports.closeSelected = closeSelected;
    module.exports.showData = showData;
    module.exports.sendToTotem = sendToTotem;

})();