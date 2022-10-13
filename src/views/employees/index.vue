<template>
  <div class="app-container">
    <PageTools>
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmploy">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />
        <!-- 时间过滤器 -->
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}

          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <!-- :value返回布尔值，true就展开 -->
            <el-switch
              :value="row.enableState === 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <!-- slot-scope="{ row }" 获取本行信息  -->
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,15,20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployess :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import { getEmployeeList } from '@/api/employees'
import EnumHireType from '@/api/constant/employees'
import addEmployess from './components/addEmployess.vue'
import { delEmployee } from '@/api/departments'
export default {

  components: {
    PageTools,
    addEmployess
  },
  data() {
    return {
      dialogVisible: false,
      page: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      loading: true,
      hireType: EnumHireType.hireType
    }
  },
  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, cellValue) {
      const res = this.hireType.find(ele => ele.id === cellValue)
      return res?.value
    },
    handleEmploy() {
      // 点击的时候 弹出员工窗口
      this.dialogVisible = true
    },
    async del(id) {
      try {
        await this.$confirm('确认删除该员工吗？', '提示', {
          type: 'warning'
        })
        // 提示成功表示确认 调用删除接口
        await delEmployee(id)
        // 重新渲染列表
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出表格
    async exportExcel() {
      // 点击导出功能才可以导出模块
      // import('路径') 返回值是promise 可以拿取成功时的回调函数
      // 方法一
      // import('@/vendor/Export2Excel').then((res) => {
      //   console.log(res)
      // })
      // 方法二
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      // 把总条数给接口，一次性请求总数据
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)
      const exportExcelMapPath = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 遍历出exportExcelMapPath上的属性
      const header = Object.keys(exportExcelMapPath)
      console.log(this.hireType)

      const data = rows.map(item => {
        return header.map(h => {
          // exportExcelMapPath(h) -------> 建立映射关系，取到中文对应的英文
          // item(exportExcelMapPath(h))------->取到对应的英文后，找到原始数据取出item.h 取出每一项值
          // 先判断有无遍历到聘用形式this.hir = [id:1,value: "正式"]
          if (h === '聘用形式') {
            // 有聘用形式就遍历此项,判断此项id与当前项聘用形式的Id相符?相符就返回对应的值,查找不到当前id值返回未知
            const find = this.hireType.find(hire => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return find ? find.value : '未知'
          }
          // 当前遍历项不是聘用形式
          return item[exportExcelMapPath[h]]
        })
      })
      // console.log(data)
      export_json_to_excel({
        header, // 表头 必填
        multiHeader: [['手机号', '核心信息', '', '', '', '其他信息', '']],
        merges: ['A1:A2', 'B1:E1', 'F1:G1'],
        data, // 具体数据 必填
        filename: '黑马员工列表', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    goDetail(row) {
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
