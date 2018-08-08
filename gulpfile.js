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
const swPrecache = require('sw-precache');
const runSequence = require('run-sequence');
const packageJson = require('./package.json');

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

function writeServiceWorkerFile(handleFetch, callback) {
	const config = {
		cacheId: packageJson.name,
		handleFetch: handleFetch,
		navigateFallback: 'index.html',
		navigateFallbackWhitelist: [/^(?!\/__).*/],
		runtimeCaching: [{
			urlPattern: /ma-life-task\.firebaseapp\.com/,
			handler: 'networkFirst',
			options: {
				cache: {
					name: packageJson.name
				}
			}
		}],
		staticFileGlobs: [
			'./build/assets/**/*.*'
		],
		stripPrefix: './build/',
		verbose: true
	};
	swPrecache.write('./build/service-worker.js', config, callback);
}


gulp.task('clean-build', () =>
	del('./build/*', { force: true })
);

gulp.task('npm-dependencies', () =>
	gulp.src(npmFiles(), { base: '.' })
		.pipe(gulp.dest('./build'))
);

gulp.task('copy-assets', () =>
	gulp.src('./assets/**/*', { base: '.' })
		.pipe(gulp.dest('./build'))
);

gulp.task('copy-manifest', () =>
	gulp.src('./manifest.json', { base: '.' })
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

gulp.task('create-service-worker', callback =>
	writeServiceWorkerFile(true, callback)
);

gulp.task('default', () =>
	runSequence(
		'clean-build',
		'npm-dependencies',
		'copy-manifest',
		'copy-assets',
		'lint-js',
		'compress-js',
		'compress-css',
		'compress-html',
		'create-service-worker'
	)
);

gulp.task('watch-js', () =>
	gulp.watch(['./src/*.js', './components/**/*.js'], ['lint-js'])
);

gulp.task('server-dev', () =>
	gulp.src('.')
		.pipe(webserver({ livereload: true, open: true }))
);

