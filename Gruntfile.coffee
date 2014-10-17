module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig {
    pkg: grunt.file.readJSON('package.json')

    # Pre-build
    coffeelint: {
      app: ['app/src/*.coffee', 'Gruntfile.coffee']
      options: {
        configFile: 'coffeelint.json'
      }
    }

    # Build
    clean: {
      app: ['dist']
    }

    copy: {
      app: {
        files: [
          {
            src: 'app/views/index.html'
            dest: 'dist/index.html'
          },
          {
            expand: true
            cwd: 'app/resources/'
            src: 'roms/*'
            dest: 'dist/'
          }
        ]
      }

    }

    coffee: {
      app: {
        files: {
          'dist/app.js': ['app/src/*.coffee']
        }
      }
    }

    # Post-build
    connect: {
      app: {
        options: {
          port: 8000,
          hostname: 'localhost',
          base: 'dist'
        }
      }
    }

    docco: {
      app: {
        src: ['app/src/*.coffee']
        options: {
          output: 'docs/'
          layout: 'linear'
        }
      }
    }

    nodeunit: {
      app: ['test/src/*.coffee']
      options: {
        reporter: 'junit'
        reporterOptions: {
          output: 'test_out'
        }
      }
    }

    watch: {
      app: {
        files: ['app/src/*.coffee', 'app/views/*.html']
        tasks: ['analyze', 'build', 'nodeunit']
        options: {
          atBegin: true
        }
      }
    }

  }

  # Load plug-ins
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-nodeunit'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-docco'

  # Define tasks
  grunt.registerTask('analyze', ['coffeelint:app'])
  grunt.registerTask('build', ['clean:app', 'copy:app', 'coffee:app'])
  grunt.registerTask('docs', ['docco:app'])
  grunt.registerTask('http', ['connect:app'])

  grunt.registerTask('dev', ['analyze', 'build', 'http', 'watch:app'])

  grunt.registerTask('package', ['analyse', 'build', 'docs'])
