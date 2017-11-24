import $ from 'jquery'
export default function wxshare(){
    var that = this,
        //分享内容默认配置
        _config = {
            'title' : document.title || '标题',// 分享标题
            'desc' : document.getElementsByName('description')[0] ? document.getElementsByName('description')[0].content : '描述',// 分享描述
            'link' : window.location.href,// 分享链接
            'imgUrl' : document.querySelector('img') ? document.querySelector('img').src : '',// 分享图标（需要大于200*200尺寸）
            'success' : function(msg){
                var type = {
                    'sendAppMessage:ok' : 'friend',
                    'shareTimeline:ok' : 'circle',
                    'shareWeibo:ok' : 'qweibo',
                    'shareQQ:ok' : 'qq',
                    'shareQZone:ok' : 'qzone'
                };
                console.log('分享成功',type[msg.errMsg]);
            },
            'cancel' : function(){
                console.log('取消分享')
            },
        };
    //写入分享内容 & 注册分享事件
    this.bindevent = function(){
        console.log(window.wx_data);
        alert(window.wx);
        if(!window.wx)return false;
        //分享到好友
        wx.onMenuShareAppMessage({
            title: window.wx_data.title,
            desc: window.wx_data.desc,
            link: window.wx_data.link,
            imgUrl: window.wx_data.imgUrl,
            success : window.wx_data.success,
            cancel: window.wx_data.cancel
        });
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: window.wx_data.title,
            desc: window.wx_data.desc,
            link: window.wx_data.link,
            imgUrl: window.wx_data.imgUrl,
            success : window.wx_data.success,
            cancel: window.wx_data.cancel
        });
        //分享到QQ
        wx.onMenuShareQQ({
            title: window.wx_data.title,
            desc: window.wx_data.desc,
            link: window.wx_data.link,
            imgUrl: window.wx_data.imgUrl,
            success : window.wx_data.success,
            cancel: window.wx_data.cancel
        });
        //分享到腾讯微博
        wx.onMenuShareWeibo({
            title: window.wx_data.title,
            desc: window.wx_data.desc,
            link: window.wx_data.link,
            imgUrl: window.wx_data.imgUrl,
            success : window.wx_data.success,
            cancel: window.wx_data.cancel
        });
        //分享到QQ空间
        wx.onMenuShareQZone({
            title: window.wx_data.title,
            desc: window.wx_data.desc,
            link: window.wx_data.link,
            imgUrl: window.wx_data.imgUrl,
            success : window.wx_data.success,
            cancel: window.wx_data.cancel
        });
/*        wx.hideMenuItems({
            menuList: [
                // 'menuItem:share:timeline',
                // 'menuItem:share:qq',
                // 'menuItem:share:weiboApp',
                // 'menuItem:favorite',
                // 'menuItem:share:facebook',
                // 'menuItem:share:QZone',
                // 'menuItem:share:share:email',
                // 'menuItem:share:share:brand',
                // 'menuItem:editTag',
                // 'menuItem:delete',
                // 'menuItem:copyUrl',
                // 'menuItem:originPage',
                // 'menuItem:readMode',
                // 'menuItem:openWithQQBrowser',
                // 'menuItem:openWithSafari'
            ]
        });*/
    };

    //初始化分享API
    this.init = function(){
        if($ && $.getScript){
            console.time("load wx_config.js");
            $.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",function(){
                $.getScript("/api/fetchWeChatJavaScriptSDKConfig",function(){
                    window.wx_data = window.wx_data || _config;
                    wx.ready(that.bindevent);
                    console.timeEnd("load wx_config.js");
                });
            });
        }else{
            console.error("$.getScript undefined");
        }
    };
};
