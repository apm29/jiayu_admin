<template>
    <editor
            v-if="show"
            v-model="text"
            :disabled="disabled"
            :init="settings"
    />
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
  export default {
    name: 'TinyEditor',components: {
      Editor
    },
    props:{
      value:{
        type:String,
        default:''
      },
      disabled: Boolean
    },
    modal:{
      event: 'input',
    },
    data: function () {
      return {
        text:this.value,
        show: true,
        settings: {
          height: 500,
          plugins: [
            'advlist anchor autolink autosave code codesample  directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount'
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
          ],
          language: 'zh_CN',
          skin_url: this.$store.state.app.dark ? './tinymce/skins/ui/oxide-dark' : './tinymce/skins/ui/oxide',
          content_css: this.$store.state.app.dark ? 'dark' : 'writer',
          images_upload_handler: this.upload
        }
      }
    },
    watch: {
      '$store.state.app.dark': {
        immediate: true,
        handler: function (val) {
          this.settings.skin_url = val ?  './tinymce/skins/ui/oxide-dark' : './tinymce/skins/ui/oxide'
          this.settings.content_css = val ? 'dark' : 'writer'
          this.show = false
          this.$nextTick(() => {
            this.show = true
          })
        }
      },
      text:{
        immediate:true,
        deep:true,
        handler:function (val) {
          this.$emit('input',val)
        }
      }
    },
    methods: {
      upload: function (blobInfo, success, failure) {
        let formData = new FormData()
        formData.append('file', blobInfo.blob())
        this.$remote.upload({
          formData: formData,
          url: '/files/upload',
        }).then((res) => {
          success('http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/'+res.Data.filePath)
        }).catch((e) => {
          this.$notify({
            text: e,
            type: 'error',
          })
          failure(e)
        })
      },
    }
  }
</script>

<style scoped>

</style>
