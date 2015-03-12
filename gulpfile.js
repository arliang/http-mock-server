var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var crypto = require('crypto');
var through = require('through2');
var minifycss = require('gulp-minify-css');


var path = require('path');
var fs = require('fs');

var out_path = './public/javascripts/';
var out_css = './public/css/';
var out_img = './public/images/';
var out_html = './public/html/';
var html_path = './html/';
var css_path = './css/';
var img_path = './images/';
var js_reg= /<script(?:.*?)src=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/script>)*/gm;
var css_reg= /<link(?:.*?)href=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/>)*/gm;

var map = {};

//
var getFileMd5Str = function (fileContent) {
	return crypto.createHash('md5').update(fileContent).digest('hex');
};

var getConfig = function () {
	return JSON.parse(fs.readFileSync('./js/config.json', 'utf-8'));
};

var createFile = function (obj) {
	var stream = gulp.src(obj.src);

	if(obj.merge){
		stream =  stream.pipe(concat(obj.name));
	}

	if(obj.compress){
		stream = stream.pipe(uglify());
	}

	stream.pipe(gulp.dest(out_path));
};

var createMap = function (path, name) {
	var context = fs.readFileSync(path + name, "utf-8");
	var md5 = getFileMd5Str(context);

	map[name] = md5;
};

var replaceMD5 = function (obj) {
	gulp.src(html_path + '*.html')
		.pipe(replace(js_reg, function (a, b){
			var src = b.indexOf("?") > -1 ? b.substring(0,b.indexOf("?")) : b;
			var	file = src.substring(src.lastIndexOf('/') + 1);
			var md5 = map[file] || new Date().getTime();

			return a.replace(b, src + "?v=" + md5);
		}))
		.pipe(replace(css_reg, function (a, b) {
			var src = b.indexOf("?") > -1 ? b.substring(0,b.indexOf("?")) : b;
			var	file = src.substring(src.lastIndexOf('/') + 1);
			var md5 = map[file] || new Date().getTime();

			return a.replace(b, src + "?v=" + md5);
		}))
		.pipe(gulp.dest(out_html));
};

var createCss = function (isMini) {
	var stream = gulp.src(css_path + '*.css')
				.pipe(concat('style.pack.css'));


	if(isMini){
		stream = stream.pipe(minifycss());
	}

	stream.pipe(gulp.dest(out_css));


	createMap(out_css, 'style.pack.css');
};

var createImage = function () {
	gulp.src(img_path + '*.*')
		.pipe(gulp.dest(out_img));
};

var createJs = function () {
	var config = getConfig();

	for(var c in config){
		createFile(config[c]);
		createMap(out_path, config[c].name);
	}
};


gulp.task('default', function() {
	createJs();
	createImage();
	createCss(false);
});

gulp.task('release', function () {
	createCss(true);
	createImage();
	createJs();
	replaceMD5();
});


gulp.task('watch', function () {
	gulp.watch('./js/**/*.js', ['default']);
});

