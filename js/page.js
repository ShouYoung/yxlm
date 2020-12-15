var showPage = (function () {
  var pageIndex = 0; //当前显示页面
  var nextPage = null; //下一个页面
  var pages = $$('.page_container .page'); //获取所有页面
  //页面归位
  function setStatic() {
    for (var i = 0; i < pages.length; i++) {
      page = pages[i];
      if (i == pageIndex) {
        page.style.zIndex = 1;
      } else {
        page.style.zIndex = 10;
      }
      page.style.top = (i - pageIndex) * height() + 'px';
    }
  }
  setStatic();

  //页面滑动中
  function moving(dis) {
    for (var i = 0; i < pages.length; i++) {
      if (i != pageIndex) {
        page = pages[i];
        page.style.top = (i - pageIndex) * height() + dis + 'px';
      }
    }
    if (dis < 0 && pageIndex < pages.length - 1) {
      //向上滑动
      nextPage = pageIndex + 1;
    } else if (dis > 0 && pageIndex > 0) {
      //向下滑动
      nextPage = pageIndex - 1;
    } else {
      nextPage = null;
    }
  }
  //页面滑动完成
  function moveEnd() {
    if (nextPage == null) {
      setStatic();
      return;
    }
    page = pages[nextPage];
    page.style.transition = '.5s';
    page.style.top = 0;

    setTimeout(function () {
      // 当前页面变了
      pageIndex = nextPage;
      // 动画完了
      page.style.transition = '';
      setStatic();
    }, 500);
  }
  //用户事件
  var pageContainer = $('.page_container');
  pageContainer.ontouchstart = function (e) {
    var y = e.touches[0].clientY;
    function handle(e) {
      var dis = e.touches[0].clientY - y;
      if (Math.abs(dis) < 20) {
        //滑动距离小的时候不处理
        dis = 0;
      }
      moving(dis);
      if (e.cancelable) {//如果事件可以取消
        e.preventDefault(); //阻止用户的默认行为
      }
    }
    //添加滑动事件
    pageContainer.addEventListener('touchmove', handle, {
      passive: false,
    });
    pageContainer.ontouchend = function (e) {
      moveEnd();
      pageContainer.removeEventListener('touchmove', handle); //滑动结束后，移除事件
    };
  };

  //直接控制展示第几个页面
  function showPage(index) {
    var page = pages[index]; //获取下一个要展示的页面
    if (index < pageIndex) {
      page.style.top = -height() + 'px';
    } else if (index > pageIndex) {
      page.style.touches = height() + 'px';
    } else {
      if (pageIndex == 0) {
        pageIndex++;
      } else {
        pageIndex--;
      }
      setStatic();
    }
    //强行渲染页面，当读取dom元素的尺寸或位置时，浏览器会强行渲染
    page.clientHeight;
    nextPage = index;
    //其他页面复位
    moveEnd();
  }
  return showPage;
})();
