export function deepCopy(target) {
  if (typeof target == 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }
    return result
  }
  return target
}

export function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}
/* es6数组去重方法 */
export const dedupe = array => {
  return Array.from(new Set(array))
}
/* 是否是JSON */
export const isJSON = str => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  console.log('It is not a string!')
}

/**
 * 获取用户信息（授权）
 */
export const getUserInfoApi = () => {
  return new Promise(function (resolve) {
    wx.getSetting({
      success: function (e) {
        if (e.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              resolve(res)
            },
            fail: function (res) {
              resolve(res)
            }
          })
        } else {
          console.log('本地缓存未发现授权信息，需点击按钮授权弹框！')
          resolve({ authFail: true })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  })
}
export const fontList = [
  {
    label: '微软雅黑',
    value: '微软雅黑'
  },
  {
    label: '字魂5号-无外润黑体',
    value: 'font5'
  },
  {
    label: '字魂18号-小恐龙体',
    value: 'font18'
  },
  {
    label: '字魂20号-石头体',
    value: 'font20'
  },
  {
    label: '字魂21号-不齐素圆体',
    value: 'font21'
  },
  // {
  //   label: '字魂24号-镇魂手书',
  //   value: 'font'
  // },
  {
    label: '字魂27号-布丁体',
    value: 'font27'
  },
  {
    label: '字魂35号-经典雅黑',
    value: 'font35'
  },
  // {
  //   label: '字魂48号-半天云魅黑手书',
  //   value: 'font48'
  // },
  {
    label: '字魂49号-逍遥行书',
    value: 'font49'
  },
  // {
  //   label: '字魂50号-白鸽天行体',
  //   value: 'font50'
  // },
  // {
  //   label: '字魂55号-龙吟手书',
  //   value: 'font55'
  // },
  {
    label: '字魂59号-创粗黑',
    value: 'font59'
  },
  {
    label: '字魂64号-萌趣软糖体',
    value: 'font64'
  },
  {
    label: '字魂66号-仔仔体',
    value: 'font66'
  },
  // {
  //   label: '字魂80号-萌趣小鱼体',
  //   value: 'font80'
  // },
  // {
  //   label: '字魂96号-虎啸手书',
  //   value: 'font96'
  // },
  {
    label: '字魂111号-金榜招牌体',
    value: 'font111'
  },
  // {
  //   label: '字魂139号-萌趣芋圆体',
  //   value: 'font139'
  // },
  {
    label: '字魂144号-朗圆体',
    value: 'font144'
  },
  {
    label: '字魂151号-联盟综艺体',
    value: 'font151'
  },
  {
    label: '字魂155号-方趣体',
    value: 'font155'
  },
  // {
  //   label: '字魂163号-新潮黑板报',
  //   value: 'font163'
  // }
  {
    label: '字魂164号-方悦黑',
    value: 'font164'
  },
  {
    label: '字魂176号-创粗圆',
    value: 'font176'
  },
  {
    label: '字魂181号-飞驰标题体',
    value: 'font181'
  },
  {
    label: '字魂189号-星岩乐黑体',
    value: 'font189'
  },
  {
    label: '字魂194号-萌趣繁星体',
    value: 'font194'
  },
  {
    label: '思源宋体CN',
    value: 'font1001'
  }
]
