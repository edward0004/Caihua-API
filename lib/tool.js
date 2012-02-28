exports.date=function(str){
	var d=new Date(),pos,re='';
	str=str.toLowerCase();
	for(pos in str){
		switch(str[pos]){
			case 'y':
				re+=d.getFullYear().toString();
				break;
			case 'm':
				re+=exports.fixDate(d.getMonth()+1);
				break;
			case 'd':
				re+=exports.fixDate(d.getDate());
				break;
			case 'h':
				re+=exports.fixDate(d.getHours());
				break;
			case 'i':
				re+=exports.fixDate(d.getMinutes());
				break;
			case 's':
				re+=exports.fixDate(d.getSeconds());
				break;
			default:
				re+=str[pos];
				break;
				
		}
	}
	return re;
};

exports.fixDate=function(n){
	return (n<10)?('0'+n.toString()):n.toString();
}

exports.formatJSON=function(d){
	var o,arr=[],obj={};
	for(o in d){
		arr.push(o);
	}
	arr.sort();
	for(o in arr){
		obj[arr[o]]=d[arr[o]];
	}
	delete o;
	delete d;
	delete arr;
	
	return obj;
	//delete obj;
};

exports.utf8e=function(string) {
	string = string.replace(/\x0d\x0a/g, "\x0a");
	var output = "";
	for ( var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			output += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			output += String.fromCharCode((c >> 6) | 192);
			output += String.fromCharCode((c & 63) | 128);
		} else {
			output += String.fromCharCode((c >> 12) | 224);
			output += String.fromCharCode(((c >> 6) & 63) | 128);
			output += String.fromCharCode((c & 63) | 128);
		}
	}
	return output;
};

exports.jsonTest=function(json,key){
	var jhash=json.hash;
	delete json.hash;	
	
	json=this.formatJSON(json);
	
	var crypto=require('crypto');
	var chc=crypto.createHash('md5');
	chc.update(this.utf8e(JSON.stringify(json)+key));
	var chash=chc.digest('hex');
	
	delete chc;
	delete crypto;
	
	//console.log(JSON.stringify(json)+key);
	//console.log(chash);
	//console.log(jhash);
	
	if(chash!=jhash){
		delete jhash;
		delete chash;
		delete json;
		return false;
	}else{
		delete jhash;
		delete chash;
		return json;
	}
	delete json;
};
exports.xre=function(str){if(str){str=str.toString();return str.replace(/(<|>|'|")/g,function($0,$1){return {'>':'&gt;','<':'&lt;','"':'&quot;','\'':'&#39;'}[$1];});}}