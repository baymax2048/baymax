Page({
  data: {
    categories: [],
    newCategory: ''
  },

  onLoad() {
    this.loadCategories()
  },

  // 加载分类
  loadCategories() {
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    })
    db.collection('categories').get().then(res => {
      this.setData({
        categories: res.data
      })
    })
  },

  // 输入框绑定
  onInput(e) {
    this.setData({
      newCategory: e.detail.value
    })
  },

  // 新增分类
  addCategory() {
    const name = this.data.newCategory.trim()
    if (!name) {
      wx.showToast({
        title: '请输入分类名',
        icon: 'none'
      })
      return
    }

    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    })
    db.collection('categories').add({
      data: { name }
    }).then(() => {
      wx.showToast({
        title: '新增成功',
        icon: 'success'
      })
      this.setData({
        newCategory: ''
      })
      this.loadCategories()
    }).catch(err => {
      console.error('新增失败', err)
      wx.showToast({
        title: '新增失败',
        icon: 'none'
      })
    })
  },

  // 删除分类
  deleteCategory(e) {
    const id = e.currentTarget.dataset.id
    const db = wx.cloud.database({
      env: 'xiaochenshuai-8g2muz4g30226f35'
    })
    wx.showModal({
      title: '提示',
      content: '确定要删除这个分类吗？',
      success: res => {
        if (res.confirm) {
          db.collection('categories').doc(id).remove().then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            this.loadCategories()
          }).catch(err => {
            console.error('删除失败', err)
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          })
        }
      }
    })
  }
})
