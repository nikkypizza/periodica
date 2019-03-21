(function () {
  const isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
  const IMG_PLACEHOLDER = './img/placeholder.png';
  const OUTPUT_DEFAULT_VAL = 'приблизить';

  const svgNode = document.querySelector('svg')
  const svgImgNode = svgNode.querySelector('image');
  const initialX = svgImgNode.getAttribute('x');
  const initialY = svgImgNode.getAttribute('y');
  let imgInitialWidth = svgImgNode.getAttribute('width');
  let imgInitialHeigth = svgImgNode.getAttribute('height');
  let imgCurrentWidth = svgImgNode.getAttribute('width');
  let imgCurrentHeigth = svgImgNode.getAttribute('height');

  const formNode = document.querySelector('form');
  const textInputNode = formNode.querySelector('.TextInput');
  const rangeInputNode = document.querySelector('.RangeInput');

  const outputNode = document.querySelector('output');
  const resetBtn = document.querySelector('.ResetBtn');
  const randomLinkBtn = document.querySelector('.RandomLinkBtn');

  const links = ['https://pbs.twimg.com/profile_images/633782900077408256/F541mrSs_400x400.jpg', 'https://www.visitportugal.com/sites/www.visitportugal.com/files/mediateca/23_660x371.jpg', 'https://cdn.friendsoftheearth.uk/sites/default/files/styles/hero_image/public/media/images/sylwia-bartyzel-135274.jpg?itok=IP4UXGU2'];
  randomLinkBtn.addEventListener('click', function () {
    textInputNode.value = links[Math.floor(Math.random() * links.length)];
  })

  formNode.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var img = new Image();
    img.src = textInputNode.value;
    localStorage.setItem('url', textInputNode.value);

    img.onload = function () {
      svgImgNode.setAttribute('width', this.width);
      svgImgNode.setAttribute('height', this.height);

      imgCurrentWidth = this.width;
      imgCurrentHeigth = this.height;
      localStorage.setItem('width', this.width);
      localStorage.setItem('height', this.height);
    };

    svgImgNode.setAttributeNS('http://www.w3.org/1999/xlink', 'href', textInputNode.value);
    svgImgNode.setAttribute('x', initialX);
    svgImgNode.setAttribute('y', initialY);
    textInputNode.value = '';
    rangeInputNode.value = rangeInputNode.defaultValue;
    outputNode.innerHTML = OUTPUT_DEFAULT_VAL;
  });

  const onZoom = function () {
    const rangeValue = rangeInputNode.value;
    const newWidth = imgCurrentWidth * rangeValue;
    const newHeight = imgCurrentHeigth * rangeValue;

    svgImgNode.setAttribute('width', newWidth);
    svgImgNode.setAttribute('height', newHeight);
    outputNode.innerHTML = rangeValue <= 1 ? 'без приближения' : 'приближение ' + rangeValue + 'x';

    localStorage.setItem('zoom', rangeValue);
    localStorage.setItem('zoomValueStr', outputNode.innerHTML);
    localStorage.setItem('width', newWidth);
    localStorage.setItem('height', newHeight);
  }

  rangeInputNode.addEventListener(isIE ? 'change' : 'input', onZoom);

  const onMouseDown = function (evt) {
    evt.preventDefault();
    let xStartCoords = evt.clientX;
    let yStartCoords = evt.clientY;

    const onMouseMove = function (moveEvt) {
      const shiftX = xStartCoords - moveEvt.clientX;
      const shiftY = yStartCoords - moveEvt.clientY;
      xStartCoords = moveEvt.clientX;
      yStartCoords = moveEvt.clientY;

      const currentX = svgImgNode.getAttribute('x');
      const currentY = svgImgNode.getAttribute('y');

      const newX = currentX - shiftX;
      const newY = currentY - shiftY;
      const imgWidthDiff = Math.abs(imgInitialWidth - svgImgNode.getAttribute('width'));
      const imgHeightDiff = Math.abs(imgInitialHeigth - svgImgNode.getAttribute('height'));

      if (newX <= initialX && newX >= imgInitialWidth - imgWidthDiff - (imgInitialWidth - initialX)) {
        svgImgNode.setAttribute('x', newX);
        localStorage.setItem('x', newX);
      }
      if (newY <= initialY && newY >= imgInitialHeigth - imgHeightDiff - (imgInitialHeigth - initialY)) {
        svgImgNode.setAttribute('y', newY);
        localStorage.setItem('y', newY);
      }
    };

    const onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  svgNode.addEventListener('mousedown', onMouseDown);

  resetBtn.addEventListener('click', function () {
    svgImgNode.setAttributeNS('http://www.w3.org/1999/xlink', 'href', IMG_PLACEHOLDER);
    svgImgNode.setAttribute('width', imgInitialWidth);
    svgImgNode.setAttribute('height', imgInitialHeigth);
    svgImgNode.setAttribute('x', initialX);
    svgImgNode.setAttribute('y', initialY);
    outputNode.value = OUTPUT_DEFAULT_VAL;
    rangeInputNode.value = 1;
    localStorage.clear();
    console.info('Local storage cleared 👌')
  });


  /**
   * Достает все данные из локального хранилища если оно не пусто
   */
  localStorage.url && svgImgNode.setAttributeNS('http://www.w3.org/1999/xlink', 'href', localStorage.url);
  localStorage.width && svgImgNode.setAttribute('width', localStorage.width);
  localStorage.height && svgImgNode.setAttribute('height', localStorage.height);
  localStorage.x && svgImgNode.setAttribute('x', localStorage.x);
  localStorage.y && svgImgNode.setAttribute('y', localStorage.y);
  localStorage.zoomValueStr && (outputNode.innerHTML = localStorage.zoomValueStr);
  if (localStorage.zoom) {
    rangeInputNode.value = localStorage.zoom;
    svgImgNode.setAttribute('width', imgCurrentWidth * localStorage.zoom);
    svgImgNode.setAttribute('height', imgCurrentHeigth * localStorage.zoom);
  }
})();