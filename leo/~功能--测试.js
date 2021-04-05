require('./common').then(async (cga) => {
    //leo.baseInfoPrint();
    var playerInfo = cga.GetPlayerInfo();
    //console.log(playerInfo);
    var teamplayers = cga.GetTeamPlayerInfo();
    //console.log(teamplayers);

    var pet = cga.GetPetInfo(playerInfo.petid);
    //console.log(pet);


    var players = cga.GetMapUnits().find(u => u.type == 8 && u.xpos == 25 && u.ypos == 81);
    console.log(players)

    var repairName = '再防.总有一修';
    await leo.enterTeamBlock(repairName);

    
});