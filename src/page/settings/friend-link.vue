<template>
  <div class="settings-friend-link-box">
    <div class="friend-link-list-box">
      <el-table :data="links" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="250"></el-table-column>
        <el-table-column label="链接名称" width="250">
          <template slot-scope="scope">
            <a class="friend-link-title" :href="scope.row.url" target="_blank">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column label="logo" width="250">
          <template slot-scope="scope">
            <el-image
              fit="cover"
              :src="scope.row.logo"
              class="friend-links-image"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.state ==='0'">
              <el-tag type="danger" size="mini">不可用</el-tag>
            </div>
            <div v-if="scope.row.state ==='1'">
              <el-tag type="success" size="mini">正 常</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed prop="order" label="顺序" width="80"></el-table-column>
        <el-table-column label="创建日期" width="220">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="220">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="friend-link-action-bar">
      <el-button type="primary" @click="showFriendLinkDialog">添加链接</el-button>
    </div>

    <div class="friend-link-dialog-box">
      <el-dialog :title="friendEditorTitle" :visible.sync="friendDialogShow" width="500px">
        <div>
          <el-form label-width="100px">
            <el-form-item label="网站名称">
              <el-input v-model="link.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="link.url"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="link.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-form-item>
                <el-select v-model="link.state" placeholder="请选择状态">
                  <el-option label="删除" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="logo">
              <div class="friend-link-image-upload" @click="showLinkLogoDialog">
                <i class="el-icon-plus" v-if="link.logo===''"></i>
                <el-image v-else :src="link.logo"></el-image>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="editorClose">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleLoopEditorCommit()"
          >{{friendLinkEditorDialogCommitText}}</el-button>
        </span>
      </el-dialog>
      <avatar-upload
        field="file"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="showLinkLogoCutter"
        :width="200"
        :height="200"
        url="/admin/image/link"
        img-format="png"
      ></avatar-upload>

      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="400px">
        <span>你确定要删除这个友情链接吗？</span>
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
import avatarUpload from 'vue-image-crop-upload/upload-2.vue'

export default {
  components: {
    'avatar-upload': avatarUpload,
  },
  data() {
    return {
      showLinkLogoCutter: false,
      friendLinkEditorDialogCommitText: '添加',
      friendDialogShow: false,
      friendEditorTitle: '添加友情链接',
      links: [],
      loading: false,
      link: {
        id: '',
        name: '',
        logo: '',
        order: 0,
        state: '1',
        url: '',
      },
      targetDeleteId: '',
      deleteDialogShow: false,
    }
  },
  methods: {
    deleteItem(item) {
      this.targetDeleteId = item.id
      this.deleteDialogShow = true
    },
    doDeleteItem() {
      api.deleteFriendLink(this.targetDeleteId).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listLinks()
          this.targetDeleteId = ''
          this.deleteDialogShow = false
        } else {
          this.$message.error(result.message)
        }
      })
    },
    edit(item) {
      this.friendLinkEditorDialogCommitText = '更新'
      this.friendEditorTitle = '更新友情链接'
      // 回显数据
      this.link.name = item.name
      this.link.logo = item.logo
      this.link.order = item.order
      this.link.state = item.state
      this.link.url = item.url
      this.link.id = item.id
      // 弹窗
      this.friendDialogShow = true
    },
    showLinkLogoDialog() {
      this.showLinkLogoCutter = true
    },
    cropUploadSuccess(response) {
      console.log(response)
      if (response.code === api.success_code) {
        this.$message.success(response.message)
        this.link.logo = response.data.id
        console.log(this.userInfo.avatar)
      } else {
        this.$message.error(response.message)
      }
    },
    cropUploadFail() {
      this.$message.error('上传失败')
    },
    showFriendLinkDialog() {
      this.friendLinkEditorDialogCommitText = '添加'
      this.friendEditorTitle = '添加友情链接'
      this.friendDialogShow = true
    },
    editorClose() {
      this.friendDialogShow = false
    },
    handleLoopEditorCommit() {
      // 添加
      // 检查内容'
      if (this.link.name === '') {
        this.$message.error('友情链接名称不能为空')
        return
      }
      if (this.link.url === '') {
        this.$message.error('友情链接不能为空')
        return
      }
      if (this.link.logo === '') {
        this.$message.error('Logo不能为空')
        return
      }
      // 判断是更新还是添加，如果有id 就是更新
      if (this.link.id !== '') {
        //更新
        //提交数据
        api.updarteFriendLink(this.link, this.link.id).then((result) => {
          if (result.code === api.success_code) {
            this.friendDialogShow = false
            this.$message.success(result.message)
            this.listLinks()
            // 重置内容
            this.restLink()
          } else {
            this.$message.error(result.message)
          }
        })
      } else {
        //提交数据
        api.postFriendLink(this.link).then((result) => {
          if (result.code === api.success_code) {
            this.friendDialogShow = false
            this.$message.success(result.message)
            this.listLinks()
            // 重置内容
            this.restLink()
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },

    restLink() {
      this.link.name = ''
      this.link.url = ''
      this.link.logo = ''
      this.link.order = 1
      this.link.state = '1'
    },
    listLinks() {
      this.loading = true
      api.listFriendLinks().then((result) => {
        if ((result.code = api.success_code)) {
          console.log(result)
          this.links = result.data
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
    this.listLinks()
  },
}
</script>
<style>
.friend-links-image img {
  width: 165px;
  height: 75px;
  border: #83def3 solid 1px;
  padding: 4px;
  border-radius: 5px;
}

.friend-link-title {
  text-decoration: none;
}

.friend-link-image-upload {
  text-align: center;
  cursor: pointer;
  width: 60px;
  height: 40px;
  border: #dfdfdf dashed 1px;
}

.friend-link-action-bar {
  margin: 25px;
  float: right;
}

.friend-link-list-box .el-table {
  min-height: 350px;
}
</style>