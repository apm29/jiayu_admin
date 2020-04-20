<template>
    <v-container fluid class="fill-height d-flex flex-column">
        <div class="flex-grow-1 overflow-y-auto overflow-x-hidden" style="width: 100%">
            <v-card  outlined
                     class="my-3">
                <v-card-title
                        class="grey lighten-3"
                >
                    Markdown测试
                </v-card-title>
                <v-card-text>
                    <v-switch v-model="preview" inset class="ma-2" :label="preview?'预览':'编辑'">
                    </v-switch>
                    <markdown-editor :preview="preview" v-model="markdown"></markdown-editor>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script>
  import dio from '../uploader/dio'
  import MarkdownEditor from '../markdown/MarkdownEditor'

  export default {
    name: 'FileUploaderExample',
    components: { MarkdownEditor },
    created () {
      this.getMarkdown()
    },
    data: function () {
      return {
        preview: false,
        markdown: undefined,
      }
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
        this.markdown = await dio.downloadLocal('/readme.md')
      }
    },
  }
</script>

<style scoped>

</style>
