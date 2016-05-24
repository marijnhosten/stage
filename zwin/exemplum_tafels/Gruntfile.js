/**
 * Created by arno.chauveau on 10/6/2015.
 */
module.exports = function(grunt){
    grunt.initConfig({
        less:{
            development:{

                files: [
                    {
                        "css/style.css":"css/style.less"
                    },
                    {
                        expand: true,
                        cwd: "categories",
                        src: ["**/*.less"],
                        dest: "categories",
                        ext: ".css"
                    },
                    {
                        expand: true,
                        cwd: "css",
                        src: ["**/*.less"],
                        dest: "css",
                        ext: ".css"
                    }
                ]
            },
            production:{
                files: [
                    {
                        "css/style.css":"css/style.less"
                    },
                    {
                        expand: true,
                        cwd: "categories",
                        src: ["**/*.less"],
                        dest: "categories",
                        ext: ".css"
                    },
                    {
                        expand: true,
                        cwd: "css",
                        src: ["**/*.less"],
                        dest: "css",
                        ext: ".css"
                    }
                ]
            }
        },
        autoprefixer:{
            default:{
                files:[
                    {
                        'css/style.css':'css/style.css'
                    },
                    {
                        'categories/kids/css/style.css':'categories/kids/css/style.css'
                    },
                    {
                        'categories/adults/css/style.css':'categories/adults/css/style.css'
                    },
                    {
                        'categories/teens/css/style.css':'categories/teens/css/style.css'
                    }
                ]
            }
        },
        tags:{
            buildScripts:{
                options:{
                    openTag: '<!-- scripts -->',
                    closeTag: '<!-- end scripts -->'
                },
                src:[

                    'js/*/*.js',
                    'js/*.js'
                ],
                dest:'index.html'
            },
            buildLinks:{
                options:{
                    openTag: '<!-- links -->',
                    closeTag: '<!-- end links -->'
                },
                src:[
                    'css/reset.css',
                    'css/*.css'
                ],
                dest:'index.html'
            }
        },
        watch:{
            styles:{
                files:[
                    'css/*.less',
                    "categories/adults/css/*.less",
                    "categories/teens/css/*.less",
                    "categories/kids/css/*.less"],
                tasks:['less']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-contrib-watch');
};