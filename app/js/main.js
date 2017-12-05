import $ from 'jquery'
import "babel-polyfill"
import {ARInit } from './tools'
import '../css/reset.css'
import '../css/main.css'

import wenan3 from '../imgs/wenan3.png'
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
  window.location.href = curPlan === 'planA' ? "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1381936452665" : "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1334936400029"
}
/**
 * 获取当前剧本图片
 */
function getCurrentOpera() {
  $.ajax({
    url: "https://mobileapi.j.cn/?method=dynamicItem&id=" + curThemeId,
    type: 'GET',
    success: function (res) {
      var operaImg = res.imgUrl
      var operaTitle = res.title
      $('.current_opera_img').attr({src: operaImg})
      $('.current_opera_title').text(operaTitle)
    },
    error: function (err) {
      console.log(err);
    }
  })
}
/**
 * 获取视频列表页
 */
function getRecommendLists() {
  var recommends = [
    {id: 1201110613, title: (curPlan === 'planA' || curPlan === 'planB') ? "哈哈，快来看看我美不美？自拍还能这么搞笑~？" : "爱你"},
    {id: 1192370251, title: (curPlan === 'planA' || curPlan === 'planB') ? "我们都是小仙女~你能找到乱入的糙汉子吗？" : "灵魂出窍"},
    {id: 1192328686, title: (curPlan === 'planA' || curPlan === 'planB') ? "人真的有灵魂吗？谁能帮我解释下这个现象？" : "波斯猫"},
    {id: 1203977419, title: (curPlan === 'planA' || curPlan === 'planB') ? "我爱洗澡皮肤好好~里面有美人出浴图哦~" : "床照"}
  ]
  var recommendDoms = $('.recommend_list').find('li')
  for(var i = 0,len = recommends.length; i < len; i++){
    var recommendDom = recommendDoms[i]
    var id = recommends[i].id
    var title = recommends[i].title
    getRecommendItem($(recommendDom), id, title)
  }
}
/**
 * 获取视频列表二
 */
function getMoreLists() {
  var recommends = [
    {id: 1210804012, title:  (curPlan === 'planA' || curPlan === 'planB') ? "BOOM~睡什么睡，跟我一起嗨起来~~" : "魅力女主播"},
    {id: 1207083505, title:  (curPlan === 'planA' || curPlan === 'planB') ? "女孩子花点钱怎么了？为啥不让买包包？" : "天竺少女"},
    {id: 1209339072, title:  (curPlan === 'planA' || curPlan === 'planB') ? "Baby想我就多看一眼，么么哒~" : "皇上驾崩"},
    {id: 1210264099, title:  (curPlan === 'planA' || curPlan === 'planB') ? "喵~喵~变身波斯猫~把我带回家吧，好不好？" : "贵妃醉酒"}
  ]
  var recommendDoms = $('.more_list').find('li')
  for(var i = 0,len = recommends.length; i < len; i++){
    var recommendDom = recommendDoms[i]
    var id = recommends[i].id
    var title = recommends[i].title
    getRecommendItem($(recommendDom), id, title)
  }
  //推断:点击tab_3的时候curThemeId=themeId,执行了getCurrentOpera(),所以此处不需要再次获取
  // if(curPlan === 'planA') {
  //   getCurrentOpera()
  // }
}
/**
 * 获取视频列表三
 */
function getAllLists() {
  if(curPlan === 'planA' || curPlan === 'planB') {
    var operas = ["爱你","灵魂出窍","波斯猫","床照","魅力女主播","天竺少女", "皇上驾崩", "贵妃醉酒"]
    var $lis = []
    for(var i = 0; i < 8; i++) {
      var $li = $('<li><div><img src="' + require('../imgs/opera'+(i+1)+'.png') + '" alt=""></div><span>' + operas[i] + '</span></li>')
      $lis.push($li)
    }
    $('.tab_6 .recommend_list_all').append($lis)
  }
}
/**
 * 根据id获取视频相关信息
 * @param ele 绑定元素
 * @param id  视频id
 * @param title 视频title
 */
