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
          }
          {
            src: 'app/views/style.css'
            dest: 'dist/style.css'
          }
          {
            src: 'app/bower_components/jquery/dist/jquery.js'
            dest: 'dist/jquery.js'
          }
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
          hostname: '*',
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

    watch: {
      app: {
        files: ['app/src/*.coffee', 'app/views/*.html']
        tasks: ['analyze', 'build']
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
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-docco'

  # Define tasks
  grunt.registerTask('analyze', ['coffeelint:app'])
  grunt.registerTask('build', ['clean:app', 'copy:app', 'coffee:app'])
  grunt.registerTask('docs', ['docco:app'])
  grunt.registerTask('http', ['connect:app'])

  grunt.registerTask('dev', ['http', 'watch:app'])

  grunt.registerTask('package', ['analyse', 'build', 'docs'])
