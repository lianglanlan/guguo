const app = getApp()
import api from '../../libs/api'

Page({
    onLoad() {
        const { carList, defaultAddress } = app.globalData
        const { list, checkedList, checkedPriceTotal, priceTotal, checkedOrPriceTotal, orPriceTotal } = carList
        let confirmList = checkedList || list
        let confirmPriceTotal = checkedPriceTotal || priceTotal
        let confirmOrPriceTotal = checkedOrPriceTotal || orPriceTotal
        this.setData({
            confirmList,
            confirmPriceTotal,
            confirmOrPriceTotal,
            defaultAddress
        })
        app.globalData.carList.confirmList = confirmList
        app.globalData.carList.confirmPriceTotal = confirmPriceTotal
    },
    onShow() {
        const { choiceAddress } = app.globalData
        if (choiceAddress) {
            this.setData({
                defaultAddress: choiceAddress
            })
            app.globalData.choiceAddress = ''
        }
    },
    async orderConfirm() {
        wx.showLoading({
            title: '加载中',
        })
        const { userId } = app.globalData
        const { id } = this.data.defaultAddress
        let productInfo = {}
        this.data.confirmList.map(item => {
            productInfo[item.id] = item.num
        })
        try {
            const { data } = await api.order.save(userId, id, productInfo)
            if (data && data.status === true) {
                wx.hideLoading()
                console.log('下单成功')
                const { orderId } = data
                wx.navigateTo({
                    url: `/pages/success/success?orderId=${orderId}`
                })
                //下单成功，清除这些产品购物车
                let list = [], priceTotal = 0, orPriceTotal = 0, length = 0
                app.globalData.carList.list.map(item => {
                    if (!item.checked) {
                        list.push(item)
                        priceTotal += (item.price * item.num)
                        orPriceTotal += (item.originalPrice * item.num)
                        length += item.num
                    }
                })
                const { carList } = app.globalData
                app.globalData.carList = {
                    ...carList,
                    list, length, priceTotal, orPriceTotal
                }
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    }
})