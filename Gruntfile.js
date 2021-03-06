module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    recess: {
      options: {
        compile: true
      },
      compileless: {
        options:{
          compress:true
        },
        src: ['app/less/app.less'],
        dest: 'app/app.css'
      }
    },

    concat:{
      compilejs:{
        src:[
          "app/lib/jquery/min.js",
          "app/lib/angular/angular.min.js",
          "app/lib/angular/angular-route.min.js",
          "app/lib/angular/angular-sanitize.min.js",
          "app/bower_components/raphael/raphael-min.js",
          "app/js/app.js",
          "app/js/controllers.js",
          "app/js/filters.js",
          "app/js/directives.js",
          "app/js/services.js"
        ],
        dest:"app/js/app.cc.js"
      }
    },
    uglify:{
      doit:{
        src:["app/js/app.cc.js"],
        dest:"app/js/app.min.js"
      }
    },

    watch:{
      recess:{
        files:["app/less/*"], tasks:['recess']
      },
      concat:{
        files:["app/js/**/*.js"], tasks:['concat']
      },
      html:{
        files:"app/**/*.html",
        tasks:[]
      },
      options:{spawn:false, livereload:true}
    }
  });

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('dist-css', ['recess']);
  grunt.registerTask('default', ['recess', 'concat']);

};