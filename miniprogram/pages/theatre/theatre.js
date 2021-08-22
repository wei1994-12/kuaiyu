// pages/theatre/theatre.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theatreList: [],
    cityname: '未选择',
    words: ''
  },
  /** 点击搜索图表后执行 */
  tapSearch(){
    let cn = this.data.cityname;
    let words = this.data.words;
    console.log(`city:${cn}  words:${words} `);
    // 拿到qqmapsdk 
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.search({
      region: cn,   // 城市名称
      keyword: "影院  "+words,   // 查询关键字
      page_size: 20,     // 一页包含的条目数
      success: (res)=>{
        console.log(res);
        // 重新计算数组中的每个元素的_distance
        res.data.forEach(item=>{
          if(item._distance){
            item._distance_str = 
              (item._distance/1000).toFixed(2)+' km';
          }
        })
        // 将返回的影院数组，存入data，在页面中渲染列表
        this.setData({theatreList: res.data});
      }
    });
  },

  /** 点击影院列表项后 */
  tapTheatreItem(event){
    let i = event.currentTarget.dataset.i;
    let theatre = this.data.theatreList[i];
    let lat = theatre.location.lat;
    let lng = theatre.location.lng;
    console.log(`lat: ${lat}  lng:${lng}`);
    // 使用微信内置地图显示该影院位置
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 15,
      name: theatre.title,
      address: theatre.address
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿到qqmapsdk 
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.search({
      keyword: "影院",   // 查询关键字
      page_size: 20,     // 一页包含的条目数
      success: (res)=>{
        console.log(res);
        // 重新计算数组中的每个元素的_distance
        res.data.forEach(item=>{
          item._distance_str = 
              (item._distance/1000).toFixed(2)+' km';
        })
        // 将返回的影院数组，存入data，在页面中渲染列表
        this.setData({theatreList: res.data});
      }
    });
  },

  onShow(){
    // 更新当前页面左上角的位置  globalData中获取数据
    let cityname = getApp().globalData.cityname;
    console.log(cityname);
    this.setData({cityname});
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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