// The client window where we report back information
let client = null;

const config = JSON.parse(new URL(location).searchParams.get('config'));

console.log(config);

const {optimization, enabled, delivery, inspection, clientMetrics} = config;

const {cname, cloudName} = delivery;
const {quality, format, additionalRawTransfomrationString, maxWidth, limitMaxWidth} = optimization;
const {enableInspection} = inspection;

const analytics = {
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  resourcesLoaded: 0,
  resourcesSkipped: 0
}

function wrapWithFetch(originalURL, noOptimization = false) {
  if (noOptimization) {
    return `https://${cname}/${cloudName}/image/fetch/${encodeURIComponent(originalURL)}`;
  }

  const keys = [];
  if (quality) {
    keys.push(`q_${quality}`);
  }
  if (format) {
    keys.push(`f_${format}`);
  }

  if (clientMetrics.dpr) {
    keys.push(`dpr_${clientMetrics.dpr}`);
  }

  if (limitMaxWidth) {
    keys.push(`c_limit,w_${clientMetrics.viewportWidth}`);
  }

  if (additionalRawTransfomrationString) {
    keys.push(additionalRawTransfomrationString);
  }

  return `https://${cname}/${cloudName}/image/fetch/${keys.join('/')}/${encodeURIComponent(originalURL)}`;
}

function shouldIntercept(e) {
  return enabled;
}

/**
 * Collect Analytics Size
 * @param url
 * @return {Promise<void>}
 */
async function collectSizeAnalytics(url) {
  // Fetch the regular image through cloudinary, no optimization
  const cloudianryURL = wrapWithFetch(url, true)

  const optimizedResponse = await fetch(wrapWithFetch(url));
  const nonOptimizedResponse = await fetch(wrapWithFetch(url, true));


  const length1 = optimizedResponse.headers.get('Content-Length');
  const length2 = nonOptimizedResponse.headers.get('Content-Length');

  console.log(length1, length2);
  analytics.totalOptimizedSize += +optimizedResponse.headers.get('Content-Length');
  analytics.totalOriginalSize += +nonOptimizedResponse.headers.get('Content-Length');
}

function reportAnalytics() {
  client && client.postMessage(JSON.stringify(analytics));
}


self.addEventListener('message', (e) => {
  const data = e.data;

  client = e.source;
  if (data === 'start-analytics') {
    reportAnalytics();
  }
});

/**
 * Main fetch interception logic
 */
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      // If we shouldn't intercept, just return the original request
      if (!shouldIntercept(e)) {
        console.log('Should not intercept', e.request.url);
        analytics.resourcesSkipped++;
        return fetch(e.request);
      }


      if (e.request.destination !== 'image') {
        console.log(e.request.url);
        // console.log('not an image request');
        return fetch(e.request);
      }



      // Fetch through cloudianry

      // Extend the headers
      const modifiedHeaders = new Headers( e.request.headers );

      if ( navigator.connection ) {
        if ( navigator.connection.downlink ) {
          modifiedHeaders.set( 'Downlink', navigator.connection.downlink );
        }
        if ( navigator.connection.rtt) {
          modifiedHeaders.set( 'RTT', navigator.connection.rtt );
        }
        if ( navigator.connection.effectiveType) {
          modifiedHeaders.set( 'ECT', navigator.connection.effectiveType );
        }
      }

      if ( clientMetrics.dpr ) {
        modifiedHeaders.set( 'DPR', clientMetrics.dpr );
      }

      // Make a new request from the headers
      const modifiedRequest = new Request( wrapWithFetch( e.request.url ), {
        headers: modifiedHeaders
      } );


      analytics.resourcesLoaded++;
      if (enableInspection) {
        await collectSizeAnalytics(e.request.url);
        reportAnalytics();
      }

      console.log('Loading cloudinary!', e.request.url);
      console.log(analytics.resourcesLoaded);
      return fetch(modifiedRequest);
    })());
  }
);
