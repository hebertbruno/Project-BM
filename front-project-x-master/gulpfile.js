const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const hash = require('gulp-hash');
const inject = require('gulp-inject');
const less = require('gulp-less');
const minifycss = require('gulp-minify-css');
const pcLess = require('postcss-less');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const reporter = require('postcss-reporter');
const runSeq = require('run-sequence');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('stylelint');
const uglify = require('gulp-uglify');
const util = require('gulp-util');

const SRC_PATH = './app/frontend';
const LINT_SEVERITY = 1; // = eslint warnings
const FRONT_ENTRIES = [`${SRC_PATH}/index.js`];
const production = process.env.NODE_ENV === 'production';

// new frontend libs should be added here
const vendors = [
    'axios',
    'bluebird',
    'classnames',
    'material-ui',
    'moment',
    'prop-types',
    'react',
    'react-dom',
    'react-router-dom',
    'react-tap-event-plugin',
];

gulp.task('browserSync', function() {
    return browserSync({
        open: false, // dont open browser
        port: process.env.PORT || 9999,
        server: {
            baseDir: './app/build',
        },
    });
});

gulp.task('build', ['clean'], function() {
    return gulp.start(['build:html']);
});

gulp.task('build:app', ['lint:app'], function() {
    return browserify({
        entries: FRONT_ENTRIES,
        extensions: ['.js', '.jsx'],
        debug: !production,
    })
        .external(vendors) // Specify all vendors as external source
        .transform(babelify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(production ? hash() : util.noop())
        .pipe(production ? util.noop() : sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(production ? util.noop() : sourcemaps.write('./'))
        .pipe(gulp.dest('./app/build/js/'))
        .pipe(production ? hash.manifest('assets.json', {
            append: true,
            space: 2,
        }) : util.noop())
        .pipe(production ? gulp.dest('./app/build') : util.noop());
});

gulp.task('build:appcss', ['lint:css'], function() {
    return gulp.src([`${SRC_PATH}/**/*.less`])
        .pipe(less())
        .pipe(concat('./css/app.css'))
        .pipe(production ? hash() : util.noop())
        .pipe(autoprefixer({browsers: 'last 2 versions'}))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./app/build/'))
        .pipe(production ? hash.manifest('assets.json', {
            append: true,
            space: 2,
        }) : util.noop())
        .pipe(production ? gulp.dest('./app/build') : util.noop());
});

gulp.task('build:css', ['build:vendorcss', 'build:appcss']);

gulp.task('build:html', ['build:js', 'build:css'], function() {
    const options = {
        removeTags: true,
        relative: false,
        ignorePath: 'app/build',
        addPrefix: '/',
    };

    const vendorCSS = Object.assign({}, options,
            {starttag: '<!-- inject:vendor:css -->'});
    const appCSS = Object.assign({}, options,
            {starttag: '<!-- inject:app:css -->'});
    const vendorJs = Object.assign({}, options,
            {starttag: '<!-- inject:vendor:js -->'});
    const appJs = Object.assign({}, options,
            {starttag: '<!-- inject:app:js -->'});

    return gulp.src(`${SRC_PATH}/index.html`)
        .pipe(inject(gulp.src('./app/build/css/vendor*.min.css', {read: false}),
                vendorCSS))
        .pipe(inject(gulp.src('./app/build/css/app*.min.css', {read: false}),
                appCSS))
        .pipe(inject(gulp.src('./app/build/js/vendor*.js', {read: false}),
                vendorJs))
        .pipe(inject(gulp.src('./app/build/js/app*.js', {read: false}), appJs))
        .pipe(gulp.dest('./app/build/'));
});

gulp.task('build:js', ['build:app', 'build:vendor']);

gulp.task('build:vendor', function() {
    const b = browserify({
        debug: !production,
    });

    // require all libs specified in vendors array
    vendors.forEach(function(lib) {
        b.require(lib);
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(production ? hash() : util.noop())
        .pipe(production ? util.noop() : sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(production ? util.noop() : sourcemaps.write('./'))
        .pipe(gulp.dest('./app/build/js'))
        .pipe(production ? hash.manifest('assets.json', {
            append: true,
            space: 2,
        }) : util.noop())
        .pipe(production ? gulp.dest('./app/build') : util.noop());
});

gulp.task('build:vendorcss', function() {
    return gulp.src(['./node_modules/bootstrap/less/bootstrap.less'])
        .pipe(less())
        .pipe(concat('./css/vendor.css'))
        .pipe(production ? hash() : util.noop())
        .pipe(autoprefixer({browsers: 'last 2 versions'}))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./app/build/'))
        .pipe(production ? hash.manifest('assets.json', {
            append: true,
            space: 2,
        }) : util.noop())
        .pipe(production ? gulp.dest('./app/build') : util.noop());
});

gulp.task('clean', function() {
    return gulp.src(['./app/build/*'], {read: false}).pipe(clean());
});

gulp.task('default', ['server']);

gulp.task('lint:app', function() {
    return gulp.src([`${SRC_PATH}/**/*.js`, '!node_modules/**'])
        .pipe(eslint({
            quiet: function(message) {
                // only logs if the severity is greater than the configured
                return message.severity > LINT_SEVERITY;
            },
        }))
        // default eslint reports
        .pipe(eslint.format())
        // in case of an error keep linting until the end
        .pipe(eslint.failAfterError());
});

gulp.task('lint:css', function() {
    return gulp.src([`${SRC_PATH}/**/*.less`])
        .pipe(postcss(
            [
                stylelint({
                    failAfterError: true,
                }),
                reporter({ clearMessages: true }),
            ],
            {
                syntax: pcLess,
            }
        ));
});

gulp.task('reload:app', function() {
    runSeq('build:app', browserSync.reload);
});

gulp.task('reload:appcss', function() {
    runSeq('build:appcss', browserSync.reload);
});

gulp.task('server', function() {
    return runSeq('clean', 'build:html', 'browserSync', 'watch');
});

gulp.task('watch', function() {
    gulp.watch([`${SRC_PATH}/**/*.js`], ['reload:app']);
    gulp.watch([`${SRC_PATH}/**/*.less`], ['reload:appcss']);
});
