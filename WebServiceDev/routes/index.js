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
    else console.log("mysql successfully connected from index.js");
});

/* GET home page. */
router.get('/', async function(req, res, next) {
    var sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo ORDER BY modidate DESC, id DESC';
    await conn.query(sql, function(err, rows){
        if (err) console.log(err);
        res.render('index', {rows: rows});
    });
});

/* read hire detail. */
router.get('/hire_detail/:idx',async function(req,res,next)
{
    var idx = Number(req.params.idx);
    var sql = "select * from innodb.businessInfo where id=?";
    await conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.render('hire_detail', {row:row[0]});
    });
});



/* write hire detail. */
router.get('/hire_detail_form', function(req,res,next){
    res.render('hire_detail_form');
});

router.post('/hire_detail_form', async function(req, res){
	var info = {
		"companyName":req.body.companyName,
		"businessType":req.body.businessType,
		"keyBusiness": req.body.keyBusiness,
		"email": req.body.email,
		"address": req.body.address + req.body.detailAddress,
		"calling": req.body.calling,
		"occupation": req.body.occupation,
		"state": req.body.state,
		"task": req.body.task,
		"term": req.body.term,
		"salary": req.body.salary,
		"license": req.body.license,
		"insurance": req.body.insurance,
		"worktimeStart": req.body.worktimeStart,
		"worktimeEnd": req.body.worktimeEnd,
		"detailInfo": req.body.detailInfo
	};
	var insertSQL = 'INSERT INTO innodb.businessInfo(companyName, businessType, keyBusiness, email, address, ' +
	'calling, occupation, state, task, term, salary, license, insurance, worktimeStart, worktimeEnd, detailInfo, ' + 
	'modidate, createdAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())';
			
	var params =  [info['companyName'], info['businessType'], info['keyBusiness'], info['email'], info['address'], 
	info['calling'], info['occupation'], info['state'], info['task'], info['term'], info['salary'], 
	info['license'], info['insurance'], info['worktimeStart'], info['worktimeEnd'], info['detailInfo']];
			
	await conn.query(insertSQL, params, function(err, rows){
		if (err) console.log(err);
		console.log("successfully saved");
	});
	res.redirect('/');
});

router.post('/search', async function(req, res) {
	var state = await req.body.state;
    var occupation = await req.body.occupation;
    var sql;
    var params;
    
    if (state=="*" && occupation =="*"){
    	sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo ORDER BY modidate DESC, id DESC';
    	params = [];
    } else if (state=="*") {
    	sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo WHERE occupation = ? ORDER BY modidate DESC, id DESC';
    	params = [occupation];
    } else if (occupation=="*") {
    	sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo WHERE state = ? ORDER BY modidate DESC, id DESC';
    	params = [state];
    } else {
    	sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo WHERE state = ? AND occupation =? ORDER BY modidate DESC, id DESC';
    	params = [state, occupation];
    }

    await conn.query(sql, params, function(err, rows){
    	if (err) throw err;
    	res.json({"result": "success", "rows":rows});
    });
});

module.exports = router;