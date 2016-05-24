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