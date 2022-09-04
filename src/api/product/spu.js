import request from '@/utils/request'

// 获取SPU列表数据的接口
// /admin/product/{page}/{limit}   get   page limit category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'GET', params: { category3Id }})

// 获取SPU信息
// /admin/product/getSpuById/{spuId}   get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'GET' })

//  获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList  get
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'GET' })

// 获取SPU图片的接口  ⭐️⭐️831 spi以及spu里面的sku
// /admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })

// 获取平台全部销售属性----整个平台销售属性一共三个
// GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'GET' })

// 🌼830修改SPU||添加SPU：对于修改或者添加，携带给服务器参数大致一样的，唯一的区别就是携带的参数是否带id
// 添加不带，修改带id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 修改spu
  if (spuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 🌼831 删除spu的请求
// /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// sku模块
// ⭐️831
// 🌼spu.js里面一样的接口   🌸获取SPU图片的接口

// 🌸 获取销售属性的数据
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'GET' })

// 🌸attr.js里面一样的接口 获取平台属性接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'GET'
})

// 🌼添加sku /admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 🌼901！！！获取SKU列表数据的接口
// GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
