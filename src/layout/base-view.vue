<template>
  <div>
    <el-container>
      <el-header id="admin-header-box">
        <topHeader></topHeader>
      </el-header>
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="220px">
          <leftMenu></leftMenu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  mounted() {
    //动态设置侧边菜单的高度
    let leftMenuBox = document.getElementById('left-menu-list-box')
    let adminHeaderBox = document.getElementById('admin-header-box')
    let dy = window.innerHeight - adminHeaderBox.offsetHeight
    // console.log('dy-->' + dy)
    if (leftMenuBox && adminHeaderBox) {
      leftMenuBox.style.height = dy + 'px'
    }
  },
}
</script>

<style>
/* 菜单栏的boder */
/* #left-menu-list-box .el-menu {
  border-right: none;
} */

.el-header {
  background-color: #83def3;
  line-height: 60px;
}

.el-aside {
  border-right: #e6e6e6 solid 1px;
  line-height: 200px;
}

.el-main {
  padding: 20px;
}

.main-container {
  position: absolute;
  top: 60px;
  bottom: 0px;
  width: 100%;
}
</style>