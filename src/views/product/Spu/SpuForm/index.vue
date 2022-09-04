<template>
  <!-- 添加或修改spu -->
  <div>
    <!-- :model="spu"把数据收集到spu身上 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="spu名称" />
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="品牌">
        <!--🔥 v-model="spu.tmId"选择品牌的时候收集id -->
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm, index) in tradeMarkList" :key="index" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="描述" />
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="SPU图片">
        <!-- action是图片上传地址, list-type	文件列表的类型, file-list	上传的文件列表
        on-preview	预览，点击文件列表中已上传的文件时的钩子,on-remove	文件列表移除文件时的钩子 on-success	文件上传成功时的钩子 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <!-- 🌸 -->
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :palceholder="`还有${unSelectSaleAttr.length}未选择`">
          <!-- value就是尺寸、颜色、版本 -->
          <el-option
            v-for="(unselect,index) in unSelectSaleAttr"
            :key="index"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          />
        </el-select>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <!-- row每一个销售属性 展示属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--  -->
              <!-- 展示已有的tag属性值 -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="index"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 🟡底下的结构类似于之前span和input框切换
                 @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <!-- 🟡 @click="showInput" 点击按钮由button变成input-->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="AddOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu属性初始化的时候是一个🔥空对象，在🔥修改SPU的时候，会向服务器发请求，
      // 返回spu对象，在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器进行修改
      // 但是🔥添加sppu的时候，没有向服务器发请求，数据收集到spu,具体的字段看看文档
      spu: {
        // 存储spu信息属性
        category3Id: 0,
        tmId: '', // 平台id
        description: 'string',
        spuName: 'string',

        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        // 🌸平台属性与属性值的收集
        spuSaleAttrList: [
          {
            // baseSaleAttrId: 0,
            // id: 0,
            // saleAttrName: 'string',
            // spuId: 0,
            // spuSaleAttrValueList: [
            //   {
            //     baseSaleAttrId: 0,
            //     id: 0,
            //     isChecked: 'string',
            //     saleAttrName: 'string',
            //     saleAttrValueName: 'string',
            //     spuId: 0
            //   }
            // ]
          }
        ]
      },
      tradeMarkList: [], // 存储品牌信息/select框
      spuImageList: [], // 图片的数据
      saleAttrList: [], // 🌸获取平台全部销售属性----项目全部的销售属性
      attrIdAndAttrName: '' // 收集未选择的销售属性的id
    }
  },
  //
  computed: {
    // 🌸计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 判断一个数组中所有元素是否在另一个数组中存在
      // 整个平台  的销售属性一共三个：颜色、尺寸、版本saleAttrList
      // 当前spu  拥有的属于自己的销售属性--spu.spuSaleAttrList---例如只有颜色
      // 数组的过滤方法，可以从已有的数组中过滤出用户需要的元素，并返回一个新数据
      const result = this.saleAttrList.filter((item) => { // 🟡 整个平台saleAttrList
        // console.log(item)
        return this.spu.spuSaleAttrList.every((item1) => { // 🟡当前spu.spuSaleAttrList,every返回布尔值
          return item.name !== item1.saleAttrName// 返回颜色和已有的属性不相等
        })
      })
      return result
    }
  },
  // 组件一刷新就发请求，只能执行一次。而我们为什么不能放在子组件的mounted里面，因为v-show只是控制SpuForm子组件显示与隐藏，
  // 这个子组件并没有卸载（只是显示或者隐藏），导致mounted只能执行一次。
  mounted() {
    // console.log(333)
  },
  methods: {
    // 删除图片触发
    // file:删除的那张照片。fileList剩余的没删的图片
    handleRemove(file, fileList) {
      // console.log(file, fileList,22222);
      // 收集照片墙图片的数据
      // 对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      // 对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList// 🍀
    },
    // ---预览照片墙的时候，显示大的图片的时候，需要收集数据吗? ---不需要收集的【数据已经有了】
    handlePictureCardPreview(file) {
      console.log(file.url)
      this.dialogImageUrl = file.url
      this.dialogVisible = true // 对话框显示
    },
    // 🌼 830 初始化spuForm的数据,父组件编辑功能用ref获取子组件的方法，每一次都可以调用子组件的方法
    async initSpuData(spu) {
      // console.log(22, spu)
      // 🌸获取spu信息数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      // console.log(spuResult)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 🌸获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log(tradeMarkResult)//数组
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 🌸获取spu图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(spuImageResult)
      if (spuImageResult.code === 200) {
        // this.spuImageList = spuImageResult.data
        // 🔥🔥🔥🔥🔥🔥🔥🔥由于照片墙显示图片的按钮需要数组，数组里面的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        const listArr = spuImageResult.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值给
        this.spuImageList = listArr
      }
      // 🌸获取平台全部销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 🌼照片墙上传成功的回调
    handleSuccess(response, file, fileList) {
      // 收集的图片信息
      this.spuImageList = fileList// 🍀
    },
    // 🌼830 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')// 返回id和名字
      // 向SPU对象的spuSaleAttrList属性里面添加新的销售属性--这几个参数都是里面有的，需要
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // ⭐️清空数组
      this.attrIdAndAttrName = ''
    },
    // 🌼830 添加销售属性值的按钮的回调，展示为input,通过销售属性的inputVisible
    addSaleAttrValue(row) {
      // console.log(row)// row当前这排的数据
      // 🔥🔥 row.inputVisible = true//不是响应式，之前attr组件写过，用$set
      // 挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
    },
    // 🌼input失去焦点
    handleInputConfirm(row) { // row在这里是spu.spuSaleAttrValueList
      // 🔥 解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row
      // 🔥 新增的销售属性值名字不能为空
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 🔥属性值不能重复---这里也可以用some !== 换为===，!result换为result
      const result = row.spuSaleAttrValueList.every(item => {
        item.saleAttrValueName !== inputValue
      })
      if (!result) return// 如果输入的名字都不等于原始的属性名，那么为真，取反
      // 🔥新增的销售属性
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 🔥修改inputVisible就显示button
      row.inputVisible = false
    },
    // 🌼保存按钮的回调
    async AddOrUpdateSpu() {
      // console.log(1)
      // 🌸整理参数：需要整理照片墙的数据
      // 🌸携带参数：对于图片，需要携带imgName与imgUrl字段，原始的图片都携带着的
      // 🔥🔥 831！！！！！！！！不能用本地地址，用response里面的.map映射，返回一个新的数组
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)// 哦哦，懂了，保存的时候把spu所有信息都带过去保存
      if (result.code === 200) {
        // 提示
        this.$message.success('保存成功')
        // 🌸通知父组件回到场景scene=0的时候
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 🌸 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 🌼831 父组件要求的请求
    async addSpuData(category3Id) {
      // 🌸添加spu的时候收集三级分类的id
      this.spu.category3Id = category3Id// 父组件传的参数
      // 🌸获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log(tradeMarkResult)//数组
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 🌸获取平台全部销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 🌼 取消按钮，切换场景，清除数据
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // ⭐️清理数据，es6的方法Object.assign可以合并对象，组件实例this._data💥💥💥💥💥💥💥💥💥💥💥💥
      Object.assign(this._data, this.$options.data())
      // console.log(this._data)// 返回data实例
      // console.log(this.$options.data)// 获取配置对象，返回的data函数，可以看到里面的数据
    }
  }
}
</script>
<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
