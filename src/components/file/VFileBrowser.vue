<template>
    <v-card height="75vh" :loading="loading">
        <v-card-title>
            <v-subheader class="d-flex" style="width: 100%">
                <form :ref="_uid+'form'">
                    <input @change="onFileAdded" :ref="_uid+'input'" type="file" v-show="false"/>
                </form>
                <v-btn color="warning" text @click="showCreatNewDirDialog = true">
                    <v-icon>mdi-folder-plus-outline</v-icon>
                    新建文件夹
                </v-btn>
                <v-btn text @click="uploadFile">
                    <v-icon color="success">mdi-image-plus</v-icon>
                    上传图片
                </v-btn>
                <v-spacer class="flex-grow-1"/>
                <div class="title grey--text text--lighten-1 font-weight-light"
                     style="align-self: center;">
                    {{currentDirectory}}
                </div>
                <v-btn large icon color="info" @click="backward" v-if="dirStack.length>0">
                    <v-icon>mdi-keyboard-return</v-icon>
                </v-btn>
            </v-subheader>
        </v-card-title>
        <v-card-text>
            <v-row tile>
                <v-col :cols="6">
                    <v-list tile class="pl-3" >
                        <v-list-item
                                v-for="(directory,index) of directories"
                                :key="index+'dir'"
                                @click="loadNextDir(directory)"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-folder-open</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                {{directory.slice(directory.indexOf(currentDirectory)+currentDirectory.length)}}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                                :class="{
                                    grey:file === selected
                                }"
                                v-for="(file,index) of files.filter(e=>!e.endsWith('/'))"
                                :key="index+'file'"
                                @click="chooseFile(file)"
                        >
                            <v-list-item-icon>
                                <v-icon v-if="!isImage(file)" large>mdi-file-image</v-icon>
                                <v-img v-else :src="$path+file+$thumbnail"></v-img>
                            </v-list-item-icon>
                            <v-list-item-title>{{file.slice(file.indexOf(currentDirectory)+currentDirectory.length)}}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col
                        :cols="6"
                        v-if="selected"
                        class="pa-0"
                >
                    <div style="position: sticky;top: 0;" class="d-flex flex-column">
                        <v-img :src="$path+selected" contain width="100%" max-height="50vh" class="flex-grow-0">
                            {{selected}}
                        </v-img>
                        <div class="py-0 d-flex justify-end mt-3">
                            <v-btn color="error" small class="ml-3" @click="deleteSelectedFile">删除</v-btn>
                            <v-btn color="success" small class="ml-3" @click="chooseImage">选择</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-dialog v-model="showCreatNewDirDialog" width="40vw">
                <v-card>
                    <v-card-title>新建文件夹</v-card-title>
                    <v-card-text>
                        <v-text-field placeholder="文件夹名称" v-model="newDirName"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn @click="createDir">确定</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</template>

<script>
  export default {
    name: 'VFileBrowser',
    props:{
      value:String
    },
    model:{
      prop:'value',
      event:'file-selected'
    },
    data: function () {
      return {
        files: [],
        directories: [],
        currentDirectory: 'images/',
        selected: undefined,
        showCreatNewDirDialog: false,
        newDirName: undefined,
        dirStack: [],
        showOverlay: false,
        loading: false,
      }
    },

    mounted () {
      this.getDirectoryInfo()
    },
    methods: {
      isImage: function (image) {
        if (!image) {
          return false
        }
        let imageLower = image.toLowerCase()
        return imageLower.indexOf('.jpg') >= 0
          || imageLower.indexOf('.png') >= 0
          || imageLower.indexOf('.jpeg') >= 0
          || imageLower.indexOf('.bmp') >= 0
      },
      chooseFile: function (file) {
        this.selected = file
      },
      backward: function () {
        this.selected = undefined
        this.currentDirectory = this.dirStack.pop()
        this.getDirectoryInfo()
      },
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
      deleteSelectedFile: async function () {
        try {
          this.loading = true
          let res = await this.$remote.post({
            url: '/files/delete',
            hide:!this.showOverlay,
            data: {
              name: this.selected,
            },
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
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
      createDir: async function () {
        try {
          this.loading = true
          let res = await this.$remote.post({
            url: '/files/createDir',
            hide:!this.showOverlay,
            data: {
              dirName: this.currentDirectory + this.newDirName + '/',
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
      uploadFile: function (e) {
        this.$refs[this._uid + 'input'].click(e)
      },
      onFileAdded: async function () {
        let file = this.$refs[this._uid + 'input'].files[0]
        await this.upload(file)
        await this.getDirectoryInfo()
      },
      chooseImage:function(){
        this.$emit("file-selected",this.selected)
      },

      upload: async function (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('fileDir', this.currentDirectory)
        try {
          this.loading = true
          let res = await this.$remote.upload({
            formData: formData,
            url: '/files/upload',
          })
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
        } catch (e) {
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

<style scoped>

</style>
