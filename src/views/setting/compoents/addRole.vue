<template>
  <!-- dialog弹窗组件 -->
  <el-dialog

    :title="title"

    width="50%"

    :visible.sync="dialogVisble"

    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required: true, message:'角色必填',trigger:'blur'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRoleApi, updateRole } from '@/api/setting'

export default {
  props: {
    dialogVisble: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisble', false)
      this.$refs.roleDialogForm.resetFields()
    },
    async submit() {
      try {
        await this.$refs.roleDialogForm.validate()
        // 接口
        this.loading = true
        // 提交 区分是新增还是修改 有id为修改 否则调新增接口
        this.formData.id ? await updateRole(this.formData) : await addRoleApi(this.formData)
        this.$emit('refreshList')
        this.$message.success('新增成功')
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
