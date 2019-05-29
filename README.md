# DIFFER

> Smart file comparison tool

This is an electron based application to compare files in two directories. Additianal to the nomal file comparison, this tool also provide support to compare two xml,property or json file changes whithout considering structural positions.

Online version available at [Differ](https://differ.netlify.com)

## Structural Comparison Supported File types
1. XML
2. JSON
3. Properties

![Screen Shot](/doc/Screenshot.png)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack
```
---


## Download
Download the latest binary distribution from [Dropbox](https://clc.to/differ) for your relavant platform.
- [Linux](https://www.dropbox.com/s/kvwtlfo1sgbvb2o/differ-linux.zip?dl=1)
- [Mac](https://www.dropbox.com/s/j42llwmpa8d9zir/differ-mac.zip?dl=1)
- [Windows](https://www.dropbox.com/s/uvp1gh8k6ekg2ef/differ-win.zip?dl=1)

## Incase of Failure
- Please makesure to set the execution permission for linux if it is not already set.
```
chmod +x differ
```
- If you do not already install electron in your machine, then you need to have all lib files which included in the zipped folder to run this application.
- If you have face any problem of using this application, please raise your issue as a Github issue.
