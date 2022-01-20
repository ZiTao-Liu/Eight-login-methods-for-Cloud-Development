// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Cloudbase from "@cloudbase/vue-provider";

  Vue.use(Cloudbase, {
    env: "jh-9grhl97m0a465f8b"
  });
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.config.productionTip = false
import cloudbase from '@cloudbase/js-sdk';

const app = cloudbase.init({
  env: 'jh-9grhl97m0a465f8b'
});

const auth = app.auth();

async function login(){
  const loginState = await auth.getLoginState();
  // 1. 建议登录前检查当前是否已经登录
  if(!loginState){
    // 2. 请求开发者自有服务接口获取ticket
    const ticket = await fetch('lam-9iwbt3ak')
    // 3. 登录 CloudBase
    await auth.customAuthProvider().signIn(ticket);
  }
}

login();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
