<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon  iconClass="form"></svg-icon>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getInfo } from '@/api/user'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // async getinfoAPI() {
    //   await getInfo()
    // }
  },
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
