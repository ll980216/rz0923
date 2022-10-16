<template>
  <div>
    <el-upload
      v-loading="loading"
      class="UploadImg"
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :file-list="fileList"
      :http-request="onHttpRequest"
      :before-upload="beforeupload"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <img style="width:100%" :src="onPreviewUrl">

    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 不传Id和key 报错，没有权限上传---->后端弄
const cos = new COS({
  SecretId: 'AKID5tcAk8JLSemncGj16A5ugKoDRV0RuJb0', //  密钥Id
  SecretKey: 'V4laO6ijmkV4rT6c0Wt5783nOrcPBrPs' // 密钥key
})
export default {
  name: 'UpdateImg',

  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      onPreviewUrl: '', // 声明接收图片的变量
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ]
    }
  },
  // 监视父组件传递的数据
  watch: {
    // defaultURL发生变化就进行Push------>变化：图片改变（上传图片）
    defaultUrl() {
      // fileList里面是对象
      this.fileList.push({
        name: 'default', url: this.defaultURL
      })
    }
  },
  methods: {
    onPreview(file) {
      // console.log('onPreview')
      this.dialogVisible = true
      // 当前的url等于 当前file文件中的url地址
      this.onPreviewUrl = file.url
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // onchange 触发两次
    //  -第一次触发：点击添加----》本地上传
    //  -第二次触发：loadImg组件 自动发送请求---->:http-request函数覆盖第二次请求
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'hz-33-ll-1314348755', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // function(err, data) this指向window
        // console.log(err || data)
        if (err) return this.$message.error('上传失败')
        // 成功时， 从存储桶取图片
        this.loading = false
        this.$emit('on-Success', {
          url: 'https:' + data.Location
        })
      })
    },
    beforeupload(file) {
      const allowTypes = ['image/jpeg', 'image/gif']
      // 布尔值 判断当前图片的type属性
      const ishas = allowTypes.includes(file.type)
      // 没有 就进行操作
      if (!ishas) {
        this.$message.error('上传图片只能是' + allowTypes.join('、') + '格式!')
        return false
      }
      // 判断图片大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片不能超过1MB')
        return false
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.UploadImg {
  width:148px;
  height: 148px;
  overflow: hidden;
}
</style>
