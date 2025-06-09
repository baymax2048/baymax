Page({
  data: {
    categories: [],
    selectedCategory: '',
    image: '',
    formData: {
      name: '',
      description: '',
      price: ''
    }
  },

  onLoad() {
    this.loadCategories();
  },

  loadCategories() {
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    db.collection('categories').get().then(res => {
      this.setData({
        categories: res.data.map(item => item.name)
      });
    }).catch(err => {
      console.error('获取分类失败', err);
    });
  },

  // 输入框数据绑定
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [`formData.${key}`]: e.detail.value
    });
  },

  // 分类选择
  onCategoryChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedCategory: this.data.categories[index]
    });
  },

  // 上传图片
  uploadImage() {
    wx.chooseImage({
      count: 1,
      success: res => {
        const filePath = res.tempFilePaths[0];
        const cloudPath =
          'dish-images/' +
          Date.now() +
          '-' +
          Math.floor(Math.random() * 1000) +
          filePath.match(/\.[^.]+?$/)[0];

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: uploadRes => {
            console.log('上传成功：', uploadRes.fileID);
            this.setData({
              image: uploadRes.fileID
            });
          },
          fail: err => {
            console.error('上传失败', err);
          }
        });
      }
    });
  },

  // 保存提交
  submit() {
    const { name, description, price } = this.data.formData;
    const { selectedCategory, image } = this.data;

    if (!name || !selectedCategory || !description || !price || !image) {
      wx.showToast({
        title: '请填写完整',
        icon: 'none'
      });
      return;
    }

    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    });

    db.collection('dishes')
      .add({
        data: {
          name,
          category: selectedCategory,
          description,
          price: Number(price),
          image,
          orderCount: 0
        }
      })
      .then(res => {
        console.log('保存成功', res);
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        this.resetForm();
      })
      .catch(err => {
        console.error('保存失败', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      });
  },

  // 重置表单
  resetForm() {
    this.setData({
      selectedCategory: '',
      image: '',
      formData: {
        name: '',
        description: '',
        price: ''
      }
    });
  },

  // 跳转到菜品管理列表
  goToList() {
    wx.navigateTo({
      url: '/pages/admin/list'
    });
  }
});
