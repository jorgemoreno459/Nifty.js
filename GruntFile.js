'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jst: {
      compile: {
        files: {
          "js/templates.js": [
            "templates/*.html"
          ]
        },
        options: {
          "namespace": "NiftyTemplates"
        }
      }
    },

    cssmin: {
      "nifty.min.css": [
        "css/nifty.css"
      ]
    },

    uglify: {
      all: {
        files: {
          "nifty.min.js": [
            "js/templates.js",
            "js/nifty.js"
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['jst', 'uglify', 'cssmin']);
};