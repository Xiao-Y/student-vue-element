import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import Moment from 'moment';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import 'element-ui/lib/theme-default/index.css'; // 默认主题
//import '../static/css/theme-green/index.css'; // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.moment = Moment;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
