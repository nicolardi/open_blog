# Day1 - require package.json

There are a lot of examples of sources which include the .json package file

On example is in the generated source code of the vuepress project which is the software I create this blog.

Let's dive into the code then!

``` js
const { description } = require('../../package')
```

This code parses the package.json structure, picks the description field and creates a constant variable named "description"

What I find interesting about that is that you can create custom configurations directly inside the package.json instead of creating new configuration files.

## What is the require keyword?
This question may sound silly but do you really know what is it?

The [require](/https://nodejs.org/docs/latest/api/modules.html/) keyword is part of the CommonJS modularization system.
nodejs "native" relies on CommonJS as the standard way to modularize the source code. 

The most common use case of require is including a js module.
In this case we are requiring a .json file and... it works

You may notice that there is no file extension (there's no .json). 
It guesses automatically the filename to open.

## What is { description }?

It is called [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). It is basically a syntactic sugar to pick up a field out of an object and assign it to a variable.


In my case the package.json is 

```js
{
  "name": "open_blog",
  "version": "0.0.1",
  "description": "This is an open source blog. I write about different open source projects and how to use them. I also write about other technology topics. I hope you find this blog helpful and informative.",
  "main": "index.js",
  "authors": {
    "name": "Massimo Nicolardi",
    "email": "nicolardi.massimo@gmail.com"
  },
  "repository": "https://github.com/nicolardi/open_blog/asdraban blog",
  "scripts": {
    "dev": "vuepress dev src",
    "build": "vuepress build src"
  },
  "license": "MIT",
  "devDependencies": {
    "vuepress": "^1.5.3"
  }
}
```
So the code creates a variable "description" and assigns the string "This is an open source blog. I write about different open source projects and how to use them. I also write about other technology topics. I hope you find this blog helpful and informative." picked directly from the package.json file

## Include & use composer.json with PHP

The same approach is been used with PHP. 
You can simply decode the [composer.json](https://getcomposer.org/doc/04-schema.md) used by [composer](https://getcomposer.org/) to pick up any property you want.
To do this you can do:

``` php
<?php
$composer = json_decode(file_get_contents(__DIR__."/../composer.json"), true);
$description = $composer['description'];

```
Cheers!

Massimo