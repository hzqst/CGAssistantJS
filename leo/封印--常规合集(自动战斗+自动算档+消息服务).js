//version 3.0
require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async 红叶の脚本 => {
    leo.monitor.config.autoExit = true;     //开启5分钟不动结束脚本
    leo.monitor.config.keepAlive = false;   //关闭防掉线
    leo.monitor.config.logStatus = false;
    leo.moveTimeout = 20; //遇敌速度
	
    const 要抓的宠 = ['哥布林'], 
	启动先登出 = false, 
	自动加载配置 = true, 
	配置文件 = '~抓宠(自动战斗).json', 
	加载封印过滤配置 = true, 
	自动丢弃不相符的封印卡 = true, 
	每次购买封印卡的数量 = 30, 
	最小封印卡的数量 = 10, 
	打印战斗明细 = false, 
	自动丢弃宠物图鉴卡 = true, 
	固定线路 = 0, //1~10固定线路，0不固定
	插件设置 = {
            petCard : {
            name : '插件：领取图鉴',
            enable : false, //是否启用
            waitLine : 4, //仓库号等待线路，0则不换线
            waitPos : [10, 3], //银行等待位置
            direction : 6, //银行人物朝向
        },
        petFilter : {
            name : '插件：过滤封印宠物',
            enable : true, //是否启用
            petOptions : [], //过滤规则
            petIndexMap : {}, //当前宠物缓存
            isCache : false, //是否启用算档缓存
            calcMap : {}, //算档缓存
        },
        ring : {
            name : '插件：领物品(十周年纪念戒指)',
            enable : false, //是否启用
            type : '银行,仓库', //获取的途径，'可以填银行/仓库'
            waitLine : 0, //仓库号等待线路，0则不换线
            nickName : 'xxxxxの戒指', //出纳员昵称
            waitPos : [9, 6], //银行等待位置
            direction : 0, //银行人物朝向
            endurance : 100, //戒指最小耐久
            times : 5, //等待仓库号的最大次数，0则不限制
        },
        cashier : {
            name : '插件：出纳员(魔币)',
            enable : false, //是否启用
            waitLine : 2, //仓库号等待线路，0则不换线
            nickName : 'xxxxxの出纳员', //出纳员昵称
            waitPos : [11, 8], //银行等待位置
            direction : 4, //银行人物朝向
            goldSet : 500000, //领取魔币数量
        },
        petSealSave : {
            name : '插件：保存封印宠物',
            enable : false, //是否启用
            waitLine : 0, //仓库号等待线路，0则不换线
            nameSymbol : 'xxxxxの仓库', //仓库号名字关键字(支持正则表达式)
            nickName : 'xxxxxの昵称', //仓库号昵称
            waitPos : [9, 8], //银行等待位置
            direction : 0, //银行人物朝向
            qty : 4, //身上满多少个宠物去保存,
            timeOut : 30, //多少秒未完成交易自动拒绝
        },
    };
    let 遇敌设置 = {
        //contactType遇敌类型：-1-旧遇敌，0-按地图自适应，1-东西移动，2-南北移动，
        //3-随机移动，4-画小圈圈，5-画中圈圈，6-画大圈圈，7-画十字，8-画8字
        contactType: 0,
        visible: false, 
        minHp: 500,
        minMp: 200,
        minPetHp: 500,
        minPetMp: 200,
        maxPetNumber: 4, //超过4只宠物
        petIndex: 0,
    };
	
    const _0x17cd35 = leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x50\x6c\x75\x67\x69\x6e\x73']();
    if (!_0x17cd35)
        return await leo['\x6c\x6f\x67']('\u7f3a\u5c11\u6293\u5ba0\u63d2\u4ef6\x70\x65\x74\x2e\x6a\x73'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    else
        await _0x17cd35['\x74\x69\x70\x73'](红叶の脚本), console['\x6c\x6f\x67']('');
    if (要抓的宠['\x6c\x65\x6e\x67\x74\x68'] == 0x0)
        return await leo['\x6c\x6f\x67']('\u8bf7\u5148\u6307\u5b9a\u8981\u6293\u7684\u5ba0\u7269\u540d\u5b57\uff0c\u7136\u540e\u91cd\u542f\u811a\u672c'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    const _0xb729ac = [];
    for (var _0x23166c = 0x0; _0x23166c < 要抓的宠['\x6c\x65\x6e\x67\x74\x68']; _0x23166c++) {
        const _0x9997f = 要抓的宠[_0x23166c], _0xa92939 = _0x17cd35['\x67\x65\x74\x50\x65\x74\x43\x6f\x6e\x66\x69\x67'](_0x9997f);
        if (!_0xa92939)
            return await leo['\x6c\x6f\x67']('\u6293\u5ba0\u63d2\u4ef6\u4e2d\u6ca1\u6709\u6307\u5b9a\u5ba0\u7269\u914d\u7f6e\uff1a' + _0x9997f), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
        if (!leo['\x63\x68\x65\x63\x6b\x50\x65\x74\x43\x61\x72\x64'](_0x9997f)) {
            if (插件设置['\x70\x65\x74\x43\x61\x72\x64']['\x65\x6e\x61\x62\x6c\x65']) {
                const _0x160e12 = 插件设置['\x70\x65\x74\x43\x61\x72\x64'];
                _0x160e12['\x70\x65\x74\x4e\x61\x6d\x65'] = _0x9997f, await leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x43\x61\x72\x64']['\x67\x65\x74\x50\x65\x74\x43\x61\x72\x64'](红叶の脚本, _0x160e12);
            } else
                return await leo['\x6c\x6f\x67']('\u7f3a\u5c11\u5ba0\u7269\x5b' + _0x9997f + '\x5d\u7684\u56fe\u9274\uff0c\u8bf7\u68c0\u67e5'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
        }
        _0xb729ac['\x70\x75\x73\x68'](_0xa92939);
    }
    插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x70\x65\x74\x4f\x70\x74\x69\x6f\x6e\x73'] = _0xb729ac;
    启动先登出 && await leo['\x6c\x6f\x67\x42\x61\x63\x6b']();
    自动加载配置 && (await leo['\x70\x61\x6e\x65\x6c']['\x6c\x6f\x61\x64'](配置文件), await leo['\x6c\x6f\x67']('\u5df2\u81ea\u52a8\u52a0\u8f7d\u6293\u5ba0\u914d\u7f6e\uff1a' + 配置文件));
    打印战斗明细 && leo['\x62\x61\x74\x74\x6c\x65\x4d\x6f\x6e\x69\x74\x6f\x72']['\x73\x74\x61\x72\x74'](红叶の脚本);
    leo['\x62\x61\x73\x65\x49\x6e\x66\x6f\x50\x72\x69\x6e\x74']();
    const _0x548de1 = _0xb729ac['\x6d\x61\x70'](_0x9a5754 => _0x9a5754['\x73\x65\x61\x6c\x43\x61\x72\x64\x4e\x61\x6d\x65']), _0xde8eb8 = [];
    for (var _0x23166c = 0x0; _0x23166c < _0x548de1['\x6c\x65\x6e\x67\x74\x68']; _0x23166c++) {
        _0xde8eb8['\x70\x75\x73\x68'](_0x548de1[_0x23166c] + '\x7c\x32\x30');
    }
    await leo['\x70\x61\x6e\x65\x6c']['\x69\x74\x65\x6d\x74\x77\x65\x61\x6b\x6c\x69\x73\x74\x41\x64\x64'](_0xde8eb8);
    if (自动丢弃不相符的封印卡) {
        const _0x30a887 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x2ba712 => _0x2ba712['\x6e\x61\x6d\x65']['\x69\x6e\x63\x6c\x75\x64\x65\x73']('\u5c01\u5370\u5361') && !_0x548de1['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x2ba712['\x6e\x61\x6d\x65']))['\x6d\x61\x70'](_0x120fba => _0x120fba['\x6e\x61\x6d\x65']);
        await leo['\x70\x61\x6e\x65\x6c']['\x69\x74\x65\x6d\x64\x72\x6f\x70\x6c\x69\x73\x74\x41\x64\x64'](_0x30a887), setTimeout(() => {
            leo['\x70\x61\x6e\x65\x6c']['\x69\x74\x65\x6d\x64\x72\x6f\x70\x6c\x69\x73\x74\x44\x65\x6c'](_0x30a887);
        }, 0x3e8 * 0x3c * 0xa);
    }
    if (自动丢弃不相符的封印卡) {
        const _0x21c5e3 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x13f405 => _0x548de1['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x13f405['\x6e\x61\x6d\x65']) && _0x13f405['\x6c\x65\x76\x65\x6c'] < _0xb729ac[0x0]['\x73\x65\x61\x6c\x43\x61\x72\x64\x4c\x65\x76\x65\x6c']);
        for (var _0x23166c = 0x0; _0x23166c < _0x21c5e3['\x6c\x65\x6e\x67\x74\x68']; _0x23166c++) {
            await leo['\x64\x72\x6f\x70\x49\x74\x65\x6d\x45\x78'](_0x21c5e3[_0x23166c]['\x70\x6f\x73']);
        }
    }
    const _0x3fd6d2 = [];
    遇敌设置['\x63\x68\x65\x63\x6b\x65\x72'] = () => {
        插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x65\x6e\x61\x62\x6c\x65'] && leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x63\x68\x65\x63\x6b\x65\x72'](红叶の脚本, 插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']);
        for (let _0x5ef722 = 0x0; _0x5ef722 < _0xb729ac['\x6c\x65\x6e\x67\x74\x68']; _0x5ef722++) {
            const _0x39aef5 = _0xb729ac[_0x5ef722], _0x3bed65 = 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](_0x39aef5['\x73\x65\x61\x6c\x43\x61\x72\x64\x4e\x61\x6d\x65']);
            if (_0x3bed65 < 0x2)
                return !![];
        }
        if (自动丢弃宠物图鉴卡) {
            _0x3fd6d2;
            const _0x1cb742 = 红叶の脚本['\x67\x65\x74\x49\x6e\x76\x65\x6e\x74\x6f\x72\x79\x49\x74\x65\x6d\x73']()['\x66\x69\x6c\x74\x65\x72'](_0x580469 => _0x580469['\x74\x79\x70\x65'] == 0x29);
            _0x1cb742 && _0x1cb742['\x6c\x65\x6e\x67\x74\x68'] > 0x0 && _0x1cb742['\x66\x6f\x72\x45\x61\x63\x68'](_0x24c527 => {
                const _0x218622 = '\x23' + _0x24c527['\x69\x74\x65\x6d\x69\x64'];
                !_0x3fd6d2['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x218622) && (_0x3fd6d2['\x70\x75\x73\x68'](_0x218622), leo['\x70\x61\x6e\x65\x6c']['\x69\x74\x65\x6d\x64\x72\x6f\x70\x6c\x69\x73\x74\x41\x64\x64'](_0x218622));
            });
        }
        if (遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78'] !== undefined && !红叶の脚本['\x69\x73\x49\x6e\x42\x61\x74\x74\x6c\x65']()) {
            const _0x3f9288 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6e\x64'](_0x1c2e8a => _0x1c2e8a['\x69\x6e\x64\x65\x78'] == 遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78']);
            _0x3f9288 && _0x3f9288['\x73\x74\x61\x74\x65'] != 0x2 && 红叶の脚本['\x43\x68\x61\x6e\x67\x65\x50\x65\x74\x53\x74\x61\x74\x65'](_0x3f9288['\x69\x6e\x64\x65\x78'], 红叶の脚本['\x50\x45\x54\x5f\x53\x54\x41\x54\x45\x5f\x42\x41\x54\x54\x4c\x45']);
        }
    };
    let _0x54aaf1 = '\u7ea2\u53f6\u306e\u5c01\u5370\u5e08\u5e38\u89c4\u5408\u96c6\u811a\u672c\uff0c\u81ea\u52a8\u6293\u3010';
    for (let _0x2e4d60 = 0x0; _0x2e4d60 < _0xb729ac['\x6c\x65\x6e\x67\x74\x68']; _0x2e4d60++) {
        const _0xfb90fb = _0xb729ac[_0x2e4d60];
        _0x54aaf1 += _0xfb90fb['\x6e\x61\x6d\x65'], _0x2e4d60 < _0xb729ac['\x6c\x65\x6e\x67\x74\x68'] - 0x1 && (_0x54aaf1 += '\x2f');
    }
    _0x54aaf1 += '\u3011\x2b\u81ea\u52a8\u7b97\u6863\x2b\u6d88\u606f\u670d\u52a1\uff0c\u542f\u52a8\x7e', await leo['\x6c\x6f\x67'](_0x54aaf1);
    for (let _0x15cbd7 = 0x0; _0x15cbd7 < _0xb729ac['\x6c\x65\x6e\x67\x74\x68']; _0x15cbd7++) {
        const _0x189e8e = _0xb729ac[_0x15cbd7];
        let _0x176495 = '\u9884\u8bbe\u4e94\u56f4\u662f\uff1a\u3010' + _0x189e8e['\x6e\x61\x6d\x65'] + '\u3011\x3d\x3e\u3010' + _0x189e8e['\x6d\x69\x6e\x48\x70'] + '\x2f' + _0x189e8e['\x6d\x69\x6e\x4d\x70'] + '\x2f' + _0x189e8e['\x6d\x69\x6e\x41\x74\x74\x61\x63\x6b'] + '\x2f' + _0x189e8e['\x6d\x69\x6e\x44\x65\x66\x65\x6e\x73\x69\x76\x65'] + '\x2f' + _0x189e8e['\x6d\x69\x6e\x41\x67\x69\x6c\x69\x74\x79'] + '\u3011\uff0c\u81ea\u52a8\u6254\u5ba0\uff1a\u3010' + (_0x189e8e['\x61\x75\x74\x6f\x44\x72\x6f\x70\x50\x65\x74'] ? '\u5df2\u542f\u7528' : '\u672a\u542f\u7528') + '\u3011';
        await leo['\x6c\x6f\x67'](_0x176495);
    }
    红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x45\x41\x4d\x43\x48\x41\x54'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x4a\x4f\x49\x4e\x54\x45\x41\x4d'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x43\x41\x52\x44'], ![]), 红叶の脚本['\x45\x6e\x61\x62\x6c\x65\x46\x6c\x61\x67\x73'](红叶の脚本['\x45\x4e\x41\x42\x4c\x45\x5f\x46\x4c\x41\x47\x5f\x54\x52\x41\x44\x45'], ![]);
    try {
        let _0x1727f0 = ![];
        const _0x122bd5 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']();
        for (let _0x258f23 in _0x122bd5) {
            const _0x266fbe = _0x122bd5[_0x258f23];
            插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x70\x65\x74\x49\x6e\x64\x65\x78\x4d\x61\x70'][_0x266fbe['\x69\x6e\x64\x65\x78']] = 0x1;
        }
        遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78'] !== undefined && await leo['\x73\x65\x74\x50\x65\x74\x42\x61\x74\x74\x6c\x65'](遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78']), await leo['\x62\x61\x74\x74\x6c\x65\x53\x65\x74\x74\x69\x6e\x67']['\x65\x73\x63\x61\x70\x65'](), await leo['\x6c\x6f\x6f\x70'](async () => {
            await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65']();
            if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] < 0xc350) {
                await leo['\x67\x6f\x74\x6f'](_0x51a85e => _0x51a85e['\x66\x61\x6c\x61\x6e']['\x62\x61\x6e\x6b']), await leo['\x67\x65\x74\x4d\x6f\x6e\x65\x79\x46\x72\x6f\x6d\x42\x61\x6e\x6b'](0x7a120);
                if (红叶の脚本['\x47\x65\x74\x50\x6c\x61\x79\x65\x72\x49\x6e\x66\x6f']()['\x67\x6f\x6c\x64'] < 0xc350) {
                    if (插件设置['\x63\x61\x73\x68\x69\x65\x72']['\x65\x6e\x61\x62\x6c\x65'])
                        await leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x63\x61\x73\x68\x69\x65\x72']['\x67\x65\x74\x4d\x6f\x6e\x65\x79'](红叶の脚本, 插件设置['\x63\x61\x73\x68\x69\x65\x72']);
                    else
                        return await leo['\x6c\x6f\x67']('\u94b1\u5230\u7528\u65f6\u65b9\u6068\u5c11\uff01\u8bf7\u8865\u5145\u8db3\u591f\u94f6\u5b50\u540e\u91cd\u65b0\u6267\u884c\u811a\u672c\uff01'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x18), leo['\x72\x65\x6a\x65\x63\x74']();
                }
            }
            if (红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x6c\x65\x6e\x67\x74\x68'] >= 插件设置['\x70\x65\x74\x53\x65\x61\x6c\x53\x61\x76\x65']['\x71\x74\x79']) {
                if (插件设置['\x70\x65\x74\x53\x65\x61\x6c\x53\x61\x76\x65']['\x65\x6e\x61\x62\x6c\x65'])
                    await leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x53\x65\x61\x6c\x53\x61\x76\x65']['\x73\x61\x76\x65\x50\x65\x74'](红叶の脚本, 插件设置['\x70\x65\x74\x53\x65\x61\x6c\x53\x61\x76\x65']);
                else {
                    if (_0x1727f0)
                        return await leo['\x6c\x6f\x67']('\u5ba0\u7269\u5728\u94f6\u884c\u6ee1\u5566\uff01\u80cc\u5305\u4e5f\u6ee1\u5566\uff01\u662f\u65f6\u5019\u5012\u4ed3\u5e93\u5566\uff01'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x18), leo['\x72\x65\x6a\x65\x63\x74']();
                    else {
                        let _0x50294a = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']()['\x66\x69\x6c\x74\x65\x72'](_0x37f322 => _0x37f322['\x6c\x65\x76\x65\x6c'] == 0x1);
                        for (var _0x2c7525 = 0x0; _0x2c7525 < _0x50294a['\x6c\x65\x6e\x67\x74\x68']; _0x2c7525++) {
                            let _0x36bfc0 = _0x50294a[_0x2c7525], _0x35ce96 = await leo['\x67\x65\x74\x50\x65\x74\x45\x6d\x70\x74\x79\x49\x6e\x64\x65\x78'](!![]);
                            if (_0x35ce96 != undefined)
                                await leo['\x6d\x6f\x76\x65\x50\x65\x74'](_0x36bfc0['\x69\x6e\x64\x65\x78'], _0x35ce96);
                            else {
                                _0x1727f0 = !![];
                                break;
                            }
                        }
                    }
                }
                const _0x128eb5 = 红叶の脚本['\x47\x65\x74\x50\x65\x74\x73\x49\x6e\x66\x6f']();
                插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x70\x65\x74\x49\x6e\x64\x65\x78\x4d\x61\x70'] = {};
                for (let _0x142a17 in _0x128eb5) {
                    const _0x5e71e9 = _0x128eb5[_0x142a17];
                    插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x70\x65\x74\x49\x6e\x64\x65\x78\x4d\x61\x70'][_0x5e71e9['\x69\x6e\x64\x65\x78']] = 0x1;
                }
                !插件设置['\x70\x65\x74\x53\x65\x61\x6c\x53\x61\x76\x65']['\x65\x6e\x61\x62\x6c\x65'] && await leo['\x73\x79\x6e\x63\x49\x6e\x66\x6f'](红叶の脚本, !![], !![], !![]);
            }
            插件设置['\x72\x69\x6e\x67']['\x65\x6e\x61\x62\x6c\x65'] && await leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x72\x69\x6e\x67']['\x67\x65\x74\x52\x69\x6e\x67'](红叶の脚本, 插件设置['\x72\x69\x6e\x67']);
            if (固定线路 > 0x0) {
                const _0x1be890 = leo['\x67\x65\x74\x4c\x69\x6e\x65']();
                if (_0x1be890 != 固定线路)
                    return console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u5207\u6362\u5230\u56fa\u5b9a\u7ebf\u8def\uff1a' + 固定线路), leo['\x63\x68\x61\x6e\x67\x65\x4c\x69\x6e\x65'](固定线路);
            }
            for (let _0x4662b7 = 0x0; _0x4662b7 < _0xb729ac['\x6c\x65\x6e\x67\x74\x68']; _0x4662b7++) {
                const _0x44bcb6 = _0xb729ac[_0x4662b7], _0x562a64 = 红叶の脚本['\x67\x65\x74\x49\x74\x65\x6d\x43\x6f\x75\x6e\x74'](_0x44bcb6['\x73\x65\x61\x6c\x43\x61\x72\x64\x4e\x61\x6d\x65']);
                _0x562a64 < 最小封印卡的数量 && await leo['\x62\x75\x79\x53\x65\x61\x6c\x43\x61\x72\x64'](_0x44bcb6['\x73\x65\x61\x6c\x43\x61\x72\x64\x4e\x61\x6d\x65'], 每次购买封印卡的数量, _0x44bcb6['\x73\x65\x61\x6c\x43\x61\x72\x64\x4c\x65\x76\x65\x6c']), await leo['\x64\x65\x6c\x61\x79'](0x3e8);
            }
            遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78'] !== undefined && await leo['\x73\x65\x74\x50\x65\x74\x42\x61\x74\x74\x6c\x65'](遇敌设置['\x70\x65\x74\x49\x6e\x64\x65\x78']);
            const _0x499365 = _0xb729ac[0x0];
            if (_0x499365['\x77\x61\x6c\x6b'] && typeof _0x499365['\x77\x61\x6c\x6b'] == '\x66\x75\x6e\x63\x74\x69\x6f\x6e')
                await _0x499365['\x77\x61\x6c\x6b'](红叶の脚本, 遇敌设置);
            else {
                console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u5f00\u59cb\u8f7d\u5165\u6293\u5ba0\u3010\u62d3\u5c55\u3011\u63d2\u4ef6\u7684\u81ea\u52a8\u5bfb\u8def\u914d\u7f6e');
                const _0x5dfb62 = _0x499365['\x6e\x61\x6d\x65'], _0x5eceaf = leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x45\x78\x74\x50\x6c\x75\x67\x69\x6e\x73']();
                if (!_0x5eceaf)
                    return await leo['\x6c\x6f\x67']('\u7f3a\u5c11\u6293\u5ba0\u62d3\u5c55\u63d2\u4ef6\uff0c\u811a\u672c\u7ed3\u675f'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
                const _0x57ca78 = _0x5eceaf['\x67\x65\x74\x50\x65\x74\x43\x6f\x6e\x66\x69\x67'](_0x5dfb62);
                if (!_0x57ca78)
                    return await leo['\x6c\x6f\x67']('\u6293\u5ba0\u62d3\u5c55\u63d2\u4ef6\u4e2d\u6ca1\u6709\u6307\u5b9a\u5ba0\u7269\u3010' + _0x5dfb62 + '\u3011\u7684\u914d\u7f6e\uff0c\u811a\u672c\u7ed3\u675f'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
                if (_0x57ca78['\x77\x61\x6c\x6b'] && typeof _0x57ca78['\x77\x61\x6c\x6b'] == '\x66\x75\x6e\x63\x74\x69\x6f\x6e')
                    await _0x57ca78['\x77\x61\x6c\x6b'](红叶の脚本, 遇敌设置);
                else
                    return await leo['\x6c\x6f\x67']('\u6293\u5ba0\u62d3\u5c55\u63d2\u4ef6\u4e2d\u6ca1\u6709\u6307\u5b9a\u5ba0\u7269\u3010' + _0x5dfb62 + '\u3011\u7684\u81ea\u52a8\u5bfb\u8def\u914d\u7f6e\uff0c\u811a\u672c\u7ed3\u675f'), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
            }
            await leo['\x6c\x6f\x67']('\u5230\u8fbe\u4f4d\u7f6e\uff0c\u5f00\u59cb\u6293\u5ba0\uff0c\u8bf7\u6ce8\u610f\u662f\u5426\u5f00\u542f\u4e86\u81ea\u52a8\u6254\u5ba0\u7269\u3002'), await leo['\x62\x61\x74\x74\x6c\x65\x53\x65\x74\x74\x69\x6e\x67']['\x73\x65\x61\x6c'](_0xb729ac), await leo['\x65\x6e\x63\x6f\x75\x6e\x74\x65\x72\x54\x65\x61\x6d\x4c\x65\x61\x64\x65\x72'](遇敌设置), await leo['\x77\x61\x69\x74\x41\x66\x74\x65\x72\x42\x61\x74\x74\x6c\x65'](), 插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x65\x6e\x61\x62\x6c\x65'] && (await leo['\x64\x65\x6c\x61\x79'](0x7d0), leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x63\x68\x65\x63\x6b\x65\x72'](红叶の脚本, 插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']), await leo['\x64\x65\x6c\x61\x79'](0x7d0), leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x70\x65\x74\x46\x69\x6c\x74\x65\x72']['\x63\x68\x65\x63\x6b\x65\x72'](红叶の脚本, 插件设置['\x70\x65\x74\x46\x69\x6c\x74\x65\x72'])), console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + '\u89e6\u53d1\u56de\u8865'), leo['\x6f\x6c\x64\x4c\x69\x6e\x65'] = leo['\x67\x65\x74\x4c\x69\x6e\x65'](), await leo['\x73\x79\x6e\x63\x49\x6e\x66\x6f'](红叶の脚本, !![]), await leo['\x6c\x6f\x67\x42\x61\x63\x6b']();
        });
    } catch (_0x3d4d17) {
        return console['\x6c\x6f\x67'](leo['\x6c\x6f\x67\x54\x69\x6d\x65']() + err), await leo['\x64\x65\x6c\x61\x79'](0x3e8 * 0x3c * 0x2), leo['\x65\x78\x69\x74']();
    }
});