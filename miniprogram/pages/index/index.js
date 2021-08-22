// index.js
// 引入QQMapWX 
const QQMapWX = require('../../libs/qqmap-wx-jssdk');
let qqmapsdk;

Page({
  data: {
    cityname: '未选择',  // 当前城市名
    movielist: [],  // 存储当前电影列表
    cid: '1'          // 存储当前类别ID
  },

  /** 点击导航后执行 */
  tapnav(event){
    let id = event.target.dataset.id;  // 获取data-id属性值
    this.setData({cid: id});
    // 从缓存中先找一下，有没有存过，有则直接获取
    wx.getStorage({
      key: id,
      success: (res)=>{ // 能读到数据，执行success
        // console.log(res);
        this.setData({movielist: res.data});
      },
      fail: (err)=>{ // 读不到数据，执行fail
        // 发送https请求，获取响应替换当前列表，更新界面。
        this.loadData(id, 0).then(movies=>{
          this.setData({movielist: movies});
          // 将movies存入缓存
          wx.setStorage({
            key: id,
            data: movies
          })
        })
      }
    })
  },

  /**
   * 加载某类别的电影列表
   * @param {number} cid   类别ID
   * @param {number} offset    起始下标位置（从0开始）
   * @returns Promise对象  返回电影列表
   */
  loadData(cid, offset){
    return new Promise((resolve, reject)=>{
      // 发请求之前，弹出等待框
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        data: {cid, offset},
        success: (res)=>{ 
          resolve(res.data); 
        },
        fail: (err)=>{ reject(err); },
        complete: ()=>{ 
          wx.hideLoading(); // 隐藏等待框
        }
      })
    })
  },

  /** 生命周期方法 */
  onLoad() {
    // 初始化qqmapsdk
    qqmapsdk = new QQMapWX({
      key: "URDBZ-6ME6W-EVSRJ-OGDAZ-QTLWE-DUFZY"
    });
    qqmapsdk.reverseGeocoder({
      success: (res)=>{
        // console.log(res);
        let cityname = res.result.address_component.city;
        //更新当前页面
        this.setData({cityname:cityname});
        //更新globalData
        // getApp().globalData.citymame=cityname;
      }
    });

    // 发送https请求，访问热映类别下的首页数据
    this.loadData(1, 0).then(movies=>{
      this.setData({movielist: movies});
    })
  },
  onShow(){
    let cityname=getApp().globalData.cityname;
    this.setData({cityname})
  },
  /** 当页面上拉触底后执行该方法 */
  onReachBottom(){
    // console.log('到底了。。。')
    // 发送请求，访问下一页数据
    let cid = this.data.cid;
    // 把当前数组元素的个数作为下一页的起始位置offset
    let offset = this.data.movielist.length;
    this.loadData(cid, offset).then(movies=>{
      this.setData({
        movielist: [...this.data.movielist, ...movies]
      })
    })
  },

  /** 触发下拉刷新后执行 */
  onPullDownRefresh(){
    // console.log('下拉刷新。。。');
    // 更新当前类别列表
    this.loadData(
      this.data.cid, 0).then(movies=>{
      this.setData({movielist: movies});
      // 更新缓存
      wx.setStorage({
        key: this.data.cid+"",
        data: movies
      });
      // 停止下拉刷新
      wx.stopPullDownRefresh();
    })
  }

})



