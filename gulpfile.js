/*------------------------
 Imports
 -------------------------*/

// util
var fs  = require('fs'),
    del = require('del'),
    path = require('path');

// gulp
var gulp        = require('gulp'),
    install     = require('gulp-install'),
    server      = require('gulp-server-livereload'),
    sass        = require('gulp-ruby-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    runSequence = require('run-sequence');

/*------------------------
 Environment
 -------------------------*/

var argv = require('yargs').argv;
var prod = !!argv['prod'];

/*------------------------
 Paths
 -------------------------*/

var paths = {
    styles: {
        src:  path.join('src', 'styles'),
        dest: path.join('build', 'styles')
    },
    bower: {
        src:  path.join('bower_components')
    }
};

/*------------------------
 Tasks
 -------------------------*/

gulp.task('bower', function() {
    return gulp.src('./bower.json')
        .pipe(install());
});


gulp.task('bower-copy-js', ['bower'], function() {
    var deps = [
        'es6-module-loader/dist/es6-module-loader.js*',
        'traceur/traceur.min*',
        'system.js/dist/system.js*',
        'plugin-text/text.js',
        'vue/dist/vue.min*',
        'director/build/director.min.js'
    ];
    return gulp.src(deps.map(function(dep) {
        var a = path.join(paths.bower.src, dep);
        return a;
    }))
        .pipe(gulp.dest(path.join('build', 'lib')))
});

gulp.task('bower-copy-assets', ['bower'], function() {
    var deps = [
    ];
	return gulp.src(deps.map(function(dep) {
		return path.join(paths.bower.src, dep);
	}), {base: paths.bower.src})
        .pipe(gulp.dest(path.join('build', 'assets')))
});

gulp.task('copy', ['bower-copy-js', 'bower-copy-assets'], function() {
	return gulp.src([
		path.join('src', '**/*'),
		'!'+paths.styles.src+'**/*'
	])
		.pipe(gulp.dest(path.join('build')));
});

gulp.task('styles', ['bower'], function() {
    var sassOpts = prod? {style: 'compressed'} : {sourcemap: true};

    // Compile sass
    var task = sass(paths.styles.src, sassOpts);

    if (!prod) {
        task = task.on('error', function (err) {
            console.error('Error', err.message);
        });
        // Generate sourcemaps
        task = task.pipe(sourcemaps.write('./maps'));
    }

    return task.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('clean', function(cb) {
    return del([
        path.join('build')
    ], cb);
});

gulp.task('build', function(cb) {
    runSequence(
        'clean',
        ['copy', 'styles'],
        cb
    );
});

gulp.task('serve', ['build'], function() {
    if (!prod) {
		gulp.watch([
			path.join('src', '**/*'),
			'!'+paths.styles.src+'**/*'
		], ['copy']);
		gulp.watch([path.join(paths.styles.src, '/**/*')], ['styles']);
    }
    return gulp.src(path.join('build'))
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: false
        }));
});
