import wxp from './wxp'

const api_test = 'https://www.maitiandian.com/tower/mp'

const api_prefix = api_test

function getData(apiPath, params, options) {
    const dataParams = Object.assign({}, params)
    return wxp.request({
        url: api_prefix + apiPath,
        data: {
            ...dataParams
        },
        ...options
    })
}

export default {
    login: (username, password) => getData('/login', { username, password }),
    home: {
        main: () => getData('/home'),
        product: (cateId, page) => getData('/home/productList', { cateId, page })
    },
    solution: {
        list: (solutionId, page) => getData('/solution/list', { solutionId, page }),
        detail: (id) => getData('/solution/detail', { id })
    },
    search: {
        list: (query) => getData('/search', { query }),
        recommend: () => getData('/search/recommend')
    },
    detail: (productId) => getData('/detail', { productId }),
    car: {
        recommend: () => getData('/car/recommend')
    },
    address: {
        list: (userId) => getData('/address/list', { userId }),
        save: (addressId, userId, gender, isDefault, name, phone, address, doorNo) => getData('/address/saveAndUpdate', { addressId, userId, gender, isDefault, name, phone, address, doorNo })
    },
    order: {
        save: (userId, addressId, productInfo) => getData('/order/save', { userId, addressId, productInfo }),
        list: (userId, page) => getData('/order/list', { userId, page }),
        cancel: (userId, orderId) => getData('/order/cancel', { userId, orderId })
    },
    my: {
        info: (userId) => getData('/my/info', { userId }),
        fenxiao: (userId) => getData('/my/fenxiao', { userId }),
        fenxiaoList: (userId, page, beginTime = '', endTime = '') => getData('/my/fenxiaoList', { userId, page, beginTime, endTime })
    }
}