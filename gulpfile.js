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
    changed     = require('gulp-changed'),
    runSequence = require('run-sequence');

/*------------------------
 Environment
 -------------------------*/

var argv = require('yargs').argv;
var prod = !!argv['prod'];

/*------------------------
 Config
 -------------------------*/

var srcDir = 'src';
var destDir = 'build';

var paths = {
    styles: {
        src:  path.join(srcDir, 'styles'),
        dest: path.join(destDir, 'styles')
    },
    bower: {
        src: 'bower_components',
        jsDeps: [
            'es6-module-loader/dist/es6-module-loader.js*',
            'traceur/traceur.min*',
            'system.js/dist/system.js*',
            'plugin-text/text.js',
            'vue/dist/vue.min*'
        ],
        jsDest: path.join(destDir, 'lib'),
        assetDeps: [
        ],
        assetDest: path.join(destDir, 'assets')
    }
};


/*------------------------
 Tasks
 -------------------------*/

gulp.task('clean', function(cb) {
    return del([destDir], cb);
});

gulp.task('build', function(cb) {
    runSequence('clean', ['copy', 'styles'], cb);
});

gulp.task('serve', ['build'], function() {
    if (!prod) {
        gulp.watch([
            path.join(srcDir, '**/*'),
            path.join('!'+paths.styles.src,'**/*')
        ], ['copy']);
        gulp.watch([path.join(paths.styles.src, '**/*')], ['styles']);
    }
    return gulp.src(destDir)
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: false,
            port: 8000
        }));
});

gulp.task('styles', ['bower'], function() {
    var sassOpts = prod? {style: 'compressed'} : {sourcemap: true};
    var task = sass(paths.styles.src, sassOpts);
    if (!prod) {
        task = task.pipe(sourcemaps.write('./maps'));
    }
    task.on('error', function (err) {console.error('Error', err.message);});
    return task.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('copy', ['bower-js', 'bower-assets'], function() {
    return gulp.src([
        path.join(srcDir, '**/*'),
        path.join('!'+paths.styles.src,'**/*')
    ])
        .pipe(changed(destDir))
        .pipe(gulp.dest(destDir));
});

gulp.task('bower', function() {
    return gulp.src('./bower.json')
        .pipe(install());
});


gulp.task('bower-js', ['bower'], function() {
    return gulp.src(paths.bower.jsDeps.map(function(dep) {
        return path.join(paths.bower.src, dep);
    }))
        .pipe(changed(paths.bower.jsDest))
        .pipe(gulp.dest(paths.bower.jsDest))
});

gulp.task('bower-assets', ['bower'], function() {
    return gulp.src(paths.bower.assetDeps.map(function(dep) {
        return path.join(paths.bower.src, dep);
    }), {base: paths.bower.src})
        .pipe(changed(paths.bower.assetDest))
        .pipe(gulp.dest(paths.bower.assetDest));
});
