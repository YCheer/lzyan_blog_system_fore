cha<template>
  <div class="artilce-post-box">
    <!-- 标题 -->
    <div class="article-title-part margin-bottom-20">
      <el-input
        v-model="article.title"
        placeholder="请输入标题"
        maxlength="64"
        minlength="8"
        show-word-limit
      ></el-input>
    </div>
    <!-- 内容编辑部分 -->
    <div class="article-post-part margin-bottom-20">
      <mavon-editor
        ref="mdEditor"
        @change="onContentChange"
        @htmlCode="htmlcode"
        v-model="article.content"
        @onImageClick="onEditorImageClick"
      ></mavon-editor>
    </div>
    <!-- 文章设置 ：分类 封面 标签-->
    <div class="article-post-settings-part">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类" required>
          <el-select v-model="article.categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="文章摘要"
            v-model="article.summary"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="article-cover-selector" @click="showImageSelector">
            <i class="el-icon-plus" v-if="!article.cover"></i>
            <el-image fit="cover" v-el :src="article.cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="标签" class="label-input-box" required>
          <el-tag
            :key="tag"
            v-for="tag in labels"
            closable
            :disable-transitions="false"
            @close="deleteLabel(tag)"
            >{{ tag }}</el-tag
          >
          <el-input
            class="input-new-label"
            v-if="labelInputVisible"
            v-model="labelNewValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleLabelInputConfirm"
          ></el-input>
          <el-button
            v-if="!labelInputVisible && !isEnough"
            class="button-new-tag"
            size="small"
            @click="showLabelInput"
            >+ 标签</el-button
          >
        </el-form-item>
        <el-form-item label="发布时间" required>
          <el-date-picker
            v-model="article.createTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 发布/保存草稿/预览的按钮 -->
    <div class="article-post-action-bar clear-fix">
      <div class="action-btn-container">
        <el-button plain @click="preView">全屏预览</el-button>
        <el-button
          plain
          type="warning"
          @click="saveArticleDraft"
          v-if="!disableDraftBtn"
          >保存草稿</el-button
        >
        <el-button
          plain
          type="warning"
          @click="saveArticleDraft"
          v-else
          disabled
          >保存草稿</el-button
        >

        <el-button plain type="primary" @click="commitArticle">{{
          commitText
        }}</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box">
      <el-dialog
        :visible.sync="isImageSelectorShow"
        width="500"
        class="image-picker-container"
      >
        <div class="image-selector-box">
          <div class="image-action-bar">
            <el-upload
              class="image-selector-uploader"
              action="/admin/image/article"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="onUploadError"
              accept="image/*"
            >
              <el-button>上传图片</el-button>
            </el-upload>
          </div>
          <div class="image-selector-list clear-fix">
            <el-radio-group v-model="selectedImageIndex">
              <el-radio-button
                :label="index"
                v-for="(item, index) in images"
                :key="index"
              >
                <el-image fit="cover" :src="item.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="image-picker-navigation">
            <el-pagination
              class="user-list-page-navigation-bar"
              background
              layout="prev, pager, next"
              @current-change="onPageChange"
              :current-page="pageNavigation.currentPage"
              :total="pageNavigation.totalCount"
              :page-size="pageNavigation.pageSize"
            ></el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isImageSelectorShow = false">取 消</el-button>
          <el-button type="primary" @click="onImageSelected">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="你确定要离开此页面吗？"
        :visible.sync="saveConfirmDialogShow"
        width="450px"
        class
      >
        <span>系统可能不会保存填写的稿件信息哦</span>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            type="danger"
            @click="saveConfirmDialogShow = false"
            >取 消</el-button
          >
          <el-button size="mini" type="primary" @click="toNextPage()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '../../api/api'
import editor from '../../../lib/mavon-editor/mavon-editor'
import '../../../lib/mavon-editor/css/index.css'
import Vue from 'vue'
Vue.use(editor)

