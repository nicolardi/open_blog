# Day 8 - bitcoin BigNum

Let's have a deeper look at the function [EncodeBase58](https://github.dev/bitcoin/bitcoin/tree/4405b78d6059e536c36974088a8ed4d9f0f29898) from the first commit of the Bitcoin source code

```c
inline string EncodeBase58(const unsigned char* pbegin, const unsigned char* pend)
{
    CAutoBN_CTX pctx;
    CBigNum bn58 = 58;
    CBigNum bn0 = 0;

    // Convert big endian data to little endian
    // Extra zero at the end make sure bignum will interpret as a positive number
    vector<unsigned char> vchTmp(pend-pbegin+1, 0);
    reverse_copy(pbegin, pend, vchTmp.begin());

    // Convert little endian data to bignum
    CBigNum bn;
    bn.setvch(vchTmp);

    // Convert bignum to string
    string str;
    str.reserve((pend - pbegin) * 138 / 100 + 1);
    CBigNum dv;
    CBigNum rem;
    while (bn > bn0)
    {
        if (!BN_div(&dv, &rem, &bn, &bn58, pctx))
            throw bignum_error("EncodeBase58 : BN_div failed");
        bn = dv;
        unsigned int c = rem.getulong();
        str += pszBase58[c];
    }

    // Leading zeroes encoded as base58 zeros
    for (const unsigned char* p = pbegin; p < pend && *p == 0; p++)
        str += pszBase58[0];

    // Convert little endian string to big endian
    reverse(str.begin(), str.end());
    return str;
}
```

Line 4 is pretty interesting... what does it mean?

```c
CBigNum bn58 = 58;
```

Well CBigNum is a bitcoin's class indeed. 

What does it mean the above assignment? 

The CBigNum definition is contained in the [bignum.h](https://github.com/bitcoin/bitcoin/blob/4405b78d6059e536c36974088a8ed4d9f0f29898/bignum.h) file

It starts like this:

```c
#include <openssl/bn.h>

class CBigNum : public BIGNUM
{
public:
    CBigNum()
    {
        BN_init(this);
    }
 ....
```

You can see that CBigNum actually extends BIGNUM. This class is from the openssl library.
In the readme file is stated:

```c
This product includes software developed by the OpenSSL Project for use in
the OpenSSL Toolkit (http://www.openssl.org/).
```

In other words instead of rewriting the whole library Satoshi Nakamoto chose to extend a stable and widely used library.
The CBigNum simply adds functionalities to it like for example a bunch of different constructors and operator overloading.

:::tip
Operators Overloading

Some programming languages allow to overload operators like = * + / and so on. C++ is one of them (while java is not for example)
:::

The constructors are the following:

```c
    CBigNum(char n)             { BN_init(this); if (n >= 0) setulong(n); else setint64(n); }
    CBigNum(short n)            { BN_init(this); if (n >= 0) setulong(n); else setint64(n); }
    CBigNum(int n)              { BN_init(this); if (n >= 0) setulong(n); else setint64(n); }
    CBigNum(long n)             { BN_init(this); if (n >= 0) setulong(n); else setint64(n); }
    CBigNum(int64 n)            { BN_init(this); setint64(n); }
    CBigNum(unsigned char n)    { BN_init(this); setulong(n); }
    CBigNum(unsigned short n)   { BN_init(this); setulong(n); }
    CBigNum(unsigned int n)     { BN_init(this); setulong(n); }
    CBigNum(unsigned long n)    { BN_init(this); setulong(n); }
    CBigNum(uint64 n)           { BN_init(this); setuint64(n); }
    explicit CBigNum(uint256 n) { BN_init(this); setuint256(n); }

    explicit CBigNum(const std::vector<unsigned char>& vch)
    {
        BN_init(this);
        setvch(vch);
    }
```

What happens if we call 

```c
CBigNum bn58 = 58;
```

The c++ compiler tries to convert the integer 58 to a CBigNum using the constructor matching the data type (in this case int).

So what happens is that this line

* allocates memory to hold the CBigNum instance
* select the correct constructor 
* calls CBigNum(int n) to initialize the current instance 

:::tip
the **explicit** keyword on line 11 simply tells the compiler to use that constructor only if the parameter is explicitly a uint256

This to avoid unwanted type conversions
:::



Cheers,

Massimo Nicolardi


