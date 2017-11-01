const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

// Автоперезагрузка при изменении файлов в папке `dist`:
// Принцип: меняем файлы в `/src`, они обрабатываются и переносятся в `dist` и срабатывает автоперезагрузка.
// Это таск нужен только при локальной разработке.
gulp.task('livereload', () => {
    browserSync.create();
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: [
            'dist/**/*.*'
        ]
    });
});

gulp.task('styles', () => {
    gulp.src('src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('img-prod', () => {
    gulp.src('src/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('js', () => {
    gulp.src('src/js/**/*.*')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', () => {
    gulp.src('src/index.ejs')
        .pipe(ejs().on('error', gutil.log))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('eslint', () => {
    return gulp.src(['src/js/**/*.*', 'gulpfile.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('stylelint', () => {
    return gulp.src(['src/less/**/*.less', '!src/less/normalize.less'])
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }));
});

// Отслеживание изменений в файлах, нужно только при локальной разработке
gulp.task('watch', () => {
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.ejs', ['html']);
    gulp.watch('src/img/**/*.*', ['img']);
    gulp.watch('src/js/**/*.*', ['js']);
});

gulp.task('default', ['stylelint', 'styles', 'html', 'img', 'eslint', 'js', 'livereload', 'watch']);
gulp.task('prod', ['stylelint', 'styles', 'html', 'img-prod', 'eslint', 'js']);
gulp.task('lint', ['stylelint', 'eslint']);
