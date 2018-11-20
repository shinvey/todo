<template>
  <div class="app-wper">
    <input
      class="edit"
      type="text"
      placeholder="试试编写任务"
      @keydown.enter="addTask"
      v-model="task.content"
    />
    <Item v-bind:list="list"></Item>  
  </div>

</template>

<script>
  import Item from './item.vue'
  
  export default {
    data: function() {
      return {
        task: {
          content: '',
          finished: false,
          deleted: false
        },
        list: []
      }
    },
    components: {
      Item
    },
    methods: {
       addTask () {
         console.log(this);
         if(this.task.content !== '') {
           this.list.push(this.task);
           this.task = {
             content: '',
             finished: false,
             deleted: false
           }
         }
       }
    }
  }
</script>
<style lang="">
  
</style>