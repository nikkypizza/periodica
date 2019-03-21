var gulp = require('gulp');

// ######################## //
// DEVELOPMENT images START //
// ####################### //

var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var cssmin = require("gulp-csso");
var run = require("run-sequence");
var del = require("del");
var uglify = require("gulp-uglify-es").default;

// Minify png
gulp.task('pngmin', () =>
  gulp.src(["app/img/**/*.png", "app/img/**/*.jpg"])
  .pipe(imagemin([
    imageminPngquant({ quality: 45 })
  ]))
  .pipe(gulp.dest('dist/img'))
)


// ###################### //
// DEVELOPMENT images END //
// ###################### //


// --------------------------------------------//


//    ######################   //
// BrowserSync all files START //
//    ######################   //

var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// Monitor sass files + sync with local server
gulp.task('default', ['sass'], function () {
  browserSync.init(["app/css/*.css", "app/js/*.js", "app/*.html", "app/sass/*.scss"], {
    server: "app/."
  });
  gulp.watch("app/sass/**/*.scss", ['sass']);
  gulp.watch("app/*.html").on('change', browserSync.reload)
});

// Convert SCSS to CSS
gulp.task('sass', function () {
  gulp.src('app/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({ includePaths: ['sass'] }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
});

//   #####################   //
// BrowserSync all files END //
//   #####################   //


// --------------------------------------------//


// ##### //
// Build //
// ##### //

gulp.task("copy", function () {
  return gulp.src([
      "app/*.html",
      "app/favicon.*",
      "app/fonts/*",
      "app/img/**/*"
    ], {
      base: "./app"
    })
    .pipe(gulp.dest("dist/."));
});

gulp.task("clean", function () {
  return del("dist");
});

gulp.task("cssmin", function() {
  gulp.src("app/css/style.css")
    .pipe(cssmin())
    .pipe(gulp.dest("dist/css"));
});

gulp.task("jsmin", function () {
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task("build", function (done) {
  run("clean", "copy", "jsmin", "cssmin", done);
});