function getRecommendItem(ele, id, title)   {
  if(curPlan === 'planA' || curPlan === 'planB') {
    $.ajax({
      url: "https://bbs.j.cn/api/gameEntryDetail?gameEntryId="+id+"&v=6.1.1",
      type: 'GET',
      dataType: 'jsonp',
      success: function (res) {
        var posterSrc = res.gameEntry.video.thumbPic
        var videoSrc = res.gameEntry.video.url
        ele.data({"poster-src": posterSrc, "video-src": videoSrc})
        ele.find("span").text(title)
        counter ++
        if(counter === 8) {
          getAllLists()
        }
      },
      error: function (err) {
        console.log(err.message);
      }
    })
  } else if(curPlan === 'planC' || curPlan === 'planD') {
    counter ++
    ele.find("img").attr({"src": require('../imgs/opera' +counter+ '.png')})
    ele.find("span").text(title)
    if(counter === 8) {
      getAllLists()
      if(curPlan === 'planD') {
        var $mores = $('.tab_5 .more_list li').clone()
        $('.tab_4 .recommend_list').append($mores)
      }
    }
  }
}
/**
 * 添加事件
 */
function addEvent() {
  var media = $('#media')[0]
  $(window).on('popstate', function () {
    if(curPlan === 'planA' || curPlan === 'planB') {
      if(currentEnv.iphone) {
        media.pause()
        // $('#media').triggerHandler('ended')
      }
      $('.tab_6').siblings().hide()
      $('.tab_6').show()
    } else if(curPlan === 'planC' || curPlan === 'planD') {
      if($('.tab_6').css('display') === 'none'){
        //首页返回
        $('.tab_6').siblings().hide()
        $('.tab_6').show()
      }else{
        //在tab_6页返回,返回主页
        $('.tab_5').add('.tab_6').hide()
        $('.tab_2').add('.tab_3').css({height: appWidth})
        $('.tab_3').css({opacity: 1})
        $('.tab_1').css({position: 'static'})
        $('#app').children().not('.tab_5').not('.tab_6').add('.poster').show()
        tab3FirstClick = true
      }
    }
  })
  $('.tab_1').on('click', function () {
    // 下载总点击
    // objARInit._send1_1('actorvideo', 'download', function () {
    //   objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
    //     // 下载剧本统计
    //     objARInit._send1_1('actorvideo', 'download-' + themeId, function () {})
    //   })
    // })
    if(tab3FirstClick) {
      //在首页点击下载
      alert('download-out-'+ curPlan)
      // objARInit._send1_1('actorvideo', 'download-out-'+ curPlan, function () {
      //   console.log('download-out-'+ curPlan);
      //   toAppStore()
      // })
    }else{
      if(isUserVideo) {
        alert('user')
        //用户视频触发下载
        // objARInit._send1_1('actorvideo', 'download-user-' + curPlan, function () {
        //   console.log('download-user-' + curPlan);
        //   toAppStore()
        // })
      } else {
        alert('download-recommend' + curRecommendId + '-' + curPlan)
        //推荐视频触发下载
        //  objARInit._send1_1('actorvideo', 'download-recommend' + curRecommendId + '-' + curPlan, function () {
        //    console.log('download-recommend' + curRecommendId + '-' + curPlan);
        //    toAppStore()
        //  })
      }
    }
  })
  $('.current_opera_wrapper').on('click', function () {
    // objARInit._send1_1('actorvideo', 'download', function () {
    //   objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
    //     if(isUserVideo) {
    //       objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
    //         objARInit._send1_1('actorvideo', 'download-user', function () {
    //           toAppStore()
    //         })
    //       })
    //     }else {
    //       objARInit._send1_1('actorvideo', 'download-' + curThemeId, function () {
    //         objARInit._send1_1('actorvideo', 'download-recommend' + curRecommendId + '-drama', function () {
    //           // alert(themeIds[curRecommendId - 1])
    //           toAppStore()
    //         })
    //       })
    //     }
    //   })
    // })
  })
  $('.tab_6 .download').on('click', function () {
    alert('download-back-'+ curPlan)
    // objARInit._send1_1('actorvideo', 'download', function () {
    //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
    //     objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
    //       objARInit._send1_1('actorvideo', 'download-back-'+ curPlan, function () {
    //         console.log('download-back-'+ curPlan);
    //         toAppStore()
    //       })
    //     })
    //   })
    // })
  })
  /*点击遮罩，控制播放与暂停*/
  $('.tab_3').on('click', function (e) {
    var opacityVal = $(this).css('opacity')
    if(tab3FirstClick === true) {
      var tab1H = $('.tab_1').height()
      if(!e.isTrigger) {
        if(currentEnv.pc && objARInit.hls){
          objARInit.hls.loadSource(videoUrl)
          objARInit.hls.attachMedia(media)
        }else {
          $("#media").attr({'src': videoUrl})
          curThemeId = themeId
          getCurrentOpera()
        }
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
      $('.tab_1').show().addClass('bounceInUp')
      setTimeout(function () {
        $('.tab_1').removeClass('bounceInUp')
      },3000)
      initPlayer = false
    }
    $('.loader').css({visibility: 'hidden'})
  })
  /*播放结束*/
  $('#media').on('ended', function () {
    if(curPlan === 'planA' || curPlan === 'planB') {
      // $('.play').hide()
      // $('.tab_3').css({opacity: 1})
      if(curPlan === 'planA') {
        $('.tab_1').css({'z-index': -100})
      }
      $('.tab_5').show()
    } else {
      $('.tab_6').siblings().hide()
      $('.tab_6').show()
    }
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

    if(curPlan === 'planC' || curPlan === 'planD') {
      $('.tab_4').add('.tab_5').hide()
    }
    if(this.currentTime > 0 && this.currentTime < this.duration) {
      initPlayer = true
    }
    tab3FirstClick = true
  })
  if(curPlan === 'planA') {
    /*点击推荐视频列表一*/
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      if(currentEnv.pc){
        if(objARInit.hls){
          objARInit.hls.loadSource($(this).data("video-src"))
          objARInit.hls.attachMedia(media)
        }
      }else{
        $("#media").attr({src:$(this).data("video-src")})
      }
      curRecommendId = hotId
      $('.tab_3').triggerHandler('click')
      curThemeId = themeIds[curRecommendId - 1]
      getCurrentOpera()
      /*点击推荐视频发送id 1x1*/
      alert(hotId)
      // objARInit._send1_1('actorvideo', 'hot-' + hotId + '-planA', function () {})
    })
    /*点击推荐视频列表二*/
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      $('#media').css({opacity: 0})
      if(currentEnv.pc){
        if(objARInit.hls){
          objARInit.hls.loadSource($(this).data("video-src"))
          objARInit.hls.attachMedia(media)
        }
      }else{
        $("#media").attr({src:$(this).data("video-src")})
      }
      $('.tab_5').hide()
      curRecommendId = hotId
      isUserVideo = false
      curThemeId = themeIds[curRecommendId - 1]
      getCurrentOpera()
      media.play()
      /*点击推荐视频发送id 1x1*/
      alert(hotId)
      // objARInit._send1_1('actorvideo', 'hot-' + hotId + '-planA', function () {})
    })
    /*点击推荐视频列表三*/
    $('.recommend_list_all').on('click', 'li', function () {
      var hotId = $('.recommend_list_all li').index(this) + 1
      // alert('back-' + curPlan + '-hot-' + hotId)
      // objARInit._send1_1('actorvideo', 'download', function () {
      //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
      //     objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
      //       objARInit._send1_1('actorvideo', 'back-' + curPlan + '-hot-' + hotId, function () {
      //         console.log(hotId);
      //         toAppStore()
      //       })
      //     })
      //   })
      // })

      //待删除
      // var tab1H = $('.tab_1').height()
      // var hotId = $('.recommend_list_all li').index(this) + 1
      // $('.tab_6').add('.poster').hide()
      // $('.tab_2').add('.tab_3').show()
      // $('.tab_2').add('#media').css({height: currentEnv.pc ? (videoPosterH - 1) : 'auto'})
      // $('.tab_3').height(currentEnv.pc ? videoPosterH - 33 : videoPosterH - tab1H)
      // $('.tab_3').add('#media').css({opacity: 0})
      // $('.tab_1').css({position: "fixed", bottom: currentEnv.pc ? "auto" : 0, 'z-index':26})
      // if(currentEnv.pc) {
      //   if(objARInit.hls){
      //     objARInit.hls.loadSource($(this).data("video-src"))
      //     objARInit.hls.attachMedia(media)
      //   }
      // }else{
      //   var curLi = hotId < 5 ? $($('.recommend_list li')[hotId - 1]) : $($('.more_list li')[hotId - 5])
      //   $("#media").attr({"src": curLi.data("video-src")})
      // }
      // curRecommendId = hotId
      // media.play()
      // isUserVideo = false
      // tab3FirstClick = false
      // /*点击推荐视频发送id 1x1*/
      // alert(hotId)
      // objARInit._send1_1('actorvideo', 'back-' + curPlan + '-hot-' + hotId, function () {})
    })
  } else {
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      alert(hotId)
      // objARInit._send1_1('actorvideo', 'download', function () {
      //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
      //     objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
      //       objARInit._send1_1('actorvideo', curPlan + '-hot-' + hotId, function () {
      //         console.log(hotId);
      //         toAppStore()
      //       })
      //     })
      //   })
      // })
    })
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      alert(hotId)
      // objARInit._send1_1('actorvideo', 'download', function () {
      //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
      //     objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
      //       objARInit._send1_1('actorvideo', curPlan + '-hot-' + hotId, function () {
      //         console.log(hotId);
      //         toAppStore()
      //       })
      //     })
      //   })
      // })
    })
    $('.recommend_list_all').on('click', 'li', function () {
      var hotId = $('.recommend_list_all li').index(this) + 1
      alert(hotId)
      // objARInit._send1_1('actorvideo', 'download', function () {
      //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
      //     objARInit._send1_1('actorvideo', 'download-' + curPlan, function () {
      //       objARInit._send1_1('actorvideo', 'back-' + curPlan + '-hot-' + hotId, function () {
      //         console.log(hotId);
      //         toAppStore()
      //       })
      //     })
      //   })
      // })
    })
  }
  /**
   * 重播
   */
  $('.replay').on('click', function () {
    $('#media').css({"opacity": 0})
    $('.tab_5').hide()
    media.play()
    alert('repeat')
    // objARInit._send1_1('actorvideo', 'repeat-' + curPlan, function () {})
  })
}
/**
 * 不同版本样式调整
 */
