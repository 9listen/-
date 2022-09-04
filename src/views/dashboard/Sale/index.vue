<template>
  <el-card class="box-card" style="margin:10px 0px">
    <!-- 🌸 -->
    <div slot="header" class="clearfix">
      <!--   @tab-click="handleClick" -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visit" />
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span>本周</span>
        <span>本月</span>
        <span>本年</span>
        <!--v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format:-yyyy-m-m-dd-
        />
      </div>
    </div>
    <!-- 🌸 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="19">
          <!-- 容器 -->
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="5" class="right-two">
          <h3 :span="4">门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">7</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      mycharts: null, // ⭐️⭐️把局部变量挂载到组件实例身上
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    // 计算标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  // 因为在mounted里面只能执行一次，所以要监听数据变化
  watch: {
    title() {
      // 重新修改图标的配置数据
      // 图表配置数据可以再次修改，如果有新的就可以用新的数值
      this.mycharts.setOption({
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.mycharts.setOption({
      title: {
        text: this.title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 110, 98, 167, 123, 44],
          color: 'skyblue'
        }
      ]
    })
  },
  methods: {
    setDay() {
      // 今天
      const day = '1998-9-11'
      this.date = [day, day]
    }
  }
}
</script>

<style scoped>
.clearfix{
  position: relative;
  display:flex;
  justify-content: space-between;
}
.tab{
  width:100%;
}
.right{
  position:absolute;
  right:0px;
}
.right span{
  margin:0 10px;
}
.date{
  width:250px;
  margin:0 20px;
}
.charts{
  width: 100%;
  height: 300px;
}
.right-two{
  padding:0px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin:5px 0;
}
ul li span{
  margin:0px 5px;
}
.rindex{
  float:left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color:white;
  text-align: center;
  background-color: black;
}
</style>
