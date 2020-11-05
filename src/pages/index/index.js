import api from '../../libs/api'

//获取应用实例
const app = getApp()

Page({
    data: {
        vertical: false,
        autoplay: true,
        interval: 2000,
        duration: 500,
        statusBarHeight: app.globalData.statusBarHeight,
        navigationBarHeight: app.globalData.navigationBarHeight,
        curPage: 0,
        productList: [],
        solutionList: [],
        searchHidden: true,
        deleteHidden: true,
        recommendList: []
    },
    onLoad(options) {
        this.getMainData()
    },
    onShow() {
        if (app.globalData.carList && app.globalData.carList.length) {
            wx.setTabBarBadge({
                index: 1,
                text: app.globalData.carList.length.toString()
            })
        } else {
            wx.removeTabBarBadge({
                index: 1
            })
        }
    },
    onHide() {
        this.setData({
            detail: false
        })
    },
    searchTap() {
        this.setData({
            searchHidden: false,
            historyList: wx.getStorageSync('historyList') || []
        })
        if (!this.data.recommendList.length) {
            this.getRecommend()
        }
    },
    searchCancle() {
        this.setData({
            searchHidden: true,
            searchValue: '',
            search: {},
            deleteHidden: true
        })
    },
    //获取首页数据
    async getMainData() {
        try {
            const { data } = await api.home.main()
            if (data) {
                let { cateList } = data
                let curCate
                if (cateList) {
                    cateList = cateList.slice(0, 8)
                    curCate = cateList[0]
                }
                this.setData({
                    ...data,
                    cateList,
                    curCate
                })
                this.getProductList(curCate.id)
            } else {
                app.toast('首页数据获取出错，请重试')
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    //获取首页产品列表数据
    async getProductList(id) {
        let { curPage } = this.data
        const page = curPage + 1
        this.setData({
            loading: true
        })

        try {
            const { data } = await api.home.product(id, page)
            if (data) {
                let { productList, solutionList, hasNext } = data
                //产品
                if (productList) {
                    productList = this.data.productList.concat(productList)
                }
                //产品解决方案
                if (solutionList) {
                    solutionList = solutionList.concat(this.data.solutionList)
                }
                this.setData({
                    productList,
                    solutionList,
                    hasNext,
                    curPage: page,
                    loading: false
                })
            } else {
                app.toast('首页产品数据获取出错，请重试')
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    //获取搜索推荐列表数据
    async getRecommend() {
        try {
            const { data } = await api.search.recommend()
            if (data) {
                const { recommendList } = data
                if (recommendList) {
                    this.setData({ recommendList })
                }
            }
        } catch (error) {
            app.toast(error.toString())
            console.log(error)
        }
    },
    changeCate(id) {
        this.setData({
            productList: [],
            solutionList: [],
            curPage: 0
        })
        this.getProductList(id)
    },
    cateTap(e) {
        const { curCate } = e.currentTarget.dataset
        this.setData({
            curCate,
        })
        this.changeCate(curCate.id)
    },
    //副banner点击，展示产品解决方案
    bannerTap() {
        const id = this.data.banner.cateId
        //获取列表数据
        this.changeCate(id)
        //设置curCate
        const { cateList } = this.data
        const curCate = cateList.find((item) => {
            if (item.id == id) {
                return item
            }
        })
        this.setData({
            curCate,
            id: `_${id}`
        })
    },

    loadNextPage() {
        if (!this.data.hasNext) return	//没有数据了
        const { id } = this.data.curCate
        this.getProductList(id)
    },
    productTap(e) {  //产品点击事件，展示详情
        const { detail } = e.currentTarget.dataset
        this.setData({
            detail
        })
    },
    //加购物车
    itemAddCar(e) {
        const { carItem } = e.currentTarget.dataset
        carItem.num ? '' : carItem.num = 1
        app.addCar(carItem)
    },
    async searchInput(e) {
        const query = e.detail.value
        if (query) {
            this.setData({
                deleteHidden: false
            })
            try {
                const { data } = await api.search.list(query)
                if (data) {
                    this.setData({
                        search: data
                    })
                } else {
                    app.toast('获取搜索结果列表失败')
                }
            } catch (error) {
                app.toast(error.toString())
                console.log(error)
            }
        }
    },
    deleteInput() {
        this.setData({
            searchValue: '',
            deleteHidden: true
        })
    },
    searchItemTap(e) {
        //关闭搜索页
        this.searchCancle()
        //查看详情
        const { detail } = e.currentTarget.dataset
        this.setData({ detail })
        //加入历史记录
        //1.获取已有历史记录
        const { historyList } = this.data
        //2.去重
        if (historyList.length) {
            const index = historyList.findIndex(item => item.id === detail.id)
            if (index > -1) {
                historyList.splice(index, 1)
            }
        }
        //3.判断数量
        if (historyList.length > 8) {
            historyList.pop()
        }
        //4.加新item
        historyList.unshift(detail)
        wx.setStorageSync('historyList', historyList)
    },
    deleteHistory() {
        wx.setStorageSync('historyList', [])
        this.setData({ historyList: [] })
    },
    //横滑模块点击
    swiperTap(e) {
        const { swiper } = e.currentTarget.dataset
        if (swiper.product) { //展示详情
            this.setData({
                detail: swiper.product
            })
        } else if (swiper.messageUrl) {
            //有messageUrl
            wx.navigateTo({
                url: `/pages/solution/detail/detail?url=${swiper.messageUrl}`
            })
        } else if (swiper.cateId) {
            const id = swiper.cateId
            //获取列表数据
            this.changeCate(id)
            //设置curCate
            const { cateList } = this.data
            const curCate = cateList.find((item) => {
                if (item.id == id) {
                    return item
                }
            })
            this.setData({
                curCate,
                id: `_${id}`
            })
        }
    },
    historyTap(e) {
        this.productTap(e)
        this.searchCancle()
    }
})
