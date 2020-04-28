<template>
    <div>
        <form :ref="_uid+'form'">
            <input @change="onFileAdded" :accept="accept" :ref="_uid+'input'" type="file" v-show="false"/>
        </form>
        <slot name="trigger" :addFile="onAddFileClick">
            <v-btn
                    color="info"
                    small
                    @click="onAddFileClick"
                    v-if="!grid"
                    :disabled="disabled || uploadResults.length>=limit"
                    :loading="loading"
            >
                {{placeholder}}
            </v-btn>
            <div class="mt-3 grey--text subtitle-1">{{hint||'支持上传word文档,excel表格,pdf文件以及视频,图片'}}</div>
        </slot>
        <v-progress-linear
                indeterminate
                color="primary"
                v-show="loading"
        ></v-progress-linear>
        <v-list :loading="loading" v-if="!grid">
            <v-card
                    class="mt-1" v-for="(fileUploadResult,index) of uploadResults"
                    :key="index"
                    :flat="flatList"
                    :outlined="flatList"
            >
                <v-list-item class="px-0">
                    <v-img
                            v-if="isImage(fileUploadResult[fileValue])"
                            :src="fileBaseUrl+fileUploadResult[fileValue]"
                            :max-width="lineHeight"
                            :height="lineHeight"
                            class="grey lighten-2"
                            @click="previewImage(fileUploadResult)"
                            style="border-bottom-left-radius: inherit;border-top-left-radius: inherit;"
                    >
                        <template v-slot:placeholder>
                            <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                    <v-icon
                            dark
                            v-else
                            x-large
                            :style="{width: `${lineHeight}px`,height:`${lineHeight}px`,'border-bottom-left-radius': 'inherit','border-top-left-radius': 'inherit'}"
                            class="grey"
                    >
                        mdi-file
                    </v-icon>
                    <v-list-item-content>
                        <v-list-item-title class="ml-3">{{fileUploadResult[fileName]}}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click="onDeleteClick(fileUploadResult,index)" :disabled="disabled">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card>
        </v-list>
        <div v-else>
            <v-row>
                <v-col
                        v-for="(fileUploadResult, i) of uploadResults"
                        :key="i"
                        :cols="12/gridCount"
                >
                    <div>
                        <v-img
                                v-if="isImage(fileUploadResult[fileValue])"
                                :src="fileBaseUrl+fileUploadResult[fileValue]"
                                :height="lineHeight"
                                width="100%"
                                class="text-right pa-2 grey lighten-2"
                                @click="previewImage(fileUploadResult)"

                        >
                            <template v-slot:placeholder>
                                <v-row
                                        class="fill-height ma-0"
                                        align="center"
                                        justify="center"
                                >
                                    <v-progress-circular indeterminate
                                                         color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                            <v-btn
                                    icon
                                    dark
                                    @click.stop="onDeleteClick(fileUploadResult,i)"
                                    :disabled="disabled"
                            >
                                <v-icon :class="{'shadow-icon':!disabled}">
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-img>
                        <div class="d-flex align-center justify-center pa-2 grey lighten-2 fill-height"
                             :style="{width: '100%',height:`${lineHeight}px`,position:'relative'}" v-else>
                            <v-btn
                                    icon
                                    dark
                                    @click.stop="onDeleteClick(fileUploadResult,i)"
                                    :disabled="disabled"
                                    style="position: absolute;right: 5%;top:5%"
                            >
                                <v-icon>
                                    mdi-delete-outline
                                </v-icon>
                            </v-btn>
                            <v-icon x-large>mdi-file</v-icon>
                        </div>
                        <div class="subtitle-2 text-no-wrap d-inline-block text-truncate" style="width: 100%">
                            {{fileUploadResult[fileName]}}
                        </div>
                    </div>
                </v-col>
                <v-col
                        v-if="showAdd"
                        :cols="12/gridCount"
                >
                    <div
                            class="pa-2 grey d-flex flex-row justify-center fill-height text-center align-center lighten-2"
                            :style="{height: lineHeight+'px'}"
                            @click="onAddFileClick"
                            v-ripple
                    >
                        <v-icon large dark>
                            mdi-plus
                        </v-icon>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-dialog fullscreen v-model="showPreviewDialog">
            <v-img
                    :src="preview"
                    class="fill-height text-righ grey lighten-2"
                    width="100%"
                    @click="showPreviewDialog = false"
                    contain
            >
                <template v-slot:placeholder>
                    <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                    >
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                </template>
                <v-btn color="white" @click="showPreviewDialog = false"
                       class="ma-3">
                    {{previewName}}
                </v-btn>
            </v-img>
        </v-dialog>
    </div>
</template>

