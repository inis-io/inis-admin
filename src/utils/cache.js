import cache from 'lscache'
import utils from '{src}/utils/utils'
import crypto from '{src}/utils/crypto'

const iv  = crypto.token('inis-comm-iv', 16, 'cache')
const key = crypto.token('inis-comm-key', 16, 'cache')
const AES = crypto.AES(key, iv)
// 是否加密 - 生产环境下加密
const encrypt   = import.meta.env.PROD
// 缓存前缀
const prefix    = '[inis]'

export default {
    get: key => {
        key = prefix + key
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
        key = prefix + key
        if (!encrypt) return cache?.set(key, value, unix)
        cache?.set(key, AES.encrypt(JSON.stringify(value)), unix)
    },
    has: key => !utils.is.empty(cache?.get(prefix + key)),
    del: key => cache?.remove(prefix + key),
    clear: cache?.flush,
}