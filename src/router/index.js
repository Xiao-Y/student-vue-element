import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: resolve => require(['@/components/page/Login.vue'], resolve)
    }, {
        path: '/home',
        component: resolve => require(['@/components/common/Home.vue'], resolve),
        children: [{
            path: '/menuManage',
            component: resolve => require(['@/components/page/system/menuManage'], resolve)
        }]
    }]
})
