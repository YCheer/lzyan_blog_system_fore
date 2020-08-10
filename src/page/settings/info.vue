<template>
  <div class="settings-user-info-box">
    <div class="user-info-list-part">
      <el-form label-width="100px" class="demo-ruleForm" v-if="userInfo!==null">
        <el-form-item label="头像" class="user-info-avatar">
          <div class="user-avatar-container" @click="showAvatarDialog">
            <el-image style="width: 65px; height: 65px" :src="userInfo.avatar" fit="cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text" v-model="userInfo.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input type="email" v-model="userInfo.email" autocomplete="off" disabled></el-input>
          <el-button type="primary" class="update-email" @click="toUpdateEmailPage">修改邮箱</el-button>
        </el-form-item>
        <el-form-item label="签名">
          <el-input type="email" v-model="userInfo.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">提交修改信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-dialog">
      <avatar-upload
        field="file"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="showAvatarCutter"
        :width="250"
        :height="250"
        url="/admin/image/avatar"
        img-format="png"
      ></avatar-upload>
    </div>
  </div>
</template>
<script>
import * as api from '../../api/api'
import avatarUpload from 'vue-image-crop-upload/upload-2.vue'

export default {
  components: {
    'avatar-upload': avatarUpload,
  },
  data() {
    return {
      lastUserName: '',
      userInfo: null,
      showAvatarCutter: false,
    }
  },
  methods: {
    showAvatarDialog() {
      this.showAvatarCutter = true
    },
    cropUploadSuccess(response) {
      console.log(response)
      if (response.code === api.success_code) {
        this.$message.success(response.message)
        this.userInfo.avatar =
          this.blog_constants.baseUrl+'/portal/image/' + response.data.id
        console.log(this.userInfo.avatar)
      } else {
        this.$message.error(response.message)
      }
    },
    cropUploadFail() {
      this.$message.error('上传失败')
    },

    updateUserInfo() {
      if (this.userInfo.userName === '') {
        this.$message.error('用户名不能为空')
        return
      }
      // 检查数据
      if (this.lastUserName === this.userInfo.userName) {
        //如果当前的用户名没有修改
        this.doUpdateInfo()
      } else {
        //如果当前的用户名已经修改过再去检查有没有有没有重名
        api.checkUserName(this.userInfo.userName).then((result) => {
          if (result.code === api.fail_code) {
            this.doUpdateInfo()
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
    doUpdateInfo() {
      if (this.userInfo.avatar === '') {
        this.$message.error('头像不可以为空')
        return
      }
      api.updateUserInfo(this.userInfo, this.userInfo.id).then((result) => {
        if (result.code === api.success_code) {
          this.getUserInfo()
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      })
    },
    toUpdateEmailPage() {
      this.$router.push({
        path: '/settings/email',
      })
    },
    getUserInfo() {
      api.checkToken().then((result) => {
        if (result.code === api.success_code) {
          this.userInfo = result.data
          this.lastUserName = this.userInfo.userName
        } else {
          this.$message.error(result.message)
        }
      })
    },
  },
  mounted() {
    this.getUserInfo()
  },
}
</script>
<style>
.settings-user-info-box {
  width: 425px;
}

.update-email {
  margin-top: 10px;
}

.user-info-avatar {
  display: inline-block;
}

.user-avatar-container {
  width: 75px;
  cursor: pointer;
}
</style>