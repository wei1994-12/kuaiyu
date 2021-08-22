// app.js
// 引入QQMapWX 
const QQMapWX = require('libs/qqmap-wx-jssdk');
let qqmapsdk;
App({
  onLaunch() {
    wx.cloud.init({
      env:'wy1994-6g5okb1c746594c9'
    })
    //初始化qqmapsdk 
    qqmapsdk = new QQMapWX({
      key: "URDBZ-6ME6W-EVSRJ-OGDAZ-QTLWE-DUFZY"
    });
    this.globalData.qqmapsdk=qqmapsdk;
  },
  //全局共享的数据存储区
  globalData: {
    qqmapsdk:{},
    userInfo: null,
    cityname:'未选择'
  }
})
