<template>
    <v-container fluid class="fill-height d-flex flex-column">
        <div class="flex-grow-1 overflow-y-auto overflow-x-hidden" style="width: 100%">
            <v-row justify="space-around">
                <v-switch inset v-model="disabled" class="ma-2" label="Disabled"></v-switch>
                <v-switch inset v-model="grid" class="ma-2" label="Grid"></v-switch>
                <v-switch inset v-model="single" class="ma-2" label="Single"></v-switch>
                <v-switch inset v-model="flatList" class="ma-2" label="FlatList"></v-switch>
                <v-col :cols="6">
                    <v-select hide-details dense v-model="gridCount" label="GirdCount" :items="items"
                              type="number"></v-select>
                </v-col>
            </v-row>
            <v-card class="my-3" outlined>
                <v-card-title
                        class="grey lighten-3"
                >
                    演示
                </v-card-title>
                <v-card-text>
                    <v-row align="center">
                        <v-col :cols="6">
                            <v-file-uploader
                                    :grid="grid"
                                    :grid-count="gridCount"
                                    :disabled="disabled"
                                    v-model="result"
                                    :flat-list="flatList"
                                    :line-height="grid?150:80"
                                    :limit="9"
                                    :single="single"
                                    :upload="upload"
                                    file-value="filePath"
                                    file-name="fileName"
                                    file-base-url="http://axj.ciih.net/"
                            >
                            </v-file-uploader>
                        </v-col>
                        <v-col :cols="6">
                            值:{{result}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-text>
                    <markdown-editor preview :value="designMarkdown"></markdown-editor>
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
                        <li>value：已选项目的数据，Array|Object类型，默认值 []；支持v-model用法,single时为Object</li>
                        <li>disable：是否禁用，Boolean类型，默认值 false；</li>
                        <li>fileValue 指定upload返回的数据Object的相对路径为某个属性值 String类型 默认值 key</li>
                        <li>fileName 指定upload返回的数据Object的文件名为某个属性值 String类型 默认值 file_name</li>
                        <li>fileBaseUrl 指定图片url的host部分 String类型 默认值 http://files.ciih.net/</li>
                        <li>placeholder 添加按钮的placeholder String类型</li>
                        <li>single：单文件选择，Boolean类型，默认值 false；</li>
                        <li>grid： 网格显示，Boolean类型，默认值 false；</li>
                        <li>limit： 限制数量，Number类型，默认值 Number.MAX_VALUE；</li>
                        <li>gridCount： 网格column数量，必须为12的约数 Number类型，默认值 3；</li>
                        <li>lineHeight： 网格/列表 高度，Number类型，默认值 150；</li>
                        <li>accept 指定接收的文件类型 String类型 默认值 .doc,.docx,.xls,.xlsx,.pdf,image/*,video/*,audio/*</li>
                        <li>upload 指定上传文件方法,异步返回一个Object,需要含有fileValue,fileName这两个props定义好的字段 Function类型 默认值
                            .doc,.docx,.xls,.xlsx,.pdf,image/*,video/*,audio/*
                        </li>
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
                        <li>onFileValueChange：已选项变化时触发,参数为改变后的value；</li>
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
                        <li>trigger：自定义触发器；{addFile}为slot的prop,类型为Function</li>
                    </ol>
                </v-card-text>
            </v-card>
            <v-card
                    outlined
                    class="my-3"
            >
                <v-card-text>
                  <markdown-editor :value="usageMarkdown" preview></markdown-editor>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script>
  import VFileUploader from './VFileUploader'
  import dio from './dio'
  import MarkdownEditor from '../markdown/MarkdownEditor'

  export default {
    name: 'FileUploaderExample',
    components: { MarkdownEditor,  VFileUploader },
    data: function () {
      return {
        gridCount: 3,
        result: [
          { 'fileName': '457-1080x1920.jpg', 'filePath': '/M00/3D/1E/CktAN16X8fyACgpSAABoHnYa10E783.jpg' },
          { 'fileName': '334-1920x1080.jpg', 'filePath': '/M00/3D/1E/CktAN16X8f6AMDCUAAEqr19_fnY573.jpg' },
          { 'fileName': '417-1920x1080.jpg', 'filePath': '/M00/3D/1E/CktAN16X8gCALRy5AAOb1ZYsO5g260.jpg' }],
        disabled: false,
        items: [
          {
            text: '1',
            value: 1,
          },
          {
            text: '2',
            value: 2,
          },
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '6',
            value: 6,
          },
        ],
        grid: false,
        single: false,
        flatList: false,
        designMarkdown:undefined,
        usageMarkdown:undefined,
      }
    },
    created () {
      this.getMarkdown()
    },
    methods: {
      upload: async function (file) {
        let formData = new FormData()
        formData.append('file', file)
        this.$cookies.set('token', this.token)
        let res = await dio.upload({
          formData: formData,
          url: '/business/upload/uploadFile',
        })
        return {
          fileName: file.name,
          filePath: new URL(res.data.filePath).pathname,
        }
      },
      getMarkdown: async function () {
        this.designMarkdown = await dio.downloadLocal('/markdown/file-uploader.md')
        this.usageMarkdown = await dio.downloadLocal('/markdown/file-uploader-usage.md')
      }
    },
  }
</script>

<style scoped>

</style>
