require('\x2e\x2f\x63\x6f\x6d\x6d\x6f\x6e')['\x74\x68\x65\x6e'](async 红叶の脚本 => {
    leo.monitor.config.autoExit = false;     //是否开启5分钟不动结束脚本
	
    var 班车旗号 = '红叶', 
	招牌宠名称 = '大地牛头怪', 
	出战宠名称 = '黄金巨龙', 
	队伍人数 = 5, 
	最小人数 = 2, 
	回补是否登出或解散队伍 = false, 
	等级限制 = 161, 
	候车点 = 3, 
	
	_0x390356 = {
		//contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 150,
        minMp: 100,
        minPetHp: 100,
        minPetMp: 200,
		'\x6d\x69\x6e\x54\x65\x61\x6d\x4e\x75\x6d\x62\x65\x72': 最小人数,
		'\x63\x68\x65\x63\x6b\x65\x72': () => {
			var _0x583720 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x3f9a76 => _0x3f9a76['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
			if (!_0x583720 || _0x583720['\x73\x74\x61\x74\x65'] != 0x2)
				return !![];
		}
	}, _0x178a5f = [], _0x3db4ce = ![], _0x12301a = ![], _0x489002 = {
		'\x72\x65\x63\x68\x61\x72\x67\x65\x46\x6c\x61\x67': 0x1,
		'\x72\x65\x70\x61\x69\x72\x46\x6c\x61\x67': -0x1,
		'\x63\x72\x79\x73\x74\x61\x6c\x4e\x61\x6d\x65': '\u706b\u98ce\u7684\u6c34\u6676\uff08\x35\uff1a\x35\uff09',
		'\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65': '\u533b\u9053\u4e4b\u6b87'
	}, _0x1f2ded = [
		[
			0x8a,
			0x6a
		],
		[
			0x89,
			0x6a
		],
		[
			0x88,
			0x6a
		],
		[
			0x87,
			0x6a
		],
		[
			0x86,
			0x6a
		]
	];
    leo['\x6c\x6f\x67'](班车旗号 + '\u306e\u9ec4\u91d1\u9f99\u9aa8\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x33\x30\x7e\x35\x30\u7ea7\u642d\u4e58\uff0c\u542f\u52a8\x7e'), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x45\x41\x4d\x43\x48\x41\x54'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x43\x41\x52\x44'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x52\x41\x44\x45'], ![]);
    var _0x36e363 = 红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f'](), _0xeef8ab = _0x36e363['\x6e\x61\x6d\x65'], _0x5ad27d = !![];
    console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u51fa\u6218\u5ba0\u7269\u662f\uff1a\u3010' + 出战宠名称 + '\u3011');
    var _0x2ab256 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x15c584 => _0x15c584['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
    if (!_0x2ab256)
        return await leo['\x6c\x6f\x67']('\u8eab\u4e0a\u6ca1\u6709\u627e\u5230\u5e94\u8be5\u51fa\u6218\u7684\u5ba0\u7269\u3010' + 出战宠名称 + '\u3011\uff0c\u8bf7\u4fee\u6539\u914d\u7f6e\u540e\u91cd\u65b0\u542f\u52a8\u811a\u672c'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    leo['\x74\x6f\x64\x6f']()['\x74\x68\x65\x6e'](() => {
        return _0x12301a ? leo['\x6c\x6f\x67\x42\x61\x63\x6b']() : leo['\x6e\x65\x78\x74']();
    })['\x74\x68\x65\x6e'](() => {
        return _0x3db4ce ? leo['\x6c\x6f\x67\x42\x61\x63\x6b']()['\x74\x68\x65\x6e'](() => leo['\x70\x72\x65\x70\x61\x72\x65'](_0x489002)) : leo['\x6e\x65\x78\x74']();
    })['\x74\x68\x65\x6e'](() => {
        return leo['\x6c\x6f\x6f\x70'](() => leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65']()['\x74\x68\x65\x6e'](() => leo['\x63\x68\x65\x63\x6b\x48\x65\x61\x6c\x74\x68'](_0x489002['\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65'], ![]))['\x74\x68\x65\x6e'](() => {
            if (_0x5ad27d) {
                var _0x4c8b13 = 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']();
                if (_0x4c8b13 == '\u91cc\u8c22\u91cc\u96c5\u5821' || _0x4c8b13 == '\u6cd5\u5170\u57ce')
                    return leo['\x6c\x6f\x67\x42\x61\x63\x6b']();
                if (_0x4c8b13 == '\u827e\u5c14\u838e\u5c9b')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x1f2ded[候车点 - 0x1])['\x74\x68\x65\x6e'](() => leo['\x74\x75\x72\x6e\x44\x69\x72'](0x6))['\x74\x68\x65\x6e'](() => {
                        var _0x598352 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x3f0670 => _0x3f0670['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 招牌宠名称);
                        _0x598352 && _0x598352['\x73\x74\x61\x74\x65'] != 0x3 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x598352['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x52\x45\x53\x54']);
                        var _0x466f7b = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x46a3ed => _0x46a3ed['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == 出战宠名称);
                        return _0x466f7b && _0x466f7b['\x73\x74\x61\x74\x65'] != 0x2 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x466f7b['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x42\x41\x54\x54\x4c\x45']), leo['\x64\x65\x6c\x61\x79'](0x3e8)['\x74\x68\x65\x6e'](() => leo['\x74\x75\x72\x6e\x44\x69\x72'](0x2));
                    })['\x74\x68\x65\x6e'](() => _0x4848ec(队伍人数, _0x390356['\x6d\x69\x6e\x54\x65\x61\x6d\x4e\x75\x6d\x62\x65\x72']))['\x74\x68\x65\x6e'](() => leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                        0x9d,
                        0x5d
                    ]))['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0x1f4))['\x74\x68\x65\x6e'](() => leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0))['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0x1f4));
                if (_0x4c8b13 == '\u5192\u9669\u8005\u65c5\u9986')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                        0x26,
                        0x30,
                        '\u827e\u590f\u5c9b'
                    ]);
                if (_0x4c8b13 == '\u533b\u9662')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                        0x1c,
                        0x34,
                        '\u827e\u590f\u5c9b'
                    ]);
                if (_0x4c8b13 == '\u827e\u590f\u5c9b')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                        0x66,
                        0x73,
                        '\u5192\u9669\u8005\u65c5\u9986'
                    ])['\x74\x68\x65\x6e'](() => leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([
                        0x25,
                        0x1e
                    ]))['\x74\x68\x65\x6e'](() => leo['\x77\x61\x6c\x6b\x4c\x69\x73\x74']([
                        [
                            0x26,
                            0x1e
                        ],
                        [
                            0x25,
                            0x1e
                        ],
                        [
                            0x26,
                            0x1e
                        ],
                        [
                            0x25,
                            0x1e
                        ]
                    ]))['\x74\x68\x65\x6e'](() => leo['\x73\x65\x6c\x6c'](0x25, 0x1d))['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0x1388))['\x74\x68\x65\x6e'](() => leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                        [
                            0x26,
                            0x30,
                            '\u827e\u590f\u5c9b'
                        ],
                        [
                            0x70,
                            0x51,
                            '\u533b\u9662'
                        ],
                        [
                            0x23,
                            0x2e
                        ]
                    ]))['\x74\x68\x65\x6e'](() => leo['\x77\x61\x6c\x6b\x4c\x69\x73\x74']([
                        [
                            0x23,
                            0x2d
                        ],
                        [
                            0x23,
                            0x2e
                        ],
                        [
                            0x23,
                            0x2d
                        ],
                        [
                            0x23,
                            0x2e
                        ]
                    ]))['\x74\x68\x65\x6e'](() => leo['\x73\x75\x70\x70\x6c\x79'](0x24, 0x2e))['\x74\x68\x65\x6e'](() => leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                        [
                            0x1c,
                            0x34,
                            '\u827e\u590f\u5c9b'
                        ],
                        [
                            0xbe,
                            0x74,
                            '\u76d6\u96f7\u5e03\u4f26\u68ee\u6797'
                        ]
                    ]));
                if (_0x4c8b13 == '\u76d6\u96f7\u5e03\u4f26\u68ee\u6797')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([[
                            0xe7,
                            0xde,
                            '\u5e03\u62c9\u57fa\u59c6\u9ad8\u5730'
                        ]]);
                if (_0x4c8b13 == '\u5e03\u62c9\u57fa\u59c6\u9ad8\u5730')
                    return leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                        [
                            0x82,
                            0xbc
                        ],
                        [
                            0x82,
                            0xbd
                        ]
                    ])['\x74\x68\x65\x6e'](() => {
                        return console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u5f00\u59cb\u6218\u6597'), leo['\x65\x6e\x63\x6f\x75\x6e\x74\x65\x72\x54\x65\x61\x6d\x4c\x65\x61\x64\x65\x72'](_0x390356)['\x74\x68\x65\x6e'](() => {
                            return console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u89e6\u53d1\u56de\u8865'), 回补是否登出或解散队伍 ? leo['\x73\x61\x79']('\u767b\u51fa\u56de\u8865\uff0c\u5927\u6811\u96c6\u5408\uff0c\u5404\u4f4d\u5c0f\u4f19\u4f34\u8ddf\u4e0a\x7e\uff01')['\x74\x68\x65\x6e'](() => leo['\x6c\x6f\x67\x42\x61\x63\x6b']()) : leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b\x4c\x69\x73\x74']([
                                [
                                    0x1e,
                                    0xc1,
                                    '\u76d6\u96f7\u5e03\u4f26\u68ee\u6797'
                                ],
                                [
                                    0xc7,
                                    0xd3,
                                    '\u827e\u590f\u5c9b'
                                ],
                                [
                                    0x95,
                                    0x61
                                ]
                            ])['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0x1f4))['\x74\x68\x65\x6e'](() => leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0))['\x74\x68\x65\x6e'](() => leo['\x64\x65\x6c\x61\x79'](0x1f4));
                        });
                    });
            }
            return leo['\x64\x65\x6c\x61\x79'](0xbb8);
        })['\x63\x61\x74\x63\x68'](console['\x6c\x6f\x67']));
    });
    var _0x17b47e = 0x2, _0x185d54 = 0x1e, _0x4848ec = (_0xe9acbd, _0x568909) => {
            leo['\x73\x61\x79'](班车旗号 + '\u306e\u9ec4\u91d1\u9f99\u9aa8\u516c\u76ca\u73ed\u8f66\uff0c\u63a8\u8350\x33\x30\x7e\x35\x30\u7ea7\u642d\u4e58\uff0c\u5efa\u8bae\u5e26\u706b\u98ce\u6c34\u6676', _0x17b47e), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], !![]);
            if (_0xe9acbd <= 0x1)
                return leo['\x6e\x65\x78\x74']();
            return leo['\x74\x6f\x64\x6f']()['\x74\x68\x65\x6e'](() => {
                var _0x311c3e = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x3f97e8 => _0x3f97e8['\x6e\x61\x6d\x65'] != _0xeef8ab && _0x3f97e8['\x6c\x65\x76\x65\x6c'] >= 等级限制);
                if (_0x311c3e['\x6c\x65\x6e\x67\x74\x68'] > 0x0)
                    return leo['\x6b\x69\x63\x6b\x6f\x66\x66'](_0x311c3e[0x0]['\x6e\x61\x6d\x65'])['\x74\x68\x65\x6e'](() => _0x4848ec(_0xe9acbd, _0x568909));
            })['\x74\x68\x65\x6e'](() => {
                var _0x1225d9 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                if (_0x1225d9['\x6c\x65\x6e\x67\x74\x68'] == _0xe9acbd) {
                    leo['\x73\x61\x79'](班车旗号 + '\u306e\u9ec4\u91d1\u9f99\u9aa8\u516c\u76ca\u73ed\u8f66\uff0c\u5df2\u6ee1\u5458\uff0c\u51fa\u53d1\x7e', _0x17b47e), _0x178a5f = [];
                    var _0x1225d9 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                    for (var _0x2f0388 in _0x1225d9) {
                        _0x178a5f[_0x2f0388] = _0x1225d9[_0x2f0388]['\x6e\x61\x6d\x65'];
                    }
                    return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u9ec4\u91d1\u9f99\u9aa8\x5d\uff0c\u961f\u5458\x5b' + _0x178a5f['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x17b47e), leo['\x64\x6f\x6e\x65']();
                } else {
                    if (_0x1225d9['\x6c\x65\x6e\x67\x74\x68'] >= _0x568909) {
                        if (_0x185d54 > 0x0)
                            return leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x568909 + '\u3011\uff0c\u51fa\u53d1\u5012\u8ba1\u65f6' + _0x185d54 + '\u79d2', _0x17b47e), _0x185d54 = _0x185d54 - 0x5, leo['\x64\x65\x6c\x61\x79'](0x1388)['\x74\x68\x65\x6e'](() => _0x4848ec(_0xe9acbd, _0x568909));
                        else {
                            leo['\x73\x61\x79']('\u5df2\u6ee1\u6700\u5c0f\u4eba\u6570\u3010' + _0x568909 + '\u3011\uff0c\u5012\u8ba1\u65f6\u7ed3\u675f\uff0c\u51fa\u53d1', _0x17b47e), _0x178a5f = [];
                            var _0x1225d9 = 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']();
                            for (var _0x2f0388 in _0x1225d9) {
                                _0x178a5f[_0x2f0388] = _0x1225d9[_0x2f0388]['\x6e\x61\x6d\x65'];
                            }
                            return leo['\x73\x61\x79']('\u6b22\u8fce\u4e58\u5750' + 班车旗号 + '\u306e\u73ed\u8f66\uff0c\u672c\u6b21\u65c5\u9014\u76ee\u7684\u5730\u662f\x5b\u9ec4\u91d1\u9f99\u9aa8\x5d\uff0c\u961f\u5458\x5b' + _0x178a5f['\x74\x6f\x53\x74\x72\x69\x6e\x67']() + '\x5d', _0x17b47e), _0x185d54 = 0x1e, leo['\x64\x6f\x6e\x65']();
                        }
                    } else
                        return _0x185d54 = 0x1e, leo['\x64\x65\x6c\x61\x79'](0x2710)['\x74\x68\x65\x6e'](() => _0x4848ec(_0xe9acbd, _0x568909));
                }
            });
        };
});