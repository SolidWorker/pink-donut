'use strict';

const gulp = require('gulp'),
		browsersync = require('browser-sync').create(),
		del = require('del'),
		pug = require('gulp-pug'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		csscomb = require('gulp-csscomb'), /* minificator, not for dev, only production */
		notify = require('gulp-notify'), /* error message */
		imagemin = require('gulp-imagemin'),
		plumber = require('gulp-plumber');  /* формируем вывод об ошибке без прерывания сборки */

// Прописываем пути
const path = {
	dev: {
		pug: 'dev/pug/pages/*.pug',
		sass: 'dev/static/sass/style.sass',
		img: 'dev/static/img/**/*',
		fonts: 'dev/static/fonts/**/*.*',
		js: 'dev/static/js/**/*.js'
	},
	build: {
		html: 'build/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		js: 'build/js/'
	},
	watch: {
		pug: 'dev/pug/**/*.pug',
		sass: 'dev/static/sass/**/*.sass',
		img: 'dev/static/img/**/*',
		fonts: 'dev/static/fonts/**/*.*',
		js: 'dev/static/js/**/*.js'
	}
};

// Сервер
gulp.task('browsersync', function() {
	browsersync.init({
		server: './build'
	});
});

// Чистка
gulp.task('clean', function() {
	return del([
		'./build'
	])
});

// Сборка страниц PUG
gulp.task('pug', function() {
	return gulp.src(path.dev.pug)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.on('error', notify.onError(function(error) {
			return "Message to the notifier: " + error.message;
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(browsersync.reload({
			stream: true
		}));
});

// Сборка SASS
gulp.task('sass', function() {
	return gulp.src(path.dev.sass)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.on('error', notify.onError(function(error) {
			return "Message to the notifier: " + error.title + error.message;
		}))
		.pipe(autoprefixer(['last 2 version']))
		.pipe(gulp.dest(path.build.css))
		.pipe(browsersync.reload({
			stream: true
		}));
});

// Работа с JS
gulp.task('js', function() {
	return gulp.src(path.dev.js)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.js))
		.pipe(browsersync.reload({
			stream: true
		}));
});

// Работа с IMG
gulp.task('img', function() {
	return gulp.src(path.dev.img)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(path.build.img))
		.pipe(browsersync.reload({
			stream: true
		}));
});

// Шрифты
gulp.task('fonts', function() {
	return gulp.src(path.dev.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browsersync.reload({
			stream: true
		}));
});

// Watcher
gulp.task('watch', ['browsersync', 'pug', 'sass', 'js', 'img'], function () {
	gulp.watch(path.watch.pug, ['pug']);
	gulp.watch(path.watch.sass, ['sass']);
	gulp.watch(path.watch.img, ['img']);
	gulp.watch(path.watch.js, ['js']);
});

// Describe tasks
gulp.task('default', ['watch']);