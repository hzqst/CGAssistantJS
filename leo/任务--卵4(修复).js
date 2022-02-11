require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async 红叶の脚本 => {
	//leo.baseInfoPrint();
    //leo.monitor.config.keepAlive = false;   //关闭防掉线
    //进度输入‘0’从头（朵拉）开始任务，
    //进度输入‘1’从打长老证之前开始任务，
    //进度输入‘2’从荷普特开始任务，
    //进度输入‘3’从祭坛守卫开始任务，
    //进度输入‘4’从打完BOSS换保证书开始任务（必须有文言抄本）
    var 进度 = 0, 
	队长名称 = '', 
    队伍人数 = 1, 
    队员 = [], 
    医生 = '医道之殇';
    const _0x3612a5 = {
        '\x6a\x6f\x62': '\x6c\x34',
        '\x74\x61\x73\x6b\x49\x6e\x64\x65\x78': 进度,
        '\x74\x65\x61\x6d\x4c\x65\x61\x64\x65\x72': 队长名称,
        '\x74\x65\x61\x6d\x50\x6c\x61\x79\x65\x72\x43\x6f\x75\x6e\x74': 队伍人数,
        '\x74\x65\x61\x6d\x6d\x61\x74\x65\x73': 队员,
        '\x64\x6f\x63\x74\x6f\x72\x4e\x61\x6d\x65': 医生
    };
    return leo['\x70\x6c\x75\x67\x69\x6e\x73']['\x6c\x6f\x61\x64']['\x73\x74\x61\x72\x74'](_0x3612a5);
});