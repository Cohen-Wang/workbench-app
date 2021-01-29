import { getAction, postAction, putAction } from '@/services/uni-request'
import { encryption, randomLenNum } from '@/services/utils'
import qs from 'qs'

const basicAuthorization = 'Basic d2ViX2FwcDpzcHJpbmctbWljcm9zZXJ2aWNlLWV4YW0tc2VjcmV0'

const apiService = {
  loginByUsername({ username, password }) {
    const aaa = {
      code: '',
      randomStr: randomLenNum(null, true),
      rememberMe: false
    }
    const { identifier, credential, code, randomStr } = encryption({
      data: Object.assign({}, { identifier: username, credential: password }, aaa),
      key: '1234567887654321',
      param: ['credential']
    })
    const params = { username: identifier, credential, code, randomStr, grant_type: 'password', scope: 'read' }
    const url = `/auth/oauth/token?${qs.stringify(params)}`
    return postAction(url, {}, { 'Authorization': basicAuthorization })
  },
  logout() {
    // const url = `/auth/v1/authentication/removeToken`
    const url = `/auth/v1/authentication/deleteToken`
    return postAction(url)
  },
  // +-----------------------------------------------------------------------------------------------
  // | 重置密码
  // +-----------------------------------------------------------------------------------------------
  // 发送验证码
  getCode(phone) {
    const url = `/user/v1/user/sendVcode/${phone}`
    return putAction(url)
  },
  // 重置密码
  forgetPassword(query) {
    const url = `/user/v1/user/forgetPassword`
    return putAction(url, query)
  },
  // ...
  getMyProfile() {
    const url = `/user/v1/user/info`
    return getAction(url)
  },
  getSysConfig() {
    const url = `/user/v1/sysConfig`
    return getAction(url)
  },
  updatePassword({ identifier, oldPassword, newPassword }) {
    const url = `/user/v1/user/anonymousUser/updatePassword`
    return putAction(url, { identifier, oldPassword, newPassword })
  },
  updateMyProfile(id, data = {}) {
    const url = `/user/v1/user/updateInfo`
    return putAction(url, { id, ...data })
  },
  getCourseCategory() {
    const params = { order: 'descending', sort: 'id' }
    const url = `/exam/v1/CourseCategory/categories?${qs.stringify(params)}`
    return getAction(url)
  },
  // getCourseList(data = {}) {
  //   const params = { pageNum: 1, pageSize: 9999, status: 0, ...data }
  //   const url = `/exam/v1/course/courseList?${qs.stringify(params)}`
  //   return getAction(url)
  // },
  getCourseList(data = {}, body = {}) {
    const params = { pageNum: 1, pageSize: 9999, status: 0, ...data }
    const url = `/exam/v1/course/courseList?${qs.stringify(params)}`
    return postAction(url, body)
  },
  getCourseDetail(data = {}) {
    const url = `/exam/v1/course/getOne?${qs.stringify(data)}`
    return getAction(url)
  },
  getExaminationCategory() {
    const params = { pageNum: 1, pageSize: 9999, order: 'descending', sort: 'id' }
    const url = `/exam/v1/examinationCategory/categories?${qs.stringify(params)}`
    return getAction(url)
  },
  getExaminationList(data = {}) {
    const params = { pageNum: 1, pageSize: 9999, status: 0, ...data }
    const url = `/exam/v1/examination/examinationList?${qs.stringify(params)}`
    return getAction(url)
  },
  // 课程学习 - 交互时间
  changeStudyTime(params) { // 修改课程学习时间
    const url = `/exam/v1/courseStudyRecord`
    return postAction(url, params)
  },
  // 获取pdf学习时长
  getStudyLength(param) {
    const url = `/exam/v1/courseStudyRecord/getStudy`
    return getAction(url, param)
  },
  getErrorBookList(data = {}) {
    const params = { pageNum: 1, pageSize: 9999, ...data }
    const url = `/exam/v1/answer/wrong/page?${qs.stringify(params)}`
    return getAction(url)
  },
  getExamRecordList(data = {}) {
    const params = { pageNum: 1, pageSize: 9999, ...data }
    const url = `/exam/v1/examRecord/examRecordList?${qs.stringify(params)}`
    return getAction(url)
  },
  getCourseStudyRecord(data = {}) {
    const params = { pageNum: 1, pageSize: 9999, sort: 'id', order: 'descending', ...data }
    const url = `/exam/v1/courseStudyRecord/page?${qs.stringify(params)}`
    return getAction(url)
  },
  getExamDetail(examId) {
    const url = `/exam/v1/examination/${examId}`
    return getAction(url)
  },
  getSystemTime() {
    const url = `/exam/v1/examRecord/currentTime`
    return getAction(url)
  },
  getAnswerSheet(examinationId, userId, examRecordId) {
    const url = `/exam/v1/examination/subjectIds?${qs.stringify({ examinationId, userId, examRecordId })}`
    return getAction(url)
  },
  getQuestionById(examRecordId, subjectId, nextType = -1) {
    const url = `/exam/v1/subject/subjectAnswer?${qs.stringify({ examRecordId, subjectId, nextType })}`
    return getAction(url)
  },
  getQuestionBySubjectId(subjectId) {
    const url = `/exam/v1/answer/getOne/${subjectId}`
    return getAction(url)
  },
  saveAndGetNext(param = {}, data = {}) {
    const url = `/exam/v1/answer/saveAndNext?${qs.stringify(param)}`
    return postAction(url, data)
  },
  startExam(examinationId, userId) {
    const url = `/exam/v1/examRecord/start`
    return postAction(url, { examinationId, userId })
  },
  submitExam(examRecordId, examinationId, userId) {
    const url = `/exam/v1/answer/submit`
    return postAction(url, { examRecordId, examinationId, userId })
  },
  getMessageList({ receiveId, pageNum = 1, pageSize = 9999, status }) {
    const url = `/user/v1/message/messageList?${qs.stringify({ receiveId, status, pageNum, pageSize })}`
    return getAction(url)
  },
  getUnreadMessageCount(receiveId) {
    const url = `/user/v1/message/unRead/${receiveId}`
    return getAction(url)
  },
  markMessageAsRead(messageId) {
    const url = `/user/v1/message`
    return putAction(url, { id: messageId, status: 1 })
  },
  // 获取考试记录详情
  getExamRecordDetail(examId) {
    const url = `/exam/v1/examRecord/${examId}/details`
    return getAction(url)
  },
  // 开始考试 - 检查是否组卷成功
  checkExam(param) {
    const { id, examinationId } = param
    const url = `/exam/v1/template/isOrganize?id=${id}&examinationId=${examinationId}`
    return postAction(url)
  },
  markSubject(data) {
    const url = `/exam/v1/answer`
    return putAction(url, data)
  }
}

export default apiService
