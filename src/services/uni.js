const _uni = {
  showToast: (msg) => {
    uni.showToast({
      title: msg,
      // duration: 50000,
      icon: 'none',
      mask: true
    })
  }
}

export default _uni
