<script>
  import FileInfo from './FileInfo'

  export default {
    name: 'ImageFileMixin',
    methods:{
      isImage: function (image) {
        if('string' != typeof image){
          return false
        }
        if(!image){
          return  false
        }
        image = image.toLowerCase()
        return image.indexOf('.jpg') >= 0
          || image.indexOf('.png') >= 0
          || image.indexOf('.jpeg') >= 0
          || image.indexOf('.gif') >= 0
          || image.indexOf('.bmp') >= 0
      },

      //默认上传方法
      upload: async function (file,options) {
        let formData = new FormData()
        formData.append(options.formDataName, file)
        try {
          let res = await this.$remote.upload({
            formData: formData,
            url: options.uploadUrl,
          })
          return new FileInfo(
            res.Data.filePath,
            res.Data.filePath,
            res.Data.filePath,
          )
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
          throw e
        }
      },
      isFileInfo: function (fileInfo) {
        return fileInfo instanceof FileInfo || ( fileInfo.name && fileInfo.path && fileInfo.url)
      },
    }
  }
</script>
