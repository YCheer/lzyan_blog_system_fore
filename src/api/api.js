import http from './http'

export const success_code = 20000;

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

export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/loop/' + loopId)
}

export const updateLoop = (loopId, loop) => {
    return http.requestPut('/admin/loop/' + loopId, loop)
}