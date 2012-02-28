var config=require('./config/config.js');
var path=require('path');
var fs=require('fs');

var category=[{'name':'热门','_id':0,'program':''},{'name':'电视剧','_id':1,'program':''},{'name':'综艺/娱乐','_id':2,'program':''},{'name':'相亲/情感','_id':3,'program':''},{'name':'体育','_id':4,'program':''},{'name':'纪实/科教','_id':5,'program':''},{'name':'财经','_id':6,'program':''},{'name':'生活时尚','_id':7,'program':''}];
exports.category = category;

var cacheHock,smallCacheHock;

exports.dbOpen=function(){
	var mongo = require('mongodb').Server;
	mongo = new mongo('localhost',27017,{auto_reconnect:true});
	
	exports.db = require('mongodb').Db;
	exports.db = new exports.db(config.db.collection, mongo, {});
	exports.db.open(function(){
		exports.db.authenticate(config.db.user, config.db.pass, dbAuthed);
	});
}

var dbAuthed=function(){
	exports.db.collection('configure', function(e,col){ exports.configCol=col; });
	exports.db.collection('feedback', function(e,col){ exports.feedbackCol=col; });
	exports.db.collection('iospush', function(e,col){ exports.iospushCol=col; });
	exports.db.collection('user', function(e,col){ exports.userCol=col; });
	exports.db.collection('seq', function(e,col){ exports.seqCol=col; });
	exports.db.collection('checkin', function(e,col){ exports.checkinCol=col; });
	exports.db.collection('activeuser', function(e,col){ exports.activeuserCol=col; });
	exports.db.collection('comment', function(e,col){ exports.commentCol=col; });
	exports.db.collection('order', function(e,col){ exports.orderCol=col; });
	exports.db.collection('apilog', function(e,col){ exports.logCol=col; });
	exports.db.collection('capture', function(e,col){ exports.captureCol=col; });
	
	exports.db.collection('network', colNetwork);
	
	exports.db.collection('actor', function(e,col){
		exports.actorCol=col;
		col.find().toArray(fetchActorArr);
	});
	
	exports.db.collection('character', function(e,col){
		exports.characterCol=col;
		col.find().toArray(fetchCharacterArr);
	});
};

var colNetwork=function(e,col){
	exports.networkCol=col;
	col.find().toArray(fetchNetworkArr);
}

var fetchNetworkArr=function(e,d){
	exports.networkArr = [];
	var obj,hash;
	for(obj in d){
		exports.networkArr[d[obj]._id]=d[obj];
		if(path.existsSync(config.img.savePath+'network/logo/'+d[obj]._id+'_small.png')){
			hash = fs.statSync(config.img.savePath+'network/logo/'+d[obj]._id+'_small.png').mtime.getTime().toString();
		}
		exports.networkArr[d[obj]._id].img = config.img.url+'network/logo/'+d[obj]._id+'_small.png?'+hash;
		exports.networkArr[d[obj]._id].hot = exports.networkArr[d[obj]._id].hot ? exports.networkArr[d[obj]._id].hot:0;
	}
	exports.db.collection('series', function(e,col){
		exports.seriesCol = col;
		col.find({"$or":[{"type":0},{"type":1}]},{"_id":true,"about":true,"hot":true,"network":true,"program":true,"type":true,"total":true,"tag":true,"category":true},{'sort':[['hot',-1]]}).toArray(fetchSeriesArr);
	});
	
	delete hash;
	delete obj;
};

