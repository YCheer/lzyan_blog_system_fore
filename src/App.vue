<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.margin-bottom-20 {
  margin-bottom: 20px;
}
.clear-fix {
  overflow: auto;
  zoom: 1;
}

/* #app {
  min-width: 1140px;
} */

a {
  text-decoration: none;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}
</style>
