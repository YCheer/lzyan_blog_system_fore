<template>
  <div class="system-log-box margin-bottom-20">
    <div class="system-log-list margin-bottom-20">
      <el-table :data="systemLogs" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="250"></el-table-column>
        <el-table-column label="访问地址" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.visitIp}}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问路径">
          <template slot-scope="scope">
            <span>{{scope.row.visitUri}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" width="300">
          <template slot-scope="scope">
            <div class="system-log-user-avatar clear-fix">
              <el-avatar :src="scope.row.avatar" v-if="scope.row.avatar!==''"></el-avatar>
              <el-avatar :src="scope.row.avatar" v-else>访客</el-avatar>
              <span class="system-log-user-name">{{scope.row.userName}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="访问日期" width="250">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.visitTime)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="system-log-navigation">
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
    <div class="delete-log-btn-list clear-fix">
      <el-button type="primary" @click="clearLogs" class="delete-log-btn float-right">清空当前日志</el-button>
    </div>
    <div class="system-log-dialog">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="300px">
        <span>你确定要清空当前所有日志吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doDelete()">确 定</el-button>
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
      loading: false,
      systemLogs: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
      },
      deleteDialogShow: false,
    }
  },
  methods: {
    doDelete() {
      api.deleteSystemLog().then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listSystemLog()
        } else {
          this.$message.error(result.message)
        }
        this.deleteDialogShow = false
      })
    },
    clearLogs() {
      this.deleteDialogShow = true
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listSystemLog()
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    listSystemLog() {
      this.loading = true
      api
        .listSystemLogs(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize
        )
        .then((result) => {
          // console.log(result)
          if (result.code === api.success_code) {
            this.systemLogs = result.data.content
            this.pageNavigation.currentPage = result.data.number + 1
            this.pageNavigation.totalCount = result.data.totalElements
            this.pageNavigation.pageSize = result.data.size
          } else {
            this.$message.error(result.message)
          }
          this.loading = false
        })
    },
  },
  mounted() {
    this.listSystemLog()
  },
}
</script>
<style>
.system-log-user-avatar {
  display: block;
}

.system-log-user-avatar img {
  vertical-align: middle;
}

.system-log-user-avatar span {
  display: block;
  line-height: 40px;
  float: left;
}

.system-log-user-name {
  margin-left: 8px;
  font-weight: 600;
}

.delete-log-btn {
  margin-right: 40px;
}
</style>