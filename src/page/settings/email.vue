<template>
  <div class="email-setting-box">
    <el-form label-width="100px" class="demo-dynamic" size="medium">
      <el-form-item
        label="新邮箱地址"
        :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
      >
        <el-input v-model="newEmail"></el-input>
        <el-button
          v-if="!isCountDown"
          type="primary"
          class="email-get-verify-code-btn"
          @click="getVerifyCode"
        >获取验证码</el-button>
        <el-button
          v-else
          type="primary"
          class="email-get-verify-code-btn"
          @click="getVerifyCode"
          disabled
        >{{countDownText}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" required>
        <el-input v-model="verifyCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEmailAddress">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from '../../api/api'

export default {
  data() {
    return {
      isCountDown: false,
      newEmail: '',
      verifyCode: '',
      countDownText: '重新发送(60)',
    }
  },
  methods: {
    getVerifyCode() {
      // 校验邮箱格式是否正确
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱格式错误')
        return
      }

      api // 发起请求，获取验证码
        .getVerifyCOde(this.newEmail, 'update')
        .then((result) => {
          if (result.code === api.success_code) {
            this.startCountDown()
            this.$message.success(result.message)
          } else {
            this.$message.error(result.message)
          }
        })
    },
    startCountDown() {
      // 禁止按钮可以使用，并且开始倒计时
      let time = 60
      this.isCountDown = true
      let that = this
      //这里的setInterval的写法会涉及作用域的问题，所以需要对先拿到this，不然在里面使用this所指向的不是当前的
      let interval = setInterval(function () {
        //执行倒计时内容
        time--
        if (time <= 0) {
          that.isCountDown = false
          clearInterval(interval)
        }
        that.countDownText = '重新发送(' + time + ')'
      }, 1000)
    },
    updateEmailAddress() {
      //内容校验
      if (this.newEmail === '') {
        this.$message.error('邮箱地址不可以为空')
        return
      }
      if (this.verifyCode === '') {
        this.$message.error('验证码不能为空')
        return
      }
      api.updateEmailAddress(this.newEmail, this.verifyCode).then((result) => {
        if (result.code === api.success_code) {
          //更新成功
          this.$message.success(result.message)
          this.verifyCode = ''
          this.newEmail = ''
        } else {
          this.verifyCode = ''
          this.$message.error(result.message)
        }
      })
    },
  },
}
</script>
<style>
.email-setting-box .el-input {
  max-width: 250px;
}

.email-get-verify-code-btn {
  margin-left: 10px;
}
</style>