const app = getApp()

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        navigationBarHeight: app.globalData.navigationBarHeight,
    },
    onLoad: function (options) {
        const { orderId } = options
        const { carList } = app.globalData
        const list = carList.confirmList
        const price = carList.confirmPriceTotal
        this.setData({
            orderId,
            list,
            price
        })
    }
})