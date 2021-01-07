import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Main from '../views/main/Main.vue'
import MyBooking from '../views/main/MyBooking.vue'
import BookingDetail from '../views/main/BookingDetail.vue'
import Profile from '../views/main/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ]
  },
  {
    path: '/customer',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'booking-detail',
        name: 'BookingDetail',
        component: BookingDetail
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'my-booking',
        name: 'MyBooking',
        component: MyBooking
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
