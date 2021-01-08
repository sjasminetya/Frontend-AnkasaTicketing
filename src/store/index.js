import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import Swal from 'sweetalert2'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    password: '',
    users: [],
    id: null || localStorage.getItem('id'),
    token: null || localStorage.getItem('token')
  },
  mutations: {
    togglePassword (state) {
      state.password = document.getElementById('password')
      if (state.password.type === 'password') {
        state.password.type = 'text'
      } else {
        state.password.type = 'password'
      }
    },
    set_user (state, payload) {
      state.users = payload
      state.id = payload.id
      state.token = payload.token
    },
    remove (state) {
      state.users = []
      state.id = null
      state.token = null
    }
  },
  actions: {
    register (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/users/register`, payload)
          .then(res => {
            context.commit('set_user', res.data.message)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    login (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/users/login`, payload)
          .then(res => {
            const result = res.data
            console.log(result)
            localStorage.setItem('id', result.data.id)
            localStorage.setItem('token', result.data.token)
            context.commit('set_user', result.data)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout (context) {
      context.commit('remove')
      localStorage.removeItem('id')
      localStorage.removeItem('token')
    },
    interceptorRequest () {
      axios.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('id')}`
        return config
      }, function (error) {
        return Promise.reject(error)
      })
    },
    interceptorResponse () {
      axios.interceptors.response.use(function (response) {
        console.log(response.data)
        if (response.data.status === 'Success') {
          if (response.data.message === 'Register success') {
            Swal.fire({
              icon: 'success',
              title: 'Success register',
              showConfirmButton: false,
              timer: 2000
            })
            router.push('/auth/login')
          }
        } else {
          if (response.data.message === 'Email not found') {
            Swal.fire({
              icon: 'error',
              title: 'Email not found',
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
        return response
      }, function (error) {
        console.log(error.response)
        if (error.response.data.status === 'Failed') {
          if (error.response.data.message === 'email already exists') {
            Swal.fire({
              icon: 'error',
              title: 'Email already exists',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Internal server error!') {
            Swal.fire({
              icon: 'error',
              title: 'Internal server error!',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Password Wrong') {
            Swal.fire({
              icon: 'error',
              title: 'Password Wrong',
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
        return Promise.reject(error)
      })
    }
  },
  getters: {
    isLogin (state) {
      return state.token !== null
    }
  },
  modules: {
  }
})
