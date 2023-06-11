import utils from '{src}/utils/utils'

// socket 实例
let socket = null
// socket uri 服务端地址
const { VITE_SOCKET_URI } = import.meta.env

// socket 连接
const connect = (uri = null, params = {}, protocols) => {

    // 处理服务端地址
    uri = !utils.is.empty(uri) ? uri : VITE_SOCKET_URI

    // 额外的连接参数
    if (!utils.is.empty(params)) {
        if (typeof params === 'string') uri += `?${params}`
        else if (typeof params === 'object') {
            // object 转 url 参数
            const array = []
            for (const key in params) array.push(`${key}=${params[key]}`)
            uri += `?${array.join('&')}`
        }
    }

    return (socket = !socket ? new WebSocket(uri, protocols) : socket)
}

// socket open 事件
const open = (callback = null) => {

    socket.onopen = (event) => {
        // 回调函数
        if (typeof callback === 'function') callback(event)
    }
}

// socket close 事件
const close = (callback = null) => {

    socket.onclose = (event) => {
        // 回调函数
        if (typeof callback === 'function') callback(event)
    }
}

// socket error 事件
const error = (callback = null) => {

    socket.onerror = (event) => {
        // 回调函数
        if (typeof callback === 'function') callback(event)
    }
}

// socket 发送消息
const send = (data = {}) => {

    try {

        // socket 未连接
        if (socket.readyState !== 1) return console.log('socket 未连接')

        socket.send(JSON.stringify(data))

    } catch (error) {

        // socket 未初始化
        return console.log('socket 未初始化')
    }
}

// socket 接收消息
const message = (callback = null) => {

    socket.onmessage = (event) => {
        // 回调函数
        if (typeof callback === 'function') callback(event.data)
    }
}

// socket on 事件
const on = (event = null, callback = null) => {

    if (event === null || typeof callback !== 'function') return

    socket[`on${event}`] = (event) => {
        // 回调函数
        if (typeof callback === 'function') callback(event)
    }
}

export default {
    connect, open, close, error, send, message, on
}