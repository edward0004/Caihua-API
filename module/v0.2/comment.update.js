exports.exec=function(){
	if(!exports.json.programId || !exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		if(exports.json.commentId){
			exports.json.commentId=parseInt(exports.json.commentId);
			exports.json.token=exports.xre(exports.json.token);
			exports.json.comment=exports.xre(exports.json.comment);
			exports.commentId=exports.json.commentId;
			exports.insertObject={"$set":{"comment":exports.json.comment}};
		}else{
			exports.json.programId=parseInt(exports.json.programId);
			exports.json.type=(exports.json.type?parseInt(exports.json.type):3);
			exports.json.token=exports.xre(exports.json.token);
			exports.json.comment=(exports.json.comment?exports.xre(exports.json.comment):'');
			exports.insertObject={"programId":exports.json.programId,"comment":exports.json.comment,"type":exports.json.type,"capture":0};
		}
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkUserExist);
	}
};

exports.checkUserExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	if(!d){ exports.res.end(exports.err(9)); return; }
	
	exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
	if(!exports.json.commentId){
		exports.uid=d._id;
		exports.insertObject.uid=d._id;
		exports.seqCol.findAndModify({'_id':'commentid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.commentIdCreated);
	}else{
		exports.postComment();
	}
};

exports.postComment=function(){
	if(!exports.json.commentId){
		exports.commentCol.insert(exports.insertObject,{'safe':true},exports.result);
	}else{
		exports.commentCol.update({"_id":exports.json.commentId},exports.insertObject,{'safe':true},exports.result);
	}
};

exports.commentIdCreated=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }

	var obj,n;
	for(obj in exports.programNetworkListArr){
		if(exports.programNetworkListArr[obj]['p']==exports.json.programId){
			n=exports.programNetworkListArr[obj];
			break;
		}
	}
	exports.insertObject.networkId=n['n'];
	exports.insertObject.pid=n['s'];
	exports.insertObject.episode=n['e'];
	var date=new Date();
	exports.insertObject.time=parseInt(date.getTime()*0.001);
	exports.captureFolder=date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString();

	exports.insertObject._id=d.v;
	exports.commentId=d.v;
	if(exports.json.type==1 || exports.json.type==2){
		exports.checkCaptureStatus();
	}else{
		exports.postComment();
	}
};

exports.checkCaptureStatus=function(){
	exports.captureCol.findOne({_id:exports.insertObject.networkId},exports.captureStatusCaptured);
};
exports.captureStatusCaptured=function(e,d){
	if(e || !d){
		exports.insertObject.capture=0;
	}else{
		if((d.time+10)<exports.insertObject.time){
			exports.insertObject.capture=0;
		}else{
			exports.insertObject.capture=exports.insertObject.time;
		}
	}
	exports.postComment();
};
exports.result=function(e,d){
	exports.insertObject.capture=1234567;
	if(!e){
		if(exports.insertObject.capture!=0){
			exports.res.end('{"result":true,"commentId":'+exports.commentId+',"img":"http://tp2.sinaimg.cn/1277885685/180/5620754762/1"}');
			//exports.res.end('{"result":true,"commentId":'+exports.commentId+',"img":"'+exports.imgConfig.url+'capture/'+exports.insertObject.networkId+'/'+exports.captureFolder+'/'+exports.insertObject.time+'.jpg"}');
		}else{
			exports.res.end('{"result":true,"commentId":'+exports.commentId+'}');
		}
	}else{
		exports.res.end('{"result":false}');
	}
};