// 导出API对象
import config from '{src}/api/config.js'
import authPages from '{src}/api/auth-pages'
class API {
    constructor() {
        this.config = config
        this['auth-pages'] = authPages
    }
}
export default new API()

