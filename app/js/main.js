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
  window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1334936400029"
}
/**
 * 获取视频列表页
 */
function getRecommendLists() {
  var recommends = [
    {id: 1192370251, title: (curPlan === 'planA' || curPlan === 'planB') ? "我们都是小仙女~你能找到乱入的糙汉子吗？" : "爱你"},
    {id: 1192328686, title: (curPlan === 'planA' || curPlan === 'planB') ? "人真的有灵魂吗？谁能帮我解释下这个现象？" : "灵魂出窍"},
    {id: 1203977419, title: (curPlan === 'planA' || curPlan === 'planB') ? "我爱洗澡皮肤好好~里面有美人出浴图哦~" : "女孩子花点钱怎么了"},
    {id: 1201110613, title: (curPlan === 'planA' || curPlan === 'planB') ? "哈哈，快来看看我美不美？自拍还能这么搞笑~？" : "看我有多美"}
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
    {id: 1207083505, title:  (curPlan === 'planA' || curPlan === 'planB') ? "女孩子花点钱怎么了？为啥不让买包包？" : "魅力女主播"},
    {id: 1209339072, title:  (curPlan === 'planA' || curPlan === 'planB') ? "Baby想我就多看一眼，么么哒~" : "天竺少女"},
    {id: 1210264099, title:  (curPlan === 'planA' || curPlan === 'planB') ? "喵~喵~变身波斯猫~把我带回家吧，好不好？" : "咖喱咖喱"},
    {id: 1210804012, title:  (curPlan === 'planA' || curPlan === 'planB') ? "BOOM~睡什么睡，跟我一起嗨起来~~" : "贵妃醉酒"}
  ]
  var recommendDoms = $('.more_list').find('li')
  for(var i = 0,len = recommends.length; i < len; i++){
    var recommendDom = recommendDoms[i]
    var id = recommends[i].id
    var title = recommends[i].title
    getRecommendItem($(recommendDom), id, title)
  }
}
/**
 * 获取视频列表三
 */
function getAllLists() {
  var $recommends = $('.tab_4 .recommend_list li').clone()
  var $mores = $('.tab_5 .more_list li').clone()
  $('.tab_6 .recommend_list_all').append($recommends).append($mores)
}
/**
 * 根据id获取视频相关信息
 * @param ele 绑定元素
 * @param id  视频id
 * @param title 视频title
 */
