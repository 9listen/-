<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" style="width:100%;height:20%" />
</template>
<script>
// 🌼903 引入echarts
import echarts from 'echarts'
export default {
  name: 'Card',
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

</style>
