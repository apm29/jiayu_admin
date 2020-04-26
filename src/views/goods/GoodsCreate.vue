<template>
    <v-card class="fill-height d-flex flex-column">
        <editor
                v-if="show"
                :init="settings"
        />
    </v-card>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'

  export default {
    name: 'GoodsCreate',
    components: {
      Editor
    },
    data: function () {
      return {
        show: true,
        settings: {
          height: 500,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
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
      }
    }
  }
</script>

<style scoped>

</style>
