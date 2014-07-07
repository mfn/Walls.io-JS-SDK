module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    
    config:
      dev:
        options:
          variables:
            buildDir: "build"

      dist:
        options:
          variables:
            buildDir: "dist"
            
            
    clean: ["<%= grunt.config.get('buildDir') %>/**/*"]
            
    copy:
      main:
        files: [
          { expand: true, src: "**", dest: "<%= grunt.config.get('buildDir') %>", cwd: "src/public/" }
        ]
        
    useminPrepare:
      html: "<%= grunt.config.get('buildDir') %>/**/*.html"
      options:
        basedir: "."
        dest: "<%= grunt.config.get('buildDir') %>/"
        
    usemin:
      html: "<%= grunt.config.get('buildDir') %>/**/*.html"
      options:
        assetsDirs: ["<%= grunt.config.get('buildDir') %>/js", "<%= grunt.config.get('buildDir') %>/css"]
                
    rig:
      compile:
        files:
          "<%= grunt.config.get('buildDir') %>/js/application.js": ["src/assets/javascripts/application.coffee"],
          "<%= grunt.config.get('buildDir') %>/js/wall.js": ["src/assets/javascripts/wall.coffee"]
                    
    jade:
      compile:
        options:
          pretty: true
        files: [
          { expand: true, cwd: "src/views", src: "**/*.jade", dest: "<%= grunt.config.get('buildDir') %>/", ext: ".html" }
        ]
      
    watch:
      scripts:
        files: ["src/**"]
        tasks: ["default"]
        options:
          spawn: false
          livereload: true
  
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-config"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-rigger"
  grunt.loadNpmTasks "grunt-text-replace"
  grunt.loadNpmTasks "grunt-usemin"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-clean"
  
  grunt.loadNpmTasks "grunt-notify"
  
  grunt.registerTask "default", ["config:dev", "clean", "rig", "jade", "copy"]
  grunt.registerTask "dist", ["config:dist", "clean", "rig", "jade", "copy", "useminPrepare", "usemin", "concat", "uglify"]
  