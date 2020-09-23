
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
      dpr: window.devicePixelRatio || 1, // <----------- Correct DPR
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
      quality: 'auto',       // <----------- Auto q_auto
      format: 'auto',        // <----------- Auto f_auto
      limitMaxWidth: true,   // <----------- Limit Max Width based on ViewPort
      additionalRawTransfomrationString: ''
    },
  }
  navigator.serviceWorker.register(`./cloudinaryServiceWorker.js?config=${JSON.stringify(config)}`);

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
<span>Bytes saved:${ Math.round((analyticsData.totalOriginalSize - analyticsData.totalOptimizedSize) / analyticsData.totalOriginalSize * 100)}%</span>`
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