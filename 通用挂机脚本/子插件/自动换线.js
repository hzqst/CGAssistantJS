var cga = global.cga;
var configTable = global.configTable;

var thisobj = {
	prepare : (cb)=>{
		if(cga.IsInGame())
		{
			if(thisobj.serverIndex != undefined && thisobj.serverIndex != cga.GetMapIndex().index2)//初始线路不等于当前线路，则修改线路并登出
			{
				console.log('当前线路与设定不一致，修改线路!');
				console.log('当前线路：'+cga.GetMapIndex().index2+'线');
				console.log('预期线路：'+thisobj.serverIndex+'线');
				cga.gui.LoadAccount({
					server : thisobj.serverIndex,
				}, (err, result)=>{
					//登出并换线
					console.log('登出!');
					cga.LogOut();
				})
			}
		}
		cb(null);
	},
	translate : (pair)=>{
		
		if(pair.field == 'serverIndex'){
			pair.field = '服务器线路';
			pair.value = pair.value;
			pair.translated = true;
			return true;
		}
		
		return false;
	},
	loadconfig : (obj, cb)=>{
		if(obj.serverIndex >= 1 && obj.serverIndex <= 10)
		{
			thisobj.serverIndex = obj.serverIndex;
			configTable.serverIndex = obj.serverIndex;
		}
		if(thisobj.serverIndex === undefined){
			console.error('读取配置：服务器线路失败！');
			return false;
		}
		
		return true;
	},
	inputcb : (cb)=>{
		var sayString = '【自动换线】请选择使用的服务器线路(1~10，0代表当前线路):';
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{
			if(index !== null && index >= 0 && index <= 10){
				if(index == 0)
					index = cga.GetMapIndex().index2;

				configTable.serverIndex = index;
				thisobj.serverIndex = index;
				
				var sayString2 = '当前已选择:[' + thisobj.serverIndex + ']线。';
				cga.sayLongWords(sayString2, 0, 3, 1);
				
				cb(null);
				
				return false;
			}
			
			return true;
		});
	}
};

module.exports = thisobj;