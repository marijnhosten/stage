(function(){
    var path, pathData, chunk, word, length, paths, scribble,
        names = ["Cassandra", "Marie-Louise", "Josephine"],
        textAreas = [
            document.getElementById('firstName'),
            document.getElementById('secondName'),
            document.getElementById('thirdName')
        ];

    function loadFont(){
        opentype.load('fonts/Dragon_is_coming.otf', function (err, font) {
            if(err){
                console.log(err);
            }

            for(var i = names.length - 1; i > -1; i--){
                calculatePaths(font, names[i], textAreas[i]);
            }

            paths = document.querySelectorAll('path');
            scribble = new Scribble(paths, {duration: 150});
            scribble.erase();
            scribble.draw();
            animate();
        });
    }

    function calculatePaths(font, message, textArea){

        path = font.getPath(message, 0, 72, 172);
        pathData = path.toPathData(2);
        chunk = pathData.split('M');
        word = "";
        length = chunk.length;

        for (var i = length - 1; i > -1; i--) {
            if (chunk[i] !== "") {
                chunk[i] = "M" + chunk[i];
            }
            word = chunk[i];

            textArea.innerHTML += '<path fill="none" stroke="#000000" stroke-miterlimit="10" d="' + word + '"/>';
        }
    }

    function animate() {
        TWEEN.update();
        requestAnimationFrame(animate);
    }

    loadFont();

    document.onclick = function(){
        location.reload();
    };
})();
