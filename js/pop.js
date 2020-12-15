var showPop = (function () {
  /**
   * 展示弹窗，传入id
   * @param {*} id
   */
  function showPop(id) {
    var container = $('#' + id); //获取弹窗
    container.style.display = ''; //展示
    if (id === 'popVideo') {
      var video = container.querySelector('video');
      video.play(); //如果是视频则自动播放
    }
  }

  // 获取所有的关闭按钮，隐藏弹窗
  var closes = $$('.pop_close');
  for (var i = 0; i < closes.length; i++) {
    closes[i].onclick = function () {
      var container = this.parentElement.parentElement;
      container.style.display = 'none';
    };
  }

  //选择登录方式
  var popWx = $('.pop_wx');
  var popQq = $('.pop_qq');
  popWx.onclick = function () {
    popWx.classList.add('selected');
    popQq.classList.remove('selected');
  };
  popQq.onclick = function () {
    popQq.classList.add('selected');
    popWx.classList.remove('selected');
  };

  //关闭弹窗是，暂停视频播放
  var colseBtn = $('#popVideo .pop_close');
  colseBtn.addEventListener('click', function () {
    $('#popVideo video').pause();
  });

  return showPop;
})();
