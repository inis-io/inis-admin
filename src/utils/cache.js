import cache from 'lscache'
import utils from '{src}/utils/utils'
import crypto from '{src}/utils/crypto'

const iv  = crypto.token('inis-iv', 16, 'cache')
const key = crypto.token('inis-key', 16, 'cache')
const AES = crypto.AES(key, iv)
// 是否加密
const encrypt   = true

export default {
    get: key => {
        const value = cache?.get(key)
        if (utils.is.empty(value)) return value
        if (!encrypt) return value
        try {
            return JSON.parse(AES.decrypt(value))
        } catch (e) {
            cache?.remove(key)
            return null
        }
    },
    set: (key, value, unix = 0) => {
        if (!encrypt) return cache?.set(key, value, unix)
        cache?.set(key, AES.encrypt(JSON.stringify(value)), unix)
    },
    has: key => !utils.is.empty(cache?.get(key)),
    del: cache?.remove,
    clear: cache?.flush,
}