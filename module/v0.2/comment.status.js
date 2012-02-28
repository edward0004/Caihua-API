exports.exec=function(){
	if(!exports.json.programId && !exports.json.seriesId){ exports.res.end(exports.err(4)); return; }

	exports.json.programId = exports.json.programId ? parseInt(exports.json.programId) : 0;
	exports.json.seriesId = exports.json.seriesId ? parseInt(exports.json.seriesId) : 0;
	exports.json.commentId = exports.json.commentId ? parseInt(exports.json.commentId) : 0;
	
	var i, n;
	for(i in exports.programNetworkListArr){
		if(exports.json.programId!=0 && exports.programNetworkListArr[i]['p']==exports.json.programId){
			n = exports.programNetworkListArr[i];
			break;
		}
		if(exports.json.seriesId!=0 && exports.programNetworkListArr[i]['s']==exports.json.seriesId){
			n = exports.programNetworkListArr[i];
			break;
		}
	}
	if(!n){ exports.res.end('{"commentId":0,"num":0}'); return; }
	exports.json.programId = n['p'];
	exports.json.pid = n['s'];
	exports.json.networkId = n['n'];
	exports.json.episode = n['e'];
	if(exports.json.pid){
		exports.commentCol.count({'_id':{'$gt':exports.json.commentId},'pid':exports.json.pid},exports.commentCounted);
	}else{
		exports.commentCol.count({'_id':{'$gt':exports.json.commentId},'networkId':exports.json.networkId,'programId':exports.json.programId},exports.commentCounted);
	}
};

exports.commentCounted=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }

	exports.num=d;
	if(exports.json.pid){
		exports.commentCol.findOne({'pid':exports.json.pid},{'_id':true},{'sort':[['_id', -1]]},exports.result);
	}else{
		exports.commentCol.findOne({'networkId':exports.json.networkId,'programId':exports.json.programId},{'_id':true},{'sort':[['_id', -1]]},exports.result);
	}
};

exports.result=function(e,d){
	if(e){ exports.res.end(exports.err(6)); return; }
	
	//exports.num = exports.num<50 ? exports.num : 50;
	if(d){
		exports.res.end('{"commentId":'+d._id+',"num":'+exports.num+'}');
	}else{
		exports.res.end('{"commentId":0,"num":0}');
	}
};