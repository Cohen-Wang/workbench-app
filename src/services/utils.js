import CryptoJS from 'crypto-js'

/**
 * 将对象 转换为 ?aaa=123&bbb=456
 * @param obj key value对象
 * @return string 生成的字符串
 */
export function objToParams(obj) {
  const params = []
  Object.keys(obj).forEach(eachKey => {
    params.push(eachKey + '=' + obj[eachKey])
  })
  let ret = params.join('&')
  ret = ret ? '?' + ret : ''
  return ret
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    const num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    const [length] = arguments
    // 生成指定长度的随机数字，首位一定不是 0
    const nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    const [min, max] = arguments
    return random(min, max)
  }
  return Number.NaN
}

export function covertMenuToMap(menu) {
  // TODO: 改成递归调用写法
  return menu.reduce((obj, e) => {
    if (e.children && e.children.length) {
      e.children = e.children.reduce((child, childE) => {
        if (childE.children && childE.children.length) {
          childE.children = childE.children.reduce((subChild, subChildE) => {
            subChild[subChildE.meta.title] = subChildE.children || true
            return subChild
          }, {})
        }
        child[childE.meta.title] = childE.children || true
        return child
      }, {})
    }
    obj[e.meta.title] = e.children || true
    return obj
  }, {})
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  const { data, type, param } = params
  let { key } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      const data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      const iv = key
      const encrypted = CryptoJS.AES.encrypt(
        data,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

// 补零
function PadZero(str) {
  return new RegExp(/^\d$/g).test(str) ? `0${str}` : str
}

/**
 * 格式化秒
 * @param _seconds
 * @returns {string}
 */
export const formatTime = (_seconds) => {
  _seconds = parseInt(_seconds)
  let result = ''
  const seconds = parseInt(_seconds % 60)
  const mins = parseInt(_seconds % 3600 / 60)
  const hours = parseInt(_seconds / 3600)

  // if (hours) {
  //   result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
  // } else {
  //   result = `${PadZero(mins)}:${PadZero(seconds)}`
  // }
  result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
  // console.log(result)
  return result
}
