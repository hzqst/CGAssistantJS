const fs = require('fs');

const splitter = '\\';
const rootPath = __dirname.substring(0, __dirname.lastIndexOf(splitter));
const configPath = rootPath + '\\config';
if (!fs.existsSync(configPath)) {
	fs.mkdirSync(configPath);
}
const getFileFullPath = () => configPath + require.main.filename.replace(rootPath, '').split('.')[0] + '.json';
const Config = {};
Config.read = (defaults = {}) => {
	const filePath = getFileFullPath();
	console.log('读取配置文件', filePath);
	try {
		return Object.assign(defaults, JSON.parse(fs.readFileSync(filePath)));
	} catch (e) {
		return Config.save(defaults);
	}
};
Config.readFromConfigPath = (relativeFile) => {
	try {
		return JSON.parse(fs.readFileSync(configPath + '\\' + relativeFile));
	} catch (e) {
		return {};
	}
};
const createDir = (names) => {
	let currentDir = rootPath;
	for (const name of names) {
		currentDir += splitter + name;
		if (!fs.existsSync(currentDir)) {
			fs.mkdirSync(currentDir);
		}
	}
};
const save = (filePath, config) => {
	console.log('保存配置文件', filePath);
	const parent = filePath.substring(0, filePath.lastIndexOf(splitter));
	if (!fs.existsSync(parent)) createDir(parent.replace(rootPath, '').split(splitter).filter(s => s));
	fs.writeFileSync(filePath, JSON.stringify(config));
};
Config.save = (config) => {
	save(getFileFullPath());
	return config;
};
Config.saveToConfigPath = (relativeFile, config) => {
	save(configPath + '\\' + relativeFile, config);
	return config;
};

module.exports = Config;
