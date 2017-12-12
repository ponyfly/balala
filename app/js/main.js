import $ from 'jquery'
import "babel-polyfill"
import {ARInit } from './tools'
import '../css/reset.css'
import '../css/main.css'

import wenan4 from '../imgs/wenan4.png'

/**
 * 判断运行环境
 * @returns {{}}
 */
function judgeEnv() {
  var ua = navigator.userAgent.toLowerCase(),
    isWeixin = ua.indexOf('micromessenger') > -1,
    isQQ = ua.indexOf('qq') > -1,
    isWeibo = ua.indexOf('weibo') > -1,
    isIphone = ua.indexOf('iphone') > -1,
    isAndroid = ua.indexOf('android') > -1,
    isUc = ua.indexOf('ucbrowser') > -1,
    isBaidu = ua.indexOf('baidu') > -1,
    isPc = /android|webos|iphone|ipod|blackberry/i.test(ua) ? false : true,
    isMomo = ua.indexOf('momowebview') > -1,
    runningEnvironment = {};
  //判断环境
  runningEnvironment = {
    'weixin': isWeixin,
    'qq': isQQ,
    'weibo': isWeibo,
    'iphone': isIphone,
    'android': isAndroid,
    'baidu': isBaidu,
    'pc': isPc,
    'momo': isMomo
  };
  return runningEnvironment;
}
/**
 * 添加历史记录
 */
function pushHistroy() {
  var state = {
    title: '',
    url: '#'
  }
  window.history.pushState(state, '', '#for')
}
/**
 * 跳转到appStore
 */
function toAppStore() {
  // alert(curPlan === 'planA'? "app-a" : "app-b");
  window.location.href = curPlan === 'planA' ? "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1381936452665" : "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1334936400029"
}
/**
 * 获取当前播放视频的剧本信息
 */
function setCurrentOpera(curThemePic, curThemeName) {
  $('.current_opera_img').attr({src: curThemePic})
  $('.current_opera_title').text(curThemeName)
}
/**
 * 获取推荐视频列表
 */
function getRecommendVideos() {
  let arrs = []
  recommendVideos.forEach((rv, i) => {
    let $li = $('<li><div><img src="'+ require('../imgs/userposter'+ (i + 1) +'.png') +'" alt=""></div>' + '<span>' + rv.title + '</span></li>')
    arrs.push($li)
  })
  $('.tab_4 .recommend_list').append(arrs.slice(0,4))
  $('.tab_5 .more_list').append(arrs.slice(4))
}
/**
 * 获取剧本列表
 */
function getRecommendOperas() {
  const operas = ["爱你","灵魂出窍","波斯猫","床照","魅力女主播","天竺少女", "皇上驾崩", "贵妃醉酒"]
  let arrs = []
  operas.forEach((op, i) => {
    let $li = $('<li><div><img src="' + require('../imgs/opera'+ (i + 1) +'.png') + '" alt=""></div><span>' + operas[i] + '</span></li>')
    arrs.push($li)
  })
  $('.tab_6 .recommend_list_all').append(arrs)
}
/**
 * 添加事件
 */
