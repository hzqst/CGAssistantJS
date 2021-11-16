require('\x2e\x2f\x63\x6f\x6d\x6d\x6f\x6e')['\x74\x68\x65\x6e'](async 红叶の脚本 => {
    leo.monitor.config.autoExit = false;     //是否开启5分钟不动结束脚本
	
    var 班车旗号 = '红叶', 
	招牌宠名称 = '火焰牛头怪', 
	出战宠名称 = '黄金巨龙', 
	队伍人数 = 5, 
	最小人数 = 2, 
	回补是否登出或解散队伍 = false, 
	等级限制 = 161, 
	候车点 = 2, 
	
	_0x2f1422 = {
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
			var _0x50dfa7 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x3abc53 => _0x3abc53['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
			if (!_0x50dfa7 || _0x50dfa7['\x73\x74\x61\x74\x65'] != 0x2)
				return !![];
		}
	}, _0x7bc260 = [], _0x468836 = {
		'\x63\x72\x79\x73\x74\x61\x6c\x4e\x61\x6d\x65': '\u706b\u98ce\u7684\u6c34\u6676\uff08\x35\uff1a\x35\uff09',
		'\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65': '\u533b\u9053\u4e4b\u6b87'
	}, _0x55296c = [
		[
			0x58,
			0x52
		],
		[
			0x59,
			0x52
		],
		[
			0x5a,
			0x52
		],
		[
			0x5b,
			0x52
		],
		[
			0x5c,
			0x52
		]
	];
    leo['\x6c\x6f\x67'](班车旗号 + '\u306e\u6c99\u6ee9\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x37\x30\x7e\x39\x30\u7ea7\u642d\u4e58\uff0c\u542f\u52a8\x7e'), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x45\x41\x4d\x43\x48\x41\x54'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x43\x41\x52\x44'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x52\x41\x44\x45'], ![]);
    var _0x5791d1 = 红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f'](), _0x2fd189 = _0x5791d1['\x6e\x61\x6d\x65'], _0xfa92a1 = !![];
    console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u51fa\u6218\u5ba0\u7269\u662f\uff1a\u3010' + 出战宠名称 + '\u3011');
    var _0x68ddfa = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x413766 => _0x413766['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
    if (!_0x68ddfa)
        return await leo['\x6c\x6f\x67']('\u8eab\u4e0a\u6ca1\u6709\u627e\u5230\u5e94\u8be5\u51fa\u6218\u7684\u5ba0\u7269\u3010' + 出战宠名称 + '\u3011\uff0c\u8bf7\u4fee\u6539\u914d\u7f6e\u540e\u91cd\u65b0\u542f\u52a8\u811a\u672c'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    var _0x42de95 = 0x4, _0x578c30 = 0x1e, _0x921275 = (_0x24f1c8, _0x3ed66d) => {
            leo['\x73\x61\x79'](班车旗号 + '\u306e\u6c99\u6ee9\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x37\x30\x7e\x39\x30\u7ea7\u642d\u4e58\uff0c\u5efa\u8bae\u5e26\u706b\u98ce\u6c34\u6676', _0x42de95), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]);
            if (_0x24f1c8 <= 0x1)
                return leo['\x6e\x65\x78\x74']();
            return leo['\x74\x6f\x64\x6f']()['\x74\x68\x65\x6e'](() => {
                var _0x15fed0 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x580005 => _0x580005['\x6e\x61\x6d\x65'] != _0x2fd189 && _0x580005['\x6c\x65\x76\x65\x6c'] >= 等级限制);
                if (_0x15fed0['\x6c\x65\x6e\x67\x74\x68'] > 0x0)
                    return leo['\x6b\x69\x63\x6b\x6f\x66\x66'](_0x15fed0[0x0]['\x6e\x61\x6d\x65'])['\x74\x68\x65\x6e'](() => _0x921275(_0x24f1c8, _0x3ed66d));
            })['\x74\x68\x65\x6e'](() => {
                var _0xb9daf4 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                if (_0xb9daf4['\x6c\x65\x6e\x67\x74\x68'] == _0x24f1c8) {
                    leo['\x73\x61\x79'](班车旗号 + '\u306e\u6c99\u6ee9\u516c\u76ca\u73ed\u8f66\uff0c\u5df2\u6ee1\u5458\uff0c\u51fa\u53d1\x7e', _0x42de95), _0x7bc260 = [];
                    var _0xb9daf4 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                    for (var _0x5bcf55 in _0xb9daf4) {
                        _0x7bc260[_0x5bcf55] = _0xb9daf4[_0x5bcf55]['\x6e\x61\x6d\x65'];
                    }
                    return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u6c99\u6ee9\x5d\uff0c\u961f\u5458\x5b' + _0x7bc260['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x42de95), leo['\x64\x6f\x6e\x65']();
                } else {
                    if (_0xb9daf4['\x6c\x65\x6e\x67\x74\x68'] >= _0x3ed66d) {
                        if (_0x578c30 > 0x0)
                            return leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x3ed66d + '\u3011\uff0c\u51fa\u53d1\u5012\u8ba1\u65f6' + _0x578c30 + '\u79d2', _0x42de95), _0x578c30 = _0x578c30 - 0x5, leo['\x64\x65\x6c\x61\x79'](0x1388)['\x74\x68\x65\x6e'](() => _0x921275(_0x24f1c8, _0x3ed66d));
                        else {
                            leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x3ed66d + '\u3011\uff0c\u5012\u8ba1\u65f6\u7ed3\u675f\uff0c\u51fa\u53d1', _0x42de95), _0x7bc260 = [];
                            var _0xb9daf4 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                            for (var _0x5bcf55 in _0xb9daf4) {
                                _0x7bc260[_0x5bcf55] = _0xb9daf4[_0x5bcf55]['\x6e\x61\x6d\x65'];
                            }
                            return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u6c99\u6ee9\x5d\uff0c\u961f\u5458\x5b' + _0x7bc260['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x42de95), _0x578c30 = 0x1e, leo['\x64\x6f\x6e\x65']();
                        }
                    } else
                        return _0x578c30 = 0x1e, leo['\x64\x65\x6c\x61\x79'](0x2710)['\x74\x68\x65\x6e'](() => _0x921275(_0x24f1c8, _0x3ed66d));
                }
            });
        };
    await leo['\x6c\x6f\x6f\x70'](async () => {
        try {
            await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65']();
            红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] >= 0xf1b30 && (await leo['\x6c\x6f\x67']('\u94b1\u5305\u5feb\u6ee1\u4e86\uff1a' + _0x5791d1['\x67\x6f\x6c\x64'] + '\u53bb\u94f6\u884c\u5b58\u94b1'), await leo['\x67\x6f\x74\x6f'](_0x56c2da => _0x56c2da['\x66\x61\x6c\x61\x6e']['\x62\x61\x6e\x6b'])['\x74\x68\x65\x6e'](() => leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => leo['\x6d\x6f\x76\x65\x47\x6f\x6c\x64'](0x186a0, 红叶の脚本['\x4d\x4f\x56\x45\x5f\x47\x4f\x4c\x44\x5f\x54\x4f\x42\x41\x4e\x4b']))['\x74\x68\x65\x6e'](() => {
                if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] >= 0xdbba0)
                    return leo['\x6c\x6f\x67']('\u94b1\u5305\u6ee1\u4e86\uff0c\u94f6\u884c\u4e5f\u653e\u4e0d\u4e0b\u4e86\uff0c\u811a\u672c\u7ed3\u675f'), leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x18);
            }));
            await leo['\x63\x68\x65\x63\x6b\x48\x65\x61\x6c\x74\x68'](_0x468836['\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65']), await leo['\x63\x68\x65\x63\x6b\x43\x72\x79\x73\x74\x61\x6c'](_0x468836['\x63\x72\x79\x73\x74\x61\x6c\x4e\x61\x6d\x65']);
            红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() != '\u5723\u9a91\u58eb\u8425\u5730' && await leo['\x67\x6f\x74\x6f'](_0x2d7bf7 => _0x2d7bf7['\x63\x61\x6d\x70']['\x78']);
            await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x55296c[候车点 - 0x1]), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x6);
            var _0x2d5fb7 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0xd1e2f5 => _0xd1e2f5['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 招牌宠名称);
            _0x2d5fb7 && _0x2d5fb7['\x73\x74\x61\x74\x65'] != 0x3 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x2d5fb7['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x52\x45\x53\x54']);
            var _0x49e779 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x24d2af => _0x24d2af['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
            _0x49e779 && _0x49e779['\x73\x74\x61\x74\x65'] != 0x2 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x49e779['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x42\x41\x54\x54\x4c\x45']), await leo['\x64\x65\x6c\x61\x79'](0x3e8), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x2), await _0x921275(队伍人数, _0x2f1422['\x6d\x69\x6e\x54\x65\x61\x6d\x4e\x75\x6d\x62\x65\x72']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x57,
                    0x48,
                    '\u5de5\u623f'
                ],
                [
                    0x14,
                    0x17
                ]
            ]), await leo['\x77\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x14,
                    0x16
                ],
                [
                    0x14,
                    0x17
                ],
                [
                    0x14,
                    0x16
                ]
            ]), await leo['\x73\x65\x6c\x6c'](0x15, 0x17), await leo['\x64\x65\x6c\x61\x79'](0x1388), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x1e,
                    0x25,
                    '\u5723\u9a91\u58eb\u8425\u5730'
                ],
                [
                    0x5f,
                    0x48,
                    '\u533b\u9662'
                ],
                [
                    0x9,
                    0x14
                ]
            ]), await leo['\x77\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x9,
                    0xb
                ],
                [
                    0x9,
                    0xc
                ],
                [
                    0x9,
                    0xb
                ],
                [
                    0x9,
                    0xc
                ]
            ]), await leo['\x73\x75\x70\x70\x6c\x79'](0xb, 0xb), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                0x12,
                0xf
            ]), await leo['\x77\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x11,
                    0xf
                ],
                [
                    0x12,
                    0xf
                ],
                [
                    0x11,
                    0xf
                ],
                [
                    0x12,
                    0xf
                ]
            ]), await leo['\x73\x75\x70\x70\x6c\x79'](0x12, 0xe), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                [
                    0x0,
                    0x14,
                    '\u5723\u9a91\u58eb\u8425\u5730'
                ],
                [
                    0x24,
                    0x57,
                    '\u80af\u5409\u7f57\u5c9b'
                ],
                [
                    0x1df,
                    0xcf
                ]
            ]), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u5f00\u59cb\u6218\u6597'), await leo['\x65\x6e\x63\x6f\x75\x6e\x74\x65\x72\x54\x65\x61\x6d\x4c\x65\x61\x64\x65\x72'](_0x2f1422), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u89e6\u53d1\u56de\u8865'), await leo['\x64\x65\x6c\x61\x79'](0x7d0), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                0x227,
                0x14c,
                '\u5723\u9a91\u58eb\u8425\u5730'
            ]), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x55296c[候车点 - 0x1]), 回补是否登出或解散队伍 && await leo['\x6c\x65\x61\x76\x65\x54\x65\x61\x6d'](), await leo['\x64\x65\x6c\x61\x79'](0x3e8);
        } catch (_0x478f6d) {
            console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u811a\u672c\u51fa\u9519\x3a' + _0x478f6d), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u91cd\u65b0\u5f00\u59cb');
        }
    });
});