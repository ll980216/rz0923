<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon icon-class="form" />
    <!-- <UploadExcel :before-upload="beforeUpload" :handle-success="handleSuccess" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import UploadExcel from '@/components/UploadExcel'
// import { getInfo } from '@/api/user'
export default {
  name: 'Dashboard',
  components: {
    // UploadExcel
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // async getinfoAPI() {
    //   await getInfo()
    // }
    // handleSuccess(data) {
    //   console.log('data', data)
    //   // 做具体业务逻辑
    // },
    // beforeUpload(file) {
    //   console.log(file)
    //   // if (file.size > 1024) {
    //   //   this.$message.error('to Big')
    //   //   return false
    //   // }
    //   return true
    // }
  }
  // created() {
  //   this.getinfoAPI()
  // },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
