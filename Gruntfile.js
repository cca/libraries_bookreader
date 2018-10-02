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
