var cga = global.cga;
var configTable = global.configTable;

module.exports = {
	func : (cb)=>{
		cga.travel.gelaer.toHospital(()=>{
			setTimeout(cb, 5000);
		});
	},
	isLogBack : (map, mapindex)=>{
		return (map == '哥拉尔镇') ? false : true;
	},
	isAvailable : (map, mapindex)=>{
		if(cga.travel.gelaer.isSettled)
			return true;
		
		return (map == '哥拉尔镇') ? true : false;
	},
	translate : (pair)=>{
		return false;
	},
	loadconfig : (obj)=>{
		return true;
	},
	inputcb : (cb)=>{
		cb(null);
	}
}