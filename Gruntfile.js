/* global module,require */
module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    const sass = require('node-sass');

    grunt.initConfig({
        clean: {
            options: {
                dot: true,
                force: true
            },
            dist: ['dist/*']
        },
        sass: {
          dist: {
            options: {
              implementation: sass,
              style: 'compressed',
              sourcemap: 'none'
            },
            files: {
              'css/styles.css': 'css/index.scss'
            }
          }
        },
        uglify: {
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
                        'bookreader/**/**'
                    ]
                }]
            },
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: 'dist/index.html'
        },
        watch: {
          dist: {
            files: ['css/*.scss', 'js/*.js', 'index.html'],
            tasks: ['build']
          }
        },
        open: {
            dist: {
                path: 'http://localhost:8000/?title=Double%20readings%20%2F%20Buzz%20Spector.&id=19f47e30-7c3a-466b-a109-6b20a411c671&version=1&filenames=page&pages=16#page/1/mode/2up'
            },
            live: {
                path:
                    'https://libraries.cca.edu/static/bookreader/?title=The%20getting%20into%20the%20spirits%20cocktail%20book%20%3A%20from%20the%201984%20Miss%20General%20Idea%20Pavillion%20%2F%20by%20General%20Idea.&id=f6e9534c-c1fd-4c89-8edf-f8afcf65f8d4&version=1&filenames=page&pages=34#page/1/mode/2up'
            }
        }
    });

    grunt.registerTask('build', [
        'useminPrepare',
        'clean',
        'sass',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'copy',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
