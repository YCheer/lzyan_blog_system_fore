<template>
  <div class="loop-box">
    <div class="loop-action-bar">
      <el-button type="primary" @click="showAddLoop()">添加轮播图</el-button>
    </div>
    <div class="loop-list-box">
      <el-table :data="loops" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="250"></el-table-column>
        <el-table-column label="标题" width="250">
          <template slot-scope="scope">
            <a class="loop-title" :href="scope.row.targetUrl" target="_blank">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column label="轮播图" width="250">
          <template slot-scope="scope">
            <el-image fit="cover" :src="scope.row.imageUrl" class="loop-image"></el-image>
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
    <div class="loop-dialog-box">
      <el-dialog :title="loopEditorTitle" :visible.sync="loopDialogShow" width="500px">
        <div>
          <el-form label-width="100px">
            <el-form-item label="轮播图标题">
              <el-input v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="loop.targetUrl"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="loop.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-form-item>
                <el-select v-model="loop.state" placeholder="请选择状态">
                  <el-option label="删除" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                class="avatar-uploader"
                action="/admin/image"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload()"
              >
                <el-image fit="cover" v-if="loop.imageUrl!==''" :src="loop.imageUrl" class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="editorClose">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleLoopEditorCommit()"
          >{{loopEditorCommitText}}</el-button>
        </span>
      </el-dialog>
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="400px">
        <span>你确定要删除这个轮播图吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as dateUtils from '../../utils/date'
import * as api from '../../api/api'

export default {
  data() {
    return {
      loopEditorCommitText: '添 加',
      loopDialogShow: false,
      loopEditorTitle: '添加轮播图',
      loading: false,
      loops: [],
      loop: {
        id: '',
        order: 1,
        state: '1',
        title: '',
        targetUrl: '',
        imageUrl: '',
      },
      deleteLoopId: '',
      deleteDialogShow: false,
    }
  },
  methods: {
    editorClose() {
      this.loopDialogShow = false
      this.resetloop()
    },
    handleLoopEditorCommit() {
      //添加记录
      //检查数据
      if (this.loop.title === '') {
        this.$message.error('轮播图标题不能为空')
        return
      }
      if (this.loop.targetUrl === '') {
        this.$message.error('目标Url不能为空')
        return
      }
      if (
        !this.loop.targetUrl.startsWith('http://') &&
        !this.loop.targetUrl.startsWith('https://')
      ) {
        this.$message.error('目标Url格式错误')
        return
      }
      if (this.loop.imageUrl === '') {
        this.$message.error('封面不能为空')
        return
      }
      //判断是更新还是添加
      //如果有id就是更新
      //否则就是添加
      if (this.loop.id === '') {
        //提交数据
        api.postLoop(this.loop).then((result) => {
          this.loopDialogShow = false
          if (result.code === api.success_code) {
            this.$message.success(result.message)
            // 更新列表
            this.listLoop()
            this.resetloop()
          } else {
            this.$message.error(result.message)
          }
        })
      } else {
        //修改i
        api.updateLoop(this.loop.id, this.loop).then((result) => {
          if (result.code === api.success_code) {
            this.loopDialogShow = false
            this.listLoop()
            this.resetloop()
            this.$message.success(result.message)
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },

    resetloop() {
      this.loop.id = ''
      this.loop.order = 1
      this.loop.state = '1'
      this.loop.title = ''
      this.loop.targetUrl = ''
      this.loop.imageUrl = ''
    },

    uploadSuccess(response) {
      if (response.code === api.success_code) {
        //上传成功
        //回显图片
        this.loop.imageUrl =
          'http://127.0.0.1:8088/portal/image/' + response.data.id
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
    },
    beforeUpload() {},

    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    showAddLoop() {
      this.loopDialogShow = true
    },
    deleteItem(item) {
      this.deleteLoopId = item.id
      this.deleteDialogShow = true
    },
    doDeleteItem() {
      api.deleteLoop(this.deleteLoopId).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listLoop()
          this.deleteDialogShow = false
        }
      })
    },
    edit(item) {
      //数据回显
      this.loopEditorCommitText = '修改'
      this.loopDialogShow = true
      this.loopEditorTitle = '修改轮播图信息'
      this.loop.id = item.id
      this.loop.title = item.title
      this.loop.state = item.state
      this.loop.targetUrl = item.targetUrl
      this.loop.imageUrl = item.imageUrl
      this.loop.order = item.order
    },
    listLoop() {
      this.loading = true
      api.listLoop().then((result) => {
        this.loading = false
        if (result.code === api.success_code) {
          console.log(result)
          this.loops = result.data
        }
      })
    },
  },
  mounted() {
    this.listLoop()
  },
}
</script>
<style>
.loop-list-box .cell {
  text-align: center;
}

.loop-title {
  text-decoration: none;
}

.loop-image {
  width: 165px;
  height: 75px;
  border: #83def3 solid 1px;
  padding: 4px;
  border-radius: 5px;
}

.loop-dialog-box .avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: #83def3 dashed 1px;
  border-radius: 5px;
}

.loop-dialog-box .el-upload img {
  width: 178px;
  height: 178px;
  border-radius: 5px;
}
</style>