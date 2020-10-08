const app = getApp()
// components/numtool/numtool.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        num: {
            type: Number,
            value: 1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        add() {
            this.setData({
                num: this.data.num + 1
            })
            this.triggerEvent('numadd', { num: this.data.num })
        },
        less() {
            const lessBeforeNum = this.data.num
            if (this.data.num > 1) {
                this.setData({
                    num: this.data.num - 1
                })
            }
            this.triggerEvent('numless', { num: this.data.num, lessBeforeNum })
        }
    }
})
