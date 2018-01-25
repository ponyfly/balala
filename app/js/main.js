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
function setCurrentOpera(curVideoId) {
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
      let curThemeName = res.works.scenario.name
      let curThemePic = res.works.scenario.coverUrl
      curThemeId = res.works.scenario.id
      $('.current_opera_img').attr({src: curThemePic})
      $('.current_opera_title').text(curThemeName)
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
      let $li = $('<li><div><img src="'+ recommendVideosB[i].coverUrl +'?imageView2/1/w/360/h/430" alt=""></div>' + '<span>' + recommendVideosB[i].title + '</span></li>')
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
      let $li = $('<li><div><img src="' + recommendVideos2[i].coverUrl + '?imageView2/1/w/360/h/430" alt=""></div><span>' + recommendVideos2[i].title + '</span></li>')
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
         Tool._send1_1('balala', 'download-recommend' + curRecommendId + '-' + curPlan, function ()  {
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
        setCurrentOpera(curVideoId)
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
    $('.tab_1').css({'z-index': -100})
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
    if (curPlan === 'planA') {
      $('#media').attr({src:recommendVideos[hotId - 1].videoSrc})
      curVideoId = recommendVideos[hotId - 1].id
    } else if (curPlan === 'planB') {
      $('#media').attr({src:recommendVideosB[hotId - 1].videoSrc})
      curVideoId = recommendVideosB[hotId - 1].id
    }
    curRecommendId = hotId
    $('.tab_3').triggerHandler('click')
    setCurrentOpera(curVideoId)
    /*点击推荐视频发送id 1x1*/
    // alert('hot-' + hotId + '-planA')
    Tool._send1_1('balala', 'hot-' + hotId + '-' + curPlan, function () {})
  })
  /*点击推荐视频列表二*/
  $('.more_list').on('click', 'li', function () {
    var hotId = $('.more_list li').index(this) + (curPlan === 'planA' ? 5 : 9)
    $('#media').css({opacity: 0})
    if (curPlan === 'planA') {
      $('#media').attr({src:recommendVideos[hotId - 1].videoSrc})
      curVideoId = recommendVideos[hotId - 1].id
    } else if (curPlan === 'planB') {
      $('#media').attr({src:recommendVideosB[hotId - 1].videoSrc})
      curVideoId = recommendVideosB[hotId - 1].id
    }
    $('.tab_5').hide()
    curRecommendId = hotId
    isUserVideo = false
    setCurrentOpera(curVideoId)
    media.play()
    /*点击推荐视频发送id 1x1*/
    // alert('hot-' + hotId + '-planA')
    Tool._send1_1('balala', 'hot-' + hotId + '-' + curPlan, function () {})
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
      $('.tab_6').add('.poster').hide()
      $('.tab_2').show()
      $('.tab_2').add('#media').css({'height': currentEnv.pc ? 666 : 'auto'})
      $('.tab_3').height(currentEnv.pc ? 634 : videoPosterH - 120)
      $('.tab_1').css({position: 'fixed', bottom: currentEnv.pc ? 'auto' : 0, 'z-index':26})
      curRecommendId = hotId
      curVideoId = recommendVideos2[hotId - 1].id
      tab3FirstClick = false
      isUserVideo = false
      media.play()
      setCurrentOpera(curVideoId)
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
  $('.recommend_list li,.recommend_list_all li').css({width: scale * 360, margin: '0 0 5px 5px', 'padding-bottom': 0})
  $('.recommend_list li img').css({height: 'auto'})
  $('.recommend_list li span').css({'font-size':'14px','line-height':'25px'})
  $('.more_list li span').css({'font-size':'13px'})
  $('.line').height(10)
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
  {id: 281, title: '哈哈，快来看看我美不美？自拍还能这么搞笑~？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171110/1340/05351f92a7ae446b.mp4'},
  {id: 282, title: '我们都是小仙女~你能找到乱入的糙汉子吗？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171031/2039/cf88d0984abf4223.mp4'},
  {id: 283, title: '人真的有灵魂吗？谁能帮我解释下这个现象？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171031/1959/9aae09e4d4e54a2c.mp4'},
  {id: 280, title: '我爱洗澡皮肤好好~里面有美人出浴图哦~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171113/1915/ed41555a0adb4011.mp4'},
  {id: 719, title: 'BOOM~睡什么睡，跟我一起嗨起来~~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171121/1229/443a45292be54cae.mp4'},
  {id: 276, title: '女孩子花点钱怎么了？为啥不让买包包？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171117/0740/b4635e7608bd460f.mp4'},
  {id: 277, title: 'Baby想我就多看一眼，么么哒~', videoSrc: 'https://snapstatic1.j.cn/video/forum/171119/1844/346f599368ca441e.mp4'},
  {id: 278, title: '喵~喵~变身波斯猫~把我带回家吧，好不好？', videoSrc: 'https://snapstatic1.j.cn/video/forum/171120/1926/2908df4bd1b349cb.mp4'}
]
const recommendVideosB = [
  {id: 708, title: '宝宝感冒了，不想吃药，不想打针', coverUrl: 'https://static2.j.cn/img/forum/171226/2100/232251f9111742e5.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171226/2100/29ee411a8f92489a.mp4'},
  {id: 743, title: '这个视频带我穿越东南亚喽~', coverUrl: 'https://static3.j.cn/img/forum/171209/2339/3da9874c7bee4571.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171209/2339/83ccf5dde1f04f3c.mp4'},
  {id: 831, title: '来呀，快活呀~', coverUrl: 'https://static3.j.cn/img/forum/171128/1823/b760781e09a14d50.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171128/1824/3e1431a4c7d643dd.mp4'},
  {id: 860, title: '免费抓一只可爱的娃娃带回家~', coverUrl: 'https://static3.j.cn/img/forum/180105/1634/fc254d625935469c.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/180105/1634/016c9774099b41db.mp4'},
  {id: 957, title: '我是女生', coverUrl: 'https://static2.j.cn/img/forum/171123/1812/40fb21cd5871471b.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171123/1809/4abd4d561e5445de.mp4'},
  {id: 982, title: '想我就多看一眼，么么哒~', coverUrl: 'https://static2.j.cn/img/forum/171124/0507/7f0d61f1e61a4d3e.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171124/0506/ddf822469d8c489c.mp4'},
  {id: 1374, title: '请叫我小仙女~', coverUrl: 'https://static2.j.cn/img/forum/171227/1753/9f5922f43190471b.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/171227/1753/0f659a18aa14426d.mp4'},
  {id: 11491, title: '据说看到这个的人，都爱上了我~', coverUrl: 'https://static3.j.cn/img/forum/180112/1642/875f3af4815d4204.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/180112/1642/c41eb63f241b476d.mp4'},
  {id: 12259, title: '我男朋友可帅了呢，不信你看！', coverUrl: 'https://snapstatic1.j.cn/image/snap/180119/1129/0ddf45cb896845ef.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/snap/180119/1129/da681ff00d4c4ea4.mp4'},
  {id: 22410, title: '没请我吃过饭，就没资格说我胖~', coverUrl: 'https://static4.j.cn/img/forum/180113/1907/09aaadeee1084a98.jpg', videoSrc: 'https://snapstatic1.j.cn/video/snap/180113/1907/e9c797f9c63548b2.mp4'},
  {id: 24065, title: '是个无封面的', coverUrl: 'https://snapstatic1.j.cn/image/snap/180121/2321/0752713b907d48cd.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/snap/180121/2322/2f0bc753f8d64612.mp4'},
  {id: 24429, title: '我的小可爱，皇冠给你戴~', coverUrl: 'https://snapstatic1.j.cn/image/snap/180122/1936/38d75f85cd6e496b.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/180122/1936/9b6c1db900654ceb.mp4'}
]
const recommendVideos2 = [
  {id: 708, title: '宝宝感冒了，不想吃药，不想打针', coverUrl: 'https://static2.j.cn/img/forum/171226/2100/232251f9111742e5.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171226/2100/29ee411a8f92489a.mp4'},
  {id: 1016, title: '想不想看看大风车可以吹出什么？', coverUrl: 'https://static3.j.cn/img/forum/171127/2109/baa9b71ba92f4ad2.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/forum/171127/2109/738f73c4c7f44a27.mp4'},
  {id: 1374, title: '请叫我小仙女~', coverUrl: 'https://static2.j.cn/img/forum/171227/1753/9f5922f43190471b.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/171227/1753/0f659a18aa14426d.mp4'},
  {id: 11517, title: '点进来就可以和夜华君谈恋爱哦！', coverUrl: 'https://static1.j.cn/img/forum/180114/1720/cefacf73f325417f.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/snap/180114/1719/f44b1bf633ff4f88.mp4'},
  {id: 11518, title: '下雪了，你会变成我的雪人吗', coverUrl: 'https://static1.j.cn/img/forum/180114/1711/605d499a2f3942d8.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/forum/180114/1709/a4311d0291814673.mp4'},
  {id: 11626, title: '我和小哥哥的不可描述……', coverUrl: 'https://snapstatic2.j.cn/image/testsnap/180117/1428/6c6f1acd250b4816.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/dramamp4/testsnap/180117/1428/a3848132b0f44a41.mp4'},
  {id: 22392, title: '喵~喵~我是波斯猫~', coverUrl: 'https://snapstatic2.j.cn/image/snap/180119/1801/7c55c642e62f4c4a.jpg', videoSrc: 'https://snapstatic1.j.cn/compress/video/snap/180119/1801/9c72daa0969f4957.mp4'},
  {id: 22852, title: '快来收你的新年礼物啦！', coverUrl: 'https://snapstatic2.j.cn/image/snap/180120/0714/c35b94fd12e24687.jpg', videoSrc: 'https://snapstatic2.j.cn/compress/video/snap/180120/0714/787911b56e994855.mp4'}
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

let videoUrl = '' //|| 'https://video1.j.cn/video/forum/171130/2249/c72bad97685d40ec.mp4' //用户视频播放地址
let imgUrl = '' //|| 'https://static3.j.cn/img/forum/171130/2249/5e3084219b684fd5.jpg' //用户视频封面
let themeId = '' || 0 //用户视频对应的剧本id
let curVideoId = ''
let curThemeId = ''  //方案A当前播放视频对应的剧本id

//initPage
initPage()