<template>
  <div class="admin-login-box">
    <!-- 1后台登录入口，只有登录，没有注册，也没有找回密码 -->
    <!-- 2只有门户一个用户入口，如果是管理员则跳转到管理中心，否则跳转到首页/重定向的页面 -->
    <!-- 如果是2的登录的，则有登录、注册、找回密码这些功能-->

    <!-- 顶部内容 -->
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">Blog System | Login</div>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="admin-login-center-box">
      <div class="center login-center-box">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form label-position="right" label-width="100px">
              <el-form-item label="账号" required>
                <el-input v-model="blogUser.userName" placeholder="用户名/邮箱"></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input type="password" v-model="originalPassword" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="验证码" required>
                <el-input
                  v-model="loginInfo.verifycode"
                  placeholder="请输入验证码"
                  @keypress.enter.native="doLogin"
                ></el-input>
                <img :src="captchaPath" @click="updateVerifyCode()" class="captcha-code" />
              </el-form-item>
              <el-form-item class="login-button">
                <el-button type="primary" @click="doLogin" size="medium">登 录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 底部内容 -->
    <div></div>
  </div>
</template>
<script>
import { doLogin } from '../../api/api'
import { hex_md5 } from '../../utils/md5'

export default {
  data() {
    return {
      originalPassword: '',
      blogUser: {
        userName: '',
        password: '',
      },
      loginInfo: {
        verifycode: '',
      },
      captchaPath: '',
    }
  },
  methods: {
    toastError(message) {
      this.$message({
        message: message,
        center: true,
        type: 'error',
      })
    },
    doLogin() {
      // 发起登录
      if (this.blogUser.userName === '') {
        this.toastError('账号不可以为空')
        return
      }
      if (this.originalPassword === '') {
        this.toastError('密码不能为空')
        return
      }
      if (this.loginInfo.verifycode === '') {
        this.toastError('验证码不能为空')
        return
      }
      this.blogUser.password = hex_md5(this.originalPassword)
      // 向服务器提交数据
      doLogin(this.loginInfo.verifycode, this.blogUser).then((result) => {
        // 处理登录结果 判断状态
        if (result.code == 20000) {
          // 如果是成功则跳转--->判断角色,如果是普通用户,就跳转到首页,如果是管理员就跳转到管理中心
          // TODO:需要判断角色
          this.$message({
            message: result.message,
            center: true,
            type: 'success',
          })
          this.$router.push({ path: '/index' })
        } else {
          // 更新验证码
          this.updateVerifyCode
          this.toastError(result.message)
        }
      })
      // 检查数据
      // 向服务器提交数据
      // 处理结果
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha?&random=' + Date.parse(new Date())
    },
  },
  mounted() {
    // 检查是否登录,如果登录了跳转到别的页面
    this.updateVerifyCode()
  },
}
</script>
<style>
.center {
  margin: 0 auto;
  width: 1140px;
}
.admin-login-header-box {
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  background: #83def3;
}
.admin-login-header-center {
  line-height: 60px;
}
.admin-login-logo {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.login-center-box {
  padding: 10px;
  border-radius: 5px;
  width: 1120px;
  background: #ffffff;
  box-shadow: 0 1px 10px #afafaf;
}

.login-center-box .el-form-item__label {
  border-radius: 3px;
  text-align: center;
  background: #e4e7ed;
  border: #ebeef5 solid 1px;
}

.login-center-box .el-input__inner {
  height: 42px;
}

.login-button {
  margin-bottom: 0px;
}

.captcha-code {
  vertical-align: middle;
  cursor: pointer;
  width: 155px;
  height: 40px;
  margin-left: 10px;
  border: solid 1px #e6e6e6;
  border-radius: 5px;
}

.login-center-box .el-input {
  width: 50%;
}
</style>