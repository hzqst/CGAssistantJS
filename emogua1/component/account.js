module.exports = (async () => {
	const cga = await require('./wrapper');
	const Account = {};
	Account.keepLine = async (line) => {
		if (line >= 1 && line <= 10) {
			if (cga.GetMapIndex().index2 != line) {
				console.log('掉线自动换线，将切换至指定线路', line);
				await cga.emogua.loadGuiScript({autorestart: true});
				await cga.emogua.loadGuiAccount({server: line});
				await cga.emogua.delay(5000);
				cga.LogOut();
			}
		}
	};
	return Account;
})();
