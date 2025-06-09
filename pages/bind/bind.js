Page({
    data: {
      partnerOpenId: '', // 当前绑定的伴侣 openid
      inputOpenId: ''    // 输入框里用户输入的 openid
    },
  
    onLoad() {
      this.loadPartnerOpenId();
    },
  
    // 载入当前绑定的 partnerOpenId
    loadPartnerOpenId() {
      const myOpenId = wx.getStorageSync('openid');
      const db = wx.cloud.database({
        env: 'xiaochenshuai-8g2muz4g30226f35'
      });
      db.collection('users').doc(myOpenId).get().then(res => {
        if (res.data && res.data.partnerOpenId) {
          this.setData({
            partnerOpenId: res.data.partnerOpenId
          });
        } else {
          this.setData({
            partnerOpenId: ''
          });
        }
      }).catch(err => {
        console.error('获取伴侣信息失败', err);
      });
    },
  
    onInput(e) {
      this.setData({
        inputOpenId: e.detail.value
      });
    },
  
    // 绑定伴侣
    bindPartner() {
      const { inputOpenId } = this.data;
      if (!inputOpenId) {
        wx.showToast({ title: '请输入 openid', icon: 'none' });
        return;
      }
  
      const myOpenId = wx.getStorageSync('openid');
      const db = wx.cloud.database({
        env: 'xiaochenshuai-8g2muz4g30226f35'
      });
  
      db.collection('users').doc(myOpenId).set({
        data: {
          openid: myOpenId,
          partnerOpenId: inputOpenId
        }
      }).then(() => {
        wx.showToast({ title: '绑定成功' });
        this.setData({
          partnerOpenId: inputOpenId,
          inputOpenId: ''
        });
      }).catch(err => {
        console.error('绑定失败', err);
        wx.showToast({ title: '绑定失败', icon: 'none' });
      });
    },
  
    // 解绑伴侣
    unbindPartner() {
      const myOpenId = wx.getStorageSync('openid');
      const db = wx.cloud.database({
        env: 'xiaochenshuai-8g2muz4g30226f35'
      });
  
      db.collection('users').doc(myOpenId).update({
        data: {
          partnerOpenId: ''
        }
      }).then(() => {
        wx.showToast({ title: '解绑成功' });
        this.setData({
          partnerOpenId: ''
        });
      }).catch(err => {
        console.error('解绑失败', err);
        wx.showToast({ title: '解绑失败', icon: 'none' });
      });
    }
  });
  