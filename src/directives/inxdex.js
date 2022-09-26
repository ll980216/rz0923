export const imgerror = {
    inserted(el, binding, vnode) {
        // 操作的DOM
        console.log(el)
        // 指令的信息
        console.log(binding)
        // 虚拟
        console.log(vnode)
        el.onerror = function () {
            el.src= binding.value
        }
    }
}