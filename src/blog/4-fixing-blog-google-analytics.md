# Day 4 - fixing blog google analytics

I have a problem with my blog. Google analytics is not working. I have configured it according to the [documentation](https://vuepress.vuejs.org/plugin/official/plugin-google-analytics.html#install) but it doesn't work. Now what?

Let's read the code!

Here's my actual current configuration (.vuepress/config.js):

```js 
plugins: [
    '@vuepress/google-analytics',
      {
        'ga': 'G-8J0R1L6FZ7' 
      },
```

The plugin source code is [here](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/plugin-google-analytics)

These are the files in the repo

```
.npmignore
README.md
enhanceAppFile.js
index.js
package.js
```

I can verify in my node_modules directory that the plugin has been installed 

The path is: @vuepress/plugin-google-analytics

::: tip
When you install a package using yarn or npm it will install it following the path of the npm package even if the directories are nested. You can see here that the @vuepress directory contains the project code together with the plugins code even if they are published in different packages 
:::

Here's the package.json 

```js 
{
  "name": "@vuepress/plugin-google-analytics",
  "version": "1.9.7",
  "description": "google-analytics plugin for vuepress",
  "keywords": [
    "documentation",
    "generator",
    "vue",
    "vuepress"
  ],
  "homepage": "https://github.com/vuejs/vuepress/blob/master/packages/@vuepress/plugin-google-analytics#readme",
  "bugs": {
    "url": "https://github.com/vuejs/vuepress/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/vuepress.git",
    "directory": "packages/@vuepress/plugin-google-analytics"
  },
  "license": "MIT",
  "author": "ULIVZ <chl814@foxmail.com>",
  "main": "index.js",
  "dependencies": {
    "@vuepress/types": "1.9.7"
  },
  "publishConfig": {
    "access": "public"
  },
  "gitHead": "2f2357acce09eab875325c05f26d6bd26d41a861"
}

```

you can see that the "main" file is index.js 

Let's open it

```js
 const { path } = require('@vuepress/shared-utils')

/**
 * @type {import('@vuepress/types').Plugin}
 */
module.exports = (options = {}, context) => ({
  define () {
    const { siteConfig = {}} = context
    const ga = options.ga || siteConfig.ga
    const GA_ID = ga || false
    return { GA_ID }
  },

  enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
})
```

You can see that this module exports a "class" with two items: define and enhanceAppFiles

define reads the configuration from the parameter "options". 

More specifically:

@line 8: reads the siteConfig (defaulting to {}) from the context (destructuring).

@line 9: reads ga (the google analytics id) from g options.ga OR siteConfig.ga depending on 
which one is not null

@line 10: defines a constant GA_ID which is ga (the config's one) or false if ga is null

@line11: it resturns the google analytics id

So this code just returns google analytics ID read from the configuration.

First question: is this code ever invoked? What ID does it return?

Let's do something really weird now!

Let's change the source code node_modules/@vuepress/plugin-google-analytics 

I am just adding a console.log and see what's the ID like

``` js 
define () {
    const { siteConfig = {}} = context
    const ga = options.ga || siteConfig.ga
    const GA_ID = ga || false
    console.log("DEBUG GA ID", GA_ID);
    return { GA_ID }
  },
```
Let's stop and the restart the server. What I see is:

```js 
DEBUG GA ID false
```