function addEvent() {
  var media = document.getElementById('media')
  $(window).on('popstate', function () {
    if(currentEnv.iphone || currentEnv.pc) {
      media.pause()
    }
    $('.tab_6').siblings().hide()
    $('.tab_6').show()
  })
  $(window).on('load', function () {
    if(currentEnv.pc){
      scalePcPage()
    }
    $('#app').show()
    videoPosterH = $('.poster').height()
  })
  $('.tab_1').on('click', function () {
    // 下载总点击
    objARInit._send1_1('balala', 'download', function () {
      objARInit._send1_1('balala', 'download-' + curPlan, function () {
        // 下载剧本统计
        objARInit._send1_1('balala', 'download-' + themeId, function () {})
      })
    })
    if(tab3FirstClick) {
      //在首页点击下载
      // alert('download-out-'+ curPlan)
      objARInit._send1_1('balala', 'download-out-'+ curPlan, function () {
        console.log('download-out-'+ curPlan);
        toAppStore()
      })
    }else{
      if(isUserVideo) {
        // alert('download-user-' + curPlan)
        //用户视频触发下载
        objARInit._send1_1('balala', 'download-user-' + curPlan, function () {
          console.log('download-user-' + curPlan);
          toAppStore()
        })
      } else {
        // alert('download-recommend' + curRecommendId + '-' + curPlan)
        //推荐视频触发下载
         objARInit._send1_1('balala', 'download-recommend' + curRecommendId + '-' + curPlan, function () {
           console.log('download-recommend' + curRecommendId + '-' + curPlan);
           toAppStore()
         })
      }
    }
  })
  $('.current_opera_wrapper').on('click', function () {
    objARInit._send1_1('balala', 'download', function () {
      objARInit._send1_1('balala', 'download-' + curPlan, function () {
        if(isUserVideo) {
          objARInit._send1_1('balala', 'download-' + themeId, function () {
            objARInit._send1_1('balala', 'download-user', function () {
              // alert('download-user')
              toAppStore()
            })
          })
        }else {
          objARInit._send1_1('balala', 'download-' + curThemeId, function () {
            objARInit._send1_1('balala', 'download-recommend' + curRecommendId + '-drama', function () {
              // alert('download-recommend' + curRecommendId + '-drama')
              toAppStore()
            })
          })
        }
      })
    })
  })
  $('.tab_6 .download').on('click', function () {
    // alert('download-back-'+ curPlan)
    objARInit._send1_1('balala', 'download', function () {
      objARInit._send1_1('balala', 'download-' + themeId, function () {
        objARInit._send1_1('balala', 'download-' + curPlan, function () {
          objARInit._send1_1('balala', 'download-back-'+ curPlan, function () {
            console.log('download-back-'+ curPlan);
            toAppStore()
          })
        })
      })
    })
  })
  /*点击遮罩，控制播放与暂停*/
  $('.tab_3').on('click', function (e) {
    var opacityVal = $(this).css('opacity')
    if(tab3FirstClick === true) {
      var tab1H = $('.tab_1').height()
      if(!e.isTrigger) {
        $("#media").attr({'src': videoUrl})
        curThemeId = themeId
        curThemePic = themePic
        curThemeName = themeName
        setCurrentOpera(curThemePic, curThemeName)
        isUserVideo = true
      } else {
        isUserVideo = false
      }
      $('.tab_1').add('.line').add('.tab_4').add('.poster').hide()
      $('.tab_2').add('#media').css({"height": currentEnv.pc ? (videoPosterH - 1) : 'auto'})
      $(this).height(currentEnv.pc ? videoPosterH - 33 : videoPosterH - tab1H)
      $(this).add('#media').css({opacity: 0})
      $('.tab_1').css({position: "fixed", bottom: currentEnv.pc ? "auto" : 0, 'z-index':26})
      if(currentEnv.iphone) {
        $('.tab_1').show().addClass('bounceInUp')
        setTimeout(function () {
          $('.tab_1').removeClass('bounceInUp')
        },3000)
      }
      media.play()
      tab3FirstClick = false
    } else {
      if(opacityVal === "0") {
        $(this).css({"opacity": 1})
        media.pause()
      } else {
        $(this).css({"opacity": 0})
        media.play()
      }
    }
  })
  /*开始播放的时候显示播放器*/
  $('#media').on('playing', function () {
    if(initPlayer){
      $(this).css({opacity: 1})
      if(curPlan === 'planA') {
        $('.tab_1').css({'z-index': 26})
      }
      if(!currentEnv.pc) {
        $('.tab_1').show().addClass('bounceInUp')
        setTimeout(function () {
          $('.tab_1').removeClass('bounceInUp')
        },3000)
      }
      initPlayer = false
    }
    $('.loader').css({visibility: 'hidden'})
  })
  /*播放结束*/
  $('#media').on('ended', function () {
      if(curPlan === 'planA') {
        $('.tab_1').css({'z-index': -100})
      }
      $('.tab_5').show()
    initPlayer = true
  })
  /*正在缓冲*/
  $('#media').on('waiting', function () {
    $('.loader').css({visibility: 'visible'})
  })
  /*中途退出全屏回到初始页面*/
  media.addEventListener('x5videoexitfullscreen', function () {
    $('.tab_1').css({position: "static"})
    $('.tab_2').add('.tab_3').css({height: appWidth})
    $('.tab_3').css({opacity: 1})
    $('.poster').add('.line').add('.tab_4').show()
    $('.tab_5').hide()

    if(this.currentTime > 0 && this.currentTime < this.duration) {
      initPlayer = true
    }
    tab3FirstClick = true
  })
  if(curPlan === 'planA') {
    /*点击推荐视频列表一*/
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      $("#media").attr({src:recommendVideos[hotId - 1].videoSrc})
      curRecommendId = hotId
      $('.tab_3').triggerHandler('click')
      curThemeId = recommendVideos[hotId - 1].themeId
      curThemePic = require('../imgs/rec-'+ curThemeId +'.png')
      curThemeName = recommendVideos[hotId - 1].themeName
      setCurrentOpera(curThemePic, curThemeName)
      /*点击推荐视频发送id 1x1*/
      // alert('hot-' + hotId + '-planA')
      objARInit._send1_1('balala', 'hot-' + hotId + '-planA', function () {})
    })
    /*点击推荐视频列表二*/
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      $('#media').css({opacity: 0})
      $("#media").attr({src:recommendVideos[hotId - 1].videoSrc})
      $('.tab_5').hide()
      curRecommendId = hotId
      isUserVideo = false
      curThemeId = recommendVideos[hotId - 1].themeId
      curThemePic = require('../imgs/rec-'+ curThemeId +'.png')
      curThemeName = recommendVideos[hotId - 1].themeName
      setCurrentOpera(curThemePic, curThemeName)
      media.play()
      /*点击推荐视频发送id 1x1*/
      // alert('hot-' + hotId + '-planA')
      objARInit._send1_1('balala', 'hot-' + hotId + '-planA', function () {})
    })
    /*点击推荐视频列表三*/
    $('.recommend_list_all').on('click', 'li', function () {
      var hotId = $('.recommend_list_all li').index(this) + 1
      // alert('back-' + curPlan + '-hot-' + hotId)
      objARInit._send1_1('balala', 'download', function () {
        objARInit._send1_1('balala', 'download-' + themeId, function () {
          objARInit._send1_1('balala', 'download-' + curPlan, function () {
            objARInit._send1_1('balala', 'back-' + curPlan + '-hot-' + hotId, function () {
              console.log(hotId);
              toAppStore()
            })
          })
        })
      })
    })
  } else {
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      // alert(curPlan + '-hot-' + hotId)
      objARInit._send1_1('balala', 'download', function () {
        objARInit._send1_1('balala', 'download-' + themeId, function () {
          objARInit._send1_1('balala', 'download-' + curPlan, function () {
            objARInit._send1_1('balala', curPlan + '-hot-' + hotId, function () {
              console.log(hotId);
              toAppStore()
            })
          })
        })
      })
    })
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      // alert(curPlan + '-hot-' + hotId)
      objARInit._send1_1('balala', 'download', function () {
        objARInit._send1_1('balala', 'download-' + themeId, function () {
          objARInit._send1_1('balala', 'download-' + curPlan, function () {
            objARInit._send1_1('balala', curPlan + '-hot-' + hotId, function () {
              console.log(hotId);
              toAppStore()
            })
          })
        })
      })
    })
    $('.recommend_list_all').on('click', 'li', function () {
      var hotId = $('.recommend_list_all li').index(this) + 1
      // alert('back-' + curPlan + '-hot-' + hotId)
      objARInit._send1_1('balala', 'download', function () {
        objARInit._send1_1('balala', 'download-' + themeId, function () {
          objARInit._send1_1('balala', 'download-' + curPlan, function () {
            objARInit._send1_1('balala', 'back-' + curPlan + '-hot-' + hotId, function () {
              console.log(hotId);
              toAppStore()
            })
          })
        })
      })
    })
  }
  /**
   * 重播
   */
  $('.replay').on('click', function () {
    $('#media').css({"opacity": 0})
    $('.tab_5').hide()
    media.play()
    // alert('repeat-' + curPlan)
    objARInit._send1_1('balala', 'repeat-' + curPlan, function () {})
  })
}
/**
 * 不同版本样式调整
 */
