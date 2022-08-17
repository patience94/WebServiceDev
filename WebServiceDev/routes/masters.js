var express = require('express');
var router = express.Router();

var mysql = require("mysql");
var conn = mysql.createConnection({
	host: 'masters.cikt1o6c5cp1.us-east-1.rds.amazonaws.com',
    part: 3306,
    user: 'admin',
    password: 'masters1234',
    database: 'innodb'
});

// mysql 접속하기
conn.connect(function(err){
    if (err) throw err;
    console.log("mysql successfully connected from masters.js");
});

/* GET home page. */
router.get('/',async function(req, res, next) {
    var sql = "SELECT id, CONVERT (img USING utf8) as img ,name, introduction, masterField, currentState, finalEducation, careerIntroduction, " +
    "date_format(careerStart,'%Y-%m') careerStart, date_format(careerEnd,'%Y-%m') careerEnd, hourlyWage, advisoryFee, createdAt, modidate " +
    "FROM innodb.mastersInfo ORDER BY modidate DESC, id DESC";
    await conn.query(sql, function(err, rows){
        if (err) console.log(err);
        res.render('masters', {rows: rows});
    });
});

router.get('/masters_detail/:idx', async function(req,res,next)
{
    var idx = Number(req.params.idx);
    var sql = "SELECT CONVERT(img USING utf8) as img ,name, introduction, masterField, currentState, finalEducation, careerIntroduction, " +
    "date_format(careerStart,'%Y-%m') careerStart, date_format(careerEnd,'%Y-%m') careerEnd, hourlyWage, advisoryFee " + 
    "FROM innodb.mastersInfo WHERE id=?";
    await conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.render('masters_detail', {row:row[0]});
    });
});

router.post('/search', async function(req, res) {
	
	var keyWord = await req.body.keyWord;
    var sql = "SELECT CONVERT(img USING utf8) as img ,name, introduction, masterField, currentState, finalEducation, careerIntroduction, " +
    "date_format(careerStart,'%Y-%m') careerStart, date_format(careerEnd,'%Y-%m') careerEnd, hourlyWage, advisoryFee " + 
    "FROM innodb.mastersInfo WHERE masterField=? ORDER BY modidate DESC, id DESC";
    
    await conn.query(sql, keyWord, function(err, rows){
    	if (err) throw err;
    	res.json({"result": "success", "rows":rows});
    });
});
module.exports = router;
