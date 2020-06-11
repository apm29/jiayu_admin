<script>
  export default {
    name: 'FileBrowserMixin',
    data: function () {
      return {
        //文件
        files: [],
        //文件夹
        directories: [],
        //当前文件夹
        currentDirectory: 'images/',
        //已选择
        selected: undefined,
        //历史记录栈
        dirStack: [],
        showOverlay: false,
        loading: false,
      }
    },
    methods: {

      //后退
      backward: function () {
        this.selected = undefined
        this.currentDirectory = this.dirStack.pop()
        this.getDirectoryInfo()
      },

      //加载文件夹
      loadNextDir: function (dir) {
        this.dirStack.push(this.currentDirectory)
        this.currentDirectory = dir
        this.selected = undefined
        this.getDirectoryInfo()
      },

      getDirectoryInfo: async function () {
        try {
          this.loading = true
          let res = await this.$remote.post({
            url: '/files/list',
            hide:!this.showOverlay,
            data: {
              dirName: this.currentDirectory,
            },
          })
          this.files = res.Data.files
          this.directories = res.Data.directories
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      },

      //TODO 批量删除
      deleteSelectedFile: async function () {
        try {
          this.loading = true
          console.log(this.selected)
          for (const path of this.selected) {
            let res = await this.$remote.post({
              url: '/files/delete',
              hide:!this.showOverlay,
              data: {
                name: path,
              },
            })
            this.$notify({
              text: res.Msg,
              type: 'success',
            })
          }
          this.selected = undefined
          await this.getDirectoryInfo()
        } catch (e) {
          console.log(e)
          this.$notify({
            text: e,
            type: 'error',
          })
        }finally {
          this.loading = false
        }
      },
      createDir: async function (newDirName) {
        try {
          this.loading = true
          let res = await this.$remote.post({
            url: '/files/createDir',
            hide:!this.showOverlay,
            data: {
              dirName: this.currentDirectory + newDirName + '/',
            },
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
          this.newDirName = undefined
          this.showCreatNewDirDialog = false
          await this.getDirectoryInfo()
        } catch (e) {
          console.log(e)
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.loading = false
        }
      },

    },
  }
</script>
