<template>
  <div id="app">
    <div class="app-wper">
      <Header></Header>
      <Todo></Todo>
      <Item></Item>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'
import Item from './todo/item.vue'

export default {
  components: {
    Header,
    Footer,
    Todo,
    Item
  }
}
</script>

<style lang="stylus" scoped>
 
</style>
