import $ from 'jquery'
import '../css/reset.css'
import '../css/recommend.css'

$(window).on('popstate', function () {
  alert(123)
  window.location.href = '../recommend.html'
})