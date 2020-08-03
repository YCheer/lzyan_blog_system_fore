<template>
  <div>
    <el-menu default-active="0" class="el-menu-vertical" :unique-opened="true">
      <!-- 遍历菜单内容 -->
      <template v-for="(item,index) in menuList">
        <router-link :to="item.path" v-if="!item.children&&!item.hidden" :key="index">
          <el-menu-item :index="index+''">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </router-link>
        <el-submenu v-if="item.children&&!item.hidden" :key="index" :index="index+''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <router-link
            :to="item.path+'/'+subItem.path"
            v-for="(subItem,subIndex) in item.children"
            :key="subIndex"
          >
            <el-menu-item :index="index+'-'+subIndex" v-if="!subItem.hidden">
              <i :class="subItem.icon"></i>
              <span v-text="subItem.name"></span>
            </el-menu-item>
          </router-link>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { routes } from '../router'

export default {
  data() {
    return {
      menuList: [],
    }
  },
  mounted() {
    let menuList = routes[0]
    this.menuList = menuList.children
    // console.log(menuList.children)
  },
}
</script>
<style>
.el-menu-vertical a {
  text-decoration: none;
}
</style>