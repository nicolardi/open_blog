# Day 2 - memoize - nodejs

Today let's see something new to learn reading webpack's source code. 

Have a look at this file: [lib/index.js](https://github.dev/webpack/webpack/blob/main/lib/index.js) and more specifically this line:

```js 
const memoize = require("./util/memoize");
```

The "require" statement suggests that it is a module and the path states that it is part of webpack's codebase.
What attracted my attention was the name which "sounded" to me like a typo of "memorize" (see below about this).

## Read the code!
So what is this function? As usual, our best documentation is the code itself so... let's open we can read the code [lib/util/memoize.js](https://github.dev/webpack/webpack/blob/main/lib/index.js)!

```js
const memoize = fn => {
    let cache = false;
    /** @type {T} */
    let result = undefined;
    return () => {
        if (cache) {
            return result;
        } else {
            result = fn();
            cache = true;
            // Allow to clean up memory for fn
            // and all dependent resources
            fn = undefined;
            return result;
        }
    };
};

module.exports = memoize;

```

So what is memoize? 

it is a function (see @line1?) defined by the so called [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) expression.
This function accepts a parameter named "fn" and returns...  oh... that's strange... it returns a function!

Things are getting a little bit cumbersome here but it's perfectly legal...  there is a function that accepts a function and returns a function.
All this means is that we are "wrapping" the function you pass with another function that performs some additional steps.

@line2 you can see a variable named "cache" which is initialized with false.
What does it mean? why are they defining a cache variable?

On @line4 you can see a variable named "result" set undefined.

On @line6 there is a test. If the cache variable is true it returns a result variable

On @line9 things are getting clearer. If the cache variable is false (there's no value yet) result = fn(); sets the result value to the output of fn().

::: tip
Please remember that fn is the function that was passed to memoize as an argument. This function will stay accessible to the whole function code.  
:::

Things are getting clearer now! The code teaches us what is memoize!

On @line10 cache is set to true; The next time this function will be called it will be executed the code @line7

On @line13 fn is destroyed. The comment says that this is to clean up memory (another thing that we have learned here).

On @line14 the result is returned!

We are done... 

## So what is memoize?
It's a way of caching the return value of a function. 
Suppose that you have a function that is repeated multiple times. You may want to cache its result and gain in performances!

Memoize technique can be more flexible than this.

If you want you can search the web about it. Here are just a few references

[wikipedia memoization](https://en.wikipedia.org/wiki/Memoization)

[understanding-memoization-in-javascript](https://www.digitalocean.com/community/tutorials/understanding-memoization-in-javascript)

[what-is-memoization-and-why-does-it-matter](https://www.cloudsavvyit.com/12446/what-is-memoization-and-why-does-it-matter/)

## Let's have fun!

If I were a serious person I would have asked you to think about how you can improve that code.

Since I am not I want to let you know about what has happened to the name memoize ;-)

I have told you that it seemed to me like a typo... and well... I am not alone thinking that way!

Let's see the history of the memoize.js file on GitHub.

Click here [lib/util/memoize.js](https://github.com/webpack/webpack/blame/main/lib/util/memoize.js) 

Click on the "blame" button and have a look at the left-hand side.

There's a commit about the function name...

Clicking on it here's the commit

[https://github.com/webpack/webpack/commit/bc1911bf78904f86488f5366f5b0558a2888cb11](https://github.com/webpack/webpack/commit/bc1911bf78904f86488f5366f5b0558a2888cb11)

NO SPOILER HERE!!

::: details
The name is "Changed name of memorize function to memoize"

@highonweb
highonweb committed on 26 Dec 2020 
::: 
Yeee... BINGO!  You see? Reading code may be a real fun isn't it?

Cheers!

Massimo Nicolardi