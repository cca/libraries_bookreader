/* global module,require */
module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        connect: {
            dist: {
                options: {
                    base: 'dist',
                    keepalive: true,
                    open: {
                        // @TODO doesn't actually open in the browser, annoying
                        target: 'http://localhost:8000/?title=Double%20readings%20%2F%20Buzz%20Spector.&id=19f47e30-7c3a-466b-a109-6b20a411c671&version=1&filenames=page&pages=16#page/1/mode/2up',
                        appName: 'open'
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            }
        },
        sass: {
          dist: {
            options: {
              style: 'compressed',
              sourcemap: 'none'
            },
            files: {
              // @TODO switch over to sass
              'dist/css/styles.css': 'css/styles.css'
            }
          }
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/app.js': [
                        'vendor/jquery.query-object.js',
                        'js/parse-qs.js',
                        'js/app.js'
                    ]
                }
            },
            options: {
                compress: {
                    drop_console: true,
                    warnings: true
                },
                mangle: {
                    toplevel: true
                },
                nameCache: '.uglify-name-cache'
            }
        },
        // copy over all images
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.',
                    dest: 'dist',
                    src: [
                        'images/*.{webp,gif,png,jpg,jpeg}',
                        'cca-images/*.{webp,gif,png,jpg,jpeg}',
                        'index.html',
                        '.htaccess',
                        'vendor/*',
                        'bookreader/**/**'
                    ]
                }]
            }
        },
        watch: {
          dist: {
            files: ['css/*.scss', 'js/*.js'],
            tasks: ['build']
          }
      },
      open: {
          dist: {
              path: 'http://localhost:8000/?title=Double%20readings%20%2F%20Buzz%20Spector.&id=19f47e30-7c3a-466b-a109-6b20a411c671&version=1&filenames=page&pages=16#page/1/mode/2up'
          }
      }
    });

    grunt.registerTask('build', [
        'clean',
        'sass',
        'uglify',
        'copy'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('server', [
        'connect'
    ]);
};
