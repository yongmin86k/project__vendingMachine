const gulp = require("gulp"),
  terser = require("gulp-terser"),
  rename = require("gulp-rename"),
  browserSync = require("browser-sync"),
  cssnano = require("gulp-cssnano"),
  sass = require("gulp-sass"),
  prettyError = require("gulp-prettyerror"),
  autoprefixer = require("gulp-autoprefixer"),
  eslint = require("gulp-eslint"),
  webpack = require("webpack-stream");

gulp.task("lint", function() {
  return gulp
    .src("./js/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task(
  "bundle",
  gulp.series("lint", function webpackBundler() {
    return gulp
      .src("./js/*.js")
      .pipe(
        webpack({
          output: {
            filename: "bundle.js"
          }
        })
      )
      .pipe(terser())
      .pipe(rename({ extname: ".min.js" }))
      .pipe(gulp.dest("./build/js"));
  })
);

gulp.task("sass", function() {
  return gulp
    .src("./sass/style.scss")
    .pipe(prettyError())
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./build/css"))
    .pipe(cssnano())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./build/css"));
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp
    .watch(["build/css/*.css", "build/js/*.js"])
    .on("change", browserSync.reload);
});

gulp.task("watch", function() {
  gulp.watch("js/**/*.js", gulp.series("bundle"));
  gulp.watch("sass/**/*.scss", gulp.series("sass"));
  gulp.watch("*.html").on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel("browser-sync", "watch"));
