import { getPartnerOpenId } from '../bind/partner'; // 导入

Page({
  data: {
    categories: [],
    activeCategoryIndex: 0,
    dishes: [],
    filteredDishes: [],
    dishesForWheel: [],
    rotating: false,
    angle: 0
  },

  onLoad() {
    this.loadCategories();
    this.loadRandomDishes(); // 初始化转盘
  },

  /* 加载分类 */
  loadCategories() {
    const db = wx.cloud.database({ env: 'xiaochenshuai-8g2muz4g30226f35' });
    db.collection('categories').get().then(res => {
      this.setData({
        categories: res.data.map(item => item.name)
      }, this.loadDishes); // 先加载分类，再加载菜品
    }).catch(err => console.error('获取分类失败', err));
  },

  /* 加载菜品 */
  loadDishes() {
    const db = wx.cloud.database({ env: 'xiaochenshuai-8g2muz4g30226f35' });
    db.collection('dishes').get().then(res => {
      this.setData({
        dishes: res.data
      }, this.filterDishes);
    }).catch(err => console.error('获取菜品失败', err));
  },

  /* 切换分类 */
  switchCategory(e) {
    this.setData({
      activeCategoryIndex: e.currentTarget.dataset.index
    }, this.filterDishes);
  },

  /* 过滤当前分类的菜品 */
  filterDishes() {
    const category = this.data.categories[this.data.activeCategoryIndex];
    const filtered = this.data.dishes.filter(d => d.category === category);
    this.setData({ filteredDishes: filtered });
  },

  /* 🚀 下单逻辑，写入 partnerOpenId */
  orderDish(e) {
    const dishId = e.currentTarget.dataset.id;
    const db = wx.cloud.database({ env: 'xiaochenshuai-8g2muz4g30226f35' });
    const dish = this.data.dishes.find(d => d._id === dishId);

    if (!dish) {
      wx.showToast({ title: '菜品不存在', icon: 'none' });
      return;
    }

    // 从 partner.js 获取 partnerOpenId
    getPartnerOpenId().then(partnerOpenId => {
      return db.collection('orders').add({
        data: {
          dishId: dish._id,
          dishName: dish.name,
          category: dish.category,
          status: '待处理',
          userOpenId: wx.getStorageSync('openid'),
          partnerOpenId: partnerOpenId,
          createTime: Date.now()
        }
      });
    }).then(() => {
      return db.collection('dishes').doc(dishId).update({
        data: { orderCount: db.command.inc(1) }
      });
    }).then(() => {
      wx.showToast({ title: '下单成功', icon: 'success' });
      this.loadDishes(); // 刷新菜品
    }).catch(err => {
      console.error('下单失败', err);
      wx.showToast({ title: '请先绑定爱人', icon: 'none' });
    });
  },

  /* 跳转到今日订单页面 */
  goToOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' });
  },

  /* 跳转到后台管理页面 */
  goToAdmin() {
    wx.navigateTo({ url: '/pages/admin/admin' });
  },

  /* 跳转到管理伴侣页面 */
  goToBind() {
    wx.navigateTo({ url: '/pages/bind/bind' });
  },

  /* 加载随机 8 道菜 & 画转盘 */
  loadRandomDishes(callback) {
    const db = wx.cloud.database({ env: 'xiaochenshuai-8g2muz4g30226f35' });
    db.collection('dishes').get().then(res => {
      const selected = res.data.sort(() => 0.5 - Math.random()).slice(0, 8);
      this.setData({ dishesForWheel: selected }, () => {
        this.drawWheel();
        if (typeof callback === 'function') callback();
      });
    }).catch(err => {
      console.error('转盘加载失败', err);
      if (typeof callback === 'function') callback();
    });
  },

  /* 绘制转盘 */
  drawWheel() {
    const ctx = wx.createCanvasContext('wheelCanvas', this);
    const { dishesForWheel } = this.data;
    const total = dishesForWheel.length;
    const anglePerSlice = 2 * Math.PI / total;

    for (let i = 0; i < total; i++) {
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 150, i * anglePerSlice, (i + 1) * anglePerSlice);
      ctx.setFillStyle(i % 2 === 0 ? '#f90' : '#ff0');
      ctx.fill();

      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(i * anglePerSlice + anglePerSlice / 2);
      ctx.setFillStyle('#000');
      ctx.setFontSize(12);
      ctx.fillText(dishesForWheel[i].name, 60, 0);
      ctx.restore();
    }

    ctx.draw();
  },

  /* 开始转盘旋转 */
  startSpin() {
    if (this.data.rotating) return;
    this.setData({ rotating: true });

    this.loadRandomDishes(() => {
      let baseCircle = 5 + Math.floor(Math.random() * 3); // 5~7 圈
      let totalAngle = baseCircle * 360 + Math.floor(Math.random() * 360);
      let currentAngle = 0;

      const spin = () => {
        currentAngle += 10;
        this.setData({ angle: currentAngle % 360 });

        if (currentAngle < totalAngle) {
          setTimeout(spin, 16);
        } else {
          this.setData({ rotating: false });
          this.showResult(currentAngle);
        }
      };

      spin();
    });
  },

  /* 根据最终角度，显示结果（可选） */
  showResult(finalAngle) {
    const adjustedAngle = finalAngle % 360;
    const index = Math.floor((360 - adjustedAngle + 22.5) % 360 / 45);
    const selectedDish = this.data.dishesForWheel[index];

    wx.showToast({
      title: `抽中了：${selectedDish.name}`,
      icon: 'none'
    });
  }
});
