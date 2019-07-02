<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link :to="'/example/article/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          创建
        </el-button>
      </router-link>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" row-key="_id" border fit highlight-current-row :tree-props="{children: 'children'}"> style="width: 100%">
      <el-table-column align="center" label="文章ID">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属分类">
        <template slot-scope="scope">
          <span v-for="item in categoryListOptions" :key="item._id">
            <span v-if="scope.row.cat_id === item._id">{{ item.cat_name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章链接">
        <template slot-scope="scope">
          <span>{{ scope.row.link }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <router-link :to="'/example/article/edit/'+row._id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button v-if="row.status!='deleted'" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getArticle, deleteArticle, getArticleCategories } from '@/api/article'
import Pagination from '@/components/Pagination'

export default {
  name: 'Article',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      total: 0,
      list: [],
      categoryListOptions: [],
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
    this.getRemoteCategoryList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getArticle(this.listQuery).then(response => {
        this.total = response.total
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the file. Do you want to continue?', 'prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteArticle(row._id).then(response => {
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
    },
    getRemoteCategoryList() {
      getArticleCategories().then(response => {
        if (!response) return
        this.categoryListOptions = response.map(v => v)
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
