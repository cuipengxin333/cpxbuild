import { createVNode, render } from 'vue'
import Toast from '../components/Toast/index.vue'

interface ToastOptions {
    message: string
    type?: 'info' | 'success' | 'error'
    duration?: number
}

const showToast = ({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = createVNode(Toast, { message, type, duration })

    render(vnode, container)

    setTimeout(() => {
        render(null, container)
        document.body.removeChild(container)
    }, duration + 500)
}

export default {
    install(app: any) {
        app.config.globalProperties.$toast = showToast
    }
}
