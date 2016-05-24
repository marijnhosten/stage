/**
 * Created by dries.delange on 25/01/2016.
 */
var $accordionScreen = $('.accordionScreen');
var $subjectScreen = $('.subjectScreen');


function initChoiceScreen() {



    show();
    function show() {
        $subjectScreen.removeClass('hidden');
        $('.accordionScreen').addClass('hidden');
    }

    setButtons();
    function setButtons() {

        for (var i = 0; i < $accordeonData.length; i++) {
            var ob = $accordeonData[i];
            $('#subject' + i + '').find('.title').html(ob['name' + _language]);
            $('#subject' + i + '').find('.text').html(ob['text' + _language]);
            //$('#subject' + i + '').find('.image').css('background-image', 'url(' + ob.image + ')');
        }
    }

    addEvents();
    function addEvents() {
        $subjectScreen.find('.arrow').on('click', function (e) {

            initAccordeon(e.target.id);
            if (e.currentTarget.getAttribute('id').toString() == 0) {
                //initPanorama();
            } else {
                //initAccordeon(e.target.id);
            }
        });
    }
}

function initAccordeon(ID) {

    $('.backButtonWrapper').removeClass('hidden');
    $('.stopButtonWrapper').addClass('hidden');
    $('.backButtonWrapper').on('click', function(){
        initChoiceScreen();
        $(this).addClass('hidden');
        $('.stopButtonWrapper').removeClass('hidden');
        $menu.find('.title').html(' ');
    });


    $menu.find('.title').html($multitheme.exploratorium_multithemes_categories[ID]['name' + _language]);
    $menu.find('.text').html(useGrep($apptranslations, 'identifier', 'label_stop')['value' + _language]);

    $menu.find('.back').off('click').on('click', onBackButtonEvent).removeClass('hidden');


    createAccordionSlides();
    function createAccordionSlides() {

        var arrSlides = $accordeonData[ID].exploratorium_multithemes_contents;

        var html = '';
        var num = 0;

        var startWidth = (100 / arrSlides.length) - 1.1;
        var activeWidth = (1800 - (arrSlides.length ) * 90);


        for (var i = 0; i < arrSlides.length; i++) {
            html += '<div style="width: ' + startWidth + '%" class="reason" data-id="' + i + '">';
            html += '<div class="container" id="container' + i + '">';
            html += '<div class="verticalTitle"><p>' + arrSlides[i]['name' + _language] + '</p></div>';
            html += '<div class="optionBtn btn' + i + '"></div>';
            html += '<div class="hidden pillarContent pillarContent' + i + '"></div>';

            var images = arrSlides[i].exploratorium_multithemes_images;

            for (var ii = 0; ii < images.length; ii++) {

                var image = images[ii].image + "";
                var fileExtension = image.split('.')[1];

                if (fileExtension == 'png' || fileExtension == 'jpg') {
                    html += '<div class="image" id="image' + num + '" x-order="' + num + '" style="background-image: url(' + images[ii].image + '); background-size: cover"></div>';
                }
            }

            html += '</div>';
            html += '</div>';

        }

        $accordionScreen.find('.accordionTitle').html($accordeonData[ID]['title' + _language]);
        $accordionScreen.find('.wrapper').html(html);

        $('.reason').click(resizePillars);
        $('.verticalTitle').on('click', resizePillars);

        function resizePillars(event) {

            var reason, container;
            var target = event.currentTarget;

            if(!event.currentTarget.getAttribute('data-id')){
                target = event.currentTarget.parentElement.parentElement;
            }
            showContent(target);

            reason = $('.reason');
            container = $('.container');

            reason.css({'background': 'none'});
            reason.addClass('closer');
            //container.css({'background-color': 'none'});


            for (var j = 0; j < arrSlides.length; j++) {
                reason[j].style.width = "5%";

            }

            target.style.width = activeWidth + 'px';

            $('.verticalTitle').addClass('rotateTitle');
            $('.rotateTitle').removeClass('.verticalTitle');
            $('.optionBtn').addClass('hidden');
            container.find('.image').addClass('imageHidden');

            makeImageSlider(target);
            $('.accordionScreen .accordeon .wrapper .reason .container .pillarContent .text').animate({
                'scrollTop': 0 + 'px'

            }, 0);

        }

        makePillarContent();
        function makePillarContent() {


            for (var i = 0; i < arrSlides.length; i++) {

                var pillarContent = $('.pillarContent' + i);
                var contentHtml = '';

                var title = '<div class="title">' + arrSlides[i]['name' + _language] + '</div>';
                var text = '<div class="scrollContainer"><div class="text"><p>' + arrSlides[i]['text' + _language] + '</p></div></div>';
                var imgSlider = ' <div class="pillarImageSlider"></div>';
                var counterContainer = '<div class="pillarCounterContainer"></div>';
                var next = '<div class="pillarNextPic"></div>';
                var prev = '<div class="pillarPreviousPic"></div>';
                var readMore = '<div class="readMoreContainer"><p class="hidden readMore">Lees verder</p><div class="hidden readMoreImg"></div></div>';

                contentHtml += title;
                contentHtml += text;
                contentHtml += '<div class="pillarSlideContainer">';
                contentHtml += imgSlider;
                contentHtml += counterContainer;
                contentHtml += next;
                contentHtml += prev;


                contentHtml += readMore;

                contentHtml += '</div>';

                pillarContent.html(contentHtml);
                var length =  arrSlides[i]['text'+ _language].length;


                if(length > 750){
                    $(".pillarContent" + i + " .readMoreImg").removeClass('hidden');
                    $(".pillarContent" + i + " .readMore").removeClass('hidden');
                }
            }
        }



        function showContent(target) {


            var pillarContent = $(target).find('.pillarContent')[0];
            $(pillarContent).removeClass('hidden');
        }


        function makeImageSlider(target){


            $('.reason').off('click');

            var id = target.getAttribute('data-id');

            var imageState = 0;

            addImages(id);
            addCounterClick();

            function addImages(index) {

                var htmlString = '';
                var counterhtml = '';

                var images = arrSlides[index].exploratorium_multithemes_images;

                if (images.length < 2) {

                    $('.pillarNextPic').addClass('hidden');
                    $('.pillarPreviousPic').addClass('hidden');
                } else {

                    $('.pillarNextPic').removeClass('hidden');
                    $('.pillarPreviousPic').removeClass('hidden');
                }

                for (var i = 0; i < images.length; i++) {
                    var image = images[i].image;

                    htmlString += '<div class="pillarImage pillarImage' + i + ' right" id="pillarImage' + i + '" x-order="' + i + '" style="background-image:url(' + image + ')"></div>';
                    counterhtml += '<div class="pillarTick pillarCounter' + i + '" countervalue="' + i + '" id="pillarCounter' + i + '"></div>';

                }

                $('.pillarImageSlider').html(htmlString);
                $('.pillarCounterContainer').html('<div class="pillarCounter">' + counterhtml + '</div>');
                $('.pillarImage0').removeClass('right');
                if (images.length <= 1) $('.pillarCounter').html(' ');


                $('.pillarCounter0').addClass('selected');


            }

            function setCounter() {
                $('.pillarTick').removeClass('selected');
                $('.pillarCounter' + imageState + '').addClass('selected');
                $('.pillarImage').each(function (key, value) {
                    if ($(value).attr('x-order') < imageState) $(value).removeClass('right').addClass('left');
                    if ($(value).attr('x-order') > imageState) $(value).removeClass('left').addClass('right');
                    if ($(value).attr('x-order') == imageState) $(value).removeClass('left right');
                });

            }


            function addCounterClick() {
                var tick = $('.pillarTick');
                var image = $('.pillarImageSlider');
                tick.off('click').on('click', counterClicked);
                image.off('swipeleft').on('swipeleft', imageSwipedLeft);
                image.off('swiperight').on('swiperight', imageSwipedRight);

                $('.pillarNextPic').off('click').on('click', imageSwipedLeft);
                $('.pillarPreviousPic').off('click').on('click', imageSwipedRight);


                function counterClicked(event) {
                    imageState = $(event.target).attr('countervalue');
                    setCounter();
                }

                function imageSwipedRight(event) {
                    if (imageState == 0)return;
                    imageState--;
                    setCounter();
                }

                function imageSwipedLeft(event) {

                    if (imageState == arrSlides[id].exploratorium_multithemes_images.length - 1) return;
                    imageState++;
                    setCounter();
                }

            }


        }
    }


    show();
    function show() {
        $subjectScreen.addClass('hidden');
        $accordionScreen.removeClass('hidden');
        $accordionScreen.find('.accordeon').removeClass('hidden');
    }

    $('.readMoreImg').on('click', scrollText);


    var text = $('.accordionScreen .accordeon .wrapper .reason .container .pillarContent .text');



    var scrollDistance = 0;
    var scrollLeft = 0;
    function scrollText(){
        /*text.scroll(function(){


         var trueDivHeight = $(this)[0].scrollHeight;
         var divHeight = $(this).height();
         scrollLeft = trueDivHeight - divHeight;

         });*/


        scrollDistance+= 100;


        $(text).animate({
            'scrollTop': scrollDistance + 'px'

        }, 500);
    }
}

function onBackButtonEvent() {
    $menu.find('.back').addClass('hidden');
    $subjectScreen.removeClass('hidden');
    $accordionScreen.addClass('hidden');
}

