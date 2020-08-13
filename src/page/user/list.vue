<template>
  <div class="user-list-box">
    <!-- 搜索部分 -->
    <div class="user-search-path">
      <el-form :inline="true" size="medium">
        <el-form-item label="用户名">
          <el-input v-model="search.userNmae" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="search.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查 询</el-button>
          <el-button type="danger" @click="cleanSearch">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list-box margin-bottom-20">
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="80"></el-table-column>
        <el-table-column label="头像" width="70">
          <template slot-scope="scope">
            <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" width="200"></el-table-column>
        <el-table-column prop="sign" label="签名" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.sign">
              <span v-text="scope.row.sign"></span>
            </div>
            <div v-else>
              <span>这个人很懒，什么都没有写</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="regIp" label="注册ip" width="110"></el-table-column>
        <el-table-column prop="loginIp" label="登录ip" width="110"></el-table-column>

        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.state ==='0'">
              <el-tag type="danger" size="mini">已删除</el-tag>
            </div>
            <div v-if="scope.row.state ==='1'">
              <el-tag type="success" size="mini">正 常</el-tag>
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
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" @click="deleteItem(scope.row)">删除</el-button>
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
    <div class="page-navigation-box margin-bottom-20 clear-fix">
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
    <div class="user-list-dialog-box">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="400px">
        <span>你确定要删除: {{deleteUserName}} 这个用户吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="密码重置" :visible.sync="resetPasswordShow" width="400px">
        <div class="reset-password-box">
          <div class="reset-tips-text">修改用户: {{targetResetUserName}} 的密码</div>
          <el-form label-width="80px" class="demo-ruleForm" size="medium">
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="newPasswordValue" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="resetPasswordShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doResetPassword()">确 定</el-button>
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
      search: {
        userNmae: '',
        email: '',
      },
      loading: false,
      userList: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 5,
      },
      deleteDialogShow: false,
      deleteUserName: '',
      targetDeleteUserId: '',
      resetPasswordShow: false,

      newPasswordValue: '',
      targetResetUserName: '',
    }
  },
  methods: {
    doResetPassword() {},
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listUsers()
    },
    doDeleteItem() {
      // 去删除用户
      api.deleteUsersById(this.targetDeleteUserId).then((result) => {
        if (result.code === api.success_code) {
          this.deleteDialogShow = false
          this.$message.success(result.message)
          this.listUsers()
        } else {
          this.$message.error(result.message)
        }
      })
    },
    deleteItem(item) {
      this.targetDeleteUserId = item.id
      this.deleteUserName = item.userName
      this.deleteDialogShow = true
    },
    resetPassword(item) {
      this.resetPasswordShow = true
      this.targetResetUserName = item.userName
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    listUsers() {
      this.loading = true
      api
        .listUsers(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize
        )
        .then((result) => {
          this.handleUserListResult(result)
        })
    },
    doSearch() {
      //检查搜索的条件
      this.loading = true
      api
        .doUserSearch(this.search.userNmae, this.search.email)
        .then((result) => {
          this.handleUserListResult(result)
        })
    },
    cleanSearch() {
      this.search.email = ''
      this.search.userNmae = ''
      this.listUsers()
    },
    handleUserListResult(result) {
      if (result.code === api.success_code) {
        this.userList = result.data.content
        this.pageNavigation.currentPage = result.data.number + 1
        this.pageNavigation.totalCount = result.data.totalElements
        this.pageNavigation.pageSize = result.data.size
      } else {
        this.$message.error(result.message)
      }
      this.loading = false
    },
  },
  mounted() {
    this.listUsers()
  },
}
</script>
<style>
.user-list-page-navigation-bar {
  margin-right: 10px;
  float: right;
}

.reset-tips-text {
  font-size: 15px;
  font-weight: 500;
  margin-left: 15px;
  margin-bottom: 15px;
}

.list-box .el-table {
  min-height: 350px;
}
</style>