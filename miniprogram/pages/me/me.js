// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'点击登录',
    islogin:false
  },

  /** 点击选择图片 */
  tapImage(){
    if(!this.data.islogin){  // 如果未登录，直接return
      return;
    }
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: (res)=>{
        console.log(res);
        let path = res.tempFilePaths[0];
        this.setData({avatarUrl: path});
        // 上传头像至云存储空间
        let ext = 
          path.substr(path.lastIndexOf('.'));
        let cloudpath = `img_${Math.random()}${ext}`;
        console.log(cloudpath);
        // 开始上传
        wx.cloud.uploadFile({
          filePath: path,
          cloudPath: cloudpath,
          success: (uploadRes)=>{
            console.log(uploadRes);
            // 将上传成功的图片路径 更新到用户表
            // 必须要先获取当前用户的_openid
            // 调用云函数
            wx.cloud.callFunction({
              name:'quickstartFunctions',
              data: {
                type: 'getOpenId'
              }
            }).then(callRes=>{
              console.log(callRes);
              let openid = callRes.result.openid;
              let db = wx.cloud.database();
              db.collection('xz_users')
                .where({
                  _openid: openid
                }).update({
                data: {
                  avatarUrl: uploadRes.fileID
                }
              }).then(updateRes=>{
                wx.showToast({
                  title: '头像修改成功'
                })
              })
            })
          }
        })
      }
    })
  },

  /** 点击登录 */
  tapLogin(){
    if(this.data.islogin){  // 如果已登录，则直接return
      return;
    }
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善学子影院用户信息',
      success: (res)=>{
        console.log(res);
        let db = wx.cloud.database();
        db.collection('xz_users')
        .get().then((queryRes)=>{
          console.log(queryRes)
          // 判断有没有查出数据
          let avatarUrl = res.userInfo.avatarUrl;
          let nickName = res.userInfo.nickName;
          if (queryRes.data.length!=0){
            console.log('已经注册过了...')
            // 如果当前用户已经注册过了则直接访问数据，更新UI即可
            let user = queryRes.data[0];
            avatarUrl = user.avatarUrl;
            nickName = user.nickName;
          }else {
            console.log('没有注册过...')
            // 如果当前用户没有注册过（第一次登录）那么
            // 模拟注册 将用户数据存入xz_users集合
            db.collection('xz_users').add({
              data: {
                avatarUrl, 
                nickName
              },
              success: (addRes)=>{
                console.log(addRes);
              }
            });
          }
          // 无论执行if还是else都需要更新UI
          // 更新avatarUrl 与 nickName
          this.setData({
            avatarUrl,
            nickName
          })
          this.data.islogin = true;

        })
      }
    })
  },

  /** 当双击btn时执行 */
  doubletapEvent(){
    console.log('记得双击么么哒...');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})