exports.exec=function(){
	if(!exports.json.os){
		exports.res.end(exports.err(4));
		return;
	}else{
		exports.configCol.find({},{"_id":true,"value":true}).toArray(exports.result);
	}
};
exports.result=function(e,d){
	if(e){ exports.res.end(exports.err(6)); return; }
	var obj,re={};
	for(obj in d){
		re[d[obj]._id]=d[obj].value;
	}
	exports.res.end(JSON.stringify(re));
	return;
};