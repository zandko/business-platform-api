<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" row-key="_id" border fit highlight-current-row :tree-props="{children: 'children'}"> style="width: 100%">
      <el-table-column align="center" label="分类ID">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品图片">
        <template slot-scope="scope">
          <div v-viewer class="images">
            <img width="100" :src="scope.row.url">
          </div>
          <viewer v-show="false">
            <img :src="scope.row.url">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片颜色">
        <template slot-scope="scope">
          <span v-for="item in colorListOptions" :key="item._id">
            <span v-if="item._id === scope.row.product_color_id">{{ item.name }}</span>
          </span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="图片" prop="url">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            action="http://127.0.0.1:7001/api/v1/common/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="temp.url" :src="temp.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="颜色" prop="product_color_id">
          <el-select v-model="temp.product_color_id">
            <el-option v-for="item in colorListOptions" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
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
import { fetchProduct, getProductColor, createProductPicture, updateProductPicture, deleteProductPicture } from '@/api/product'
import { getToken } from '@/utils/auth'

export default {
  name: 'SetPicture',
  data() {
    return {
      tableKey: 0,
      list: [],
      colorList: [],
      colorListOptions: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      temp: {
        id: undefined,
        product_id: undefined,
        product_color_id: undefined,
        url: ''
      },
      rules: {
        url: [{ required: true, message: '图片为必传项', trigger: 'blur' }],
        product_id: [{ required: true, message: '产品ID为必传项', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': getToken()
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.temp.product_id = id
    Promise.all([this.fetchData(id)]).then(() => {
      setTimeout(() => {
        this.getProductColor()
      }, 1000)
    })
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.temp.url = file.response.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    getProductColor() {
      const _this = this
      getProductColor().then(response => {
        const colorList = []
        response.forEach(element => {
          if (_this.colorList.includes(element._id)) colorList.push(element)
        })
        this.colorListOptions = colorList
      })
    },
    fetchData(id) {
      this.listLoading = true
      fetchProduct(id).then(response => {
        this.list = response.productImage
        this.colorList = response.productResult.color.split(',')
        this.listLoading = false
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '设置图片关联'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '设置图片关联'
      document.title = `${title} - ${this.$route.params.id}`
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the file. Do you want to continue?', 'prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteProductPicture(row._id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.fetchData(this.$route.params.id)
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
        product_id: this.$route.params.id,
        product_color_id: undefined,
        url: ''
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
          createProductPicture(this.temp).then((response) => {
            this.list.unshift(response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData(this.$route.params.id)
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
          updateProductPicture(tempData, tempData._id).then(() => {
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
