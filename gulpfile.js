const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const npmFiles = require('gulp-npm-files');
const cleanCss = require('gulp-clean-css');
const runSequence = require('run-sequence');

gulp.task('clean-build', () =>
	del('./build/*', { force: true })
);

gulp.task('npm-dependencies', () =>
	gulp.src(npmFiles(), { base: '.' })
	.pipe(gulp.dest('./build'))
);

gulp.task('compress-js', () =>
	gulp.src('./components/**/*.js', { base: '.' })
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

gulp.task('default', () =>
	runSequence(
		'clean-build',
		'npm-dependencies',
		'compress-js',
		'compress-css',
		'compress-html'
	)
);