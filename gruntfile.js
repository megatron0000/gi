    module.exports = function (grunt) {

    grunt.loadNpmTasks('custom-ngdocs/node_modules/grunt-ngdocs');
    grunt.loadNpmTasks('custom-ngdocs/node_modules/grunt-contrib-connect');
    grunt.loadNpmTasks('custom-ngdocs/node_modules/grunt-contrib-clean');
    grunt.loadNpmTasks('custom-ngdocs/node_modules/grunt-contrib-watch');

    grunt.initConfig({
        ngdocs: {
            options: {
                //scripts: ['angular.js', '../src.js'],
                html5Mode: false,
                dest: 'docs',
                title: 'Documentação do site do GI'
            },
            all: ['modules/**/*.js']
        },
        connect: {
            options: {
                keepalive: false
            },
            server: {
                options: {
                    livereload: true,
                    hostname: "localhost",
                    base: './',
                    port: 8000,
                    open: true
                }
            }
        },
        clean: ['docs'],
        watch: {
            files: ['modules/**/*.js'],
            tasks: ['clean', 'ngdocs'],
            options: {
                livereload: true
            }
        }
    });

    grunt.registerTask('default', ['clean', 'ngdocs', 'connect', 'watch']);

};