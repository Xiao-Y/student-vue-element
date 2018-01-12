<template>
<div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
        <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
            {{ subItem.title }}
        </el-menu-item>
        </el-submenu>
        </template>
        <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
        </template>
    </el-menu>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: './static/data/menu.json', //获取菜单数据url
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
            const self = this;
            self.$axios.get(self.url).then(function(resp) {
                self.items = resp.data;
            }).catch(function(err) {
                console.info(err);
            });
        }
    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
}

.sidebar>ul {
    height: 100%;
}
</style>
