<template>
  <div class="settings-web-info-box">
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item label="网站名称">
        <el-input type="text" v-model="webSizeTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字">
        <el-input type="text" v-model="keywords" placeholder="关键字请用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input v-model="desrctption" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSeoInfo">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from '../../api/api'

export default {
  data() {
    return {
      webSizeTitle: '',
      keywords: '',
      desrctption: '',
      oldInfo: {
        webSizeTitle: '',
        keywords: '',
        desrctption: '',
      },
    }
  },
  mounted() {
    this.getWebSizeInfo()
    this.getWebSizeTitle()
  },
  methods: {
    updateSeoInfo() {
      //检查数据
      if (this.webSizeTitle === '') {
        this.$message.error('网站标题不可以为空')
        return
      }
      if (this.keywords === '') {
        this.$message.error('关键字不可以为空')
        return
      }
      if (this.desrctption === '') {
        this.$message.error('网站的描述不能为空')
        return
      }
      //如果是更新seo的信息的话，就不做标题更新的提示
      //   seo关键字描述不一一样的时候
      let isSeoInfoUpdate = false
      if (
        this.desrctption !== this.oldInfo.desrctption ||
        this.keywords !== this.oldInfo.keywords
      ) {
        isSeoInfoUpdate = true
        api.updateSeoInfo(this.desrctption, this.keywords).then((result) => {
          if (result.code === api.success_code) {
            // 更细成功
            this.$message.success(result.message)
            this.getWebSizeInfo()
          }
        })
      }
      if (this.webSizeTitle !== this.oldInfo.webSizeTitle) {
        //更新标题
        api.updateWebSizeTitle(this.webSizeTitle).then((result) => {
          if (result.code === api.success_code) {
            if (!isSeoInfoUpdate) {
              this.$message.success(result.message)
            }

            this.getWebSizeTitle()
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
    getWebSizeInfo() {
      api.getSeoInfo().then((result) => {
        if (result.code === api.success_code) {
          this.keywords = result.data['web_size_keywords']
          this.desrctption = result.data['web_size_description']
          this.oldInfo.keywords = this.keywords
          this.oldInfo.desrctption = this.desrctption
        } else {
          this.$message.error(result.message)
        }
      })
    },
    getWebSizeTitle() {
      api.getWebSizeTitle().then((result) => {
        if (result.code === api.success_code) {
          this.webSizeTitle = result.data.value
          this.oldInfo.webSizeTitle = this.webSizeTitle
        } else {
          this.$message.error(result.message)
        }
      })
    },
  },
}
</script>
<style>
.settings-web-info-box .el-input,
.settings-web-info-box .el-textarea {
  width: 500px;
}
</style>