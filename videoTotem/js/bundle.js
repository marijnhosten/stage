(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function barcoApi() {

    var topicSelector = require('../exploreBarco/topicSelector.js');
    var onecampustotemclient = null, _assets = [], _extra = [];

    var start = function () {

        $.getScript('https://rna.barco.com:55522/clients/8b11cc54-4fbb-4da1-897a-813e9e767cc5/barco.onecampustotem.client.js').done(function () {
            onecampustotemclient = new x2o.Epoxy.oneCampusTotem.Client(new x2o.Epoxy());
            onecampustotemclient.connect('https://rna.barco.com:55522').done(function () {
            });

        });

        $.when(updateAssets()).then(function () {
            topicSelector.showData(_assets, _extra);
        });

        function updateAssets() {
            //https://rna.barco.com/XManagerWeb/Xynco/handlers/assets.ashx?method=selectmd&nid=101
            //./js/BarcoAPI/barcoData.json
            var done = $.Deferred();
            $.getJSON('/XManagerWeb/Xynco/handlers/assets.ashx?method=selectmd&nid=101')
                .done(function (assets) {
                    filter(assets);
                    done.resolve();
                })
                .fail(function () {
                    console.log('Failed to retrieve assets info');
                    done.reject();
                });
            return done.promise();
        }

        function filter(assets) {

            assets.forEach(function (item, index) {

                if ((item.Type === 'Image' || item.Type === 'Video') && item.Category.toLowerCase() === 'items'
                    && item.Name.toLowerCase().endsWith('_tn') &&
                    new Date(item.GoLive) <= new Date() && new Date(item.Expire) >= new Date()
                    && item.Status === 'Approved') {
                    _assets.push(item);

                } else if ((item.Type === 'Image' || item.Type === 'Video') && item.Name.toLowerCase().endsWith('_1')
                    && new Date(item.GoLive) <= new Date() && new Date(item.Expire) >= new Date() && item.Status === 'Approved') {
                    _extra.push(item);
                }
            });
        }

    };


    var connectTotem = function (jsonItem) {
        onecampustotemclient.showAsset(jsonItem);
    };


    module.exports.start = start;
    module.exports.connectTotem = connectTotem;
})();


},{"../exploreBarco/topicSelector.js":4}],2:[function(require,module,exports){
require('./screensaver');

var menu = require('./menu');
var exploreBarco = require('./exploreBarco/exploreBarco');
var registration = require('./registration/registration');
var barcoApi = require('./BarcoAPI/barcoApi.js');
var navCircles = require('./navCircles.js');

menu.on('exploreBarcoClicked', onExploreBarcoClicked);
menu.on('registrationClicked', onregistrationClicked);

$('#screensaver').on('click', onExploreBarcoClicked);

barcoApi.start();



function onExploreBarcoClicked() {
    $("#screensaver").addClass('page_hidden');
    showName();
    exploreBarco.start();
}
function onregistrationClicked() {
    showName();
    registration.start();
    registration.on('finished', registration.finish);
}

function showName() {
    $('.nameContainer').removeClass('hidden');
}

},{"./BarcoAPI/barcoApi.js":1,"./exploreBarco/exploreBarco":3,"./menu":5,"./navCircles.js":6,"./registration/registration":7,"./screensaver":8}],3:[function(require,module,exports){
/**
 * Created by arno.chauveau on 3/16/2016.
 */
(function exploreBarco() {
    var topicSelector = require('./topicSelector');

    function start() {
        $('#exploreBarcoContainer').removeClass('container_hidden');
        topicSelector.start();
    }

    module.exports.start = start;

})();
},{"./topicSelector":4}],4:[function(require,module,exports){
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
        console.log(filtered);






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
},{"../BarcoAPI/barcoApi.js":1,"../navCircles.js":6,"../screensaver.js":8}],5:[function(require,module,exports){
/**
 * Created by arno.chauveau on 3/16/2016.
 */
(function menu(){

    var EventEmmiter = require('events');
    module.exports = new EventEmmiter();

    var menu = $('#menu');

    attachClickEvents();

    function attachClickEvents() {
        //menu.find('#explore_barco').on('click', onExploreBarcoClicked);
        menu.find('#registration').on('click', onRegistrationClicked);
    }
    function detachClickEvents() {
        menu.find('#explore_barco').off('click');
        menu.find('#registration').off('click');
    }

    function onExploreBarcoClicked() {
        module.exports.emit('exploreBarcoClicked');
        hideMenu();
    }
    function onRegistrationClicked() {
        module.exports.emit('registrationClicked');
        hideMenu();
    }
    function hideMenu(){
        menu.addClass('page_hidden');
    }
    function showMenu(){
        $('.container').addClass('container_hidden');
        detachClickEvents();
        menu.removeClass('page_hidden');
        menu.find('#registration').addClass('out');
        attachClickEvents();

    }
    module.exports.showMenu = showMenu;
})();
},{"events":9}],6:[function(require,module,exports){
(function navCircles(){

    var topicSelector = $('#topicSelector');
    var index = 0;

    function makeCircles(amount){

        var container = $('.navCircles');

        $('.backImg').on('click', function(){
            setTimeout(function(){
                container.removeClass('hidden');
            }, 1500);

        });

        topicSelector.find('.page__arrow_left').on('click', onLeftArrowClicked);
        topicSelector.find('.page__arrow_right').on('click', onRightArrowClicked);

        function onRightArrowClicked() {
            if(index < amount){
                index++;
            }

            updateCurrentSlide(index);
        }

        function onLeftArrowClicked() {
            if(index > 0){
                index--;
            }

            updateCurrentSlide(index);
        }

        var html = "";

        for(var i = 0; i < amount; i++){
            html += "<div class='progressCircle'></div>";
        }


        container.append(html);

        updateCurrentSlide(0);
    }

    function updateCurrentSlide(i){


        var circles = $('.progressCircle');


        $.each(circles, function(index, value){
            $(value).removeClass('fullColor');
        });



        $(circles[i]).addClass('fullColor');


    }

    function updateIndex(i){
        index = i;
        updateCurrentSlide(index);
    }


    module.exports.makeCircles = makeCircles;
    module.exports.updateIndex = updateIndex;

})();
},{}],7:[function(require,module,exports){
/**
 * Created by arno.chauveau on 3/17/2016.
 */
(function registration() {
    var EventEmitter = require('events');
    var exploreBarco = require('../exploreBarco/exploreBarco');
    module.exports = new EventEmitter();
    function start() {
        $('#registrationContainer').removeClass('container_hidden');
        $('#registrationDone').removeClass('page_hidden');
        $('.question-circle__answer__color').on('click',colorClicked);
        $('.question-circle__button').on('click',nextQuestion);

        function colorClicked(){
            $('.question-circle__answer__color').removeClass('selected');
            $(this).addClass('selected');
        }

        function nextQuestion() {
            $(this).parent().addClass('out');
            setTimeout(function(){
                $('.question-circle.out').remove();
            },600);
            if($(this).hasClass('finish')){
                module.exports.emit('finished');
            }

        }

    }
    function registrationFinished(  ){
        $('#registrationContainer').addClass('container_hidden');
        setTimeout(function(){
            $('#registrationDone').addClass('page_hidden');
            exploreBarco.start();
        },2000);
    }
    module.exports.start = start;
    module.exports.finish= registrationFinished;
})();
},{"../exploreBarco/exploreBarco":3,"events":9}],8:[function(require,module,exports){
/**
 * Created by arno.chauveau on 3/16/2016.
 */

(function screensaver() {

    var exploreBarco = require('./exploreBarco/exploreBarco.js');
    var topicSelector = require('./exploreBarco/topicSelector.js');
    var reset = true;
    $('#screensaver').on('click', onScreensaverClicked);

    $('.closeButton').on('click', onCloseButtonClicked);
    $('.backImg').on('click', onBackButtonClicked);
    $('.shareImg').on('click', onShareImgClicked);

    function onScreensaverClicked() {
        $(this).addClass('page_hidden');
        $('.closeButton').removeClass('hidden');
        $('.navCircles').removeClass('hidden');

        startTimer();

        exploreBarco.start();
    }

    function onCloseButtonClicked() {
        location.reload();
    }

    function onBackButtonClicked() {
        topicSelector.closeSelected();
    }

    function onShareImgClicked() {
        topicSelector.sendToTotem();
        $('.shareImg').off();
    }

    function startTimer() {

        var interval = setInterval(function(){
            if(reset === false){
                reset = true;

            }else if(reset === true){
                clearInterval(interval);
                onCloseButtonClicked();
            }
        }, 60000);
    }

    function updateTimer(bool, mess){
        reset = bool;
    }

    module.exports.updateTimer = updateTimer;

})();
},{"./exploreBarco/exploreBarco.js":3,"./exploreBarco/topicSelector.js":4}],9:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[2]);
