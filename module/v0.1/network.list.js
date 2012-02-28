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
	
	exports.nt=parseInt(new Date().getTime()*0.001);
	exports.privateNetworkArr=[];
	for(obj in exports.networkArr){
		if(exports.networkArr[obj]){
			if(exports.code.indexOf(exports.networkArr[obj].rid)!=-1 && exports.networkArr[obj]._id!=104){
				var onair=exports.findOnAir(exports.networkArr[obj]._id);
				exports.privateNetworkArr.push({'_id':exports.networkArr[obj]._id,'network':exports.networkArr[obj].network,'img':exports.networkArr[obj].img,'onair':onair,'hot':exports.networkArr[obj].hot});
			}
		}
	}
	exports.re={};
	exports.re.feature=[];
	var nobj,objkey;
	for(obj in exports.featureArr){
		nobj={};
		for(objkey in exports.featureArr[obj]){
			nobj[objkey]=exports.featureArr[obj][objkey];
		}
		nobj._id=nobj.stime;
		delete nobj.stime;
		nobj.pid=nobj.seriesId;
		delete nobj.seriesId;
		nobj.network=nobj.networkName;
		delete nobj.networkName;
		exports.re.feature.push(nobj);
	}
	exports.re.ts=parseInt(new Date().getTime()*0.001);
	exports.re.network=exports.privateNetworkArr.sort(function(x,y){return y['hot']-x['hot'];});
	exports.res.end(JSON.stringify(exports.re));
};

exports.findOnAir=function(id){
	var obj,re,objkey;
	for(obj in exports.programListArr[id]){
		if(exports.programListArr[id][obj].stime<exports.nt){
			re={hot:0};
			for(objkey in exports.programListArr[id][obj]){
				re[objkey]=exports.programListArr[id][obj][objkey];
			}
			re._id=re.stime;
			delete re.stime;
			re.pid=re.seriesId;
			delete re.seriesId;
			re.network=re.networkName;
			delete re.networkName;
		}else{
			break;
		}
	}

	delete obj;
	if(re){
		if(exports.programArr[re.pid]){
			re.hot=exports.programArr[re.pid].hot*1+exports.networkArr[id].hot*1;
		}
		re.hot=re.hot?re.hot:0;
	}
	return re;
};