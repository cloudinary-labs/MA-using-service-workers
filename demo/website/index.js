const images = [
  'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wikipedia_mini_globe_handheld.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Carl_Friedrich_Gauss.jpg/340px-Carl_Friedrich_Gauss.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Spacetime_lattice_analogy.svg/440px-Spacetime_lattice_analogy.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2014.03.09.-23-Kaefertaler_Wald-Mannheim-Fruehlings-Scharbockskraut.jpg/1000px-2014.03.09.-23-Kaefertaler_Wald-Mannheim-Fruehlings-Scharbockskraut.jpg'
];

function addImage() {
  const img = document.createElement('img');
  img.src = images.pop();
  document
    .getElementById('image-container')
    .appendChild(img)
}

/**
 * CLIENT CODE
 */
if (navigator.serviceWorker) {
  /**
   *
   * Start configuration!
   */
  const config = {
    clientMetrics: {
      viewportWidth: window.innerWidth,
      // dpr: window.devicePixelRatio || 1, // <----------- Correct DPR
    },
    enabled: true,
    inspection: {
      enableInspection: true
    },
    delivery: {
      cname: 'res.cloudinary.com',
      cloudName: 'demo'
    },
    optimization: {
      // quality: 'auto',       // <----------- Auto q_auto
      // format: 'auto',        // <----------- Auto f_auto
      // limitMaxWidth: true,   // <----------- Limit Max Width based on ViewPort
      additionalRawTransfomrationString: ''
    },
  }
  navigator.serviceWorker.register(`./sw.js?config=${JSON.stringify(config)}`);

  /**
   * Anything below this point is fluff! not needed for it to actually work
   */



  navigator.serviceWorker.addEventListener('message', event => {
    try {
      let analyticsData = JSON.parse(event.data);

      document.getElementById('cloudinary-analytics').innerHTML = `
<span>Assets:${analyticsData.resourcesLoaded.toLocaleString()}</span> 
<span>Originals:${analyticsData.totalOriginalSize.toLocaleString()}</span> 
<span>Optimized:${analyticsData.totalOptimizedSize.toLocaleString()}</span> 
<span>Size footprint:${ Math.round((analyticsData.totalOptimizedSize  * 100/ analyticsData.totalOriginalSize))}%</span>`
    } catch (e) {

    }
  });

  // Send a message to the service worker
  navigator.serviceWorker.ready.then(registration => {
    const analyticsDiv = document.createElement('div');
    analyticsDiv.setAttribute('id', 'cloudinary-analytics');
    analyticsDiv.style = 'background-color:green;color:white;position:absolute;top:0;left:0;width:100%;font-size:2rem;justify-content: space-between;display: flex;';
    document.body.appendChild(analyticsDiv);
    registration.active.postMessage("start-analytics");
  });
}
