import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDzXHtzugTt8HsHjd4JvPNLJ0BY22wo7hA",
  authDomain: "gf-todo-app-697c4.firebaseapp.com",
  databaseURL: "https://gf-todo-app-697c4.firebaseio.com",
  projectId: "gf-todo-app-697c4",
  storageBucket: "gf-todo-app-697c4.appspot.com",
  messagingSenderId: "130859006202",
  appId: "1:130859006202:web:d1aefd53eae806891fb143"
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
