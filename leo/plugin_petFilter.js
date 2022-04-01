const pluginName = '\u8fc7\u6ee4\u5c01\u5370\u5ba0\u7269', version = '\x31\x2e\x30';
let cga, leo, first = ![];
const getVersion = () => {
        return version;
    }, tips = async _0x5da3a7 => {
        const _0x46b169 = _0x5da3a7['\x65\x6d\x6f\x67\x75\x61'];
        await _0x46b169['\x6c\x6f\x67']('\u5df2\u6210\u529f\u52a0\u8f7d' + pluginName + '\u63d2\u4ef6\uff0c\u63d2\u4ef6\u7248\u672c\x5b' + version + '\x5d');
    }, petFilter = (_0x5a7d79, _0x1330e4, _0x4064f3, _0x17b5a5) => {
        const _0x2e7337 = cga['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']();
        for (let _0x269fca in _0x2e7337) {
            const _0x55f7d3 = _0x2e7337[_0x269fca];
            if (_0x1330e4[_0x55f7d3['\x69\x6e\x64\x65\x78']] && _0x1330e4[_0x55f7d3['\x69\x6e\x64\x65\x78']] == 0x1) {
            } else {
                if (_0x55f7d3['\x6c\x65\x76\x65\x6c'] == 0x1) {
                    let _0x125b3f;
                    for (let _0x2bc692 = 0x0; _0x2bc692 < _0x5a7d79['\x6c\x65\x6e\x67\x74\x68']; _0x2bc692++) {
                        if (_0x55f7d3['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == _0x5a7d79[_0x2bc692]['\x6e\x61\x6d\x65']) {
                            _0x125b3f = _0x5a7d79[_0x2bc692];
                            break;
                        }
                    }
                    if (_0x125b3f) {
                        let _0x123c1e = leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x41\x74\x74\x72\x69\x62\x75\x74\x65'](_0x55f7d3), _0x3b24c4 = leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x42\x70'](_0x55f7d3);
                        const _0x3f2de7 = _0x55f7d3['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] + '\uff1a' + _0x123c1e + '\x20' + _0x3b24c4;
                        let _0x54dee2, _0x4426b1;
                        if (_0x17b5a5[_0x3f2de7] && _0x4064f3)
                            _0x54dee2 = _0x17b5a5[_0x3f2de7];
                        else {
                            let _0x18b2a5 = {
                                '\x6e\x61\x6d\x65': _0x125b3f['\x6e\x61\x6d\x65'],
                                '\x61\x74\x74\x72': _0x123c1e,
                                '\x62\x70': _0x3b24c4,
                                '\x66\x69\x72\x73\x74': _0x125b3f['\x67\x72\x61\x64\x65\x46\x69\x72\x73\x74'],
                                '\x67\x72\x61\x64\x65\x4d\x69\x6e': _0x125b3f['\x67\x72\x61\x64\x65\x4d\x69\x6e'],
                                '\x67\x72\x61\x64\x65\x4c\x6f\x67': _0x125b3f['\x67\x72\x61\x64\x65\x4c\x6f\x67'],
                                '\x67\x72\x61\x64\x65\x4c\x6f\x67\x4d\x61\x78': _0x125b3f['\x67\x72\x61\x64\x65\x4c\x6f\x67\x4d\x61\x78']
                            };
                            _0x54dee2 = leo['\x63\x61\x6c\x63\x47\x72\x61\x64\x65'](_0x18b2a5), _0x17b5a5[_0x3f2de7] = _0x54dee2;
                        }
                        !_0x54dee2['\x73\x74\x61\x74\x75\x73'] ? console['\x6c\x6f\x67'](_0x54dee2['\x65\x72\x72\x6f\x72']) : (_0x4426b1 = _0x54dee2['\x69\x73\x44\x72\x6f\x70'], _0x54dee2['\x6c\x6f\x67']['\x66\x6f\x72\x45\x61\x63\x68'](_0x35c7ce => console['\x6c\x6f\x67'](_0x35c7ce)));
                        if (_0x4426b1 === undefined) {
                            let _0x2b84a2 = leo['\x69\x73\x44\x72\x6f\x70\x50\x65\x74'](_0x55f7d3, _0x125b3f);
                            if (_0x55f7d3['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == _0x125b3f['\x6e\x61\x6d\x65'] && _0x55f7d3['\x6c\x65\x76\x65\x6c'] == 0x1 && _0x2b84a2['\x66\x6c\x61\x67'])
                                cga['\x69\x73\x49\x6e\x4e\x6f\x72\x6d\x61\x6c\x53\x74\x61\x74\x65']() && (cga['\x44\x72\x6f\x70\x50\x65\x74'](_0x55f7d3['\x69\x6e\x64\x65\x78']), leo['\x6c\x6f\x67']('\u53ef\u60dc\uff01\u4e22\u4e0b\u5ba0\u7269' + leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x49\x6e\x66\x6f'](_0x55f7d3) + '\uff0c' + _0x2b84a2['\x69\x6e\x66\x6f']), console['\x6c\x6f\x67'](''));
                            else {
                                let _0x1bc9e6 = '\u606d\u559c\uff01\u6293\u5230\u5ba0\u7269' + leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x49\x6e\x66\x6f'](_0x55f7d3);
                                leo['\x6c\x6f\x67\x53\x65\x72\x76\x65\x72']('\u6293\u5ba0', _0x1bc9e6), leo['\x6c\x6f\x67'](_0x1bc9e6), console['\x6c\x6f\x67'](''), _0x1330e4[_0x55f7d3['\x69\x6e\x64\x65\x78']] = 0x1;
                            }
                        } else {
                            if (_0x4426b1 && _0x125b3f['\x61\x75\x74\x6f\x44\x72\x6f\x70\x50\x65\x74'] && _0x55f7d3['\x72\x65\x61\x6c\x6e\x61\x6d\x65'] == _0x125b3f['\x6e\x61\x6d\x65'] && _0x55f7d3['\x6c\x65\x76\x65\x6c'] == 0x1)
                                cga['\x69\x73\x49\x6e\x4e\x6f\x72\x6d\x61\x6c\x53\x74\x61\x74\x65']() && (cga['\x44\x72\x6f\x70\x50\x65\x74'](_0x55f7d3['\x69\x6e\x64\x65\x78']), leo['\x6c\x6f\x67']('\u53ef\u60dc\uff01\u4e22\u4e0b\u5ba0\u7269' + leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x49\x6e\x66\x6f'](_0x55f7d3) + '\uff0c\u9ad8\u4e8e' + _0x125b3f['\x67\x72\x61\x64\x65\x4d\x69\x6e'] + '\u6863\uff08\u5b9e\u9645' + _0x54dee2['\x67\x72\x61\x64\x65\x56\x61\x6c\x75\x65'] + '\u6863\uff09'), console['\x6c\x6f\x67'](''));
                            else {
                                let _0x250c10 = '\u6700\u597d\u6863\u6b21\u662f';
                                _0x54dee2['\x67\x72\x61\x64\x65\x43\x6f\x75\x6e\x74'] == 0x1 && (_0x250c10 = '\u7a33');
                                let _0x2a53c8 = '\u606d\u559c\uff01\u6293\u5230\u5ba0\u7269' + leo['\x67\x65\x74\x50\x65\x74\x43\x61\x6c\x63\x49\x6e\x66\x6f'](_0x55f7d3) + '\uff0c' + _0x250c10 + '\u3010\x20' + _0x54dee2['\x67\x72\x61\x64\x65\x56\x61\x6c\x75\x65'] + '\u6863\x20\u3011';
                                leo['\x6c\x6f\x67\x53\x65\x72\x76\x65\x72']('\u6293\u5ba0', _0x2a53c8), leo['\x6c\x6f\x67'](_0x2a53c8), console['\x6c\x6f\x67'](''), _0x1330e4[_0x55f7d3['\x69\x6e\x64\x65\x78']] = 0x1;
                            }
                        }
                    }
                }
            }
        }
    }, checker = (_0x9555d6, {
        petOptions: _0x481ff7,
        petIndexMap: _0x5b6c32,
        isCache: _0x2e251f,
        calcMap: _0x55aaa0
    }) => {
        return !cga && (cga = _0x9555d6), !leo && (leo = cga['\x65\x6d\x6f\x67\x75\x61']), !first && (first = !![], tips(cga)), petFilter(_0x481ff7, _0x5b6c32, _0x2e251f, _0x55aaa0);
    };
module['\x65\x78\x70\x6f\x72\x74\x73'] = {
    '\x67\x65\x74\x56\x65\x72\x73\x69\x6f\x6e': getVersion,
    '\x74\x69\x70\x73': tips,
    '\x63\x68\x65\x63\x6b\x65\x72': checker
};