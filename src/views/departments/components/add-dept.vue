<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isRepeat = depts.some(ele => ele.code === value)
      console.log(depts)
      isRepeat ? callback(new Error(`模块下已经存在${value}编码`)) : callback()
    }
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const deptstj = depts.filter(item => item.pid === this.treeNode.id)
      console.log(deptstj)

      const isRepeat = deptstj.some(ele => ele.name === value)
      isRepeat ? callback(new Error(`该部门下一级存在${value}部门名称`)) : callback()
    }
    return {
      peoples: [],
      loading: false,
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: nameCheck
          }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: codeCheck
          }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
    },
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(res)
    },
    async submit() {
      try {
        // 表单校验 通过validate方法 调用接口
        await this.$refs.addDeptForm.validate()
        // 调用接口, 传输formData各项数据，用展开运算符，确定父级在父级id下新增
        await addDepartments({ ...this.formData, pid: this.treeNode.id })
        // 确定loding状态，v-loading
        // 接口调用新增成功之后，消息提示成功
        this.$message.success('新增成功')
        // 新增成功后调用父组件接口
        this.$parent.getDepartments()
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }

}
</script>

<style>

</style>
