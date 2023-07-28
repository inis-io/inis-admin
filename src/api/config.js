import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'

const config = {
    one: (key = null) => {

        return new Promise((resolve, reject) => {

            if (utils.is.empty(key)) return resolve(null)

            // 缓存名称
            const cacheName = `config-${key}`

            // 读取缓存
            if (cache.has(cacheName)) return resolve(cache.get(cacheName))

            // 请求数据
            axios.get('/api/config/one', { key }).then(({ code, data }) => {

                if (code !== 200) return resolve(null)

                // 缓存数据
                cache.set(cacheName, data, inis.cache)
                resolve(data)

            }).catch(reject)
        })
    }
}

export default config
