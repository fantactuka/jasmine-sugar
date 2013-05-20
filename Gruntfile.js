module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('component.json'),

    karma: {
      options: {
        configFile: 'spec/support/karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false
      },

      ci: {
        options: {
          reporters: ['dots'],
          singleRun: true
        }
      },

      watch: {
        options: {
          reporters: ['dots', 'growl'],
          singleRun: false,
          autoWatch: true
        }
      },

      coverage: {
        options: {
          reporters: ['coverage'],
          preprocessors: {
            'project.js': 'coverage'
          }
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'spec/**/*spec.js',
        'project.js'
      ],

      options: {
        jshintrc: '.jshintrc'
      }
    },

    version: {
      update: {
        src: ['component.json', 'package.json']
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-version');

  grunt.registerTask('test', ['jshint', 'karma:ci']);
  grunt.registerTask('default', ['test']);

  grunt.registerTask('release', 'Releasing new version with update version', function() {
    var type = this.args[0] || 'patch';
    grunt.task.run(['test', 'version:update:' + type]);
  });
};
