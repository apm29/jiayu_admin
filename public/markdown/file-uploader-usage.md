### 使用
```html
<v-file-uploader
          :grid="grid"
          :grid-count="gridCount"
          :disabled="disabled"
          v-model="result"
          :flat-list="flatList"
          :line-height="grid?150:80"
          :limit="9"
          :single="single"
          :upload="upload"
          file-value="filePath"
          file-name="fileName"
          file-base-url="http://axj.ciih.net/"
  >
  </v-file-uploader>
```
### upload方法定义:
```js
export default {
  //...
  methods:{
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
      }
  }
}
```
### 上传工具方法定义文件dio.js
```js
import axios from 'axios'

axios.defaults.withCredentials = true // 是否允许跨域
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://axj.ciih.net/'

export default {
  // 上传处理
  async upload (options) {
    axios.defaults.baseURL = 'http://axj.ciih.net/'
    let response = await axios({
      url: options.url,
      method: 'post',
      data: options.formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  async downloadLocal (url) {
    axios.defaults.baseURL = '/'
    let response = await axios({
      method: 'get',
      url: url,
      responseType: 'text',
    })
    return response.data
  },
}

```
