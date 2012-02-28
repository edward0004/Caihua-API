exports.exec=function(){
	if(!exports.json.programId && !exports.json.seriesId){ exports.res.end(exports.err(4)); return; }
	
	exports.json.programId = exports.json.programId ? parseInt(exports.json.programId) : 0;
	exports.json.seriesId = exports.json.seriesId ? parseInt(exports.json.seriesId) : 0;
	exports.json.commentId = exports.json.commentId?parseInt(exports.json.commentId) : 0;
	exports.json.reqnum = exports.json.reqnum?Math.min(parseInt(exports.json.reqnum),50) : 50;
		
	var i, n;
	for(i in exports.programNetworkListArr){
		if(exports.json.programId!=0 && exports.programNetworkListArr[i]['p'] == exports.json.programId){
			n = exports.programNetworkListArr[i];
			break;
		}
		if(exports.json.seriesId!=0 && exports.programNetworkListArr[i]['s'] == exports.json.seriesId){
			n = exports.programNetworkListArr[i];
			break;
		}
	}
	exports.json.programId = n['p'];
	exports.json.pid = n['s'];
	exports.json.networkId = n['n'];
	exports.json.episode = n['e'];
	if(exports.json.pid){
		exports.commentCol.find({'_id':{'$lte':exports.json.commentId},'pid':exports.json.pid},{'sort':[['_id', -1]],'limit':exports.json.reqnum}).toArray(exports.commentListed);
	}else{
		exports.commentCol.find({'_id':{'$lte':exports.json.commentId},'networkId':exports.json.networkId,'programId':exports.json.programId},{'sort':[['_id', -1]],'limit':exports.json.reqnum}).toArray(exports.commentListed);
	}
};

exports.commentListed=function(e,d){
	if(e){ exports.res.end(exports.err(6)); return; }
	if(d.length == 0){ exports.res.end('{"latestCommentId":0,"commentList":[],"userinfo":{}}'); }
	
	var obj,pobj;
	for(obj in exports.totalProgramListArr[exports.json.networkId]){
		if(exports.totalProgramListArr[exports.json.networkId][obj]._id==exports.json.programId){
			pobj=exports.totalProgramListArr[exports.json.networkId][obj];
			break;
		}
	}
	
	exports.latestCommentId=d[0]._id;
	exports.commentList=d;
	exports.userinfo={};
	exports.uarr=[];
	var i=0,t=d.length,cpid=d[0].programId,noisold=true;
	for(i;i<t;i++){
		if(d[i].capture && d[i].capture!=0) { // 测试用，给第一条评论输出图片，回头删掉
			var date=new Date();
			date.setTime(d[i].capture*1000);
			d[i].img = [exports.imgConfig.url+'capture/'+exports.json.networkId+'/'+(date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString())+'/'+d[i].capture+'.jpg'];
		}
		
		if(noisold && d[i].time<pobj.stime){
			if(d[(i-1)]){
				d[(i-1)].isOld=true;
			}else{
				d[i].isOld=true;
			}
			noisold=false;
		}
		if(d[i].comment==''){
			switch(d[i].type){
				case 1:
					d[i].comment='烂';
					break;
				case 2:
					d[i].comment='赞';
					break;
			}
		}
		if(exports.uarr.indexOf(d[i].uid)==-1){
			exports.uarr.push(d[i].uid);
		}
		delete d[i].networkId;
		delete d[i].programId;
		delete d[i].pid;
	}
	exports.userCol.findOne({"_id":exports.uarr[0]},{"_id":true,"nick":true,"avatar":true},exports.userinfoFinded);
};

exports.userinfoFinded=function(e,d){
	if(e){ exports.res.end(exports.err(6)); return; }
	exports.userinfo['u'+exports.uarr[0]]={};
	if(d){
		exports.userinfo['u'+exports.uarr[0]]=d;
	}else{
		exports.userinfo['u'+exports.uarr[0]]._id=exports.uarr[0];
		exports.userinfo['u'+exports.uarr[0]].nick='Unknown';
		exports.userinfo['u'+exports.uarr[0]].avatar='0';
	}
	exports.uarr.shift();
	if(exports.uarr.length<1){
		var re={"latestCommentId":exports.latestCommentId,"commentList":exports.commentList,"userinfo":exports.userinfo};
		exports.res.end(JSON.stringify(re));
	}else{
		exports.userCol.findOne({"_id":exports.uarr[0]},{"_id":true,"nick":true,"avatar":true},exports.userinfoFinded);
	}
};