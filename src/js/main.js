function ARInit() {}
ARInit.prototype = {
  constructor: ARInit,
  /**
   * 获取连接参数
   * @return {[type]} [description]
   */
  _GetQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  /**
   * [_compressImg description]
   * @return {[type]} [description]
   */
  _compressImg: function(configs) {
    var getCompress = localStorage.getItem('compressImg'),
      arrCompress = getCompress.split(','),
      newThumb = [];

    for (var i = 0; i < arrCompress.length; i++) {
      // newThumb.push(arrCompress[i]+'!t.700.700.70');
      newThumb.push(arrCompress[i]);
      if (configs && (i == arrCompress.length - 1)) {
        // newThumb.push(configs);
        Array.prototype.push.apply(newThumb, configs)
      }
    }
    return newThumb;
  },
  /**
   * 1x1统计
   * @param  {[type]}   name     [description]
   * @param  {[type]}   val      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  _send1_1: function(name, val, callback) {
    var that = this;
    //获取本地uuid
    var get_uuid = localStorage.getItem('uuid') || that._getCookie('uuid');
    var set_uuid = that._uuid();

    function getUuid() {
      if (get_uuid == null) {
        if (window.localStorage) {
          //写入localStorage
          localStorage.setItem('uuid', set_uuid);
        } else {
          //写入cookie
          that._setCookie('uuid', set_uuid);
        }
        return set_uuid
      } else {
        return get_uuid
      }
    }
    //设置统计参数
    var jcnappid = that._GetQueryString('jcnappid') == null ? getUuid() : that._GetQueryString('jcnappid'),
      jcnuserid = that._GetQueryString('jcnuserid') == null ? getUuid() : that._GetQueryString('jcnuserid');

    var img1x1 = new Image();
    img1x1.onload = function() {
      if (callback) {
        callback();
      }
    };
    if (val && typeof val == "string") {
      img1x1.src = "https://share.j.cn/js/1x1.gif?ucs=UTF-8&un=statistic_channel." + name + "_logname." + val + "_login.0&timestamp=" + (new Date() - 0) + "&jcnappid=" + jcnappid + "&jcnuserid=" + jcnuserid;
    }
  },
  /**
   * 生成用户uuid
   * @return {[type]} [description]
   */
  _uuid: function() {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    Math.uuid = function(len, radix) {
      var chars = CHARS,
        uuid = [],
        i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    };

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    Math.uuidFast = function() {
      var chars = CHARS,
        uuid = new Array(36),
        rnd = 0,
        r;
      for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
          uuid[i] = '-';
        } else if (i == 14) {
          uuid[i] = '4';
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
          r = rnd & 0xf;
          rnd = rnd >> 4;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
      return uuid.join('');
    };

    // A more compact, but less performant, RFC4122v4 solution:
    Math.uuidCompact = function() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    return Math.uuidCompact()
  },
  //写cookies
  _setCookie: function(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  //读取cookies
  _getCookie: function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  //删除cookies
  _delCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },

};
var objARInit = new ARInit()

