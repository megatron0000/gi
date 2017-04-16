    module.exports = function(grunt) {

        grunt.loadNpmTasks('custom-ngdocs');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.initConfig({
            ngdocs: {
                options: {
                    //scripts: ['angular.js', '../src.js'],
                    html5Mode: false,
                    dest: 'docs',
                    title: 'Documentação do site do GI',
                    inlinePartials: false, //default
                    bestMatch: true
                        // styles: ['styles/backgrounds.css'],
                        // scripts: ['modules/**/*.js'] No wildcards -_- just moves to docs/grunt-scripts
                        // image: './img/logo.png'   just moves to docs/grunt-styles
                        // navContent = './some/path/to/template'
                },
                // Instead of "all", I could specify sections here
                all: ['modules/**/*.js']
                    // externalApi: {
                    //     src: ['modules/main/*.js'],
                    //     title: "you can see this",
                    //     isApi: true
                    // },
                    // privateSource: {
                    //     src: ['modules/assessmentAnalysis/*.js'],
                    //     title: "This is private"
                    //     isApi: false
                    // }
            },
            connect: {
                options: {
                    keepalive: false
                },
                server: {
                    options: {
                        livereload: true,
                        hostname: "localhost",
                        base: './docs',
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