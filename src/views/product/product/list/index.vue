<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link :to="'/shop/product/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          创建
        </el-button>
      </router-link>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" size="mini" row-key="_id" border highlight-current-row :tree-props="{children: 'children'}" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="产品ID：">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.gift" label="产品赠品">
              <span>{{ props.row.gift }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.subsidiary_title" label="附属标题：">
              <span>{{ props.row.subsidiary_title }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.gift" label="产品赠品">
              <span>{{ props.row.gift }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.version" label="产品版本：">
              <span>{{ props.row.version }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.fitting" label="产品配件：">
              <span>{{ props.row.fitting }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ props.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item v-show="props.row.relation" label="关联产品：">
              <span>{{ props.row.relation }}</span>
            </el-form-item>
            <el-form-item label="评论数量：">
              <span>{{ props.row.comment_count }}</span>
            </el-form-item>
            <el-form-item label="上架时间：">
              <span>{{ props.row.onsale_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="产品颜色：">
              <span v-for="item in ColorList" :key="item._id">
                <span v-if="props.row.color.includes(item._id)">{{ item.name }}、</span>
              </span>
            </el-form-item>
            <el-form-item label="评论星数：">
              <svg-icon v-for="n in + props.row.comment_star || 5" :key="n" icon-class="star" class="meta-item__icon" />
            </el-form-item>
            <el-form-item label="产品SN：">
              <span>{{ props.row.sn }}</span>
            </el-form-item>
            <el-form-item label="加入推荐：">
              <span>{{ props.row.is_new ? ' 新品 /' : '' }}{{ props.row.is_rec ? ' 推荐 /' : '' }}{{ props.row.is_best ? ' 精品' : '' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="封面图">
        <template slot-scope="scope">
          <div v-viewer class="images">
            <img width="50" :src="scope.row.image">
          </div>
          <viewer v-show="false">
            <img :src="scope.row.image">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品标题" prop="title" />
      <el-table-column align="center" label="所属分类">
        <template slot-scope="scope">
          <span v-for="item in CategoryList" :key="item._id">
            <span v-if="scope.row.product_category_id === item._id">{{ item.title }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price }} / {{ scope.row.market_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" prop="stock" />
      <el-table-column class-name="status-col" label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.status ? 'primary' : 'danger'">
            {{ row.status ? 'normal' : 'deleted' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片关联">
        <template slot-scope="{row}">
          <router-link style="color: rgb(64, 158, 255);" :to="'/shop/product/set_picture/'+row._id">图片关联颜色</router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <router-link :to="'/shop/product/edit/'+row._id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button v-if="row.status!='deleted'" v-waves size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getProduct, deleteProduct, getProductCategory, getProductColor } from '@/api/product'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      CategoryList: [],
      ColorList: [],
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
    this.getRemoteCategoryList()
    this.getRemoteColorList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProduct(this.listQuery).then(response => {
        this.total = response.total
        this.list = response.data
        response.data.forEach((element, index) => {
          this.list[index].color = element.color.split(',')
        })
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the file. Do you want to continue?', 'prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteProduct(row._id).then(response => {
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
      getProductCategory().then(response => {
        if (!response) return
        this.CategoryList = response.map(v => v)
      })
    },
    getRemoteColorList() {
      getProductColor().then(response => {
        this.ColorList = response
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
