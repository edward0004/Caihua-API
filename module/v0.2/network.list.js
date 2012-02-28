exports.exec=function(){
	exports.code=[1,2];
	var obj;
	exports.json.province=exports.xre(exports.json.province);
	for(obj in exports.map){
		if(exports.map[obj].name==exports.json.province){
			exports.code.push(exports.map[obj].code);
			break;
		}
	}
	
	exports.currentTime=parseInt(new Date().getTime()*0.001);
	exports.privateNetworkArr=[];
	var onair;
	for(obj in exports.networkArr){
		if(exports.networkArr[obj]){
			if(exports.code.indexOf(exports.networkArr[obj].rid)!=-1 && exports.networkArr[obj]._id!=104){
				onair=exports.findOnAir(exports.networkArr[obj]._id);
				exports.privateNetworkArr.push({'_id':exports.networkArr[obj]._id,'name':exports.networkArr[obj].network,'img':exports.networkArr[obj].img,'hot':exports.networkArr[obj].hot,'regionId':exports.networkArr[obj].rid,'onair':onair});
			}
		}
	}
	exports.re={};
	exports.re.ts=parseInt(new Date().getTime()*0.001);
	exports.re.network=exports.privateNetworkArr.sort(function(x,y){return y['hot']-x['hot'];});
	exports.res.end(JSON.stringify(exports.re));
};

exports.findOnAir=function(id){
	var obj,re;
	for(obj in exports.programListArr[id]){
		if(exports.programListArr[id][obj].stime<exports.currentTime && exports.programListArr[id][obj].etime>exports.currentTime){
			re={'name':exports.programListArr[id][obj].name,'stime':exports.programListArr[id][obj].stime};
			break;
		}
	}
	return re;
};