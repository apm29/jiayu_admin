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
                <v-btn text @click="doSelectLocalFile">
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
                    <v-list tile class="pl-3">
                        <!--文件夹-->
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
                        <!--文件-->
                        <v-list-item-group
                                v-model="selected"
                                :multiple="!single"
                                active-class="grey--text"
                        >
                            <v-list-item
                                    v-for="(file,index) of files.filter(e=>!e.endsWith('/'))"
                                    :key="index+'file'"
                                    :value="file"
                                    @click="chooseFile(file)"
                            >
                                <v-list-item-icon>
                                    <v-icon v-if="!isImage(file)" large>mdi-file-image</v-icon>
                                    <v-img v-else :src="$path+file+$thumbnail"></v-img>
                                </v-list-item-icon>
                                <v-list-item-title>
                                    {{file.slice(file.indexOf(currentDirectory)+currentDirectory.length)}}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-col>
                <v-col
                        :cols="6"
                        v-if="selectedFileInfos&&selectedFileInfos.length>0"
                        class="pa-0"
                >
                    <div class="d-flex flex-row flex-wrap">
                        <template v-for="(file,index) of selectedFileInfos">
                            <v-img
                                    v-if="isImage(file.url)"
                                    :src="file.url"
                                    contain
                                    width="120px"
                                    class="flex-grow-0"
                                    :aspect-ratio="1"
                                    :key="index"
                            >
                                {{file.name}}
                            </v-img>
                            <div v-else style="width: 120px" class="flex-grow-0" :key="index">
                                {{file.name}}
                            </div>
                        </template>
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
                        <v-btn @click="createNewDir">确定</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</template>

<script>
  import FileBrowserMixin from '@/components/file/FileBrowserMixin'
  import FileMixin from '@/components/file/FileMixin'
  import FileInfo from '@/components/file/FileInfo'

  const fileInputElementId = '$file-input-ele'
  export default {
    name: 'VFileBrowser',
    props: {
      value: String | Array,

      single: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [
      FileBrowserMixin, FileMixin,
    ],
    model: {
      prop: 'value',
      event: 'file-selected',
    },
    data: function () {
      return {
        showCreatNewDirDialog: false,
        newDirName: undefined,
      }
    },
    computed: {
      selectedFileInfos: function () {
        let current = this.selected
        if (this.single) {
          current = current ? [current] : []
        } else {
          current = current ? current : []
        }
        let directory = this.currentDirectory
        return current.map(p => {
          return new FileInfo(
            p, this.$path + p, p.slice(p.indexOf(directory) + directory.length),
          )
        })
      },
    },

    mounted () {
      this.getDirectoryInfo()
    },
    methods: {
      createNewDir: function () {
        this.createDir(this.newDirName)
      },
      chooseFile: function (file) {
        this.selected = file
      },
      chooseImage: function () {
        this.$emit('file-selected', this.selectedFileInfos)
      },
      //本地文件已选择
      onFileAdded: async function () {
        try {
          let files = document.getElementById(fileInputElementId).files
          console.log(files)
          let tempFileArr = []
          for (let i = 0; i < files.length; i++) {
            tempFileArr.push(files[i])
          }
          if (this.single) {
            tempFileArr = tempFileArr.slice(0, 1)
          }
          for (const tempFile of tempFileArr) {
            await this.uploadFileInDir(tempFile, this.currentDirectory)
          }
          await this.getDirectoryInfo()
        } catch (e) {
          error(e)
        } finally {
          document.getElementById(fileInputElementId).remove()
        }
      },
      //选择本地文件
      doSelectLocalFile: function () {
        try {
          //<input :accept="accept" :ref="_uid+'input'" type="file" v-show="false"/>
          let inputElement = document.createElement('input')
          inputElement.accept = this.accept
          inputElement.type = 'file'
          inputElement.style = {
            visibility: 'invisible',
          }
          if (!this.single) {
            inputElement.multiple = true
          }
          inputElement.id = fileInputElementId
          inputElement.addEventListener('change', this.onFileAdded)
          document.body.append(inputElement)
          inputElement.click()
        } catch (e) {
          error(e)
        } finally {
        }
      },

      uploadFileInDir: async function (file,dir) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('fileDir',dir)
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
