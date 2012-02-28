exports.exec=function(){
	if(exports.json.os && exports.json.osv && exports.json.duid && exports.json.dtoken && exports.json.appv){
		exports.json.os=exports.xre(exports.json.os);
		exports.json.osv=exports.xre(exports.json.osv);
		exports.json.appv=Number(exports.json.appv);
		exports.json.duid=exports.xre(exports.json.duid);
		exports.json.dtoken=exports.xre(exports.json.dtoken);			
		exports.iospushCol.update({"_id":exports.json.duid},{"$set":{"os":exports.json.os,"osv":exports.json.osv,"dtoken":exports.json.dtoken,"appv":exports.json.appv}},{"upsert":true});
		exports.res.end('{"result":true}');
	}else{
		exports.res.end(exports.err(4));
		return;
	}
};