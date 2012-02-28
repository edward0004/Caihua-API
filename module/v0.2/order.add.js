exports.exec=function(){
	if(!exports.json.networkId || !exports.json.token){
		exports.res.end(exports.err(4));
		return;
	}
		
	exports.json.networkId=parseInt(exports.json.networkId);
	exports.json.programId=exports.json.programId?parseInt(exports.json.programId):0;
	exports.json.seriesId=exports.json.seriesId?parseInt(exports.json.seriesId):0;
	exports.json.token=exports.xre(exports.json.token);
		
	exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkUserExist);
	exports.insertObject={"networkId":exports.json.networkId,"programId":exports.json.programId,"seriesId":exports.json.seriesId};
};

exports.checkUserExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	if(!d){ exports.res.end(exports.err(9)); return; }
	
	exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
	exports.insertObject.uid=d._id;
	exports.orderCol.findOne(exports.insertObject,exports.checkOrderExist);
};

exports.checkOrderExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	
	if(d){
		exports.result(false,null);
	}else{
		exports.seqCol.findAndModify({'_id':'orderid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.orderIdCreated);
		return;
	}
};

exports.orderIdCreated=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	
	exports.insertObject._id=d.v;
	exports.insertObject.time=parseInt(new Date().getTime()*0.001);
	exports.insertObject.update=0;
	exports.orderCol.insert(exports.insertObject,{'safe':true},exports.result);
};

exports.result=function(e,d){
	if(!e){
		exports.res.end('{"result":true}');
	}else{
		exports.res.end('{"result":false}');
	}
};