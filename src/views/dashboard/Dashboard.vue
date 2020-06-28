<template>
    <div class="fill-height">
        <v-container fluid class="fill-height" style="background-color: #667086">
            <v-card dark class="d-flex flex-row fill-width flex-wrap">
                <v-list-item dark @click="$notify({text:'Hello',type:'success',duration:40000})">
                    <v-list-item-avatar>
                        <v-icon x-large color="info">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>用户数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">
                            {{mallInfo.wechatUserCount}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item dark>
                    <v-list-item-avatar>
                        <v-icon x-large color="success">mdi-shopping</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>商品数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">
                            {{mallInfo.goodsCount}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item dark>
                    <v-list-item-avatar>
                        <v-icon x-large color="primary">mdi-shopping-search</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>货品数量</v-list-item-title>
                        <v-list-item-subtitle class="title font-weight-bold">
                            {{mallInfo.productsCount}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-card class="fill-width mt-3">
                <v-chart
                        style="width:100%;height: 60vh;min-width: 80vh"
                        ref="chartCollect"
                        :options="collectChartOption"
                        autoresize
                />
            </v-card>
            <v-card class="fill-width mt-3">
                <v-chart
                        style="width:100%;height: 60vh;min-width: 80vh"
                        ref="chartPreview"
                        :options="previewChartOption"
                        autoresize
                />
            </v-card>
            <v-card class="fill-width mt-3">
                <v-chart
                        style="width:100%;height: 60vh;min-width: 80vh"
                        ref="chartPreviewByUser"
                        :options="previewByUserChartOption"
                        autoresize
                />
            </v-card>
        </v-container>
    </div>
</template>

<script>
  import '@/plugins/echarts'
  import echarts from 'echarts/lib/echarts'
  export default {
    name: 'Dashboard',
    data: function () {
      return {
        mallInfo: {
          wechatUserCount: 0,
          goodsCount: 0,
          productsCount: 0,
        },
        collect: [],
        previewByGoods: [],
        previewByUser: [],
        collectChartOption:{},
        previewChartOption:{},
        previewByUserChartOption:{},
      }
    },
    created () {
      this.getMallInfo()
      this.getCollectInfo()
      this.getPreviewInfo()
      this.getPreviewUserInfo()
    },
    methods: {
      getMallInfo: async function () {
        let res = await this.$remote.post({
          url: '/statistics/mallInfo',
        })
        this.mallInfo = res.Data
      },
      getCollectInfo: async function () {
        let res = await this.$remote.post({
          url: '/statistics/collects',
        })
        this.collect = res.Data
        this.buildCollectChartOptions()
      },
      getPreviewInfo: async function () {
        let res = await this.$remote.post({
          url: '/statistics/previewGoods',
        })
        this.previewByGoods = res.Data
        this.buildPreviewChartOptions()
      },
      getPreviewUserInfo: async function () {
        let res = await this.$remote.post({
          url: '/statistics/previewUser',
        })
        this.previewByUser = res.Data
        this.buildPreviewUserChartOptions()
      },
      buildCollectChartOptions:function () {
        const seriesData = this.collect.map(e => parseInt(e.count))
        let max = seriesData.reduce((max, data) => {
          return max < data ? data : max
        }, 5)
        const shadowData = this.collect.map(e => max)
        const xAxisData = this.collect.map(e => e.name)
        this.collectChartOption =  {
          backgroundColor: '#394056',
          color: ['#3398DB'],
          grid: {
            right: '3%',
            bottom: '4%',
            left: '3%',
            containLabel: true,
          },
          title: {
            text: `商品收藏统计`,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
              color: '#ffffff',
            },
            padding: 30,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0,
              },
            },
            formatter (params) {
              const param = params[0]
              return `${param.seriesName}：${param.value}人`
            },
          },
          toolbox: {
            right: 20,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              start: 0,
              backgroundColor: 'rgba(222,222,222,0.8)',
              handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            }],
          xAxis: [
            {
              type: 'category',
              gridIndex: 0,
              data: xAxisData,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                show: true,
                color: 'rgb(255, 255, 255)',
                interval: 0,
                rotate: 40,
                lineHeight: 60,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              min: 0,
              max: max,
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                color: 'rgb(255, 255, 255)',
              },
            },
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              data: seriesData,
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: '最大值',
                  },
                  {
                    type: 'min',
                    name: '最小值',
                  },
                ],
                label: {
                  show: true,
                  formatter: (c) => {
                    return `${c.value}人`
                  },
                },
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#18FFFF',
                    },
                    {
                      offset: 0.5,
                      color: '#29B6F6',
                    },
                    {
                      offset: 1,
                      color: '#2962FF',
                    },
                  ]),
                },
              },
            },
            {
              name: 'Shadow',
              type: 'bar',
              barWidth: '40%',
              barGap: '-100%',
              data: shadowData,
              itemStyle: {
                normal: {
                  color: 'rgba(3, 3, 3, 0.1)',
                },
              },
            },
          ],
        }
      },

      buildPreviewChartOptions:function () {
        const seriesData = this.previewByGoods.map(e => parseInt(e.count))
        let max = seriesData.reduce((max, data) => {
          return max < data ? data : max
        }, 5)
        const shadowData = this.previewByGoods.map(e => max)
        const xAxisData = this.previewByGoods.map(e => e.name)
        this.previewChartOption =  {
          backgroundColor: '#394056',
          color: ['#3398DB'],
          grid: {
            right: '3%',
            bottom: '4%',
            left: '3%',
            containLabel: true,
          },
          title: {
            text: `商品预览统计`,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
              color: '#ffffff',
            },
            padding: 30,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0,
              },
            },
            formatter (params) {
              const param = params[0]
              return `${param.seriesName}：${param.value}次`
            },
          },
          toolbox: {
            right: 20,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              start: 0,
              backgroundColor: 'rgba(222,222,222,0.8)',
              handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            }],
          xAxis: [
            {
              type: 'category',
              gridIndex: 0,
              data: xAxisData,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                show: true,
                color: 'rgb(255, 255, 255)',
                interval: 0,
                rotate: 40,
                lineHeight: 60,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              min: 0,
              max: max,
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                color: 'rgb(255, 255, 255)',
              },
            },
          ],
          series: [
            {
              name: '次数',
              type: 'bar',
              data: seriesData,
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: '最大值',
                  },
                  {
                    type: 'min',
                    name: '最小值',
                  },
                ],
                label: {
                  show: true,
                  formatter: (c) => {
                    return `${c.value}次`
                  },
                },
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#18FFFF',
                    },
                    {
                      offset: 0.5,
                      color: '#29B6F6',
                    },
                    {
                      offset: 1,
                      color: '#2962FF',
                    },
                  ]),
                },
              },
            },
            {
              name: 'Shadow',
              type: 'bar',
              barWidth: '40%',
              barGap: '-100%',
              data: shadowData,
              itemStyle: {
                normal: {
                  color: 'rgba(3, 3, 3, 0.1)',
                },
              },
            },
          ],
        }
      },

      buildPreviewUserChartOptions:function () {
        const seriesData = this.previewByUser.map(e => parseInt(e.count))
        let max = seriesData.reduce((max, data) => {
          return max < data ? data : max
        }, 5)
        const shadowData = this.previewByUser.map(e => max)
        const xAxisData = this.previewByUser.map(e => e.nickname)
        this.previewByUserChartOption =  {
          backgroundColor: '#394056',
          color: ['#3398DB'],
          grid: {
            right: '3%',
            bottom: '4%',
            left: '3%',
            containLabel: true,
          },
          title: {
            text: `用户商品预览统计`,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
              color: '#ffffff',
            },
            padding: 30,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0,
              },
            },
            formatter (params) {
              const param = params[0]
              return `${param.seriesName}：${param.value}次`
            },
          },
          toolbox: {
            right: 20,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              start: 0,
              backgroundColor: 'rgba(222,222,222,0.8)',
              handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            }],
          xAxis: [
            {
              type: 'category',
              gridIndex: 0,
              data: xAxisData,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                show: true,
                color: 'rgb(255, 255, 255)',
                interval: 0,
                rotate: 40,
                lineHeight: 60,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              min: 0,
              max: max,
              axisLine: {
                lineStyle: {
                  color: '#455A64',
                },
              },
              axisLabel: {
                color: 'rgb(255, 255, 255)',
              },
            },
          ],
          series: [
            {
              name: '次数',
              type: 'bar',
              data: seriesData,
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: '最大值',
                  },
                  {
                    type: 'min',
                    name: '最小值',
                  },
                ],
                label: {
                  show: true,
                  formatter: (c) => {
                    return `${c.value}次`
                  },
                },
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#18FFFF',
                    },
                    {
                      offset: 0.5,
                      color: '#29B6F6',
                    },
                    {
                      offset: 1,
                      color: '#2962FF',
                    },
                  ]),
                },
              },
            },
            {
              name: 'Shadow',
              type: 'bar',
              barWidth: '40%',
              barGap: '-100%',
              data: shadowData,
              itemStyle: {
                normal: {
                  color: 'rgba(3, 3, 3, 0.1)',
                },
              },
            },
          ],
        }
      }
    },
  }
</script>

<style scoped>

</style>
