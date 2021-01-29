const PREFIX = 'uni_'
const ACCESS_TOKEN = PREFIX + 'ACCESS_TOKEN'
const REFRESH_TOKEN = PREFIX + 'REFRESH_TOKEN'
const TENANT_CODE = PREFIX + 'TENANT_CODE'
const ROLES = PREFIX + 'ROLES'
const USER_INFO = PREFIX + 'USER_INFO'
const SYS_CONFIG = PREFIX + 'SYS_CONFIG'

const USER_DEPART = PREFIX + 'USER_DEPART'
const REMEMBER_ME = PREFIX + 'REMEMBER_ME'
const PERMISSIONS = PREFIX + 'PERMISSIONS'
const VALID = 'VALID'
const INVALID = 'INVALID'

// const HOST_PREFIX = 'http://192.168.0.105'
// const HOST_PREFIX = 'http://192.168.0.105:9180'
const HOST_PREFIX = 'http://192.168.0.106'
// const HOST_PREFIX = 'http://192.168.0.88'
// const HOST_PREFIX = 'http://183.220.240.17:5678'
// const HOST_PREFIX = 'http://eval.dgs.cjiedata.cn:5678'
// const HOST_PREFIX = 'http://122.112.149.193'
// const HOST_PREFIX = ''

// #ifdef APP-PLUS
// #endif

const APP_VERSION_URL = HOST_PREFIX + '/apk/version.json'
const API_HOST = HOST_PREFIX + '/api'
const FILE_HOST = HOST_PREFIX + '/api/user/v1/attachment'
// const VIDEO_URL = FILE_HOST + '/preview?id='
const PREVIEW_HOST = FILE_HOST + '/preview?id='
const DOWNLOAD_HOST = FILE_HOST + '/download?id='
const UPDATE_URL = HOST_PREFIX + '/apk/version.json'

export {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TENANT_CODE,
  ROLES,
  USER_INFO,
  SYS_CONFIG,
  USER_DEPART,
  REMEMBER_ME,
  PERMISSIONS,
  API_HOST,
  FILE_HOST,
  DOWNLOAD_HOST,
  PREVIEW_HOST,
  APP_VERSION_URL,
  UPDATE_URL,
  VALID,
  INVALID
}
