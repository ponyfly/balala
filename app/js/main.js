import $ from 'jquery'
import 'babel-polyfill'
import Tool from './tools'
import '../css/reset.css'
import '../css/main.css'

import wenan4 from '../imgs/wenan4.png'

/**
 * 统计点：发送播放请求
 */
function postCommonStats({id = 0, jcntarget = '', jcnapp = ''}) {
  const url = 'https://snap.j.cn/api/commonStats'
  const {jcnappid, jcnuserid} = Tool._getJcn()
  const data = {
    'itemId': id + '',
    'action': 'h5detail',
    'target': jcntarget || '',
    'typeId': themeId + '',
    'app': jcnapp || '',
    'from': 'h5',
    'clientEnv': {
      'jcnappid': jcnappid + '',
      'jcnuserid': jcnuserid + '',
      'latitude': '0',
      'longitude': '0',
      'net': '',
      'v': '0'
    },
    'userid': userId + ''
  }
  $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(data),
  })
    .then(({statusCode}) => console.log)
    .fail(console.log)
}
/**
 * 判断运行环境
 * @returns {{}}
 */
function judgeEnv() {
  const ua = navigator.userAgent.toLowerCase()
  return {
    'weixin': ua.indexOf('micromessenger') > -1,
    'qq': ua.indexOf('qq') > -1,
    'weibo': ua.indexOf('weibo') > -1,
    'iphone': ua.indexOf('iphone') > -1,
    'android': ua.indexOf('android') > -1,
    'baidu': ua.indexOf('baidu') > -1,
    'pc': /android|webos|iphone|ipod|blackberry/i.test(ua) ? false : true,
    'momo': ua.indexOf('momowebview') > -1,
  }
}
/**
 * 添加历史记录
 */
function pushHistroy() {
  var state = {
    title: '',
    url: '#'
  }
  try {
    window.history.pushState(state, '', '#for')
  } catch (err) {

  }
}
/**
 * 跳转到appStore
 */
function toAppStore() {
  // alert(curPlan === 'planA'? 'app-a' : 'app-b');
  window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.tock&ckey=CK1385982821822'
}
/**
 * 获取当前播放视频的剧本信息
 */
function setCurrentOpera(curVideoId, curThemePic, curThemeName) {
  // if(curThemePic === '') {
  //   curThemePic = require('../imgs/default_theme_pic.png')
  // }
  let hostName = ''
  switch (queryObj.env) {
    case 'test' :
      hostName = 'snaptest.j.cn'
      break
    case 'pre' :
      hostName = 'snappre.j.cn'
      break
    case 'pro' :
      hostName = 'snap.j.cn'
  }
  $.ajax({
    url: hostName.indexOf('snap') > -1 ? 'https://'+ hostName +'/api/worksShareDetail' : 'http://'+ location.hostname +':3002/api/worksShareDetail',
    type: 'POST',
    data: hostName.indexOf('snap') > -1 ? `{"worksId": ${curVideoId}}` : {worksId: curVideoId},
  })
    .then(res => {
      curThemeName = res.works.scenario.name
      curThemePic = res.works.scenario.coverUrl
      $('.current_opera_img').attr({src: res.works.scenario.coverUrl})
      $('.current_opera_title').text(res.works.scenario.name)
    })
    .fail(console.log)
}
/**
 * 获取推荐视频列表
 */
function getRecommendVideos() {
  let arrs = []
  if (curPlan === 'planA') {
    recommendVideos.forEach((rv, i) => {
      let $li = $('<li><div><img src="'+ require('../imgs/userposter'+ (i + 1) +'.png') +'" alt=""></div>' + '<span>' + rv.title + '</span></li>')
      arrs.push($li)
    })
    $('.tab_4 .recommend_list').append(arrs.slice(0,4))
    $('.tab_5 .more_list').append(arrs.slice(4))
  } else if (curPlan === 'planB') {
    const len = recommendVideosB.length
    for ( let i = 0; i < len; i++) {
      let $li = $('<li><div><img src="'+ recommendVideosB[i].coverUrl +'?imageMogr2/thumbnail/360x/crop/360x430" alt=""></div>' + '<span>' + recommendVideosB[i].title + '</span></li>')
      arrs.push($li)
    }
    $('.tab_4 .recommend_list').append(arrs.slice(0,8))
    $('.tab_5 .more_list').append(arrs.slice(8))
  }
}
/**
 * 获取剧本列表
 */
