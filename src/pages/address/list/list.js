import api from '../../../libs/api'
import wxp from '../../../libs/wxp'

//获取应用实例
const app = getApp()

Page({
    data: {

    },
    onLoad: function (option) {
        const { source } = option
        this.setData({
            source
        })
        this.getListData()
    },
    onShow() {
        this.getListData()
    },
    onReachBottom: function () {

    },
    async getListData() {
        try {
            const { data } = await api.address.list(app.globalData.userId)
            if (data) {
                const { list } = data
                this.setData({ list })
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    editTap(e) {
        app.globalData.tempAddress = e.currentTarget.dataset.address
    },
    itemtap(e) {
        if (this.data.source === 'confirm') {
            //选择完成，返回确认订单页，将选择项记载至app.globalData
            const { choiceAddress } = e.currentTarget.dataset
            app.globalData.choiceAddress = choiceAddress
            wx.navigateBack()
        }
    }
})