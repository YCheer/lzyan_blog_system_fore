<template>
  <div class="article-list-box">
    <div class="article-action-bar">
      <!-- 发表文章，搜索 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.state" placeholder="请选择状态">
            <el-option label="已删除" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="草稿" value="2"></el-option>
            <el-option label="置顶" value="3"></el-option>
            <el-option label="所有状态" value></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.categoryId" placeholder="请选择文章分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doArticlSearch">查询</el-button>
          <el-button type="danger" @click="clearSearch">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list-part margin-bottom-20">
      <!-- 文章列表 -->
      <el-table :data="articles" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200"></el-table-column>
        <el-table-column prop="title" label="标题" width="220"></el-table-column>
        <el-table-column prop="viewCount" label="浏览量" width="80"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.state ==='0'">
              <el-tag type="danger" size="mini">已删除</el-tag>
            </div>
            <div v-if="scope.row.state ==='1'">
              <el-tag type="primary" size="mini">已发布</el-tag>
            </div>
            <div v-if="scope.row.state ==='2'">
              <el-tag type="info" size="mini">草 稿</el-tag>
            </div>
            <div v-if="scope.row.state ==='3'">
              <el-tag type="success" size="mini">置 顶</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="摘要"></el-table-column>
        <el-table-column label="创建日期" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" @click="deleteItem(scope.row)">删除</el-button>
            <el-button type="success" v-if="scope.row.state==='3'" @click="top(scope.row)">取消置顶</el-button>
            <el-button type="success" v-else @click="top(scope.row)">置顶</el-button>
            <el-button
              type="danger"
              v-if="scope.row.status=='0'"
              @click="deleteItem(scope.row)"
              disabled
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="article-page-navigation">
      <el-pagination
        class="article-list-page-navigation-bar"
        background
        layout="prev, pager, next"
        @current-change="onPageChange"
        :current-page="pageNavigation.currentPage"
        :total="pageNavigation.totalCount"
        :page-size="pageNavigation.pageSize"
      ></el-pagination>
    </div>
    <div class="article-dialog-part">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="400px">
        <span>你确定要删除这篇文章吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doAbsDelete()">状态删除</el-button>
          <el-button size="mini" type="primary" @click="doDeleteItem()">绝对删除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as dateUtils from '../../utils/date'
import * as api from '../../api/api'

export default {
  data() {
    return {
      loading: false,
      articles: [],
      search: {
        keyword: '',
        state: '',
        categoryId: '',
      },
      categories: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
      },
      deleteDialogShow: false,
      targetDeleteArticleId: '',
    }
  },
  methods: {
    edit(item) {
      let articleId = item.id
      this.$router.push({
        path: '/content/post-article',
        query: {
          articleId: articleId,
        },
      })
    },
    doAbsDelete() {
      api.deleteArticleAbs(this.targetDeleteArticleId).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.deleteDialogShow = false
          this.listArticles()
        } else {
          this.$message.error(result.message)
          this.deleteDialogShow = false
        }
      })
    },
    doDeleteItem() {
      api.deleteArticlePretend(this.targetDeleteArticleId).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.deleteDialogShow = false
          this.listArticles()
        } else {
          this.$message.error(result.message)
          this.deleteDialogShow = false
        }
      })
    },
    deleteItem(item) {
      this.deleteDialogShow = true
      this.targetDeleteArticleId = item.id
    },
    top(item) {
      api.topArticle(item.id).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listArticles()
        } else {
          this.$message.error(result.message)
        }
      })
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listArticles()
    },
    doArticlSearch() {
      this.listArticles()
    },
    clearSearch() {
      this.search.categoryId = ''
      this.search.state = ''
      this.search.keyword = ''
      this.listArticles()
    },
    listCategories() {
      api.listCategories().then((result) => {
        if (result.code === api.success_code) {
          this.categories = result.data
          this.categories.push({
            id: '',
            name: '所有分类',
          })
        }
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    listArticles() {
      this.loading = true
      api
        .listArticles(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize,
          this.search.state,
          this.search.keyword,
          this.search.categoryId
        )
        .then((result) => {
          console.log(result)
          if (result.code === api.success_code) {
            this.articles = result.data.contentList
            this.pageNavigation.currentPage = result.data.currentPage
            this.pageNavigation.totalCount = result.data.totalCount
            this.pageNavigation.pageSize = result.data.pageSize
          }
          this.loading = false
        })
    },
  },
  mounted() {
    this.listArticles()
    this.listCategories()
  },
}
</script>
<style>
.article-list-part .el-table {
  min-height: 350px;
}
</style>