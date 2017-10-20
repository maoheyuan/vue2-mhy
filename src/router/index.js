import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Home from "../page/home/home"

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
        }
      ]
    }
  ]
})