//判断是否是pc
function isPc() {
  var ua = navigator.userAgent
  if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)) {
    return false
  }else {
    return true
  }
}
//获取视频列表页
function getRecommendLists() {
  var recommends = [
    {id: 1192370251, title: "我们都是小仙女~你能找到乱入的糙汉子吗？"},
    {id: 1192328686, title: "人真的有灵魂吗？谁能帮我解释下这个现象？"},
    {id: 1203977419, title: " 我爱洗澡皮肤好好~里面有美人出浴图哦~"},
    {id: 1201110613, title: "哈哈，快来看看我美不美？自拍还能这么搞笑~？"}
  ]
  var recommendDoms = $('.recommend_list').find('li')
  for(var i = 0,len = recommends.length; i < len; i++){
    var recommendDom = recommendDoms[i]
    var id = recommends[i].id
    var title = recommends[i].title
    getRecommendItem($(recommendDom), id, title)
  }
}
//根据id获取视频相关信息
function getRecommendItem(ele, id, title) {
  $.ajax({
    url: "https://bbs.j.cn/api/gameEntryDetail?gameEntryId="+id+"&v=6.1.1",
    type: 'GET',
    dataType: 'jsonp',
    success: function (res) {
      var videoUrl = res.gameEntry.video.url
      ele.data({"src": videoUrl})
      ele.find("span").text(title)
    },
    error: function (err) {
      console.log(err.message);
    }
  })
}
//添加事件
function addEvent() {
  var media = $('#media').get(0)
  $('.tab_1').on('click', function () {
    //下载总点击
    objARInit._send1_1('actorvideo', 'download', function () {})
    //下载剧本统计
    objARInit._send1_1('actorvideo', 'download-' + themeId, function () {})

    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1334936400029"
  })
  $('.btn-download').on('click', function () {
    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1334936400029"
  })
  $('.tab_3').on('click', function () {
    if(media.paused || media.ended){
      media.play()
    }else{
      media.pause()
    }
  })
  $('#media').on('play', function () {
    console.log('play');
    $('.poster').add('.play').add('.line').add('.tab_4').hide()
    $('.tab_2').add('#media').css({"height" : isPc() ? 667 : "100%"})
    $('.tab_1').css({"position":"fixed", "bottom":isPc() ? "auto" : 0, 'z-index':14})
    $('.tab_3').css({'backgroundColor':'transparent','height':$("#app").height() - 31})
  })
  $('#media').on('ended', function () {
    console.log('ended');
    if(!isPc()) {
      $('#media').height(0)
    }
    $('.poster').add('.play').add('.line').add('.tab_4').show()
    $('.tab_2').add('.tab_3').css({"height":$('#app').width()})
    $('.tab_1').css({"position":"static","bottom":"auto"})
    if(isPc()){
      isPc.hls.loadSource(videoUrl)
      isPc.hls.attachMedia(media)
    }else{
      $('#media').attr({src:videoUrl})
    }
    return false
  })
  $('#media').on('waiting', function () {
    $('.loader').show()
  })
  $('#media').on('playing', function () {
    $('.loader').hide()
  })
  $('#media').on('pause', function () {
    $('.play').show()
    $('.tab_3').css('backgroundColor', 'rgba(0,0,0,.2)')
  })
  media.addEventListener('x5videoexitfullscreen', function () {
    $('#media').triggerHandler('ended')
  })
  $('.recommend_list').on('click', 'li', function () {
    if(isPc()){
      if(isPc.hls){
        isPc.hls.loadSource($(this).data("src"))
        isPc.hls.attachMedia(media)
      }
    }else{
      $("#media").attr({"src":$(this).data("src")})
    }
    $('.poster').hide()
    media.play()
  })
}
//缩放pc页面
function scalePcPage() {
  var w = 375
  var scale = w/750
  $('#media').width(w)
  $('#app').css({"width": w})
  $('.tab_1').css({'width': w})
  $('.tab_3').add('.tab_2').css({"height": w})
  $('.play').css({"width": scale * 144, "height": scale * 145})
  $('.recommend_title').css({'font-size':'16px',"height":scale * 84,"padding-top": "20px"})
  $('.recommend_list li span').css({'font-size':'16px','line-height':'25px'})
  $('.line').height(10)
  $(".recommend_list li div").css({height:215,"min-height":"auto"})
  $('.loader').css({position:'absolute',width: 50, height: 50})
}
//获取url参数
var postId = objARInit._GetQueryString('postid') || 353809409  //1192802496
var videoUrl = objARInit._GetQueryString('videoUrl') ||  "https://video1.j.cn/video/forum/171031/2039/cf88d0984abf4223.m3u8"
var imgUrl = objARInit._GetQueryString('imgUrl') || "https://static3.j.cn/img/testforum/171103/1803/aa652fd5ccef462f.jpg"
var themeId = objARInit._GetQueryString('themeId') || 3
var themeName = objARInit._GetQueryString('themeName')

$(function () {
  var media = document.getElementById('media')
  //设置海报poster和videourl
  $('.poster').attr('src', imgUrl)
  $('#media').attr({'src': videoUrl})
  getRecommendLists()
  //初始化统计
  objARInit._send1_1('actorvideo', 'share-open', function () {})
  objARInit._send1_1('actorvideo', 'share-open-' + themeId, function () {})
  addEvent()
  if(isPc()){
    //pc
    if(Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(media);
      /* hls.on(Hls.Events.MANIFEST_PARSED,function() {
         video.play();
       });*/
    }
    window.onload = function () {
      $('#app').show()
      scalePcPage()
    }
  }else{
    //移动端
    $('#app').show()
    $(media).width("100%").height("100%")
  }
})
