<template>
  <div class="header-part clear-fix">
    <div class="header-left-box float-left">
      <div class="header-logo">博客系统管理中心</div>
    </div>
    <div class="header-right-box float-right">
      <div class="header-user-info clear-fix">
        <div class="header-user-avatar float-left">
          <el-image :src="avatar" fit="cover"></el-image>
        </div>
        <div class="header-user-username float-left">
          <el-dropdown @command="handlerCommand">
            <span class="el-dropdown-link">
              {{userName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '../api/api'

export default {
  data() {
    return {
      userName: '',
      avatar: '',
    }
  },
  methods: {
    handlerCommand(command) {
      if (command === 'userInfo') {
        this.$router.push({
          path: '/settings/info',
        })
      } else if (command === 'logout') {
        api.doLogout().then((result) => {
          if (result.code === api.success_code) {
            this.$router.push({
              path: '/login',
            })
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
  },
  mounted() {
    this.userName = window.localStorage.getItem('userName')
    this.avatar = window.localStorage.getItem('avatar')
    console.log(this.avatar)
  },
}
</script>
<style>
.header-logo {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.header-user-username .el-dropdown-link {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}

.header-user-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  vertical-align: middle;
}

.header-user-info {
  margin-right: 30px;
}
</style>