import notyf from '{src}/utils/notyf'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'

// 获取页面权限列表
const GetAuthPagesColumn = async () => {
    // 缓存名称
    const cacheName = 'AuthPagesColumn'
    // 如果缓存中有数据，直接返回
    if (utils.has.session(cacheName)) return Object.values(utils.get.session(cacheName))
    // 请求数据
    const { code, data } = await axios.get('/api/auth-pages/column',{
        field: 'name,path,icon,svg,size'
    })
    if (code !== 200) return null
    // 设置缓存
    utils.set.session(cacheName, data)
    return data
}

export default {
    get: {
        // 获取页面权限列表
        AuthPagesColumn: GetAuthPagesColumn
    },
    del: {
        // 删除页面权限列表缓存
        AuthPagesColumn: () => utils.clear.session('AuthPagesColumn')
    }
}