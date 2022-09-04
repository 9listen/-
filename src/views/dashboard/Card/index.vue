<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="总销售额" count="¥ 126560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67% <svg t="1662170117307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10755" width="16" height="16"><path d="M576 234.688V1024H448V234.688L213.312 469.312 128 384l384-384 384 384-85.312 85.312L576 234.688z" fill="#1afa29" p-id="10756" /></svg></span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <svg t="1662170238772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12270" width="16" height="16"><path d="M448 789.312V0h128v789.312l234.688-234.624L896 640l-384 384-384-384 85.312-85.312L448 789.312z" fill="#d81e06" p-id="12271" /></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额 ¥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第二个card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第三个card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barCharts />
            </template>
            <template slot="footer">
              <span>转换率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第四个card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressCharts />
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.67% <svg t="1662170117307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10755" width="16" height="16"><path d="M576 234.688V1024H448V234.688L213.312 469.312 128 384l384-384 384 384-85.312 85.312L576 234.688z" fill="#1afa29" p-id="10756" /></svg></span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <svg t="1662170238772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12270" width="16" height="16"><path d="M448 789.312V0h128v789.312l234.688-234.624L896 640l-384 384-384-384 85.312-85.312L448 789.312z" fill="#d81e06" p-id="12271" /></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Detail from './Detail/index.vue'
import LineChart from './lineChart/index.vue'
import barCharts from './barCharts/index.vue'
import progressCharts from './progressCharts/index.vue'
export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    barCharts,
    progressCharts
  }
}
</script>
<style scoped>

</style>
