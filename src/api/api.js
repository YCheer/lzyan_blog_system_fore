import http from './http'

export const success_code = 20000;
export const fail_code = 40000;


// 解析token
export const checkToken = () => {
    return http.requestGet('/user/check-token')
}

// 登录
export const doLogin = (verifyCode, verifyKey, blogUser) => {
    return http.requestPost('/user/login/' + verifyCode + '/' + verifyKey + '?from=p_', blogUser)
}

// 获取分类列表
export const listCategories = () => {
    return http.requestGet('/admin/category/list')
}

// 删除分类
export const deleteCategoryById = (categoryId) => {
    return http.requestDelete('/admin/category/' + categoryId)
}

// 添加分类
export const postCategory = (category) => {
    return http.requestPost('/admin/category', category)
}


// 更新分类
export const updateCategory = (categoryId, category) => {
    return http.requestPut('/admin/category/' + categoryId, category)
}

// 获取轮播图列表
export const listLoop = () => {
    return http.requestPost('/admin/loop/list')
}

// 上传轮播图信息     
export const postLoop = (loop) => {
    return http.requestPost('/admin/loop', loop)
}

// 删除轮播图
export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/loop/' + loopId)
}

// 更新轮播图
export const updateLoop = (loopId, loop) => {
    return http.requestPut('/admin/loop/' + loopId, loop)
}


// 获取用户列表
export const listUsers = (page, size) => {
    return http.requestGet('/user/list?page=' + page + '&size=' + size)
}


// 根据条件获取用户列表
export const doUserSearch = (userName, email) => {
    return http.requestGet('/user/list?page=1&size=10&userName=' + userName + '&email=' + email)
}


// 根据条件获取用户列表
export const deleteUsersById = (userId) => {
    return http.requestDelete('/user/' + userId)
}

// 获取邮箱验证码
export const getVerifyCOde = (emailAddress, type) => {
    return http.requestGet('/user/verify_code?email=' + emailAddress + '&type=' + type)
}

// 更新邮箱地址
export const updateEmailAddress = (emailAddress, verifyCode) => {
    return http.requestPut('/user/email?email=' + emailAddress + '&verify_code=' + verifyCode)
}

// 检查用户名是否重复
export const checkUserName = (userName) => {
    return http.requestGet('/user/user_name?userName=' + userName)
}

// 更新用户信息
export const updateUserInfo = (userInfo, userId) => {
    return http.requestPut('/user/user_info/' + userId, userInfo)
}


// 拿seo信息
export const getSeoInfo = () => {
    return http.requestGet('/admin/web_size_info/seo')
}

export const getWebSizeTitle = () => {
    return http.requestGet('/admin/web_size_info/title')
}

// 更新网站的标题
export const updateWebSizeTitle = (title) => {
    return http.requestPut('/admin/web_size_info/title?title=' + title)
}

// 更新网站的se0
export const updateSeoInfo = (description, keywords) => {
    return http.requestPut('/admin/web_size_info/seo?description=' + description + '&keywords=' + keywords)
}

// 获取友情链接
export const listFriendLinks = () => {
    return http.requestGet('/admin/friend_link/list')
}

// 添加友情链接
export const postFriendLink = (link) => {
    return http.requestPost('/admin/friend_link', link)
}

// 更新友情链接
export const updarteFriendLink = (link, linkId) => {
    return http.requestPut('/admin/friend_link/' + linkId, link)
}

// 删除友情链接
export const deleteFriendLink = (linkId) => {
    return http.requestDelete('/admin/friend_link/' + linkId)
}