function getRecommendItem(ele, id, title) {
  if(curPlan === 'planA' || curPlan === 'planB') {
    $.ajax({
      url: "https://bbs.j.cn/api/gameEntryDetail?gameEntryId="+id+"&v=6.1.1",
      type: 'GET',
      dataType: 'jsonp',
      success: function (res) {
        var imgUrl = res.gameEntry.video.thumbPic
        var videoUrl = res.gameEntry.video.url
        ele.data({"imgUrl": imgUrl, "src": videoUrl})
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
  } else if(curPlan === 'planC') {
    counter ++
    ele.find("img").attr({"src": require('../imgs/opera' +counter+ '.png')})
    ele.find("span").text(title)
    if(counter === 8) {
      getAllLists()
    }
  } else if (curPlan === 'planD') {
    counter ++
    ele.find("img").attr({"src": require('../imgs/opera' +counter+ '.png')})
    ele.find("span").text(title)
    if(counter === 8) {
      getAllLists()
      var $mores = $('.tab_5 .more_list li').clone()
      $('.tab_4 .recommend_list').append($mores)
    }
  }
}
/**
 * 添加事件
 */
function addEvent() {
  var media = $('#media')[0]
  if(window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      if(location.hash !== '#for') {
        if(currentEnv.iphone) {
          media.pause()
          $('#media').triggerHandler('ended')
        }
        $('.tab_6').siblings().hide()
        $('.tab_6').show()
      }
    })
  }
  $('.tab_1').on('click', function () {
    //下载总点击
    // objARInit._send1_1('actorvideo', 'download', function () {})
    //下载剧本统计
    // objARInit._send1_1('actorvideo', 'download-' + themeId, function () {})
    if($('.tab_4').css('display') === 'block') {
      // objARInit._send1_1('actorvideo', 'download-out-'+ curPlan, function () {
      //   console.log('download-out-'+ curPlan);
      //   toAppStore()
      // })
    }else{
      if(isUserVideo) {
        //用户视频触发下载
        // objARInit._send1_1('actorvideo', 'download-user-' + curPlan, function () {
        //   console.log('download-user-' + curPlan);
        //   toAppStore()
        // })
      } else {
        //推荐视频触发下载
        //  objARInit._send1_1('actorvideo', 'download-recommend' + curRecommendId + '-' + curPlan, function () {
        //    console.log('download-recommend' + curRecommendId + '-' + curPlan);
        //    toAppStore()
        //  })
      }
    }
  })
  $('.tab_6 .download').on('click', function () {
    // objARInit._send1_1('actorvideo', 'download', function () {
    //   objARInit._send1_1('actorvideo', 'download-' + themeId, function () {
    //     objARInit._send1_1('actorvideo', 'download-back-'+ curPlan, function () {
    //       console.log('download-back-'+ curPlan);
    //       toAppStore()
    //     })
    //   })
    // })
  })
  /*点击遮罩，控制播放与暂停*/
  $('.tab_3').on('click', function (e) {
    var opacityVal = $(this).css('opacity')
    if(tab3FirstClick === true) {
      var posterH = $('.poster').height()
      videoPosterH = posterH
      var tab1H = $('.tab_1').height()
      if(!e.isTrigger) {
        $("#media").attr({'src': videoUrl})
      }
      $('.poster').add('.tab_1').add('.line').add('.tab_4').hide()
      $('.tab_2').add('#media').css({"height": currentEnv.pc ? (posterH - 1) : 'auto'})
      $(this).height(currentEnv.pc ? posterH - 33 : posterH - tab1H)
      $(this).add('#media').css({"opacity": 0})
      $('.tab_1').css({"position":"fixed", "bottom":currentEnv.pc ? "auto" : 0, 'z-index':26})
      if(currentEnv.iphone) {
        $('.tab_1').show().addClass('bounceInUp')
        setTimeout(function () {
          $('.tab_1').removeClass('bounceInUp')
        },3000)
      }
      media.play()
      tab3FirstClick = false
      isUserVideo = true
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
      $(this).css({"opacity": 1})
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
      $('.play').hide()
      $('.tab_3').css({opacity: 1})
      $('.tab_5').show()
    } else {
      $('.tab_6').siblings().hide()
      $('.tab_6').show()
    }
    tab3FirstClick = true
    initPlayer = true
  })
  /*正在缓冲*/
  $('#media').on('waiting', function () {
    $('.loader').css({visibility: 'visible'})
  })
  /*中途退出全屏回到初始页面*/
  media.addEventListener('x5videoexitfullscreen', function () {
    if(this.currentTime > 0 && this.currentTime < this.duration) {
      $('#media').triggerHandler('ended')
    }
    $('.tab_5').hide()
    $('.poster').add('.line').add('.tab_4').add('.tab_3').add('.play').show()
    $('.tab_2').add('.tab_3').css({"height":$('#app').width()})
    $('.tab_1').css({"position":"static"})
    if(curPlan === 'planC' || curPlan === 'planD') {
      $('.tab_4').add('.tab_5').hide()
    }
  })
  if(curPlan === 'planA') {
    /*点击推荐视频列表一*/
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      if(currentEnv.pc){
        if(objARInit.hls){
          objARInit.hls.loadSource($(this).data("src"))
          objARInit.hls.attachMedia(media)
        }
      }else{
        $("#media").attr({"src":$(this).data("src")})
      }
      curRecommendId = hotId
      $('.tab_3').triggerHandler('click')
      isUserVideo = false
      /*点击推荐视频发送id 1x1*/
      // objARInit._send1_1('actorvideo', 'hot-' + hotId + '-planA', function () {})
    })
    /*点击推荐视频列表二*/
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      $('#media').css({"opacity": 0})
      $('.play').show()
      $('.tab_5').hide()
      if(currentEnv.pc){
        if(objARInit.hls){
          objARInit.hls.loadSource($(this).data("src"))
          objARInit.hls.attachMedia(media)
        }
      }else{
        $("#media").attr({"src":$(this).data("src")})
      }
      $('.tab_3').css({opacity: 0})
      curRecommendId = hotId
      isUserVideo = false
      tab3FirstClick = false
      media.play()
      /*点击推荐视频发送id 1x1*/
      // objARInit._send1_1('actorvideo', 'hot-' + hotId + '-planA', function () {})
    })
    /**
     * 点击推荐视频列表三
     */
    $('.recommend_list_all').on('click', 'li', function () {
      var tab1H = $('.tab_1').height()
      var hotId = $('.recommend_list_all li').index(this) + 1
      $('.play').add('.tab_2').add('.tab_3').show()
      $('.tab_6').add('.poster').hide()
      $('.tab_2').add('#media').css({"height": currentEnv.pc ? (videoPosterH - 1) : 'auto'})
      $('.tab_3').height(currentEnv.pc ? videoPosterH - 33 : $('.tab_2').height() - tab1H)
      $('.tab_3').add('#media').css({"opacity": 0})
      $('.tab_1').css({"position":"fixed", "bottom":currentEnv.pc ? "auto" : 0, 'z-index':26})
      if(currentEnv.pc){
        if(objARInit.hls){
          objARInit.hls.loadSource($(this).data("src"))
          objARInit.hls.attachMedia(media)
        }
      }else{
        var curLi = hotId < 5 ? $($('.recommend_list li')[hotId - 1]) : $($('.more_list li')[hotId - 5])
        $("#media").attr({"src": curLi.data("src")})
      }
      curRecommendId = hotId
      media.play()
      isUserVideo = false
      tab3FirstClick = false
      /*点击推荐视频发送id 1x1*/
      // objARInit._send1_1('actorvideo', 'back-' + curPlan + '-hot-' + hotId, function () {})
    })
  } else {
    $('.recommend_list').on('click', 'li', function () {
      var hotId = $('.recommend_list li').index(this) + 1
      // objARInit._send1_1('actorvideo', curPlan + '-hot-' + hotId, function () {
      //   console.log(hotId);
      //   toAppStore()
      // })
    })
    $('.more_list').on('click', 'li', function () {
      var hotId = $('.more_list li').index(this) + 5
      // objARInit._send1_1('actorvideo', curPlan + '-hot-' + hotId, function () {
      //   console.log(hotId);
      //   toAppStore()
      // })
    })
    $('.recommend_list_all').on('click', 'li', function () {
      var hotId = $('.recommend_list_all li').index(this) + 1
      // objARInit._send1_1('actorvideo', 'back-' + curPlan + '-hot-' + hotId, function () {
      //   console.log(hotId);
      //   toAppStore()
      // })
    })
  }
  /**
   * 重播
   */
  $('.replay').on('click', function () {
    $('#media').css({"opacity": 0})
    $('.play').show()
    $('.tab_5').hide()
    $('.tab_3').css({opacity: 0})
    // isUserVideo = true
    tab3FirstClick = false
    media.play()
  })
}
/**
 * 不同版本样式调整
 */
