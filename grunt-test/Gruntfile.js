module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'source/<%= pkg.name %>.js': ['source/**/*.coffee']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['source/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy")%> */ \n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'source/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify'); // minify
  grunt.loadNpmTasks('grunt-contrib-jshint'); // jshint
  grunt.loadNpmTasks('grunt-contrib-concat'); // file concat
  grunt.loadNpmTasks('grunt-contrib-coffee'); // compile coffee
  grunt.registerTask('default', ['jshint', 'coffee', 'concat', 'uglify']);
};
