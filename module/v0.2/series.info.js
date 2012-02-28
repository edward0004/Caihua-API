exports.exec=function(){
	if(!exports.json.seriesId || !exports.json.token){
		exports.res.end(exports.err(4));
	}else{
		exports.json.seriesId=parseInt(exports.json.seriesId);
		exports.json.token=exports.xre(exports.json.token);
		
		exports.userCol.findOne({'token':exports.json.token},{'_id':true,'token':true},exports.checkUserExist);
	}
};

exports.checkUserExist=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	if(!d){ exports.res.end(exports.err(9)); return; }
	
	exports.uid=d._id;
	exports.orderCol.find({'seriesId':exports.json.seriesId,'uid':exports.uid},{'networkId':true}).toArray(exports.orderListed);
};

exports.orderListed=function(e,d){
	if(e){ exports.res.end(exports.err(5)); return; }
	exports.nckarr=[];
	var obj,ordered;
	for(obj in d){
		exports.nckarr.push(d[obj].networkId);
	}
	var n=exports.seriesArr[exports.json.seriesId].network;
	var programs=[];
	for(obj in n){
		ordered=false;
		if(exports.nckarr.indexOf(n[obj])!=-1){
			ordered=true;
		}
		var se=exports.getTimeBySeriesId(n[obj],exports.json.seriesId);
		if(se._id!=0){
			var program = se;
			program.networkName = exports.networkArr[n[obj]].network;
			program.networkImg = exports.networkArr[n[obj]].img;
			program.ordered = ordered;
			program.seriesId = exports.json.seriesId;

			programs.push(program);
		}
	}
	var about='暂时没有相关资料哦~';
	if(exports.seriesArr[exports.json.seriesId].about){
		about=exports.seriesArr[exports.json.seriesId].about;
	}
	obj={'name':exports.seriesArr[exports.json.seriesId].program,'tag':exports.seriesArr[exports.json.seriesId].tag,'category':exports.seriesArr[exports.json.seriesId].category,'about':about.replace(/\\n/g,"\n"),'program':programs};
	obj._id = exports.json.seriesId;
	if(exports.seriesArr[exports.json.seriesId].img160){ // v0.3x 灭绝后可以去掉
		obj.img160=exports.seriesArr[exports.json.seriesId].img160;
	}
	if(exports.seriesArr[exports.json.seriesId].img640){
		obj.img640=exports.seriesArr[exports.json.seriesId].img640;
	}
	
	exports.res.end(JSON.stringify(obj));
};

exports.getTimeBySeriesId=function(nid,sid){
	var re={'stime':0,'etime':0,'_id':0,'name':''},obj;
	for(obj in exports.totalProgramListArr[nid]){
		if(exports.totalProgramListArr[nid][obj].seriesId==sid){
			re._id=exports.totalProgramListArr[nid][obj]._id;
			re.name=exports.totalProgramListArr[nid][obj].name;
			re.stime=exports.totalProgramListArr[nid][obj].stime;
			re.etime=exports.totalProgramListArr[nid][obj].etime;
			re.img640 = exports.totalProgramListArr[nid][obj].img640;
			re.networkId = exports.totalProgramListArr[nid][obj].networkId;
			if(re.etime>parseInt(new Date().getTime()*0.001)){
				break;
			}
		}
	}
	return re;
};