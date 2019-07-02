<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户头像">
        <template slot-scope="scope">
          <img width="50" :src="scope.row.avatar ">
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拥有角色">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles" :key="item">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-show="false" align="center" label="角色ID">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.role_id" :key="item">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
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
        <el-form-item label="头像" prop="avatar">
          <pan-thumb :image="temp.avatar" />
          <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
            上传头像
          </el-button>
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            url="http://127.0.0.1:7001/api/v1/common/upload"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item>
        <el-form-item v-if="temp.account !== 'admin'" label-width="100px" label="角色:" class="postInfo-container-item" prop="role_id">
          <el-drag-select v-model="temp.role_id" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in rolesListOptions" :key="item._id" :label="item.role_name" :value="item._id" />
          </el-drag-select>
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input v-model="temp.account" disabled />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="密码">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item v-else label="密码" prop="password">
          <el-input v-model="temp.password" />
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
import { getAdministrators, createAdministrators, deleteAdministrators, updateAdministrators, getRoles } from '@/api/admin'
import waves from '@/directive/waves'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import ElDragSelect from '@/components/DragSelect'

export default {
  name: 'Administrators',
  directives: { waves },
  components: { ImageCropper, PanThumb, ElDragSelect },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      imagecropperShow: false,
      imagecropperKey: 0,
      rolesListOptions: [],
      temp: {
        id: undefined,
        role_id: [],
        avatar: '',
        account: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      rules: {
        account: [{ required: true, message: '用户名是必填项', trigger: 'blur' }],
        password: [{ required: true, message: '密码是必填项', trigger: 'blur' }],
        role_id: [{ required: true, message: '角色是必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    getRoles() {
      getRoles().then(response => {
        this.rolesListOptions = response
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.avatar = resData.url
    },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      getAdministrators().then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        role_id: [],
        account: '',
        password: '',
        avatar: ''
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
          createAdministrators(this.temp).then((response) => {
            this.list.unshift(response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch((error) => {
            this.$notify({
              title: '失败',
              message: error.request.response,
              type: 'error',
              duration: 2000
            })
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
          updateAdministrators(tempData, tempData._id).then(() => {
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
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the file. Do you want to continue?', 'prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteAdministrators(row._id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          title: 'info',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
