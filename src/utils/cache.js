import cache from 'lscache'
import utils from '{src}/utils/utils'

export default {
    get: cache?.get,
    set: cache?.set,
    has: (key) => !utils.is.empty(cache?.get(key)),
    del: cache?.remove,
    clear: cache?.flush,
}