# Day 6 - json viewer chrome extension - Part 1


Today I will have a look at the sources of the [json viewer](https://github.com/tulios/json-viewer) which is present on the [chrome extensions website](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh) ![JSONViewer Logo](https://raw.githubusercontent.com/tulios/json-viewer/master/logo.png)


What the extension does is to identify and format any json present on a web page and "beautify" them. You can see it in action: 

![screenshot](https://raw.githubusercontent.com/tulios/json-viewer/master/screenshot.png)

The first things I have learned from this project are from the README.md file

```
![screenshot](https://raw.githubusercontent.com/tulios/json-viewer/master/screenshot.png)
```

I noticed the url: https://raw.githubusercontent.com

This suggests that the files on a github repo are public accessible on the https://raw.githubusercontent.com domain. This is why it is possible to display the image using the above link

::: tip
Writing the question mark at the start it will display the image. If you omit the question mark it will print "screenshot" linked to the url written inside the rounded brackets
:::

```
Features:

* Syntax highlighting
* 27 built-in themes
* Collapsible nodes
```

::: tip 
With the markdown format you can use * to create an unordered list item
:::

Let's look at the [sources homepage](https://github.dev/tulios/json-viewer) 

I can see that there is a webpack configuration file and a package.json. Let's have a look at the package.json first

```json
{
  "name": "json_viewer",
  "description": "The most beautiful and customizable JSON/JSONP highlighter that your eyes have ever seen. Open source at https://github.com/tulios/json-viewer",
  "author": "Tulio Ornelas <ornelas.tulio@gmail.com>",
  "license": "MIT",
  "repository": "https://github.com/tulios/json-viewer",
  "private": true,
  "dependencies": {
    "archiver": "1.2.x",
    "clean-webpack-plugin": "0.1.x",
    "codemirror": "5.21.x",
    "css-loader": "0.14.x",
    "extract-text-webpack-plugin": "0.8.x",
    "fs-extra": "0.18.x",
    "mousetrap": "1.5.x",
    "node-libs-browser": "^1.0.0",
    "node-sass": "^4.5.3",
    "promise": "7.0.x",
    "sass-loader": "6.0.x",
    "style-loader": "0.18.x",
    "sweetalert": "1.0.x",
    "webpack": "1.15.x"
  },
  "scripts": {
    "release": "NODE_ENV=production npm run build",
    "build": "./node_modules/.bin/webpack --progress --colors && node ./lib/release-script"
  }
}
```

The package is declared as "private" ("private": true) [see](https://stackoverflow.com/questions/67758397/what-is-meant-by-private-true-or-private-false-in-package-json) 
It means that it will not be available via [npmjs.com](https://npmjs.com) 

In the dependecies we have:

* [archiver](https://www.npmjs.com/package/archiver): creates archives like zip files
* [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin): this webpack plugin will remove all files inside webpack's output.path
* [codemirror](https://www.npmjs.com/package/codemirror): it a javascript implementation of a text editor with text highlight
* [css-loader](https://github.com/webpack-contrib/css-loader): webpack loader for  css files
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin): Extract text from a bundle, or bundles, into a separate file. This is used by webpack to separate css files in different files (not inlined)
* [fs-extra](https://github.com/jprichardson/node-fs-extra): Node.js: extra methods for the fs object like copy(), remove(), mkdirs()
* [mousetrap](https://github.com/ccampbell/mousetrap): Simple library for handling keyboard shortcuts in Javascript
* [node-libs-browser](https://github.com/webpack/node-libs-browser): The node core libs for in browser usage.
* [node-sass](https://github.com/sass/node-sass): support for *.sass stylesheets
* [promise](https://github.com/then/promise): acts as a polyfill
* [sass-loader](https://github.com/webpack-contrib/sass-loader): webpack loader for sass files. Compiles Sass to CSS
* [style-loader](https://github.com/webpack-contrib/style-loader): webpack loader for stylesheets files. 
* [sweetalert](https://github.com/sweetalert/sweetalert-with-react): styled alerts library
* [webpack](https://github.com/webpack/webpack): on of the most common used javascript bundler

Most of these deps are used to create a package using webpack. 
I think that codemirror is used to beautify the JSON output

What's interesting here is archiver that is a node package to create archives (zip) for example, clean-webpack-plugin that (as I can understand from the description) makes webpack create multiple file instead of just one.

The "scripts" key in package.json gives us the way to build and release. 
release sets th NODE_ENV variable to production and calls run build. What's strange here is that there is no separation (for example &&) between "NODE_ENV=production" and "npm run build". 
But it seems a [correct approach](https://riptutorial.com/node-js/example/10101/setting-node-env--production-)

The build process is:

```
./node_modules/.bin/webpack --progress --colors && node ./lib/release-script
```

it runs webpack and afterwards node ./lib/release-script

This "pill" went too long!
See you in Part 2

Cheers!

Massimo Nicolardi

