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