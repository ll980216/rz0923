<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="tabclick">
          <el-tab-pane lazy label="登陆账户设置" name="first">
            <!-- 放置表单 -->
            <!-- 表单校验三部曲： 1- ：model='表单数据'  2- ：rules='校验规则'  3- from-item :prop属性 -->
            <el-form ref="form" :model="accountInfo" :rules="countInfoRules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="accountInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="accountInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane lazy label="个人详情" name="second">
            <userinfo />
          </el-tab-pane>
          <el-tab-pane lazy label="岗位信息" name="third">

            <jobinfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserByID, saveUserByID } from '@/api/user'
import jobinfo from './job-info'
import userinfo from './user-info.vue'
import Cookies from 'js-cookie'
export default {
  components: {
    jobinfo,
    userinfo
  },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {},
      countInfoRules: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最小长度 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEmployeesInfo()
  },
  methods: {
    async loadEmployeesInfo() {
      // 利用$route获取数据
      // 路径  /    ----> params传参
      // 路径?id=   ----> query传参
      const res = await getUserByID(this.$route.params.id)
      console.log(res)
      this.accountInfo = res
    },
    async updateEmployees() {
      try {
        this.$refs.form.validate()
        // console.log('校验成功')
        await saveUserByID(this.accountInfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabclick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
