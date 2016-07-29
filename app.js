var express = require('express'); //include, import express
var path= require('path');
var app = express(); //express를 app객체에 넣어 사용하기 쉽게
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB); //DB연결
var db = mongoose.connection; //mongoose디비를 db객체에

db.once("open", function() { //연결되면
  console.log("DB connected!");
});
db.on("error", function(err) { //에러나면
  console.log("DB ERROR :", err);
});
//스키마
var dataScheme = mongoose.Schema({
  name: String,
  count: Number
}); //object를 인자로한 스키마
var Data = mongoose.model('data', dataScheme); //모델을 담는 변수는 첫글자가 대문자.
Data.findOne({name:"myData"}, function(err, data) {
  if(err) return console.log("Data Error:", err);
  if(!data) {
    Data.create({name:"myData", count:0}, function (err, data) {
      if(err) return console.log("Data Error:", err);
      console.log("Counter initialized :", data);
    });
  }
});

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//var data={count:0};

app.get('/', function (req,res) {
  Data.findOne({name:"myData"}, function(err, data) {
    if(err) return console.log("Data Error:", err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("Data Error:", err);
      res.render('my_first_ejs', data);
    });
  });
});


app.get('/reset', function (req,res) {
  data.count = 0;
  res.render('my_first_ejs', data);
});

app.get('/set/count', function (req,res) {
  if(req.query.count) data.count=req.query.count;
  res.render('my_first_ejs', data);
});

app.get('/set/:num', function (req,res) {
  data.count = req.params.num;
  res.render('my_first_ejs', data);
});


app.get('/', function (req,res){
  res.render('my_first_ejs');
});

app.listen(3000, function() {
  console.log('server On!!');
});
