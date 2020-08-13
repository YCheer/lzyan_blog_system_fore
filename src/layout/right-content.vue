<template>
  <div class="right-content-container">
    <div class="content-title-box margin-bottom-20" v-text="$route.name"></div>
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
}
</script>
<style>
.right-content-container {
  min-width: 1140px;
}

.content-title-box {
  padding: 10px;
  border-bottom: #e6e6e6 solid 1px;
  font-size: 21px;
  font-weight: 550;
  line-height: 30px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.content-container-box {
}
</style>