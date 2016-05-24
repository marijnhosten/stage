var CycleLetters = (function () {
    "use strict";

    var init = function () {


    };

    var animateName = function (name) {

        var i = 0;
        var int = setInterval(function () {

            $('#cycle').html('');

            var arrRandom = makeRandomLetters(name);

            $.each(arrRandom, function (index, letter) {
                var div = "<div class='letter letter" + index + "'>" + letter + "</div>";
                $('#cycle').append(div);
            });


            i++;

            if (i === 60) {
                clearInterval(int);
                replaceLetter("m", 0, name);
            }

        }, 100);
    };

    function replaceLetter(letter, index, name) {

        var letters = $('.letter');
        var splitted = name.split('');
        var time = 100;
        var i = 0;

        var interval = setInterval(function () {

            letter = splitted[i];
            $(letters[index]).html(letter);

            index++;
            i++;

            if (i === letters.length) {
                clearInterval(interval);
            }
        }, time);
    }

    function makeRandomLetters(name) {
        var letters = name.split(''), l = letters.length, randomLetters = [];
        letters.reverse();

        for (var i = l - 1, randomLetter; i > -1; i--) {

            randomLetter = String.fromCharCode(60 + Math.floor(Math.random() * 61));
            randomLetters.push(randomLetter);
        }

        return randomLetters;
    }

    return {
        init: init,
        animateName: animateName
    };

})();

module.exports = CycleLetters;