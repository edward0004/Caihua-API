exports.exec=function(){
	if(!exports.json.networkId || !exports.json.programId){
		exports.res.end(exports.err(4));
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		exports.json.programId=parseInt(exports.json.programId);
		exports.json.cid=exports.json.cid?parseInt(exports.json.cid):0;
		exports.json.reqnum=exports.json.reqnum?parseInt(exports.json.reqnum):50;
		exports.json.pid=exports.json.pid?parseInt(exports.json.pid):0;
		if(exports.json.pid){
			exports.commentCol.find({'_id':{'$lte':exports.json.cid},'pid':exports.json.pid},{'sort':[['_id', -1]],'limit':exports.json.reqnum}).toArray(exports.listed);
		}else{
			exports.commentCol.find({'_id':{'$lte':exports.json.cid},'networkId':exports.json.networkId,'programId':exports.json.programId},{'sort':[['_id', -1]],'limit':exports.json.reqnum}).toArray(exports.listed);
		}
	}
};

exports.listed=function(e,d){
	if(!e){
		if(d.length!=0){
			var obj,pobj;
			for(obj in exports.totalProgramListArr[exports.json.networkId]){
				if(exports.totalProgramListArr[exports.json.networkId][obj].stime==exports.json.programId){
					pobj=exports.totalProgramListArr[exports.json.networkId][obj];
					break;
				}
			}
			
			exports.latestCid=d[0]._id;
			exports.list=d;
			exports.userinfo={};
			exports.uarr=[];
			var i=0,t=d.length,cpid=d[0].programId,noisold=true;
			for(i;i<t;i++){
				if(d[i].time<pobj.stime && noisold){
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
			exports.userCol.findOne({"_id":exports.uarr[0]},{"_id":true,"nick":true,"avatar":true},exports.ufinded);
		}else{
			exports.res.end('{"latestCid":0,"list":[],"userinfo":{}}');
		}
		//delete d;
	}else{
		//console.log(e);
		exports.res.end(exports.err(6));
	}
};

exports.ufinded=function(e,d){
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
		var re={"latestCid":exports.latestCid,"list":exports.list,"userinfo":exports.userinfo};
		exports.res.end(JSON.stringify(re));
	}else{
		exports.userCol.findOne({"_id":exports.uarr[0]},{"_id":true,"nick":true,"avatar":true},exports.ufinded);
	}
};