function changeStyle() {
  var oImg = new Image()
  oImg.src = wenan4
  oImg.onload = function () {
    if(curPlan === 'planB') {
      $('.tab_5 .current_opera_wrapper').remove()
      $('.tab_5 .more_list.plan_a').removeClass('plan_a')
      $('.more_list li div').css({height: 'auto'})
    }
    $('.tab_6 .recommend_title').remove()
    $('.tab_6').prepend($(oImg).clone())
  }
}
/**
 * 缩放pc页面
 */
function scalePcPage() {
  var w = 375
  var scale = w/750
  $('#media').width(w).height(667)
  $('#app').css({"width": w})
  $('.tab_1').css({'width': w})
  $('.tab_3').add('.tab_2').css({"height": w})
  $('.play').css({"width": scale * 144, "height": scale * 145})
  $('.recommend_title').css({'font-size':'16px',"height":scale * 84,"padding-top": "20px"})
  $('.recommend_list li span').css({'font-size':'14px','line-height':'25px'})
  $('.more_list li span').css({'font-size':'13px'})
  $('.line').height(10)
  $(".recommend_list li div").css({height:215,"min-height":"auto"})
  $('.loader').css({position:'absolute',width: 50, height: 50})
  if(curPlan === 'planA') {
    $('.current_opera_wrapper').css({height: scale * $('.current_opera_wrapper').height()})
    $('.current_opera').css({width: scale * $('.current_opera').width(), top: scale * 45, left: scale * 23})
    $('.current_opera_title').css({height: scale * 45, 'line-height': scale * 45 + 'px', 'font-size': 14})
    $('.more_title').css({height: 50, 'line-height': '50px', 'font-size': 16})
    $('.more_list.plan_a li span').css({height: scale * 60, 'line-height': scale * 60 + 'px'})
  }
  $('.tab_6>img').eq(0).css({width: '100%'})
  $('.tab_6 .download').css({position:'absolute', width: '100%'})
  $('.recommend_list_all li span').css({'line-height': '20px', 'font-size': 16})
}
/**
 * 获取视频相关信息
 */
