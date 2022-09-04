<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg t="1662167372316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8335" width="15" height="15"><path d="M512 148.48c201.728 0 366.08 164.352 366.08 366.08S713.728 880.64 512 880.64 145.92 716.8 145.92 514.56 310.272 148.48 512 148.48M512 89.6c-234.496 0-424.96 190.464-424.96 424.96 0 234.496 189.952 424.96 424.96 424.96 234.496 0 424.96-190.464 424.96-424.96C936.96 280.064 746.496 89.6 512 89.6L512 89.6z" p-id="8336" /><path d="M512 762.88c-16.384 0-29.184-13.312-29.184-29.184L482.816 470.016c0-16.384 13.312-29.184 29.184-29.184s29.184 13.312 29.184 29.184l0 263.68C541.184 749.568 528.384 762.88 512 762.88z" p-id="8337" /><path d="M512 396.8c-16.384 0-29.184-13.312-29.184-29.184L482.816 308.736c0-16.384 13.312-29.184 29.184-29.184s29.184 13.312 29.184 29.184l0 58.368C541.184 383.488 528.384 396.8 512 396.8z" p-id="8338" /></svg>
    </div>
    <div class="main">
      <span class="main-title">1121</span>
      <span class="main-content">17.1</span>
      <svg t="1662170117307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10755" width="16" height="16"><path d="M576 234.688V1024H448V234.688L213.312 469.312 128 384l384-384 384 384-85.312 85.312L576 234.688z" fill="#1afa29" p-id="10756" /></svg>
      <svg t="1662170238772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12270" width="16" height="16"><path d="M448 789.312V0h128v789.312l234.688-234.624L896 640l-384 384-384-384 85.312-85.312L448 789.312z" fill="#d81e06" p-id="12271" /></svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts">1</div>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  name: 'LineCharts',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [100, 7, 33, 2, 108, 39, 95, 62, 98],
          // 线条设置
          lineStyle: {
            color: 'purple'
          },
          // 拐点设置
          itemStyle: {
            opacity: 0
          },
          // 填充颜色·设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.header{
  display:flex;
  align-items: center;
  /* color:#eee; */
}
.search-header{
  margin-right: 20px;
}
.main{
  margin: 10px 0px;
}
.main-title{
  margin-right:30px;
}
.main-content{
  margin-right:10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>