function getRecommendOperas() {
  let operas = []
  let arrs = []
  if (curPlan === 'planA'){
    operas = ['爱你','灵魂出窍','波斯猫','床照','魅力女主播','天竺少女', '皇上驾崩', '贵妃醉酒']
    operas.forEach((op, i) => {
      let $li = $('<li><div><img src="' + require('../imgs/opera'+ (i + 1) +'.png') + '" alt=""></div><span>' + operas[i] + '</span></li>')
      arrs.push($li)
    })
  } else if (curPlan === 'planB') {
    let len = recommendVideos2.length
    for (let i = 0; i < len; i++) {
      let $li = $('<li><div><img src="' + recommendVideos2[i].coverUrl + '?imageMogr2/thumbnail/360x/crop/360x430" alt=""></div><span>' + recommendVideos2[i].title + '</span></li>')
      arrs.push($li)
    }
  }
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
    Tool._send1_1('balala', 'download', function () {
      Tool._send1_1('balala', 'download-' + curPlan, function () {
        // 下载剧本统计
        Tool._send1_1('balala', 'download-' + themeId, function () {})
      })
    })
    if(tab3FirstClick) {
      //在首页点击下载
      // alert('download-out-'+ curPlan)
      Tool._send1_1('balala', 'download-out-'+ curPlan, function () {
        console.log('download-out-'+ curPlan);
        toAppStore()
      })
    }else{
      if(isUserVideo) {
        // alert('download-user-' + curPlan)
        //用户视频触发下载
        Tool._send1_1('balala', 'download-user-' + curPlan, function () {
          console.log('download-user-' + curPlan);
          toAppStore()
        })
      } else {
        // alert('download-recommend' + curRecommendId + '-' + curPlan)
        //推荐视频触发下载
         Tool._send1_1('balala', 'download-recommend' + curRecommendId + '-' + curPlan, function () {
           console.log('download-recommend' + curRecommendId + '-' + curPlan);
           toAppStore()
         })
      }
    }
  })
  $('.current_opera_wrapper').on('click', function () {
    Tool._send1_1('balala', 'download', function () {
      Tool._send1_1('balala', 'download-' + curPlan, function () {
        if(isUserVideo) {
          Tool._send1_1('balala', 'download-' + themeId, function () {
            Tool._send1_1('balala', 'download-user', function () {
              // alert('download-user')
              toAppStore()
            })
          })
        }else {
          Tool._send1_1('balala', 'download-' + curThemeId, function () {
            Tool._send1_1('balala', 'download-recommend' + curRecommendId + '-drama', function () {
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
    Tool._send1_1('balala', 'download', function () {
      Tool._send1_1('balala', 'download-' + themeId, function () {
        Tool._send1_1('balala', 'download-' + curPlan, function () {
          Tool._send1_1('balala', 'download-back-'+ curPlan, function () {
            console.log('download-back-'+ curPlan);
            toAppStore()
          })
        })
      })
    })
  })
  /*点击遮罩，控制播放与暂停*/
  $('.tab_3').on('click', function (e) {
    if(onceClick){
      //发送post请求
      postCommonStats(queryObj)
      onceClick = false
    }
    var opacityVal = $(this).css('opacity')
    if(tab3FirstClick === true) {
      var tab1H = $('.tab_1').height()
      if(!e.isTrigger) {
        $('#media').attr({'src': videoUrl})
        curVideoId = queryObj.id
        curThemeId = themeId
        curThemePic = themePic
        curThemeName = themeName
        setCurrentOpera(curVideoId, curThemePic, curThemeName)
        isUserVideo = true
      } else {
        isUserVideo = false
      }
      if(currentEnv.pc) {
        $(this).css({'background-color': 'rgba(0,0,0,0)'})
      }
      $('.tab_1').add('.line').add('.tab_4').add('.poster').hide()
      $('.tab_2').add('#media').css({'height': currentEnv.pc ? 666 : 'auto'})
      $(this).height(currentEnv.pc ? 634 : videoPosterH - tab1H)
      $(this).add('#media').css({opacity: 0})
      $('.tab_1').css({position: 'fixed', bottom: currentEnv.pc ? 'auto' : 0, 'z-index':26})
      $('.tab_1').show().addClass('bounceInUp')
      setTimeout(function () {
        $('.tab_1').removeClass('bounceInUp')
      },3000)
      media.play()
      tab3FirstClick = false
    } else {
      if(opacityVal === '0') {
        $(this).css({'opacity': 1})
        media.pause()
      } else {
        $(this).css({'opacity': 0})
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
    $('.tab_1').css({position: 'static'})
    $('.tab_2').add('.tab_3').css({height: appWidth})
    $('.tab_3').css({opacity: 1})
    $('.poster').add('.line').add('.tab_4').show()
    $('.tab_5').hide()

    if(this.currentTime > 0 && this.currentTime < this.duration) {
      initPlayer = true
    }
    tab3FirstClick = true
  })
  /*点击推荐视频列表一*/
  $('.recommend_list').on('click', 'li', function () {
    var hotId = $('.recommend_list li').index(this) + 1
    $('#media').attr({src:recommendVideos[hotId - 1].videoSrc})
    curRecommendId = hotId
    $('.tab_3').triggerHandler('click')
    if (curPlan === 'planA') {
      curVideoId = recommendVideos[hotId - 1].id
    } else if (curPlan === 'planA') {
      curVideoId = recommendVideosB[hotId - 1].id
    }
    curThemeId = recommendVideos[hotId - 1].themeId
    curThemePic = require('../imgs/rec-'+ curThemeId +'.png')
    curThemeName = recommendVideos[hotId - 1].themeName
    setCurrentOpera(curVideoId, curThemePic, curThemeName)
    /*点击推荐视频发送id 1x1*/
    // alert('hot-' + hotId + '-planA')
    Tool._send1_1('balala', 'hot-' + hotId + '-' + curPlan, function () {})
  })
  /*点击推荐视频列表二*/
  $('.more_list').on('click', 'li', function () {
    var hotId = $('.more_list li').index(this) + (curPlan === 'planA' ? 5 : 9)
    $('#media').css({opacity: 0})
    $('#media').attr({src:recommendVideos[hotId - 1].videoSrc})
    $('.tab_5').hide()
    curRecommendId = hotId
    isUserVideo = false
    if (curPlan === 'planA') {
      curVideoId = recommendVideos[hotId - 1].id
    } else if (curPlan === 'planA') {
      curVideoId = recommendVideosB[hotId - 1].id
    }
    curThemeId = recommendVideos[hotId - 1].themeId
    curThemePic = require('../imgs/rec-'+ curThemeId +'.png')
    curThemeName = recommendVideos[hotId - 1].themeName
    setCurrentOpera(curVideoId, curThemePic, curThemeName)
    media.play()
    /*点击推荐视频发送id 1x1*/
    // alert('hot-' + hotId + '-planA')
    Tool._send1_1('balala', 'hot-' + hotId + '-planA', function () {})
  })
  /*点击推荐视频列表三*/
  $('.recommend_list_all').on('click', 'li', function () {
    var hotId = $('.recommend_list_all li').index(this) + 1
    // alert('back-' + curPlan + '-hot-' + hotId)
    if (curPlan === 'planA') {
      Tool._send1_1('balala', 'download', function () {
        Tool._send1_1('balala', 'download-' + themeId, function () {
          Tool._send1_1('balala', 'download-' + curPlan, function () {
            Tool._send1_1('balala', 'back-' + curPlan + '-hot-' + hotId, function () {
              console.log(hotId);
              toAppStore()
            })
          })
        })
      })
    } else if (curPlan === 'planB') {
      $('#media').attr({src:recommendVideos2[hotId - 1].videoSrc})
      isUserVideo = false
      $('.tab_6').hide()
      $('.tab_2').show()
      $('.tab_2').add('#media').css({'height': currentEnv.pc ? 666 : 'auto'})
      $('.tab_3').height(currentEnv.pc ? 634 : videoPosterH - 120)
      $('.tab_1').css({position: 'fixed', bottom: currentEnv.pc ? 'auto' : 0, 'z-index':26})
      curRecommendId = hotId
      if (curPlan === 'planA') {
        curVideoId = recommendVideos[hotId - 1].id
      } else if (curPlan === 'planA') {
        curVideoId = recommendVideos2[hotId - 1].id
      }
      curThemeId = recommendVideos2[hotId - 1].themeId
      curThemePic = require('../imgs/rec-'+ '21' +'.png')
      curThemeName = recommendVideos2[hotId - 1].themeName
      setCurrentOpera(curVideoId, curThemePic, curThemeName)
      media.play()
      Tool._send1_1('balala', 'back-' + curPlan + '-hot-' + hotId, function () {})
    }
  })
  /**
   * 重播
   */
  $('.replay').on('click', function () {
    $('#media').css({'opacity': 0})
    $('.tab_5').hide()
    media.play()
    // alert('repeat-' + curPlan)
    Tool._send1_1('balala', 'repeat-' + curPlan, function () {})
  })
}
/**
 * 不同版本样式调整
 */
function changeStyle() {
  if (curPlan === 'planB') {
    $('.header').attr('src',require('../imgs/download3@2x.png'))
    $('.tab_4 .recommend_title').html('大家都在玩')
    $('.tab_5 .more_title').html('大家都在玩')
    $('.tab_5 .current_opera_wrapper').css({background: 'url('+ require('../imgs/opera_current3.png') +')'})
  } else {
    $('.header').attr('src',require('../imgs/download2@2x.png'))
  }
  var oImg = new Image()
  oImg.src = wenan4
  oImg.onload = function () {
    $('.tab_6 .recommend_title').remove()
    $('.tab_6').prepend($(oImg).clone())
  }
}
/**
 * pc页面适配
 */
function scalePcPage() {
  const w = 375
  const scale = w/750
  $('#media').width(w).height(667)
  $('#app').css({'width': w})
  $('.tab_1').css({'width': w})
  $('.tab_3').add('.tab_2').css({'height': w})
  $('.play').css({'width': scale * 144, 'height': scale * 145})
  $('.recommend_title').css({'font-size':'16px','height':scale * 84,'padding-top': '20px'})
  $('.recommend_list li span').css({'font-size':'14px','line-height':'25px'})
  $('.more_list li span').css({'font-size':'13px'})
  $('.line').height(10)
  $('.recommend_list li div').css({height:215,'min-height':'auto'})
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
  let hostName = ''
  switch (queryObj.env) {
    case 'test' :
      hostName = 'snaptest.j.cn'
      break
    case 'pre' :
      hostName = 'snappre.j.cn'
      break
    case 'pro' :
      hostName = 'snap.j.cn'
  }
  $.ajax({
    url: hostName.indexOf('snap') > -1 ? 'https://'+ hostName +'/api/worksShareDetail' : 'http://'+ location.hostname +':3002/api/worksShareDetail',
    type: 'POST',
    data: hostName.indexOf('snap') > -1 ? `{"worksId": ${queryObj.id}}` : {worksId: queryObj.id},
  })
    .then(res => {
      videoUrl = res.works.movie.waterMarkUrl || res.works.movie.url
      imgUrl = res.works.worksPic.url
      curThemeId = themeId = res.works.scenario.id
      curThemeName= themeName = res.works.scenario.name
      curThemePic = themePic = res.works.scenario.coverUrl
      userId = res.works.user.id
      callback && callback()
    })
    .fail(console.log)
}
/**
 * 初始化
 */
function initPage(){
  if(navigator.userAgent.indexOf('MSIE 9.0') > -1) {
    alert('浏览器版本过旧，请升级浏览器')
    return
  }
  if(currentEnv.pc) {$('#media')[0].controls = true}
  getVideoInfo(function () {
    $('.poster').attr('src', imgUrl)
    //初始化统计
    Tool._send1_1('balala', 'share-open', function () {
      Tool._send1_1('balala', 'share-open-' + themeId, function () {
        Tool._send1_1('balala', 'share-open-item-' + queryObj.scenarioId + '-' + queryObj.scenarioMaterialId, function () {})
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
  $('.more_list li div').css({height: appWidth * 0.41})
}
const currentEnv = judgeEnv() //获取运行环境
const appWidth = currentEnv.pc ? 375 : 750
const recommendVideos = [
  {id: 1201110613, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171110/1340/05351f92a7ae446b.mp4', themeId: 16, themeName: '看我有多美'},
  {id: 1192370251, title: '我们都是小仙女~你能找到乱入的糙汉子吗？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171031/2039/cf88d0984abf4223.mp4', themeId: 25, themeName: 'BOYS'},
  {id: 1192328686, title: '人真的有灵魂吗？谁能帮我解释下这个现象？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171031/1959/9aae09e4d4e54a2c.mp4', themeId: 28, themeName: '灵魂出窍'},
  {id: 1203977419, title: '我爱洗澡皮肤好好~里面有美人出浴图哦~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171113/1915/ed41555a0adb4011.mp4', themeId: 29, themeName: '我爱洗澡'},
  {id: 1210804012, title: 'BOOM~睡什么睡，跟我一起嗨起来~~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171121/1229/443a45292be54cae.mp4', themeId: 24, themeName: '不自觉就抖起来了'},
  {id: 1207083505, title: '女孩子花点钱怎么了？为啥不让买包包？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171117/0740/b4635e7608bd460f.mp4', themeId: 36, themeName: '女孩子花点钱怎么了'},
  {id: 1209339072, title: 'Baby想我就多看一眼，么么哒~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171119/1844/346f599368ca441e.mp4', themeId: 26, themeName: '爱你'},
  {id: 1210264099, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171120/1926/2908df4bd1b349cb.mp4', themeId: 21, themeName: '波斯猫'}
]
const recommendVideosB = [
  {id: 743, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 16, themeName: '看我有多美'},
  {id: 24429, title: '我们都是小仙女~你能找到乱入的糙汉子吗？BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 25, themeName: 'BOYS'},
  {id: 708, title: '人真的有灵魂吗？谁能帮我解释下这个现象？BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 28, themeName: '灵魂出窍'},
  {id: 957, title: '我爱洗澡皮肤好好~里面有美人出浴图哦~BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 29, themeName: '我爱洗澡'},
  {id: 24065, title: 'BOOM~睡什么睡，跟我一起嗨起来~~BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 24, themeName: '不自觉就抖起来了'},
  {id: 982, title: '女孩子花点钱怎么了？为啥不让买包包？BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 36, themeName: '女孩子花点钱怎么了'},
  {id: 11491, title: 'Baby想我就多看一眼，么么哒~BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic2.j.cn/water/video/snap/180122/1936/9b6c1db900654ceb.mp4', themeId: 26, themeName: '爱你'},
  {id: 22410, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？BBBB', coverUrl: 'http://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic1.j.cn/video/forum/171120/1926/2908df4bd1b349cb.mp4', themeId: 21, themeName: '波斯猫'},
  {id: 860, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？BBBB', coverUrl: 'http://static3.j.cn/img/forum/180105/1634/fc254d625935469c.jpg', videoSrc: 'http://snapstatic2.j.cn/water/video/snap/180105/1634/016c9774099b41db.mp4', themeId: 21, themeName: '波斯猫'},
  {id: 831, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？BBBB', coverUrl: 'http://static3.j.cn/img/forum/180105/1634/fc254d625935469c.jpg', videoSrc: 'http://snapstatic2.j.cn/water/video/snap/180105/1634/016c9774099b41db.mp4', themeId: 21, themeName: '波斯猫'},
  {id: 12259, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？BBBB', coverUrl: 'http://static3.j.cn/img/forum/180105/1634/fc254d625935469c.jpg', videoSrc: 'http://snapstatic2.j.cn/water/video/snap/180105/1634/016c9774099b41db.mp4', themeId: 21, themeName: '波斯猫'},
  {id: 1374, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？BBBB', coverUrl: 'http://static3.j.cn/img/forum/180105/1634/fc254d625935469c.jpg', videoSrc: 'http://snapstatic2.j.cn/water/video/snap/180105/1634/016c9774099b41db.mp4', themeId: 21, themeName: '波斯猫'}
]
const recommendVideos2 = [
  {id: 22392, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 11518, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 22852, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 1374, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 1016, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 708, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 11517, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'},
  {id: 11626, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？22222', coverUrl: 'https://snapstatic1.j.cn/water/video/snap/180119/1801/9c72daa0969f4957.mp4', themeId: 16666, themeName: '看我有多美2222'}
]
const queryObj = Tool._getQueryObj()

let userId = ''
let videoPosterH = 0
let plans = ['planA', 'planB']
let curPlan = plans[Math.floor(Math.random() * 2)] //当前方案
let tab3FirstClick = true //是否是在首页点击tab_3
let initPlayer = true //是否开始播放
let isUserVideo = true //是否是用户video
let curRecommendId = null //当前点击的推荐video的Id
let onceClick = true

let videoUrl = '' || 'http://v9-dy.ixigua.com/3e1ef4c7ff3bf209d2f1a3d9eb66ffc2/5a6851eb/video/m/220c03aa544305141e6b8e63cc2a3d385321151f37c0000b0637a7156b4/'  //|| 'https://video1.j.cn/video/forum/171130/2249/c72bad97685d40ec.mp4' //用户视频播放地址
let imgUrl = '' //|| 'https://static3.j.cn/img/forum/171130/2249/5e3084219b684fd5.jpg' //用户视频封面
let themeId = '' || 0 //用户视频对应的剧本id
let themePic = '' //|| 'http://ozv2s2gcd.bkt.clouddn.com/img/snap/171201/1605/0c94e13c91284e0f.png' //用户视频对应的剧本封面
let themeName = '' //|| 'name1' //用户视频对应的剧本名字
let curVideoId = ''
let curThemeId = ''  //方案A当前播放视频对应的剧本id
let curThemePic = ''  //方案A当前播放视频对应的剧本封面
let curThemeName = ''  //方案A当前播放视频对应的剧本名字

//initPage
initPage()