<template>
  <div class="departments-container ">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <!-- 缺少treeNode -->
      <treetools :tree-node="company" :is-root="false" @addDept="handleAddDept" />
      <!--放置一个属性  这里的props和我们之前学习的父传子 的props没关系-->
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick">
      <treetools slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" />
    </el-tree>
    <addDept :dialog-visible.sync="dialogVisible" :tree-node="currenNode" />
  </div>
</template>

<script>
import treetools from './components/treetools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept'
export default {
  name: 'HrsaasIndex',
  components: {
    treetools,
    addDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: {},
      dialogVisible: false,
      currenNode: {}

    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // this.company = { name: result.companyName, manager: '负责人' } // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.company = { name: result.companyName, manager: result.companyManage, id: '' }
      this.departs = tranListToTreeData(result.depts, '')
    },
    handleAddDept(node) {
      this.dialogVisible = true
      this.currenNode = node
    }
  }
}
</script>
<style lang="scss">
  .departments-container {
    width: 900px;
    margin: 20px auto;
    .el-tree {
      .el-tree-node__content {
        // padding-right: 20px;
      }
    }
  }
  </style>
