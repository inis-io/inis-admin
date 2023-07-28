import cache from 'lscache'
import utils from '{src}/utils/utils'
import crypto from '{src}/utils/crypto'

const iv  = crypto.token('inis-iv', 16, 'cache')
const key = crypto.token('inis-key', 16, 'cache')
const AES = crypto.AES(key, iv)

export default {
    get: key => {
        const value = cache?.get(key)
        if (utils.is.empty(value)) return value
        return JSON.parse(AES.decrypt(value))
    },
    set: (key, value, unix = 0) => {
        cache?.set(key, AES.encrypt(JSON.stringify(value)), unix)
    },
    has: key => !utils.is.empty(cache?.get(key)),
    del: cache?.remove,
    clear: cache?.flush,
}