exports.exec=function(){
	if(!exports.json.networkId){
		exports.res.end(exports.err(4));
		return;
	}else{
		var ts=exports.json.timestamp?parseInt(exports.json.timestamp)*1000:new Date().getTime();
		var d=new Date();
		d.setTime(ts);
		
		exports.json.networkId=parseInt(exports.json.networkId);
		try{
			exports.res.end(JSON.stringify(exports.dayProgramListArr[exports.json.networkId][d.getDay()]));
		}catch(e){
			exports.res.end('[]');
		}
	}
};