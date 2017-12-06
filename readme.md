 #### browser-sync start --server --files "*/*.*" --no-notify

需求：
2. 播放完视频后，推荐新的4个
3. 后退打开新页面推荐8个视频
4. ABC三个方案同时存在，AB区别在于推荐视频的点击是去看视频还是下载，C区别是封面图和文案


+ zhu:
  //var HHH =  document.body.clientHeight
  //android(1108)  iphone(1182)
  //var screen = window.screen.height
  //android(1280)  iphone(1136)
  video全屏高度 = 1138 + 120 = 1258

+ 懒加载

  recommend_list、more_list、all_list三个列表有图片，more_list不需要懒加载图片，window.onload的时候运行一次lazy-load,window.scroll的时候再次lazy-load。all_list lazy_laod时机：当all_list展示（当popstate时，检查scroll，lazyload事件是否 存在如果存在则不用添加scroll事件，否则就添加scroll事件）的时候首先lazy-load,然后添加scroll事件