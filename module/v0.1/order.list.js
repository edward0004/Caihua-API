exports.exec=function(){
	if(!exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		exports.json.token=exports.xre(exports.json.token);
		
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
		exports.io={};
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
			exports.io.uid=d._id;
			exports.orderCol.find(exports.io,{'sort':[['time',-1]]}).toArray(exports.listed);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.listed=function(e,d){
	if(!e){
		if(d.length!=0){
			var obj,tobj;
			for(obj in d){
				tobj={};
				d[obj].networkName=exports.networkArr[d[obj].networkId].network;
				if(d[obj].seriesId){
					try{
						d[obj].img160=exports.programArr[d[obj].seriesId].img160;
					}catch(eee){}
					tobj=exports.getTimeA(d[obj].networkId,d[obj].seriesId);
				}else{
					tobj=exports.getTimeB(d[obj].networkId,d[obj].programId);
				}
				d[obj].programName=tobj.programName;
				d[obj].stime=tobj.stime;
				d[obj].etime=tobj.etime;
				delete d[obj]._id;
				delete d[obj].uid;
				delete d[obj].time;
			}
			delete obj;
			exports.res.end(JSON.stringify({"list":d}));
		}else{
			exports.res.end('{"list":[]}');
		}
	}else{
		exports.res.end(exports.err(6));
	}
};

exports.getTimeA=function(nid,sid){
	var re={'stime':0,'etime':0,'programName':''},obj;
	for(obj in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][obj].seriesId==sid){
			re.stime=exports.totalProgramListArr[nid][obj].stime;
			re.etime=exports.totalProgramListArr[nid][obj].etime;
			re.programName=exports.totalProgramListArr[nid][obj].name;
			if(re.etime>parseInt(new Date().getTime()*0.001)){
				break;
			}
		}
	}
	return re;
}

exports.getTimeB=function(nid,pid){
	var re={'stime':pid,'etime':pid,'programName':''},obj;
	for(obj in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][obj].stime==pid){
			re.stime=pid;
			re.etime=exports.totalProgramListArr[nid][obj].etime;
			re.programName=exports.totalProgramListArr[nid][obj].name;
			break;
		}
	}
	return re;
};