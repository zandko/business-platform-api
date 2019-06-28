<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar draft'">
        <el-button v-if="uploadStatus" v-loading="loading" style="margin-left: 10px;" type="primary" @click="handleChange">
          上传
        </el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '修改' : '创建' }}
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-tabs v-model="activeName" tab-position="right" style="" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="basic">
            <el-row>
              <el-col :span="24">
                <el-form-item style="margin-bottom: 40px;" prop="title">
                  <MDinput v-model="postForm.title" name="title">
                    产品标题
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <div class="postInfo-container">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="100px" label="所属分类:" class="postInfo-container-item" prop="product_category_id">
                      <el-select v-model="postForm.product_category_id">
                        <el-option v-for="item in CategoryListOptions" :key="item._id" :label="item.title" :value="item._id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-row>
            <el-form-item prop="image" style="margin-bottom: 30px;">
              <Upload v-model="postForm.image" />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="附属标题:">
              <el-input v-model="postForm.subsidiary_title" :rows="1" type="textarea" class="article-textarea" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品版本:">
              <el-input v-model="postForm.version" :rows="1" type="textarea" class="article-textarea" autosize />
            </el-form-item>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="上架时间:" class="postInfo-container-item">
                  <el-date-picker v-model="postForm.onsale_at" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="产品序号:">
                  <el-input v-model="postForm.sn" oninput="value=value.replace(/[^\d]/g,'')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="产品价格:" prop="price">
                  <el-input v-model="postForm.price" oninput="value=value.replace(/[^0-9.]/g,'')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="产品原价:">
                  <el-input v-model="postForm.market_price" oninput="value=value.replace(/[^0-9.]/g,'')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="产品库存:" prop="stock">
                  <el-input-number v-model="postForm.stock" :min="1" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item label-width="100px" label="产品排序:" prop="stock">
                  <el-input-number v-model="postForm.sort" :min="1" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品状态:">
              <el-radio v-model="postForm.status" label="1">显示</el-radio>
              <el-radio v-model="postForm.status" label="0">隐藏</el-radio>
            </el-form-item>
            <el-form-item label-width="100px" label="加入推荐:">
              <el-checkbox-group v-model="recommendList" @change="handleRecommendChange">
                <el-checkbox label="is_best">精品</el-checkbox>
                <el-checkbox label="is_rec">推荐</el-checkbox>
                <el-checkbox label="is_new">新品</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="详细描述" name="detailed">
            <el-form-item prop="content" style="margin-bottom: 30px;">
              <Tinymce ref="editor" v-model="postForm.content" :height="400" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="规格包装" name="packing">
            <el-form-item label-width="100px" label="所属类型:" prop="product_type_id">
              <el-select v-model="postForm.product_type_id" @change="handleProductTypeChange">
                <el-option v-for="item in TypeListOptions" :key="item._id" :label="item.title" :value="item._id" />
              </el-select>
            </el-form-item>
            <el-form-item v-for="(item, index) in TypeAttributeList" :key="item._id" style="margin-bottom: 40px;" label-width="100px" :label="item.title + ':'">
              <span v-if="item.attr_type === 1">
                <el-input v-model="attributeValueList[index]" />
                <el-input type="hidden" name="attributeIdList" :value="item._id" />
              </span>
              <span v-else-if="item.attr_type === 2">
                <el-input v-model="attributeValueList[index]" :rows="1" type="textarea" class="article-textarea" autosize />
                <el-input type="hidden" name="attributeIdList" :value="item._id" />
              </span>
              <span v-if="item.attr_type === 3">
                <el-select v-model="attributeValueList[index]" placeholder="请选择">
                  <el-option v-for="item1 in item.attr_value.split('\n')" :key="item1" :label="item1" :value="item1" />
                </el-select>
                <el-input type="hidden" name="attributeIdList" :value="item._id" />
              </span>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="other">
            <el-form-item label-width="100px" label="选择颜色:" class="postInfo-container-item">
              <el-checkbox-group v-model="colorList" @change="handleColorChange">
                <el-checkbox v-for="item in ColorListCheckbox" :key="item.value" :label="item._id" border style="font-weight: bold; color: #000;" :style="{background: item.value}">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="更多属性:">
              <el-input v-model="postForm.attrs" :rows="1" type="textarea" class="article-textarea" placeholder="属性名：属性值 格式：内存：8G,16G,32G | 尺寸：33,34,35" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品赠品:">
              <el-input v-model="postForm.gift" :rows="1" type="textarea" class="article-textarea" placeholder="产品ID-产品数量 格式：23-2,24-3" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品配件:">
              <el-input v-model="postForm.fitting" :rows="1" type="textarea" class="article-textarea" placeholder="产品ID-产品数量 格式：23-2,24-3" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="关联产品:">
              <el-input v-model="postForm.relation" :rows="1" type="textarea" class="article-textarea" placeholder="填写关联商品的ID 格式：23,24,25" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品关键字:">
              <el-input v-model="postForm.keywords" :rows="1" type="textarea" class="article-textarea" autosize />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品描述:">
              <el-input v-model="postForm.description" :rows="1" type="textarea" class="article-textarea" autosize />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="产品相册" name="album">
            <div>
              <VueGallery :images="image_url" :index="index" @close="index = null" />
              <div v-for="(image, imageIndex) in image_url" :key="imageIndex" @click="index = imageIndex" class="image" :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }" >
                 <el-select v-model="postForm.keywords" class="select-color" placeholder="请选择关联颜色">
                  <el-option v-for="item in ColorListCheckbox" :key="item._id" :label="item.name" :value="item._id" />
                </el-select>
              </div>
            </div>
            <el-upload
              v-show="false"
              action="http://127.0.0.1:7001/api/v1/common/upload"
              drag
              multiple
              class="upload-demo"
              :headers="headers"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
            >
              <i ref="upload" class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip"> 只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import { getToken } from '@/utils/auth'
