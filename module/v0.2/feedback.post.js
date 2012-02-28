exports.exec=function(){
	if(!exports.json.os || !exports.json.osv || !exports.json.feedback || !exports.json.appv || !exports.json.duid){
		exports.res.end(exports.err(4));
		return;
	}else{
		exports.json.os=exports.xre(exports.json.os);
		exports.json.osv=exports.xre(exports.json.osv);
		exports.json.feedback=exports.xre(exports.json.feedback);
		exports.json.appv=Number(exports.json.appv);
		exports.json.duid=exports.xre(exports.json.duid);
		
		exports.feedbackCol.insert({'_id':parseInt(new Date().getTime()*0.001),'os':exports.json.os,'osv':exports.json.osv,'appv':exports.json.appv,'duid':exports.json.duid,'email':exports.json.email,'feedback':exports.json.feedback},exports.result);
	}
};
exports.result=function(e,d){
	if(!e){
		exports.res.end('{"result":true}');
		return;
	}else{
		exports.res.end('{"result":false}');
		return;
	}
};