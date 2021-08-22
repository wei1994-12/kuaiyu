// pages/citylist/citylist.js
// 引入map.js
const citymap = require('../../libs/map');
const QQMapWX = require('../../libs/qqmap-wx-jssdk');
let qqmapsdk;

Page({
  /** 页面的初始数据 */
  data: {
    citymap: citymap,
    letter: 'A',
    cityname: '定位中...',
    locOK: false  // 表达是否定位成功
  },

  /** 定位当前城市 */
  getLocation(){
    // 初始化qqmapsdk
    qqmapsdk = new QQMapWX({
      key: "URDBZ-6ME6W-EVSRJ-OGDAZ-QTLWE-DUFZY"
    });
    qqmapsdk.reverseGeocoder({
      success: (res)=>{
        console.log(res);
        let cityname = res.result.address_component.city;
        // 更新当前页面
        this.setData({
          cityname:cityname,
          locOK: true
        });
        // 更新globalData
        getApp().globalData.cityname = cityname;
      },
      fail: (err)=>{
        console.warn(err);
        this.setData({cityname: '定位失败，点击重试'})
        if(err.status==1000){ // 没有权限
          // 弹窗，提示授权 
          wx.showModal({
            title: "提示",
            content: `当前应用无定位权限，
                      是否跳转到设置页面进行授权？`,
            cancelText: "再想想",
            confirmText: "去授权",
            success: (res)=>{
              console.log(res);
              if(res.confirm){ // 用户同意去授权
                wx.openSetting({
                  success: (settingRes)=>{
                    console.log(settingRes);
                    if(settingRes.authSetting['scope.userLocation']){
                      this.getLocation();  //重新获取定位
                    }
                  }
                })
                fail: (err)=>{
                  console.warn(err);
                  this.setData({cityname: '定位失败，点击重试'})
                }
              }
            }
          })
        }
      }
    });
  },

  /** 点击当前定位城市按钮后触发 */
  tapLocCity(){
    if(this.data.locOK){
      getApp().globalData
              .cityname = this.data.cityname;
      wx.navigateBack();
    }else{
      this.getLocation();
    }
  },

  /** 点击城市列表项 */
  tapCityItem(event){
    let cityname = event.currentTarget.dataset.cityname;
    console.log(cityname);
    // 存储到App的globalData中
    getApp().globalData.cityname = cityname;
    wx.navigateBack(); // 返回上一页即可
  },

  /** 点击右侧边栏导航 */
  tapNav(event){
    console.log(event);
    let letter = event.target.dataset.letter;
    this.setData({letter})
  },

  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(citymap);
    // 页面加载完毕后，重新定位
    this.getLocation();
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