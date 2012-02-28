exports.exec=function(){
	if(!exports.json.partner){ exports.res.end(exports.err(4)); return; }
	
	if(exports.json.partner=='device'){
		if(!exports.json.duid){ exports.res.end(exports.err(4)); return; }
		
		exports.json.duid=exports.xre(exports.json.duid);
		exports.iospushCol.findOne({"_id":exports.json.duid},{"uid":true},{"safe":true},exports.deviceExist);
		return;
	}
	
	
	if(!exports.json.token){
		if(!exports.json.puid || !exports.json.nick || !exports.json.avatar || !exports.json.ptoken || !exports.json.psecret){
			exports.res.end(exports.err(4));
			return;
		}	
			
		exports.json.puid=exports.xre(exports.json.puid);
		exports.json.nick=exports.xre(exports.json.nick);
		exports.json.avatar=exports.xre(exports.json.avatar);
		exports.json.ptoken=exports.xre(exports.json.ptoken);
		exports.json.psecret=exports.xre(exports.json.psecret);
	}else{
		exports.json.token=exports.xre(exports.json.token);
	}
			
	switch(exports.json.partner){
		case 'sina':
			exports.o={};
			exports.json.nick?exports.o.nick=exports.json.nick:void(0);
			exports.json.avatar?exports.o.avatar=exports.json.avatar:void(0);
			exports.json.puid?exports.o.suid=exports.json.puid.toString():void(0);
			exports.json.ptoken?exports.o.stoken=exports.json.ptoken:void(0);
			exports.json.psecret?exports.o.ssecret=exports.json.psecret:void(0);
			if(!exports.json.token){
				exports.userCol.findOne({'suid':exports.json.puid.toString()},{'_id':true,'token':true},exports.checkExist);
			}else{
				exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
			}
			break;
		case 'tencent':
			exports.o={};
			exports.json.nick?exports.o.nick=exports.json.nick:void(0);
			exports.json.avatar?exports.o.avatar=exports.json.avatar:void(0);
			exports.json.puid?exports.o.tuid=exports.json.puid:void(0);
			exports.json.ptoken?exports.o.ttoken=exports.json.ptoken:void(0);
			exports.json.psecret?exports.o.ssecret=exports.json.psecret:void(0);
			if(!exports.json.token){
				exports.userCol.findOne({'tuid':exports.json.puid},{'_id':true,'token':true},exports.checkExist);
			}else{
				exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
			}
			break;
		default:
			exports.res.end(exports.err(7));
			return;
			break;
	}
};

exports.deviceExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
		
	if(d){
		exports.userCol.findOne({"_id":d.uid},exports.userFinded);
	}else{
		exports.o={};
		exports.seqCol.findAndModify({'_id':'uid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.userIdCreated);
	}
};
exports.userFinded=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
		
	exports.uid=d._id;
	exports.token=d.token;
	exports.suid=d.suid;
	exports.stoken=d.stoken;
	exports.ssecret=d.ssecret;
	exports.result();
};

exports.userIdCreated=function(e,d){
	if(!e){
		var io=exports.o;
		exports.uid=d.v;
		var crypto=require('crypto');
		crypto=crypto.createHash('MD5');
		crypto.update(Math.random().toString()+new Date().getTime().toString()+Math.random().toString());
		exports.token=crypto.digest('hex');
		io._id=exports.uid;
		io.token=exports.token;
		if(exports.json.partner=='device'){
			io.nick='用户'+exports.uid;
			io.avatar='0';
		}
		io.reg=parseInt(new Date().getTime()*0.001);
		exports.userCol.insert(io,{'safe':true},exports.userAdded);
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};
exports.userAdded=function(e,d){
	if(!e){
		exports.activeuserCol.update({"_id":exports.uid},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});			
		exports.result();
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.checkExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
			
	if(d){
		exports.uid=d._id;
		exports.token=d.token;
		exports.activeuserCol.update({"_id":d._id},{"$set":{"active":parseInt(new Date().getTime()*0.001)}},{"upsert":true});
		if(exports.json.token){
			switch(exports.json.partner){
				case 'sina':
					exports.userCol.findOne({'suid':exports.json.puid.toString()},{'_id':true,'token':true},exports.checkExistb);
					break;
				case 'tencent':
					exports.userCol.findOne({'tuid':exports.json.puid},{'_id':true,'token':true},exports.checkExistb);
					break;
			}
		}else{
			exports.userCol.update({'_id':exports.uid},{"$set":exports.o},{'safe':true},exports.userUpdated);
		}
	}else{
		if(exports.json.partner=='device' || !exports.json.token){
			exports.seqCol.findAndModify({'_id':'uid'},[],{'$inc':{'v':1}},{'new':true,'upsert':true},exports.userIdCreated);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}
};
exports.checkExistb=function(e,d){
	if(!e){
		if(d){
			exports.uid=d._id;
			exports.token=d.token;
			exports.result();
		}else{
			exports.userCol.update({'_id':exports.uid},{"$set":exports.o},{'safe':true},exports.userUpdated);
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};
exports.userUpdated=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	
	exports.result();
};

exports.result=function(){
	if(exports.json.duid){
		exports.iospushCol.update({"_id":exports.json.duid},{"$set":{"uid":exports.uid}},{"upsert":true,"safe":true},exports.deviceAdded);
	}else{
		var outputObj = {};
		outputObj.uid = exports.uid;
		outputObj.token = exports.token;
		
		exports.res.end(JSON.stringify(outputObj));
	}
};

exports.deviceAdded=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	
	var outputObj = {};
	outputObj.uid = exports.uid;
	outputObj.token = exports.token;	
	if (exports.suid) outputObj.suid = exports.suid;
	if (exports.stoken) outputObj.stoken = exports.stoken;
	if (exports.ssecret) outputObj.ssecret = exports.ssecret;
	exports.res.end(JSON.stringify(outputObj));
};