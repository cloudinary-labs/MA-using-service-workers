## Using service workers with Cloudinary!

### What's inside?
The main directory consists of an `index.js` script and the `templates` directory containing service worker file and its configuration.

This is published to NPM as `@cloudinary/create-cloudinary-service-worker-lab` allowing it to be run with the `npx` or `yarn create` commands.

Example:
```bash
yarn create @cloudinary/cloudinary-service-worker-lab
npx @cloudinary/create-cloudinary-service-worker-lab
```

Those commands will copy the service worker files to the desired location (working directory by default, can be overriden with `-p` | `--path` parameter).

Example:
```bash
yarn create @cloudinary/cloudinary-service-worker-lab --path my-app/src
npx @cloudinary/create-cloudinary-service-worker-lab --path my-app/src
```

The script accepts also a `--verbose` flag to provide additional runtime information. See `--help` for more options.

### Demo project
Besides the main package this repository contains also the demo application showing the example use case. It includes a small website with images that does not use Cloudinary. You can run it locally, use the `@cloudinary/create-cloudinary-service-worker-lab` script and enable it to see the difference.

In order to check it yourself please clone this repository and run the following.

```bash
cd demo
yarn
yarn start

# if you prefer to use npm please run the following
cd demo
npm install
npm start
```

You should have a working page without service workers running locally. In order to enhance it with the power of the Cloudinary service worker run the following:

```bash
yarn create @cloudinary/cloudinary-service-worker-lab

# if you prefer to use npm please run the following
npx @cloudinary/create-cloudinary-service-worker-lab
```

The service worker is now copied to your (demo) project directory. Please edit `index.html` and add the service worker setup script `cloudinaryServiceWorkerSetup.js`.

```html
<script src="./cloudinaryServiceWorkerSetup.js"></script>
```

You're done! Once you refresh the page the service worker should be registered. Once you refresh the page for the second time all assets will be served through cloudinary. You can edit the config JSON inside the `cloudinaryServiceWorkerSetup.js` file to customize the behaviour.
