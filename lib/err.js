exports.throw=function(eid){
	var re={code:eid};
	switch(eid){
		case 1://Bad Json String
		case 2://Wrong Hash
		case 3://No Hash or appid
			re.error='Invalid JSON Data';
			break;
		case 4:
			re.error='Missing Params';
			break;
		case 5://Collection Error
		case 6://Find Error
			re.error='Database Error';
			break;
		case 7:
			re.error='Bad Params';
			break;
		case 8:
			re.error='Partner Id Already Bound';
			break;
		case 9:
			re.error='Bad Token';//Bad Token
			break;
		case 10:
			re.error=parseInt(new Date().getTime()*0.001);// Bad TimeStamp
			break;
		case 11:
			re.error='THe API Method Not Exist';
			break;
		default:
			re.code=0;
			re.errodId=eid;
			re.error='Unknow Error';
			break;
	}
	delete eid;
	return JSON.stringify(re);
	//delete re;
}