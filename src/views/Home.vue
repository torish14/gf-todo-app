<template>
<!-- templateタグ内のルート要素は一つである -->
  <div class="todo-container">
    <div class="todo-form">
      <label>
        New Todo:
        <input type="text" v-model="newTodo" placeholder="add todo">
        <!-- addボタンをクリックした際に addTodoメソッドを呼び出す -->
        <button @click="addTodo">add</button>
      </label>
    </div>
    <ul class="todo-task" v-for="todo in todos" :key="todo">
      <li>
        <input type="checkbox">
          {{ todo }}
        <button></button>
      </li>
      <li>
        <label>
          <input type="checkbox">
          study
          <button></button>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main.js'

export default {
  // データを扱うため、dataオプションを使用する
  data() {
    return {
      // データの追加処理
      newTodo: '',
      todos: []
    }
  },
  // フォームのテキストを Todoリストに追加する処理を実装する
  methods: {
    // addTodo: function () {
      // addTooメソッドは、pushメソッドを使ってフォームテキストを todosプロパティに追加している
      // dataオプションにアクセスするには、プロパティ目の頭に this. を付与する
      // this.todos.push(this.newTodo)
      // this.newTodo = ''
    // }
    addTodo: function()　{
      // DB に登録する際に、必要なカテゴリー名を定義
      db.collection('todos').add({
        text: this.newTodo, // テキスト
        done: false, // 完了・未完了
        createdAt: new Date() // 僧録した日付
      })
      // thenメソッドの引数で登録したデータの情報を受け取ることができる
      // 発行された ID を使い、再度データアクセスして ID の追加・更新(update）を行う
      .then((docRef) => {
        db.collection('todos').doc(docRef.id).update({
          id: docRef.id // ID を追加
        })
      })
      this.newTodo = ''
    },
    // Firestore からデータを取得する
    getTodo: function () {
      // onSnapshotメソッドは、データを呼び出した後も変更を監視する
      db.collection('todos').onSnapshot((querySnapshot) => {
        // allTodos配列にで各データを格納する
        const allTodos = []
        querySnapshot.forEach(doc => {
          allTodos.push(doc.data())
        })
        // allTodos を todosプロパティに渡してデータを取得している
        this.todos = allTodos
      })
    }
  }
}
</script>
