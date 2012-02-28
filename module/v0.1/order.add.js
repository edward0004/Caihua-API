exports.exec=function(){
	if(!exports.json.networkId || !exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		exports.json.programId=exports.json.programId?parseInt(exports.json.programId):0;
		exports.json.seriesId=exports.json.seriesId?parseInt(exports.json.seriesId):0;
		exports.json.token=exports.xre(exports.json.token);
		
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
		exports.io={"networkId":exports.json.networkId,"programId":exports.json.programId,"seriesId":exports.json.seriesId};
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
			exports.io.uid=d._id;
			exports.orderCol.findOne(exports.io,exports.checkoExist);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}

};

exports.checkoExist=function(e,d){
	if(!e){
		if(d){
			exports.result(false,null);
		}else{
			exports.seqCol.findAndModify({'_id':'orderid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.oided);
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.oided=function(e,d){
	if(!e){
		exports.io._id=d.v;
		exports.io.time=parseInt(new Date().getTime()*0.001);
		exports.io.update=0;
		exports.orderCol.insert(exports.io,{'safe':true},exports.result);
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.result=function(e,d){
	if(!e){
		exports.res.end('{"result":true}');
	}else{
		exports.res.end('{"result":false}');
	}
};