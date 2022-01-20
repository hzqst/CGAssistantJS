var cga = require(process.env.CGA_DIR_PATH_UTF8+'/cgaapi')(function(){
	console.log('买布脚本 起始地点：艾尔莎岛')
	
	var mineArray = [
	{
		name : '麻布',
		func : (count, cb)=>{
			cga.craft.buyFabricLv1(0, count, cb);
		}
	},
	{
		name : '木棉布',
		func : (count, cb)=>{
			cga.craft.buyFabricLv1(1, count, cb);
		}
	},
	{
		name : '毛毡',
		func : (count, cb)=>{
			cga.craft.buyFabricLv1(2, count, cb);
		}
	},
	{
		name : '绵',
		func : (count, cb)=>{
			cga.craft.buyFabricLv1(3, count, cb);
		}
	},
	{
		name : '细线',
		func : (count, cb)=>{
			cga.craft.buyFabricLv1(4, count, cb);
		}
	},
	{
		name : '维诺亚村',
		func : (count, cb)=>{
			cga.craft.buyFabricLv2(0, count, cb);
		}
	},
	{
		name : '莎莲娜线',
		func : (count, cb)=>{
			cga.craft.buyFabricLv3(9, count, cb);
		}
	},
	{
		name : '杰诺瓦线',
		func : (count, cb)=>{
			cga.craft.buyFabricLv3(10, count, cb);
		}
	},
	{
		name : '阿巴尼斯制的线',
		func : (count, cb)=>{
			cga.craft.buyFabricLv4(1, count, cb);
		}
	},
	{
		name : '阿巴尼斯制的布',
		func : (count, cb)=>{
			cga.craft.buyFabricLv4(2, count, cb);
		}
	},
	{
		name : '细麻布',
		func : (count, cb)=>{
			cga.craft.buyFabricLv5(0, count, cb);
		}
	},
	{
		name : '开米士毛线',
		func : (count, cb)=>{
			cga.craft.buyFabricLv5(1, count, cb);
		}
	},
	]
	
	var mineObject = null;

	var stage1 = ()=>{
		cga.SayWords('欢迎使用CGA通用买布脚本,输入数字选择布的种类:', 0, 3, 1);

		var sayString = '';
		for(var i in mineArray){
			if(i != 0)
				sayString += ', ';
			sayString += '('+ (parseInt(i)+1) + ')' + (typeof mineArray[i].display_name == 'string' ? mineArray[i].display_name : mineArray[i].name);
		}
		cga.sayLongWords(sayString, 0, 3, 1);
		cga.waitForChatInput((msg, index)=>{

			if(index !== null && index >= 1 && mineArray[index - 1]){
				mineObject = mineArray[index - 1];

				var sayString2 = '当前已选择:[' + (typeof mineObject.display_name == 'string' ? mineObject.display_name : mineObject.name) + ']。';
				cga.sayLongWords(sayString2, 0, 3, 1);

				stage2();
				
				return false;
			}
			
			return true;
		});
	}
	
	var stage2 = ()=>{
		cga.SayWords('输入数字购买布的数量(1~400):', 0, 3, 1);

		cga.waitForChatInput((msg, val)=>{
			if(val !== null && val >= 1 && val <= 400){
				var sayString2 = '购买数量:['+val+']。';
				cga.sayLongWords(sayString2, 0, 3, 1);

				mineObject.func(val, ()=>{
					console.log('购买完成!');
				});
				
				return false;
			}
			
			return true;
		});
	}
	
	stage1(()=>{
		stage2();
	})
});