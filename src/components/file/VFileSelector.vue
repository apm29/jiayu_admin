<template>
    <v-row align="start">
        <v-progress-linear
                indeterminate
                color="primary"
                v-show="uploadingFiles"
        ></v-progress-linear>
        <v-col
                v-for="(fileInfo, i) of fileInfoList"
                :key="i"
                :cols="4"
        >
            <div>
                <v-img
                        v-if="isImage(fileInfo.url)"
                        :src="fileInfo.url"
                        width="100%"
                        :aspect-ratio="1"
                        class="text-right pa-2 grey lighten-2"
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
                            :disabled="disabled"
                            @click.stop="doDeleteFileInfo(fileInfo)"
                    >
                        <v-icon :class="{'shadow-icon':!disabled}">
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-img>
                <v-responsive :aspect-ratio="1" v-else>
                    <div class="d-flex align-center justify-center pa-2 grey lighten-2 fill-height"
                         :style="{width: '100%',height:'100%',position:'relative'}">
                        <v-btn
                                icon
                                dark
                                :disabled="disabled"
                                style="position: absolute;right: 5%;top:5%"
                                @click.stop="doDeleteFileInfo(fileInfo)"
                        >
                            <v-icon :class="{'shadow-icon':!disabled}">
                                mdi-delete-outline
                            </v-icon>
                        </v-btn>
                        <v-icon x-large>mdi-file</v-icon>
                    </div>
                </v-responsive>
                <div class="subtitle-2 text-no-wrap d-inline-block text-truncate" style="width: 100%">
                    {{fileInfo.name}}
                </div>
            </div>
        </v-col>
        <v-col
                v-if="showAdd"
                :cols="4"
        >
            <v-responsive :aspect-ratio="1">
                <div
                        class="pa-2 grey d-flex flex-row justify-center fill-height text-center align-center lighten-2"
                        style="height:100%"
                        @click="onAddFileClick"
                        v-ripple
                >
                    <v-icon large dark>
                        mdi-plus
                    </v-icon>
                </div>
            </v-responsive>
        </v-col>
    </v-row>
</template>

