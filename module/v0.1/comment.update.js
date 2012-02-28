exports.exec=function(){
	if(!exports.json.cid){
		if(!exports.json.networkId || !exports.json.programId || !exports.json.token || !exports.json.type){
			exports.res.end(exports.err(4));
		}else{
			exports.json.networkId=parseInt(exports.json.networkId);
			exports.json.programId=parseInt(exports.json.programId);
			exports.json.type=parseInt(exports.json.type);
			exports.json.token=exports.xre(exports.json.token);
			exports.json.pid=exports.json.pid?parseInt(exports.json.pid):0;
			exports.json.comment=(exports.json.comment?exports.xre(exports.json.comment):'');
		
			exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
		
			exports.io={"networkId":exports.json.networkId,"programId":exports.json.programId,"pid":exports.json.pid,"comment":exports.json.comment,"type":exports.json.type,"episode":0};
		}
	}else{
		if(!exports.json.networkId || !exports.json.programId || !exports.json.token || !exports.json.comment){
			exports.res.end(exports.err(4));
		}else{
			exports.json.cid=parseInt(exports.json.cid);
			exports.json.networkId=parseInt(exports.json.networkId);
			exports.json.programId=parseInt(exports.json.programId);
			exports.json.token=exports.xre(exports.json.token);
			exports.json.pid=exports.json.pid?parseInt(exports.json.pid):0;
			exports.json.comment=exports.xre(exports.json.comment);
		
			exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
			
			exports.cid=exports.json.cid;
			exports.io={"$set":{"comment":exports.json.comment}};
		}
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
			if(!exports.json.cid){
				exports.uid=d._id;
				exports.io.uid=d._id;
				exports.seqCol.findAndModify({'_id':'commentid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.cided);
			}else{
				exports.post();
			}
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}

};

exports.post=function(){
	if(!exports.json.cid){
		exports.io.time=parseInt(new Date().getTime()*0.001);
		exports.commentCol.insert(exports.io,{'safe':true},exports.result);
	}else{
		exports.commentCol.update({"_id":exports.json.cid},exports.io,{'safe':true},exports.result);
	}
};

exports.cided=function(e,d){
	if(!e){
		exports.io._id=d.v;
		exports.cid=d.v;
		exports.post();
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.result=function(e,d){
	if(!e){
		exports.res.end('{"result":true,"cid":'+exports.cid+'}');
		//delete d;
	}else{
		//console.log(e);
		exports.res.end('{"result":false}');
	}
};