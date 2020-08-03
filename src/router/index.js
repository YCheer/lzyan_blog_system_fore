import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter);
/**
 * 导入内容
 */
//登录页面
const login = () => import("@/page/login/login");
//内容部分
const postArticle = () => import("@/page/content/post-article");
const articleManage = () => import("@/page/content/manage-article");
const imageManage = () => import("@/page/content/manage-image");
const commentManage = () => import("@/page/content/manage-comment");
//首页
const index = () => import("@/page/dashbord/index");
//运营
const categoryManage = () => import("@/page/operation/manage-category");
const loopManage = () => import("@/page/operation/loop");
//设置
const friendLink = () => import("@/page/settings/friend-link");
const webSizeInfo = () => import("@/page/settings/websize-info");
//用户
const email = () => import("@/page/user/email");
const info = () => import("@/page/user/info");
const list = () => import("@/page/user/list");
const resetPassword = () => import("@/page/user/reset-password");
// 布局
const baseView = () => import("@/layout/base-view");
const rightView = () => import("@/layout/right-content");

export const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: '首页',
                icon: 'el-icon-s-home',
                hidden: false,
                component: index
            },
            {
                path: '/content',
                hidden: false,
                name: '内容',
                icon: 'el-icon-s-order',
                component: rightView,
                children: [
                    {
                        path: 'post-article',
                        name: '发表文章',
                        hidden: false,
                        icon: 'el-icon-edit',
                        component: postArticle
                    },
                    {
                        path: 'manage-article',
                        name: '文章管理',
                        hidden: false,
                        icon: 'el-icon-s-unfold',
                        component: articleManage
                    },
                    {
                        path: 'manage-comment',
                        name: '评论管理',
                        hidden: false,
                        icon: 'el-icon-s-fold',
                        component: commentManage
                    },
                    {
                        path: 'manage-image',
                        name: '图片管理',
                        hidden: false,
                        icon: 'el-icon-picture-outline',
                        component: imageManage
                    }
                ]
            },
            {
                path: '/user',
                name: '用户',
                hidden: false,
                icon: 'el-icon-user',
                component: rightView,
                children: [
                    {
                        path: 'list',
                        name: '用户列表',
                        icon: 'el-icon-notebook-2',
                        hidden: false,
                        component: list
                    },
                    {
                        path: 'reset-password',
                        name: '密码重置',
                        hidden: false,
                        icon: 'el-icon-s-ticket',
                        component: resetPassword
                    },
                    {
                        path: 'email',
                        name: '邮箱设置',
                        hidden: false,
                        icon: 'el-icon-message',
                        component: email
                    },
                    {
                        path: 'info',
                        name: '用户信息',
                        hidden: false,
                        icon: 'el-icon-info',
                        component: info
                    }
                ]
            },
            {
                path: '/operation',
                name: '运营',
                hidden: false,
                icon: 'el-icon-s-operation',
                component: rightView,
                children: [
                    {
                        path: 'category',
                        name: '分类管理',
                        hidden: false,
                        icon: 'el-icon-bangzhu',
                        component: categoryManage
                    },
                    {
                        path: 'loop',
                        name: '轮播图管理',
                        hidden: false,
                        icon: 'el-icon-picture-outline-round',
                        component: loopManage
                    }
                ]
            },
            {
                path: '/settings',
                hidden: false,
                name: '设置',
                icon: 'el-icon-setting',
                component: rightView,
                children: [
                    {
                        path: 'web-size-info',
                        name: '网站信息',
                        hidden: false,
                        icon: 'el-icon-message-solid',
                        component: webSizeInfo
                    },
                    {
                        path: 'friend-link',
                        name: '友情链接',
                        hidden: false,
                        icon: 'el-icon-cold-drink',
                        component: friendLink
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: login,
    }
];

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

export default router;