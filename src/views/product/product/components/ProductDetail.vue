<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar draft'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
      </sticky>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="basic" />
        <el-tab-pane label="产品类型" name="type" />
        <el-tab-pane label="产品相册" name="album" />
        <el-tab-pane label="其他" name="other" />
      </el-tabs>
      <div v-if="activeName === 'basic'" class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" name="title">
                Title
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item label-width="90px" label="所属分类:" class="postInfo-container-item" prop="product_category_id">
                  <el-select v-model="postForm.product_category_id">
                    <el-option v-for="item in CategoryListOptions" :key="item._id" :label="item.title" :value="item._id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label-width="60px" label="SN:" class="postInfo-container-item">
                  <el-input v-model.number="postForm.sn" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="60px" label="价格:" class="postInfo-container-item" prop="price">
                  <el-input v-model="postForm.price" :rows="1" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="80px" label="市场价格:" class="postInfo-container-item">
                  <el-input v-model="postForm.market_price" :rows="1" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="80px" label="库存:" class="postInfo-container-item" prop="stock">
                  <el-input-number v-model.number="postForm.stock" :min="1" label="描述文字" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-form-item prop="image" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image" />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="版本:">
          <el-input v-model="postForm.version" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="长标题:">
          <el-input v-model="postForm.subsidiary_title" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="关键字:">
          <el-input v-model="postForm.keywords" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="描述:">
          <el-input v-model="postForm.description" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
      <div v-if="activeName === 'type'" class="createPost-main-container">
        <el-form-item label-width="90px" label="所属类型:" class="postInfo-container-item" prop="product_type_id">
          <el-select v-model="postForm.product_type_id" @change="handleProductTypeChange">
            <el-option v-for="item in TypeListOptions" :key="item._id" :label="item.title" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item v-for="item in TypeAttributeList" :key="item._id" style="margin-bottom: 40px;" label-width="100px" :label="item.title + ':'">
          <el-input v-if="item.attr_type === 1" v-model="postForm.version" />
          <el-input v-else-if="item.attr_type === 2" v-model="postForm.version" :rows="1" type="textarea" class="article-textarea" autosize />
          <el-select v-if="item.attr_type === 3" v-model="postForm.version" placeholder="请选择">
            <el-option v-for="item1 in item.attr_value.split('\n')" :key="item1" :label="item1" :value="item1" />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="activeName === 'other'" class="createPost-main-container">
        <el-form-item label-width="90px" label="选择颜色:" class="postInfo-container-item">
          <el-checkbox-group v-model="postForm.color">
            <el-checkbox v-for="item in ColorListOptions" :key="item.value" :label="item.name" :value="item.value" :style="{color: item.value}" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="更多属性:">
          <el-input v-model="postForm.attrs" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="赠品:">
          <el-input v-model="postForm.gift" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="配件:">
          <el-input v-model="postForm.fitting" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="关联产品:">
          <el-input v-model="postForm.relation" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle } from '@/api/article'
import { getProductCategory, getProductType, getProductTypeAttribute, getProductColor } from '@/api/product'

const defaultForm = {
  _id: undefined,
  title: '',
  subsidiary_title: '',
  sn: undefined,
  product_category_id: undefined,
  product_type_id: undefined,
  image: '',
  stock: undefined,
  price: undefined,
  market_price: undefined,
  attrs: '',
  gift: '',
  fitting: '',
  version: '',
  color: [],
  keywords: '',
  description: '',
  content: '',
  sort: undefined,
  is_onsale: 1,
  is_best: 0,
  is_new: 0,
  is_rec: 0,
  onsale_at: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'basic',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      CategoryListOptions: [],
      TypeListOptions: [],
      TypeAttributeList: [],
      ColorListOptions: [],
      rules: {
        title: [{ required: true, message: '标题为必传项', trigger: 'blur' }],
        product_category_id: [{ required: true, message: '所属分类为必传项', trigger: 'change' }],
        stock: [{ required: true, message: '库存为必传项', trigger: 'blur' }],
        price: [{ required: true, message: '价格为必传项', trigger: 'blur' }],
        image: [{ required: true, message: '封面图为必传项', trigger: 'change' }],
        onsale_at: [{ required: true, message: '上架时间为必传项', trigger: 'change' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    displayTime: {
      get() {
        return (+new Date(this.postForm.onsale_at))
      },
      set(val) {
        this.postForm.onsale_at = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.getRemoteCategoryList()
    this.getRemoteTypeList()
    this.getRemoteColorList()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleProductTypeChange(val) {
      this.getRemoteTypeAttribute(val)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteCategoryList() {
      getProductCategory().then(response => {
        if (!response) return
        this.CategoryListOptions = response.map(v => v)
      })
    },
    getRemoteTypeList() {
      getProductType().then(response => {
        console.log(response)
        if (!response) return
        this.TypeListOptions = response.map(v => v)
      })
    },
    getRemoteTypeAttribute(id) {
      getProductTypeAttribute(id).then(response => {
        this.TypeAttributeList = response.productTypeAttribute
      })
    },
    getRemoteColorList() {
      getProductColor().then(response => {
        this.ColorListOptions = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
