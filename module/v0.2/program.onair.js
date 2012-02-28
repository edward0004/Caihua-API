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
	var onair=[],objkey,tobj,subobj;
	
	for(obj in exports.programListArr){
		if(exports.code.indexOf(exports.networkArr[obj].rid)!=-1 && exports.networkArr[obj]._id!=104){
			for(objkey in exports.programListArr[obj]){
				if(exports.programListArr[obj][objkey].stime<exports.nt && exports.programListArr[obj][objkey].etime>exports.nt){
					if(exports.programListArr[obj][objkey].seriesId!=0 && exports.seriesArr[exports.programListArr[obj][objkey].seriesId]){
						exports.programListArr[obj][objkey].tag=exports.seriesArr[exports.programListArr[obj][objkey].seriesId].tag;
						exports.programListArr[obj][objkey].category=exports.seriesArr[exports.programListArr[obj][objkey].seriesId].category;
					}
					if (exports.programListArr[obj][objkey].name == null) {/* name为空的fix */
						exports.programListArr[obj][objkey].name = '';
					}
					onair.push(exports.programListArr[obj][objkey]);
					break;
				}
			}
		}
	}
	
	exports.re={};
	exports.re.feature=exports.featureArr;
	exports.re.ts=parseInt(new Date().getTime()*0.001);
	exports.re.onair=onair;
	exports.res.end(JSON.stringify(exports.re));
};