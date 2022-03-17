# Day 9 - javascript self-invoking functions

A self-executing anonymous function is just a function that is invoked right after it is defined.

An example is:

```js
(function (parameters) {
    // Function body
})(parameters);
```

The advantage of using an anonymous function instead of writing a named function is that there is no way to invoke this function elsewhere.

::: tip
A function in javascript creates a local scope for variables and functions defined in the function. 

An anonymous function creates a scope that cannot be accessed from outside the function. 
:::

Let's read some code from the [inexorabletash/polyfill repo](https://github.com/inexorabletash/polyfill/blob/master/html.js)

Here I am skipping all the unnecessary code

```js
(function(global) {
  'use strict';

  if (!('window' in global && 'document' in global))
    return;
    ...
}(self));
```

@line 1 the function is defined. Please note the presence of the surrounding round brackets.
The function is anonymous and it has a single parameter named global. 

@line 7 the function is invoked immediately. Note that the "self" keyword is used to refer to the global object.

@line 4 there is an interesting use of the "in" keyword. It is used to check if a variable is defined in an object.

A more in-depth discussion about javascript SIF can be found [here](https://www.geeksforgeeks.org/what-is-the-purpose-of-self-executing-function-in-javascript/)

Cheers,

Massimo Nicolardi

