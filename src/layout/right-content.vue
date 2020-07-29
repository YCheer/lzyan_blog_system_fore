<template>
  <div>
    <div class="content-title-box">这里是右边内容</div>
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {}
</script>

<style>
.content-title-box {
  padding: 10px;
  border-bottom: #e6e6e6 solid 1px;
}

.content-container-box {

  padding: 10px;
}
</style>