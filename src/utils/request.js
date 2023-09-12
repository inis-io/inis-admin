import axios from 'axios'
import utils from '{src}/utils/utils'

// 设置超时
axios.defaults.timeout = 60 * 1000
axios.defaults.baseURL = !utils.is.empty(globalThis?.inis?.api?.uri) ? globalThis?.inis?.api?.uri : ''

// 请求拦截
//   所有的网络请求都会先走这个方法
axios.interceptors.request.use(
    config => {
        if (!utils.is.empty(globalThis?.inis?.api?.key)) {
            config.headers['i-api-key'] = globalThis?.inis?.api?.key
        }
        let TOKEN_NAME = !utils.is.empty(globalThis?.inis?.token_name) ? globalThis?.inis?.token_name : 'INIS_LOGIN_TOKEN'
        if (utils.has.cookie(TOKEN_NAME)) {
            let token = utils.get.cookie(TOKEN_NAME)
            if (!utils.is.empty(token)) {
                config.headers.Authorization = token
            }
        }
        return config
    },
    error  => Promise.reject(error)
)

// 响应拦截
//   所有的网络请求返回数据之后都会先执行这个方法
axios.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
)

export default {
    // all
    all: async array => await axios.all(array),

    // GET请求
    get: async (url, params = {}, config = {}) => await axios.get(url, { params, ...config }),

    // DELETE请求
    del: async (url, params = {}, config = {}) => await axios.delete(url, { params, ...config }),

    // PUT请求
    put: async (url, data = {}, config = {}) => await axios.put(url, data, config),

    // POST请求
    post: async (url, data = {}, config = {}) => await axios.post(url, data, config),
}