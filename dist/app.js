import api from './libs/api.js'

//app.js
App({
    onLaunch() {
        this.getSystemInfo()
        this.checklogin()
    },
    onShow() {
        this.checklogin()
    },
    async checklogin() {
        //验证是否登录
        const loginInfo = wx.getStorageSync('loginInfo')
        if (loginInfo) { //有登录缓存信息
            //没有过期
            if (Date.now() - loginInfo.date < 7 * 24 * 60 * 60 * 1000) {
                //登录验证
                const { data } = await api.login(loginInfo.username, loginInfo.password)
                if (data && data.status === 'succ') {    //登录成功，进入首页
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                    return
                }
            }
        }
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    globalData: {
        userId: wx.getStorageSync('loginInfo').userid,
        carList: {
            list: [],
            length: 0
        }
    },
    getSystemInfo() {
        wx.getSystemInfo({
            success: res => {
                //获取基础库版本号，兼容处理
                // if (compareVersion(res.SDKVersion, '1.9.0') < 0) {
                //     wx.showModal({
                //         title: '提示',
                //         content: '你的微信版本过低，可能无法正常使用此小程序的服务，请更新微信到最新版本'
                //     })
                // }
                //IOS下不显示充值
                if (res.platform == 'ios') {	//ios系统
                    this.globalData.isIos = true
                    this.globalData.statusBarHeight = res.statusBarHeight
                } else {
                    this.globalData.statusBarHeight = res.statusBarHeight + 4
                }
                this.globalData.navigationBarHeight = this.globalData.statusBarHeight + 44
            },
            fail() {
                console.log('获取设备信息失败')
            }
        })
    },
    toast(mes) {
        wx.showToast({
            title: mes,
            duration: 1000,
            icon: 'none'
        })
    },
    addCar(addItem) {
        const { carList } = this.globalData
        if (carList.list.length) {    //如果有购物车列表，查重
            let flag = true
            const list = carList.list.map((item, index) => {
                if (item.id === addItem.id) {
                    item.num += addItem.num
                    flag = false
                }
            })
            if (flag) {
                carList.list.push(addItem)
            }
        } else { //无购物车列表，直接添加
            carList.list.push(addItem)
        }
        carList.length += addItem.num
        wx.setTabBarBadge({
            index: 1,
            text: this.globalData.carList.length.toString()
        })
    }
})