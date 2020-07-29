import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu';
import topHeader from './layout/top-header';

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.component('leftMenu', leftMenu);
Vue.component('topHeader', topHeader);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
