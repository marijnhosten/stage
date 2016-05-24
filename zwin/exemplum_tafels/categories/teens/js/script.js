var currentTeenScore = 0;
var questionsAnswered = 0;
var totalTeenScore = 0;

var teenQuizTime = 120000; //120000

var questionCounter = 0; // question number
var selections = []; //Array containing user choices
var _quizData = [];
var _counter;
var _isQuizOver = false;


function startTeens() {

    showScreen();
    function showScreen() {
        $introScreen.addClass('hidden');
        $introScreen.addClass('hidden');
        $teensScreen.removeClass('hidden');

        $('.birdContainer .button').addClass('text').find('div').html('START');
        $('.birdContainer .txt').html('');
        $('.birdContainer .button').off('click');

        var birdName = _userData[1].bird["nameNL"].toLowerCase();
        var imgName = birdName + "_tienervogel.png";

        var $quizScoreScreen = $teensScreen.find('.quizScorescreen');
        $quizScoreScreen.find('.birdImage').css({
            'background-image': 'url(./assets/img/birds/' + imgName + ')'
        });
    }

    var arrBirdQuestions = [];
    var arrAskFirstQuestions = [];
    var arrNormalQuestions = [];


    readQuestions();
    function readQuestions() {

        $.each($teenData.teen_exemplum_questions, function (key, value) {
            if (value.bird_id == _birdID) {
                arrBirdQuestions.push(value);
            }
            else if (value.ask_first == 1) {
                arrAskFirstQuestions.push(value);
            }
            else if (value.bird_id == null && (value.ask_first == 0 || value.ask_first == null)) {
                arrNormalQuestions.push(value);
            }

            if ($teenData.teen_exemplum_questions.length == key + 1) {
                arrBirdQuestions = shuffleArray(arrBirdQuestions);
                arrNormalQuestions = shuffleArray(arrNormalQuestions);
                _quizData = arrBirdQuestions.concat(arrAskFirstQuestions, arrNormalQuestions);
            }
        });
    }

    initQuiz();
    function initQuiz() {
        currentTeenScore = 0;
        totalTeenScore = 10; // set to value from database
        timerState = teenQuizTime;
        countdown();
        function countdown() {
            var i = 3;
            $('.birdContainer .button').find('div').html(i);
            var countdown = setInterval(function () {
                i--;
                $('.birdContainer .button').find('div').html(i);
                if (i == 0) {
                    clearInterval(countdown);
                    $('.birdContainer .button').removeClass('text');
                    $('.birdContainer .button').off('click');
                    $('.birdContainer .button').removeClass('text').find('div').html('');
                    startQuiz();
                }
            }, 1000);
        }
    }

    function startQuiz() {
        initCountdownTimer();
        function initCountdownTimer() {
            $('.birdContainer .button div').addClass('timer');
            $(".timer").circletimer({
                onComplete: timesUp,
                timeout: teenQuizTime
            });
            var count = teenQuizTime / 1000;
            _counter = setInterval(timer, 1000);
            $('.birdContainer').find('.text').html(count + '<br/><span>SEC</span>');
            function timer() {
                count = count - 1;
                if (count <= -1) {
                    clearInterval(_counter);
                    return;
                }
                $('.birdContainer').find('.text').html(count + '<br/><span>SEC</span>');
            }
        }

        $teensScreen.find('.blurred').removeClass('blurred');
        $(".timer").circletimer("start");
        displayNextQuestion();
    }

    function timesUp() {
        quizOver();
    }
}

var $answersContainer = $('.answersContainer');
var $questionContainer = $('.questionContainer');
var $question = $('.question');

var answers = [];
var isAlreadyAnswered = false;

function displayNextQuestion() {

    $questionContainer.find('.questionImage').css('background-image', '');
    $('.answersContainer').empty();

    if (questionCounter < _quizData.length) {

        createQuestionElement(questionCounter);
        function createQuestionElement(index) {
            var s = '<span>' + _quizData[index]["question" + _language] + '</span>';
            $question.html(s);
            if (_quizData[index]["imageNL"] != null) {
                $questionContainer.find('.questionImage').css('background-image', 'url(' + _quizData[index]["imageNL"] + ')');
            }
        }

        createRadios(questionCounter);
        function createRadios(index) {
            answers = getAnswersAndMix();
            function getAnswersAndMix() {
                var arr = [];
                var objAnswer = {};
                var objWrongOne = {};


                if(_quizData[index]["answer" + _language].indexOf("<")>-1){

                    _quizData[index]["answer" + _language] = _quizData[index]["answer" + _language]
                        .replace("<span class='nouppercase'>&#223;</span>", 'ß');
                }

                objAnswer.answer = _quizData[index]["answer" + _language];
                objAnswer.image = _quizData[index]["answer_one_image"];
                objWrongOne.answer = _quizData[index]["wrong_answer_one" + _language];
                objWrongOne.image = _quizData[index]["wrong_answer_one_image"];
                arr.push(objAnswer);
                arr.push(objWrongOne);

                shuffleArray(arr);
                return arr;
            }

            var html = '';
            for (var i = 0; i < answers.length; i++) {
                if (i & 1) {
                    html += '<label>';
                } else {
                    html += '<label>';
                }
                html += '<input type="radio" name="answer" value="' + i + '" onclick="onRadioButtonClick();" /><div class="radioInner"></div>';
                html += '<div class="qLabel">';
                html += '<span>' + answers[i].answer + '</span></div>';
                html += '</label>';

                if (answers[i].image != null) {
                    var extraClass = "";
                    if (answers[i].answer == "") {
                        extraClass = "left";
                    }

                    html += '<div class="' + extraClass + ' answerImage answerImage' + i + '" style="background-image:url(' + answers[i].image + ')"></div>';
                }

            }
            $answersContainer.html(html);
        }

        createFeedbackScreen(questionCounter);
        function createFeedbackScreen(index) {
            $('.quizFeedback').find('.text span').html(_quizData[index]['text_wrong_answer' + _language]);
            if (_quizData[index]['feedback_image'] != null) {
                $('.quizFeedback').find('.image').css('background-image', 'url(' + _quizData[index]["feedback_image"] + ')');
            } else {
                $('.quizFeedback').find('.image').css('background-image', '');
            }
        }

    } else {
        quizOver();
    }

}

