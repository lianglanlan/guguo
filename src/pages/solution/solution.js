import api from '../../libs/api'

const app = getApp()

Page({
    data: {
        solutionItemList: [],
        curPage: 0
    },
    onLoad(options) {
        const solutionId = options.id
        this.setData({
            solutionId
        })
        this.getData()
    },

    onReachBottom() {

    },
    async getData() {
        let { curPage, solutionId } = this.data
        const page = curPage + 1
        this.setData({
            loading: true
        })
        try {
            const { data } = await api.solution.list(solutionId, page)
            if (data) {
                let { hasNext, solution, solutionItemList } = data
                if (solutionItemList) {
                    solutionItemList = this.data.solutionItemList.concat(solutionItemList)
                }
                this.setData({
                    hasNext, solution, solutionItemList,
                    curPage: page,
                    loading: false
                })
            } else {
                app.toast('解决方案数据获取出错，请重试')
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    }
})