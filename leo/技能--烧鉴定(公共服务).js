require('\x2e\x2f\x63\x6f\x6d\x6d\x6f\x6e')['\x74\x68\x65\x6e'](async 红叶の脚本 => {
    var 地图名字 = '里谢里雅堡', //有效值【艾尔莎岛】或者【里谢里雅堡】
	坐标点 = [25, 86], 
	人物朝向 = 0, //人物朝向 0-北 2-东 4-南 6-西
	补蓝值 = 200, 
	技能名称 = '鉴定', 
	喊话关键字 = '鉴定', 
	最大技能等级 = 10, 
	医生名字 = '医道之殇', 
	多少秒未完成交易自动拒绝 = 30, 
	最大交易返回失败次数 = 10;
	
    await leo['\x6c\x6f\x67']('\u7ea2\u53f6\u306e\u70e7\u9274\u5b9a\x28\u516c\u5171\u670d\u52a1\x29\u811a\u672c\uff0c\u6280\u80fd\u3010' + 技能名称 + '\u3011\uff0c\u542f\u52a8\x7e');
    if (地图名字 != '\u91cc\u8c22\u91cc\u96c5\u5821' && 地图名字 != '\u827e\u5c14\u838e\u5c9b')
        return console['\x65\x72\x72\x6f\x72']('\u5730\u70b9\u8bbe\u7f6e\u6709\u8bef\uff01\u7ed3\u675f\u811a\u672c'), leo['\x64\x65\x6c\x61\x79'](0x3c * 0x3c * 0x3e8);
    if (技能名称 != '\u9274\u5b9a')
        return console['\x65\x72\x72\x6f\x72']('\u6280\u80fd\u8bbe\u7f6e\u6709\u8bef\uff01\u7ed3\u675f\u811a\u672c'), leo['\x64\x65\x6c\x61\x79'](0x3c * 0x3c * 0x3e8);
    if (!红叶の脚本['\x66\x69\x6e\x64\x50\x6c\x61\x79\x65\x72\x53\x6b\x69\x6c\x6c'](技能名称))
        return console['\x65\x72\x72\x6f\x72']('\u63d0\u793a\uff1a\u6ca1\u6709' + 技能名称 + '\u6280\u80fd\uff01\u7ed3\u675f\u811a\u672c'), leo['\x64\x65\x6c\x61\x79'](0x3c * 0x3c * 0x3e8);
    var _0x25957d = 红叶の脚本['\x47\x65\x74\x53\x6b\x69\x6c\x6c\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x516418 => _0x516418['\x6e\x61\x6d\x65'] == 技能名称);
    最大技能等级 = _0x25957d['\x6c\x76'], console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u6280\u80fd\u7b49\u7ea7' + 最大技能等级);
    var _0x27516e = '\x5b\u7ea2\u53f6\u306e\u811a\u672c\x5d';
    红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x45\x41\x4d\x43\x48\x41\x54'], !![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]);
    var _0x55f5ae = ![], _0x21e524 = ![], _0x3893f3 = (_0x201373, _0x420634) => {
            return leo['\x6c\x6f\x6f\x70'](() => {
                console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u9274\u5b9a\u4f4d\u7f6e\u3010' + _0x420634['\x70\x6f\x73'] + '\u3011\u7684\u3010' + _0x420634['\x6e\x61\x6d\x65'] + '\u3011' + _0x27516e), 红叶の脚本['\x53\x74\x61\x72\x74\x57\x6f\x72\x6b'](_0x201373['\x69\x6e\x64\x65\x78'], 0x0);
                if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x6d\x70'] >= _0x420634['\x6c\x65\x76\x65\x6c'] * 0xa && 红叶の脚本['\x41\x73\x73\x65\x73\x73\x49\x74\x65\x6d'](_0x201373['\x69\x6e\x64\x65\x78'], _0x420634['\x70\x6f\x73']))
                    return leo['\x77\x61\x69\x74\x57\x6f\x72\x6b\x52\x65\x73\x75\x6c\x74'](_0x21e524 ? 0x7d0 : 0xdbba0)['\x74\x68\x65\x6e'](_0x569466 => {
                        if (_0x569466['\x73\x75\x63\x63\x65\x73\x73'])
                            return _0x21e524 = !![], leo['\x72\x65\x6a\x65\x63\x74']();
                    });
                return leo['\x72\x65\x6a\x65\x63\x74']();
            })['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0xc8));
        };
    await leo['\x6c\x6f\x6f\x70'](async () => {
        红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x68\x65\x61\x6c\x74\x68'] > 0x0 && await leo['\x63\x68\x65\x63\x6b\x48\x65\x61\x6c\x74\x68'](医生名字);
        if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] < 0x1388) {
            await leo['\x67\x6f\x74\x6f'](_0x49ea6c => _0x49ea6c['\x66\x61\x6c\x61\x6e']['\x62\x61\x6e\x6b']), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0), await leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x46\x52\x4f\x4d\x42\x41\x4e\x4b']);
            if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] < 0x1388)
                return leo['\x6c\x6f\x67']('\u94b1\u5230\u7528\u65f6\u65b9\u6068\u5c11\uff01\u8bf7\u8865\u5145\u8db3\u591f\u94f6\u5b50\u540e\u91cd\u65b0\u6267\u884c\u811a\u672c\uff01' + _0x27516e), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x72\x65\x6a\x65\x63\x74']();
        }
        红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x6d\x70'] <= 补蓝值 && (leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x6e\x61\x6d\x65'] != '\u91cc\u8c22\u91cc\u96c5\u5821' && await leo['\x67\x6f\x74\x6f'](_0x275c34 => _0x275c34['\x63\x61\x73\x74\x6c\x65']['\x78']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
            0x22,
            0x59
        ]), await leo['\x73\x75\x70\x70\x6c\x79'](0x23, 0x58), await leo['\x64\x65\x6c\x61\x79'](0x7d0));
        if (地图名字 == '\u827e\u5c14\u838e\u5c9b')
            leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x6e\x61\x6d\x65'] != '\u827e\u5c14\u838e\u5c9b' && await leo['\x67\x6f\x74\x6f'](_0x5362df => _0x5362df['\x65\x6c\x73\x61']['\x78']);
        else
            地图名字 == '\u91cc\u8c22\u91cc\u96c5\u5821' && (leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x6e\x61\x6d\x65'] != '\u91cc\u8c22\u91cc\u96c5\u5821' && await leo['\x67\x6f\x74\x6f'](_0x167a41 => _0x167a41['\x63\x61\x73\x74\x6c\x65']['\x78']));
        (leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x78'] != 坐标点[0x0] || leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x79'] != 坐标点[0x1]) && (await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](坐标点), await leo['\x74\x75\x72\x6e\x44\x69\x72'](人物朝向)), await leo['\x77\x61\x69\x74\x4d\x65\x73\x73\x61\x67\x65\x55\x6e\x74\x69\x6c'](async _0x1d7aac => {
            if (_0x1d7aac['\x6d\x73\x67'] && _0x1d7aac['\x6d\x73\x67']['\x69\x6e\x64\x65\x78\x4f\x66']('\x5b\x47\x50\x5d') == 0x0 && _0x1d7aac['\x6d\x73\x67']['\x69\x6e\x64\x65\x78\x4f\x66'](喊话关键字) >= 0x0) {
                const _0x67e62d = 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x55\x6e\x69\x74\x73']()['\x66\x69\x6e\x64'](_0x4db014 => _0x4db014['\x75\x6e\x69\x74\x5f\x69\x64'] == _0x1d7aac['\x75\x6e\x69\x74\x69\x64']);
                var _0x6fa910 = _0x67e62d['\x75\x6e\x69\x74\x5f\x6e\x61\x6d\x65'], _0x1d0562 = [], _0x106503 = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73']();
                await leo['\x6c\x6f\x67']('\u7a7a\u4f59\u4f4d\u7f6e\u3010' + _0x106503['\x6c\x65\x6e\x67\x74\x68'] + '\u3011\uff0c\u6700\u9ad8\u6280\u80fd\u7b49\u7ea7\u3010' + 最大技能等级 + '\u3011' + _0x27516e);
                var _0x205f21 = {
                    '\x69\x74\x65\x6d\x46\x69\x6c\x74\x65\x72': (_0x25fab1, _0x42f9e4) => ![],
                    '\x70\x65\x74\x46\x69\x6c\x74\x65\x72': (_0x233e83, _0x59897d) => ![],
                    '\x67\x6f\x6c\x64': 0x0,
                    '\x70\x61\x72\x74\x79\x53\x74\x75\x66\x66\x73\x43\x68\x65\x63\x6b\x65\x72': _0x17da22 => {
                        if (_0x17da22['\x69\x74\x65\x6d\x73']['\x6c\x65\x6e\x67\x74\x68'] == 0x0)
                            return ![];
                        var _0x580306 = 0x0, _0x5dbd96 = -0x1, _0x3b1828 = '';
                        for (var _0x3ae1b6 = 0x0; _0x3ae1b6 < _0x17da22['\x69\x74\x65\x6d\x73']['\x6c\x65\x6e\x67\x74\x68']; _0x3ae1b6++) {
                            var _0xefcb6e = _0x17da22['\x69\x74\x65\x6d\x73'][_0x3ae1b6];
                            if (!_0xefcb6e['\x69\x6e\x63\x6c\x75\x64\x65\x73']('\uff1f')) {
                                _0x580306 = 0x1, _0x5dbd96 = _0xefcb6e['\x70\x6f\x73'] - 0x7, _0x3b1828 = _0xefcb6e['\x6e\x61\x6d\x65'];
                                break;
                            } else {
                                if (_0xefcb6e['\x6c\x65\x76\x65\x6c'] > 最大技能等级) {
                                    _0x580306 = 0x2, _0x5dbd96 = _0xefcb6e['\x70\x6f\x73'] - 0x7, _0x3b1828 = _0xefcb6e['\x6e\x61\x6d\x65'];
                                    break;
                                }
                            }
                        }
                        if (_0x580306 === 0x1)
                            return leo['\x73\x61\x79']('\u9274\u5b9a\u670d\u52a1\uff0c\u683c\u5b50\x5b' + _0x5dbd96 + '\x5d\u7684\u7269\u54c1\x5b' + _0x3b1828 + '\x5d\u65e0\u9700\u9274\u5b9a'), ![];
                        else {
                            if (_0x580306 === 0x2)
                                return leo['\x73\x61\x79']('\u9274\u5b9a\u670d\u52a1\uff0c\u683c\u5b50\x5b' + _0x5dbd96 + '\x5d\u7684\u7269\u54c1\x5b' + _0x3b1828 + '\x5d\u7b49\u7ea7\u8d85\u8fc7\u670d\u52a1\u6280\u80fd\u7b49\u7ea7'), ![];
                        }
                        return _0x1d0562 = _0x17da22['\x69\x74\x65\x6d\x73']['\x6d\x61\x70'](_0x36d1d1 => _0x36d1d1['\x6e\x61\x6d\x65']), !![];
                    }
                };
                _0x55f5ae = ![];
                var _0x4b4e47 = setTimeout(() => {
                    !_0x55f5ae && 红叶の脚本['\x44\x6f\x52\x65\x71\x75\x65\x73\x74'](红叶の脚本['\x52\x45\x51\x55\x45\x53\x54\x5f\x54\x59\x50\x45\x5f\x54\x52\x41\x44\x45\x5f\x52\x45\x46\x55\x53\x45']);
                }, 多少秒未完成交易自动拒绝 * 0x3e8);
                await leo['\x74\x72\x61\x64\x65'](_0x6fa910, _0x205f21), _0x55f5ae = !![], clearTimeout(_0x4b4e47);
                var _0x5e692b = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73'](), _0x3f0941 = _0x106503['\x66\x69\x6c\x74\x65\x72'](_0x524597 => !_0x5e692b['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x524597));
                if (_0x3f0941 && _0x3f0941['\x6c\x65\x6e\x67\x74\x68'] > 0x0) {
                    await leo['\x6c\x6f\x67']('\u83b7\u5f97\u6765\u81ea\u3010' + _0x6fa910 + '\u3011\u4ea4\u6613\u7684\u7269\u54c1\uff1a' + _0x1d0562 + _0x27516e), await leo['\x6c\x6f\x67']('\u5f00\u59cb\u9274\u5b9a\uff0c\u8bf7\u7a0d\u7b49\uff0c\u4e0d\u8981\u79bb\u5f00\u961f\u4f0d' + _0x27516e), await leo['\x6c\x6f\x6f\x70'](async () => {
                        _0x25957d = 红叶の脚本['\x47\x65\x74\x53\x6b\x69\x6c\x6c\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x1a2c7e => _0x1a2c7e['\x6e\x61\x6d\x65'] == 技能名称);
                        最大技能等级 != _0x25957d['\x6c\x76'] && (最大技能等级 = _0x25957d['\x6c\x76'], console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u6280\u80fd\u7b49\u7ea7' + 最大技能等级));
                        var _0x611060 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x5cd22a => _0x3f0941['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x5cd22a['\x70\x6f\x73']))['\x66\x69\x6e\x64'](_0x58714b => {
                            if (_0x58714b['\x6c\x65\x76\x65\x6c'] <= 最大技能等级)
                                return !_0x58714b['\x61\x73\x73\x65\x73\x73\x65\x64'];
                            return ![];
                        });
                        if (_0x611060)
                            红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x6d\x70'] <= 补蓝值 && (leo['\x67\x65\x74\x4d\x61\x70\x49\x6e\x66\x6f']()['\x6e\x61\x6d\x65'] != '\u91cc\u8c22\u91cc\u96c5\u5821' && await leo['\x67\x6f\x74\x6f'](_0x4803c4 => _0x4803c4['\x63\x61\x73\x74\x6c\x65']['\x78']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                                0x22,
                                0x59
                            ]), await leo['\x73\x75\x70\x70\x6c\x79'](0x23, 0x58), await leo['\x64\x65\x6c\x61\x79'](0x7d0)), await _0x3893f3(_0x25957d, _0x611060);
                        else
                            return await leo['\x6c\x6f\x67']('\u5df2\u5b8c\u6210\u9274\u5b9a' + _0x27516e), leo['\x72\x65\x6a\x65\x63\x74']();
                        return leo['\x64\x65\x6c\x61\x79'](0x1f4);
                    });
                    var _0x21e369 = 0x0;
                    await leo['\x6c\x6f\x6f\x70'](async () => {
                        _0x21e369++;
                        if (_0x21e369 > 最大交易返回失败次数)
                            return console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u8fbe\u5230\u6700\u5927\u4ea4\u6613\u8fd4\u56de\u5931\u8d25\u6b21\u6570'), leo['\x72\x65\x6a\x65\x63\x74']();
                        var _0x35c813 = {
                            '\x69\x74\x65\x6d\x46\x69\x6c\x74\x65\x72': (_0x16db43, _0x428838) => _0x3f0941['\x66\x69\x6e\x64\x49\x6e\x64\x65\x78'](_0x4b2d31 => _0x16db43['\x70\x6f\x73'] == _0x4b2d31) >= 0x0,
                            '\x70\x65\x74\x46\x69\x6c\x74\x65\x72': (_0x3f95f6, _0x37ca5c) => ![],
                            '\x67\x6f\x6c\x64': 0x0,
                            '\x70\x61\x72\x74\x79\x53\x74\x75\x66\x66\x73\x43\x68\x65\x63\x6b\x65\x72': _0x1cf664 => !![]
                        };
                        _0x55f5ae = ![];
                        var _0x51b025 = setTimeout(() => {
                            !_0x55f5ae && 红叶の脚本['\x44\x6f\x52\x65\x71\x75\x65\x73\x74'](红叶の脚本['\x52\x45\x51\x55\x45\x53\x54\x5f\x54\x59\x50\x45\x5f\x54\x52\x41\x44\x45\x5f\x52\x45\x46\x55\x53\x45']);
                        }, 多少秒未完成交易自动拒绝 * 0x3e8);
                        await leo['\x74\x72\x61\x64\x65'](_0x6fa910, _0x35c813), _0x55f5ae = !![], clearTimeout(_0x51b025);
                        var _0x44ee85 = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73']();
                        if (_0x44ee85['\x6c\x65\x6e\x67\x74\x68'] == _0x5e692b['\x6c\x65\x6e\x67\x74\x68'])
                            console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u4ea4\u6613\u5931\u8d25' + _0x21e369 + '\x2f' + 最大交易返回失败次数);
                        else
                            return leo['\x72\x65\x6a\x65\x63\x74']();
                    });
                }
                return await leo['\x64\x65\x6c\x61\x79'](0x3e8), !![];
            }
        });
    }), await leo['\x6c\x6f\x67']('\u811a\u672c\u7ed3\u675f' + _0x27516e);
});