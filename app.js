var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
//var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
//上传文件框架，可以是一个文件也可以是多个文件
var multer = require('multer');

var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/mydb');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(serveStatic('bower_components'));

app.locals.moment = require('moment');
app.listen(port);

// 初始数据录入
// var tmp = new Movie({
// 	doctor:"Travel Days",
// 	title:"岁月成碑",
// 	language:"中文",
// 	country:"中国",
// 	summary:"岁月成碑/——地球往事/月见草，覆了风霜，/离群之鸟犹自彷徨。/紫丁香，散遗世芬芳，/逆着风荣枯一场。/告别土壤，白桦再难生长。/植根星海，又能否重获青苍？/每夜放逐信仰，四光年之外去流浪——/纵躯壳埋葬，灵魂自由释放。/霓虹中，错落影像，/满城声色褪去喧嚷。/废墟上，余碑文几行，/未铭记何谈淡忘。/血色夕阳，温热化作苍凉。/林海莽莽，天穹下宛若尘芒。/此间彼方流浪，分不清决绝和迷惘，/风又过山岗，而梦已泛黄。/思绪弥散跌落未知远方， /故事已无人再讲，/谁读身前天外满眼炎凉，/才启示星辰深处的异象。/于绝境之中，许拯救祈望， /幽暗深林虚掩之下，或仍藏涅槃微光。 /命运何种模样，毋须想，/随时间，尽归于沧桑",
// 	flash:"2782004",
// 	poster:"http://pic.xiami.net/tmpimg/847/55d85c9f4f5934975.jpg",
// 	year:2015,
//	page:2
// })
// tmp.save(function(err) {
// 	console.log(err);
// })

console.log('started');

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}

	res.render('index', {
		title: '视频库',
		movies: movies
	})

	})
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie) {
		if(err){
			console.log(err);
		}
		res.render('detail',{
			title: '视频- ' + movie.title,
			movie: movie
		})
	})
})

//admain page
app.get('/admain/movie',function(req,res){
	res.render('admain',{
		title:'b站视频后台录入页',
		movie:{
			doctor:'',
			country:'',
			title:'',
			year:'',
			page:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	})
})

//admin update movie
app.get('/admin/update/:id',function(req,res) {
	var id = req.params.id;
	Movie.findById(id,function(err,movie) {
		if(err){
			console.log(err);
		}
		res.render('admain',{
			title: 'b站视频后台更新页',
			movie: movie
		})
	})
})


//admin post movie
app.post('/admin/movie/new', function(req,res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(movieObj.page=='')movieObj.page=1;
	if(id != "undefined"){
		Movie.findById(id, function(err,movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err,movie) {
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+ movie._id);
			})
		});
	}
	else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language:movieObj.language,
			country:movieObj.country,
			summary:movieObj.summary,
			flash:movieObj.flash,
			poster:movieObj.poster,
			year:movieObj.year,
			page:movieObj.page
		})
		_movie.save(function(err,movie) {
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+ movie._id);
		})
	}
})

//list page
app.get('/admain/list',function(req,res){
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err);
		}
		res.render('list',{
			title:'视频列表页',
			movies:movies
		})
	})
	
})
//list delete item
app.delete('/admin/list',function(req,res) {
	var id=req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie) {
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
})