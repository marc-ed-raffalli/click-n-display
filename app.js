(function () {
  const mapImgSelector = '.app-map img',
    mapDotsContainerSelector = '.app-map-items',
    overviewContainerSelector = '.app-overview',
    urlOfDataFile = './data.json';

  const img = qs(mapImgSelector),
    mapContainer = qs(mapDotsContainerSelector),
    overviewContainer = qs(overviewContainerSelector);

  let lastIdSelected;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function addToElement(parent, tagName) {
    const elt = document.createElement(tagName);
    parent.appendChild(elt);
    return elt;
  }

  function tap(f) {
    return (d) => Promise.resolve(f(d)).then(() => d);
  }

  window.addEventListener('load', () => {
    fetch(urlOfDataFile)
      .then((res) => res.json())
      .then(tap(setImageSrc))
      .then(tap(processData))
      .then(tap(initEvents))
      .catch((err) => {
        console.error(err);
        overviewContainer.textContent = 'Could not load the application';
      });
  });

  function initEvents() {
    img.addEventListener('click', onMapClick);
    window.addEventListener('resize', positionPoints);
  }

  function setImageSrc(data) {
    return new Promise(((resolve, reject) => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', reject);
      img.src = data.imageUrl;
    }));
  }

  function onMapClick(e) {
    const
      imgRect = img.getBoundingClientRect(),
      pos = {
        x: Math.round((e.clientX - imgRect.left) / imgRect.width * 100),
        y: Math.round((e.clientY - imgRect.top) / imgRect.height * 100),
      };

    console.log('Image:', imgRect);
    console.log('Click on img:', pos);
    console.log('----------------------------');
  }

  function processData(data) {
    document.title = data.title;
    placePointsOnMap(data.items);
  }

  function placePointsOnMap(items) {
    for (let j = 0; j < items.length; j++) {
      const dot = addToElement(mapContainer, 'div');
      dot.data = Object.assign({__id: j}, items[j]);
      dot.classList.add('dot');
      Object.assign(dot.style, items[j].styles);
      dot.addEventListener('click', displayItemData);
    }

    positionPoints();
  }

  function positionPoints() {
    const dots = mapContainer.querySelectorAll('div'),
      imgRect = img.getBoundingClientRect();

    for (let j = 0; j < dots.length; j++) {
      const data = dots[j].data;

      Object.assign(dots[j].style, {
        top: `${imgRect.height / 100 * data.pos.y}px`,
        left: `${imgRect.width / 100 * data.pos.x}px`,
      });
    }
  }

  function displayItemData(e) {
    const d = e.target.data;

    if (lastIdSelected === d.__id) {
      return;
    }

    lastIdSelected = d.__id;

    function renderObject(container, data) {
      const tableElt = addToElement(container, 'table');
      container.appendChild(tableElt);

      Object.entries(data)
        .forEach(entry => {
          const key = entry[0],
            value = entry[1];

          const rowElt = addToElement(tableElt, 'tr'),
            labelElt = addToElement(rowElt, 'td'),
            valueElt = addToElement(rowElt, 'td');

          labelElt.classList.add('label');
          valueElt.classList.add('data');
          labelElt.textContent = key;

          renderValue(valueElt, value);
        });
    }

    function renderValue(valueElt, value) {
      if (Array.isArray(value)) {
        const ulElt = addToElement(valueElt, 'ul');

        value.forEach(v => renderValue(addToElement(ulElt, 'li'), v));
      } else if (typeof value === 'object') {
        renderObject(valueElt, value);
      } else {
        valueElt.textContent = value;
      }
    }

    Array.from(overviewContainer.children).forEach(c => overviewContainer.removeChild(c));
    renderObject(overviewContainer, d.data);
  }

})();
