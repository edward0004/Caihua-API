exports.exec=function(){
	if(!exports.json.token || !exports.json.programId){
		exports.res.end(exports.err(4));
	}else{
		exports.json.programId=parseInt(exports.json.programId);
		exports.json.token=exports.xre(exports.json.token);
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkUserExist);
	}
};

exports.checkUserExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	if(!d){ exports.res.end(exports.err(9)); return; }
	
	var obj,n
	for(obj in exports.programNetworkListArr){
		if(exports.programNetworkListArr[obj]['p']==exports.json.programId){
			n=exports.programNetworkListArr[obj];
			break;
		}
	}
	
	exports.networkId=n['n'];
	exports.seriesId=n['s'];
	
	exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
	exports.uid=d._id;
	if(exports.seriesId){
		exports.orderCol.findOne({'networkId':exports.networkId,'seriesId':exports.seriesId,'uid':exports.uid},{'_id':true},exports.checkOrdered);
	}else{
		exports.orderCol.findOne({'networkId':exports.networkId,'programId':exports.json.programId,'uid':exports.uid},{'_id':true},exports.checkOrdered);
	}

};

exports.checkOrdered=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	var re={},obj;
	for(obj in exports.totalProgramListArr[exports.networkId]){
		if(exports.totalProgramListArr[exports.networkId][obj]._id==exports.json.programId){
			re=exports.totalProgramListArr[exports.networkId][obj];
			break;
		}
	}
	if(d){
		re.ordered=true;
	}else{
		re.ordered=false;
	}
	exports.res.end(JSON.stringify(re));
	return;
};