var fetchSeriesArr=function(e,d){
	exports.seriesArr=[];
	exports.categoryArr=[];
	exports.categoryArr[0]=[];
	var obj,objkey,nobj,carr=[],carrImg=[];
	carr[0]=[];
	carrImg[0]={'img':'','hot':-1};
	for(obj in d){
		if(path.existsSync(config.img.savePath+'program/160/'+d[obj]._id+'.jpg')){
			fstat=fs.statSync(config.img.savePath+'program/160/'+d[obj]._id+'.jpg');
			d[obj].img160=config.img.url+'program/160/'+d[obj]._id+'.jpg?'+fstat.mtime.getTime().toString();
		}
		if(path.existsSync(config.img.savePath+'program/240/'+d[obj]._id+'.jpg')){
			fstat=fs.statSync(config.img.savePath+'program/240/'+d[obj]._id+'.jpg');
			d[obj].img240=config.img.url+'program/240/'+d[obj]._id+'.jpg?'+fstat.mtime.getTime().toString();
		}
		if(path.existsSync(config.img.savePath+'program/640/'+d[obj]._id+'.jpg')){
			fstat=fs.statSync(config.img.savePath+'program/640/'+d[obj]._id+'.jpg');
			d[obj].img640=config.img.url+'program/640/'+d[obj]._id+'.jpg?'+fstat.mtime.getTime().toString();
		}
		if(!d[obj].hot){
			d[obj].hot=0;
		}
		exports.seriesArr[d[obj]._id]=d[obj];
		if(d[obj].category!=0 && d[obj].category){
			if(!exports.categoryArr[d[obj].category]){exports.categoryArr[d[obj].category]=[];carr[d[obj].category]=[];carrImg[d[obj].category]={'img':'','hot':-1};}
			if(carr[d[obj].category].length<5){
				carr[d[obj].category].push(d[obj].program);
			}
			if(d[obj].hot>carrImg[d[obj].category].hot && d[obj].img160){
				carrImg[d[obj].category].hot=d[obj].hot;
				carrImg[d[obj].category].img=d[obj].img160;
			}
			if(d[obj].type==1){
				exports.categoryArr[0].push(d[obj]);
				if(carr[0].length<5){
					carr[0].push(d[obj].program);
				}
				if(d[obj].hot>carrImg[0].hot && d[obj].img160){
					carrImg[0].hot=d[obj].hot;
					carrImg[0].img=d[obj].img160;
				}
			}
			d[obj].region=[];
			for(nobj in d[obj].network){
				d[obj].region.push(exports.networkArr[d[obj].network[nobj]].rid);
			}
			exports.categoryArr[d[obj].category].push(d[obj]);
			d[obj].category=category[d[obj].category].name;
		}
	}
	for(obj in exports.categoryArr){
		exports.categoryArr[obj].sort(function(x,y){return y['hot']-x['hot'];});
		for(objkey in category){
			if(category[objkey]['_id']==obj){
				category[objkey]['program']=carr[obj].join('，');
				category[objkey]['img']=carrImg[obj].img;
				break;
			}
		}
	}
	delete obj;
	delete carr;
	fetchProgramList();
};

var fetchProgramList=function(){
	exports.db.collection('programlist', function(e,col){
		exports.programListCol=col;
	
		var d=new Date();
		var t=parseInt(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())*0.001)-28800;
		d=d.getDay();
		if(d==0){d=7;}
		var st=t-(d-1)*86400;
		var et=t+(8-d)*86399;
	
		var ct=parseInt(new Date().getTime()*0.001);
		col.find({'stime':{'$gte':st,'$lte':et}},{"_id":true,"networkId":true,"stime":true,"etime":true,"name":true,"seriesId":true,"episode":true},{'sort':[['_id',1]]}).toArray(fetchedProgramList);
	});
};

