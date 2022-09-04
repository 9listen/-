<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 829🌼底部这里将来是有三部分进行切换 -->
      <!-- 1.展示spu列表 -->
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width:100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <!-- row是records下面的每一项 -->
            <template slot-scope="{row,$index}">
              <!-- ⭐️去场景2  这里的按钮将来用HintButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              />
              <!-- 901⭐️去场景1 修改某一个spu，带id，修改哪一个 -->
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前类spu全部sku列表"
                @click="handler(row)"
              />
              <!-- ⭐️删除 -->
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3,5,10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- 总共三部分，结构比较多 另外两部分拆成组件 -->
      <!-- 添加｜修改SPU -->
      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />
      <!-- 添加SKU -->
      <SkuForm v-show="scene==2" ref="sku" @changeSce="changeSce" />
      <!-- <div v-show="scene==2">3</div> -->
    </el-card>
    <!-- x🌼901 显示spu的sku列表 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table v-loading="loading" :data="skuList" border style="width:100%">
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" width="width" />
        <el-table-column label="默认图片" width="">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import SpuForm from './SpuForm/index.vue'
import SkuForm from './SkuForm/index.vue'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //
      page: 1,
      limit: 3, // 当前页显示的数据条数
      records: [], // 存储spu列表数据
      total: 0, // 分页器一共需要展示数据的条数
      scene: 0, // 0代表展示SPU数据，  1代表添加｜修改SPU，2代表添加SKU
      dialogTableVisible: false, // 对话框
      spu: {},
      skuList: [], // sku列表数据
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId:获取到一、二、三级分类的id  level：为了区分是几级id
      if (level === 1) {
        this.category1Id = categoryId
        // 清除2，3，级数据
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取spu列表数据展示
        this.getSpuList()
      }
    },
    // 获取spu列表数据
    async getSpuList(pages = 1) { // 默认第一页
      const { page, limit, category3Id } = this
      // 携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleCurrentChange(page) { // ui组件封装好的，参数
      this.page = page
      this.getSpuList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 🌈🌸添加spu按钮回调
    addSpu() {
      this.scene = 1
      // 🌸831 通知子组件spuForm发请求-两个:获取品牌的数据、全部销售属性的数据
      this.$refs.spu.addSpuData(this.category3Id)
    },
    updateSpu(row) {
      this.scene = 1
      // console.log(this.$refs.spu)//🌸 $refs获取SpuForm子组件,或者$children也可以获取
      this.$refs.spu.initSpuData(row)
    },
    changeScene({ scene, flag }) { // 🟡🌸830 自定义事件回调--flag是 区分添加还是修改的按钮
      this.scene = scene
      // 831 子组件通知父组件后，父组件得再次获取数据
      if (flag === '修改') {
        this.getSpuList(this.page)// 保存在当前页
      } else {
        this.getSpuList()
      }
    },
    // 🌼831 删除按钮的回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      // console.log(row, result)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 再次获取数据
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
        // records代表有几项数据即spu的个数，小于1的话回到上一页
      }
    },
    // 🌈🌼831添加sku按钮回调
    addSku(row) { // records里面每一项
      this.scene = 2
      // 🌸831 通知子组件skuForm发请求-三个
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
      // console.log(row)
    },
    // 🌼🟡spu里面的sku
    changeSce(scene) {
      this.scene = scene
    },
    // 🌼901 查看sku按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu// 保存spu信息
      const result = await this.$API.spu.reqSkuList(spu.id)
      // console.log(result)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框---loading变为真，清除sku列表数据
    close(done) { // done用于关闭对话框
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>
<style>
</style>
