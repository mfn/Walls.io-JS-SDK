gulp      = require("gulp")
cache     = require("gulp-cached")
remember  = require("gulp-remember")
coffee    = require("gulp-coffee")
include   = require("gulp-include")

usemin     = require('gulp-usemin')
uglify     = require('gulp-uglify')
minifyHtml = require('gulp-minify-html')
minifyCss  = require('gulp-minify-css')
rev        = require('gulp-rev')

buildDir  = "build"
distDir   = "dist"
assetsDir = "src/assets"
publicDir = "src/public"

gulp.task "copy", ->
  gulp.src("#{publicDir}/**/*")
  .pipe(cache("copyfiles"))
  .pipe(gulp.dest(buildDir))

gulp.task "scripts", ->
  gulp.src("#{assetsDir}/javascripts/*.coffee")
  .pipe(cache("scripts"))
  .pipe(include())
  .pipe(coffee())
  .pipe(gulp.dest(buildDir + "/js"))
  
gulp.task "usemin", ->
  gulp.src("#{buildDir}/*.html")
    .pipe usemin
      css: [minifyCss(), "concat"]
      js: [uglify(), rev()]
    .pipe(gulp.dest("#{distDir}/"))

gulp.task "pseudodist", ->
  gulp.src("#{buildDir}/**/*")
  .pipe(gulp.dest(distDir))

gulp.task "watch", ->
  watcherOnChange = (e) -> console.log("#{e.path} was #{e.type}, running tasks.")

  gulp.watch("#{publicDir}/**/*", ["copy"]).on("change", watcherOnChange)
  gulp.watch("#{assetsDir}/javascripts/**/*", ["scripts"]).on("change", watcherOnChange)

gulp.task "default", ["scripts", "copy"]
gulp.task "dist",    ["default", "pseudodist"]
