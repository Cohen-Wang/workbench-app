import { ACCESS_TOKEN, API_HOST } from '@/services/constant'
import _uni from '@/services/uni'

const commonRequest = function(method, url, data = {}, header = {}) {
  // header['Authorization'] = 'Bearer ' + uni.getStorageSync('token')
  // header['content-type'] = 'application/json'
  // 重置密码，获取验证码和确定重置按钮，不许去掉token，所以写一个if
  if (url.indexOf('/user/v1/user/sendVcode/') === -1 && url.indexOf('/user/v1/user/forgetPassword') === -1) {
    header['Authorization'] = header['Authorization'] || 'Bearer ' + uni.getStorageSync(ACCESS_TOKEN)
  }
  return new Promise((resolve, reject) => {
    uni.request({
      method: method,
      url: url.includes('http') ? url : API_HOST + url,
      data,
      header: header,
      success: (res) => {
        if (url === '/auth/v1/authentication/deleteToken') return resolve(res)
        if (res.statusCode !== 200 && res.statusCode !== 400) {
          _uni.showToast(res.data.error)
          return reject(res)
        }
        if (res.data.code && res.data.code !== 200) {
          if (res.data.msg === 'Token失效，请重新登录') {
            uni.redirectTo({
              url: '/page/login/login',
              success: () => {
                setTimeout(() => {
                  _uni.showToast('登录已过期,请重新登录.')
                }, 500)
              }
            })
            return reject(res)
          }
          _uni.showToast(res.data.code === 400 ? '用户名或密码错误' : res.data.data)
          return reject(res)
        }
        // if (!res.data.success) {
        //   _uni.showToast(res.data.message)
        //   reject(res)
        // }
        resolve(res)
      },
      fail: (err) => {
        if (url === '/auth/v1/authentication/deleteToken') return resolve(err)
        _uni.showToast(err.errMsg)
        reject(err)
      }
    })
  })
}

export const getAction = function(url, param) {
  return commonRequest('get', url, param)
}
export const postAction = function(url, data, header) {
  return commonRequest('post', url, data, header)
}
export const putAction = function(url, data) {
  return commonRequest('put', url, data)
}
export const deleteAction = function(url, data) {
  return commonRequest('delete', url, data)
}
