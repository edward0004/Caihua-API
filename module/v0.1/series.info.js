exports.exec=function(){
	if(!exports.json.seriesId || !exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		exports.json.seriesId=parseInt(exports.json.seriesId);
		exports.json.token=exports.xre(exports.json.token);
		
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkExist);
	}
};

exports.checkExist=function(e,d){
	if(!e){
		if(d){
			exports.uid=d._id;
			exports.orderCol.find({'seriesId':exports.json.seriesId,'uid':exports.uid},{'networkId':true}).toArray(exports.orderList);
		}else{
			exports.res.end(exports.err(9));
			return;
		}
	}else{
		exports.res.end(exports.err(5));
		return;
	}

};

exports.orderList=function(e,d){
	if(!e){
		exports.nckarr=[];
		var obj,ordered;
		for(obj in d){
			exports.nckarr.push(d[obj].networkId);
		}
		var n=exports.programArr[exports.json.seriesId].network;
		var network=[];
		for(obj in n){
			ordered=false;
			if(exports.nckarr.indexOf(n[obj])!=-1){
				ordered=true;
			}
			var se=exports.getTimeA(n[obj],exports.json.seriesId);
			network.push({'_id':n[obj],'networkName':exports.networkArr[n[obj]].network,'img':exports.networkArr[n[obj]].img,'stime':se.stime,'etime':se.etime,'ordered':ordered});
		}
		var about='没有相关资料哦~';
		if(exports.programArr[exports.json.seriesId].about){
			about=exports.programArr[exports.json.seriesId].about;
		}
		var character=[];
		if(exports.characterArr[exports.json.seriesId]){
			for(obj in exports.characterArr[exports.json.seriesId]){
				if(exports.actorArr[exports.characterArr[exports.json.seriesId][obj]['actorId']]){
					character.push(exports.characterArr[exports.json.seriesId][obj]['name']+'('+exports.actorArr[exports.characterArr[exports.json.seriesId][obj]['actorId']]['name']+' 饰)');
				}else{
					character.push(exports.characterArr[exports.json.seriesId][obj]['name']);
				}
			}
		}
		exports.res.end(JSON.stringify({'about':about.replace(/\\n/g,"\n"),'network':network,'character':character}));
	}else{
		exports.res.end(exports.err(5));
		return;
	}
};

exports.getTimeA=function(nid,sid){
	var re={'stime':0,'etime':0},obj;
	for(obj in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][obj].seriesId==sid){
			re.stime=exports.totalProgramListArr[nid][obj].stime;
			re.etime=exports.totalProgramListArr[nid][obj].etime;
			if(re.etime>parseInt(new Date().getTime()*0.001)){
				break;
			}
		}
	}
	return re;
};