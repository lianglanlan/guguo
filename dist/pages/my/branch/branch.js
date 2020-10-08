import api from '../../../libs/api'
const app = getApp()

Page({
    data: {
    },
    onLoad: function (options) {
        this.setData({
            avatarUrl: app.globalData.avatarUrl
        })
        this.getList()
    },
    async getList() {
        const { userId } = app.globalData
        try {
            const { data } = await api.my.fenxiao(userId)
            if (data) {
                const { list } = data
                this.setData({
                    list
                })
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    }
})