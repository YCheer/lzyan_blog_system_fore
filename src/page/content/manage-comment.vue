<template>
  <!-- 列表内容 -->
  <div class="comment-box">
    <div class="comment-list-box margin-bottom-20">
      <el-table :data="comments" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200"></el-table-column>
        <el-table-column label="评论内容">
          <template slot-scope="scope">
            <a href="#">{{scope.row.content}}</a>
          </template>
        </el-table-column>
        <el-table-column label="用户" width="200">
          <template slot-scope="scope">
            <a href="#" class="comment-user-avatar clear-fix">
              <el-avatar :src="blog_constants.baseUrl+'/portal/image/'+scope.row.userAvatar"></el-avatar>
              <span class="comment-user-name">{{scope.row.userName}}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.state ==='1'">
              <el-tag type="primary" size="mini">正常</el-tag>
            </div>
            <div v-if="scope.row.state ==='3'">
              <el-tag type="success" size="mini">置顶</el-tag>
            </div>
          </template>
        </el-table-column>
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
            <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
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
    <div class="comment-page-navigation">
      <el-pagination
        class="comment-list-page-navigation-bar"
        background
        layout="prev, pager, next"
        @current-change="onPageChange"
        :current-page="pageNavigation.currentPage"
        :total="pageNavigation.totalCount"
        :page-size="pageNavigation.pageSize"
      ></el-pagination>
    </div>
    <div class="comment-dialog-box">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="300px">
        <span>你确定要删除这条评论吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  data() {
    return {
      deleteDialogShow: false,
      loading: false,
      comments: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
      },
      targetDeleteId: '',
    }
  },
  methods: {
    top(item) {
      api.topComment(item.id).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listComment()
        } else {
          this.$message.error(result.message)
        }
      })
    },
    doDeleteItem() {
      api.deleteCommentById(this.targetDeleteId).then((result) => {
        if (result.code === api.success_code) {
          this.listComment()
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
        this.deleteDialogShow = false
      })
    },
    deleteItem(item) {
      this.targetDeleteId = item.id
      this.deleteDialogShow = true
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listComment()
    },
    listComment() {
      this.loading = true
      api
        .listComment(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize
        )
        .then((result) => {
          if (result.code === api.success_code) {
            this.comments = result.data.content
            this.pageNavigation.currentPage = result.data.number + 1
            this.pageNavigation.totalCount = result.data.totalElements
            this.pageNavigation.pageSize = result.data.size
          } else {
            this.$message.error(result.message)
          }
          this.loading = false
        })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  mounted() {
    this.listComment()
  },
}
</script>
<style>
.comment-user-avatar {
  display: block;
}

.comment-user-avatar img {
  vertical-align: middle;
}

.comment-user-avatar span {
  display: block;
  line-height: 40px;
  float: left;
}

.comment-user-name {
  margin-left: 8px;
  font-weight: 600;
}

.comment-list-box .el-table {
  min-height: 350px;
}
</style>