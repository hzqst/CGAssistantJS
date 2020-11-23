var fs = require('fs');
var path = require('path');
var Async = require('async');

var cga = require('./cgaapi')(function(){
	
	global.cga = cga;
		
	var configPath = __dirname+'\\脚本设置';
	var configName = configPath+'\\通用挂机脚本_'+cga.FileNameEscape(cga.GetPlayerInfo().name)+'.json';
	
	var pluginPath = __dirname+'\\通用挂机脚本\\主插件';
	var pluginEnumList = fs.readdirSync(pluginPath);
	
	pluginEnumList = pluginEnumList.map((item)=>{
		return path.basename(item, '.js');
	})
	
	var subPluginPath = __dirname+'\\通用挂机脚本\\子插件';
	var subPluginEnumList = fs.readdirSync(subPluginPath);

	subPluginEnumList = subPluginEnumList.map((item)=>{
		return path.basename(item, '.js');
	})
		
	var fieldNameTable = {
		mainPlugin : '主插件',
		subPlugins : '子插件',
	}
	
	var configTable = {
		mainPlugin : null,
		subPlugins : [],
	}
	
	global.configTable = configTable;
	
	var mainPlugin = null;
	var subPlugins = [];
	
	global.getMainPlugin = ()=>{
		return mainPlugin;
	}
	
	global.callSubPlugins = (func, arg)=>{
		for(var i in subPlugins){
			if(typeof subPlugins[i][func] == 'function')
				subPlugins[i][func](arg);
		}
	}
	
	global.callSubPluginsAsync = (func, cb)=>{

		var funcs = [];
		for(var i in subPlugins){
			if(typeof subPlugins[i][func] == 'function')
				funcs.push(subPlugins[i][func]);
		}
		
		Async.series(funcs, cb);
	}
	
	var saveConfig = (cb)=>{
		fs.mkdir(configPath, ()=>{
			fs.writeFile(configName, JSON.stringify(configTable), cb);
		});	
	}
	
	var clearConfig = ()=>{
		try {
			fs.unlinkSync(configName);
			console.log('脚本配置已清除。');
			cga.SayWords('脚本配置已清除。', 0, 3, 1);
		}catch(e)
		{

		}
	}
	
	var readConfig = ()=>{
		try
		{			
			var json = fs.readFileSync(configName, 'utf8');
			
			if(typeof json != 'string' || !json.length)
				throw new Error('配置文件格式错误');
			
			var obj = JSON.parse(json);
			
			if(!parsePluginList(obj))
			{
				throw new Error('解析配置文件失败');
			}
			
			if(!loadPlugin())
			{
				throw new Error('插件加载失败');
			}
			
			if(!loadConfigForPlugin(obj))
			{
				throw new Error('插件配置加载失败。可能由于插件配置的格式发生变化，建议手动删除配置文件后重新设置配置！');
			}
			
			return true;
		}
		catch(e)
		{
			if(e.code != 'ENOENT'){
				//clearConfig();
				console.log(e)
			}
		}
		
		return false;
	}
	
	var parsePluginList = (obj)=>{
		try{
			//read plugin names from config
			configTable.mainPlugin = obj.mainPlugin;
			for(var i in obj.subPlugins)
				configTable.subPlugins.push(obj.subPlugins[i]);

			return true;
		}catch(e)
		{
			console.log(e)
		}
		
		return false;
	}
	
	var loadPlugin = ()=>{
		try{
			//load plugins
			mainPlugin = require(pluginPath+'/'+configTable.mainPlugin)
			for(var i in configTable.subPlugins)
				subPlugins.push(require(subPluginPath+'/'+configTable.subPlugins[i]))
			
			return true;
		}catch(e){
			console.log(e);
		}
		
		return false;
	}
	
	var loadConfigForPlugin = (obj)=>{
		if(typeof mainPlugin.loadconfig == 'function'){
			if(!mainPlugin.loadconfig(obj))
				return false;
		}
		for(var i in subPlugins){
			if(typeof subPlugins[i].loadconfig == 'function')
				if(!subPlugins[i].loadconfig(obj))
					return false;
		}
		return true;
	}
		
	var start = ()=>{
		console.log('脚本开始执行，在游戏中输入del可以删除配置文件。');
		console.log('或者也可手动删除"'+configName+'"处的配置文件。');
		cga.SayWords('CGA通用挂机脚本开始执行，输入del可以删除配置文件。', 0, 3, 1);
		cga.waitForChatInput((msg)=>{
			if(msg == 'del'){
				clearConfig();
			}
		});

		mainPlugin.execute();
	}

	if(readConfig()){

		var configString = "CGA通用挂机脚本已从文件中恢复配置。\n";
		var counter = 0;
		for(var i in configTable){
			if(counter != 0)
				configString += ', ';
			
			counter ++;
			
			var namePair = {
				field : (fieldNameTable[i]) ? (fieldNameTable[i]) : i,
				value : (fieldNameTable[i] && (configTable[i] instanceof Array)) ? '['+configTable[i].join(', ')+']' : configTable[i],
				translated : (fieldNameTable[i]) ? true : false,
			};
			
			if(!namePair.translated){		
				if(typeof mainPlugin.translate == 'function'){
					mainPlugin.translate(namePair);
				}
			}
			
			if(!namePair.translated){
				for(var j in subPlugins){
					if(typeof subPlugins[j].translate == 'function'){
						if (subPlugins[j].translate(namePair)){
							break;
						}
					}
				}
			}
			
			configString += namePair.field;
			
			configString += ': ';
			if(typeof namePair.value == 'string' || typeof namePair.value == 'number'){
				configString += namePair.value;			
			} else {
				configString += '[未设置]';
			}
		}

		cga.sayLongWords(configString, 0, 3, 1);
		
		start();
	} else {
		cga.sayLongWords('欢迎使用CGA通用挂机脚本。如果这是您第一次使用该脚本，请耐心阅读说明。本脚本可以定义一个主插件和无数个子插件，下次运行时将会加载并执行您本次设置好的主插件和子插件。每个插件都可以单独配置个性化参数，参数会保存至文件。', 0, 3, 1);
	
		var stage1 = ()=>{
			var sayString = '请选择需要加载的主插件的编号：[';
			for(var i in pluginEnumList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + pluginEnumList[i];
			}
			sayString += ']';

			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{

				if(index !== null && index >= 1 && pluginEnumList[index - 1]){
					configTable.mainPlugin = pluginEnumList[index - 1];
					
					var sayString2 = '当前已选择加载主插件:[' + configTable.mainPlugin + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					stage2();
					
					return false;
				}
				
				return true;
			});
		}
		
		var stage2 = ()=>{
			var sayString = '请选择需要加载的子插件的编号，再次输入已选中的子插件可取消选择：[';
			for(var i in subPluginEnumList){
				if(i != 0)
					sayString += ', ';
				sayString += '('+ (parseInt(i)+1) + ')' + subPluginEnumList[i];
			}
			sayString += ']，选择完成请输入ok。';

			cga.sayLongWords(sayString, 0, 3, 1);
			cga.waitForChatInput((msg, index)=>{
				if(index !== null && index >= 1 && subPluginEnumList[index - 1] ){
					var val = subPluginEnumList[index-1];
					if(!is_array_contain(configTable.subPlugins, val))
						configTable.subPlugins.push(subPluginEnumList[index - 1]);
					else
						configTable.subPlugins = configTable.subPlugins.filter((name)=>{
							return name != val;
						})
					
					var sayString2 = '当前已选择加载子插件:[' + configTable.subPlugins.join(', ') + ']。';
					cga.sayLongWords(sayString2, 0, 3, 1);
					
					stage2();
					return false;
				} else if(msg == 'ok'){
					stage3();
					return false;
				}
				
				return true;
			});
		}
		
		var stage3 = ()=>{
			
			loadPlugin();
						
			var inputcb = [];
						
			Async.series([
			(cb)=>{
				if(typeof mainPlugin.inputcb == 'function')
					mainPlugin.inputcb(cb);
				else
					cb(null);
			},
			(cb)=>{
				if(subPlugins.length > 0){
					Async.eachSeries(subPlugins, (sub, cb2)=>{
						if(typeof sub.inputcb == 'function')
							sub.inputcb(cb2);
						else
							cb2(null);
					}, cb);
				} else {
					cb(null);
				}
			},			
			(cb)=>{
				saveConfig(cb)
			}
			], (err, results)=>{
				if(err)
					throw err;
				
				start();
			});
		}
		
		stage1();
	}
	
});