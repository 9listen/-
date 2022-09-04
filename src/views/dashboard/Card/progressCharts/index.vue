<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" style="width:78%;height:20%" />
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  name: 'ProgessCharts',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        min: 0,
        max: 100
        // 均分
        // type: 'category'//x轴
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: 'category'
      },
      // 系列
      series: [
        {
          // 图标形式-柱状图
          type: 'bar',
          data: [78],
          color: 'blue',
          // 柱状图宽度
          barWidth: 10,
          showBackground: true,
          // 文本
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>

