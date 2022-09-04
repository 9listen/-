<template>
  <div>
    <!--825-826品牌列表🌼 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin:10px 0px"
      @click="showDialog"
    >添加</el-button>
    <!-- 表格 -->
    <!-- prop:对应列内容的字段名 -->
    <!-- 注意1：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据 -->
    <!-- type属性为index即可显示从 1 开始的索引号。 -->
    <el-table style="width:100%" border :data="list">
      <el-table-column type="index" prop="prop" label="序号" width="width" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />

      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- row是循环的每一项数据<slot :row='item'></slot> -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="upDateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
         表格组件
         data:表格组件将来需要展示的数据------数组类型
         border：是给表格添加边框
         column属性
         label：显示标题
         width：对应列的宽度
         align：标题的对齐方式
       -->
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="page"
      :pager-count="5"
      :total="total"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!--
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:按钮的数量  如果 9  连续页码是7

    -->
    <!--🌼826 对话框组件  :visible="visible" @update:visible="dialogFormVisible = val" -->
    <!-- 🔴Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop属性设置为需校验的字段名即可。校验规则参见 async-validator -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- elem中的form收集数据的时候需要绑定model属性，代表把表单数据收集到哪个对象身上,表单验证也需要这个属性 -->
      <el-form ref="ruleForm" style="width:80%" :model="tmForm" :rules="rules">

        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <!-- 🌼上传文件组件 -->
          <!-- 这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址 配置dev-api才能成功
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，会执行一次 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 🌼自定义校验规则2-自定义校验品牌名称的提示
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称2-10字符'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 3, // 当前页显示的数据条数
      total: 0, // 默认0，当服务器数据返回以后会替换掉
      list: [], // 列表展示的数据
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      // ✅ 收集品牌信息,对象身上的属性不能瞎写，需要看文档✅
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则rules   eleme组件提供
      rules: {
        tmName: [// 品牌名称,required是指* 必须要校验
          { required: true, message: '品牌名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          // 🌼 827 自定义校验规则1
          { validator: validateTmName, trigger: 'change' }

        ],
        logoUrl: [// 品牌logo
          { required: true, message: '请选择活动品牌图片' }
        ]
      }
    }
  },
  // 🌼 826
  mounted() {
    // console.log(this.$API)// 拿到所有接口
    this.getPageList()
  },
  methods: {
    // 获取列表数据-请求数据的时候得带参数page,limit
    async getPageList(pager = 1) {
      const { page, limit } = this // 解构-简写
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(val) { // 会把选中的参数回传  改变当前页
      // console.log(val)
      this.page = val
      this.getPageList()
    },
    handleSizeChange(val) { // 改变某一页数据条数
      this.limit = val
      this.getPageList()
    },
    // 展示对话框
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' } // 置空数据
    },
    upDateTradeMark(row) { // 修改某一个品牌,row某行品牌信息
      this.dialogFormVisible = true
      // ⭐️ 将服务器返回的，已有的 品牌信息 赋值给tmForm进行展示
      // 相当于tmForm存储的既是服务器返回的品牌信息，tmForm和在表格里展示的品牌数据这两个数组指向的是一个对象this.tmForm = row
      this.tmForm = { ...row }// 浅拷贝⭐️
    },
    // 🌼 上传图片回调
    handleAvatarSuccess(res, file) {
      // console.log(res)// 上传成功后返回给前端的数据，有图片地址信息=res.data！
      // console.log(file)//上传成功后返回给前端的数据，图片名字，路径啥都有，大小！
      this.tmForm.logoUrl = res.data // 收集品牌图片数据带给服务器
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2 // file.size/1024 = xkb, xkb / 1024 = M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 🌼添加按钮(添加品牌/修改品牌)
    addOrUpdateTradeMark() {
      // 🫥全部验证的字段通过再写业务逻辑---表单验证Login组件里面也有
      this.$refs.ruleForm.validate(async(success) => { // 🌼1 async放在离await最近的函数里面
        if (success) { // 如果判断符合条件
          this.dialogFormVisible = false
          // 发请求(添加品牌/修改品牌)
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) { // 弹出信息可能是添加成功 ｜ 修改成功带修改的那个id
            // eleme组件库提供message消息提示的两种方法
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            this.getPageList()// ⭐️重新获取信息
          }
        } else {
          alert('error submit!!!')
          return false
        }
      })
    },
    // 🌼827 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 点击确定按钮触发
        // 向服务器发请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // ⭐️再次获取品牌列表数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    // #region
    /* elem提供：调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。Message Box
    组件也拥有极高的定制性，我们可以传入options作为第三个参数，它是一个字面量对象。
    type字段表明消息类型，可以为success，error，info和warning，无效的设置将会被忽略。
    注意，第二个参数title必须定义为String类型，如果是Object，会被理解为options。
    在这里我们用了 Promise 来处理后续响应。
 */
    // #endregion
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

