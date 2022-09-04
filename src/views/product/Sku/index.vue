<template>
  <div>
    <!-- 901🌼 -->
    <el-table style="width:100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:80;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale==0" type="success" icon="el-icon-bottom" size="mini" @click="sale(row)" />
          <el-button v-else type="success" icon="el-icon-top" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 🌼分页  -->
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      layout=" prev, pager, next,jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 🌼抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="(attr,index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-rigth:10px"
            type="success"
          >{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10, // 当前页面数据条数
      records: [], // 存储sku列表数据
      total: 0, // 分页器
      show: false,
      skuInfo: {}
    }
  },
  mounted() {
    // 🌼获取sku列表
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据
    async getSkuList(pages = 1) {
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records// table的数据
      }
    },
    handleCurrentChange(page) {
      this.page = page
      this.getSkuList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 🌼上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message.success('上架成功')
      }
    },
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message.success('下架成功')
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    // 🌼 获取sku详情的方法
    async getSkuInfo(sku) {
      const result = await this.$API.sku.reqSkuById(sku.id)
      // console.log(result)
      if (result.code === 200) {
        this.skuInfo = result.data
        this.show = true
      }
    }
  }
}
</script>
<style>
  .el-row .el-col-5{
    font-size:18px;
    text-align:center;
  }
  .el-col{
    margin: 10px 10px;
    margin-left:30px;
  }
  .el-carousel{
    height:400px;
  }
  .el-carousel__item{
    height: 400px;
  }
  .el-carousel__item img {
     background-color: #17385e;
     height:400px;
     width: 350px;
  }
  .el-carousel__indicator button{
    width: 15px;
    height: 15px;
    border-radius:50%;
  }
</style>
