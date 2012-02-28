exports.exec=function(){
	if(!exports.json.networkId || !exports.json.programId || !exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		exports.json.programId=parseInt(exports.json.programId);
		exports.json.pid=exports.json.pid?parseInt(exports.json.pid):0;
		exports.json.token=exports.xre(exports.json.token);
		
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.uid=d._id;
			exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
			exports.checkinCol.update({"networkId":exports.json.networkId,"programId":exports.json.programId,"pid":exports.json.pid,"uid":exports.uid},{"$set":{"networkId":exports.json.networkId,"programId":exports.json.programId,"uid":exports.uid}},{"upsert":true,"safe":true},exports.result);
			exports.io={"networkId":exports.json.networkId,"programId":exports.json.programId,"pid":exports.json.pid,"comment":"","type":4,"uid":d._id};
			exports.seqCol.findAndModify({'_id':'commentid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.cided);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}

};
exports.cided=function(e,d){
	if(!e){
		exports.io._id=d.v;
		exports.cid=d.v;
		exports.io.time=parseInt(new Date().getTime()*0.001);
		exports.commentCol.insert(exports.io,{'safe':true},exports.result);
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.result=function(e,d){
	if(!e){
		exports.res.end('{"result":true}');
		//delete d;
	}else{
		//console.log(e);
		exports.res.end('{"result":false}');
	}
};