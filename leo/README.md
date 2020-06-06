# CGA 红叶の脚本 QQ:158583461(红叶散落)  

- 请放置在CGA的leo目录下

- 需要配合common.js使用

- 单个功能脚本，可以配置部分参数
    - 关闭防掉线  
    `leo.monitor.config.keepAlive = false;`
    
    - 自动治疗自己  
    `leo.monitor.config.healSelf = true;`
    
    - 装备保护  
    ```
    leo.monitor.config.equipsProtect = true;
	leo.monitor.config.equipsProtectValue = 10;
    ```
    
    - 自动吃血瓶(非战斗状态)  
    ```
	leo.monitor.config.autoHp = true;
	leo.monitor.config.autoHpValue = 500;
	leo.monitor.config.autoHpItem = '小护士家庭号';
    ```
    
    - 自动吃料理(非战斗状态)  
    ```
	leo.monitor.config.autoMp = true;
	leo.monitor.config.autoMpValue = 350;
	leo.monitor.config.autoMpItem = '魔力之泉';
    ```

- 常用的函数
    
    - 控制台基础信息打印  
    `leo.baseInfoPrint();`
    
    - 练级统计信息打印  
    `leo.statistics();`
    
    - 人物说话  
    `leo.say('内容');`
    
    - 人物说话和控制台打印内容(带时间戳)  
    `leo.log('内容');`
    
    - 队长创建队伍，参数为队伍人数  
    `leo.buildTeamBlock(5);`
    
    - 队员进入队伍，参数为队长名字  
    `leo.enterTeamBlock(5);`
    
    - 招魂：判断人物是否掉魂，是则登出去招魂  
    `leo.getBackSoul();`
    
    - 治疗：判断人物是否受伤，是则到飞碟找指定名字的医生，如果找不到，则找随机的医生  
    `leo.healPlayer('医生名字');`
    
    - 治疗：判断宠物是否受伤，是则到医院治疗宠物  
    `leo.healPet();`
    
    - 护士补血魔，方向(0-东，2-南，4-西，6-北)  
    `leo.supplyDir(方向);`
    
    - 护士补血魔，x,y为护士坐标(会等待5秒)  
    `leo.supply(x,y);`
    
    - 城堡飞碟处找护士补血魔(在艾尔莎岛、里谢里雅堡、法兰城并且人宠没有满血魔才有效)  
    `leo.supplyCastle();`
    
    - 城堡飞碟处卖石(在艾尔莎岛、里谢里雅堡、法兰城并且身上有魔石才有效)  
    `leo.sellCastle();`
    
    - 检查是否需要招魂、治疗  
    `leo.checkHealth('医生名字');`
    
    - 检查是否需要换水晶，示例为低于100耐久换水火的水晶  
    `leo.checkCrystal('水火的水晶（5：5）',100);`
    
    - 检查是否需要换桥头平民装(低于50耐久换)  
    `leo.autoEquipLv1('平民斧');`
    
    - 魔币移动(数量要有效才会生效)，操作类型：1-存银行 2-取银行 3-扔魔币  
    `leo.moveGold(魔币数量,操作类型);`
    
    - 宠物移动，0~4人物身上位置，100~104银行位置  
    `leo.movePet(原来的位置,新的位置);`
    
    - 银行全存  
    `leo.saveToBankAll();`
    
    - 银行全取  
    `leo.getFormBankAll();`
    
    - 随机遇敌(队长用)，参数为触发保护的设置  
    `leo.encounterTeamLeader(protect);`
    
    - 随机遇敌(队员用)，参数为触发保护的设置  
    `leo.encounterTeammate(protect);`
    
    - 随机往旁边移动1格（队长使用，方便队员进组）  
    `leo.moveAround();`
    
    - 使用物品  
    `leo.useItemEx('物品名称');`
    
    - 丢弃物品  
    `leo.dropItemEx('物品名称');`
    
    - 切图，带战斗检测，方向(0-东，2-南，4-西，6-北)  
    `leo.forceMoveEx(方向,次数);`
    


