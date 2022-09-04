<template>
  <a :title="title" style="margin:10px">
    <!-- 得用v-bind不能用：代替。$attrs：组件实例的属性，可以获取到父亲传递的props数据（前提子组件没有通过props接受） -->
    <!-- $listeners：组件实例的属性，可以获取到父亲传递自定义事件（对象形式呈现） -->
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']

}
</script>

<style scoped>
</style>