<script>
  //标准的文件信息返回值
  let fileInfoTemplate = {
    path: '/xxx/xxx',
    url: 'http://xxxx.xx/xxx/xxx',
    name: 'xxx',
  }
  //1.返回格式
  //    return-path     ----> 返回 path
  //    return-object   ----> 返回整个FileInfo
  //    return-url      ----> 返回 url
  let returnTypes = [
    'path', 'url', 'object',
  ]

  //2.上传接口
  //    local. 普通上传,使用组件内的input标签
  //    custom. 使用其他方式上传文件,例如wx本地文件接口
  //    fileManager. 使用文件管理器方式,直接选择需要的文件
  let uploadTypes = [
    'local', 'custom', 'fileManager',
  ]
  const fileInputElementId = '$file-input-ele'
  import ImageFileMixin from './FileMixin'
  //标准的文件信息返回值
  import FileInfo from './FileInfo'

  //value转化流程:
  //fileInfoList:  Object/String/Array -> Array[FileInfo]
  //template中统一使用FileInfo来render
  //返回值 emitResult: Array[FileInfo] -> 根据returnType返回对应类型
  export default {
    name: 'VFileSelector',
    mixins: [
      ImageFileMixin,
    ],
    props: {
      value: {
        type: Array | FileInfo | String,
        validator: function (val) {
          let isArray = val instanceof Array
          let isObject = val instanceof FileInfo
          let isString = val instanceof String || 'string' === typeof val
          let valid = isArray || isObject || isString
          if (!valid) {
            process.env.NODE_ENV !== 'production' &&
            console.warn(`value must be Array ,Object or String`)
          }
          return valid
        },
      },

      accept: {
        type: String,
        default: '.doc,.docx,.xls,.xlsx,.pdf,image/*,video/*,audio/*',
      },

      fileName: {
        type: String,
        default: 'fileName',
      },
      filePath: {
        type: String,
        default: 'filePath',
      },
      fileUrl: {
        type: String,
        default: 'fileUrl',
      },
      fileBaseUrl: {
        type: String,
        default: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
      },
      single: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      //file总个数限制,与single互斥,single为true时不生效
      limit: {
        type: Number,
        default: 9,
      },
      //returnType为path时需要指定fileBaseUrl用于显示图片等资源
      //returnObject 但未指定fileUrl时会尝试用fileBaseUrl+filePath拼接url
      returnType: {
        type: String,
        default: 'path',
        validator: function (val) {
          let valid = returnTypes.indexOf(val) >= 0
          if (!valid) {
            process.env.NODE_ENV !== 'production' &&
            console.warn(`return-type must in ${returnTypes}`)
          }
          return valid
        },
      },
      uploadType: {
        type: String,
        default: 'local',
        validator: function (val) {
          let valid = uploadTypes.indexOf(val) >= 0
          if (!valid) {
            process.env.NODE_ENV !== 'production' &&
            console.warn(`upload-type must in ${uploadTypes}`)
          }
          return valid
        },
      },
      //选择文件方法,上传类型为local时无需定义
      fileSelect: {
        type: Function,
        default: function (success, error) {
          if (this.localUploader) {
            this.doSelectLocalFile(success, error)
          }
        },
      },

      //文件上传配置,上传类型为local时有用
      uploadOptions: {
        type: Object,
        default: function () {
          return {
            //上传url
            uploadUrl: '/files/upload',
            //上传文件名
            formDataName: 'file',
            //上传方法,定义后将覆盖前面两个配置,接收一个File参数,返回一个FileInfo对象
            upload:undefined
          }
        },
      },
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler: function (val, oldVal) {
          if (oldVal !== val && !this.arrayEqual(val, oldVal)) {
            this.emitResult(this.fileInfoList)
          }
        },
      },
    },
    model: {
      prop: 'value',
      event: 'selected-file-change',
    },
    computed: {
      returnObject: function () {
        return this.returnType === 'object'
      },
      returnPath: function () {
        return this.returnType === 'path'
      },
      returnUrl: function () {
        return this.returnType === 'url'
      },

      localUploader: function () {
        return this.uploadType === 'local'
      },
      customUploader: function () {
        return this.uploadType === 'custom'
      },
      userFileManager: function () {
        return this.uploadType === 'fileManager'
      },

      ///在此处将value转为Array<FileInfo>
      fileInfoList: function () {
        let tempArray
        if (this.single) {
          //Single转Array
          tempArray = this.value ? [this.value] : []
        } else {
          tempArray = this.value
        }
        let returnObject = this.returnObject
        let returnPath = this.returnPath
        let returnUrl = this.returnUrl
        return tempArray.map(v => {
          if (returnObject) {
            return new FileInfo(
              v[this.filePath], v[this.fileUrl] || (this.fileBaseUrl + v[this.filePath]), v[this.fileName],
            )
          } else if (returnPath) {
            return new FileInfo(
              v, this.fileBaseUrl + v, v,
            )
          } else if (returnUrl) {
            return new FileInfo(
              v, v, v,
            )
          } else {
            throw Error('错误的返回类型')
          }
        })
      },
      //是否需要显示添加按钮
      showAdd: function () {
        if (this.disabled) {
          return false
        }
        if (this.fileInfoList.length === 0 && this.single) {
          return true
        }
        if (this.fileInfoList.length >= this.limit) {
          return false
        }
        return !(this.single && this.fileInfoList.length === 1)
      },
    },
    data: function () {
      return {
        uploadingFiles: false,
      }
    },
    created () {

    },
    methods: {
      //选择/上传文件部分
      onAddFileClick: async function () {
        try {
          if (this.localUploader) {
            //普通文件上传
            let files = await this.doSelectFileWrapper()
            let tempArray = [...this.fileInfoList]
            this.uploadingFiles = true
            for (const f of files) {
              let fileInfo = await this.upload(f, this.uploadOptions)
              tempArray.push(new FileInfo(
                fileInfo.path,
                fileInfo.url,
                fileInfo.name,
              ))
            }
            this.emitResult(tempArray)
          } else if(this.customUploader){
            //自定义文件选择/上传:如微信
            //在file-select返回一个Array[FileInfo]对象
            let files = await this.doSelectFileWrapper()
            let tempArray = [...this.fileInfoList]
            this.uploadingFiles = true
            for (const f of files) {
              tempArray.push(new FileInfo(
                f.path,
                f.url,
                f.name,
              ))
            }
            this.emitResult(tempArray)
          } else if(this.userFileManager){
            //使用文件管理器文件选择/上传
            //在file-select返回一个Array[FileInfo]对象
            let files = await this.doSelectFileWrapper()
            let tempArray = [...this.fileInfoList]
            this.uploadingFiles = true
            for (const f of files) {
              tempArray.push(new FileInfo(
                f.path,
                f.url,
                f.name,
              ))
            }
            this.emitResult(tempArray)
          } else{
            throw Error('未知的文件选择/上传方式')
          }
        }finally {
          this.uploadingFiles = false
        }
      },

      //将选择文件包装为Promise
      doSelectFileWrapper: function () {
        return new Promise((resolve, reject) => {
          let success = function (files) {
            console.log(files)
            resolve(files)
          }
          let error = function (err) {
            console.log(err)
            reject(err)
          }
          this.fileSelect(success, error)
        })
      },

      //选择本地文件
      doSelectLocalFile: function (success, error) {

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
          inputElement.addEventListener('change', () => this.onFileAdded(success, error))
          document.body.append(inputElement)
          inputElement.click()
        } catch (e) {
          error(e)
        } finally {
        }
      },
      //本地文件已选择
      onFileAdded: function (success, error) {
        try {
          let files = document.getElementById(fileInputElementId).files
          let tempFileArr = []
          for (let i = 0; i < files.length; i++) {
            tempFileArr.push(files[i])
          }
          if (this.single) {
            success(tempFileArr.slice(0, 1))
          } else {
            success(tempFileArr)
          }
        } catch (e) {
          error(e)
        } finally {
          document.getElementById(fileInputElementId).remove()
        }
      },

      //将Array<FileInfo>转为returnType/single对应的value类型
      emitResult: function (fileInfoList) {
        if (this.single) {
          let fileInfo = this.getSingleFileInfo(fileInfoList)
          let result = this.getReturnValueFromReturnType(fileInfo)
          this.$emit('selected-file-change', result)
        } else {
          let fileInfo = this.getArrayFileInfo(fileInfoList)
          let result = this.getReturnValueFromReturnType(fileInfo)
          this.$emit('selected-file-change', result)
        }
      },
      getSingleFileInfo: function (fileInfoList) {
        if (fileInfoList && fileInfoList.length === 1) {
          return fileInfoList[0]
        } else {
          return undefined
        }
      },
      getArrayFileInfo: function (fileInfoList) {
        if (fileInfoList && fileInfoList instanceof Array) {
          return [...fileInfoList]
        } else {
          return []
        }
      },

      getReturnValueFromReturnType: function (info) {
        let returnObject = this.returnObject
        let returnPath = this.returnPath
        let returnUrl = this.returnUrl
        if (!info) {
          return info
        }
        if (this.isFileInfo(info)) {
          if (returnObject) {
            let newTypeInfo = {}
            newTypeInfo[this.fileName] = info.name
            newTypeInfo[this.fileUrl] = info.url
            newTypeInfo[this.filePath] = info.path
            return newTypeInfo
          } else if (returnPath) {
            return info.path
          } else if (returnUrl) {
            return info.url
          } else {
            throw Error('错误的返回类型')
          }
        } else if (info instanceof Array) {
          if (returnObject) {
            return info.map(infoItem => {
              let newTypeInfo = {}
              newTypeInfo[this.fileName] = infoItem.name
              newTypeInfo[this.fileUrl] = infoItem.url
              newTypeInfo[this.filePath] = infoItem.path
              return newTypeInfo
            })
          } else if (returnPath) {
            return info.map(e => e.path)
          } else if (returnUrl) {
            return info.map(e => e.url)
          } else {
            throw Error('错误的返回类型')
          }
        } else {
          throw Error('错误的FileInfo类型')
        }
      },
      arrayEqual: function (newVal, oldVal) {
        if (newVal instanceof Array && oldVal instanceof Array && newVal.length === oldVal.length) {
          let returnObject = this.returnObject
          let returnPath = this.returnPath
          let returnUrl = this.returnUrl
          let find = newVal.find((e, index) => {
            if (returnObject) {
              return e.path !== oldVal[index].path
            } else if (returnPath) {
              return e !== oldVal[index]
            } else if (returnUrl) {
              return e !== oldVal[index]
            } else {
              throw Error('错误的返回类型')
            }
          })
          return !find
        } else {
          return false
        }
      },
      //删除某个FileInfo
      doDeleteFileInfo: function (fileInfo) {
        let tempArray = [...this.fileInfoList]
        tempArray.splice(tempArray.indexOf(fileInfo), 1)
        this.emitResult(tempArray)
      },
    },
  }
</script>

<style scoped>
    .shadow-icon {
        text-shadow: 3px 2px 3px #6671AF;
    }
</style>
