# Day 4 - pointless fix for analytics -  vuepress

::: warning 
This was a stupid error in the configuration file. Read this post just to learn something about node_modules structure and how to debug something
:::

I have a problem with my blog. Google analytics is not working. I have configured it according to the [documentation](https://vuepress.vuejs.org/plugin/official/plugin-google-analytics.html#install) but it doesn't work. Now what?

Let's read the code!

Here's my actual current configuration (.vuepress/config.js):

```js 
plugins: [
        '@vuepress/google-analytics'
      ],
      {
        'ga': 'UA-219142670-1' 
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


::: tip 
Sometimes plugins are pretty small in size since they just "wrap" other libraries that contains the business logic. In this case the "google analytics" code is contained in the enhanceAppFile.js. Have a look at it you you want to see how it's wrapped
:::


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


Let's stop and the restart the server and run yarn build instead.
The logged message is:

``` js 
DEBUG GA ID false
```

So the problem here is that the google analytics id doesn't reach the define function.

How does it work the plugin system in vuepress?

Let's read the code... what


Let's open the sources in [visual studio code online](https://github.dev/vuejs/vuepres) directly from github

::: tip
Any project on github.com can be seen with vscode just pressing the dot "." from the repo homepage. 
:::

On the sources file structure I can see that there's a packages/@vuepress/core directory

Navigating a little bit I have found packages/@vuepress/core/lib/node/plugin-api/index.js that seems quite promising

I decided to open my local vscode and put some console.log just to see what's happening after running yarn build:


``` js 
  constructor (context) {
    console.log("ASDRABAN context",context);
    this.options = {}
    this._pluginContext = context
    this._pluginQueue = []
    this._loggedPlugins = []
    this._initialized = false
    this._pluginResolver = getPluginResolver()
    this.initializeOptions(PLUGIN_OPTION_MAP)
  }
```

yarn build shows that the constructor is called and that in the context I have anything I need. More specifically I have the contents of the config.js plugins section.

I found the data... but where does it get "lost"?

Let's dive into the code again...

In the same file there's an initialize function which does a forEach on the _pluginQueue.
I decided to give it a try and to add a console.log

```js 
nitialize () {
    console.log( "ASDRABAN initialize",this._pluginQueue);
    this._initialized = true
    this._pluginQueue.forEach(plugin => {
      if (plugin.enabled) {
        this.applyPlugin(plugin)
      } else {
        logger.debug(`${chalk.gray(`[${plugin.name}]`)} disabled.`)
      }
    })
  }

```

Running yarn build I can see lots of interesting things. 
In particular there are a couple of entries quite interesting

```js 
  {
    define: [Function: define],
    enhanceAppFiles: '/Users/massimonicolardi/projects/massimo/open_blog/node_modules/@vuepress/plugin-google-analytics/enhanceAppFile.js',
    name: '@vuepress/plugin-google-analytics',
    shortcut: '@vuepress/google-analytics',
    enabled: true,
    '$$options': {},
    '$$normalized': true
  },
  {
    ga: 'UA-219142670-1',
    name: 'vuepress-plugin-anonymous-dd51c158',
    shortcut: null,
    enabled: true,
    '$$options': {},
    '$$normalized': true
  },
```

The first one refers to the plugin and the second  contains the google analytics API code, namely "ga" 

How does all this get "applied"? do the data reach the plugin?

The answer could be inside the forEach cycle. 

the code runs on each loop cycle

```js 
this.applyPlugin(plugin)
```

I'am asking myself if the fact that "data" is contained in another entry may originate the problem

The answer is in the code of course

The applyPlugin function is like this

```js 
applyPlugin ({
    // info
    name: pluginName,
    shortcut,

    // hooks
    ready,
    compiled,
    updated,
    generated,

    // options
    chainWebpack,
    extendMarkdown,
    chainMarkdown,
    enhanceAppFiles,
    outFiles,
    extendPageData,
    clientDynamicModules,
    clientRootMixin,
    additionalPages,
    globalUIComponents,
    define,
    alias,
    extendCli,
    beforeDevServer,
    afterDevServer
  }) {
    if (!this._loggedPlugins.includes(pluginName)) {
      const isInternalPlugin = pluginName.startsWith('@vuepress/internal-')
      logger[isInternalPlugin ? 'debug' : 'tip'](pluginLog(pluginName, shortcut))
      this._loggedPlugins.push(pluginName)
    }

    this
      .registerOption(PLUGIN_OPTION_MAP.READY.key, ready, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.COMPILED.key, compiled, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.UPDATED.key, updated, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.GENERATED.key, generated, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.CHAIN_WEBPACK.key, chainWebpack, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.EXTEND_MARKDOWN.key, extendMarkdown, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.CHAIN_MARKDOWN.key, chainMarkdown, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.EXTEND_PAGE_DATA.key, extendPageData, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.ENHANCE_APP_FILES.key, enhanceAppFiles, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.OUT_FILES.key, outFiles, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.CLIENT_DYNAMIC_MODULES.key, clientDynamicModules, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.CLIENT_ROOT_MIXIN.key, clientRootMixin, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.ADDITIONAL_PAGES.key, additionalPages, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.GLOBAL_UI_COMPONENTS.key, globalUIComponents, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.DEFINE.key, define, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.ALIAS.key, alias, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.EXTEND_CLI.key, extendCli, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.BEFORE_DEV_SERVER.key, beforeDevServer, pluginName)
      .registerOption(PLUGIN_OPTION_MAP.AFTER_DEV_SERVER.key, afterDevServer, pluginName)
  }
```

What I can see is that this function accept just one parameter and extracts a lots of variables out of it

I want to concentrate on the "data".

The only two things that link the data to the plugin is the name 

```js
name: 'vuepress-plugin-anonymous-dd51c158' 
```

and the fact that this entry immediately follows the plugin name in the config file

How the name is processed?

I can see 

```js 
name: pluginName
```

What does it mean? 

::: tip
That the name key is replaced with the alias name pluginName
:::

You see all these registerOption?

I have added a console.log that function 

```js 
  registerOption (key, value, pluginName) {
    console.log( "ASDRABAN registerOption",key,value,pluginName);
    const option = PLUGIN_OPTION_MAP[key]
    const types = option.types
    const { valid, warnMsg } = assertTypes(value, types)
    if (valid) {
      this.options[option.name].add(pluginName, value)
    } else if (value !== undefined) {
      logger.warn(
        `${chalk.gray(pluginName)} `
        + `Invalid value for "option" ${chalk.cyan(option.name)}: ${warnMsg}`
      )
    }
    return this
  }
```

What I can see in yarn build is:
```js 
tip Apply plugin @vuepress/google-analytics (i.e. "@vuepress/plugin-google-analytics") ...
ASDRABAN registerOption READY undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption COMPILED undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption UPDATED undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption GENERATED undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption CHAIN_WEBPACK undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption EXTEND_MARKDOWN undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption CHAIN_MARKDOWN undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption EXTEND_PAGE_DATA undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption ENHANCE_APP_FILES /Users/massimonicolardi/projects/massimo/open_blog/node_modules/@vuepress/plugin-google-analytics/enhanceAppFile.js @vuepress/plugin-google-analytics
ASDRABAN registerOption OUT_FILES undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption CLIENT_DYNAMIC_MODULES undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption CLIENT_ROOT_MIXIN undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption ADDITIONAL_PAGES undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption GLOBAL_UI_COMPONENTS undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption DEFINE [Function: define] @vuepress/plugin-google-analytics
ASDRABAN registerOption ALIAS undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption EXTEND_CLI undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption BEFORE_DEV_SERVER undefined @vuepress/plugin-google-analytics
ASDRABAN registerOption AFTER_DEV_SERVER undefined @vuepress/plugin-google-analytics
tip Apply plugin vuepress-plugin-anonymous-dd51c158 ...
ASDRABAN registerOption READY undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption COMPILED undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption UPDATED undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption GENERATED undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption CHAIN_WEBPACK undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption EXTEND_MARKDOWN undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption CHAIN_MARKDOWN undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption EXTEND_PAGE_DATA undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption ENHANCE_APP_FILES undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption OUT_FILES undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption CLIENT_DYNAMIC_MODULES undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption CLIENT_ROOT_MIXIN undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption ADDITIONAL_PAGES undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption GLOBAL_UI_COMPONENTS undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption DEFINE undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption ALIAS undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption EXTEND_CLI undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption BEFORE_DEV_SERVER undefined vuepress-plugin-anonymous-dd51c158
ASDRABAN registerOption AFTER_DEV_SERVER undefined vuepress-plugin-anonymous-dd51c158
```

As you can see there's nothing related to "ga" 

So what?  
I think that the config must be passed through a context object but we've seen that the plugin receive an empty context

::: warning 
And then.. something came to my mind... 
:::

If I want to relate the options to the plugin it should be something that is on the "same line" of the config file.. not on the next line.

Reading better the documentation I can finally get the error I made!

The right config should have been:

```js 
['@vuepress/google-analytics',
      {
        'ga': 'UA-219142670-1' 
      }
    ],
```

I'm feeling pretty silly but this "pointless journey" let me dive into the vuepress code plugin system. 

What have I gained from this? 

If I want to write a vuepress plugin I know how to do that.

This is the real value in this amd I am feeling pretty good

Thanks for having read all this stuff!

Cheers!

Massimo Nicolardi











