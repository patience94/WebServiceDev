var express = require('express');
var router = express.Router();
var mysql = require("mysql2/promise");

var conn = mysql.createPool({
	host: 'masters.cikt1o6c5cp1.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'masters1234',
    database: 'innodb'
});

/* GET home page. */
router.get('/', async function(req, res, next) {
    var numItems = 1;
    var results = download(numItems);
    var sql = 'SELECT id, companyName, date_format(modidate,"%Y-%m-%d") modidate, businessType, address, occupation, salary, task FROM innodb.businessInfo ORDER BY modidate DESC LIMIT 1';
    var hireInfo = await conn.query(sql);
    results.then((rows) => {
        res.render("profile", {"result": "success", "rows": rows, "hireInfo": hireInfo});
    });
});

const download = async (numItems) => {
    const connection = await conn.getConnection(async conn=>conn);
    try {
        await connection.beginTransaction();
        var select_query = "SELECT CONVERT(img USING utf8) AS imgString, name, introduction, masterField, currentState, finalEducation, careerIntroduction, date_format(careerStart,'%Y-%m') careerStart, date_format(careerEnd,'%Y-%m') careerEnd, hourlyWage, advisoryFee FROM innodb.mastersInfo ORDER BY id DESC limit 0, " + (numItems);
        const rows = await connection.query(select_query);
        //  
        
        var arr = [];
        for (let i=0; i<rows.length; i++) {
            arr.push(rows[i]);
        }
        await connection.commit();
        connection.release;
        return arr;
    }
    catch {
        await connection.rollback();
        connection.release;
        return false;
    }
};

router.get('/project_detail/:idx',async function(req,res,next)
{
    const connection = await conn.getConnection(async conn=>conn);
    await connection.beginTransaction();
    var idx = Number(req.params.idx);
    var sql = "select * from innodb.businessInfo where id=?";
    await connection.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.render('project_detail', {row:row[0]});
    });
    connection.release;
});

router.get('/update/:idx', async function(req,res,next)
{
    var idx = Number(req.params.idx);
    var sql = "select * from innodb.businessInfo where id=?";
    await conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.render('update', {row:row[0]});
    });
});

router.post('/update', async function(req,res,next)
{
	var id = Number(req.body.id);
    var info = {
		"companyName":req.body.companyName,
		"businessType":req.body.businessType,
		"keyBusiness": req.body.keyBusiness,
		"email": req.body.email,
		"address": req.body.address,
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
	
	var sql =  'UPDATE innodb.businessInfo SET companyName=?, businessType=?, keyBusiness = ?, email=?, address=?, calling=?, ' +
	'occupation=?, state=?, task=?, term=?, salary=?, license=?, insurance=?, worktimeStart=?,worktimeEnd=?, detailInfo=?, modidate=now()' + 
	'WHERE id = ?';
	
	var params = [info['companyName'], info['businessType'], info['keyBusiness'], info['email'], info['address'], 
	info['calling'], info['occupation'], info['state'], info['task'], info['term'], info['salary'], info['license'], 
	info['insurance'], info['worktimeStart'], info['worktimeEnd'], info['detailInfo'], id];
	
    await conn.query(sql, params, function(err, rows)
    {
        if(err) console.error(err);
        res.redirect('/');
    });
});

module.exports = router;