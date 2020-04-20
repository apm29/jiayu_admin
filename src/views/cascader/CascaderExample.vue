<template>
    <v-container fluid class="fill-height d-flex flex-column">
        <div class="flex-grow-1 overflow-y-auto overflow-x-hidden" style="width: 100%">
            <v-row justify="space-around">
                <v-switch v-model="disabled" class="ma-2" label="Disabled"></v-switch>
                <v-switch v-model="clearable" class="ma-2" label="Clearable"></v-switch>
                <v-switch v-model="dense" class="ma-2" label="Dense"></v-switch>
                <v-switch v-model="showAllLevels" class="ma-2" label="ShowAllLevels"></v-switch>
                <v-switch v-model="changeOnSelect" class="ma-2" label="ChangeOnSelect"></v-switch>
                <v-switch v-model="returnObject" class="ma-2" label="ReturnObject"></v-switch>
                <v-switch v-model="labelStyle" class="ma-2" label="使用LabelStyle"></v-switch>
                <v-switch v-model="outlined" class="ma-2" label="Outlined"></v-switch>
            </v-row>
            <v-card class="my-3" outlined>
                <v-card-title
                        class="grey lighten-3"
                >
                    演示
                </v-card-title>
                <v-card-text>
                    <v-row align="center">
                        <v-col>
                            <v-cascader
                                    :options="options"
                                    v-model="result"
                                    :disabled="disabled"
                                    :clearable="clearable"
                                    :dense="dense"
                                    :outlined="outlined"
                                    :return-object="returnObject"
                                    placeholder="选择一个"
                                    :label-style="labelStyle?{
                                     color:'grey',
                                     'font-size':'large'
                                   }:{}"
                                    :change-on-select="changeOnSelect"
                                    :show-all-levels="showAllLevels"
                                    @changeCascadeResult="onChangeItem"
                            >
                            </v-cascader>
                        </v-col>
                        <v-col>
                            值:{{result}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    props说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>options：选项数据，Array类型，默认值 []；</li>
                        <li>value：已选项目的数据，Array类型，默认值 []；支持v-model用法</li>
                        <li>dense：是否使用经凑样式，Boolean类型，默认值 true；</li>
                        <li>returnObject：是否返回Object而不是index，Boolean类型，默认值 false；</li>
                        <li>clearable：是否打开清除，Boolean类型，默认值 true；</li>
                        <li>disable：是否禁用，Boolean类型，默认值 false；</li>
                        <li>changeOnSelect：选择子项后立即改变textField文字，Boolean类型，默认值 true；</li>
                        <li>showAllLevels：textField中显示父级到叶子节点的文字，Boolean类型，默认值 true；</li>
                        <li>itemValue 指定选项的值为选项对象的某个属性值 String类型</li>
                        <li>itemLabel 指定选项标签为选项对象的某个属性值 String类型</li>
                        <li>itemChildren 指定选项的子选项为选项对象的某个属性值 String类型</li>
                        <li>itemDisabled 指定选项的禁用为选项对象的某个属性值 String类型</li>
                        <li>placeholder 文本框的placeholder String类型</li>
                        <li>textFieldStyle 文本框的Style Object类型</li>
                        <li>labelStyle 文本节点的Style Object类型</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    event说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>changeCascadeResult：已选项变化时触发,参数为改变后的value；</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    slot说明
                </v-card-title>
                <v-card-text>
                    <ol class="pt-2">
                        <li>label：自定义节点文本；{subOptionsItem}为slot的prop</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-title
                        class="grey lighten-3"
                >
                    使用
                </v-card-title>
                <v-card-text>
                  <markdown-editor preview :value="usageMarkdown"></markdown-editor>
                </v-card-text>
            </v-card>

        </div>
    </v-container>
</template>

<script>
  import VCascader from './VCascader'
  import dio from '../uploader/dio'
  import MarkdownEditor from '../markdown/MarkdownEditor'

  export default {
    name: 'CascaderExample',
    components: {
      MarkdownEditor,
      VCascader,
    },
    created () {
      this.getMarkdown()
    },
    data: function () {
      return {
        disabled: false,
        clearable: false,
        dense: true,
        outlined: true,
        returnObject: false,
        labelStyle: false,
        showAllLevels: true,
        changeOnSelect: true,
        result: [],
        usageMarkdown:undefined,
        options: [
          {
            value: 'zhinan',
            label: '指南',
            children: [
              {
                value: 'shejiyuanze',
                label: '设计原则',
                children: [
                  {
                    value: 'yizhi',
                    label: '一致',
                  }, {
                    value: 'fankui',
                    label: '反馈',
                  }, {
                    value: 'xiaolv',
                    label: '效率',
                  }, {
                    value: 'kekong',
                    label: '可控',
                    disabled: true,
                  }],
              }, {
                value: 'daohang',
                label: '导航',
                children: [
                  {
                    value: 'cexiangdaohang',
                    label: '侧向导航',
                  }, {
                    value: 'dingbudaohang',
                    label: '顶部导航',
                  }],
              }],
          }, {
            value: 'zujian',
            label: '组件',
            children: [
              {
                value: 'basic',
                label: 'Basic',
                children: [
                  {
                    value: 'layout',
                    label: 'Layout 布局',
                  }, {
                    value: 'color',
                    label: 'Color 色彩',
                  }, {
                    value: 'typography',
                    label: 'Typography 字体',
                  }, {
                    value: 'icon',
                    label: 'Icon 图标',
                  }, {
                    value: 'button',
                    label: 'Button 按钮',
                  }],
              }, {
                value: 'form',
                label: 'Form',
                children: [
                  {
                    value: 'radio',
                    label: 'Radio 单选框',
                  }, {
                    value: 'checkbox',
                    label: 'Checkbox 多选框',
                  }, {
                    value: 'input',
                    label: 'Input 输入框',
                  }, {
                    value: 'input-number',
                    label: 'InputNumber 计数器',
                  }, {
                    value: 'select',
                    label: 'Select 选择器',
                  }, {
                    value: 'cascader',
                    label: 'Cascader 级联选择器',
                  }, {
                    value: 'switch',
                    label: 'Switch 开关',
                  }, {
                    value: 'slider',
                    label: 'Slider 滑块',
                  }, {
                    value: 'time-picker',
                    label: 'TimePicker 时间选择器',
                  }, {
                    value: 'date-picker',
                    label: 'DatePicker 日期选择器',
                  }, {
                    value: 'datetime-picker',
                    label: 'DateTimePicker 日期时间选择器',
                  }, {
                    value: 'upload',
                    label: 'Upload 上传',
                  }, {
                    value: 'rate',
                    label: 'Rate 评分',
                  }, {
                    value: 'form',
                    label: 'Form 表单',
                  }],
              }, {
                value: 'data',
                label: 'Data',
                children: [
                  {
                    value: 'table',
                    label: 'Table 表格',
                  }, {
                    value: 'tag',
                    label: 'Tag 标签',
                  }, {
                    value: 'progress',
                    label: 'Progress 进度条',
                  }, {
                    value: 'tree',
                    label: 'Tree 树形控件',
                  }, {
                    value: 'pagination',
                    label: 'Pagination 分页',
                  }, {
                    value: 'badge',
                    label: 'Badge 标记',
                  }],
              }, {
                value: 'notice',
                label: 'Notice',
                children: [
                  {
                    value: 'alert',
                    label: 'Alert 警告',
                  }, {
                    value: 'loading',
                    label: 'Loading 加载',
                  }, {
                    value: 'message',
                    label: 'Message 消息提示',
                  }, {
                    value: 'message-box',
                    label: 'MessageBox 弹框',
                  }, {
                    value: 'notification',
                    label: 'Notification 通知',
                  }],
              }, {
                value: 'navigation',
                label: 'Navigation',
                children: [
                  {
                    value: 'menu',
                    label: 'NavMenu 导航菜单',
                  }, {
                    value: 'tabs',
                    label: 'Tabs 标签页',
                  }, {
                    value: 'breadcrumb',
                    label: 'Breadcrumb 面包屑',
                  }, {
                    value: 'dropdown',
                    label: 'Dropdown 下拉菜单',
                  }, {
                    value: 'steps',
                    label: 'Steps 步骤条',
                  }],
              }, {
                value: 'others',
                label: 'Others',
                children: [
                  {
                    value: 'dialog',
                    label: 'Dialog 对话框',
                  }, {
                    value: 'tooltip',
                    label: 'Tooltip 文字提示',
                  }, {
                    value: 'popover',
                    label: 'Popover 弹出框',
                  }, {
                    value: 'card',
                    label: 'Card 卡片',
                  }, {
                    value: 'carousel',
                    label: 'Carousel 走马灯',
                  }, {
                    value: 'collapse',
                    label: 'Collapse 折叠面板',
                  }],
              }],
          }, {
            value: 'ziyuan',
            label: '资源',
            disabled: true,
            children: [
              {
                value: 'axure',
                label: 'Axure Components',
              }, {
                value: 'sketch',
                label: 'Sketch Templates',
              }, {
                value: 'jiaohu',
                label: '组件交互文档',
              }],
          }],
        code: '<v-cascader\n' +
          '                       :options="options"\n' +
          '                       v-model="result"\n' +
          '                       :disabled="disabled"\n' +
          '                       :clearable="clearable"\n' +
          '                       :dense="dense"\n' +
          '                       :return-object="returnObject"\n' +
          '                       placeholder="选择一个"\n' +
          '                       :label-style="labelStyle?{\n' +
          '                                     color:\'grey\',\n' +
          '                                     \'font-size\':\'large\'\n' +
          '                                   }:{}"\n' +
          '                       :change-on-select="changeOnSelect"\n' +
          '                       :show-all-levels="showAllLevels"\n' +
          '                       @changeCascadeResult="onChangeItem"\n' +
           '                    >\n' +
           '                    </v-cascader>',
      }
    },
    methods: {
      onChangeItem: function () {
        console.log('触发了changeCascadeResult')
      },
      getMarkdown: async function () {
        this.usageMarkdown = await dio.downloadLocal('/markdown/cascader-usage.md')
      }
    },
  }
</script>

<style scoped>

</style>
