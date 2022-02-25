# Day 7 : Bitcoin's first commit

I am very interested in cryptocurrencies the mother of all being Bitcon.
Bitcoin is a marvellous and misterious piece of code. 
It was written by Satoshi Nakamoto but no one knows the real person behind this pseudonym.

The first commit was uploaded to github on 30 aug 2009 and this moment is one of the most exciting and revolutionary of all times.

So let's look at the sources of the [first commit](https://github.com/bitcoin/bitcoin/tree/4405b78d6059e536c36974088a8ed4d9f0f29898)

The original code is very different from current version. All the sources are contained in the main directory.
::: tip
It is written in C++/C and the first version is v0.1.5 ALPHA distributed under the MIT/X11 software license.
:::

The compilers originally used are:

* MinGW GCC (v3.4.5)
* Microsoft Visual C++ 6.0 SP6

It seems that it was first compiled on windows o.s.

Let's look at the first file in alphabetical order [base58.h](https://github.com/bitcoin/bitcoin/blob/4405b78d6059e536c36974088a8ed4d9f0f29898/base58.h)

```c
//
// Why base-58 instead of standard base-64 encoding?
// - Don't want 0OIl characters that look the same in some fonts and
//      could be used to create visually identical looking account numbers.
// - A string with non-alphanumeric characters is not as easily accepted as an account number.
// - E-mail usually won't line-break if there's no punctuation to break at.
// - Doubleclicking selects the whole number as one word if it's all alphanumeric.
//
```

So this file contains an implementation of a base-58 encoding where the characters "0OIl" have been excluded to avoid confusion for humans reading the bitcoin address and allowing double click selection at the same time.


::: tip
Bitcoin addresses are 200 bits numbers (25 bytes). 
To be more readable Bitcoin addresses are written in base58 instead of the more commonly used base64. In fact base58 was developed for Bitcoin. 
:::

::: warning
Have you ever wrongly interpreted the WPA password written on your router? here's the Satoshi Nakamoto's brilliant solution.
:::

on line 16 we can see the base-58 "alphabet":

```c++
static const char* pszBase58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
```

The library consists in the following functions:

```c
inline string EncodeBase58(const unsigned char* pbegin, const unsigned char* pend)
inline string EncodeBase58(const vector<unsigned char>& vch)
inline bool DecodeBase58(const char* psz, vector<unsigned char>& vchRet)
inline bool DecodeBase58(const string& str, vector<unsigned char>& vchRet)
inline string EncodeBase58Check(const vector<unsigned char>& vchIn)
inline bool DecodeBase58Check(const char* psz, vector<unsigned char>& vchRet)
inline string Hash160ToAddress(uint160 hash160)
inline bool AddressToHash160(const char* psz, uint160& hash160Ret)
inline bool IsValidBitcoinAddress(const char* psz)
inline bool IsValidBitcoinAddress(const string& str)
inline string PubKeyToAddress(const vector<unsigned char>& vchPubKey)
```

as you can see there are functions to 
* encode 
* decode
* convert Address To Hash and vice versa
* check if a bitcoin address is valid 
* convert a public key to and address 

No time to go deeper now but I will dive into the code a little bit more soon.

Stay tuned!

Cheers, 

Massimo Nicolardi





