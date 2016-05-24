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