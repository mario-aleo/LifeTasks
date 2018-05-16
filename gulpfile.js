const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const npmFiles = require('gulp-npm-files');
const cleanCss = require('gulp-clean-css');
const webserver = require('gulp-webserver');
const runSequence = require('run-sequence');

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

gulp.task('clean-build', () =>
	del('./build/*', { force: true })
);

gulp.task('npm-dependencies', () =>
	gulp.src(npmFiles(), { base: '.' })
		.pipe(gulp.dest('./build'))
);

gulp.task('compress-js', () =>
	gulp.src(['./src/*.js', './components/**/*.js'], { base: '.' })
		.pipe(babel({ presets: ['env'] }))
		.pipe(uglify())
		.pipe(gulp.dest('./build'))
);

gulp.task('compress-css', () =>
	gulp.src('./components/**/*.css', { base: '.' })
		.pipe(cleanCss())
		.pipe(gulp.dest('./build'))
);

gulp.task('compress-html', () =>
	gulp.src(['index.html', './components/**/*.html'], { base: '.' })
		.pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
		.pipe(gulp.dest('./build'))
);

gulp.task('lint-js', () =>
	gulp.src(['./src/*.js', './components/**/*.js'], { base: '.' })
		.pipe(eslint({ fix: true }))
		.pipe(eslint.format())
		.pipe(gulpIf(isFixed, gulp.dest('.')))
		.pipe(eslint.failAfterError())
);

gulp.task('default', () =>
	runSequence(
		'clean-build',
		'npm-dependencies',
		'lint-js',
		'compress-js',
		'compress-css',
		'compress-html'
	)
);

gulp.task('watch-js', () =>
	gulp.watch(['./src/*.js', './components/**/*.js'], ['lint-js'])
);

gulp.task('server-dev', () => 
	gulp.src('.')
		.pipe(webserver({ livereload: true, open: true }))
);

