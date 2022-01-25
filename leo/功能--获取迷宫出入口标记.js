require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    // cga.FixMapWarpStuck(1)
    const entries = await leo.getMazeEntries(false);
    //console.log(entries)
    const icons = entries.map(e=>{
        return {icon:e.icon,x:e.x,y:e.y}
    });
    console.log(cga.GetMapName());
    console.log(icons);

    
});