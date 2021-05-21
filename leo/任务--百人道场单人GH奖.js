require('\x2e\x2f\x63\x6f\x6d\x6d\x6f\x6e')['\x74\x68\x65\x6e'](async 红叶の脚本 =>{
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.autoExit = true;     //开启5分钟不动结束脚本
    var 要刷到多少层 = 20,
    医生名字 = '医道之殇',
    水晶 = '水火的水晶（5：5）',
    银行大小 = 20,
    补给百分比 = 0.5,
    启动是否先登出 = false,
    多少片碎片去换奖 = 8,
    目标奖项设定 = {
        G: true,     //是否要刷元素G奖
        H: true,     //是否要刷元素H奖
    },
	要存银行的奖品 = ['鼠王兑换券','火焰鼠闪卡「A1奖」','火焰鼠闪卡「A2奖」','火焰鼠闪卡「A3奖」','火焰鼠闪卡「A4奖」','火焰鼠闪卡「B1奖」','火焰鼠闪卡「B2奖」','火焰鼠闪卡「B3奖」','火焰鼠闪卡「B4奖」','宝石鼠钻石奖','宝石鼠月亮奖','宝石鼠金奖'],
    _0x3b9eb7 = {
        '\x47': {
            '\x74\x79\x70\x65': '\x47',
            '\x70\x69\x65\x63\x65\x73\x54\x79\x70\x65': '\x70\x69\x65\x63\x65\x73',
            '\x6e\x65\x65\x64\x43\x6f\x75\x6e\x74': 0x2,
            '\x74\x69\x6d\x65\x73': 0x0
        },
        '\x48': {
            '\x74\x79\x70\x65': '\x48',
            '\x70\x69\x65\x63\x65\x73\x54\x79\x70\x65': '\x70\x69\x65\x63\x65\x73',
            '\x6e\x65\x65\x64\x43\x6f\x75\x6e\x74': 0x1,
            '\x74\x69\x6d\x65\x73': 0x0
        }
    },
    _0x3b4ad5 = {},
    _0x47ab93 = Object['\x65\x6e\x74\x72\x69\x65\x73'](目标奖项设定)['\x66\x69\x6c\x74\x65\x72'](_0x3f22e5 =>_0x3f22e5[0x1])['\x6d\x61\x70'](_0x8c9ad3 =>_0x8c9ad3[0x0])['\x6a\x6f\x69\x6e'](),
    _0x2be60b = 红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f'](),
    _0x4dc4cc = _0x2be60b['\x6e\x61\x6d\x65'],
    _0x4cd0fe = () =>{
        for (var _0x326e7b in teams) {
            for (var _0x35c88b in teams[_0x326e7b]) {
                if (_0x4dc4cc == teams[_0x326e7b][_0x35c88b]) return teams[_0x326e7b];
            }
        }
        return null;
    },
    _0x140c29 = [_0x4dc4cc],
    _0x3e4bda = _0x140c29[0x0],
    _0x29625c = _0x140c29['\x6c\x65\x6e\x67\x74\x68'];
    await leo['\x6c\x6f\x67']('\u7ea2\u53f6\u306e\u767e\u4eba\u9053\u573a\u5355\u4eba\x47\x48\u811a\u672c\uff0c\u76ee\u6807\u697c\u5c42\u3010' + 要刷到多少层 + '\u3011\uff0c\u76ee\u6807\u5956\u9879\u3010' + _0x47ab93 + '\u3011\uff0c\u542f\u52a8\x7e');
    var _0x386202 = !![];
    _0x29625c == 0x1 && (await leo['\x70\x61\x6e\x65\x6c']['\x6c\x6f\x61\x64']('\u767e\u4eba\u914d\u7f6e\x2d\x2d\u6253\u624b\x2e\x6a\x73\x6f\x6e'), await leo['\x6c\x6f\x67']('\u3010\u5355\u4eba\u6a21\u5f0f\u3011\u5df2\u52a0\u8f7d\u9884\u8bbe\u9762\u677f\u914d\u7f6e\u3010\u767e\u4eba\u914d\u7f6e\x2d\x2d\u6253\u624b\x2e\x6a\x73\x6f\x6e\u3011'));
    var _0x53ceb0 = 0x1,
    _0xb9e8ba = () =>{
        var _0x1e8c6c = 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x49\x6e\x64\x65\x78']()['\x69\x6e\x64\x65\x78\x33'];
        return _0x1e8c6c - 0x23f0;
    },
    _0x40d2a0 = (_0x1d8fa1 = {}) =>{
        var _0xd64b1d = 红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f'](),
        _0x12c4ac = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x49\x6e\x66\x6f'](_0xd64b1d['\x70\x65\x74\x69\x64']);
        if (!_0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x68\x70']) _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x68\x70'] = 补给百分比;
        if (!_0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x6d\x70']) _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x6d\x70'] = 补给百分比;
        if (!_0x1d8fa1['\x70\x65\x74\x68\x70']) _0x1d8fa1['\x70\x65\x74\x68\x70'] = 补给百分比;
        if (!_0x1d8fa1['\x70\x65\x74\x6d\x70']) _0x1d8fa1['\x70\x65\x74\x6d\x70'] = 补给百分比;
        if (_0xd64b1d['\x68\x70'] < _0xd64b1d['\x6d\x61\x78\x68\x70'] * _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x68\x70'] || _0xd64b1d['\x6d\x70'] < _0xd64b1d['\x6d\x61\x78\x6d\x70'] * _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x6d\x70'] || _0x12c4ac['\x68\x70'] < _0x12c4ac['\x6d\x61\x78\x68\x70'] * _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x68\x70'] || _0x12c4ac['\x6d\x70'] < _0x12c4ac['\x6d\x61\x78\x6d\x70'] * _0x1d8fa1['\x70\x6c\x61\x79\x65\x72\x6d\x70']) return !! [];
        return ! [];
    },
    _0x30c35e = {
        '\x65\x61\x72\x74\x68': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87aa);
        },
        '\x77\x61\x74\x65\x72': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87ab);
        },
        '\x77\x69\x6e\x64': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87ac);
        },
        '\x66\x69\x72\x65': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87ad);
        },
        '\x61\x6c\x6c': () =>{
            return _0x30c35e['\x65\x61\x72\x74\x68']() + _0x30c35e['\x77\x61\x74\x65\x72']() + _0x30c35e['\x77\x69\x6e\x64']() + _0x30c35e['\x66\x69\x72\x65']();
        },
        '\x61\x72\x72': () =>{
            return [_0x30c35e['\x65\x61\x72\x74\x68'](), _0x30c35e['\x77\x61\x74\x65\x72'](), _0x30c35e['\x77\x69\x6e\x64'](), _0x30c35e['\x66\x69\x72\x65']()];
        }
    },
    _0x1a3183 = {
        '\x65\x61\x72\x74\x68': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87ae);
        },
        '\x77\x61\x74\x65\x72': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87af);
        },
        '\x77\x69\x6e\x64': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87b0);
        },
        '\x66\x69\x72\x65': () =>{
            return 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](0x87b1);
        },
        '\x61\x72\x72': () =>{
            return [_0x1a3183['\x65\x61\x72\x74\x68'](), _0x1a3183['\x77\x61\x74\x65\x72'](), _0x1a3183['\x77\x69\x6e\x64'](), _0x1a3183['\x66\x69\x72\x65']()];
        }
    },
    _0x12877e = (_0x1879fe, _0x6ae88d) =>{
        return _0x1879fe + Math['\x66\x6c\x6f\x6f\x72'](_0x6ae88d / 0x4);
    },
    _0x40145e = (_0x30c1dd, _0x50e887) =>{
        return _0x30c1dd['\x6d\x61\x70']((_0x7786ee, _0x34f2df, _0x509333) =>_0x12877e(_0x7786ee, _0x50e887[_0x34f2df]));
    },
    _0x419ac4 = ({
        type: _0x2ba1ff,
        piecesType: _0x49c976,
        needCount: _0x4f00e5
    },
    _0x13a99d, _0x597fdc) =>{
        var _0x421538 = {
            '\x74\x79\x70\x65': _0x2ba1ff,
            '\x63\x6f\x75\x6e\x74': 0x0,
            '\x63\x68\x61\x6e\x67\x65': [0x0, 0x0, 0x0, 0x0]
        };
        if (_0x49c976 == '\x63\x72\x79\x73\x74\x61\x6c') {
            piecesTypeProtect = !![];
            while ( !! []) {
                var _0x2bd878 = _0x40145e(_0x597fdc, _0x13a99d),
                _0x34d682 = _0x2bd878['\x66\x69\x6c\x74\x65\x72'](_0x260d11 =>_0x260d11 > 0x0);
                if (_0x34d682['\x6c\x65\x6e\x67\x74\x68'] < _0x4f00e5) break;
                else {
                    var _0x263646 = [];
                    for (var _0x46a458 = 0x0; _0x46a458 < _0x2bd878['\x6c\x65\x6e\x67\x74\x68']; _0x46a458++) {
                        if (_0x2bd878[_0x46a458] > 0x0) {
                            _0x263646['\x70\x75\x73\x68'](_0x46a458);
                            if (_0x263646['\x6c\x65\x6e\x67\x74\x68'] >= _0x4f00e5) break;
                        }
                    }
                    if (_0x263646['\x6c\x65\x6e\x67\x74\x68'] >= _0x4f00e5) {
                        _0x421538['\x63\x6f\x75\x6e\x74']++;
                        for (var _0x46a458 = 0x0; _0x46a458 < _0x263646['\x6c\x65\x6e\x67\x74\x68']; _0x46a458++) {
                            var _0x19062f = _0x263646[_0x46a458];
                            _0x597fdc[_0x19062f] > 0x0 ? _0x597fdc[_0x19062f]--:(_0x421538['\x63\x68\x61\x6e\x67\x65'][_0x19062f]++, _0x13a99d[_0x19062f] = _0x13a99d[_0x19062f] - 0x4);
                        }
                    } else break;
                }
            }
        } else {
            if (_0x49c976 == '\x70\x69\x65\x63\x65\x73') while ( !! []) {
                var _0x34d682 = _0x13a99d['\x66\x69\x6c\x74\x65\x72'](_0x271998 =>_0x271998 > 0x0);
                if (_0x34d682['\x6c\x65\x6e\x67\x74\x68'] < _0x4f00e5) break;
                else {
                    if (_0x2ba1ff === '\x47') {}
                    _0x2ba1ff === '\x48' && (目标奖项设定['\x47'] === !![] && (_0x13a99d[0x1] = 0x0, _0x13a99d[0x2] = 0x0, _0x13a99d[0x3] = 0x0));
                    var _0x37cbc4 = [];
                    for (var _0x46a458 = 0x0; _0x46a458 < _0x13a99d['\x6c\x65\x6e\x67\x74\x68']; _0x46a458++) {
                        if (_0x13a99d[_0x46a458] > 0x0) {
                            _0x37cbc4['\x70\x75\x73\x68'](_0x46a458);
                            if (_0x37cbc4['\x6c\x65\x6e\x67\x74\x68'] >= _0x4f00e5) break;
                        }
                    }
                    if (_0x37cbc4['\x6c\x65\x6e\x67\x74\x68'] >= _0x4f00e5) {
                        _0x421538['\x63\x6f\x75\x6e\x74']++;
                        for (var _0x46a458 = 0x0; _0x46a458 < _0x37cbc4['\x6c\x65\x6e\x67\x74\x68']; _0x46a458++) {
                            var _0x19062f = _0x37cbc4[_0x46a458];
                            _0x13a99d[_0x19062f]--;
                        }
                    } else break;
                }
            }
        }
        return _0x421538;
    },
    _0x1e5aa1 = () =>{
        var _0x17a7e5 = _0x30c35e['\x61\x72\x72'](),
        _0x3d231a = _0x1a3183['\x61\x72\x72'](),
        _0x76b87d = [],
        _0x7b86f2 = Object['\x65\x6e\x74\x72\x69\x65\x73'](目标奖项设定)['\x66\x69\x6c\x74\x65\x72'](_0x38c3c9 =>_0x38c3c9[0x1])['\x6d\x61\x70'](_0x16a272 =>_0x16a272[0x0]);
        if (_0x7b86f2 && _0x7b86f2['\x6c\x65\x6e\x67\x74\x68'] > 0x0) for (var _0x363162 = 0x0; _0x363162 < _0x7b86f2['\x6c\x65\x6e\x67\x74\x68']; _0x363162++) {
            var _0x439c9f = _0x419ac4(_0x3b9eb7[_0x7b86f2[_0x363162]], _0x17a7e5, _0x3d231a);
            _0x439c9f['\x63\x6f\x75\x6e\x74'] > 0x0 && _0x76b87d['\x70\x75\x73\x68'](_0x439c9f);
        }
        return _0x76b87d;
    },
    _0x21c4b6 = async _0x695285 =>{
        var _0x4f49a9 = ['\u5730', '\u6c34', '\u98ce', '\u706b'];
        await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x1c, 0x1d]),
        await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x6),
        await leo['\x73\x61\x79'](_0x4f49a9[_0x695285]),
        await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
    },
    _0x327b54 = async _0x34f78c =>{
        var _0x36282d = [[0x20, 0xd], [0x1d, 0xd], [0x1a, 0xd], [0x17, 0xd], [0x14, 0xd], [0x11, 0xd], [0xe, 0xd], [0xb, 0xd], [0x5, 0x13], [0x9, 0x13], [0x1d, 0x10], [0x1a, 0x10], [0x17, 0x10], [0x14, 0x10], [0x11, 0x10], [0xe, 0x10], [0xb, 0x8], [0xe, 0x8], [0x12, 0x8], [0x5, 0x16], [0x9, 0x16], [0x20, 0x1e], [0x1d, 0x1e], [0x1a, 0x1e], [0x17, 0x1e], [0x14, 0x1e], [0x11, 0x1e], [0xe, 0x1e], [0xb, 0x1e], [0x5, 0x19], [0x9, 0x19], [0x12, 0x12], [0x15, 0x12], [0xd, 0x12], [0x14, 0x15], [0x17, 0x15], [0x14, 0x18], [0x17, 0x18], [0xb, 0x23], [0xe, 0x23], [0x12, 0x23]],
        _0x313fa5 = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73']();
        if (_0x313fa5 && _0x313fa5['\x6c\x65\x6e\x67\x74\x68'] >= 0x2) await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x17, 0x18]),
        await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0),
        await leo['\x73\x61\x79'](_0x34f78c),
        await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
        else {
            var _0x4937d7 = Math['\x66\x6c\x6f\x6f\x72'](Math['\x72\x61\x6e\x64\x6f\x6d']() * _0x36282d['\x6c\x65\x6e\x67\x74\x68']);
            await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x36282d[_0x4937d7]),
            await leo['\x64\x65\x6c\x61\x79'](0x5dc);
        }
    },
    _0x55ff71 = async() =>{
        var _0x15839b = [[0x20, 0xd], [0x1d, 0xd], [0x1a, 0xd], [0x17, 0xd], [0x14, 0xd], [0x11, 0xd], [0xe, 0xd], [0xb, 0xd], [0x5, 0x13], [0x9, 0x13], [0x1d, 0x10], [0x1a, 0x10], [0x17, 0x10], [0x14, 0x10], [0x11, 0x10], [0xe, 0x10], [0xb, 0x8], [0xe, 0x8], [0x12, 0x8], [0x5, 0x16], [0x9, 0x16], [0x20, 0x1e], [0x1d, 0x1e], [0x1a, 0x1e], [0x17, 0x1e], [0x14, 0x1e], [0x11, 0x1e], [0xe, 0x1e], [0xb, 0x1e], [0x5, 0x19], [0x9, 0x19], [0x12, 0x12], [0x15, 0x12], [0xd, 0x12], [0x14, 0x15], [0x17, 0x15], [0x14, 0x18], [0x17, 0x18], [0xb, 0x23], [0xe, 0x23], [0x12, 0x23]],
        _0x2702ae = 0x1e;
        while ( !! []) {
            var _0x15284a = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x1c97eb =>_0x1c97eb['\x6e\x61\x6d\x65'] == '\u9f20\u738b\u60ca\u5947\u86cb');
            if (_0x15284a['\x6c\x65\x6e\x67\x74\x68'] > 0x0) {
                var _0x5557e0 = _0x15284a[0x0],
                _0xdc9363 = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73']();
                if (_0xdc9363 && _0xdc9363['\x6c\x65\x6e\x67\x74\x68'] > 0x0) await 红叶の脚本['\x55\x73\x65\x49\x74\x65\x6d'](_0x5557e0['\x70\x6f\x73']),
                await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
                else {
                    var _0x33ecca = Math['\x66\x6c\x6f\x6f\x72'](Math['\x72\x61\x6e\x64\x6f\x6d']() * _0x15839b['\x6c\x65\x6e\x67\x74\x68']);
                    await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x15839b[_0x33ecca]),
                    await leo['\x64\x65\x6c\x61\x79'](0x5dc),
                    _0x2702ae--,
                    _0x2702ae < 0x0 && (await leo['\x6c\x6f\x67']('\u5f00\u9f20\u738b\u60ca\u5947\u86cb\u5931\u8d25\uff0c\u7269\u54c1\u680f\u6ca1\u6709\u7a7a\u7684\u4f4d\u7f6e\u4e86'), _0x2702ae = 0x1e);
                }
            } else break;
        }
    },
    _0x42026b = async() =>{
        var _0x1a9bb3 = [[0x20, 0xd], [0x1d, 0xd], [0x1a, 0xd], [0x17, 0xd], [0x14, 0xd], [0x11, 0xd], [0xe, 0xd], [0xb, 0xd], [0x5, 0x13], [0x9, 0x13], [0x1d, 0x10], [0x1a, 0x10], [0x17, 0x10], [0x14, 0x10], [0x11, 0x10], [0xe, 0x10], [0xb, 0x8], [0xe, 0x8], [0x12, 0x8], [0x5, 0x16], [0x9, 0x16], [0x20, 0x1e], [0x1d, 0x1e], [0x1a, 0x1e], [0x17, 0x1e], [0x14, 0x1e], [0x11, 0x1e], [0xe, 0x1e], [0xb, 0x1e], [0x5, 0x19], [0x9, 0x19], [0x12, 0x12], [0x15, 0x12], [0xd, 0x12], [0x14, 0x15], [0x17, 0x15], [0x14, 0x18], [0x17, 0x18], [0xb, 0x23], [0xe, 0x23], [0x12, 0x23]],
        _0x367b12 = 0x1e;
        while ( !! []) {
            var _0x8b0bfb = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x5cbae6 =>_0x5cbae6['\x6e\x61\x6d\x65'] == '\u706b\u7130\u9f20\u95ea\u5361' || _0x5cbae6['\x6e\x61\x6d\x65'] == '\u5b9d\u77f3\u9f20\u95ea\u5361');
            if (_0x8b0bfb['\x6c\x65\x6e\x67\x74\x68'] > 0x0) {
                var _0x1ebbcd = _0x8b0bfb[0x0],
                _0x4e733c = leo['\x67\x65\x74\x45\x6d\x70\x74\x79\x42\x61\x67\x49\x6e\x64\x65\x78\x65\x73']();
                if (_0x4e733c && _0x4e733c['\x6c\x65\x6e\x67\x74\x68'] > 0x0) 红叶の脚本['\x55\x73\x65\x49\x74\x65\x6d'](_0x1ebbcd['\x70\x6f\x73']),
                await leo['\x64\x65\x6c\x61\x79'](0x64);
                else {
                    var _0x19ba0a = Math['\x66\x6c\x6f\x6f\x72'](Math['\x72\x61\x6e\x64\x6f\x6d']() * _0x1a9bb3['\x6c\x65\x6e\x67\x74\x68']);
                    await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b'](_0x1a9bb3[_0x19ba0a]),
                    await leo['\x64\x65\x6c\x61\x79'](0x5dc),
                    _0x367b12--,
                    _0x367b12 < 0x0 && (await leo['\x6c\x6f\x67']('\u5f00\u706b\u7130\u9f20\x2f\u5b9d\u77f3\u9f20\u95ea\u5361\u5931\u8d25\uff0c\u7269\u54c1\u680f\u6ca1\u6709\u7a7a\u7684\u4f4d\u7f6e\u4e86'), _0x367b12 = 0x1e);
                }
            } else break;
        }
    },
    _0x52e907 = async _0x50a22e =>{
        await leo['\x6c\x6f\x67']('\u5956\u9879\u3010' + _0x50a22e['\x74\x79\x70\x65'] + '\u3011\uff0c\u6b21\u6570\u3010' + _0x50a22e['\x63\x6f\x75\x6e\x74'] + '\u3011');
        var _0x27246f = Math['\x6d\x61\x78'](..._0x50a22e['\x63\x68\x61\x6e\x67\x65']);
        if (_0x27246f > 0x0) for (var _0x4a1b45 = 0x0; _0x4a1b45 < _0x50a22e['\x63\x68\x61\x6e\x67\x65']['\x6c\x65\x6e\x67\x74\x68']; _0x4a1b45++) {
            var _0x120db7 = _0x50a22e['\x63\x68\x61\x6e\x67\x65'][_0x4a1b45];
            if (_0x120db7 > 0x0) for (var _0x453ca3 = 0x0; _0x453ca3 < _0x120db7; _0x453ca3++) {
                await _0x21c4b6(_0x4a1b45);
            }
        }
        var _0x4a64f0 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x2fa82a =>要存银行的奖品['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x2fa82a['\x6e\x61\x6d\x65']))['\x6d\x61\x70'](_0x2721fb =>_0x2721fb['\x70\x6f\x73']);
        for (var _0x4a1b45 = 0x0; _0x4a1b45 < _0x50a22e['\x63\x6f\x75\x6e\x74']; _0x4a1b45++) {
            await _0x327b54(_0x50a22e['\x74\x79\x70\x65']),
            _0x50a22e['\x74\x79\x70\x65'] == '\x47' && await _0x55ff71(),
            _0x50a22e['\x74\x79\x70\x65'] == '\x48' && await _0x42026b();
        }
        var _0x1e9dc4 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x380f98 =>要存银行的奖品['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x380f98['\x6e\x61\x6d\x65']));
        if (_0x1e9dc4 && _0x1e9dc4['\x6c\x65\x6e\x67\x74\x68'] > 0x0) {
            var _0x3cdaf9 = _0x1e9dc4['\x66\x69\x6c\x74\x65\x72'](_0x12243a =>!_0x4a64f0['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x12243a['\x70\x6f\x73']));
            if (_0x3cdaf9 && _0x3cdaf9['\x6c\x65\x6e\x67\x74\x68'] > 0x0) for (var _0x4a1b45 = 0x0; _0x4a1b45 < _0x3cdaf9['\x6c\x65\x6e\x67\x74\x68']; _0x4a1b45++) {
                await leo['\x6c\x6f\x67']('\u3010\u606d\u559c\u3011\u83b7\u5f97' + _0x3cdaf9[_0x4a1b45]['\x6e\x61\x6d\x65'] + '\uff01\uff01\uff01'),
                _0x3b4ad5[_0x3cdaf9[_0x4a1b45]['\x6e\x61\x6d\x65']] ? _0x3b4ad5[_0x3cdaf9[_0x4a1b45]['\x6e\x61\x6d\x65']]++:_0x3b4ad5[_0x3cdaf9[_0x4a1b45]['\x6e\x61\x6d\x65']] = 0x1;
            }
        }
    },
    _0x685fe8 = async() =>{
        await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65'](),
        await leo['\x63\x68\x65\x63\x6b\x48\x65\x61\x6c\x74\x68'](医生名字, ![]),
        await leo['\x63\x68\x65\x63\x6b\x43\x72\x79\x73\x74\x61\x6c'](水晶);
        _0x40d2a0() && (await leo['\x6c\x6f\x67\x42\x61\x63\x6b'](), await leo['\x73\x75\x70\x70\x6c\x79\x43\x61\x73\x74\x6c\x65']());
        if (leo['\x68\x61\x73']('\u9053\u573a\u8bb0\u5fc6')) {
            await leo['\x75\x73\x65\x49\x74\x65\x6d\x45\x78']('\u9053\u573a\u8bb0\u5fc6'),
            await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
            if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u9053\u573a') > -0x1) {
                if (_0xb9e8ba() > 要刷到多少层) {
                    await leo['\x6c\x6f\x67\x42\x61\x63\x6b']();
                    var _0xa3471f = leo['\x6e\x6f\x77'](),
                    _0x1ac4f7 = parseInt((_0xa3471f - leo['\x62\x65\x67\x69\x6e\x54\x69\x6d\x65']) / 0x3e8 / 0x3c);
                    await leo['\x6c\x6f\x67']('\u7ea2\u53f6\u306e\u767e\u4eba\u9053\u573a\u5168\u5956\u9879\u811a\u672c\uff0c\u76ee\u6807\u697c\u5c42\u3010' + 要刷到多少层 + '\u3011\uff0c\u76ee\u6807\u5956\u9879\u3010' + _0x47ab93 + '\u3011\uff0c\u5b8c\u6210\u7b2c' + _0x53ceb0+++'\u6b21\uff0c\u8017\u65f6' + _0x1ac4f7 + '\u5206\u949f');
                    return;
                }
            }
            return;
        } (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u827e\u5c14\u838e\u5c9b' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u91cc\u8c22\u91cc\u96c5\u5821' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u6cd5\u5170\u57ce' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u94f6\u884c') && (await leo['\x67\x6f\x74\x6f'](_0xac80ec =>_0xac80ec['\x66\x61\x6c\x61\x6e']['\x73\x31']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x7c, 0xa1]), await leo['\x6c\x6f\x6f\x70'](async() =>{
            if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u7ade\u6280\u573a\u7684\u5165\u53e3') return leo['\x72\x65\x6a\x65\x63\x74']();
            await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x4);
        })),
        红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u7ade\u6280\u573a\u7684\u5165\u53e3' && await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x1b, 0xe, '\u6cbb\u6108\u7684\u5e7f\u573a']),
        红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u6cbb\u6108\u7684\u5e7f\u573a' && (await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x19, 0x1b]), await leo['\x74\x75\x72\x6e\x54\x6f'](0x1a, 0x1c), await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73'])),
        红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u767e\u4eba\u9053\u573a\u5927\u5385' && (await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0xf, 0x17]), await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x0, leo['\x74\x61\x6c\x6b\x59\x65\x73'])),
        红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u7b2c') > -0x1 && 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u9053\u573a') > -0x1 && (_0x29625c > 0x1 && (_0x386202 && 红叶の脚本['\x67\x65\x74\x54\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x73']()['\x6c\x65\x6e\x67\x74\x68'] < _0x29625c || !_0x386202 && !leo['\x69\x73\x49\x6e\x54\x65\x61\x6d']()) && (_0x386202 ? (await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x6, 0xa]), await leo['\x62\x75\x69\x6c\x64\x54\x65\x61\x6d\x42\x6c\x6f\x63\x6b'](_0x29625c, _0x140c29)) : await leo['\x65\x6e\x74\x65\x72\x54\x65\x61\x6d\x42\x6c\x6f\x63\x6b'](_0x3e4bda))),
        _0x386202 ? (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u7b2c') > -0x1 && 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u9053\u573a') > -0x1 && (await leo['\x6c\x6f\x6f\x70'](async() =>{
            await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0xf, 0xa]);
            _0xb9e8ba() == 0x32 ? await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x10, 0xb, leo['\x74\x61\x6c\x6b\x59\x65\x73']) : await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x10, 0xa, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
            await leo['\x64\x65\x6c\x61\x79'](0x3e8);
            if (红叶の脚本['\x69\x73\x49\x6e\x42\x61\x74\x74\x6c\x65']()) return leo['\x72\x65\x6a\x65\x63\x74']();
            await leo['\x64\x65\x6c\x61\x79'](0x64);
        }), await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65']()), 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u901a\u8fc7') > -0x1 && (console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x14, 0xc]), await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x15, 0xc, leo['\x74\x61\x6c\x6b\x59\x65\x73']))) : await leo['\x6c\x6f\x6f\x70'](async() =>{
            if (!leo['\x69\x73\x49\x6e\x54\x65\x61\x6d']()) {
                if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u901a\u8fc7') > -0x1) console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()),
                await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x14, 0xc]),
                await leo['\x74\x61\x6c\x6b\x4e\x70\x63'](0x15, 0xc, leo['\x74\x61\x6c\x6b\x59\x65\x73']);
                else return leo['\x72\x65\x6a\x65\x63\x74']();
            }
        });
    },
    _0x13dbbb = async() =>{
        await leo['\x6c\x6f\x67']('\u7269\u54c1\u680f\u5143\u7d20\u788e\u7247\u8fbe\u5230\u6307\u5b9a\u6570\u91cf\u4e86\uff0c\u5f00\u5956\u53bb\x7e');
        var _0x13c7a1 = _0x1e5aa1();
        if (_0x13c7a1['\x6c\x65\x6e\x67\x74\x68'] > 0x0) {
            var _0x1876df = '\u672c\u6b21\u5956\u9879\u3010\x20';
            for (var _0x360e5 = 0x0; _0x360e5 < _0x13c7a1['\x6c\x65\x6e\x67\x74\x68']; _0x360e5++) {
                var _0x36da31 = _0x13c7a1[_0x360e5],
                _0x1d78c7 = _0x3b9eb7[_0x36da31['\x74\x79\x70\x65']]['\x74\x69\x6d\x65\x73'] + _0x36da31['\x63\x6f\x75\x6e\x74'];
                _0x3b9eb7[_0x36da31['\x74\x79\x70\x65']]['\x74\x69\x6d\x65\x73'] = _0x1d78c7,
                _0x1876df += _0x36da31['\x74\x79\x70\x65'] + '\x3a' + _0x36da31['\x63\x6f\x75\x6e\x74'] + '\x20';
            }
            _0x1876df += '\u3011\uff0c\u7d2f\u8ba1\u5956\u9879\u3010\x20';
            var _0x54120f = Object['\x65\x6e\x74\x72\x69\x65\x73'](_0x3b9eb7)['\x66\x69\x6c\x74\x65\x72'](_0x455d5b =>_0x455d5b[0x1]['\x74\x69\x6d\x65\x73'] > 0x0)['\x6d\x61\x70'](_0x236db4 =>_0x236db4[0x1]);
            if (_0x54120f['\x6c\x65\x6e\x67\x74\x68'] > 0x0) for (var _0x360e5 = 0x0; _0x360e5 < _0x54120f['\x6c\x65\x6e\x67\x74\x68']; _0x360e5++) {
                var _0x23c773 = _0x54120f[_0x360e5];
                _0x1876df += _0x23c773['\x74\x79\x70\x65'] + '\x3a' + _0x23c773['\x74\x69\x6d\x65\x73'] + '\x20';
            }
            _0x1876df += '\u3011',
            await leo['\x6c\x6f\x67'](_0x1876df);
            if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() != '\u767e\u4eba\u9053\u573a\u5927\u5385') { (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u827e\u5c14\u838e\u5c9b' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u91cc\u8c22\u91cc\u96c5\u5821' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u6cd5\u5170\u57ce' || 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u94f6\u884c') && (await leo['\x67\x6f\x74\x6f'](_0x346d67 =>_0x346d67['\x66\x61\x6c\x61\x6e']['\x73\x31']), await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x7c, 0xa1]), await leo['\x6c\x6f\x6f\x70'](async() =>{
                    if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u7ade\u6280\u573a\u7684\u5165\u53e3') return leo['\x72\x65\x6a\x65\x63\x74']();
                    await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x4);
                }));
                红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u7ade\u6280\u573a\u7684\u5165\u53e3' && await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x1b, 0xe, '\u6cbb\u6108\u7684\u5e7f\u573a']);
                红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u6cbb\u6108\u7684\u5e7f\u573a' && (await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x19, 0x1b]), await leo['\x74\x75\x72\x6e\x54\x6f'](0x1a, 0x1c), await leo['\x74\x61\x6c\x6b\x4e\x70\x63']( - 0x1, -0x1, leo['\x74\x61\x6c\x6b\x59\x65\x73']));
                if (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() != '\u767e\u4eba\u9053\u573a\u5927\u5385') return leo['\x6c\x6f\x67\x42\x61\x63\x6b']();
            }
            for (var _0x360e5 = 0x0; _0x360e5 < _0x13c7a1['\x6c\x65\x6e\x67\x74\x68']; _0x360e5++) {
                await _0x52e907(_0x13c7a1[_0x360e5]);
            }
            await leo['\x61\x75\x74\x6f\x57\x61\x6c\x6b']([0x14, 0x18]);
            var _0x4a3342 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x4ed732 =>{
                return 要存银行的奖品['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x4ed732['\x6e\x61\x6d\x65']);
            });
            _0x4a3342 && _0x4a3342['\x6c\x65\x6e\x67\x74\x68'] > 0x0 && (await leo['\x6c\x6f\x67']('\u5b58\u94f6\u884c\uff1a\x5b' + _0x4a3342['\x6d\x61\x70'](_0xf4d5eb =>_0xf4d5eb['\x6e\x61\x6d\x65'])['\x6a\x6f\x69\x6e']() + '\x5d'), await leo['\x6c\x6f\x67\x42\x61\x63\x6b'](), await leo['\x64\x65\x6c\x61\x79'](0x3e8), await leo['\x67\x6f\x74\x6f'](_0x54514a =>_0x54514a['\x66\x61\x6c\x61\x6e']['\x62\x61\x6e\x6b']), await leo['\x74\x75\x72\x6e\x44\x69\x72'](0x0), await leo['\x73\x61\x76\x65\x54\x6f\x42\x61\x6e\x6b'](_0x25d14f =>{
                return 要存银行的奖品['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x25d14f['\x6e\x61\x6d\x65']);
            },
            0x0, [], 银行大小));
            var _0x1876df = '\u7d2f\u8ba1\u5956\u54c1\u3010\x20',
            _0x183173 = Object['\x65\x6e\x74\x72\x69\x65\x73'](_0x3b4ad5);
            if (_0x183173['\x6c\x65\x6e\x67\x74\x68'] > 0x0) for (var _0x360e5 = 0x0; _0x360e5 < _0x183173['\x6c\x65\x6e\x67\x74\x68']; _0x360e5++) {
                var _0x4760a3 = _0x183173[_0x360e5];
                _0x1876df += _0x4760a3[0x0] + '\x3a' + _0x4760a3[0x1] + '\x20';
            }
            _0x1876df += '\u3011',
            await leo['\x6c\x6f\x67'](_0x1876df),
            await leo['\x6c\x6f\x67']('\u5f00\u5956\u7ed3\u675f\uff0c\u7ee7\u7eed\u53bb\u9053\u573a\u642c\u7816');
        }
    };
    return 启动是否先登出 && await leo['\x6c\x6f\x67\x42\x61\x63\x6b'](),
    await leo['\x6c\x6f\x6f\x70'](async() =>{
        var _0x24d788 = _0x30c35e['\x61\x6c\x6c']();
        _0x24d788 >= 多少片碎片去换奖 && (红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']() == '\u767e\u4eba\u9053\u573a\u5927\u5385' || !leo['\x68\x61\x73']('\u9053\u573a\u8bb0\u5fc6') && 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u9053\u573a') == -0x1 && 红叶の脚本['\x47\x65\x74\x4d\x61\x70\x4e\x61\x6d\x65']()['\x69\x6e\x64\x65\x78\x4f\x66']('\u901a\u8fc7') == -0x1) ? await _0x13dbbb() : await _0x685fe8();
    }),
    await leo['\x6c\x6f\x67']('\u811a\u672c\u7ed3\u675f'),
    leo['\x65\x78\x69\x74']();
});