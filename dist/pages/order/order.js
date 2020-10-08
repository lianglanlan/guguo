const app = getApp()
import api from '../../libs/api'

Page({
    data: {
        curPage: 0,
        list: []
    },
    onLoad() {
        this.getData()
    },
    onShow: function () {
        this.getData()
    },
    onReachBottom() {
        if (!this.data.hasNext) return	//没有数据了
        this.getData()
    },
    async getData() {
        let { curPage } = this.data
        const page = curPage + 1
        const { userId } = app.globalData
        this.setData({
            loading: true
        })
        try {
            const { data } = await api.order.list(userId, page)
            if (data) {
                let { list, hasNext } = data
                if (list) {
                    list.map(orderItem => {
                        let totalNum = 0
                        orderItem['item'].map(proItem => {
                            totalNum += proItem.num
                        })
                        orderItem.totalNum = totalNum
                    })
                    list = this.data.list.concat(list)
                }
                this.setData({
                    list,
                    hasNext,
                    curPage: page,
                    loading: false
                })
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    detail(e) {
        const { orderDetail } = e.currentTarget.dataset
        app.globalData.orderDetail = orderDetail
    },
    orderAgain(e) {
        const { orderAgain } = e.currentTarget.dataset
        if (orderAgain) {
            app.globalData.orderAgain = orderAgain
            wx.switchTab({
                url: '/pages/car/car'
            })
        } else {
            app.toast('获取此订单详情失败，请稍后重试')
        }
    },
    orderCancle(e) {
        wx.showModal({
            content: '确认取消该笔订单？',
            cancelText: '再想想',
            success: async (res) => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    //请求接口
                    const { userId } = app.globalData
                    const { orderId } = e.currentTarget.dataset
                    try {
                        const { data } = await api.order.cancel(userId, orderId)
                        if (data && data.status === true) {
                            wx.hideLoading()
                            wx.showModal({
                                title: '尊敬的用户',
                                content: '客服已收到您的取消申请，请稍后\r\n如有问题，可在【我的】查看客服及销售联系方式',
                                showCancel: false,
                                confirmText: '知道啦',
                                success(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    }
                                }
                            })
                            //更换订单状态为取消中
                            const { list } = this.data
                            list.map(item => {
                                if (item.orderId == orderId) {
                                    item.status = 2
                                }
                            })
                            this.setData({
                                list
                            })
                        }
                    } catch (error) {
                        app.toast(error.toString())
                        console.log(error)
                    }
                }
            }
        })
    },

})