function onRadioButtonClick() {
    var radio = checkSelectedRadio();
    questionsAnswered++;

    if (isNaN(selections[questionCounter].selection)) {

        alert('Please make a selection!');

    } else {

        if (!isAlreadyAnswered) {
            disableRadioButtons();
            function disableRadioButtons() {
                $('label').addClass('disabled');
            }

            checkAnswer();
            function checkAnswer() {
                var isImage = false;
                if (selections[questionCounter].answerImage != undefined) {
                    isImage = (selections[questionCounter].answerImage).indexOf(_quizData[questionCounter]["answer_one_image"]) > 1;
                }
                var isAnswer = (selections[questionCounter].answer === _quizData[questionCounter]["answer" + _language] && selections[questionCounter].answer != "");
                if (isAnswer == true || isImage == true) {
                    radio.next().addClass('correct');
                    currentTeenScore++;
                    var tmr1 = setInterval(function () {
                        if (!_isQuizOver) {
                            clearInterval(tmr1);
                            goToNextQuestion();
                        }

                    }, 1500);

                } else {
                    radio.next().addClass('wrong');
                    isAlreadyAnswered = true;
                    var tmr = setInterval(function () {
                        clearInterval(tmr);
                        $('.quizFeedback').removeClass('hidden');
                        var tmrr = setInterval(function () {
                            if (!_isQuizOver) {
                                goToNextQuestion();
                                clearInterval(tmrr);
                            }
                        }, 6000);
                    }, 1500);
                }
            }
        }

        function goToNextQuestion() {
            $(".timer").circletimer("start");
            isAlreadyAnswered = false;
            questionCounter++;
            $('.quizFeedback').addClass('hidden');
            displayNextQuestion();
        }
    }
}

// user selectie en value doorgeven
function checkSelectedRadio() {

    var radioBtnText = $('input[name=answer]:checked');
    radioBtnText.closest('label').find('span').html();
    //radioBtnText.closest('label').addClass('selected');

    var valueRad = $('input[name=answer]:checked').attr("value");
    var obj = {
        selection: +$('input[name=answer]:checked').val(),
        answer: radioBtnText.closest('label').find('span').html(),
        answerImage: $('.answerImage' + valueRad).css('background-image')
    };

    selections[questionCounter] = obj;

    return radioBtnText;
}

function quizOver() {

    resetGlobalTimeOut();
    _isQuizOver = true;


    $menu.find('.infoButtonWrapper').removeClass('hidden');
    $('.answersContainer').addClass('hidden');
    $('.quizFeedback').addClass('hidden');
    $('.birdImage').removeClass('hidden');
    $('.textBubble').removeClass('hidden');
    $('.amount').removeClass('hidden');
    $('.amountNumber').removeClass('hidden');
    $('.total').removeClass('hidden');
    $('.totalNumber').removeClass('hidden');
    $('.scoreCircle').removeClass('hidden');
    $('.quizScorescreen h2').removeClass('hidden');


    $('.infoButtonWrapper').find('.text').html(_language + " alles over jouw vogel");

    var $quizScoreScreen = $teensScreen.find('.quizScorescreen');
    $questionContainer.find('.questionImage').css('background-image', '');
    $questionContainer.find('.questionMark').html('!');

    $('.birdContainer').addClass('hidden');

    $question.html('<h1>' + _language + 'jouw score' + '</h1>');

    var score = (currentTeenScore / questionsAnswered) * 100;
    var txt = "";

    if(isNaN(score)){
        score = 0;
    }

    if (score > ((100 / 3) * 2)) {
        txt = ' ' + _language + useGrep($apptranslations, "identifier", "teen_score_one")["value" + _language];
    } else if (score >= (100 / 3) && score <= ((100 / 3) * 2)) {
        txt = ' ' + _language + useGrep($apptranslations, "identifier", "teen_score_two")["value" + _language];
    } else if (score < (100 / 3)) {
        txt = ' ' + _language + useGrep($apptranslations, "identifier", "teen_score_three")["value" + _language];
    }


    $quizScoreScreen.find('.scoreNumber').text(currentTeenScore);
    if (currentTeenScore === 0) {
        $quizScoreScreen.find('h2').text("juiste antwoorden");
    } else if (currentTeenScore > 1) {
        $quizScoreScreen.find('h2').text("juiste antwoorden");
    }
    else {
        $quizScoreScreen.find('h2').text("juist antwoord");
    }

    $quizScoreScreen.find('.amountNumber').text(questionsAnswered);
    $quizScoreScreen.find('.totalNumber').text(currentTeenScore + totalTeenScore);
    $quizScoreScreen.find('.birdMessage').html(txt);

    $menu.find('.infoButtonWrapper').on('click', onQuizShowAdultBird);

    $(".timer").circletimer("pause");
    $quizScoreScreen.removeClass('hidden');


    function onQuizShowAdultBird() {
        $menu.find('.infoButtonWrapper').addClass('hidden');
        $('.birdContainer').addClass('hidden');
        $('body').removeClass('dark');
        $teensScreen.addClass('hidden');
        startAdult();
    }
}
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}