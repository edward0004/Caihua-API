exports.exec=function(){
	if(!exports.json.token || !exports.json.programId || !exports.json.networkId){
		exports.res.end(exports.err(4));
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		exports.json.programId=parseInt(exports.json.programId);
		exports.json.token=exports.xre(exports.json.token);
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
			exports.uid=d._id;
			exports.orderCol.findOne({'networkId':exports.json.networkId,'programId':exports.json.programId,'uid':exports.uid},{'_id':true},exports.checkOrder);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.checkOrder=function(e,d){
	if(!e){
		var re={},obj;
		for(obj in exports.totalProgramListArr[exports.json.networkId]){
			if(exports.totalProgramListArr[exports.json.networkId][obj].stime==exports.json.programId){
				re={};
				for(objkey in exports.totalProgramListArr[exports.json.networkId][obj]){
					re[objkey]=exports.totalProgramListArr[exports.json.networkId][obj][objkey];
				}
				break;
			}
		}
		if(d){
			re.ordered=true;
		}else{
			re.ordered=false;
		}
		re._id=re.stime;
		delete re.stime;
		re.pid=re.seriesId;
		delete re.seriesId;
		re.network=re.networkName;
		delete re.networkName;
		exports.res.end(JSON.stringify(re));
		return;
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};