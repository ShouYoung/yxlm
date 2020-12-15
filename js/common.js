/**
 * 获取DOM元素
 * @param {string} selector css选择器,可以是类属性、id、标签名等
 */
function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}
function width() {
  return document.documentElement.clientWidth;
}
function height() {
  return document.documentElement.clientHeight;
}
//创建轮播图
function creatCarousel(carouselId, datas) {
  var container = document.getElementById(carouselId);
  var carouselList = container.querySelector('.g_carousel-list');
  var indcator = container.querySelector('.g_carousel-indicator');
  var prev = container.querySelector('.g_carousel-prev');
  var next = container.querySelector('.g_carousel-next');

  var curIndex = 0; //当前显示索引
  //创建轮播图元素
  function creatCarouselElements() {
    var listHtml = '';
    var indHtml = '';
    for (let i = 0; i < datas.length; i++) {
      var element = datas[i];
      if (element.link) {
        listHtml += `
        <li>
          <a href="${element.link}">
            <img src="${element.image}">
          </a>
        </li>
        `;
      } else {
        listHtml += `
        <li>
          <a>
            <img src="${element.image}">
          </a>
        </li>
        `;
      }
      indHtml += `<li></li>`;
    }
    carouselList.style.width = `${datas.length}00%`;
    carouselList.innerHTML = listHtml;
    indcator.innerHTML = indHtml;
  }
  creatCarouselElements();

  //根据当前索引，设置正确的状态
  function setStatus() {
    //设置展示位置
    carouselList.style.marginLeft = -curIndex * width() + 'px';
    //设置指示器
    indcatorBefore = indcator.querySelector('.selected');
    if (indcatorBefore) {
      indcatorBefore.classList.remove('selected');
    }
    indcator.children[curIndex].classList.add('selected');
    //设置左右按钮
    if (prev) {
      if (curIndex == 0) {
        prev.classList.add('disable');
      } else {
        prev.classList.remove('disable');
      }
    }
    if (next) {
      if (curIndex == datas.length - 1) {
        next.classList.add('disable');
      } else {
        next.classList.remove('disable');
      }
    }
  }
  setStatus();
  if (prev) {
    prev.onclick = toPrev;
  }
  if (next) {
    next.onclick = toNext;
  }
  //左右切换
  function toPrev() {
    if (curIndex > 0) {
      curIndex--;
      setStatus();
    }
  }
  function toNext() {
    if (curIndex < datas.length - 1) {
      curIndex++;
      console.log('++++');
      setStatus();
    }
  }

  //轮播图自动轮播
  var timer = null;
  function start() {
    if (timer) {
      return;
    }
    timer = setInterval(() => {
      if (curIndex == datas.length - 1) {
        curIndex = 0;
      } else {
        curIndex++;
      }
      setStatus();
    }, 3000);
  }
  start();
  //停止轮播
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  //手势切换轮播图
  container.ontouchstart = function (e) {
    e.stopPropagation(); //停止冒泡事件，避免与上下滑动冲突
    stop(); //停止轮播
    carouselList.style.transition = 'none'; //暂停过渡动画
    var startX = e.touches[0].clientX; //记录按下的位置
    var startTime = Date.now();
    container.ontouchmove = function (e) {
      var dis = e.touches[0].clientX - startX;
      carouselList.style.marginLeft = -curIndex * width() + dis + 'px';
    };
    container.ontouchend = function (e) {
      container.ontouchmove = null;
      var dis = e.changedTouches[0].clientX - startX;
      //快速划过
      var duration = Date.now() - startTime;
      if (duration < 300) {
        if (dis < -20 && curIndex < datas.length - 1) {
          toNext();
        } else if (dis > 20 && curIndex > 0) {
          toPrev();
        } else {
          setStatus();
        }
      } else {
        if (dis < -width() / 3 && curIndex < datas.length - 1) {
          toNext();
        } else if (dis > width() / 3 && curIndex > 0) {
          toPrev();
        } else {
          setStatus();
        }
      }
      //重新开始轮播
      start();
      //恢复过渡动画
      carouselList.style.transition = '';
    };
  };
}
// ajax请求
async function ajax(url) {
  var reg = /http[s]?:\/\/[^/]+/;
  var matches = url.match(reg);
  if (matches.length === 0) {
    throw new Error("invalid url");
  }
  var target = matches[0];
  var path = url.replace(reg, "");
  return await fetch(`https://proxy.yuanjin.tech${path}`, {
    headers: {
      target,
    },
  }).then((r) => r.json());
}