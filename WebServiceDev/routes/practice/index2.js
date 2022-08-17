var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise');

var conn = mysql.createPool({
	host: 'masters.cikt1o6c5cp1.us-east-1.rds.amazonaws.com',
    part: 3306,
    user: 'admin',
    password: 'masters1234',
    database: 'innodb'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/test', async function(req, res){
    var imgString = await req.body.img;
    console.log('1');
    
    var results = upload(imgString);
    results.then((row) => {
        console.log('send');
        res.json({"img":imgString});
    });
});

const upload = async (imgString) => {
    const connection = await conn.getConnection(async conn=>conn);
    await connection.beginTransaction();
    var insert_query = "INSERT INTO innodb.test (img) VALUES (?)";
    var params = [imgString];
    connection.query (insert_query, params, function (err, rows) {
        if(err) {
            console.log(err);
            return false;
        }
    });
    console.log('success');
    return true;
};

//advanced
/*router.post('/test', async function(req, res){
    var imgString = await req.body.img;
    console.log('1');
    
    var results = upload(imgString);
    if (results1 == 1 ){
        var results2 = download(5);
        results2.then((imgArray) => {
            if(imgArray.length>0) {
                res.json({
                    "img":imgArray,
                    "result":"success"
                });
            } else {
                res.json({
                    "img":"",
                    "result":"failed"
                });
            }
        });
    } else {
        res.json({
            "img":"",
            "result":"failed"
        });
    }
});

const upload = async (imgString) => {
    const connection = await conn.getConnection(async conn=>conn);
    try {
        await connection.beginTransaction();
        var insert_query = "INSERT INTO innodb.test (img) VALUES (?)";
        var params = [imgString];
        await connection.query (insert_query, params);
        await connection.commit();
        connection.release;
        console.log('success');
        return true;
    } catch (err) {
        await connection.rollback();
        connection.release
        console.log(err);
        return false;
    }
};

const download = async (numItems) => {
    const connection = conn.getConnection(async conn=>conn);
    try {
        await connection.beginTransaction();
        var select_query = "SELECT CONVERT(img USING urf8) AS imgString FROM innodb.test ORDER BY id DESC limit 0, " + (numItems);
        const [rows] = await connection.query(select_query);
        
        var imgArray = [];
        for (var i = 0; i <rows,length; i++)
            imgArray.push([rows[i]]);
            
        await connection.commit();
        connection.release;
        return imgArray;
    } catch (err) {
        await connection.rollback();
        connection.release;
        console.log(err);
        return false;
    }
}*/

module.exports = router;
