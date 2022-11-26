const fs = require("fs");
const csv = require('fast-csv');
const connect=require('./config');
var data = [];
var OBJECT_KEYS=[];

fs.createReadStream('customer.csv')
.pipe(csv.parse({ headers: true }))
.on('error', error => console.error(error))
.on('data', row =>{
     data.push(row);
}).on('end', () => {
     OBJECT_KEYS=Object.keys(data[0]);
    if (data.length!=0) {
        var query='INSERT INTO customercsv VALUES ?';
        var temp=[];
        for (let index = 0; index < data.length; index++) {
            var temp2=[];
            for (let j = 0; j < OBJECT_KEYS.length; j++) {
                temp2[j]=data[index][OBJECT_KEYS[j]];
            }
           temp[index]=temp2;
        }
        checkTableExit(connect,'customercsv').then((res)=>{
            if (res==true) {
                createTable(connect,'customercsv',OBJECT_KEYS).then((res2)=>{
                    connect.query(query,[temp], function (err, result) {
                        if (err) throw err;
                        console.log("Result: " + result);
                    });
                });
            }else{
                connect.query(query,[temp], function (err, result) {
                    if (err) throw err;
                    console.log("Result: " + result);
                });
            }
        })
    }
});
function createTable(con,tableName,columnName){
    return new Promise((resolve,reject)=>{
        var column='(';
        for (let index = 0; index < columnName.length; index++) {
            column+=`${columnName[index]} VARCHAR(255),`;
        }
        column=removeLastComma(column)+')'
        var sql =`CREATE TABLE ${tableName} `+column;
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length==0) {
                resolve(true)
             }else{
                 resolve(false);
             }
        });
    })
}
function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n) 
    return a;
}
function checkTableExit(con,tableName){
   return new Promise((resolve,reject)=>{
    var table=`SHOW TABLES LIKE '${tableName}'`;
    con.query(table, function (err, result) {
        if (err) throw err;
        if (result.length==0) {
           resolve(true)
        }else{
            resolve(false);
        }
    });
   })
}
