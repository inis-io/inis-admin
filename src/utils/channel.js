// 跨标签页通信
class channel {
    constructor(name = 'default') {
        this.bc = new BroadcastChannel(name)
    }

    on(callback) {
        this.bc.onmessage = (event) => {
            callback(event.data)
        }
    }

    emit(data) {
        this.bc.postMessage(data)
    }

    close() {
        this.bc.close()
    }
}

export default channel