export default {
  data() {
    return {
      nextPath: '',
      isContentSave: false,
      saveConfirmDialogShow: false,
      imageSelectFor: 'article',
      selectedImageIndex: 0,
      isImageSelectorShow: false,
      isEnough: false,
      labelNewValue: '',
      labelInputVisible: '',
      categories: [],
      labels: [],
      article: {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        label: '',
        state: '1',
        type: '1',
        createTime: null,
      },
      images: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15,
      },
      commitText: '发表文章',
      disableDraftBtn: false,
      hasContentChange: false,
    }
  },
  watch: {
    article: {
      handler() {
        this.hasContentChange = true
      },
      deep: true,
    },
  },
  methods: {
    toNextPage() {
      this.hasContentChange = true
      this.saveConfirmDialogShow = false
      this.isContentSave = true
      this.$router.push({
        path: this.nextPath,
      })
    },
    preView() {
      this.$refs.mdEditor.toolbar_right_click('read')
    },
    saveArticleDraft() {
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空')
        return
      }
      //修改状态
      this.article.state = '2'
      api.saveArticleDraft(this.article).then((result) => {
        if (result.code === api.success_code) {
          window.onbeforeunload = null
          this.isContentSave = true

          this.$message.success(result.message)
          // 添砖到文章列表页面
          this.$router.push({
            path: '/content/manage-article',
          })
        } else {
          this.$message.error(result.message)
        }
      })
    },
    commitArticle() {
      // 检查内容:标题,内容，分类，摘要，封面，标签
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空')
        return
      }
      if (this.article.content === '') {
        this.$message.error('文章内容不能为空')
        return
      }
      if (this.article.categoryId === '') {
        this.$message.error('文章的分类不能为空')
        return
      }
      if (this.article.summary === '') {
        this.$message.error('文章的摘要不能为空')
        return
      }
      if (this.article.cover === '') {
        this.$message.error('文章的封面不能为空')
        return
      }
      if (this.labels.length === 0) {
        this.$message.error('请设置标签，方便检索')
        return
      }
      //处理标签
      let tempLabels = ''
      this.labels.forEach((item, index) => {
        tempLabels += item
        if (index !== this.labels.length - 1) {
          tempLabels += '-'
        }
      })
      this.article.label = tempLabels
      // console.log('labels ==>' + this.article.label)
      // 是更新还是发布文章
      // 判断article的id是否存在，如果有那就是更新
      if (this.article.id === '') {
        api.postArticle(this.article).then((result) => {
          if (result.code === api.success_code) {
            window.onbeforeunload = null
            this.isContentSave = true

            this.$message.success(result.message)
            // 添砖到文章列表页面
            this.$router.push({
              path: '/content/manage-article',
            })
          } else {
            this.$message.error(result.message)
          }
        })
      } else {
        // 更新
        if (this.article.state === '0' || this.article.state === '2') {
          this.article.state = '1'
        }
        api.updateArticle(this.article.id, this.article).then((result) => {
          window.onbeforeunload = null
          this.isContentSave = true

          if (result.code === api.success_code) {
            this.$message.success(result.message)
            // 添砖到文章列表页面
            this.$router.push({
              path: '/content/manage-article',
            })
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
    onEditorImageClick() {
      // 显示图片选择器
      this.imageSelectFor = 'article'
      this.isImageSelectorShow = true
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listImages()
    },
    onUploadError() {
      this.$message.error('图片上传失败')
    },
    uploadSuccess(response) {
      if (response.code === api.success_code) {
        this.$message.success(response.message)
        // 更新列表
        this.listImages()
      }
    },
    onImageSelected() {
      // 判断当前的操作是谁操作的图片
      // 如果是文章，插入到文章
      // 如果是封面则作为封面
      let item = this.images[this.selectedImageIndex]
      if (this.imageSelectFor === 'article') {
        this.$refs.mdEditor.toolbar_left_addlink('no-link', item.name, item.url)
      } else if (this.imageSelectFor === 'cover') {
        console.log(this.selectedImageIndex)
        // 从数组里拿到当前选中的对象
        this.article.cover = item.url
      }
      this.isImageSelectorShow = false
    },
    showImageSelector() {
      // 显示图片选择器
      this.imageSelectFor = 'cover'
      this.isImageSelectorShow = true
    },
    htmlcode(status, vaule) {
      console.log(status)
      console.log(vaule)
    },
    onContentChange(value, render) {
      console.log(value)
      console.log(render)
    },
    handleLabelInputConfirm() {
      // 回车的时候
      if (this.labels.length < 5) {
        this.labels.push(this.labelNewValue)
        this.labelNewValue = ''
      }
      //   如果加完以后数量是5个，那就去隐藏输入框
      if (this.labels.length >= 5) {
        this.labelInputVisible = false
        this.isEnough = true
      }
    },
    deleteLabel(label) {
      // 从数组里删除
      this.labels.splice(this.labels.indexOf(label), 1)
      if (this.labels.length < 5) {
        this.isEnough = false
        this.labelInputVisible = true
      }
    },
    showLabelInput() {
      // 判断个数，限制5个
      // 控制输入框的显示
      if (this.labels.length < 5) {
        this.labelInputVisible = true
      } else {
        this.labelInputVisible = false
      }
      // 获取焦点
      this.$nextTick(() => {
        this.$refs.saveTapInput.$refs.input.focus()
      })
    },
    listCategories() {
      api.listCategories().then((result) => {
        if (result.code === api.success_code) {
          this.categories = result.data
        }
      })
    },
    listImages() {
      api
        .listImages(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize,
          'article'
        )
        .then((result) => {
          if (result.code === api.success_code) {
            this.images = result.data.content
            this.pageNavigation.currentPage = result.data.number + 1
            this.pageNavigation.totalCount = result.data.totalElements
            this.pageNavigation.pageSize = result.data.size
          } else {
            this.$message.error(result.message)
          }
        })
    },
    getArticleDetail(articleId) {
      api.getArticleDetail(articleId).then((result) => {
        if (result.code === api.success_code) {
          let remoteArticle = result.data
          this.article.id = remoteArticle.id
          this.article.title = remoteArticle.title
          this.article.content = remoteArticle.content
          this.article.categoryId = remoteArticle.categoryId
          this.article.summary = remoteArticle.summary
          this.article.cover = remoteArticle.cover
          this.article.label = remoteArticle.label
          this.article.state = remoteArticle.state
          this.article.type = remoteArticle.type
          this.labels = remoteArticle.labels
          this.article.createTime = remoteArticle.createTime
          // 如果当前文章的状态时草稿，就显示发表文章，如果是已经发布的或者说置顶和逻辑删除，就显示更新文章
          if (this.article.state === '2') {
            this.commitText = '发表文章'
            this.disableDraftBtn = false
          } else {
            this.commitText = '更新文章'
            // 草稿这个按钮就不能用了
            this.disableDraftBtn = true
          }
        }
      })
    },
  },
  mounted() {
    window.onbeforeunload = function () {
      return '系统可能不会保存填写的稿件信息哦'
    }
    // 检查是否要获取文章
    let articleId = this.$route.query.articleId
    if (articleId) {
      // 获取文章
      this.getArticleDetail(articleId)
    }
    //   获取文章分类
    this.listCategories()
    this.listImages()
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
  beforeRouteLeave(to, from, next) {
    // 做一个弹窗
    // 如果是确定
    if (this.isContentSave || !this.hasContentChange) {
      next()
    } else {
      this.nextPath = to.path
      this.saveConfirmDialogShow = true
    }
  },
}
</script>
<style>
.image-picker-navigation {
  margin-top: 20px;
}

.image-action-bar {
  padding-left: 10px;
  margin-bottom: 18px;
}

.image-selector-list img {
  width: 156px;
  height: 156px;
  float: left;
  margin: 5px;
}

.image-picker-container .el-dialog__header {
  display: none;
}

.label-input-box .el-tag {
  margin-right: 10px;
}

.article-post-settings-part .el-textarea {
  width: 400px;
}

.article-post-part .markdown-body {
  height: 800px;
}

.article-post-part {
  background: darkcyan;
}

.article-post-settings-part {
  margin-bottom: 100px;
}

.action-btn-container {
  float: right;
  margin-right: 30px;
  padding: 10px;
}

.article-post-action-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-left: -240px;
  z-index: 2000;
}

.article-cover-selector img {
  width: 200px;
  height: 160px;
}

.article-cover-selector {
  cursor: pointer;
  width: 200px;
  height: 160px;
  border: #83def3 dashed 1px;
  border-radius: 5px;
  text-align: center;
}

.article-cover-selector i {
  line-height: 160px;
  font-size: 20px;
  color: #83def3;
}

.article-title-part input {
  border: none;
  padding-left: 10px;
  font-size: 20px;
}

.input-new-label {
  width: 100px;
}

.article-post-part .v-note-op {
  position: sticky;
  top: 0;
}

.image-selector-list .el-radio-button__inner,
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner {
  border: none;
  border-radius: 5px;
  padding: 3px;
  margin: 5px;
}
</style>