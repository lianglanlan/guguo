const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        detail: {
            type: Object,
            value: ''
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
        detaiSwiperChange(e) {
            const current = e.detail.current
            let { detail } = this.data
            detail.curSwiperIndex = current + 1
            this.setData({
                detail
            })
        },
        detailClose() {
            this.setData({
                detail: false
            })
        },//详情加购物车
        detailAddCar() {
            const { detail } = this.data
            detail.num ? '' : detail.num = 1
            app.addCar(detail)
            this.triggerEvent('addCar')
            this.detailClose()
        },
        numChange(e) {
            const { detail } = this.data
            detail.num = e.detail.num
            this.setData({
                detail
            })
        },
        numless(e) {
            this.numChange(e)
        },
        numadd(e) {
            this.numChange(e)
        },
        numchange(e) {
            this.numChange(e)
        }
    }
})
