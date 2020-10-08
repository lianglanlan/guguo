import api from '../../libs/api'
const app = getApp()

Page({
    onLoad() {
        this.check()
    },
    async formSubmit(e) {
        //登录验证逻辑
        const { username, password } = e.detail.value
        if (username && password) { //输入用户名与密码后
            try {
                const { data } = await api.login(username, password)
                if (data && data.status === 'succ') {    //登录成功
                    const { userid } = data
                    const loginInfo = {
                        username,
                        password,
                        userid,
                        date: Date.now()
                    }
                    wx.setStorage({
                        key: 'loginInfo',
                        data: loginInfo
                    })
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                    app.globalData.userId = loginInfo.userid
                } else {
                    app.toast('您输入的账号密码有误，请重新输入哦~')
                }

            } catch (error) {
                wx.showToast({
                    title: error,
                    duration: 1000,
                    icon: 'none'
                })
                app.toast('登录数据请求失败，请稍后再试')
            }
        } else {    //没有输入，toast提示用户
            app.toast('请输入用户名与密码')
        }
    },
    async check() {   //验证是否已登录
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
                }
            }
        }
    },
    getUserInfo(e) {
        app.globalData.userInfo = e.detail.userInfo
    }
})