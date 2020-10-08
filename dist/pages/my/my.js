const app = getApp()
import api from '../../libs/api'
Page({
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setAvatar()
        this.getInfo()
    },
    setAvatar() {
        let avatarUrl = 'https://www.maitiandian.com/upload/55B3B2C16B9AE9FDC80F63BDCD017A69.png'
        this.setData({
            avatarUrl
        })
        app.globalData.avatarUrl = avatarUrl
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            avatarUrl = res.userInfo.avatarUrl
                            this.setData({
                                avatarUrl
                            })
                            app.globalData.avatarUrl = avatarUrl
                        }
                    })
                }
            }
        })
    },
    async getInfo() {
        const { userId } = app.globalData
        try {
            const { data } = await api.my.info(userId)
            if (data) {
                const { service, charge } = data
                this.setData({
                    service,
                    charge
                })
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    }
})