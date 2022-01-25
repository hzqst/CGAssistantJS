require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    //leo.baseInfoPrint();
    var playerInfo = cga.GetPlayerInfo();
    //console.log(playerInfo.job);
    var teamplayers = cga.GetTeamPlayerInfo();
    //console.log(teamplayers);

    //console.log(pet);
    //await leo.autoLearnSkill('气功弹')
    //await leo.getMoneyFromBank(5000)
    //await leo.autoLearnSkill('宠物强化')
    // 113x79x42x45x29 】，BP【 6x6x7x2x2x103x100
  //    var petOptions = {
  //    	name: '地龙蜥',
  //    	attr: '113x79x42x45x29',
  //    	bp: '6x6x7x2x2x103x100',
		// first: false,
  //    	gradeMin: 5,
  //    	gradeLog: true,
  //    	gradeLogMax: 5
  //    }
	 // var　grade = leo.calcGrade(petOptions);
	 // if(grade.status){
	 // 	grade.log.forEach(v=>console.log(v));
	 // }else{
	 // 	console.log(grade.error);
	 // }


    // let pet = cga.GetPetsInfo().find(p=>p.realname=='哥布林');
    // if(pet){
    //     await leo.logServer('自定义','我有一个宠物哥布林')
    // }
	 

    //let pet = await leo.getPetEmptyIndex(false);
    //console.log(leo.host);
    let arr = cga.GetPicBooksInfo().find(v=>v.name == '纯白吓人箱');
    console.log(arr);
});