var fetchedProgramList=function(e,d){
	exports.programListArr=[];
	exports.totalProgramListArr=[];
	exports.programNetworkListArr=[];
	exports.dayProgramListArr=[];
	var obj,ct=parseInt(new Date().getTime()*0.001),pnobj,dd;
	for(obj in d){
		d[obj].networkName = exports.networkArr[d[obj].networkId].network;
		d[obj].hot=0;
		d[obj].tag=[];
		d[obj].category="";
		d[obj].etime=d[obj].etime?d[obj].etime:1670860799;
		if(d[obj].seriesId && exports.seriesArr[d[obj].seriesId]){
			try{
				d[obj].img160 = exports.seriesArr[d[obj].seriesId].img160;
				d[obj].img240 = exports.seriesArr[d[obj].seriesId].img240;
				d[obj].img640 = exports.seriesArr[d[obj].seriesId].img640;
			}catch(eee){}
			
			d[obj].hot = exports.seriesArr[d[obj].seriesId].hot * 1 + exports.networkArr[d[obj].networkId].hot * 1;
			d[obj].category = exports.seriesArr[d[obj].seriesId].category;
			d[obj].tag = exports.seriesArr[d[obj].seriesId].tag;
		}
		if(!exports.programListArr[d[obj].networkId]){
			exports.programListArr[d[obj].networkId]=[];
		}
		if(!exports.totalProgramListArr[d[obj].networkId]){
			exports.totalProgramListArr[d[obj].networkId]=[];
		}
		if(d[obj].stime>(ct-43200) && d[obj].stime<(ct+43200)){
			exports.programListArr[d[obj].networkId].push(d[obj]);
		}
		exports.totalProgramListArr[d[obj].networkId].push(d[obj]);
		dd=new Date();
		dd.setTime(d[obj].stime*1000);
		if(!exports.dayProgramListArr[d[obj].networkId]){
			exports.dayProgramListArr[d[obj].networkId]=[];
			exports.dayProgramListArr[d[obj].networkId][0]=[];
			exports.dayProgramListArr[d[obj].networkId][1]=[];
			exports.dayProgramListArr[d[obj].networkId][2]=[];
			exports.dayProgramListArr[d[obj].networkId][3]=[];
			exports.dayProgramListArr[d[obj].networkId][4]=[];
			exports.dayProgramListArr[d[obj].networkId][5]=[];
			exports.dayProgramListArr[d[obj].networkId][6]=[];
		}
		exports.dayProgramListArr[d[obj].networkId][dd.getDay()].push(d[obj]);
		pnobj={n:d[obj].networkId, p:d[obj]._id, s:d[obj].seriesId, e:d[obj].episode};
		exports.programNetworkListArr.push(pnobj);
	}
	cacheHock=setTimeout(doCache,7200000);
	exports.db.collection('feature',colFeature);
};

var colFeature=function(e,col){
	exports.featureCol=col;
	col.find({},{},{'sort':[['order',1]]}).toArray(fetchFeatureArr);
};

var fetchFeatureArr=function(e,d){
	exports.featureArr=[];
	var obj,objkey,img240,nid,sid,re,hash;
	for(obj in d){
		img240='';
		if(path.existsSync(config.img.savePath+'program/feature/240/'+d[obj]._id+'.jpg')){
			hash=fs.statSync(config.img.savePath+'program/feature/240/'+d[obj]._id+'.jpg').mtime.getTime().toString();
		}
		img240=config.img.url+'program/feature/240/'+d[obj]._id+'.jpg?'+hash;
		nid=d[obj].networkId;
		sid=d[obj].seriesId;
		
		if(d[obj].programId==0){
			for(objkey in exports.totalProgramListArr[nid]){
				re={etime:0};
				if(exports.totalProgramListArr[nid][objkey].seriesId==sid){
					d[obj]['programId']=exports.totalProgramListArr[nid][objkey]._id;
					re.etime=exports.totalProgramListArr[nid][objkey].etime;
					if(re.etime>parseInt(new Date().getTime()*0.001)){
						break;
					}
				}
			}
		}
		if(d[obj].programId==0){
			delete d[obj];
		}else{
			for(objkey in exports.totalProgramListArr[d[obj]['networkId']]){
				if(d[obj]['programId']==exports.totalProgramListArr[d[obj]['networkId']][objkey]['_id']){
					d[obj]=exports.totalProgramListArr[d[obj]['networkId']][objkey];
					if(img240!=''){d[obj]['img240']=img240;}
				}
			}
			
			//d[obj].name=title;
			exports.featureArr.push(d[obj]);
		}
	}
	smallCacheHock=setTimeout(doSmallCache,120000);
};

var doCache=function(){
	clearTimeout(cacheHock);
	exports.writeLog('Do Cache.','sys');
	exports.db.collection('network', colNetwork);
};
exports.doCache = doCache;

var doSmallCache=function(){
	clearTimeout(smallCacheHock);
	exports.writeLog('Do Feature Cache.','sys');
	exports.db.collection('feature', colFeature);
};

var fetchActorArr=function(e,d){
	exports.actorArr=[];
	var obj;
	for(obj in d){
		exports.actorArr[d[obj]._id]=d[obj];
	}
	delete obj;
};

var fetchCharacterArr=function(e,d){
	exports.characterArr=[];
	var obj;
	for(obj in d){
		if(!exports.characterArr[d[obj].seriesId]){exports.characterArr[d[obj].seriesId]=[];}
		exports.characterArr[d[obj].seriesId].push(d[obj]);
	}
	delete obj;
};