import MDinput from '@/components/MDinput'
import VueGallery from 'vue-gallery'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchProduct, updateProduct, getProductCategory, getProductType, getProductTypeAttribute, getProductColor, createProduct } from '@/api/product'

const defaultForm = {
  _id: undefined,
  title: '',
  subsidiary_title: '',
  sn: undefined,
  product_category_id: undefined,
  product_type_id: undefined,
  image: '',
  stock: 0,
  price: 0,
  market_price: 0,
  attrs: '',
  gift: '',
  fitting: '',
  version: '',
  color: '',
  attr_value: undefined,
  image_url: [],
  keywords: '',
  description: '',
  content: '',
  sort: 1,
  status: '1',
  is_best: 0,
  is_new: 0,
  is_rec: 0,
  onsale_at: undefined
}

export default {
  name: 'ProductDetail',
  components: { Tinymce, MDinput, Upload, Sticky, VueGallery },
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
      uploadStatus: false,
      image_url: [],
      index: null,
      colorList: [],
      attributeIdList: [],
      attributeValueList: [],
      recommendList: [],
      TypeAttributeList: [],
      CategoryListOptions: [],
      TypeListOptions: [],
      ColorListCheckbox: [],
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: '产品标题为必传项', trigger: 'blur' }],
        product_category_id: [{ required: true, message: '所属分类为必传项', trigger: 'change' }],
        stock: [{ required: true, message: '产品库存为必传项', trigger: 'blur' }],
        price: [{ required: true, message: '产品价格为必传项', trigger: 'blur' }],
        image: [{ required: true, message: '产品封面图为必传项', trigger: 'change' }],
        onsale_at: [{ required: true, message: '产品上架时间为必传项', trigger: 'change' }]
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
    },
    headers() {
      return {
        'Authorization': getToken()
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
    handleChange() {
      this.$refs.upload.click()
    },
    handleSuccess(response, file, fileList) {
      fileList.forEach(element => {
        if (element.status === 'success') {
          this.image_url.push(element.response.url)
        }
      })
      this.image_url = [...new Set(this.image_url)]
    },
    handleRemove(file, fileList) {
      fileList.forEach(element => {
        if (element.status === 'success') {
          this.image_url.push(element.url)
        }
      })
      this.image_url = [...new Set(this.image_url)]
    },
    handleProductTypeChange(val) {
      this.getRemoteTypeAttribute(val)
    },
    handleRecommendChange(val) {
      const recommendList = [...new Set(val)]
      recommendList.includes('is_best') ? this.postForm.is_best = 1 : this.postForm.is_best = 0
      recommendList.includes('is_new') ? this.postForm.is_new = 1 : this.postForm.is_new = 0
      recommendList.includes('is_rec') ? this.postForm.is_rec = 1 : this.postForm.is_rec = 0
    },
    handleColorChange(val) {
      const colorList = [...new Set(val)]
      this.postForm.color = colorList.join(',')
    },
    handleClick(tab, event) {
      if (tab.name === 'album') this.uploadStatus = true
    },
    fetchData(id) {
      fetchProduct(id).then(response => {
        this.postForm = response.productResult
        this.postForm.status = response.productResult.status + ''
        response.productResult.is_best ? this.recommendList.push('is_best') : ''
        response.productResult.is_new ? this.recommendList.push('is_new') : ''
        response.productResult.is_rec ? this.recommendList.push('is_rec') : ''
        response.productAttribute.forEach((element) => {
          this.attributeValueList.push(element.value)
        })
        response.productImage.forEach((element) => {
          this.image_url.push(element.url)
        })
        this.colorList = response.productResult.color.split(',')
        this.handleProductTypeChange(this.postForm.product_type_id)
        
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改产品'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm._id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改产品'
      document.title = `${title} - ${this.postForm._id}`
    },
    submitForm() {
      const attributeIdList = document.getElementsByName('attributeIdList')
      const attributeList = []
      attributeIdList.forEach((item, index) => {
        attributeList.push({
          _id: item.value,
          attr_value: this.attributeValueList[index]
        })
      })
      this.postForm.onsale_at = new Date(this.postForm.onsale_at).getTime()
      this.postForm.attr_value = attributeList
      this.postForm.image_url = this.image_url

      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.isEdit ? this.updateProduct() : this.createProduct()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Jump() {
      this.$notify({
        title: '成功',
        message: this.isEdit ? '修改成功' : '添加成功',
        type: 'success',
        duration: 2000
      })
      this.loading = false
      this.$router.push({
        name: 'ProductList'
      })
    },
    createProduct() {
      createProduct(this.postForm).then(response => {
        this.Jump()
      })
    },
    updateProduct() {
      updateProduct(this.postForm, this.postForm._id).then(response => {
        this.Jump()
      })
    },
    getRemoteCategoryList() {
      getProductCategory().then(response => {
        if (!response) return
        this.CategoryListOptions = response.map(v => v)
      })
    },
    getRemoteTypeList() {
      getProductType().then(response => {
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
        this.ColorListCheckbox = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.image {
  position: relative;
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 10px;
  .select-color {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
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
