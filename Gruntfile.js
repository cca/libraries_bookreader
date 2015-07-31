/* global module,require */
module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
                        'index.html',
                        '.htaccess'
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
              path: 'http://localhost:8000/?title=Double%20Readings&id=d79ea3fb-6d87-4003-9b40-9b322dcd87fc&version=1&filenames=page&pages=9'
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
};
