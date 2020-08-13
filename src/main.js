import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu';
import topHeader from './layout/top-header';
import { checkToken } from './api/api'
import constants from './utils/constants'

// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// Vue.use(mavonEditor)

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.blog_constants = constants

Vue.component('leftMenu', leftMenu);
Vue.component('topHeader', topHeader);
router.beforeEach((to, from, next) => {
  // 如果是登录的界面,则需要放行
  if (to.path === '/login') {
    // 如果用户要跳转到登录页面,且当前已经登录了,则没必要再到登录页面了,除非用户点击了退出登录
    checkToken().then(result => {
      if (result.code === 20000) {
        if (result.message === '账号未登录') {
          next()
        } else if (result.data.roles === 'role_admin') {
          next({
            path: '/index'
          })
        } else if (result.data.roles === 'role_normal') {
          location.href = 'https://www.sunofbeach.net'
        }
      } else {
        // 请求失败 这里需要做处理
        next()
      }
    })
    // 如果已经登录,根据角色判断跳转
  } else {
    // 检查用户角色
    checkToken().then(result => {
      if (result.code === 20000) {
        window.localStorage.setItem('avatar',result.data.avatar)
        window.localStorage.setItem('userName',result.data.userName)
        // 成功 判断用户角色
        // 如果是管理员就放行
        // 如果是普通用户就跳转到门户
        if (result.data.roles === 'role_admin') {
          next()
        } else {
          location.href = 'https://www.sunofbeach.net'
        }
      } else {
        // 跳转到登录的页面
        next({
          path: '/login'
        })
      }

    })
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
