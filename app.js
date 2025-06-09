// app.js
App({
    onLaunch() {
      // 初始化云开发环境
      wx.cloud.init({
        env: 'xiaochenshuai-8g2muz4g30226f35',  // 替换成你的环境ID
        traceUser: true
      })
  
      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
  
      // 登录并获取 openid
      wx.cloud.callFunction({ name: 'login' })
        .then(res => {
          wx.setStorageSync('openid', res.result.openid);
        })
        .catch(err => {
          console.error('获取 openid 失败', err);
        });
    },
    globalData: {
      userInfo: null
    }
  })
  