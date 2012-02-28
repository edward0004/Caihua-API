exports.exec=function(){
	if(!exports.json.token) { exports.res.end(exports.err(4)); return; }
	
	exports.json.token=exports.xre(exports.json.token);
	exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true}, exports.checkUserExist);
};

exports.checkUserExist=function(e, user){
	if (e) { exports.res.end(exports.err(5)); return; }
	if (!user) { exports.res.end(exports.err(9)); return; }
	
	exports.activeuserCol.update({"_id": user._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
	exports.orderCol.find({"uid": user._id}, {'sort':[['time',-1]]}).toArray(exports.orderListed);
};

<<<<<<< HEAD
exports.orderListed=function(e,d){
	if(e){ exports.res.end(exports.err(6)); return; }
	if(d.length!=0){
		var obj,tobj,re=[];
		for(obj in d){
			tobj={};
			d[obj].networkName=exports.networkArr[d[obj].networkId].network;
			if(d[obj].seriesId){
				try{
					d[obj].img160=exports.seriesArr[d[obj].seriesId].img160;
				}catch(eee){}
				tobj=exports.getTimeBySeriesId(d[obj].networkId,d[obj].seriesId);
			}else{
				tobj=exports.getTimeByProgramId(d[obj].networkId,d[obj].programId);
			}
			if(tobj.id!=0){
				d[obj]._id=tobj.id;
				d[obj].name=tobj.programName;
				d[obj].stime=tobj.stime;
				d[obj].etime=tobj.etime;
				delete d[obj].programId;
				delete d[obj].programName;
				delete d[obj].uid;
				delete d[obj].time;
				delete d[obj].update;
				//re.push(d[obj]);
			}
			re.push(d[obj]);
=======
exports.orderListed=function(e, orders){
	if (e) { exports.res.end(exports.err(6)); return; }
	if (orders.length == 0) { exports.res.end('{"list":[]}'); }
	
	var i, tobj, re=[];
	for(i in orders){
		tobj={};
		orders[i].networkName = exports.networkArr[orders[i].networkId].network;
		if(orders[i].seriesId){
			try{
				orders[i].img160 = exports.seriesArr[orders[i].seriesId].img160;
			}catch(eee){}
			tobj = exports.getTimeBySeriesId(orders[i].networkId, orders[i].seriesId);
		}else{
			tobj = exports.getTimeByProgramId(orders[i].networkId, orders[i].programId);
>>>>>>> 3642ba6218278aa97d8c06763f73a6b1e60a37b6
		}
		if(tobj.id==0) continue;
		
		orders[i]._id = tobj.id;
		orders[i].name = tobj.programName;
		orders[i].stime = tobj.stime;
		orders[i].etime = tobj.etime;
		delete orders[i].programId;
		delete orders[i].programName;
		delete orders[i].uid;
		delete orders[i].time;
		delete orders[i].update;
		re.push(orders[i]);
	}
	exports.res.end(JSON.stringify({"list":re}));
};

exports.getTimeBySeriesId=function(nid, sid){
	var re = {'stime':0,'etime':0,'programName':'','id':0}, i;
	for(i in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][i].seriesId == sid){
			re.id = exports.totalProgramListArr[nid][i]._id;
			re.stime = exports.totalProgramListArr[nid][i].stime;
			re.etime = exports.totalProgramListArr[nid][i].etime;
			re.programName = exports.totalProgramListArr[nid][i].name;
			if (re.etime>parseInt(new Date().getTime()*0.001)){
				break;
			}
		}
	}
	return re;
}

exports.getTimeByProgramId=function(nid, pid){
	var re = {'stime':pid,'etime':pid,'programName':'','id':0}, i;
	for(i in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][i]._id==pid){
			re.id=exports.totalProgramListArr[nid][i]._id;
			re.stime=exports.totalProgramListArr[nid][i].stime;
			re.etime=exports.totalProgramListArr[nid][i].etime;
			re.programName=exports.totalProgramListArr[nid][i].name;
			break;
		}
	}
	return re;
};