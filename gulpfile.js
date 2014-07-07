/*jshint undef:true, indent:2, curly:true, node:true, strict:false, browser:false */

var
gulp = require("gulp"),
cache = require("gulp-cached"),
remember = require("gulp-remember"),
coffee = require("gulp-coffee"),
include = require("gulp-include"),
buildDir = "build",
distDir = "dist",
assetsDir = "src/assets",
publicDir = "src/public";

gulp.task("copy", function() {
  return gulp.src(publicDir + "/**/*")
  .pipe(cache("copyfiles"))
  .pipe(gulp.dest(buildDir));
});

gulp.task("scripts", function() {
  return gulp.src(assetsDir + "/javascripts/*.coffee")
  .pipe(cache("scripts"))
  .pipe(include())
  .pipe(coffee())
  .pipe(gulp.dest(buildDir + "/js"));
});

gulp.task("pseudodist", function() {
  return gulp.src(buildDir + "/**/*")
  .pipe(gulp.dest(distDir));
});

gulp.task("watch", function() {
  var watcherOnChange = function(e) {
    console.log(e.path + " was " + e.type + ", running tasks.");
  };

  gulp.watch(publicDir + "/**/*", ["copy"]).on("change", watcherOnChange);
  gulp.watch(assetsDir + "/javascripts/**/*", ["scripts"]).on("change", watcherOnChange);
});

gulp.task("default", ["scripts", "copy"]);
gulp.task("dist", ["default", "pseudodist"]);
