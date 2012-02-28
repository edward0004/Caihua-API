var config=require('./config/config.js');
var tool=require('./lib/tool.js');
var err=require('./lib/err.js');
var http=require('http');
var path=require('path');
var fs=require('fs');
var data=require('./data.js');

var moduleArr=['test','network.list','network.programs','series.info','program.info','program.onair','check.in','config.read','feedback.post','user.update','device.update','comment.update','comment.list','comment.status','order.list','order.add','order.delete','category.list','category.series'];
var vArr=['v0.1','v0.2'];

var map=[{'name':'江苏省','code':210000},{'name':'浙江省','code':310000},{'name':'天津市','code':300000},{'name':'北京市','code':100000},{'name':'广东省','code':510000},{'name':'上海市','code':200000}];

var timeout=20000;

var env = 'production' ;
if (process.argv.length>=3 && process.argv[2]=='--dev') env = 'sandbox';

var accessLogFileFD,sysLogFileFD,currentLogFile='';
var createLogFile=function(){
	currentLogFile=tool.date("ymd");
	fs.open(config.logdir+'access_'+currentLogFile,'a','0777',function(err,fd){
		accessLogFileFD=fd;
		data.accessLogFileFD=accessLogFileFD;
		writeLog('Node Init --'+env+'.','access');
	});
	fs.open(config.logdir+'sys_'+currentLogFile,'a','0777',function(err,fd){
		sysLogFileFD=fd;
		data.sysLogFileFD=sysLogFileFD;
		writeLog('Node Init --'+env+'.','sys');
	});
};
createLogFile();
var writeLog=function(str,type){
	if(tool.date("ymd")!=currentLogFile){createLogFile();}
	var buf=new Buffer('['+tool.date('y.m.d h:i:s')+'] '+str+"\n"),fd;
	switch(type){
		case 'sys':
			fd=sysLogFileFD;
			break;
		case 'access':
			fd=accessLogFileFD;
			break;
	}
	try{
		fs.write(fd,buf,0,buf.length);
	}catch(e){}
};
data.writeLog=writeLog;


