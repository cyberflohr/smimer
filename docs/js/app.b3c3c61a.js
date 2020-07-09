(function(e) {
  function a(a) {
    for (
      var t, r, d = a[0], s = a[1], l = a[2], c = 0, u = [];
      c < d.length;
      c++
    )
      (r = d[c]),
        Object.prototype.hasOwnProperty.call(n, r) && n[r] && u.push(n[r][0]),
        (n[r] = 0);
    for (t in s) Object.prototype.hasOwnProperty.call(s, t) && (e[t] = s[t]);
    m && m(a);
    while (u.length) u.shift()();
    return i.push.apply(i, l || []), o();
  }
  function o() {
    for (var e, a = 0; a < i.length; a++) {
      for (var o = i[a], t = !0, d = 1; d < o.length; d++) {
        const s = o[d];
        0 !== n[s] && (t = !1);
      }
      t && (i.splice(a--, 1), (e = r((r.s = o[0]))));
    }
    return e;
  }
  var t = {},
    n = { app: 0 },
    i = [];
  function r(a) {
    if (t[a]) return t[a].exports;
    const o = (t[a] = { i: a, l: !1, exports: {} });
    return e[a].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
  }
  (r.m = e),
    (r.c = t),
    (r.d = function(e, a, o) {
      r.o(e, a) || Object.defineProperty(e, a, { enumerable: !0, get: o });
    }),
    (r.r = function(e) {
      "undefined" !== typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (r.t = function(e, a) {
      if ((1 & a && (e = r(e)), 8 & a)) return e;
      if (4 & a && "object" === typeof e && e && e.__esModule) return e;
      const o = Object.create(null);
      if (
        (r.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & a && "string" != typeof e)
      )
        for (const t in e)
          r.d(
            o,
            t,
            function(a) {
              return e[a];
            }.bind(null, t)
          );
      return o;
    }),
    (r.n = function(e) {
      const a =
        e && e.__esModule
          ? function() {
              return e["default"];
            }
          : function() {
              return e;
            };
      return r.d(a, "a", a), a;
    }),
    (r.o = function(e, a) {
      return Object.prototype.hasOwnProperty.call(e, a);
    }),
    (r.p = "/smimer/");
  let d = (window["webpackJsonp"] = window["webpackJsonp"] || []),
    s = d.push.bind(d);
  (d.push = a), (d = d.slice());
  for (let l = 0; l < d.length; l++) a(d[l]);
  var m = s;
  i.push([1, "chunk-vendors"]), o();
})({
  0: function(e, a) {},
  1: function(e, a, o) {
    e.exports = o("cd49");
  },
  a210: function(e, a, o) {},
  cd49: function(e, a, o) {
    "use strict";
    o.r(a);
    o("e623"), o("e379"), o("5dc8"), o("37e1");
    const t = o("2b0e"),
      n = function() {
        const e = this,
          a = e.$createElement,
          o = e._self._c || a;
        return o(
          "div",
          { attrs: { id: "app" } },
          [e._m(0), o("CertificateCreator"), e._m(1)],
          1
        );
      },
      i = [
        function() {
          const e = this,
            a = e.$createElement,
            o = e._self._c || a;
          return o("section", { staticClass: "hero is-primary" }, [
            o("div", { staticClass: "hero-body" }, [
              o("div", { staticStyle: { margin: "0 10px" } }, [
                o("h1", { staticClass: "title" }, [
                  e._v(" S/MIME certificate creator ")
                ]),
                o("h2", { staticClass: "subtitle" }, [
                  e._v(
                    " Create your own self signed S/MIME certificate for secure e-mail communication. "
                  )
                ])
              ])
            ])
          ]);
        },
        function() {
          const e = this,
            a = e.$createElement,
            o = e._self._c || a;
          return o(
            "footer",
            { staticClass: "footer", staticStyle: { "margin-top": "30px" } },
            [
              o("div", { staticClass: "content has-text-centered" }, [
                o("p", [
                  o("strong", [e._v("SMIMEr")]),
                  e._v(" by Wolfgang Flohr-Hochbichler. The "),
                  o(
                    "a",
                    { attrs: { href: "https://github.com/cyberflohr/smimer" } },
                    [e._v("source code")]
                  ),
                  e._v(" is licensed under "),
                  o(
                    "a",
                    {
                      attrs: {
                        href: "http://opensource.org/licenses/mit-license.php"
                      }
                    },
                    [e._v("MIT")]
                  ),
                  e._v(". ")
                ])
              ])
            ]
          );
        }
      ],
      r = function() {
        const e = this,
          a = e.$createElement,
          o = e._self._c || a;
        return o(
          "section",
          {
            staticStyle: { margin: "0 35px" },
            attrs: { id: "user-information" }
          },
          [
            e.errorMessage
              ? o(
                  "b-notification",
                  {
                    attrs: {
                      type: "is-danger",
                      "aria-close-label": "Close notification",
                      role: "alert"
                    }
                  },
                  [e._v(" " + e._s(e.errorMessage) + " ")]
                )
              : e._e(),
            o(
              "div",
              { staticClass: "rows" },
              [
                o("ValidationObserver", {
                  ref: "observer",
                  scopedSlots: e._u([
                    {
                      key: "default",
                      fn: function(a) {
                        const t = a.passes;
                        return [
                          o(
                            "div",
                            { staticClass: "columns" },
                            [
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Organization" }
                                },
                                [
                                  o("b-input", {
                                    attrs: { name: "organization" },
                                    model: {
                                      value: e.organization,
                                      callback: function(a) {
                                        e.organization = a;
                                      },
                                      expression: "organization"
                                    }
                                  })
                                ],
                                1
                              ),
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Organization unit" }
                                },
                                [
                                  o("b-input", {
                                    attrs: { name: "organization-unit" },
                                    model: {
                                      value: e.organizationUnit,
                                      callback: function(a) {
                                        e.organizationUnit = a;
                                      },
                                      expression: "organizationUnit"
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          o(
                            "div",
                            { staticClass: "columns" },
                            [
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Locality" }
                                },
                                [
                                  o("b-input", {
                                    attrs: { name: "locality" },
                                    model: {
                                      value: e.locality,
                                      callback: function(a) {
                                        e.locality = a;
                                      },
                                      expression: "locality"
                                    }
                                  })
                                ],
                                1
                              ),
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Country" }
                                },
                                [
                                  o(
                                    "b-select",
                                    {
                                      attrs: {
                                        name: "country",
                                        placeholder: "Select a country"
                                      },
                                      model: {
                                        value: e.countryCode,
                                        callback: function(a) {
                                          e.countryCode = a;
                                        },
                                        expression: "countryCode"
                                      }
                                    },
                                    e._l(e.countries, function(a) {
                                      return o(
                                        "option",
                                        {
                                          key: a.Name,
                                          domProps: { value: a.Code }
                                        },
                                        [e._v(" " + e._s(a.Name) + " ")]
                                      );
                                    }),
                                    0
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          o(
                            "div",
                            { staticClass: "columns" },
                            [
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "E-Mail*" }
                                },
                                [
                                  o("ValidationInput", {
                                    attrs: {
                                      rules: "required|email",
                                      type: "email",
                                      name: "email"
                                    },
                                    model: {
                                      value: e.email,
                                      callback: function(a) {
                                        e.email = a;
                                      },
                                      expression: "email"
                                    }
                                  })
                                ],
                                1
                              ),
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Validity period" }
                                },
                                [
                                  o(
                                    "b-select",
                                    {
                                      attrs: { placeholder: "Select a period" },
                                      model: {
                                        value: e.validityPeriod,
                                        callback: function(a) {
                                          e.validityPeriod = a;
                                        },
                                        expression: "validityPeriod"
                                      }
                                    },
                                    [
                                      o("option", { attrs: { value: "1" } }, [
                                        e._v("1 year")
                                      ]),
                                      o("option", { attrs: { value: "2" } }, [
                                        e._v("2 year")
                                      ]),
                                      o("option", { attrs: { value: "3" } }, [
                                        e._v("3 year")
                                      ]),
                                      o("option", { attrs: { value: "4" } }, [
                                        e._v("4 year")
                                      ]),
                                      o("option", { attrs: { value: "5" } }, [
                                        e._v("5 year")
                                      ])
                                    ]
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          o(
                            "div",
                            { staticClass: "columns" },
                            [
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Password*" }
                                },
                                [
                                  o("ValidationInput", {
                                    attrs: {
                                      rules: "required|min:8",
                                      type: "password",
                                      vid: "password",
                                      name: "password"
                                    },
                                    model: {
                                      value: e.password,
                                      callback: function(a) {
                                        e.password = a;
                                      },
                                      expression: "password"
                                    }
                                  })
                                ],
                                1
                              ),
                              o(
                                "b-field",
                                {
                                  staticClass: "column",
                                  attrs: { label: "Confirm Password*" }
                                },
                                [
                                  o("ValidationInput", {
                                    attrs: {
                                      rules:
                                        "required|min:8|confirmed:password",
                                      type: "password",
                                      name: "confirmation"
                                    },
                                    model: {
                                      value: e.confirmation,
                                      callback: function(a) {
                                        e.confirmation = a;
                                      },
                                      expression: "confirmation"
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          o("div", [
                            o("strong", [e._v("Security notice:")]),
                            e._v(
                              " All tasks (e.g. create key pair, certificate) are processed locally in your web browser. No information is sent to the internet. Please close the browser tab after you downloaded your certificate. Afterwards you can import the p12/pfx file into your OS certificate store - keyChain Access (MacOS), certmgr (Windows). "
                            )
                          ]),
                          o(
                            "div",
                            {
                              staticClass: "buttons",
                              staticStyle: {
                                "margin-top": "30px",
                                "justify-content": "flex-end"
                              }
                            },
                            [
                              o(
                                "button",
                                {
                                  staticClass: "button is-primary",
                                  attrs: { id: "btn-create-certificate" },
                                  on: {
                                    click: function(a) {
                                      return t(e.createKeysAndCertificate);
                                    }
                                  }
                                },
                                [e._v(" Download certificate ")]
                              )
                            ]
                          )
                        ];
                      }
                    }
                  ])
                })
              ],
              1
            )
          ],
          1
        );
      },
      d = [],
      s = o("9ab4"),
      l = (o("d3b7"), o("5c1a"));
    function m() {
      return new Promise(function(e, a) {
        l["random"].getBytes(8, function(o, t) {
          o && a(o), e(t);
        });
      });
    }
    function c(e) {
      const a = new Date();
      a.setHours(0), a.setMinutes(0), a.setSeconds(0);
      const o = new Date(a.getTime() + 24 * e * 60 * 60 * 1e3);
      return { notBefore: a, notAfter: o };
    }
    function u(e, a, o, t, n) {
      const i = [];
      return (
        a && i.push({ name: "countryName", value: a }),
        o && i.push({ name: "localityName", value: o }),
        t && i.push({ name: "organizationalUnitName", value: t }),
        n && i.push({ name: "organizationName", value: n }),
        e && i.push({ name: "commonName", value: e }),
        i
      );
    }
    function C(e, a, o, t, n, i) {
      return Object(s["b"])(this, void 0, void 0, function() {
        let r, d, u;
        return Object(s["c"])(this, function(C) {
          switch (C.label) {
            case 0:
              return (
                (r = l["pki"].createCertificate()),
                (r.publicKey = n.publicKey),
                (d = r),
                [4, m()]
              );
            case 1:
              return (
                (d.serialNumber = C.sent()),
                (u = c(o)),
                (r.validity.notBefore = u.notBefore),
                (r.validity.notAfter = u.notAfter),
                r.setSubject(a),
                r.setIssuer(e),
                r.setExtensions(
                  Object(s["d"])(t, [{ name: "subjectKeyIdentifier" }])
                ),
                r.sign(i ? i.privateKey : n.privateKey),
                [2, r]
              );
          }
        });
      });
    }
    function N(e) {
      return (
        void 0 === e && (e = 2048),
        Object(s["b"])(this, void 0, Promise, function() {
          return Object(s["c"])(this, function(a) {
            return [
              2,
              new Promise(function(a, o) {
                l["pki"].rsa.generateKeyPair(e, void 0, function(e, t) {
                  if (!e) return a(t);
                  o(e);
                });
              })
            ];
          });
        })
      );
    }
    const f = " Secure Mail CA";
    function p(e, a, o, t, n, i, r, d, l) {
      return Object(s["b"])(this, void 0, void 0, function() {
        let m;
        return Object(s["c"])(this, function(s) {
          return (
            (m = o["generateSubjectKeyIdentifier"]().getBytes()),
            [
              2,
              C(
                u(n + f, i, r, d, l),
                u(n),
                t,
                [
                  { name: "basicConstraints", cA: !1, critical: !0 },
                  {
                    name: "keyUsage",
                    digitalSignature: !0,
                    keyEncipherment: !0,
                    critical: !0
                  },
                  { name: "extKeyUsage", emailProtection: !0 },
                  { name: "nsCertType", email: !0 },
                  { name: "subjectAltName", altNames: [{ type: 1, value: n }] },
                  {
                    name: "authorityKeyIdentifier",
                    keyIdentifier: m,
                    authorityCertIssuer: !0
                  }
                ],
                e,
                a
              )
            ]
          );
        });
      });
    }
    function b(e, a, o, t, n, i, r, d) {
      return Object(s["b"])(this, void 0, void 0, function() {
        return Object(s["c"])(this, function(s) {
          return [
            2,
            C(
              u(t + f, n, i, r, d),
              u(t + f, n, i, r, d),
              o,
              [
                { name: "basicConstraints", cA: !0, critical: !0 },
                { name: "keyUsage", keyCertSign: !0, critical: !0 }
              ],
              e,
              a
            )
          ];
        });
      });
    }
    function v(e, a, o, t) {
      const n = l["pkcs12"].toPkcs12Asn1(e, [a, o], t, { algorithm: "3des" });
      return l["asn1"].toDer(n).getBytes();
    }
    const y = o("aeb1"),
      h = o.n(y),
      g = [
        { Code: "AF", Name: "Afghanistan" },
        { Code: "AX", Name: "Åland Islands" },
        { Code: "AL", Name: "Albania" },
        { Code: "DZ", Name: "Algeria" },
        { Code: "AS", Name: "American Samoa" },
        { Code: "AD", Name: "Andorra" },
        { Code: "AO", Name: "Angola" },
        { Code: "AI", Name: "Anguilla" },
        { Code: "AQ", Name: "Antarctica" },
        { Code: "AG", Name: "Antigua and Barbuda" },
        { Code: "AR", Name: "Argentina" },
        { Code: "AM", Name: "Armenia" },
        { Code: "AW", Name: "Aruba" },
        { Code: "AU", Name: "Australia" },
        { Code: "AT", Name: "Austria" },
        { Code: "AZ", Name: "Azerbaijan" },
        { Code: "BS", Name: "Bahamas" },
        { Code: "BH", Name: "Bahrain" },
        { Code: "BD", Name: "Bangladesh" },
        { Code: "BB", Name: "Barbados" },
        { Code: "BY", Name: "Belarus" },
        { Code: "BE", Name: "Belgium" },
        { Code: "BZ", Name: "Belize" },
        { Code: "BJ", Name: "Benin" },
        { Code: "BM", Name: "Bermuda" },
        { Code: "BT", Name: "Bhutan" },
        { Code: "BO", Name: "Bolivia, Plurinational State of" },
        { Code: "BQ", Name: "Bonaire, Sint Eustatius and Saba" },
        { Code: "BA", Name: "Bosnia and Herzegovina" },
        { Code: "BW", Name: "Botswana" },
        { Code: "BV", Name: "Bouvet Island" },
        { Code: "BR", Name: "Brazil" },
        { Code: "IO", Name: "British Indian Ocean Territory" },
        { Code: "BN", Name: "Brunei Darussalam" },
        { Code: "BG", Name: "Bulgaria" },
        { Code: "BF", Name: "Burkina Faso" },
        { Code: "BI", Name: "Burundi" },
        { Code: "KH", Name: "Cambodia" },
        { Code: "CM", Name: "Cameroon" },
        { Code: "CA", Name: "Canada" },
        { Code: "CV", Name: "Cape Verde" },
        { Code: "KY", Name: "Cayman Islands" },
        { Code: "CF", Name: "Central African Republic" },
        { Code: "TD", Name: "Chad" },
        { Code: "CL", Name: "Chile" },
        { Code: "CN", Name: "China" },
        { Code: "CX", Name: "Christmas Island" },
        { Code: "CC", Name: "Cocos (Keeling) Islands" },
        { Code: "CO", Name: "Colombia" },
        { Code: "KM", Name: "Comoros" },
        { Code: "CG", Name: "Congo" },
        { Code: "CD", Name: "Congo, the Democratic Republic of the" },
        { Code: "CK", Name: "Cook Islands" },
        { Code: "CR", Name: "Costa Rica" },
        { Code: "CI", Name: "Côte d'Ivoire" },
        { Code: "HR", Name: "Croatia" },
        { Code: "CU", Name: "Cuba" },
        { Code: "CW", Name: "Curaçao" },
        { Code: "CY", Name: "Cyprus" },
        { Code: "CZ", Name: "Czech Republic" },
        { Code: "DK", Name: "Denmark" },
        { Code: "DJ", Name: "Djibouti" },
        { Code: "DM", Name: "Dominica" },
        { Code: "DO", Name: "Dominican Republic" },
        { Code: "EC", Name: "Ecuador" },
        { Code: "EG", Name: "Egypt" },
        { Code: "SV", Name: "El Salvador" },
        { Code: "GQ", Name: "Equatorial Guinea" },
        { Code: "ER", Name: "Eritrea" },
        { Code: "EE", Name: "Estonia" },
        { Code: "ET", Name: "Ethiopia" },
        { Code: "FK", Name: "Falkland Islands (Malvinas)" },
        { Code: "FO", Name: "Faroe Islands" },
        { Code: "FJ", Name: "Fiji" },
        { Code: "FI", Name: "Finland" },
        { Code: "FR", Name: "France" },
        { Code: "GF", Name: "French Guiana" },
        { Code: "PF", Name: "French Polynesia" },
        { Code: "TF", Name: "French Southern Territories" },
        { Code: "GA", Name: "Gabon" },
        { Code: "GM", Name: "Gambia" },
        { Code: "GE", Name: "Georgia" },
        { Code: "DE", Name: "Germany" },
        { Code: "GH", Name: "Ghana" },
        { Code: "GI", Name: "Gibraltar" },
        { Code: "GR", Name: "Greece" },
        { Code: "GL", Name: "Greenland" },
        { Code: "GD", Name: "Grenada" },
        { Code: "GP", Name: "Guadeloupe" },
        { Code: "GU", Name: "Guam" },
        { Code: "GT", Name: "Guatemala" },
        { Code: "GG", Name: "Guernsey" },
        { Code: "GN", Name: "Guinea" },
        { Code: "GW", Name: "Guinea-Bissau" },
        { Code: "GY", Name: "Guyana" },
        { Code: "HT", Name: "Haiti" },
        { Code: "HM", Name: "Heard Island and McDonald Islands" },
        { Code: "VA", Name: "Holy See (Vatican City State)" },
        { Code: "HN", Name: "Honduras" },
        { Code: "HK", Name: "Hong Kong" },
        { Code: "HU", Name: "Hungary" },
        { Code: "IS", Name: "Iceland" },
        { Code: "IN", Name: "India" },
        { Code: "ID", Name: "Indonesia" },
        { Code: "IR", Name: "Iran, Islamic Republic of" },
        { Code: "IQ", Name: "Iraq" },
        { Code: "IE", Name: "Ireland" },
        { Code: "IM", Name: "Isle of Man" },
        { Code: "IL", Name: "Israel" },
        { Code: "IT", Name: "Italy" },
        { Code: "JM", Name: "Jamaica" },
        { Code: "JP", Name: "Japan" },
        { Code: "JE", Name: "Jersey" },
        { Code: "JO", Name: "Jordan" },
        { Code: "KZ", Name: "Kazakhstan" },
        { Code: "KE", Name: "Kenya" },
        { Code: "KI", Name: "Kiribati" },
        { Code: "KP", Name: "Korea, Democratic People's Republic of" },
        { Code: "KR", Name: "Korea, Republic of" },
        { Code: "KW", Name: "Kuwait" },
        { Code: "KG", Name: "Kyrgyzstan" },
        { Code: "LA", Name: "Lao People's Democratic Republic" },
        { Code: "LV", Name: "Latvia" },
        { Code: "LB", Name: "Lebanon" },
        { Code: "LS", Name: "Lesotho" },
        { Code: "LR", Name: "Liberia" },
        { Code: "LY", Name: "Libya" },
        { Code: "LI", Name: "Liechtenstein" },
        { Code: "LT", Name: "Lithuania" },
        { Code: "LU", Name: "Luxembourg" },
        { Code: "MO", Name: "Macao" },
        { Code: "MK", Name: "Macedonia, the Former Yugoslav Republic of" },
        { Code: "MG", Name: "Madagascar" },
        { Code: "MW", Name: "Malawi" },
        { Code: "MY", Name: "Malaysia" },
        { Code: "MV", Name: "Maldives" },
        { Code: "ML", Name: "Mali" },
        { Code: "MT", Name: "Malta" },
        { Code: "MH", Name: "Marshall Islands" },
        { Code: "MQ", Name: "Martinique" },
        { Code: "MR", Name: "Mauritania" },
        { Code: "MU", Name: "Mauritius" },
        { Code: "YT", Name: "Mayotte" },
        { Code: "MX", Name: "Mexico" },
        { Code: "FM", Name: "Micronesia, Federated States of" },
        { Code: "MD", Name: "Moldova, Republic of" },
        { Code: "MC", Name: "Monaco" },
        { Code: "MN", Name: "Mongolia" },
        { Code: "ME", Name: "Montenegro" },
        { Code: "MS", Name: "Montserrat" },
        { Code: "MA", Name: "Morocco" },
        { Code: "MZ", Name: "Mozambique" },
        { Code: "MM", Name: "Myanmar" },
        { Code: "NA", Name: "Namibia" },
        { Code: "NR", Name: "Nauru" },
        { Code: "NP", Name: "Nepal" },
        { Code: "NL", Name: "Netherlands" },
        { Code: "NC", Name: "New Caledonia" },
        { Code: "NZ", Name: "New Zealand" },
        { Code: "NI", Name: "Nicaragua" },
        { Code: "NE", Name: "Niger" },
        { Code: "NG", Name: "Nigeria" },
        { Code: "NU", Name: "Niue" },
        { Code: "NF", Name: "Norfolk Island" },
        { Code: "MP", Name: "Northern Mariana Islands" },
        { Code: "NO", Name: "Norway" },
        { Code: "OM", Name: "Oman" },
        { Code: "PK", Name: "Pakistan" },
        { Code: "PW", Name: "Palau" },
        { Code: "PS", Name: "Palestine, State of" },
        { Code: "PA", Name: "Panama" },
        { Code: "PG", Name: "Papua New Guinea" },
        { Code: "PY", Name: "Paraguay" },
        { Code: "PE", Name: "Peru" },
        { Code: "PH", Name: "Philippines" },
        { Code: "PN", Name: "Pitcairn" },
        { Code: "PL", Name: "Poland" },
        { Code: "PT", Name: "Portugal" },
        { Code: "PR", Name: "Puerto Rico" },
        { Code: "QA", Name: "Qatar" },
        { Code: "RE", Name: "Réunion" },
        { Code: "RO", Name: "Romania" },
        { Code: "RU", Name: "Russian Federation" },
        { Code: "RW", Name: "Rwanda" },
        { Code: "BL", Name: "Saint Barthélemy" },
        { Code: "SH", Name: "Saint Helena, Ascension and Tristan da Cunha" },
        { Code: "KN", Name: "Saint Kitts and Nevis" },
        { Code: "LC", Name: "Saint Lucia" },
        { Code: "MF", Name: "Saint Martin (French part)" },
        { Code: "PM", Name: "Saint Pierre and Miquelon" },
        { Code: "VC", Name: "Saint Vincent and the Grenadines" },
        { Code: "WS", Name: "Samoa" },
        { Code: "SM", Name: "San Marino" },
        { Code: "ST", Name: "Sao Tome and Principe" },
        { Code: "SA", Name: "Saudi Arabia" },
        { Code: "SN", Name: "Senegal" },
        { Code: "RS", Name: "Serbia" },
        { Code: "SC", Name: "Seychelles" },
        { Code: "SL", Name: "Sierra Leone" },
        { Code: "SG", Name: "Singapore" },
        { Code: "SX", Name: "Sint Maarten (Dutch part)" },
        { Code: "SK", Name: "Slovakia" },
        { Code: "SI", Name: "Slovenia" },
        { Code: "SB", Name: "Solomon Islands" },
        { Code: "SO", Name: "Somalia" },
        { Code: "ZA", Name: "South Africa" },
        { Code: "GS", Name: "South Georgia and the South Sandwich Islands" },
        { Code: "SS", Name: "South Sudan" },
        { Code: "ES", Name: "Spain" },
        { Code: "LK", Name: "Sri Lanka" },
        { Code: "SD", Name: "Sudan" },
        { Code: "SR", Name: "Suriname" },
        { Code: "SJ", Name: "Svalbard and Jan Mayen" },
        { Code: "SZ", Name: "Swaziland" },
        { Code: "SE", Name: "Sweden" },
        { Code: "CH", Name: "Switzerland" },
        { Code: "SY", Name: "Syrian Arab Republic" },
        { Code: "TW", Name: "Taiwan, Province of China" },
        { Code: "TJ", Name: "Tajikistan" },
        { Code: "TZ", Name: "Tanzania, United Republic of" },
        { Code: "TH", Name: "Thailand" },
        { Code: "TL", Name: "Timor-Leste" },
        { Code: "TG", Name: "Togo" },
        { Code: "TK", Name: "Tokelau" },
        { Code: "TO", Name: "Tonga" },
        { Code: "TT", Name: "Trinidad and Tobago" },
        { Code: "TN", Name: "Tunisia" },
        { Code: "TR", Name: "Turkey" },
        { Code: "TM", Name: "Turkmenistan" },
        { Code: "TC", Name: "Turks and Caicos Islands" },
        { Code: "TV", Name: "Tuvalu" },
        { Code: "UG", Name: "Uganda" },
        { Code: "UA", Name: "Ukraine" },
        { Code: "AE", Name: "United Arab Emirates" },
        { Code: "GB", Name: "United Kingdom" },
        { Code: "US", Name: "United States" },
        { Code: "UM", Name: "United States Minor Outlying Islands" },
        { Code: "UY", Name: "Uruguay" },
        { Code: "UZ", Name: "Uzbekistan" },
        { Code: "VU", Name: "Vanuatu" },
        { Code: "VE", Name: "Venezuela, Bolivarian Republic of" },
        { Code: "VN", Name: "Viet Nam" },
        { Code: "VG", Name: "Virgin Islands, British" },
        { Code: "VI", Name: "Virgin Islands, U.S." },
        { Code: "WF", Name: "Wallis and Futuna" },
        { Code: "EH", Name: "Western Sahara" },
        { Code: "YE", Name: "Yemen" },
        { Code: "ZM", Name: "Zambia" },
        { Code: "ZW", Name: "Zimbabwe" }
      ],
      S = o("7bb1"),
      M = function() {
        const e = this,
          a = e.$createElement,
          o = e._self._c || a;
        return o("ValidationProvider", {
          attrs: {
            vid: e.vid,
            name: e.$attrs.name || e.$attrs.label,
            rules: e.rules
          },
          scopedSlots: e._u([
            {
              key: "default",
              fn: function(a) {
                const t = a.errors,
                  n = a.valid;
                return [
                  o(
                    "b-field",
                    e._b(
                      {
                        attrs: {
                          type: { "is-danger": t[0], "is-success": n },
                          message: t
                        }
                      },
                      "b-field",
                      e.$attrs,
                      !1
                    ),
                    [
                      o(
                        "b-input",
                        e._b(
                          {
                            model: {
                              value: e.innerValue,
                              callback: function(a) {
                                e.innerValue = a;
                              },
                              expression: "innerValue"
                            }
                          },
                          "b-input",
                          e.$attrs,
                          !1
                        )
                      )
                    ],
                    1
                  )
                ];
              }
            }
          ])
        });
      },
      A = [],
      I = {
        components: { ValidationProvider: S["b"] },
        props: {
          vid: { type: String },
          rules: { type: [Object, String], default: "" },
          value: { type: null }
        },
        data: function() {
          return { innerValue: "" };
        },
        watch: {
          innerValue: function(e) {
            this.$emit("input", e);
          },
          value: function(e) {
            this.innerValue = e;
          }
        },
        created: function() {
          this.value && (this.innerValue = this.value);
        }
      },
      P = I,
      O = o("2877"),
      B = Object(O["a"])(P, M, A, !1, null, null, null),
      w = B.exports,
      T = t["a"].extend({
        name: "CertificateCreator",
        components: { ValidationObserver: S["a"], ValidationInput: w },
        props: { msg: String },
        data: function() {
          return {
            organization: "",
            organizationUnit: "",
            locality: "",
            email: "",
            countryCode: navigator.language.substr(
              navigator.language.length - 2
            ),
            validityPeriod: 1,
            password: "",
            confirmation: "",
            errorMessage: ""
          };
        },
        methods: {
          createKeysAndCertificate: function() {
            return Object(s["b"])(this, void 0, void 0, function() {
              let e, a, o, t, n, i;
              return Object(s["c"])(this, function(r) {
                switch (r.label) {
                  case 0:
                    (e = "Creating CA key pair"), (r.label = 1);
                  case 1:
                    return r.trys.push([1, 6, , 7]), [4, N()];
                  case 2:
                    return (
                      (a = r.sent()),
                      (e = "Creating CA certificate"),
                      [
                        4,
                        b(
                          a,
                          a,
                          365 * this.validityPeriod,
                          this.email,
                          this.countryCode,
                          this.locality,
                          this.organizationUnit,
                          this.organization
                        )
                      ]
                    );
                  case 3:
                    return (
                      (o = r.sent()), (e = "Creating user key pair"), [4, N()]
                    );
                  case 4:
                    return (
                      (t = r.sent()),
                      (e = "Creating user certificate"),
                      [
                        4,
                        p(
                          t,
                          a,
                          o,
                          365 * this.validityPeriod,
                          this.email,
                          this.countryCode,
                          this.locality,
                          this.organizationUnit,
                          this.organization
                        )
                      ]
                    );
                  case 5:
                    return (
                      (n = r.sent()),
                      (e = "Prepare download"),
                      this.download(t.privateKey, n, o),
                      [3, 7]
                    );
                  case 6:
                    return (
                      (i = r.sent()),
                      (this.errorMessage = e + " failed. " + i),
                      console.error(i),
                      [3, 7]
                    );
                  case 7:
                    return [2];
                }
              });
            });
          },
          download: function(e, a, o) {
            h()(v(e, a, o, this.password), this.email + ".p12");
          }
        },
        computed: {
          countries: function() {
            return g;
          }
        }
      }),
      G = T,
      k = Object(O["a"])(G, r, d, !1, null, null, null),
      j = k.exports,
      _ = t["a"].extend({
        name: "App",
        components: { CertificateCreator: j },
        errorCaptured: function(e, a, o) {
          console.error("error captured", e, a, o);
        }
      }),
      K = _,
      E = (o("fffb"), Object(O["a"])(K, n, i, !1, null, null, null)),
      R = E.exports,
      V = o("1361"),
      L = o("c2cd"),
      U = o("ee4c"),
      x = o("f921"),
      z = o("bac5"),
      F = (o("5abe"), o("4c93"));
    Object(S["c"])(
      "required",
      Object(s["a"])(Object(s["a"])({}, F["d"]), {
        message: "This field is required"
      })
    ),
      Object(S["c"])(
        "email",
        Object(s["a"])(Object(s["a"])({}, F["b"]), {
          message: "This field must be a valid email"
        })
      ),
      Object(S["c"])(
        "confirmed",
        Object(s["a"])(Object(s["a"])({}, F["a"]), {
          message: "confirmation does not match"
        })
      ),
      Object(S["c"])("min", Object(s["a"])({}, F["c"])),
      t["a"].use(V["a"]),
      t["a"].use(L["a"]),
      t["a"].use(U["a"]),
      t["a"].use(x["a"]),
      t["a"].use(z["a"]),
      (t["a"].config.productionTip = !1),
      new t["a"]({
        render: function(e) {
          return e(R);
        }
      }).$mount("#app");
  },
  fffb: function(e, a, o) {
    "use strict";
    const t = o("a210"),
      n = o.n(t);
    n.a;
  }
});
//# sourceMappingURL=app.b3c3c61a.js.map
