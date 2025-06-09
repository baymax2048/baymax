Page({
  data: {
    orders: []
  },

  onLoad() {
    this.loadOrders();
  },

  loadOrders() {
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    db.collection('orders')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        // 格式化 createTime（时间戳转日期字符串）
        const formattedOrders = res.data.map(order => {
          // 确保 createTime 是数字（时间戳）
          const date = new Date(order.createTime);

          // 转换为可读的时间格式
          const year = date.getFullYear();
          const month = ('0' + (date.getMonth() + 1)).slice(-2);
          const day = ('0' + date.getDate()).slice(-2);
          const hour = ('0' + date.getHours()).slice(-2);
          const minute = ('0' + date.getMinutes()).slice(-2);
          const second = ('0' + date.getSeconds()).slice(-2);
          order.createTimeStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

          return order;
        });

        this.setData({
          orders: formattedOrders
        });
      })
      .catch(err => {
        console.error('获取订单失败', err);
      });
  },

  // 删除订单
  deleteOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    wx.showModal({
      title: '提示',
      content: '确定要删除这个订单吗？',
      success: res => {
        if (res.confirm) {
          db.collection('orders').doc(orderId).remove().then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadOrders(); // 重新加载订单
          }).catch(err => {
            console.error('删除失败', err);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
});
