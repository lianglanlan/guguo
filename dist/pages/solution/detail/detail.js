import api from '../../../libs/api'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id, url } = options
        if (id) {
            this.getData(id)
        }
        if (url) {
            this.setData({
                url
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    async getData(id) {
        try {
            const { data } = await api.solution.detail(id)
            if (data) {
                this.setData({
                    ...data
                })
            } else {
                app.toast('解决方案详情数据获取出错，请重试')
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    }
})