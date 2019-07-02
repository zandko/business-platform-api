<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+ status">
        <SourceUrlDropdown v-model="postForm.link" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '修改' : '创建' }}
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="title" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="8">
            <el-form-item label-width="100px" label="所属分类:" class="postInfo-container-item" prop="cat_id">
              <el-select v-model="postForm.cat_id">
                <el-option v-for="item in categoryListOptions" :key="item._id" :label="item.cat_name" :value="item._id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { createArticle, updateArticle, fetchArticle, getArticleCategories } from '@/api/article'
import { SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  title: '',
  content: '',
  link: '',
  id: undefined,
  cat_id: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '链接填写不正确',
            type: 'error'
          })
          callback(new Error('链接填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      status: 'draft',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      categoryListOptions: [],
      rules: {
        cat_id: [{ required: true, message: '分类是必填项', trigger: 'blur' }],
        title: [{ required: true, message: '标题是必填项', trigger: 'blur' }],
        content: [{ required: true, message: '内容是必填项', trigger: 'blur' }],
        link: [{ validator: validateSourceUri, trigger: 'blur' }]
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
      fetchArticle(id).then(response => {
        this.postForm = response

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm._id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改文章'
      document.title = `${title} - ${this.postForm._id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.isEdit ? this.updateArticle() : this.createArticle()
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
        name: 'ArticleList'
      })
    },
    createArticle() {
      createArticle(this.postForm).then((response) => {
        this.Jump()
      })
    },
    updateArticle() {
      updateArticle(this.postForm, this.postForm._id).then((response) => {
        this.Jump()
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