function getVideoInfo(callback) {
  $.ajax({
    url: 'http://114.112.164.36:41080/api/worksShareDetail',
    // url: 'http://'+ location.hostname +':3002/api/worksShareDetail',
    type: 'POST',
    data: '{"worksId": '+ worksId + '}',
    success(res) {
      console.log(res);
      videoUrl = res.works.movie.url
      imgUrl = res.works.worksPic.url
      curThemeId = themeId = res.works.scenario.id
      curThemeName= themeName = res.works.scenario.name
      curThemePic = themePic = res.works.scenario.coverUrl
      callback && callback()
    },
    error(err) {
      console.log(err.message);
    },
  })
}
/**
 * 初始化
 */
function initPage(){
  getVideoInfo(function () {
    $('.poster').attr('src', imgUrl)
    //初始化统计
    objARInit._send1_1('balala', 'share-open', function () {
      objARInit._send1_1('balala', 'share-open-' + themeId, function () {
        objARInit._send1_1('balala', 'share-open-' + curPlan, function () {})
      })
    })
  })
  getRecommendVideos()
  getRecommendOperas()
  changeStyle()
  addEvent()
  pushHistroy()
  //mobile
  if(currentEnv.android) {
    if(currentEnv.weixin || currentEnv.qq){
      //微信全屏的时候设置推荐列表距离顶端距离
      if (curPlan === 'planB') {
        $('.tab_5').css({'padding-top': 64})
      }
    }
  }
  if(currentEnv.iphone){
    $('.tab_6 .recommend_list_all').css({'padding-bottom': 120})
  }
  if(curPlan === 'planA'){
    $('.more_list li div').css({height: appWidth * 0.41})
  }
}
const objARInit = new ARInit()
const currentEnv = judgeEnv() //获取运行环境
const appWidth = currentEnv.pc ? 375 : 750
// const plans = ['planA', 'planB'] //可选方案
const recommendVideos = [
  {id: 1201110613, title: "哈哈，快来看看我美不美？自拍还能这么搞笑~？", videoSrc: 'https://video1.j.cn/video/forum/171110/1340/05351f92a7ae446b.m3u8', themeId: 16, themeName: "看我有多美"},
  {id: 1192370251, title: "我们都是小仙女~你能找到乱入的糙汉子吗？", videoSrc: 'https://video1.j.cn/video/forum/171031/2039/cf88d0984abf4223.m3u8', themeId: 25, themeName: "BOYS"},
  {id: 1192328686, title: "人真的有灵魂吗？谁能帮我解释下这个现象？", videoSrc: 'https://video1.j.cn/video/forum/171031/1959/9aae09e4d4e54a2c.m3u8', themeId: 28, themeName: "灵魂出窍"},
  {id: 1203977419, title: "我爱洗澡皮肤好好~里面有美人出浴图哦~", videoSrc: 'https://video1.j.cn/video/forum/171113/1915/ed41555a0adb4011.m3u8', themeId: 29, themeName: "我爱洗澡"},
  {id: 1210804012, title: "BOOM~睡什么睡，跟我一起嗨起来~~", videoSrc: 'https://video1.j.cn/video/forum/171121/1229/443a45292be54cae.m3u8', themeId: 24, themeName: "不自觉就抖起来了"},
  {id: 1207083505, title: "女孩子花点钱怎么了？为啥不让买包包？", videoSrc: 'https://video1.j.cn/video/forum/171117/0740/b4635e7608bd460f.m3u8', themeId: 36, themeName: "女孩子花点钱怎么了"},
  {id: 1209339072, title: "Baby想我就多看一眼，么么哒~", videoSrc: 'https://video1.j.cn/video/forum/171119/1844/346f599368ca441e.m3u8', themeId: 26, themeName: "爱你"},
  {id: 1210264099, title: "喵~喵~变身波斯猫~把我带回家吧，好不好？", videoSrc: 'https://video1.j.cn/video/forum/171120/1926/2908df4bd1b349cb.m3u8', themeId: 21, themeName: "波斯猫"}
]
const worksId = objARInit._GetQueryString('worksId') || 30011

let videoPosterH = 0
let curPlan = 'planA' //当前方案
let tab3FirstClick = true //是否是在首页点击tab_3
let initPlayer = true //是否开始播放
let isUserVideo = true //是否是用户video
let curRecommendId = null //当前点击的推荐video的Id

let videoUrl = ''  //|| "https://video1.j.cn/video/forum/171130/2249/c72bad97685d40ec.mp4" //用户视频播放地址
let imgUrl = '' //|| "https://static3.j.cn/img/forum/171130/2249/5e3084219b684fd5.jpg" //用户视频封面
let themeId = '' //|| 22 //用户视频对应的剧本id
let themePic = '' //|| 'http://ozv2s2gcd.bkt.clouddn.com/img/snap/171201/1605/0c94e13c91284e0f.png' //用户视频对应的剧本封面
let themeName = '' //|| 'name1' //用户视频对应的剧本名字
let curThemeId = ''  //方案A当前播放视频对应的剧本id
let curThemePic = ''  //方案A当前播放视频对应的剧本封面
let curThemeName = ''  //方案A当前播放视频对应的剧本名字

// curPlan = plans[Math.floor(Math.random() * 2)] //当前使用的方案
// curPlan = 'planA'

//initPage
initPage()