require(process.env.CGA_DIR_PATH+'/leo').then(async (cga) => {
    cga.LogOut();
});