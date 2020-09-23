#!/usr/bin/env node

// imports
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

console.log("=== Cloudinary service worker");

// constants
const TEMPLATES_DIRECTORY = "./templates";
const TARGET_FILENAME = "cloudinaryServiceWorker.js";

// parse arguments
const args = yargs
  .option("p", {
    alias: "path",
    demandOption: true,
    default: "",
    describe: "target directory path",
    type: "string",
  })
  .option("v", {
    alias: "verbose",
    default: false,
    describe: "enable verbose output",
    type: "boolean",
  }).argv;

if (args.verbose) {
  console.log(
    `${chalk.gray("Module: ")}${chalk.cyan(__dirname)}\n${chalk.gray(
      "Arguments: "
    )}${chalk.cyan(JSON.stringify(args))}`
  );
}

// determine paths
const sourceDirectory = path.resolve(__dirname, TEMPLATES_DIRECTORY);
const targetDirectory = path.resolve(process.cwd(), args.path);

// copy files
const sourceFilesNames = fs.readdirSync(sourceDirectory);

sourceFilesNames.forEach((sourceFileName) => {
  const sourcePath = path.resolve(sourceDirectory, sourceFileName);
  const targetPath = path.resolve(targetDirectory, sourceFileName);

  if (args.verbose) {
    console.log(
      chalk.gray(
        `Copying "${chalk.cyan(sourcePath)}" to "${chalk.cyan(targetPath)}"`
      )
    );
  }

  fs.copyFileSync(sourcePath, targetPath);
});

console.log(
  `Successfully setup service worker files.\n\nPlease include the "cloudinaryServiceWorkerSetup.js" file on your site to enable it, e.g.\n${chalk.cyan(
    '<script src="./cloudinaryServiceWorkerSetup.js"></script>'
  )}\n\nThis file includes configuration options in a JSON format - edit it to customise the behaviour.`
);
