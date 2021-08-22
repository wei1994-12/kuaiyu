// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    isOpen:false
  },
  tapDesc(){
    this.setData({isOpen: !this.data.isOpen})
  },
  // 大图预览
  tapShowImage(event){
    let index=event.target.dataset.i;
    let urls=this.data.movie.thumb;
    let newurls=[];
    urls.forEach((item,i)=>{
      newurls[i]=item.substring(0,item.lastIndexOf('@'))
    });
    wx.previewImage({
      current:newurls[index],
      urls:newurls
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    // console.log(id)
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      data:{id:id},
      success:(res)=>{
        // console.log(res)
        this.setData({movie:res.data})
      }
    });
    //访问云数据库 加载评论
    
    let db = wx.cloud.database();
    // 2. 调用API，执行查询操作
    db.collection('comments').where({
      movieid: id
    })
    .skip(0)
    .limit(5)
    .get().then(res=>{
      // console.log(res);
      // 将评论列表res.data存入data中
      this.setData({comments: res.data});
    })

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