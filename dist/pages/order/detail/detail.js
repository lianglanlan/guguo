const app = getApp()
Page({
    data: {

    },
    onLoad() {
        const detail = app.globalData.orderDetail
        this.setData({ detail })
    },
})