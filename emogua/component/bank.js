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
	if (isBankFull) {
		console.log('银行已满');
		return Promise.reject();
	}
	console.log('存银行');
	return cga.emogua.goto(n => n.falan.mbank).then(
		() => cga.emogua.turnOrientation(0)
	).then(
		() => cga.emogua.saveToBank(options.itemFilter, options.gold)
	).then(
		full => isBankFull = full
	);
};
