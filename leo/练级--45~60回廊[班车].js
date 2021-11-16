require('\x2e\x2f\x63\x6f\x6d\x6d\x6f\x6e')['\x74\x68\x65\x6e'](async 红叶の脚本 => {
    leo.monitor.config.autoExit = false;     //是否开启5分钟不动结束脚本
	
    var 班车旗号 = '红叶', 
	招牌宠名称 = '火焰牛头怪', 
	出战宠名称 = '黄金巨龙', 
	队伍人数 = 5, 
	最小人数 = 2, 
	回补是否登出或解散队伍 = true, 
	等级限制 = 161, 
	候车点 = 3, 
	
	_0x1e87c9 = {
		//contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 3,
        visible: false, 
        minHp: 150,
        minMp: 100,
        minPetHp: 100,
        minPetMp: 200,
		'\x6d\x69\x6e\x54\x65\x61\x6d\x4e\x75\x6d\x62\x65\x72': 最小人数,
		'\x63\x68\x65\x63\x6b\x65\x72': () => {
			var _0x2adaf3 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x52ca66 => _0x52ca66['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
			if (!_0x2adaf3 || _0x2adaf3['\x73\x74\x61\x74\x65'] != 0x2)
				return !![];
		}
	}, _0x420fbb = [], _0x422940 = {
		'\x63\x72\x79\x73\x74\x61\x6c\x4e\x61\x6d\x65': '\u706b\u98ce\u7684\u6c34\u6676\uff08\x35\uff1a\x35\uff09',
		'\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65': '\u533b\u9053\u4e4b\u6b87'
	}, _0x252af5 = [
		[
			0x7,
			0x14
		],
		[
			0x8,
			0x14
		],
		[
			0x9,
			0x14
		],
		[
			0xa,
			0x14
		],
		[
			0xb,
			0x14
		]
	];
    leo['\x6c\x6f\x67'](班车旗号 + '\u306e\u56de\u5eca\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x34\x35\x7e\x36\x30\u7ea7\u642d\u4e58\uff0c\u542f\u52a8\x7e'), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x45\x41\x4d\x43\x48\x41\x54'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x43\x41\x52\x44'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x52\x41\x44\x45'], ![]);
    var _0x572322 = 红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f'](), _0x5d4371 = _0x572322['\x6e\x61\x6d\x65'], _0x2f17e4 = !![];
    console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u51fa\u6218\u5ba0\u7269\u662f\uff1a\u3010' + 出战宠名称 + '\u3011');
    var _0xad29e4 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x1fdc0d => _0x1fdc0d['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
    if (!_0xad29e4)
        return await leo['\x6c\x6f\x67']('\u8eab\u4e0a\u6ca1\u6709\u627e\u5230\u5e94\u8be5\u51fa\u6218\u7684\u5ba0\u7269\u3010' + 出战宠名称 + '\u3011\uff0c\u8bf7\u4fee\u6539\u914d\u7f6e\u540e\u91cd\u65b0\u542f\u52a8\u811a\u672c'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    var _0x5c1001 = 0x4, _0x799419 = 0x1e, _0x39ea5b = (_0x11d879, _0x51b292) => {
            leo['\x73\x61\x79'](班车旗号 + '\u306e\u56de\u5eca\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x34\x35\x7e\x36\x30\u7ea7\u642d\u4e58\uff0c\u5efa\u8bae\u5e26\u706b\u98ce\u6c34\u6676', _0x5c1001), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]);
            if (_0x11d879 <= 0x1)
                return leo['\x6e\x65\x78\x74']();
            return leo['\x74\x6f\x64\x6f']()['\x74\x68\x65\x6e'](() => {
                var _0x1f6b66 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']()['\x66\x69\x6c\x74\x65\x72'](_0xe74386 => _0xe74386['\x6e\x61\x6d\x65'] != _0x5d4371 && _0xe74386['\x6c\x65\x76\x65\x6c'] >= 等级限制);
                if (_0x1f6b66['\x6c\x65\x6e\x67\x74\x68'] > 0x0)
                    return leo['\x6b\x69\x63\x6b\x6f\x66\x66'](_0x1f6b66[0x0]['\x6e\x61\x6d\x65'])['\x74\x68\x65\x6e'](() => _0x39ea5b(_0x11d879, _0x51b292));
            })['\x74\x68\x65\x6e'](() => {
                var _0x447c24 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                if (_0x447c24['\x6c\x65\x6e\x67\x74\x68'] == _0x11d879) {
                    leo['\x73\x61\x79'](班车旗号 + '\u306e\u56de\u5eca\u516c\u76ca\u73ed\u8f66\uff0c\u5df2\u6ee1\u5458\uff0c\u51fa\u53d1\x7e', _0x5c1001), _0x420fbb = [];
                    var _0x447c24 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                    for (var _0x365f26 in _0x447c24) {
                        _0x420fbb[_0x365f26] = _0x447c24[_0x365f26]['\x6e\x61\x6d\x65'];
                    }
                    return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u56de\u5eca\x5d\uff0c\u961f\u5458\x5b' + _0x420fbb['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x5c1001), leo['\x64\x6f\x6e\x65']();
                } else {
                    if (_0x447c24['\x6c\x65\x6e\x67\x74\x68'] >= _0x51b292) {
                        if (_0x799419 > 0x0)
                            return leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x51b292 + '\u3011\uff0c\u51fa\u53d1\u5012\u8ba1\u65f6' + _0x799419 + '\u79d2', _0x5c1001), _0x799419 = _0x799419 - 0x5, leo['\x64\x65\x6c\x61\x79'](0x1388)['\x74\x68\x65\x6e'](() => _0x39ea5b(_0x11d879, _0x51b292));
                        else {
                            leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x51b292 + '\u3011\uff0c\u5012\u8ba1\u65f6\u7ed3\u675f\uff0c\u51fa\u53d1', _0x5c1001), _0x420fbb = [];
                            var _0x447c24 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                            for (var _0x365f26 in _0x447c24) {
                                _0x420fbb[_0x365f26] = _0x447c24[_0x365f26]['\x6e\x61\x6d\x65'];
                            }
                            return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u56de\u5eca\x5d\uff0c\u961f\u5458\x5b' + _0x420fbb['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x5c1001), _0x799419 = 0x1e, leo['\x64\x6f\x6e\x65']();
                        }
                    } else
                        return _0x799419 = 0x1e, leo['\x64\x65\x6c\x61\x79'](0x2710)['\x74\x68\x65\x6e'](() => _0x39ea5b(_0x11d879, _0x51b292));
                }
            });
        };
    await leo['\x6c\x6f\x6f\x70'](async () => {
        try {
            await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65'](), await leo['\x6c\x6f\x67\x42\x61\x63\x6b'](), await leo['\x63\x68\x65\x63\x6b\x48\x65\x61\x6c\x74\x68'](_0x422940['\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65']), await leo['\x63\x68\x65\x63\x6b\x43\x72\x79\x73\x74\x61\x6c'](_0x422940['\x63\x72\x79\x73\x74\x61\x6c\x4e\x61\x6d\x65']), await leo['\x67\x6f\x74\x6f'](_0x22e398 => _0x22e398['\x63\x61\x73\x74\x6c\x65']['\x78']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                0x1f,
                0x4d
            ]), await leo['\x73\x65\x6c\x6c'](0x1e, 0x4d), await leo['\x64\x65\x6c\x61\x79'](0x1f4), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                0x34,
                0x48
            ]), await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x35, 0x48, leo['\x74\x61\x6c\x6b\x4e\x70\x63\x53\x65\x6c\x65\x63\x74\x6f\x72\x59\x65\x73'], '\u8fc7\u53bb\u4e0e\u73b0\u5728\u7684\u56de\u5eca'), await leo['\x64\x65\x6c\x61\x79'](0x1f4), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x252af5[候车点 - 0x1]), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x6);
            var _0x50310e = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x542a52 => _0x542a52['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 招牌宠名称);
            _0x50310e && _0x50310e['\x73\x74\x61\x74\x65'] != 0x3 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x50310e['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x52\x45\x53\x54']);
            var _0x258241 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x35bea9 => _0x35bea9['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
            _0x258241 && _0x258241['\x73\x74\x61\x74\x65'] != 0x2 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x258241['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x42\x41\x54\x54\x4c\x45']), await leo['\x64\x65\x6c\x61\x79'](0x3e8), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x2), await _0x39ea5b(队伍人数, _0x1e87c9['\x6d\x69\x6e\x54\x65\x61\x6d\x4e\x75\x6d\x62\x65\x72']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                0x9,
                0x19
            ]), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u5f00\u59cb\u6218\u6597'), await leo['\x65\x6e\x63\x6f\x75\x6e\x74\x65\x72\x54\x65\x61\x6d\x4c\x65\x61\x64\x65\x72'](_0x1e87c9), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u767b\u51fa\u56de\u8865'), await leo['\x64\x65\x6c\x61\x79'](0x3e8);
        } catch (_0x196637) {
            console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u811a\u672c\u51fa\u9519\x3a' + _0x196637), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u91cd\u65b0\u5f00\u59cb');
        }
    });
});