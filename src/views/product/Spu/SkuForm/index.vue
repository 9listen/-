<template>
  <!-- 添加或修改sku -->
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <!--🌸 多个下拉框，得用行内inline -->
      <el-form-item label="平台属性">
        <!-- 再划分 -->
        <el-form ref="form" :inline="true" label-width="80px">
          <!--平台属性attrInfoList 多个 -->
          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <!-- 🟡收集${attr.id}:${attrValue.id}到平台属性上，方便传给服务器 -->
            <el-select v-model="attr.attrIdAndValueId" palceholder="请选择">
              <el-option
                v-for="(attrValue,index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="销售属性">
        <!-- 再划分 -->
        <el-form ref="form" :inline="true" label-width="80px">
          <!-- 1 -->
          <el-form-item
            v-for="(saleAttr,index) in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <!--🟡v-model收集数据  -->
            <el-select v-model="saleAttr.attrIdAndValueId" palceholder="请选择" value="">
              <el-option
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="图片列表">
        <el-table
          style="width:100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="80" type="selection" />
          <el-table-column prop="prop" label="图片" width="width">
            <!-- row其实是spuImageList里面的每一项图片 -->
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault===0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [], // 🌈 图片--服务器返回的图片列表数据
      spuSaleAttrList: [], // 🌈 获取服务器返回销售属性的数据
      attrInfoList: [], // 🌈 服务器返回平台属性的数据
      skuInfo: { // 🌼
        // 🌸第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 🌸第二类需要双向绑定
        price: 0,
        skuName: '',
        weight: '',
        skuDesc: '',
        // 🌸第三类需要自己收集--拆分从服务器返回的数据
        skuDefaultImg: '', // 默认图片
        skuAttrValueList: [// 🌈 ⭐️平台属性列表
          {
            // attrId: 0, // 平台属性id
            // valueId: 0// 属性值id
          }
        ],
        skuImageList: [// ⭐️收集图片
          // {
          //   'id': 0,
          //   'imgName': 'string',
          //   'imgUrl': 'string',
          //   'isDefault': 'string',
          //   'skuId': 0,
          //   'spuImgId': 0
          // }
        ],
        skuSaleAttrValueList: [// ⭐️销售属性
          // {
          //   'id': 0,
          //   'saleAttrId': 0,
          //   'saleAttrName': 'string',
          //   'saleAttrValueId': 0,
          //   'saleAttrValueName': 'string',
          //   'skuId': 0,
          //   'spuId': 0
          // }
        ]

      },
      spu: {},
      // 收集图片的字段,但是收集的数据缺少isDefault默认字段，将来提交给服务器数据的时候需要整理参数
      imageList: []
    }
  },
  methods: {
    // 🌼 获取SkuForm数据
    async getData(category1Id, category2Id, spu) {
      console.log(spu)// 有category3Id，id，tmId
      // ⭐️ 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 1 获取图片数据
      const result = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(result)// 图片信息
      if (result.code === 200) {
        // this.spuImageList = result.data
        const list = result.data
        list.forEach(item => {
          item.isDefault = 0// 给每张图片加一个默认字段
        })
        this.spuImageList = list
      }
      // 2 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }
      // 3 获取平台属性的数据
      const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      // console.log(result2)// 返回数组
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    // 🌸table表格复选框事件
    handleSelectionChange(params) {
      // console.log(params)//🌸获取到用户选中图片的信息数据，但是需要注意，当前收集的数据中，缺少isDefault字段
      this.imageList = params
    },
    // 🌸点击切换默认--排他思想
    changeDefault(row) {
      // 图片列表的数据isDefault变为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // ⭐️收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 🌸
    cancel() {
      this.$emit('changeSce', 0)
      Object.assign(this._data, this.$options.data())// 清除数据
    },
    // 🌸保存按钮的事件
    async save() {
      // 整理参数
      // 1.平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 🟡整理方式1
      // const arr = []
      // // 把收集到的数据整理一下
      // attrInfoList.forEach(item => {
      //   // 当前平台属性进行选择
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')// 分离属性
      //     // 携带给服务器的参数应该是对象
      //     const obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // // 将整理好的参数赋值给skuInfo.skuAttrValueList
      // skuInfo.skuAttrValueList = arr
      // 🟡整理方式2--也是返回一个新值
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) { // item每一个平台属性
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])// 初始值为空的话，prev的初始值就是第一个值，item就是第二个值
      // 🌸整理销售属性数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])// 类似于saleAttrId:"16430"  saleAttrValueId:"10078"
      // 🌸整理图片的数据
      skuInfo.skuImageList = imageList.map(item => { // 🔥map映射一个新数据
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // console.log(imageList)
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message.success('添加SKU成功')
        this.$emit('changeSce', 0)
        Object.assign(this._data, this.$options.data())// 清除数据的方法
      }
    }
  }
}
</script>
<style></style>
