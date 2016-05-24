var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    minifier = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    notify = require("gulp-notify"),
    less = require("gulp-less"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    jsStylish = require("jshint-stylish");

gulp.task("css", function () {
    gulp.src("./less/**/*.less")
        .pipe(less())
        .pipe(csslint({'ids': false}))
        .pipe(sourcemaps.init())
        .pipe(minifier())
        .pipe(concat("style.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/css/"))
        .pipe(notify({message: "css successfully built!"}));
});

gulp.task("js", function () {
    gulp.src(["./js/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter(jsStylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/js/"))
        .pipe(notify({message: "Javascript successfully built"}));
});

gulp.task("default", function () {
    gulp.watch("./less/**/*.less", ["css"]);
    gulp.watch(["./js/**/*.js"], ["js"]);
});