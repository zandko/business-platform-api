<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" label-position="left" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '修改' : '创建' }}
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="postForm.title" :maxlength="100" name="title" required>
              分类名称
            </MDinput>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label-width="100px" label="上级分类:" class="postInfo-container-item">
              <el-select v-model="postForm.parent_id" placeholder="上级分类">
                <el-option :key="0" label="顶级分类" :value="0" />
                <el-option v-for="item in CategoryListOptions" :key="item._id" :label="item.title" :value="item._id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="分类链接:">
          <el-input v-model="postForm.link" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="分类排序:">
          <el-input v-model.number="postForm.sort" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="SEO 标题:">
          <el-input v-model="postForm.sub_title" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="SEO 关键字:">
          <el-input v-model="postForm.keywords" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="SEO 描述:">
          <el-input v-model="postForm.description" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="筛选ID:">
          <el-input v-model="postForm.filter_attr" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="分类模板:">
          <el-input v-model="postForm.template" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item prop="icon" style="margin-bottom: 30px;">
          <Upload v-model="postForm.icon" />
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { getProductCategory, createProductCategory, fetchProductCategory, updateProductCategory } from '@/api/product'

const defaultForm = {
  _id: undefined,
  parent_id: 0,
  icon: '',
  title: '',
  sub_title: '',
  keywords: '',
  description: '',
  link: '',
  filter_attr: '',
  template: '',
  sort: undefined,
  status: undefined
}

export default {
  name: 'ProductCategoryDetail',
  components: { MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultN: 0,
      status: 'draft',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      CategoryListOptions: [],
      rules: {
        title: [{ required: true, message: '分类名称为必传项', trigger: 'blur' }]
      },
      tempRoute: {}
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
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchProductCategory(id).then(response => {
        this.postForm = response.data

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改分类'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm._id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改分类'
      document.title = `${title} - ${this.postForm._id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.isEdit ? this.updateProductCategory() : this.createProductCategory()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Jump() {
      this.$notify({
        title: '成功',
        message: this.isEdit ? '修改成功' : '创建成功',
        type: 'success',
        duration: 2000
      })
      this.status = 'published'
      this.loading = false
      this.$router.push({
        name: 'ProdyctCategory'
      })
    },
    createProductCategory() {
      createProductCategory(this.postForm).then((response) => {
        this.Jump()
      })
    },
    updateProductCategory() {
      updateProductCategory(this.postForm, this.postForm._id).then((response) => {
        this.Jump()
      })
    },
    getRemoteCategoryList(query) {
      getProductCategory().then(response => {
        if (!response) return
        this.CategoryListOptions = response.map(v => v)
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
