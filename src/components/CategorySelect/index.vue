<template>
  <div>
    <!-- 827设置 inline 属性可以让表单域变为行内的表单域,可以放置多个表单元素 -->
    <el-form :inline="true" :model="cForm" class="demo-form-inline">

      <el-form-item label="一级分类">
        <!-- select双向绑定收集到的是value -->
        <!-- 🌼change事件写在组件上，代表自定义事件！！！！！ -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler1"
        >
          <el-option v-for="(c1,index) in list1" :key="index" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler2"
        >
          <el-option v-for="(c2,index) in list2" :key="index" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler3"
        >
          <el-option v-for="(c3,index) in list3" :key="index" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      list1: [], // 一级分类数据
      list2: [], // 二级分类数据
      list3: [], // 三级分类数据
      // 收集1级，2级，3级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 🌸组件挂载完毕，向服务器发起请求，获取相应的一级分类的数据
  mounted() {
    this.getCategory1List() // 一级分类
  },
  methods: {
    async getCategory1List() { // 一级分类
      const result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 🌸一级分类的select事件回调————当一级分类的option发生变化时，获取相应的二级分类的数据
    async handler1() {
      // ⭐️清空数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // ⭐️ 解构出一级分类id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })//
      const result = await this.$API.attr.reqCategory2List(category1Id)
      // console.log(result)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 🌸二级分类的select事件回调————当二级分类的option发生变化时，获取相应的三级分类的数据
    async handler2() {
      // ⭐️清空数据
      this.list3 = []
      this.cForm.category3Id = ''
      // ⭐️
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })//
      const result = await this.$API.attr.reqCategory3List(category2Id)
      // console.log(result)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 🌸
    handler3() {
      // 解构三级分类id
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })//
    }
  }
}
</script>

<style scoped>
</style>
