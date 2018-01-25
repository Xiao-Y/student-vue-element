<template slot-scope="scope">
<div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
        <template v-for="item in items">
            <template v-if="item.children">
                <el-submenu :index="item.menucode">
                    <template slot="title"><i :class="item.vicon"></i>{{ item.title }}</template>
                    <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.menucode">
                        {{ subItem.title }}
                    </el-menu-item>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="item.menucode">
                    <i :class="item.vicon"></i>{{ item.title }}
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</div>
</template>

<script>
import URL from '@/utils/urlUtil';

export default {
    data() {
        return {
            items: []
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        const self = this;
        self.getMenuData();
    },
    methods: {
        getMenuData: function() {
            var menuUrl = URL.SERVER.HOME_MENU;
            console.info(menuUrl);
            const self = this;
            self.$axios.get(menuUrl).then(function(resp) {
                self.items = resp.data;
            }).catch(function(err) {
                console.info(err);
            });
        }
    }
}
</script>

<style scoped>
.el-menu-vertical-demo {
    background-color: #242f42;
}
.sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
    overflow: auto;

}

.sidebar>ul {
    height: 100%;
}

::-webkit-scrollbar {
    /*滚动条的宽度*/
    width: 8px;
    /*滚动条的高度*/
    height: 8px;

}

::-webkit-scrollbar-track-piece {
    /*滚动条的背景颜色*/
    background-color: #fff;
    /*滚动条的圆角宽度*/
    -webkit-border-radius: 0;
}
</style>
