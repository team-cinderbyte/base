const axios = require("axios");
const scp = require("set-cookie-parser");

exports.bypass = function (url, cb) {
  axios({
    url: url,
    rejectHttpErrors: false,
    validateStatus: function (status) {
      return status == (403 || 200);
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
      Accept: "text/html",
      "Accept-Language": "en-US",
      Connection: "keep-alive",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      TE: "trailers",
      DNT: "1",
    },
  })
    .then(function (resp) {
      var c = scp.parse(resp.headers["set-cookie"]);
      if (url.includes("://")) {
        var s = 3;
      } else {
        var s = 1;
      }
      var md = url.split("/").slice(0, s).join("/");
      axios({
        url: "https://check.ddos-guard.net/check.js",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: md,
          Cookie: cookieString(c),
          "Sec-Fetch-Dest": "script",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
        },
      }).then(function (resp) {
        var id = resp.data
          .split(`'/.well-known/ddos-guard/id/`)[1]
          .split(`'`)[0];
        axios({
          url: `${md}/.well-known/ddos-guard/id/${id}`,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
            Accept: "image/webp,*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            Referer: md,
            Cookie: cookieString(c),
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
        }).then(function (resp) {
          var c2 = scp.parse(resp.headers["set-cookie"]);
          for (var d in c2) {
            c.push(c2[d]);
          }
          cb(null, {
            cookies: {
              object: c,
              string: cookieString(c),
            },
            headers: {
              "user-agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
              referer: md,
            },
          });
        });
      });
    })
    .catch(function (err) {
      cb(err, null);
    });
};

function cookieString(cookie) {
  var s = "";
  for (var c in cookie) {
    s = `${s} ${cookie[c].name}=${cookie[c].value};`;
  }
  var s = s.substring(1);
  return s.substring(0, s.length - 1);
}
