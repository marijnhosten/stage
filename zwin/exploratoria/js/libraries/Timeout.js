var _globalTimeoutTimer;
var _globalTimeOutTime = 30000;
var timeLeft = 8000;
var wait = 10000;

function initGlobalTimeOut() {
    console.log("start af te tellen");
    _globalTimeoutTimer = setInterval(timeout, _globalTimeOutTime);

    window.addEventListener("touchend", resetGlobalTimeOut);
    window.addEventListener("click", resetGlobalTimeOut);
}

function resetGlobalTimeOut() {
    window.clearInterval(_globalTimeoutTimer);
    _globalTimeoutTimer = setInterval(timeout, _globalTimeOutTime);
}

function stopGlobalTimeOut() {
    console.log("stop af te tellen");
    window.removeEventListener("touchend", resetGlobalTimeOut);
    window.removeEventListener("click", resetGlobalTimeOut);
    window.clearInterval(_globalTimeoutTimer);
}

function timeout() {


    $('.alertScreen .alertTimer .timer').removeClass('fill');

    showTimeOutAlertScreen();
    function showTimeOutAlertScreen() {
        $alertScreen.removeClass('hidden');
        $alertScreen.find(".button").off('click').on('click', onStayAwakeHandler);
    }

    var txt = useGrep($apptranslations, 'identifier', 'general_benjedaarnog')['value' + _language];
    txt = txt.replace('[NAME]', _userData[0].visitor_personal_information.name);
    $alertScreen.find('.callOut').html(txt);


    countDown();
    var _counter;
    var count;

    function countDown(){

        $('.alertScreen .alertTimer div').addClass('timer2');

        $(".timer2").circletimer({
            onComplete: timesUp,
            timeout: timeLeft
        });

        count = 8;
        _counter = setInterval(timer, 1000);

        function timer() {
            count = count - 1;
            if (count <= -1) {
                clearInterval(_counter);
            }

        }

        function timesUp(){
            totalReset();
            clearInterval(_counter);
        }
    }

    $(".timer2").circletimer("start");

    function onStayAwakeHandler() {

        $alertScreen.addClass('hidden');
        $(".timer2").circletimer("stop");

        $('.alertScreen .alertTimer .timer').addClass('fill');
    }

    function totalReset() {
        onGameOver();
        location.reload();
    }
}