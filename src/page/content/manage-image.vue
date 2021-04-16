<template>
  <div>
    <div class="image-list-box margin-bottom-20">
      <el-table :data="images" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200"></el-table-column>
        <el-table-column label="图片" width="280">
          <template slot-scope="scope">
            <el-image
              fit="cover"
              class="image-manager-item"
              :src="scope.row.url"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.state ==='0'">
              <el-tag type="primary" size="mini">删除</el-tag>
            </div>
            <div v-if="scope.row.state ==='1'">
              <el-tag type="success" size="mini">正常</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="original" label="来源" width="100"></el-table-column>
        <el-table-column prop="contentType" label="图片类型" width="100"></el-table-column>

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
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="image-list-page-navigation">
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
    <div class="image-list-dialog">
      <el-dialog title="删除提示" :visible.sync="deleteDialogShow" width="300px">
        <span>你确定要删除这张图片吗？</span>
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
      deleteDialogShow: false,
      images: [],
      loading: false,
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
      },
      targetDeleteImageId: '',
    }
  },
  methods: {
    deleteItem(item) {
      this.deleteDialogShow = true
      this.targetDeleteImageId = item.id
    },
    doDeleteItem() {
      api.deleteImageById(this.targetDeleteImageId).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message)
          this.listImages()
        } else {
          this.$message.error(result.message)
        }
        this.deleteDialogShow = false
      })
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page
      this.listImages()
    },
    listImages() {
      this.loading = true
      api
        .listImages(
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize,
          ''
        )
        .then((result) => {
          console.log(result)
          if (result.code === api.success_code) {
            this.images = result.data.content
            this.pageNavigation.currentPage = result.data.number + 1
            this.pageNavigation.totalCount = result.data.totalElements
            this.pageNavigation.pageSize = result.data.size
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
    this.listImages()
  },
}
</script>
<style>
.image-manager-item img {
  width: 165px;
  height: 75px;
  border: #83def3 solid 1px;
  padding: 4px;
  border-radius: 5px;
}

.image-list-box .el-table {
  min-height: 350px;
}
</style>