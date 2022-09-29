<template>
  <div class="app-container">
    <el-card shadow="always">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-row :gutter="10">
            <el-button type="primary" style="margin-left: 10px" @click="add">新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table ref="" v-loading="loading" style="width: 100%" :data="rolelist">
            <el-table-column label="序号" width="120" type="index" />
            <el-table-column label="角色" width="240" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="240">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" type="flex" justify="end" align="middle">
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2, 5, 10, 15]"
              @current-change="getRolelists"
              @size-change="getRolelists"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <addRole ref="addRole" :dialog-visble.sync="dialogVisble" @refreshList="getRolelists" />
  </div>
</template>

<script>
import { getRolelistApi, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from '@/views/setting/compoents/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: {
    addRole
  },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 10,
      rolelist: [],
      loading: false,
      dialogVisble: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRolelists()
    this.getCompanyInfo()
  },
  methods: {
    async getRolelists() {
      try {
        this.loading = true
        const { rows, total } = await getRolelistApi(this.page)
        console.log(rows)
        this.total = total
        this.rolelist = rows
        // 优化细节 没有数据就页码-1且重新渲染页面
        if (this.total > 0 && this.rolelist.length === 0) {
          this.page.page--
          this.getRolelists()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 新增
    add() {
      // console.log(1)
      this.dialogVisble = true
    },
    // 编辑
    editRole(row) {
      // 优化 编辑按钮修改内容页面也一起变化
      // 1深拷贝 2{...row}
      this.$refs.addRole.formData = { ...row }
      this.dialogVisble = true
      console.log(row.id)
    },
    // 删除
    delRole(id) {
      this.$confirm('确认删除该角色吗？', '提示', {
        confirmButtonText: '确认', // 确认弹框文本
        cancelButtonText: '取消', // 取消弹框文本
        type: 'warning'
      }).then(async success => {
        // console.log(success)
        // 1.调用查删除接口 2.刷新列表
        await deleteRole(id)
        // 刷新列表
        this.getRolelists()
      }).catch(cancel => {
        console.log(cancel)
      })
    },
    // 获取公司接口 封装
    // 拿到companyId
    async getCompanyInfo() {
      // 封装接口 调用 把接口的值赋给companyInfo
      this.companyInfo = await getCompanyInfo(this.$store.state.user.userInfo.companyId)
      console.log(this.$store.state.user.userInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
