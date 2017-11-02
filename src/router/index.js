import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Home from "../page/home/home"
import City from "../page/city/city"
import Msite from "../page/msite/msite"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: App, //顶层路由，对应index.html
      children:[
        {
          path:"",
          redirect:"/home"
        },
        {
          path:"/home",
          component:Home
        },
         //当前选择城市页
        {
            path: '/city/:cityid',
            component: City
        },

         {
            path: '/msite',
            component: Msite,
            meta: { keepAlive: true },
         },
      ]
    }
  ]
})
