<template>
  <div>
    <el-card style="margin:20px 0px">
      <!-- :show="!isShowTable"给子组件传值，isShowTable取反 -->
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- 按钮禁用这里是当category3Id不存在的时候禁用，也可以是attrlist数组长度为0的时候禁用 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <!--🔴 表格 展示平台属性 -->
        <el-table style="width:100%" border :data="attrlist">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- ⭐️row是数组中的每一个元素，相应的平台的属性attrlist -->
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(attrValue,index) in row.attrValueList"
                :key="index"
                style="margin:0px 20px"
                type="success"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 🔴添加属性｜修改属性按钮 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width:100%;margin:20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80" />
          <el-table-column width="width" prop="prop" label="属性值名称">
            <!-- row代表最外层table组件的:data里面的数据attrValueList，可以理解为简写 -->
            <template slot-scope="{row,$index}">
              <!-- ⭐️span和input来回切换 -->
              <!-- 这些都是ui组件，是用原生事件的时候得加上native,比如这里的回车事件 -->
              <!--🌈829 :ref=index是为了区分哪一个编辑框，自动聚焦 -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <!-- blur的时候切换成span -->
              <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <!-- popconfirm气泡确认框组件，里面有confirm事件，点击确认按钮触发 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗?`" @onConfirm="deleteAtrrValue">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length<1"
          @click="addOrUpdateAttr"
        >保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
// 🌼 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrlist: [], // 🌸接收平台属性的字段
      isShowTable: true, // 828 控制table表格显示与隐藏
      // 🌸收集新增属性或修改属性
      attrInfo: { //
        attrName: '', // 属性名
        attrValueList: [ // 属性名中属性值，因为属性值可以是多个，因此需要的是数组
          // {
          //   attrId: 0, // 属性的id
          //   valueName: 'string' // 属性值
          // }
        ],
        categoryId: 0, // category3Id
        categoryLevel: 3 // 服务器需要区分是几级id
      }
    }
  },
  methods: {
    // 827自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // console.log(categoryId, level)
      // 区分三级分类相应的id,以及父组件进行存储
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else { // 代表有三级id
        this.category3Id = categoryId
        this.getAttrList()// 发请求获取平台属性
      }
    },
    // 827 获取平台数据-发请求
    // 当用户确定三级分类以后，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // console.log(1)
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      // console.log(result)
      if (result.code === 200) {
        this.attrlist = result.data
      }
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false
      // ⭐️清除数据
      this.attrInfo = { //
        attrName: '', // 属性名
        attrValueList: [], // 属性名中属性值，因为属性值可以是多个，因此需要的是数组
        categoryId: this.category3Id, // 🌸 category3Id
        categoryLevel: 3 // 服务器需要区分是几级id
      }
    },
    // 828 添加属性值回调
    addAttrValue() {
      // 向属性值数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 相应属性的id，添加属性之前还没有相应的id
        valueName: '', // 相应属性值名称
        flag: true // 💥💥注意：给每一个属性值都打一个flag，这样每个属性值互不影响
        // 相当于给每一个属性值添加一个标记flag,用于切换查看和编辑模式，好处是每一个属性值可以控制自己的模式切换
        // 当前的flag属性是一个响应式属性，-数据变化视图也变化
      })
      this.$nextTick(() => { // 这里是:ref=index指向input框
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 828修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)// 🌼🌼将选中的属性赋值attrInfo。这里是复杂数据类型，数据结构存在对象里面套数组，
      // 数组里面又套对象，得使用深拷贝解决问题
      // 🍀 手写浅拷贝
      // console.log(row)//拿到的属性身上没有flag字段，没办法进行切换，
      // 所以在修改属性时，将相应的属性值元素添加上flag标记
      this.attrInfo.attrValueList.forEach(item => {
        //  item.flag = false
        // 默认查看模式，这样写也可以给属性值添加flag属性（切换查看和input框），
        // 但是会发现视图不会跟着变化，因为flag不是响应式的数据,但是上面添加属性的回调本身就是响应式数据this.attrInfo.attrValueList.push
        // 🌼🌼🌼🌼🌼🌼🌼  $set属性就可以向对象中添加一个property,并确保这个property是响应式的，触发视图更新
        // 它必须用于向响应式对象身上添加新的property
        // Vue.set(target,propertyName/index,value)
        this.$set(item, 'flag', false)
      })
    },
    // input失去焦点的事件
    toLook(row) {
    // 编辑模式变成查看模式【让input消失，显示span】,🌸需求1.要排除输入为空的情况
      if (row.valueName.trim() === '') {
        this.$message('请你输入一个正常的属性')
        return
      }
      // 🌸需求2，新增的属性值row不能和已有的一样
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // row是当前添加的最新的属性值,数组的最后一项元素
        // 需要将row从数组里面判断的时候去除
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) return
      row.flag = false
      // console.log(row)
    },
    // 点击span的回调变回编辑模式
    toEdit(row, index) {
      row.flag = true
      // 🌈829 获取input节点，实现自动聚焦---span变为input导致了重排重绘耗时间，
      // 因此不可能一点击span立马获取到input,$nextTick节点渲染完毕，会执行一次
      this.$nextTick(() => {
        // 获取相应的input表单元素实现聚焦
        this.$refs[index].focus()
      })
    },
    // 🌼829 删除气泡确认框确定的回调---🔥注意这里版本号不一样，所以要写成onConfirm
    deleteAtrrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数:1,如果用户添加很多属性值，且属性值为空⭐️的不应该提交给服务器
      // 2.提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不是空的
        if (item.valueName !== '') {
          // ⭐️删除flag属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示平台属性的信号量进行切换
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        // 保存成功以后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        // this.$message('保存失败')
      }
    }
  }
}
</script>

<style scoped>
</style>
