<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="属性ID">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性类型">
        <template slot-scope="scope">
          <span>{{ scope.row.attr_type === 1 ? '文本框' : (scope.row.attr_type === 2 ? '文本区域' : '下拉框') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性值">
        <template slot-scope="scope">
          <span>{{ scope.row.attr_value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item label="AttrType" prop="attr_type">
          <el-radio-group v-model="temp.attr_type">
            <el-radio :label="1">input</el-radio>
            <el-radio :label="2">textarea</el-radio>
            <el-radio :label="3">select</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AttrValue" prop="attr_value">
          <el-input v-model="temp.attr_value" type="textarea" :disabled="temp.attr_type !== 3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteProductTypeAttribute, createProductTypeAttribute, updateProductTypeAttribute, getProductTypeAttribute } from '@/api/product'

export default {
  name: 'ProductTypeAttribute',
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      temp: {
        id: undefined,
        product_type_id: undefined,
        title: '',
        attr_type: 1,
        attr_value: '',
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogPvVisible: false,
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.getList(id)
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    getList(id) {
      this.listLoading = true
      getProductTypeAttribute(id).then(response => {
        this.temp.product_type_id = response.productType._id
        this.list = response.productTypeAttribute
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '产品类型属性'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '产品类型属性'
      document.title = `${title} - ${this.$route.params.id}`
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the file. Do you want to continue?', 'prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteProductTypeAttribute(row._id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.getList(this.$route.params.id)
        })
      }).catch(() => {
        this.$notify({
          title: 'info',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        product_type_id: this.$route.params.id,
        title: '',
        attr_type: 1,
        attr_value: '',
        status: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createProductTypeAttribute(this.temp).then((response) => {
            this.list.unshift(response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList(this.$route.params.id)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProductTypeAttribute(tempData, tempData._id).then(() => {
            for (const v of this.list) {
              if (v._id === this.temp._id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
