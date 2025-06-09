// pages/bind/partner.js
const db = wx.cloud.database();
export function getPartnerOpenId() {
  return new Promise((resolve, reject) => {
    const myOpenId = wx.getStorageSync('openid');
    db.collection('users').doc(myOpenId).get().then(res => {
      if (res.data && res.data.partnerOpenId) {
        resolve(res.data.partnerOpenId);
      } else {
        reject('未绑定 partnerOpenId');
      }
    }).catch(err => {
      console.error('获取 partnerOpenId 失败', err);
      reject(err);
    });
  });
}
