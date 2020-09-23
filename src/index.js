#!/usr/bin/env node

console.log('=== Create Cloudinary service worker');

// constants
const TEMPLATES_DIRECTORY = "./templates";
const TARGET_FILENAME = "cloudinaryServiceWorker.js";

// imports
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

// parse arguments
const args = yargs.boolean("debug").alias("p", "path").default("p", "").argv;

if (args.debug) {
  console.log('Module: ', __dirname);
  console.log('Arguments:', args);
}

// determine paths
const sourceDirectory = path.resolve(__dirname, TEMPLATES_DIRECTORY);
const targetDirectory = path.resolve(process.cwd(), args.path);

// copy files
const sourceFilesNames = fs.readdirSync(sourceDirectory);

sourceFilesNames.forEach(sourceFileName => {
  const sourcePath = path.resolve(sourceDirectory, sourceFileName);
  const targetPath = path.resolve(targetDirectory, sourceFileName);

  if (args.debug) {
    console.log(`Copying "${sourcePath}" to "${targetPath}"`);
  }

  fs.copyFileSync(sourcePath, targetPath);
});

console.log(`Successfully setup service worker files. Please include the "cloudinaryServiceWorkerSetup.js" file on your site to enable it.`);