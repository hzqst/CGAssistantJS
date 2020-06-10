// 中文标识
const Roles = {
	store: 1,
	worker: 2
};
let isBankFull = false;
module.exports = function(cga, options = {role: 1, position: 1, itemFilter: () => true, gold: 0}) {
	let position = [82, 7];
	if (options.position == 2) {
		position = [82, 9];
	}
	if (options.role & Roles.store) {
		console.log('暂不支持仓库');
	} else if (options.role & Roles.worker) {
		console.log('暂不支持仓库');
	}
	console.log('存银行');
	if (isBankFull) {
		return Promise.reject();
	}
	return cga.emogua.goto(n => n.falan.mbank).then(
		() => cga.emogua.turnOrientation(0)
	).then(
		() => cga.emogua.saveToBank(options.itemFilter, options.gold)
	).then(
		full => isBankFull = full
	);
};
