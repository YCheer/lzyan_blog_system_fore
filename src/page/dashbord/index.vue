<template>
  <div class="dashboard-box">
    <div class="welcome-tps">欢迎使用lzyan博客系统</div>
    <div class="web-size-info margin-bottom-20">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="web-info-content">
            <div class="web-info-title">总访问量:</div>
            <div class="web-info-number">{{viewCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-info-content">
            <div class="web-info-title">注册用户:</div>
            <div class="web-info-number">{{userCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-info-content">
            <div class="web-info-title">文章总数:</div>
            <div class="web-info-number">{{articleCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-info-content">
            <div class="web-info-title">评论总数:</div>
            <div class="web-info-number">{{commentCount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dashboard-bottom-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="dashboard-car-title">快捷操作</span>
              </div>
              <div class="fast-way-list">
                <div class="fast-way-item">
                  <router-link to="/content/post-article" class="el-icon-edit">写文章</router-link>
                </div>
                <div class="fast-way-item">
                  <router-link
                    to="/settings/web-size-info"
                    class="el-icon-c-scale-to-original"
                  >修改网站信息</router-link>
                </div>
                <div class="fast-way-item">
                  <router-link to="/settings/friend-link" class="el-icon-cold-drink">添加友情链接</router-link>
                </div>
                <div class="fast-way-item">
                  <router-link to="/operation/loop" class="el-icon-picture-outline-round">轮播图管理</router-link>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="dashboard-car-title">最新评论</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="toCommentMore"
                >更多 >></el-button>
              </div>
              <div class="last-comment-list">
                <el-table :data="comments" style="width: 100%" v-loading="loading">
                  <el-table-column label="评论内容">
                    <template slot-scope="scope">
                      <a href="#">{{scope.row.content}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column label="用户" width="200">
                    <template slot-scope="scope">
                      <a href="#" class="comment-user-avatar clear-fix">
                        <el-avatar
                          :src="blog_constants.baseUrl+'/portal/image/'+scope.row.userAvatar"
                        ></el-avatar>
                        <span class="comment-user-name">{{scope.row.userName}}</span>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as api from '../../api/api'
export default {
  data() {
    return {
      comments: [],
      loading: false,
      viewCount: 0,
      commentCount: 0,
      articleCount: 0,
      userCount: 0,
    }
  },
  methods: {
    toCommentMore() {
      this.$router.push({
        path: '/content/manage-comment',
      })
    },
    listCount() {
      api.getArticleCount().then((result) => {
        if (result.code === api.success_code) {
          this.articleCount = result.data
        }
      })

      api.getUserCount().then((result) => {
        if (result.code === api.success_code) {
          this.userCount = result.data
        }
      })

      api.getCommentCount().then((result) => {
        if (result.code === api.success_code) {
          this.commentCount = result.data
        }
      })

      api.getViewCount().then((result) => {
        if (result.code === api.success_code) {
          this.viewCount = result.data.web_size_view_count
        }
      })
    },
    listLastComment() {
      this.loading = true
      api.listComment(1, 10).then((result) => {
        if (result.code === api.success_code) {
          this.comments = result.data.content
        } else {
          this.$message.error(result.message)
        }
        this.loading = false
      })
    },
  },
  mounted() {
    this.listCount()
    this.listLastComment()
  },
}
</script>
<style>
.welcome-tps {
  padding: 10px;
  margin-bottom: 20px;
  font-size: 20px;
}

.dashboard-box {
  padding: 20px;
  width: 1610px;
}

.web-info-content {
  height: 165px;
  box-shadow: 0 5px 8px #d4d4d4;
}

.web-info-title {
  padding: 28px;
  font-size: 20px;
}

.web-info-number {
  text-align: center;
  color: #83def3;
  font-size: 40px;
  font-weight: 600;
}

.dashboard-car-title {
  font-size: 20px;
  font-weight: 600;
}

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

.fast-way-item {
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
}

.fast-way-item a {
  color: #0793b3;
}
</style>