let utils = {
  defaultShopId: 'trlia1860363804901',
  domain: 'https://gxxcx.tuixiaomi.cn',
  oss: 'https://tuixiaomi.oss-cn-beijing.aliyuncs.com',
  MAPKEY: 'K5NBZ-JSBRO-LO4W4-SBWM3-EVYY7-KNFF4', // 腾讯地图key
  request: function (data) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.http(data, true)
  },
  http: function (req, ishide) {
    var codeCallback = res => {
      var code = res
      var that = this
      var user = this.getCookie()
      var serverid = this.getServerCookie()
      if (!req.data) {
        req.data = {}
      }
      // req.data.requestType = 'bb'
      req.data.requestType = 'pt'
      if (!req.data.shopId) {
        req.data.shopId = wx.getStorageSync('tuserId')
      }
      var reqInfo = {
        url: this.domain + req.url,
        data: req.data,
        header: {
          // 'shopId': wx.getStorageSync('tuserId'), // test
          'code': code,
          'cookie': user + ';' + serverid,
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        complete: function (res) {
          try {
            if (!res || !res.data) {
              return;
            }
            // session为空,重新获取code 然后重新走方法 最多走3次 || res.data.msg == '缺少用户session'
            if (res.data.error == "tuserRechargeError") {
              that.toast("该账号已到期，无法继续使用")
            } else if (res.data.msg == 'SessionFalse' || res.data.msg == '缺少用户session') {
              console.log('res.error', res.data.error)
              if (!req.num) {
                req.num = 1;
              } else {
                req.num = req.num + 1;
              }
              if (req.num < 3) {
                that.http(req, ishide)
              } else {
                wx.setStorageSync("hasUserInfo", false);
                if (req.fail != null) {
                  req.fail(res.data)
                }
              }
            } else {
              that.setCookie(res.header)
              req.success(res.data)
            }
          } catch (e) {
            console.error(e)
          } finally {
            if (ishide) {
              wx.hideLoading();
            }
          }
        },
        fail: function (res) {
          console.log('fail')
          if (ishide) {
            wx.hideLoading();
          }
          if (req.fail != null) {
            req.fail(res.data)
          }
        }
      }
      wx.request(reqInfo)
    }
    let rc = false
    if (req.num && req.num > 0) {
      rc = true
    }
    this.getCode(rc, codeCallback)
  },
  setCode: function (codeCallback) {
    wx.login({
      success: res => {
        if (codeCallback) {
          codeCallback(res.code)
        }
      },
      fail: function (res) { }
    })
  },
  getCode: function (reload, codeCallback) {
    let that = this
    if (reload) {
      this.setCode(codeCallback)
    } else {
      wx.checkSession({
        success() {
          if (codeCallback) {
            codeCallback('')
          }
        },
        fail() {
          that.setCode(codeCallback) // session_key 已经失效，需要重新执行登录流程
        }
      })
    }
  },
  setCookie: function (cookies) {
    if (cookies != undefined && cookies != '') {
      var user;
      var serverid;
      var str = JSON.stringify(cookies);
      while (str.indexOf("-") > -1) {
        str = str.replace("-", "")
      }
      cookies = JSON.parse(str);
      str = cookies.SetCookie;
      if (str) {
        var tmp = str.split(";")
        for (var x = 0; x < tmp.length; x++) {
          if (tmp[x].indexOf("user=") > -1) {
            user = tmp[x];
            user = user.substring(user.indexOf("user="))
            user = user.replace("-", "")
          }
          if (tmp[x].indexOf("SERVERID=") > -1) {
            serverid = tmp[x];
            serverid = serverid.substring(serverid.indexOf("SERVERID="))
          }
        }
        wx.setStorageSync('user', user)
        wx.setStorageSync('serverid', serverid)
      }
    }
  },
  getCookie: function () {
    return wx.getStorageSync('user') || ''
  },
  getServerCookie: function () {
    return wx.getStorageSync('serverid') || ''
  },
  toast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2500
    })
  },
  /*
   * 用法 this.$alert('标题').then(() => { }).catch(() => { })
   * this.$alert('标题', true, '内容').then(() => { }).catch(() => { })
  */
  alert: function (title, showCancel, content) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: content || '',
        showCancel: showCancel ? true : false,
        cancelText: "取消",
        confirmText: "确定",
        success: function (res) {
          if (res.cancel) {
            reject()
          } else {
            resolve()
          }
        }
      })
    })
  },
  shareParams: function (title, path, shareImg) {
    if (!title) {
      title = '校长海报'
    }
    let params = {
      title: title
    }
    let opid = wx.getStorageSync('opid') || ''
    if (opid && path.indexOf('shareOpid') == -1) {
      path = path + (path.indexOf('?') == -1 ? '?' : '&') + 'shareOpid=' + opid
    }
    if (shareImg && shareImg.indexOf('http') == -1) {
      shareImg = this.oss + '/' + shareImg
    }
    params.path = path
    params.imageUrl = shareImg || ''
    console.log(params)
    return params
  },
  shareTimeline: function (title, path, shareImg) {
    if (!title) {
      title = '校长海报'
    }
    let params = {
      title: title
    }
    let opid = wx.getStorageSync('opid') || ''
    if (opid && path.indexOf('shareOpid') == -1) {
      // 分享朋友圈不能带问号
      path = path + (path ? '&' : '') + 'shareOpid=' + opid
    }
    if (shareImg && shareImg.indexOf('http') == -1) {
      shareImg = this.oss + '/' + shareImg
    }
    params.query = path
    params.imageUrl = shareImg || ''
    console.log(params)
    return params
  },
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  validPhone(str) {
    const reg = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/
    return reg.test(str)
  },
  // 仅用于朋友圈模式调用接口
  fetch: function(req) {
    if (!req.data) {
      req.data = {}
    }
    wx.request({
      url: this.domain + req.url,
      data: req.data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function (res) {
        req.success(res.data)
      },
      fail: function (res) {
        req.fail(res.data)
      }
    })
  }
}
export default utils