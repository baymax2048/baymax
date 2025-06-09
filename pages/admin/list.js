Page({
  data: {
    categories: [],
    newCategory: '',
    dishes: []
  },

  onLoad() {
    this.loadCategories();
    this.loadDishes();
  },

  // 加载分类
  loadCategories() {
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });
    db.collection('categories').get().then(res => {
      this.setData({
        categories: res.data
      });
    }).catch(err => {
      console.error('获取分类失败', err);
      wx.showToast({
        title: '加载分类失败',
        icon: 'none'
      });
    });
  },

  // 加载菜品
  loadDishes() {
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });
    db.collection('dishes').get().then(res => {
      this.setData({
        dishes: res.data
      });
    }).catch(err => {
      console.error('获取菜品失败', err);
      wx.showToast({
        title: '加载菜品失败',
        icon: 'none'
      });
    });
  },

  // 输入新分类
  onInputCategory(e) {
    this.setData({
      newCategory: e.detail.value
    });
  },

  // 新增分类
  addCategory() {
    const { newCategory } = this.data;
    if (!newCategory.trim()) {
      wx.showToast({
        title: '请输入分类名',
        icon: 'none'
      });
      return;
    }

    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    db.collection('categories').add({
      data: {
        name: newCategory
      }
    }).then(() => {
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
      this.setData({
        newCategory: ''
      });
      this.loadCategories();
    }).catch(err => {
      console.error('添加分类失败', err);
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      });
    });
  },

  // 删除分类
  deleteCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    wx.showModal({
      title: '提示',
      content: '确定要删除这个分类吗？',
      success: res => {
        if (res.confirm) {
          db.collection('categories').doc(categoryId).remove().then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadCategories();
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
  },

  // 编辑菜品
  editDish(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin/admin?id=${dishId}`
    });
  },

  // 删除菜品
  deleteDish(e) {
    const dishId = e.currentTarget.dataset.id;
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    wx.showModal({
      title: '提示',
      content: '确定要删除这道菜吗？',
      success: res => {
        if (res.confirm) {
          db.collection('dishes').doc(dishId).remove().then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadDishes();
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
  },

  // 跳转到新增菜品页面
  goToAddDish() {
    wx.navigateTo({
      url: '/pages/admin/admin'
    });
  }
});
