import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from "../page/home/home"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
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
