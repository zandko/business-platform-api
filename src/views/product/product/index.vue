<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link :to="'/product/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          创建
        </el-button>
      </router-link>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" row-key="_id" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="产品ID：">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="产品赠品">
              <span>{{ props.row.gift }}</span>
            </el-form-item>
            <el-form-item label="附属标题：">
              <span>{{ props.row.subsidiary_title }}</span>
            </el-form-item>
            <el-form-item label="产品赠品">
              <span>{{ props.row.gift }}</span>
            </el-form-item>
            <el-form-item label="产品版本：">
              <span>{{ props.row.version }}</span>
            </el-form-item>
            <el-form-item label="产品配件：">
              <span>{{ props.row.fitting }}</span>
            </el-form-item>
            <el-form-item label="关键字：">
              <span>{{ props.row.keywords }}</span>
            </el-form-item>
            <el-form-item label="关联产品：">
              <span>{{ props.row.relation }}</span>
            </el-form-item>
            <el-form-item label="产品描述：">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="更多属性：">
              <span>{{ props.row.attrs }}</span>
            </el-form-item>
            <el-form-item label="评论数量：">
              <span>{{ props.row.comment_count }}</span>
            </el-form-item>
            <el-form-item label="产品颜色：">
              <span>{{ props.row.color }}</span>
            </el-form-item>
            <el-form-item label="评论星数：">
              <svg-icon v-for="n in + props.row.comment_star" :key="n" icon-class="star" class="meta-item__icon" />
            </el-form-item>
            <el-form-item label="产品SN：">
              <span>{{ props.row.sn }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品封面图">
        <template slot-scope="scope">
          <img width="100" :src="scope.row.image" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品标题" prop="title" />
      <el-table-column align="center" width="100" label="产品价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price }} / {{ scope.row.market_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" width="80" prop="stock" />
      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status ? 'primary' : 'danger'">
            {{ row.status ? 'normal' : 'deleted' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="加入推荐">
        <template slot-scope="scope">
          <span>{{ scope.row.is_new ? ' 新品 /' : '' }}{{ scope.row.is_rec ? ' 推荐 /' : '' }}{{ scope.row.is_best ? ' 精品' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上架时间">
        <template slot-scope="scope">
          <span>{{ scope.row.onsale_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="{row}">
          <router-link :to="'/product/edit/'+row._id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getProduct, deleteProductCategory } from '@/api/product'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductList',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProduct(this.listQuery).then(response => {
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
        deleteProductCategory(row._id).then(response => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
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
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
