const app = getApp()
import api from '../../../libs/api'

const QQMapKey = 'BYIBZ-JFUWS-33HOQ-67WJ5-XSZXQ-ERBDT'
const chooseLocation = requirePlugin('chooseLocation')

Page({
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { tempAddress, isFirst } = app.globalData
        if (tempAddress) {
            this.setData({
                tempAddress,
            })
            app.globalData.tempAddress = ''
        }
        if (isFirst) {
            this.setData({
                isFirst
            })
        }
    },
    onShow() {
        const location = chooseLocation.getLocation()
        if (location) {
            const tempAddress = this.data.tempAddress
            const chooseAddress = location.address
            if (tempAddress) {
                tempAddress.address = chooseAddress
                this.setData({
                    tempAddress
                })
            } else {
                this.setData({
                    chooseAddress
                })
            }
        }
    },
    async formSubmit(e) {
        const { value } = e.detail
        let { name, gender, phone, address, doorNo, isDefault } = value
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            app.toast('请填写正确的手机号')
        } else if (!(name && phone && address && doorNo)) {
            app.toast('请填写完整地址信息')
        } else {
            //请求接口
            try {
                //判断是否有id值，如果有，下面接口需传入
                const { tempAddress } = this.data
                isDefault = isDefault[0] ? 1 : 0
                console.log(isDefault)
                let id = ''
                if (tempAddress) {
                    id = tempAddress.id
                }
                const { userId } = app.globalData

                const { data } = await api.address.save(id, userId, gender, isDefault, name, phone, address, doorNo)
                if (data && data.status === true) {
                    //保存成功
                    console.log('地址保存成功')
                    wx.navigateBack()
                }
            } catch (error) {
                app.toast(error.toString())
                console.log(error)
            }
        }
    },
    // 根据经纬度，设置数据
    updateLocation(res) {
        console.log(res)
        let { latitude: lat, longitude: lon } = res
        let data = {
            lat,
            lon
        }
        this.setData(data)
    },
    // 微信api，获取经纬度
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: this.updateLocation,
            fail: (e) => {
                console.log(e)
            }
        })
    },
    map() {
        const key = QQMapKey; //使用在腾讯位置服务申请的key
        const referer = '谷果'; //调用插件的app的名称
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                const location = JSON.stringify({
                    latitude: res.latitude,
                    longitude: res.longitude
                });
                wx.navigateTo({
                    url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
                });
            },
            fail: (e) => {
                console.log(e)
            }
        })
    }
})