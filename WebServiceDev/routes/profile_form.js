var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var multer = require("multer");
var uuid = require("uuid");
const mysql = require("mysql2/promise")


//mysql 접속 정보
// var mysql = require("mysql");
const connInfo = {
    host: 'masters.cikt1o6c5cp1.us-east-1.rds.amazonaws.com',
    part: 3306,
    user: 'admin',
    password: 'masters1234',
    database: 'innodb'
};


const conn = mysql.createPool(connInfo);

//mysql 접속하기
// conn.connect(function(err){
//     if (err) throw err;
//     console.log("successfully connected");
// });

router.get('/', function(req, res, next) {
    res.render('profile_form');
});



//
router.post('/', async function(req, res) {
    var imgString = await req.body.imgString;
    var name = await req.body.name;
    var introduction = await req.body.introduction;
    var masterField = await req.body.masterField;
    var currentState = await req.body.currentState;
    var finalEducation = await req.body.finalEducation;
    var careerIntroduction = await req.body.careerIntroduction;
    var careerStart = await req.body.careerStart;
    var careerEnd = await req.body.careerEnd;
    var hourlyWage = await req.body.hourlyWage;
    var advisoryFee = await req.body.advisoryFee;
    
    var results = upload(imgString, name, introduction, masterField, currentState, finalEducation, careerIntroduction, careerStart, careerEnd, hourlyWage, advisoryFee);
    results.then((row) => {
        if (row == 1)
            res.json({"result": "success"});
        else
            res.json({"result": "failed"});
    });
})



const upload = async (imgString, name, introduction, masterField, currentState, finalEducation, careerIntroduction, careerStart, careerEnd, hourlyWage, advisoryFee) => {
    const connection = await conn.getConnection(async conn=>conn);
    try {
        await connection.beginTransaction();
        var insert_query = "INSERT INTO innodb.mastersInfo (img, name, introduction, masterField, currentState, finalEducation, careerIntroduction, careerStart, careerEnd, hourlyWage, advisoryFee, createdAt, modidate) VALUES (?,?,?,?,?,?,?,?,?,?,?,now(),now())";
        var params = [imgString, name, introduction, masterField, currentState, finalEducation, careerIntroduction, careerStart, careerEnd, hourlyWage, advisoryFee];
        await connection.query(insert_query, params);
        await connection.commit();
        connection.release;
        console.log('successfully saved');
        return true;
    }
    catch(err) {
        await connection.rollback();
        connection.release;
        console.log(err);
        return false;
    }
}



 
// router.post('/profileFormClick', function(req, res){
//     console.log("aaaaaaaaaa");
    
    // var file = '#fileSelection'[0].files[0];
    // console.log("file");
    
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    
    // var imgString = "";
    // reader.onloadend = function() {
    //     imgString = reader.result;
    //     console.log(imgString);
    // }

    //mariaDB에 넣고 싶은 정보 정하기 << 나중에 interface에서 받아오기
    // var info = {
    //     // "img": imgString,
    //     "name": req.body.name,
    //     "introduction": req.body.introduction,
    //     "masterField": req.body.masterField,
    //     "currentState": req.body.currentState,
    //     "finalEducation": req.body.finalEducation,
    //     "careerIntroduction": req.body.careerIntroduction,
    //     "careerStart": req.body.careerStart,
    //     "careerEnd": req.body.careerEnd,
    //     "hourlyWage": req.body.hourlyWage,
    //     "advisoryFee": req.body.advisoryFee
    // };
    //mariaDB에 정보 넣기
    // var imgsrc = null;
    
    
    
    
    // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    //     var imageName = file.name
    //     console.log(imageName)
    //     var uuidname = uuid.v1()
    //     imgsrc = "34.196.27.95:3000/images/" + uuidname + file.name;
    // };
    // var insertSQL = 'INSERT INTO innodb.mastersInfo (img, name, introduction, masterField, currentState, finalEducation, careerIntroduction, careerStart, careerEnd, hourlyWage, advisoryFee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // var params = [info['img'], info['name'], info['introduction'], info['masterField'], info['currentState'], info['finalEducation'], info['careerIntroduction'], info['careerStart'], info['careerEnd'], info['hourlyWage'],  info['advisoryFee']];

    // conn.query(insertSQL, params, function(err, rows){
    //     if (err) console.log(err);
    //     else {
    //         console.log("successfully saved");
    //         // file.mv('public/images/' + uuidname + file.name)
    //         res.redirect('/');
    //     }
    // }); 

    
// });

module.exports = router;
