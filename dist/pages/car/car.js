const { default: api } = require("../../libs/api")

// pages/car.js
const app = getApp()

Page({
    onLoad(options) {
        this.getRecommend()
    },
    onShow() {
        wx.hideLoading()
        this.updateCar()
    },
    updateCar() {
        const { carList, orderAgain } = app.globalData
        if (orderAgain) {
            if (orderAgain.item) {
                let list = [], length = 0, priceTotal = 0
                orderAgain.item.map(item => {
                    list.push({
                        checked: true,
                        imgSrc: item.imgSrc,
                        name: item.name,
                        price: item.currentPrice,
                        num: item.num
                    })
                    length += item.num
                    priceTotal += (item.currentPrice * item.num)
                })
                this.setData({
                    list,
                    length,
                    priceTotal: Math.round(priceTotal * 100) / 100
                })
                app.globalData.carList = { list, length, priceTotal }
                app.globalData.orderAgain = ''
            }
        } else if (carList) {
            const { list, length } = carList
            if (list) {
                let priceTotal = 0, orPriceTotal = 0
                list.map(item => {
                    if (typeof item.checked != 'boolean') {  //已有checked选项，不需要添加，没有时添加true
                        item.checked = true
                    }
                    if (item.checked) {
                        priceTotal += (item.price * item.num)
                        orPriceTotal += (item.originalPrice * item.num)
                    }
                })
                this.setData({
                    list,
                    length,
                    orPriceTotal: Math.round(orPriceTotal * 100) / 100,
                    priceTotal: Math.round(priceTotal * 100) / 100
                })
                app.globalData.carList = { list, length, priceTotal, orPriceTotal }
            }
        }
        if (app.globalData.carList && app.globalData.carList.length) {
            wx.setTabBarBadge({
                index: 1,
                text: app.globalData.carList.length.toString()
            })
        }
    },
    //选中框有修改
    carChange(e) {
        const checkedLength = e.detail.value.length
        if (checkedLength === 0) {
            this.setData({
                btnDisabled: true
            })
        } else {
            this.setData({
                btnDisabled: false
            })
        }
    },
    //选中框点击事件
    checkboxTap(e) {
        const { index } = e.currentTarget.dataset
        let { list, priceTotal, orPriceTotal } = this.data
        list.find((item, i) => {
            if (i === index) {
                item.checked = !item.checked
                if (item.checked) {
                    priceTotal += item.price * item.num
                    orPriceTotal += item.originalPrice * item.num
                } else {
                    priceTotal -= item.price * item.num
                    orPriceTotal -= item.originalPrice * item.num
                }
                return item
            }
        })
        orPriceTotal = Math.round(orPriceTotal * 100) / 100
        priceTotal = Math.round(priceTotal * 100) / 100

        this.setData({
            list,
            orPriceTotal,
            priceTotal
        })
        let checkedList = [], checkedCarLength = 0
        list.map(item => {
            if (item.checked) {
                checkedList.push(item)
                checkedCarLength += item.num
            }
        })
        app.globalData.carList = {
            ...app.globalData.carList,
            checkedList,
            checkedCarLength,
            checkedPriceTotal: priceTotal,
            checkedOrPriceTotal: orPriceTotal
        }
    },
    numChange(e) {
        const { num } = e.detail
        const { index } = e.currentTarget.dataset
        let { list, orPriceTotal, priceTotal, length } = this.data
        list.find((item, i) => {
            if (i == index) {
                //判断是否选中
                if (item.checked) {
                    //改价格
                    priceTotal += item.price * (num - item.num)
                    orPriceTotal += item.originalPrice * (num - item.num)
                }
                //改list的length
                length += (num - item.num)
                //改item的num
                item.num = num
                return item
            }
        })
        this.setData({
            list,
            orPriceTotal: Math.round(orPriceTotal * 100) / 100,
            priceTotal: Math.round(priceTotal * 100) / 100,
            length
        })

        app.globalData.carList = { list, length, priceTotal, orPriceTotal }

        wx.setTabBarBadge({
            index: 1,
            text: app.globalData.carList.length.toString()
        })
    },
    numless(e) {
        const { num, lessBeforeNum } = e.detail
        const { index } = e.currentTarget.dataset
        let { list, length, orPriceTotal, priceTotal, } = this.data
        if (lessBeforeNum == 1) {
            wx.showModal({
                content: '确定不要了吗',
                success: (res) => {
                    if (res.confirm) {
                        //判断是否选中
                        if (list[index].checked) {
                            //修改价格
                            priceTotal -= list[index].price
                            orPriceTotal -= list[index].originalPrice
                        }

                        //从list中删除商品
                        list.splice(index, 1)
                        length -= 1
                        this.setData({
                            list,
                            orPriceTotal: Math.round(orPriceTotal * 100) / 100,
                            priceTotal: Math.round(priceTotal * 100) / 100,
                            length
                        })
                        app.globalData.carList = { list, length, priceTotal, orPriceTotal }
                        //如果购物车length大于0 ，tabbar添加角标
                        if (length > 0) {
                            wx.setTabBarBadge({
                                index: 1,
                                text: app.globalData.carList.length.toString()
                            })
                        } else { //小于等于0，清除角标
                            wx.removeTabBarBadge({
                                index: 1
                            })
                        }
                    }
                }
            })
        } else {
            this.numChange(e)
        }
    },
    numadd(e) {
        this.numChange(e)
    },
    numInputChange(e) {
        this.numChange(e)
    },
    //获取为你推荐数据
    async getRecommend() {
        try {
            const { data } = await api.car.recommend()
            if (data) {
                const { recommendList } = data
                this.setData({
                    recommendList
                })
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    productTap(e) {  //产品点击事件，展示详情
        const { detail } = e.currentTarget.dataset
        this.setData({ detail })
    },
    itemAddCar(e) {
        const { carItem } = e.currentTarget.dataset
        carItem.num ? '' : carItem.num = 1
        app.addCar(carItem)
        this.updateCar()
    },
    async order() {
        wx.showLoading()
        try {
            const { data } = await api.address.list(app.globalData.userId)
            if (data) {
                if (data) {
                    const { list } = data
                    //判断list.length，为空进入添加收货页面，不为空，进入订单确认页面
                    if (list.length) {
                        wx.navigateTo({
                            url: '/pages/confirm/confirm'
                        })
                        app.globalData.defaultAddress = list[0]

                    } else {
                        app.globalData.isFirst = true
                        wx.navigateTo({
                            url: '/pages/address/new/new'
                        })
                    }
                }
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    detailAddCar() {
        this.updateCar()
    }
})