function changeStyle() {
  var oImg = new Image()
  oImg.src = curPlan === 'planC' ? wenan3 : wenan4
  oImg.onload = function () {
    if(curPlan === 'planC' || curPlan === 'planD') {
      $('.tab_4 .recommend_title').text('热门剧本')
      $('.tab_4').css({'background-color': '#f2f2f2','margin-top':-1})
      $('.line').hide()
    }
    if(curPlan === 'planB') {
      $('.tab_5 .current_opera_wrapper').remove()
      $('.tab_5 .more_list li').removeClass('plan_a')
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
}
var objARInit = new ARInit()
var tab3FirstClick = true //是否是在首页点击tab_3
var initPlayer = true //是否开始播放
var isUserVideo = true //是否是用户video
var curRecommendId = null //当前点击的推荐video的Id
var themeIds = [16, 25, 28, 29, 24, 36, 26, 21]
var plans = ['planA', 'planB', 'planC', 'planD'] //可选方案
var curPlan = null //当前方案
var counter = 0 //recommend视频计数器
var videoPosterH = 0
var appWidth = 750
curPlan = plans[Math.floor(Math.random() * 2)]
curPlan = 'planA'
var currentEnv = judgeEnv() //获取运行环境
//获取url参数
var postId = objARInit._GetQueryString('postid') || 353809409  //1192802496
var videoUrl = objARInit._GetQueryString('videoUrl') ||  "https://video1.j.cn/video/forum/171031/2039/cf88d0984abf4223.m3u8"
var imgUrl = objARInit._GetQueryString('imgUrl') || "https://static3.j.cn/img/testforum/171103/1803/aa652fd5ccef462f.jpg"
var themeId = objARInit._GetQueryString('themeId') || 40
var themeName = objARInit._GetQueryString('themeName')
var curThemeId = themeId


$(function () {
  var media = document.getElementById('media')
  //设置海报poster和video src
  $('.poster').attr('src', imgUrl)
  getRecommendLists()
  getMoreLists()
  changeStyle()
  //初始化统计
  // objARInit._send1_1('actorvideo', 'share-open', function () {})
  // objARInit._send1_1('actorvideo', 'share-open-' + themeId, function () {})
  // objARInit._send1_1('actorvideo', 'share-open-' + curPlan, function () {})
  //初始化统计
  // objARInit._send1_1('actorvideo', 'share-open', function () {
  //   objARInit._send1_1('actorvideo', 'share-open-' + themeId, function () {
  //     objARInit._send1_1('actorvideo', 'share-open-' + curPlan, function () {})
  //   })
  // })
  if(currentEnv.pc){
    //pc
    import('hls.js')
      .then(function (Hls) {
        if(Hls.isSupported()) {
          objARInit.hls = new Hls()
          objARInit.hls.loadSource(videoUrl)
          objARInit.hls.attachMedia(media)
        }
      })
  }else{
    //mobile
    if(currentEnv.android) {
      if(currentEnv.weixin || currentEnv.qq){
        if(curPlan === 'planA'){
          $('.more_list li div').css({height: appWidth * 0.41})
        }
        //微信全屏的时候设置推荐列表距离顶端距离
        if (curPlan === 'planB') {
          $('.tab_5').css({'padding-top': 64})
        }
      }
    }
    if(currentEnv.iphone){
      $('.tab_6 .recommend_list_all').css({'padding-bottom': 120})
    }
  }
  window.onload = function () {
    $('#app').show()
    if(currentEnv.pc){
      scalePcPage()
    }
    videoPosterH = $('.poster').height()
  }
  addEvent()
  pushHistroy()
})