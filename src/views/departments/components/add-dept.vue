<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClose">
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
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
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
      console.log(depts)
      // 布尔值
      let isRepeat = true
      // 问题：在编辑模式下，由于数据已经存在，会产生自己校验自己的状态
      // 解决方案：对比过程中 把自己排除掉 在对比
      if (this.formData.id) {
        // 找到同级部分
        const deptstj1 = depts.some(ele => ele.id !== this.formData.id && ele.code === value)
        console.log(deptstj1)
      } else {
        // value是我输入的值
        isRepeat = depts.some(ele => ele.code === value)
      }
      isRepeat ? callback(new Error(`模块下已经存在${value}编码`)) : callback()
    }
    // 名称
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = true
      // 排除自己 再判断名称是否重复
      if (this.formData.id) {
        const deptstj = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.treeNode.id)
        isRepeat = deptstj.some(ele => ele.name === value)
      } else { // 新增子部门
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        isRepeat = deptstj.some(ele => ele.name === value)
      }
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
  computed: {
    title() {
      return this.formData.id ? '编辑模式' : '新增模式'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(res)
    },
    async submit() {
      try {
        // 表单校验 通过validate方法 调用接口
        await this.$refs.addDeptForm.validate()
        this.loading = true
        // 判断是不是编辑模式
        if (this.formData.id) {
          await updateDepartments(this.formData)
        } else {
          // 调用接口, 传输formData各项数据，用展开运算符，确定父级在父级id下新增
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }

        // 确定loding状态，v-loading
        // 接口调用新增成功之后，消息提示成功
        // 三元表达式 判断有无Id
        this.$message.success(`${this.formData.id ? '编辑' : '提交'}成功`)
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
