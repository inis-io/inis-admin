import { Notyf } from 'notyf'

const notyf = new Notyf({
    position: { x: 'right', y: 'top' },
    dismissible: true,
    duration: 2000,
    background: 'rgb(134 133 239)',
    types: [{
        type: 'warning',
        background: 'orange',
        icon: {
            className: 'notyf__icon--warning',
            tagName: 'i',
            text: ''
        }
    },{
        type: 'info',
        background: 'rgb(134 133 239)',
        icon: {
            className: 'notyf__icon--info',
            tagName: 'i',
            text: ''
        }
    }]
})

export default {
    warn: (message, config) => notyf.open({
        message, type: 'warning', ...config
    }),
    info: (message, config) => notyf.open({
        message, type: 'info', ...config
    }),
    success: (message, config) => notyf.open({
        message, type: 'success', ...config
    }),
    error: (message, config) => notyf.open({
        message, type: 'error', ...config
    }),
}