data.dbOpen();
http.createServer(function(req,res){

	if(req.method=='GET'){
		res.writeHead(301,{'Location':'http://huohua.tv/'});
		res.end();
		
		return false;
	}
	
	var cst=setTimeout(function(){
		try{
			res.writeHead(408);
			res.end();
		}catch(csfe){}
	},timeout);
	
	res.addListener("end",function(){
		try{
			clearTimeout(cst);
		}catch(raee){}
	});
		
	var chunks=[];
	var size=0;
	req.addListener("data",function(chunk){
		chunks.push(chunk);
	    size+=chunk.length;
	});
	
	req.addListener("end",function(){
		var receiveData = null;
		switch(chunks.length) {
			case 0:
				receiveData=new Buffer(0);
				break;
			case 1:
				receiveData = chunks[0];
				break;
			default:
				receiveData = new Buffer(size);
				var i=0,pos=0,l=chunks.length;
				for(i,pos,l;i<l;i++){
					var chunk=chunks[i];
					chunk.copy(receiveData,pos);
					pos+=chunk.length;
				}
				break;
		}
		
		res.writeHead(200,{'Content-Type':'application/json','charset':'utf-8'});
		
		var json;
		try{
			json=JSON.parse(receiveData);
		}catch(e){
			res.end(err.throw(1));
			return;
		}
		
		var rmodel=req.url.slice(1).split('/');
		if(rmodel=='7F6D00B91764BA24CF2E82E2112315D2'){
			data.doCache();
			writeLog("Do Cache Request Through HTTP.",'sys');
		}
		
		if(env=='production'){ // json validation
			if(!json || !json.hash || !json.appid || !json.ts || !config.appkey[json.appid]){
				res.end(err.throw(3));
				return false;
			}
			
			var tbottom=parseInt(new Date().getTime()*0.001)-3600;
			var ttop=parseInt(new Date().getTime()*0.001)+3600;
			var ts=parseInt(json.ts,16);
			if(ts>ttop || ts<tbottom){
				res.end(err.throw(10));
				return false;
			}
			
			json=tool.jsonTest(json,config.appkey[json.appid]);
			if(!json){
				res.end(err.throw(2));
			 	return false;
			}
		}
		
			
		if(rmodel.length==1){rmodel[1]=rmodel[0];rmodel[0]='v0.1'}
		if(moduleArr.indexOf(rmodel[1])==-1 || vArr.indexOf(rmodel[0])==-1){
			res.writeHead(404,{'Content-Type':'application/json'});
			res.end(err.throw(11));
			return false;
		}
		
		var model;
		try{
			model=require('./module/'+rmodel[0]+'/'+rmodel[1]+'.js');
		}catch(eee){
			res.writeHead(404,{'Content-Type':'application/json'});
			res.end(err.throw(11));
			return;
		}
		
		writeLog("Target: "+JSON.stringify(rmodel)+" Data: "+JSON.stringify(json),'access');
		
		switch(rmodel[1]){
			case 'network.list':
				model.map = map;
				model.networkArr = data.networkArr;
				model.programArr = data.seriesArr; // for v0.1 only
				model.featureArr = data.featureArr; // for v0.1 only
				model.imgConfig = config.img; // for v0.1 only
				model.programListArr = data.programListArr;
				model.path = path;
				break;
			case 'program.onair':
				model.map = map;
				model.networkArr = data.networkArr;
				model.seriesArr = data.seriesArr;
				model.featureArr = data.featureArr;
				model.programListArr = data.programListArr;
				break;
			case 'network.programs':
				model.programListArr = data.programListArr;
				model.dayProgramListArr = data.dayProgramListArr;
				break;
			case 'program.info':
				model.activeuserCol = data.activeuserCol;
				model.userCol = data.userCol;
				model.orderCol = data.orderCol;
				model.totalProgramListArr = data.totalProgramListArr;
				model.programNetworkListArr = data.programNetworkListArr;
				break;
			case 'check.in':
				model.seqCol = data.seqCol;
				model.userCol = data.userCol;
				model.activeuserCol = data.activeuserCol;
				model.checkinCol = data.checkinCol;
				model.commentCol = data.commentCol;
				break;
			case 'config.read':
				model.configCol = data.configCol;
				break;
			case 'feedback.post':
				model.feedbackCol = data.feedbackCol;
				break;
			case 'user.update':
				model.iospushCol = data.iospushCol;
				model.userCol = data.userCol;
				model.activeuserCol = data.activeuserCol;
				model.seqCol = data.seqCol;
				break;
			case 'device.update':
				model.iospushCol = data.iospushCol;
				break;
			case 'comment.update':
				model.userCol = data.userCol;
				model.captureCol = data.captureCol;
				model.activeuserCol = data.activeuserCol;
				model.seqCol = data.seqCol;
				model.commentCol = data.commentCol;
				model.programNetworkListArr = data.programNetworkListArr;
				model.imgConfig = config.img;
				break;
			case 'comment.list':
				model.userCol = data.userCol;
				model.commentCol = data.commentCol;
				model.programNetworkListArr = data.programNetworkListArr;
				model.totalProgramListArr = data.totalProgramListArr;
				model.imgConfig = config.img;
				break;
			case 'comment.status':
				model.commentCol = data.commentCol;
				model.programNetworkListArr = data.programNetworkListArr;
				break;
			case 'order.list':
				model.orderCol = data.orderCol;
				model.userCol = data.userCol;
				model.activeuserCol = data.activeuserCol;
				model.networkArr = data.networkArr;
				model.totalProgramListArr = data.totalProgramListArr;
				model.seriesArr = data.seriesArr;
				break;
			case 'order.add':
				model.seqCol = data.seqCol;
				model.orderCol = data.orderCol;
				model.userCol = data.userCol;
				model.activeuserCol = data.activeuserCol;
				break;
			case 'order.delete':
				model.orderCol = data.orderCol;
				model.userCol = data.userCol;
				model.activeuserCol = data.activeuserCol;
				break;
			case 'series.info':
				model.orderCol = data.orderCol;
				model.programListArr = data.programListArr;
				model.totalProgramListArr = data.totalProgramListArr;
				model.seriesArr = data.seriesArr;
				model.networkArr = data.networkArr;
				model.userCol = data.userCol;
				model.actorArr = data.actorArr;
				model.characterArr = data.characterArr;
				break;
			case 'category.list':
				model.category = data.category;
				break;
			case 'category.series':
				model.categoryArr = data.categoryArr;
				model.map = map;
				break;
		}
		model.db = data.db;
		model.res = res;
		model.json = json;
		model.err = err.throw;
		model.xre = tool.xre;
		try{
			model.exec();
		}catch(exee){
			data.logCol.insert({'time':parseInt(new Date().getTime()*0.001),'type':1,'bubble':'API','message':"Model: "+rmodel[1]+"\n"+exee.stack+"\nData: "+JSON.stringify(json)});
			try{
				res.writeHead(500);
				res.end();
			}catch(erese){}
		}
	
	});
	
}).listen(config.port[env],"0.0.0.0");

console.log('Server running at http://0.0.0.0:'+config.port[env]+'/');