<script>
  export default {
    name: 'VFileUploader',
    props: {
      placeholder: {
        type: String,
        default: '点击选择文件',
      },
      hint: {
        type: String,
        default: '上传图片',
      },
      result: {
        default: function () {
          return undefined
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      produceOnlyPath: {
        type: Boolean,
        default: false,
      },
      acceptOnlyPath: {
        type: Boolean,
        default: false,
      },
      flatList: {
        type: Boolean,
        default: false,
      },
      single: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: Number.MAX_VALUE,
      },
      grid: {
        type: Boolean,
        default: false,
      },
      gridCount: {
        type: Number,
        default: 3,
      },
      lineHeight: {
        type: Number,
        default: 150,
      },
      gridAddBtn: {
        type: Boolean,
        default: true,
      },
      accept: {
        type: String,
        default: '.doc,.docx,.xls,.xlsx,.pdf,image/*,video/*,audio/*',
      },
      upload: {
        type: Function,
        default: async function (file) {
          let formData = new FormData()
          formData.append('file', file)
          try {
            let res = await this.$remote.upload({
              formData: formData,
              url: '/files/upload',
            })
            return res.Data.filePath
          } catch (e) {
            this.$notify({
              text: e,
              type: 'error',
            })
          }
        },
      },
      fileName: {
        type: String,
        default: 'fileName',
      },
      fileValue: {
        type: String,
        default: 'filePath',
      },
      fileBaseUrl: {
        type: String,
        default: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
      },
    }
    ,
    model: {
      prop: 'result',
      event: 'onFileValueChange',
    },
    mounted () {
    },
    watch: {
      result: {
        deep: true,
        immediate: true,
        handler: function (val) {
          this.uploadResults = []
          if (val) {
            if (this.single) {
              if (this.acceptOnlyPath) {
                let item = {}
                item[this.fileName] = val
                item[this.fileValue] = val
                this.uploadResults.push(item)
              } else {
                this.uploadResults.push(val)
              }
            } else {
              if (this.acceptOnlyPath) {
                val.forEach(path => {
                  let item = {}
                  item[this.fileName] = path
                  item[this.fileValue] = path
                  this.uploadResults.push(item)
                })
              } else {
                this.uploadResults = this.uploadResults.concat(val)
              }
            }
          }
        },

      },
      single: {
        handler: function (val) {
          if (val && this.uploadResults.length > 1) {
            this.uploadResults = this.uploadResults.slice(0, 1)
          }
        },
      },
    },
    data: function () {
      return {
        loading: false,
        showPreviewDialog: false,
        uploadResults: [],
        preview: undefined,
        previewName: undefined,
      }
    },
    computed: {
      showAdd: function () {
        if (this.disabled) {
          return false
        }
        if (this.uploadResults.length < this.limit && !this.single && this.gridAddBtn) {
          return true
        }
        if (this.uploadResults.length >= this.limit) {
          return false
        }
        return !(this.single && this.uploadResults.length === 1)
      },
    },
    methods: {
      onFileAdded: function () {
        this.doUpload(this.$refs[this._uid + 'input'].files[0])
      },
      onAddFileClick: function (e) {
        this.$refs[this._uid + 'input'].click(e)
      },
      doUpload: async function (file) {
        try {
          this.loading = true
          let res = await this.upload(file)
          if (!this.acceptOnlyPath && res && res[this.fileName] && res[this.fileValue]) {
            if (this.single) {
              this.uploadResults = []
            }
            this.uploadResults.push(res)
          } else if (res) {
            //包装为{fileName:xxx,fileValue:xxx}
            if (this.single) {
              this.uploadResults = []
            }
            let item = {}
            item[this.fileName] = res
            item[this.fileValue] = res
            this.uploadResults.push(item)
          }
          let val = this.uploadResults
          if (!this.single) {
            if (this.produceOnlyPath) {
              this.$emit('onFileValueChange', val[this.fileValue])
            } else {
              this.$emit('onFileValueChange', val)
            }
          } else {
            if (val.length === 0) {
              this.$emit('onFileValueChange', undefined)
            } else {
              if (this.produceOnlyPath) {
                this.$emit('onFileValueChange', val[0][this.fileValue])
              } else {
                this.$emit('onFileValueChange', val[0])
              }
            }
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
          this.$refs[this._uid + 'form'].reset()
        }
      },
      onDeleteClick: function (fileResult, index) {
        this.uploadResults.splice(index, 1)
      },

      previewImage: function (fileUploadResult) {
        this.preview = this.fileBaseUrl + fileUploadResult[this.fileValue]
        this.previewName = fileUploadResult[this.fileName]
        this.showPreviewDialog = true
      },

      isImage: function (image) {
        if (!image) {
          return false
        }
        return image.indexOf('.jpg') >= 0
          || image.indexOf('.png') >= 0
          || image.indexOf('.jpeg') >= 0
          || image.indexOf('.gif') >= 0
          || image.indexOf('.bmp') >= 0
      },
    },
  }
</script>

<style scoped>
    .shadow-icon {
        text-shadow: 3px 2px 3px #6671AF;
    }
</style>
