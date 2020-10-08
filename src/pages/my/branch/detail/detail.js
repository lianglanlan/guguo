const app = getApp()
import api from '../../../../libs/api'

Page({
    data: {
        curPage: 0,
        list: []
    },
    onLoad(options) {
        const { id } = options
        this.setData({
            id
        })
        this.getData()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (!this.data.hasNext) return	//没有数据了
        this.getData()
    },
    init() {
        this.setData({
            curPage: 0,
            list: [],
            hasNext: ''
        })
    },
    beginTimeChange(e) {
        this.setData({
            beginTime: e.detail.value
        })
        if (this.data.endTime) {
            this.init()
            this.getData()
        }
    },
    endTimeChange(e) {
        this.setData({
            endTime: e.detail.value
        })
        if (this.data.beginTime) {
            this.init()
            this.getData()
        }
    },
    async getData() {
        let { id, curPage, beginTime, endTime } = this.data
        const page = curPage + 1
        beginTime = beginTime || ''
        endTime = endTime || ''
        this.setData({
            loading: true
        })
        try {
            const { data } = await api.my.fenxiaoList(id, page, beginTime, endTime)
            if (data) {
                let { list, hasNext } = data
                if (list) {
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
    }
})