// The client window where we report back information
let client = null;

const config = JSON.parse(new URL(location).searchParams.get('config'));

const {optimization, enabled, delivery, inspection} = config;

const {cname, cloudName} = delivery;
const {quality, format, dpr, additionalRawTransfomrationString} = optimization;
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

  if (dpr) {
    keys.push(`dpr_${dpr}`);
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

      // try to verify the resource type before fetching through cloudinary
      // images don't have to end with a .png or .jpg
      console.log('Making head request');
      const headResponse = await fetch(e.request.url, {
        method: 'HEAD'
      });

      // If we aren't sure what resource type it is, just
      if (headResponse.type === 'opaque') {
        console.log('Found opaque response');
        analytics.resourcesSkipped++;
        return fetch(e.request);
      }
      // if the resource is an image, try to fetch through cloudinary
      if (headResponse.headers.get('Content-type').indexOf('image') >= 0) {
        console.log('Content type is image');
        const cloudinaryURL = wrapWithFetch(e.request.url);


        analytics.resourcesLoaded++;
        if (enableInspection) {
          await collectSizeAnalytics(e.request.url);
          reportAnalytics();
        }

        console.log('Loading cloudinary!');
        return fetch(cloudinaryURL);
      } else {
        // else, just bring the original asset
        analytics.resourcesSkipped++;
        return fetch(e.request);
      }
    })());
  }
);
