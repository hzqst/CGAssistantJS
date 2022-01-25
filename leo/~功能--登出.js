require(process.env.CGA_DIR_PATH_UTF8+'/leo').then(async (cga) => {
    cga.LogOut();
});