



At line 7 you can see a comment stating "Convert big endian data to little endian" 

At line 34 you can see the opposite "Convert little endian string to big endian"

What is it talking about?

In computer science "endianness" is the order in a sequence of bytes of a word. 
A "word" is a sequence of two bytes 

```
[ byte1 | byte2 ]
```

::: tip
* Big endian systems stores the most significant byte at the lowest memory address. In the example byte1 is the most significant byte and byte2 is the less significant byte
* Little endian in contrast stores the two bytes in reverse order  
:::
