// 获取菜单
var config = "debug";

var base_server_debug = "api/";
var base_server_prod = "";
var base_server = base_server_debug;
if (config != "debug") {
    base_server = base_server_prod;
}

var SERVER = {
    //获取菜单
    HOME_MENU: base_server + "vue/homeController/menu",
    MENU_MANAGE: base_server + "vue/sysMenu/menuManage",
}

module.exports = {
    SERVER: SERVER,
}
