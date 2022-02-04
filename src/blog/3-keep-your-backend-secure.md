# Day 3 - keep your backend secure 

You are building a PHP website that depends on a lot of external libraries. How to know if there are security issues and how to keep your project safer?

Reading source code you can find a solution.

Look at the composer.json of phpmailer/phpmailerof [phpmailer/phpmailer](https://github.com/PHPMailer/PHPMailer/blob/master/composer.json)
``` json
...
    "require-dev": {
        "dealerdirect/phpcodesniffer-composer-installer": "^0.7.0",
        "doctrine/annotations": "^1.2",
        "php-parallel-lint/php-console-highlighter": "^0.5.0",
        "php-parallel-lint/php-parallel-lint": "^1.3.1",
        "phpcompatibility/php-compatibility": "^9.3.5",
        "roave/security-advisories": "dev-latest",
        "squizlabs/php_codesniffer": "^3.6.2",
        "yoast/phpunit-polyfills": "^1.0.0"
    },
...

```

Look at this dependency 

```json 
    "roave/security-advisories": "dev-latest",
```

Doesn't it sound cool?

Let's have a look at the [github repo](https://github.com/Roave/SecurityAdvisories) 

How strange is this repo?  there are no sources inside.

If you have a look at [composer.json](https://github.com/Roave/SecurityAdvisories/blob/latest/composer.json)

```json
 "conflict": {
        "3f/pygmentize": "<1.2",
        "adodb/adodb-php": "<=5.20.20|>=5.21,<=5.21.3",
        "akaunting/akaunting": "<2.1.13",
        "alterphp/easyadmin-extension-bundle": ">=1.2,<1.2.11|>=1.3,<1.3.1",
        "amazing/media2click": ">=1,<1.3.3",
        "amphp/artax": "<1.0.6|>=2,<2.0.6",
        "amphp/http": "<1.0.1",
        "amphp/http-client": ">=4,<4.4",
        "anchorcms/anchor-cms": "<=0.12.7",
        "api-platform/core": ">=2.2,<2.2.10|>=2.3,<2.3.6",
        "area17/twill": "<1.2.5|>=2,<2.5.3",
        "asymmetricrypt/asymmetricrypt": ">=0,<9.9.99",
```

you find the key.

this composer.json conflicts with packages with security advisories.
This file is kept up to date (the last commit is just 1 hour ago at the moment).

So... 

::: tip
if you want to keep your project up to date with packages security advisories you just include this package (dev-latest branch) ad a dependency of your project and you're done!
:::

Pretty simple

Cheers,
Massimo Nicolardi