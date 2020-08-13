<template>
  <div class="category-box clear-fix">
    <div class="category-list-box">
      <el-table :data="categories" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200"></el-table-column>
        <el-table-column prop="name" label="分类名称" width="120"></el-table-column>
        <el-table-column prop="pinyin" label="拼音" width="200"></el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.status ==='0'">
              <el-tag type="danger" size="mini">已删除</el-tag>
            </div>
            <div v-if="scope.row.status ==='1'">
              <el-tag type="success" size="mini">正 常</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
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
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
    <div class="category-action-bar">
      <el-button type="primary" @click="showAddCategory()" class="add-category-btn">添加分类</el-button>
    </div>

    <div class="category-dialog-box">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="400px">
        <span>你确定要删除: {{deleteMessage}} 这个分类吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加/编辑分类的dialog -->
      <el-dialog :title="editTitle" :visible.sync="editorDialogShow" width="500px">
        <div class="category-editor-box">
          <el-form label-width="80px">
            <el-form-item label="分类名称">
              <el-input v-model="category.name"></el-input>
            </el-form-item>
            <el-form-item label="分类拼音">
              <el-input v-model="category.pinyin"></el-input>
            </el-form-item>
            <el-form-item label="分类描述">
              <el-input
                v-model="category.description"
                type="textarea"
                :rows="2"
                resize="none"
                maxlength="88"
              ></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="category.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-form-item>
                <el-select v-model="category.status" placeholder="请选择状态">
                  <el-option label="删除" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="onEditorClose()">取 消</el-button>
          <el-button size="mini" type="primary" @click="postCategory()">{{editCommitText}}</el-button>
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
      categories: [],
      deleteDialogShow: false,
      deleteMessage: '',
      deleteTargetId: '',
      editorDialogShow: false,

      editTitle: '编辑分类',
      editCommitText: '修改分类',
      category: {
        id: '',
        name: '',
        description: '',
        order: 1,
        pinyin: '',
        status: '1',
      },
    }
  },
  methods: {
    onEditorClose() {
      this.editorDialogShow = false
      this.resetCategory()
    },
    edit(item) {
      // 赋值，最好的做法是请求带个数据，再显示，数据回显。因为这里只是一个人编辑可以这么操作，但是如果这是一个可以多人编辑的系统那就会出现脏读了 dity read
      // 显示dialog
      this.category.name = item.name
      this.category.description = item.description
      this.category.pinyin = item.pinyin
      this.category.status = item.status
      this.category.order = item.order
      this.category.id = item.id
      this.editorDialogShow = true
      this.editTitle = '编辑分类'
      this.editCommitText = '修改分类'
    },
    deleteItem(item) {
      //不是立马删除，是警告提示
      this.deleteDialogShow = true
      this.deleteMessage = item.name
      this.deleteTargetId = item.id
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    doDeleteItem() {
      api.deleteCategoryById(this.deleteTargetId).then((result) => {
        if (result.code === api.success_code) {
          this.$message({
            type: 'success',
            center: true,
            message: result.message,
          })
        }
        this.listCategories()
      })
      this.deleteDialogShow = false
    },
    listCategories() {
      //去获取分类列表
      this.loading = true
      api.listCategories().then((result) => {
        this.loading = false
        if (result.code === api.success_code) {
          this.categories = result.data
        }
      })
    },
    showAddCategory() {
      this.editTitle = '添加分类'
      this.editCommitText = '添 加'
      this.editorDialogShow = true
    },
    postCategory() {
      //检查内容
      if (this.category.name === '') {
        this.showWarning('分类名称不可以为空')
        return
      }
      if (this.category.description === '') {
        this.showWarning('分类描述不可以为空')
        return
      }
      if (this.category.pinyin === '') {
        this.showWarning('分类拼音不可以为空')
        return
      }
      //如果有id的就是更新的
      //如果没有id的就是添加的
      if (this.category.id === '') {
        //提交数据
        api.postCategory(this.category).then((result) => {
          if (result.code === api.success_code) {
            this.$message({
              type: 'success',
              center: true,
              message: result.message,
            })
            this.editorDialogShow = false
            //刷新列表
            this.listCategories()
            //重置数据
            this.resetCategory()
          } else {
            this.showWarning(result.message)
          }
        })
      } else {
        api.updateCategory(this.category.id, this.category).then((result) => {
          if (result.code === api.success_code) {
            this.$message.success(result.message)
            this.editorDialogShow = false
            this.listCategories()
            this.resetCategory()
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
    showWarning(msg) {
      this.$message({
        message: msg,
        type: 'warning',
        center: true,
      })
    },
    resetCategory() {
      this.category.name = ''
      this.category.pinyin = ''
      this.category.order = 1
      this.category.id = ''
      this.category.status = '1'
      this.category.description
    },
  },
  mounted() {
    this.listCategories()
  },
}
</script>
<style>
.category-list-box .cell {
  text-align: center;
}

.category-list-box .el-table {
  min-height: 350px;
}

.category-action-bar {
  margin: 25px;
  float: right;
}
</style>