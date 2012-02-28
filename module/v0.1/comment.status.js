exports.exec=function(){
	if(!exports.json.networkId || !exports.json.programId){
		exports.res.end(exports.err(4));
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		exports.json.programId=parseInt(exports.json.programId);
		exports.json.cid=exports.json.cid?parseInt(exports.json.cid):0;
		exports.json.pid=exports.json.pid?parseInt(exports.json.pid):0;
		if(exports.json.pid){
			exports.commentCol.count({'_id':{'$gt':exports.json.cid},'pid':exports.json.pid},exports.commentCounted);
		}else{
			exports.commentCol.count({'_id':{'$gt':exports.json.cid},'networkId':exports.json.networkId,'programId':exports.json.programId},exports.commentCounted);
		}
	}
};

exports.commentCounted=function(e,d){
	if(!e){
		exports.num=d;
		if(exports.json.pid){
			exports.commentCol.findOne({'pid':exports.json.pid},{'_id':true},{'sort':[['_id', -1]]},exports.result);
		}else{
			exports.commentCol.findOne({'networkId':exports.json.networkId,'programId':exports.json.programId},{'_id':true},{'sort':[['_id', -1]]},exports.result);
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.result=function(e,d){
	if(!e){
		if(d){
			exports.res.end('{"cid":'+d._id+',"num":'+exports.num+'}');
		}else{
			exports.res.end('{"cid":0,"num":0}');
		}
		//delete d;
	}else{
		exports.res.end(exports.err(6));
	}
};