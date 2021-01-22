import Ajax from "./ajax"


const getVtdCode = phone => {
  return Ajax({
    url: '/user/validate/code',
    method: 'POST',
    data: {phone}
  })
}

const loginApi = (phone, vdtCode) => {
  return Ajax({
    url: '/user/app/login',
    method: "POST",
    data: {phone, vdtCode}
  })
}


const userInfoApi = id => {
  return Ajax({
    url: "user/info",
    params: { id }
  })
}

//获取应收账款
const getReceiveMoney = () => {
  return Ajax({
    url: "/analysis/collection"
  })
}

//获取应付账款
const getPayMoney = () => {
  return Ajax({
    url: "/analysis/payable"
  })
}

//上传照片接口
const uploadFileApi = data => {
  return Ajax({
    url: '/base64/upload',
    method: 'POST',
    data
  })
}

//上传文件接口
const formUploadApi = (data, cb) => {
  return Ajax({
      url: '/file/upload/fileTestDir',
      method: 'POST',
      data,
      cb
  })
}

//更改用户信息接口
  const updateUserInfoApi = data => {
    return Ajax({
      url: '/user/update',
      method: 'POST',
      data
    })
  }

  //获取项目列表
  const getProjectListApi = params => {
    return Ajax({
      url: '/project/list',
      params
    })
  }

  // 更新项目列表
  const updateProjectApi = data => {
    return Ajax({
      url: '/project/update',
      method: 'POST',
      data
    })
  }


  //获取供应商列表
  const getApplyListApi = params => {
    return Ajax({
      url: '/supplier/list',
      params
    })
  }

  //更新供应商列表
  const updateSupplyApi = data => {
    return Ajax({
      url: "/supplier/update",
      method: "POST",
      data
    })
  }

  //保存供应商列表
  const saveSupplyApi = data => {
    return Ajax({
      url: "/supplier/save",
      method: "POST",
      data
    })
  }

  //获取城市列表
  const getCityList = () => {
    return Ajax({
      url: '/city/list/info'
    })
  }

  //获取材料列表信息
  const getMaterialList = () => {
    return Ajax({
      url: '/material/list'
    })
  }

  // 更新材料信息
  const updateMaterialApi = data => {
    return Ajax({
      url: "/material/update",
      method: "POST",
      data
    })
  }

  // 保存材料信息
  const saveMaterialApi = data => {
    return Ajax({
      url: "/material/save",
      method: "POST",
      data
    })
  }





  //获取用户列表信息
  const getUserListApi = params => {
    return Ajax({
      url: '/user/list',
      params
    })
  }
  //删除用户信息
  const deleteUserInfo = id => {
    return Ajax({
      url: "/role/delete/" + id,
      method: "POST",
    })
  }

  //获取采购列表信息
  const getCaigouListApi = params => {
    return Ajax({
      url: '/purchase/list',
      params
    })
  }

  //删除采购订单信息
  const deleteCaiGouApl = id => {
    return Ajax({
      url: "/purchase/delete/" + id,
      method: "POST"
    })
  }

  // 采购订单付款
  const caigouPayApi = item => {
    return Ajax({
      url: "/purchase/payment",
      method: "POST",
      data: item
    })
  }

  // 审批采购订单接口
  const shenpiApi = data => {
    return Ajax({
      url: "/purchase/flow",
      method: "POST",
      data

    })
  }

  //获取收货列表信息
  const getShouHuoListApi = params => {
    return Ajax({
      url: '/receiving/list',
      params
    })
  }


export {
  getVtdCode,
  loginApi,
  userInfoApi,
  getReceiveMoney,
  getPayMoney,
  uploadFileApi,
  formUploadApi,
  updateUserInfoApi,
  getProjectListApi,
  updateProjectApi,


  getCityList,
  getMaterialList,
  updateMaterialApi,
  saveMaterialApi,


  getApplyListApi,
  updateSupplyApi,
  saveSupplyApi,

  getCaigouListApi,
  deleteCaiGouApl,
  getUserListApi,
  deleteUserInfo,
  caigouPayApi,
  shenpiApi,
  getShouHuoListApi
}