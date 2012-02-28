var config=require('./config/config.js');

var mongo=require('mongodb').Server,db=require('mongodb').Db;
mongo=new mongo('localhost',27017,{auto_reconnect:true});

db=new db(config.db.collection,mongo,{});

var dbOpened=function(){
	db.authenticate(config.db.user,config.db.pass,dbAuthed);
};

var dbAuthed=function(){
	db.collection('programlist',colProgramList);
};

//db.open(dbOpened);

var colProgramList=function(e,col){
	var obj;
	for(obj in a){
		//col.insert(a[obj],function(e,d){console.log(e);console.log(d);});
	}
}