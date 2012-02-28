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

	exports.json.categoryId=(exports.json.categoryId?parseInt(exports.json.categoryId):0);
	if(typeof(exports.json.offset)=='undefined'){
		exports.json.skip=0;
		exports.json.limit=100;
	}else{
		exports.json.skip=(exports.json.offset?Math.max(parseInt(exports.json.offset),0):0);
		exports.json.limit=(exports.json.limit?Math.min(parseInt(exports.json.limit),50):0);
	}
	
	var i=exports.json.skip,t=exports.json.skip+exports.json.limit,resultArr=[],tobj,regionScore;
	if(exports.categoryArr[exports.json.categoryId]){
		for(i;i<t;i++){
			if(exports.categoryArr[exports.json.categoryId][i]){
				regionScore=exports.categoryArr[exports.json.categoryId][i].region.indexOf(exports.code[0])+exports.categoryArr[exports.json.categoryId][i].region.indexOf(exports.code[1])+exports.categoryArr[exports.json.categoryId][i].region.indexOf(exports.code[2]);
				if(regionScore!=-3){
					tobj = {};
					tobj._id = exports.categoryArr[exports.json.categoryId][i]._id;
					tobj.name = exports.categoryArr[exports.json.categoryId][i].program;
					//tobj.category = exports.categoryArr[exports.json.categoryId][i].category;
					tobj.tag = exports.categoryArr[exports.json.categoryId][i].tag;
					tobj.hot = exports.categoryArr[exports.json.categoryId][i].hot;
					
					if(exports.categoryArr[exports.json.categoryId][i].img160){
						tobj.img160=exports.categoryArr[exports.json.categoryId][i].img160;
					}
					if(exports.categoryArr[exports.json.categoryId][i].img240){
						tobj.img240=exports.categoryArr[exports.json.categoryId][i].img240;
					}
					if(exports.categoryArr[exports.json.categoryId][i].img640){
						tobj.img640=exports.categoryArr[exports.json.categoryId][i].img640;
					}
					resultArr.push(tobj);
				}
			}else{
				break;
			}
		}
	}
	
	exports.res.end(JSON.stringify(resultArr));
};