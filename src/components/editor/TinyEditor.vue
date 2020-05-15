<template>
    <div>
        <editor
                v-if="show"
                v-model="text"
                :disabled="disabled"
                :init="settings"
        >
        </editor>
        <v-bottom-sheet v-model="showDrawer" scrollable inset style="position: absolute;z-index: 999999">
            <v-file-browser @file-selected="fileSelectedCallback"></v-file-browser>
        </v-bottom-sheet>
    </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
  import VFileBrowser from '@/components/file/VFileBrowser'

  export default {
    name: 'TinyEditor', components: {
      VFileBrowser,
      Editor,
    },
    props: {
      value: {
        type: String,
        default: '',
      },
      disabled: Boolean,
    },
    modal: {
      event: 'input',
    },
    mounted () {
    },
    data: function () {
      return {
        text: this.value,
        show: true,
        showDrawer: false,
        settings: {
          height: 500,
          plugins: [
            'advlist anchor autolink autosave code codesample  directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount',
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen',
          ],
          language: 'zh_CN',
          skin_url: this.$store.state.app.dark ? './tinymce/skins/ui/oxide-dark' : './tinymce/skins/ui/oxide',
          content_css: this.$store.state.app.dark ? 'dark' : 'writer',
          images_upload_handler: this.upload,
          file_picker_types: 'image',//'file image media',
          file_picker_callback: this.showFileBrowser,
        },
        callback: undefined,
      }
    },
    watch: {
      '$store.state.app.dark': {
        immediate: true,
        handler: function (val) {
          this.settings.skin_url = val ? './tinymce/skins/ui/oxide-dark' : './tinymce/skins/ui/oxide'
          this.settings.content_css = val ? 'dark' : 'writer'
          this.show = false
          this.$nextTick(() => {
            this.show = true
          })
        },
      },
      text: {
        immediate: true,
        handler: function (val) {
          this.$emit('input', val)
        },
      },
      value: {
        immediate: true,
        handler: function (val) {
          this.text = val
          this.$forceUpdate()
        },
      },
    },
    methods: {
      upload: function (blobInfo, success, failure) {
        let formData = new FormData()
        formData.append('file', blobInfo.blob())
        this.$remote.upload({
          formData: formData,
          url: '/files/upload',
        }).then((res) => {
          success(this.$path + res.Data.filePath)
        }).catch((e) => {
          this.$notify({
            text: e,
            type: 'error',
          })
          failure(e)
        })
      },
      showFileBrowser: function (callback, value, meta) {
        // 打开文件浏览对话框
        this.showDrawer = true
        this.callback = callback
      },
      fileSelectedCallback: function (data) {
        this.showDrawer = false
        this.callback(this.$path + data)
      },
    },
  }
</script>

<style scoped>

</style>
