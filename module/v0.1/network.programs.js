exports.exec=function(){
	if(!exports.json.networkId){
		exports.res.end(exports.err(4));
		return;
	}else{
		exports.json.networkId=parseInt(exports.json.networkId);
		var arr=[],obj,nobj,objkey;
		for(obj in exports.programListArr[exports.json.networkId]){
			nobj={};
			for(objkey in exports.programListArr[exports.json.networkId][obj]){
				nobj[objkey]=exports.programListArr[exports.json.networkId][obj][objkey];
			}
			nobj._id=nobj.stime;
			delete nobj.stime;
			nobj.pid=nobj.seriesId;
			delete nobj.seriesId;
			nobj.network=nobj.networkName;
			delete nobj.networkName;
			arr.push(nobj);
		}
		console.log(arr.length);
		exports.res.end(JSON.stringify(arr));
	}
};