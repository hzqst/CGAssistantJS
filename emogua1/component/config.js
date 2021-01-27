const fs = require('fs');

const getSamePrefixIndex = (a,b) => {
	const length = Math.min(a.length, b.length);
	for (let i = 0; i < length; i++) {
		if (a.charAt(i) != b.charAt(i)) return i;
	}
	return length;
}
const splitter = '\\';
const rootPath = __dirname.substring(0, __dirname.lastIndexOf(splitter));
const configPath = rootPath + splitter + 'config';
if (!fs.existsSync(configPath)) {
	fs.mkdirSync(configPath);
}
const pathPrefixIndex = getSamePrefixIndex(rootPath, require.main.filename);
const getFileFullPath = () => configPath + (rootPath.length == pathPrefixIndex ? '' : splitter + '_outer_' + splitter) + require.main.filename.substring(pathPrefixIndex).split('.')[0] + '.json';
const Config = {};
Config.read = (defaults = {}) => {
	const filePath = getFileFullPath();
	console.log('读取配置文件', filePath);
	try {
		return Object.assign(defaults, JSON.parse(fs.readFileSync(filePath)));
	} catch (e) {
		console.log('配置文件错误', e);
		return Config.save(defaults);
	}
};
Config.readFromConfigPath = (relativeFile) => {
	try {
		return JSON.parse(fs.readFileSync(configPath + splitter + relativeFile));
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
	fs.writeFileSync(filePath, JSON.stringify(config,null,'\t'));
};
Config.save = (config) => {
	save(getFileFullPath(), config);
	return config;
};
Config.saveToConfigPath = (relativeFile, config) => {
	save(configPath + splitter + relativeFile, config);
	return config;
};

module.exports = Config;
