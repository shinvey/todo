<template>
  <div class="list">
    <p v-if="list.length === 0" class="empty">
      暂无任务
    </p>
    <div 
      v-for="(item, index) in list"
      :key="index"
      :class="{border: list.length > 1}" 
      class="unit">
      
      <input 
        @click="changeStatus(index)"
        :checked="item.finished"
        type="checkbox"
        :id="'awesome' + index">

      <label 
        :for="'awesome' + index"
        :class="{'finished': item.finished}">
        {{item.content}}
      </label>

      <a @click="removeTask(index)" class="dele">删除</a>
    </div>

  </div>
</template>
<script>

  export default {
    props: ['list'],
    methods: {
      changeStatus: function(index) {
        let curStatus = this.list[index].finished
        this.list[index].finished = !curStatus
      },
      removeTask: function(index) {
        this.list.splice(index, 1)
      }
    }
  }
</script>
<style lang="" scope>
  
</style>