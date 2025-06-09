Page({
  onLoad() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      wx.redirectTo({ url: '/pages/index/index' });
    }
  },
  doLogin() {
    wx.cloud.callFunction({ name: 'login' })
      .then(res => {
        wx.setStorageSync('openid', res.result.openid);
        wx.redirectTo({ url: '/pages/index/index' });
      })
      .catch(err => {
        console.error('登录失败', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      });
  }
});
