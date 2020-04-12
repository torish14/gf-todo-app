<template>
  <div>
    <h3>Googleアカウントでログインしてください</h3>
    <button type="button" @click="login">Login</button>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  methods: {
    login: function() {
      // Googleプロバイダオブジェクトのインスタンスを生成し、signInWithPopupメソッドに渡す
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        // ログイン後は、Vue Router の $router.pushメソッドを使用して Topページに遷移する
        this.$router.push('/')
      })
    }
  }
}
</script>

<style>

</style>
