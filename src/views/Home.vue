<template>
<!-- templateタグ内のルート要素は一つである -->
  <div class="wrapper">
    <header class="header">
      <h1 class="title">
        Todo
      </h1>
    </header>
    <div class="todo-container">
    <div class="todo-form">
      <label class="todo-label">
        <span class="todo-newText">New Todo :</span>
        <input type="text" v-model="newTodo" placeholder="add todo" class="todo-input">
        <!-- addボタンをクリックした際に addTodoメソッドを呼び出す -->
        <button class="btn todo-btn todo-btn--add" type="submit" @click.prevent="addTodo">+</button>
      </label>
    </div>
    <ul class="todo-item" v-for="todo in todos" :key="todo.id">
      <li>
        <input type="checkbox" @change="stateTodo(todo)" v-model="todo.done">
          {{ todo.text }}
        <button class="btn todo-btn todo-btn-delete" @click="deleteTodo(todo)">x</button>
      </li>
      <div class="logout">
        <button @click="logout">□→</button>
      </div>
      <!-- <li>
        <label>
          <input type="checkbox">
          study
          <button></button>
        </label>
      </li> -->
    </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main.js'

export default {
  name: 'Home',
  // データを扱うため、dataオプションを使用する
  data() {
    return {
      // データの追加処理
      newTodo: '',
      todos: [],
      authUser: {}
    }
  },
  methods: {
    //? フォームのテキストを Todoリストに追加する処理を実装する
    // addTodo: function () {
      // addTooメソッドは、pushメソッドを使ってフォームテキストを todosプロパティに追加している
      // dataオプションにアクセスするには、プロパティ目の頭に this. を付与する
      // this.todos.push(this.newTodo)
      // this.newTodo = ''
    // }
    addTodo()　{
      // DB に登録する際に、必要なカテゴリー名を定義
      //? DB > usersコレクション > ユーザーID > todosコレクション
      db.collection('users').doc(this.authUser.uid).collection('todos').add({
        text: this.newTodo, // テキスト
        done: false, // 完了・未完了
        createdAt: new Date() // 僧録した日付
      })
      // thenメソッドの引数で登録したデータの情報を受け取ることができる
      // 発行された ID を使い、再度データアクセスして ID の追加・更新(update）を行う
      .then((docRef) => {
        db.collection('users').doc(this.authUser.uid).collection('todos').doc(docRef.id).update({
          id: docRef.id // ID を追加
        })
      })
      this.newTodo = ''
    },
    //? Firestore からデータを取得する
    getTodo() {
      // onSnapshotメソッドは、データを呼び出した後も変更を監視する
      db.collection('users').doc(this.authUser.uid).collection('todos').onSnapshot((querySnapshot) => {
        // allTodos配列にで各データを格納する
        const allTodos = []
        querySnapshot.forEach(doc => {
          allTodos.push(doc.data())
        })
        // allTodos を todosプロパティに渡してデータを取得している
        this.todos = allTodos
      })
    },
    //? 完了・未完了の更新を行う
    // updateメソッドを使用し、stateTodoメソッドに渡された TodoデータID と DBID が一致するデータの更新を行う
    stateTodo(todo) {
      db.collection('users').doc(this.authUser.uid).collection('todos').doc(todo.id).update(todo)
    },
    //? データの削除を行う
    deleteTodo(todo) {
      db.collection('users').doc(this.authUser.uid).collection('todos').doc(todo.id).delete()
    },
    //? ログアウトする
    logout() {
      firebase.auth().signOut()
    }
  },
  //? createdフックを使用して、Vueインスタンス生成時に getTodo メソッドを実行する
  created() {
    // ユーザー情報を取得して Todoリストの出し分けをする
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authUser = user
        this.getTodo()
      }
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // ユーザー情報を取得する
      // ID の他に、ユーザー名・メールアドレス・画像URL などを取得できる
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next() // ユーザーログインが完了していたらコンポーネントの作成へ
        } else {
          vm.$router.push('/login', () => {}) // ログインしていない場合はログイン画面へ
        }
      })
    })
  }
}
</script>

<style>
.header {
  background-color: cyan;
}

.title {
  color: white;
}

.todo-input {
  margin: 0 10px;
}

.todo-btn-delete {
  /* margin-right: 10px; */
}
</style>
