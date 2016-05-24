/**
 * Created by arno.chauveau on 10/2/2015.
 */

var birdImageData={
    1:{
        romp: "Bergeend_romp.png",
        rozet: "snavelrozet_bergeend-lepelaar-kolgans.png",
        solution:0
    },
    2:{
        romp: "Lepelaar_romp.png",
        rozet: "snavelrozet_bergeend-lepelaar-kolgans.png",
        solution: 90
    },
    3:{
        romp: "Kolgans_romp.png",
        rozet: "snavelrozet_bergeend-lepelaar-kolgans.png",
        solution: 270
    },
    4:{
        romp: "Roodborstje_romp.png",
        rozet: "snavelrozet_roodborstje-kluut-boerenzwaluw-visdief.png",
        solution: 180
    },
    5:{
        romp: "RosseGrutto_romp.png",
        rozet: "snavelrozet_ooievaar-zomertortel-rossegrutto.png",
        solution: 270
    },
    6:{
        romp: "Ooievaar_romp.png",
        rozet: "snavelrozet_ooievaar-zomertortel-rossegrutto.png",
        solution: 90
    },
    7:{
        romp: "Boerenzwaluw_romp.png",
        rozet: "snavelrozet_roodborstje-kluut-boerenzwaluw-visdief.png",
        solution: 0
    },
    8:{
        romp: "Zomertortel_romp.png",
        rozet: "snavelrozet_ooievaar-zomertortel-rossegrutto.png",
        solution: 0
    },
    9:{
        romp: "Kluut_romp.png",
        rozet: "snavelrozet_roodborstje-kluut-boerenzwaluw-visdief.png",
        solution: 90
    },
    10:{
        romp: "Visdief_romp.png",
        rozet: "snavelrozet_roodborstje-kluut-boerenzwaluw-visdief.png",
        solution: 270
    }
};

function startBeaksGame(){
    $('.introScreen.page').addClass('hidden');
    $('.birdContainer .button').addClass('text').find('div').html('RADEN');
    $('.birdimage').css('background-image','url("./categories/kids/assets/img/'+birdImageData[_userData[1].bird_id].romp+'")');
    $('#wheelOfBeaks').css('background-image','url("./categories/kids/assets/img/'+birdImageData[_userData[1].bird_id].rozet+'")');

    

    var randomAngle = getRandomAngle();
    var angle;
    var realAngle;
    var bird_id = _userData[1].bird_id;
    function setNewAngle(angle) {
        $('#wheelOfBeaks').css('transform','rotate('+angle+'deg)');
        realAngle = angle;
    }

    setNewAngle(randomAngle);





    setClickEvents();

    showGameScreen();

    function getRandomAngle() {
        var random =  Math.floor((Math.random() * 4) + 1);
        var angle = random * 90;
        if((!(bird_id==4||bird_id==9||bird_id==7||bird_id==10))&& angle==180){

            return angle +90;
        }
        return angle;
    }



    function setClickEvents(){
        $('.text.button').off('click').on('click',gokButtonClicked);
        var arrows = $('.arrow');

        $('.arrow.forward').on('click',moveForward);
        $('.arrow.back').on('click',moveBack);

        function gokButtonClicked() {
            if(angle != birdImageData[_userData[1].bird_id].solution){
                var angryBird = $('.angryBird').removeClass('hidden');
                setTimeout(function(){angryBird.addClass('hidden')},1000);
            }
            else{
                $('.arrow.forward').off('click');
                $('.arrow.back').off('click');
                onShowKidsScore(1);
                var happyBird = $('.happyBird').removeClass('hidden');
                setTimeout(function(){happyBird.addClass('hidden')},1000);
            }
        }
    }

    function moveForward() {
        realAngle += 90;
        onDragStopped(realAngle);
        var bird_id = _userData[1].bird_id;
        if((!(bird_id==4||bird_id==9||bird_id==7||bird_id==10))&& angle==180){
            moveForward();
            return;
        }
        setNewAngle(realAngle);

    }

    function moveBack() {
        realAngle -= 90;
        onDragStopped(realAngle);
        var bird_id = _userData[1].bird_id;
        if((!(bird_id==4||bird_id==9||bird_id==7||bird_id==10))&& angle==180){
            moveBack();
            return;
        }
        setNewAngle(realAngle);
    }

    function onDragStopped(a) {

        angle =getNormalisedAngle(a);

        function getNormalisedAngle(angle) {
            var divider = Math.floor(angle/360);
            return angle - divider*360;
        }
    }
    function showGameScreen() {
        $('.introScreen').addClass('hidden');
        $('.kids').not('.introScreen').removeClass('hidden');
    }
}

