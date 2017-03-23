'use strict';

var basePaths = {
  app: 'app/',
  dist: 'dist/',
  bower: 'bower_components/'
};

var paths = {
  images: {
    app: basePaths.app + 'images/',
    dist: basePaths.dist + 'images/'
  },
  scripts: {
    app: basePaths.app + 'scripts/',
    dist: basePaths.dist + 'scripts/'
  },
  styles: {
    app: basePaths.app + 'styles/',
    dist: basePaths.dist + 'styles/'
  },
  fonts: {
    app: basePaths.app + 'fonts/',
    dist: basePaths.dist + 'fonts/'
  },
  jsons: {
    app: basePaths.app + 'jsons/',
    dist: basePaths.dist + 'jsons/'
  },
  templetes: {
    app: basePaths.app + 'templetes/',
    dist: basePaths.dist + 'templetes/'
  }
};
var distFile = {
  templetesJs: paths.templetes.dist + '**/*.js',
  templetesCss: paths.templetes.dist + '**/*.css'
};
var appFiles = {
  html: basePaths.app + '*.html',
  scripts: paths.scripts.app + '**/*.js',
  styles: paths.styles.app + '**/*.scss',
  images: paths.images.app + '**/*.{png,jpg,gif,svg}',
  fonts: paths.fonts.app + '**/*.{eot,svg,ttf,woff,woff2,css}',
  templetes: paths.templetes.app + '**/*',
  templetesJs: paths.templetes.app + '**/*.js',
  templetesCss: paths.templetes.app + '**/*.css',
  jsons: paths.jsons.app + '**/*.json',
  bowerCss: basePaths.bower + '**/*.min.css',
  bowerJs: basePaths.bower + '**/*.min.js',
  bowerFonts: basePaths.bower + '**/*.{eot,svg,ttf,woff,woff2}'
};


var gulp = require('gulp');
//css
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
//html
var htmlmin = require('gulp-htmlmin');
//js
var uglify = require('gulp-uglify');
//images
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');

var order = require("gulp-order");//文件顺序
var argv = require('yargs').argv;
var useref = require('gulp-useref');
var rev = require('gulp-rev'); //生成哈希码
var revReplace = require('gulp-rev-replace');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function () {

  gulp.src(appFiles.styles)
    .pipe(changed(paths.styles.dist))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      precision: 10,
      includePaths: ['.']
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', 'Firefox >= 4'))
    .pipe(plumber())
    .pipe(concat('style.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('html', function () {
  gulp.src(appFiles.html)
    .pipe(changed(basePaths.dist))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(basePaths.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('jsons', function () {
  gulp.src(appFiles.jsons)
    .pipe(changed(paths.jsons.dist))
    .pipe(plumber())
    .pipe(gulp.dest(paths.jsons.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('templetes', function () {
  gulp.src(appFiles.templetesJs)
    .pipe(changed(paths.templetes.dist))
    .pipe(order(['app/templetes/jquery.min.js', appFiles.templetesJs]))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(plumber())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.templetes.dist))
    .pipe(reload({ stream: true }));

  gulp.src(appFiles.templetesCss)
    .pipe(changed(paths.templetes.dist))
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.templetes.dist))
    .pipe(reload({ stream: true }));
 });

gulp.task('scripts', function () {
  gulp.src(appFiles.scripts)
    .pipe(changed(paths.scripts.dist))
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(plumber())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(reload({ stream: true }));


});

gulp.task('images', function () {
  gulp.src(appFiles.images) // 指明源文件路径、并进行文件匹配 .{png,jpg,gif,svg}
    .pipe(changed(paths.images.dist))
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    }))
    .pipe(gulp.dest(paths.images.dist)) // 输出路径
    .pipe(reload({ stream: true }));
});

gulp.task('fonts', function () {
  gulp.src(appFiles.fonts) //指明源文件路径、并进行文件匹配 .{eot,svg,ttf,woff,woff2}
    .pipe(changed(paths.fonts.dist))
    .pipe(gulp.dest(paths.fonts.dist))
    .pipe(reload({ stream: true }));

});

gulp.task('bowerJs', function () {
  gulp.src(appFiles.bowerJs)
    .pipe(changed(paths.templetes.dist))
    .pipe(gulp.dest(paths.templetes.dist))
    .pipe(reload({ stream: true }));

});

gulp.task('bowerCss', function () {
  gulp.src(appFiles.bowerCss)
    .pipe(changed(paths.templetes.dist))
    .pipe(gulp.dest(paths.templetes.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('bowerFonts', function () {
  gulp.src(appFiles.bowerFonts)
    .pipe(changed(paths.templetes.dist))
    .pipe(gulp.dest(paths.templetes.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('help', function () {
  console.log('gulp build             文件打包，开启服务器并打开页面');
  console.log('gulp watch             文件监控');
  console.log('gulp help              gulp参数说明');
  console.log('gulp serve             开启服务器并打开页面');
  console.log('gulp <module>          部分模块打包（默认全部打包）');
});

gulp.task('clean', function () {
  gulp.src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch(appFiles.styles, ['styles']);
  gulp.watch(appFiles.scripts, ['scripts']);
  gulp.watch(appFiles.images, ['images']);
  gulp.watch(appFiles.html, ['html']);
  gulp.watch(appFiles.jsons, ['jsons']);
  gulp.watch(appFiles.templetes, ['templetes']);
  gulp.watch(appFiles.fonts, ['fonts']);
  gulp.watch(appFiles.bowerJs, ['bowerJs']);
  gulp.watch(appFiles.bowerCss, ['bowerCss']);
  gulp.watch(appFiles.bowerFonts, ['bowerFonts']);
});


gulp.task('default', ['styles', 'fonts', 'scripts', 'images', 'html', 'jsons', 'templetes', 'bowerJs', 'bowerCss', 'bowerFonts']);

gulp.task('serve', ['watch'], function () {
  browserSync({
    server: {
      baseDir: './dist'
    },
    function (err, bs) {
      console.log(bs.options.getIn(['urls', 'local']));
    }
  });
});

gulp.task('build', ['default', 'serve']);
/*gulp.task('builds', ['clean'], function() {
    gulp.start('styles', 'fonts', 'scripts', 'images', 'html', 'jsons', 'completes');
});*/