function changeStyle() {
  var oImg = new Image()
  oImg.src = curPlan === 'planC' ? wenan3 : wenan4
  oImg.onload = function () {
    $('.tab_4 .recommend_title').text('热门剧本')
    $('.tab_4').css({'background-color': '#f2f2f2','margin-top':-1})
    $('.tab_6 .recommend_title').add('.line').remove()
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
  $('.recommend_list li span').css({'font-size':'16px','line-height':'25px'})
  $('.more_list li span').css({'font-size':'13px'})
  $('.line').height(10)
  $(".recommend_list li div").css({height:215,"min-height":"auto"})
  $('.loader').css({position:'absolute',width: 50, height: 50})
}
var objARInit = new ARInit()
var tab3FirstClick = true //是否是第一次点击tab_3
var initPlayer = true //是否开始播放
var isUserVideo = true //是否是用户video
var curRecommendId = null //当前点击的推荐video的Id
var plans = ['planA', 'planB', 'planC', 'planD']
var curPlan = null
var counter = 0
var videoPosterH = 0
curPlan = plans[Math.floor(Math.random() * 4)]
var currentEnv = judgeEnv() //获取运行环境
//获取url参数
var postId = objARInit._GetQueryString('postid') || 353809409  //1192802496
var videoUrl = objARInit._GetQueryString('videoUrl') ||  "https://video1.j.cn/video/forum/171031/2039/cf88d0984abf4223.m3u8"
var imgUrl = objARInit._GetQueryString('imgUrl') || "https://static3.j.cn/img/testforum/171103/1803/aa652fd5ccef462f.jpg"
var themeId = objARInit._GetQueryString('themeId') || 3
var themeName = objARInit._GetQueryString('themeName')

$(function () {
  var media = document.getElementById('media')
  //设置海报poster和video src
  $('.poster').attr('src', imgUrl)
  getRecommendLists()
  getMoreLists()
  if(curPlan === 'planC' || curPlan === 'planD'){
    changeStyle()
  }
  //初始化统计
  /*objARInit._send1_1('actorvideo', 'share-open', function () {})
  objARInit._send1_1('actorvideo', 'share-open-' + themeId, function () {})
  objARInit._send1_1('actorvideo', 'share-open-' + curPlan, function () {})*/
  if(currentEnv.pc){
    //pc
    import('hls.js')
      .then(function (Hls) {
        if(Hls.isSupported()) {
          objARInit.hls = new Hls()
          objARInit.hls.loadSource(videoUrl)
          objARInit.hls.attachMedia(media)
        }
        window.onload = function () {
          $('#app').show()
          scalePcPage()
        }
      })
  }else{
    //mobile
    if(currentEnv.android){
      $('.tab_5').css({'padding-top': 64})
    }
    if(currentEnv.iphone){
      $('.tab_6 .recommend_list_all').css({'padding-bottom': 120})
    }
    $('#app').show()
  }
  addEvent()
  pushHistroy()
})