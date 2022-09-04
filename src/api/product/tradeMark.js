/* eslint-disable indent */
// 这个模块主要获取的是品牌管理的数据的模块
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET'
})

// 826 处理添加品牌
// 新增品牌: /admin/product/baseTrademark/save   post  携带两个参数：品牌名称、品牌logo
// 切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

// 修改品牌的
// 修改品牌 /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌logo
// 切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 🔥判断如果要带ID的就是修改按钮
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'PUT', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'POST', data: tradeMark })
    }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => {
    return request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
}
