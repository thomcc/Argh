function d(a) {
  throw a;
}
var aa = void 0, g = !0, h = null, l = !1;
function ba() {
  return function(a) {
    return a
  }
}
function m(a) {
  return function() {
    return this[a]
  }
}
function n(a) {
  return function() {
    return a
  }
}
var o;
function p(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}
function r(a) {
  return a !== aa
}
function ca(a) {
  return"string" == typeof a
}
function da(a) {
  return a[ea] || (a[ea] = ++fa)
}
var ea = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), fa = 0;
var ga = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"}, ha = {"'":"\\'"};
function ja(a) {
  var q;
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var e = a.charAt(c), f = e.charCodeAt(0), i = b, k = c + 1, j;
    if(!(j = ga[e])) {
      if(!(31 < f && 127 > f)) {
        if(e in ha) {
          e = ha[e]
        }else {
          if(e in ga) {
            q = ha[e] = ga[e], e = q
          }else {
            f = e;
            j = e.charCodeAt(0);
            if(31 < j && 127 > j) {
              f = e
            }else {
              if(256 > j) {
                if(f = "\\x", 16 > j || 256 < j) {
                  f += "0"
                }
              }else {
                f = "\\u", 4096 > j && (f += "0")
              }
              f += j.toString(16).toUpperCase()
            }
            e = ha[e] = f
          }
        }
      }
      j = e
    }
    i[k] = j
  }
  b.push('"');
  return b.join("")
}
function ka(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= 4294967296
  }
  return b
}
;function la(a, b, c) {
  for(var e in a) {
    b.call(c, a[e], e, a)
  }
}
function ma(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
}
;var na;
(na = "ScriptEngine" in this && "JScript" == this.ScriptEngine()) && (this.ScriptEngineMajorVersion(), this.ScriptEngineMinorVersion(), this.ScriptEngineBuildVersion());
function ta(a, b) {
  this.s = na ? [] : "";
  a != h && this.append.apply(this, arguments)
}
na ? (ta.prototype.Z = 0, ta.prototype.append = function(a, b, c) {
  b == h ? this.s[this.Z++] = a : (this.s.push.apply(this.s, arguments), this.Z = this.s.length);
  return this
}) : ta.prototype.append = function(a, b, c) {
  this.s += a;
  if(b != h) {
    for(var e = 1;e < arguments.length;e++) {
      this.s += arguments[e]
    }
  }
  return this
};
ta.prototype.clear = function() {
  na ? this.Z = this.s.length = 0 : this.s = ""
};
ta.prototype.toString = function() {
  if(na) {
    var a = this.s.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.s
};
function u(a) {
  return a != h && a !== l
}
function ua(a, b) {
  var c = a[p.call(h, b)];
  if(u(c)) {
    return c
  }
  c = a._;
  return u(c) ? c : l
}
function v(a, b) {
  return Error.call(h, "No protocol method " + a + " defined for type " + p.call(h, b) + ": " + b)
}
function x(a) {
  return Array.prototype.slice.call(a)
}
function y(a) {
  if(a ? a.v : a) {
    a = a.v(a)
  }else {
    var b;
    var c = y[p.call(h, a)];
    c ? b = c : (c = y._) ? b = c : d(v.call(h, "ICounted.-count", a));
    a = b.call(h, a)
  }
  return a
}
function z(a, b) {
  var c;
  if(a ? a.n : a) {
    c = a.n(a, b)
  }else {
    var e = z[p.call(h, a)];
    e ? c = e : (e = z._) ? c = e : d(v.call(h, "ICollection.-conj", a));
    c = c.call(h, a, b)
  }
  return c
}
var A = function() {
  function a(a, b, c) {
    if(a ? a.ba : a) {
      a = a.ba(a, b, c)
    }else {
      var k;
      var j = A[p.call(h, a)];
      j ? k = j : (j = A._) ? k = j : d(v.call(h, "IIndexed.-nth", a));
      a = k.call(h, a, b, c)
    }
    return a
  }
  function b(a, b) {
    var c;
    if(a ? a.aa : a) {
      c = a.aa(a, b)
    }else {
      var k = A[p.call(h, a)];
      k ? c = k : (k = A._) ? c = k : d(v.call(h, "IIndexed.-nth", a));
      c = c.call(h, a, b)
    }
    return c
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}(), va = {};
function wa(a) {
  if(a ? a.P : a) {
    a = a.P(a)
  }else {
    var b;
    var c = wa[p.call(h, a)];
    c ? b = c : (c = wa._) ? b = c : d(v.call(h, "ISeq.-first", a));
    a = b.call(h, a)
  }
  return a
}
function xa(a) {
  if(a ? a.Q : a) {
    a = a.Q(a)
  }else {
    var b;
    var c = xa[p.call(h, a)];
    c ? b = c : (c = xa._) ? b = c : d(v.call(h, "ISeq.-rest", a));
    a = b.call(h, a)
  }
  return a
}
var B = function() {
  function a(a, b, c) {
    if(a ? a.G : a) {
      a = a.G(a, b, c)
    }else {
      var k;
      var j = B[p.call(h, a)];
      j ? k = j : (j = B._) ? k = j : d(v.call(h, "ILookup.-lookup", a));
      a = k.call(h, a, b, c)
    }
    return a
  }
  function b(a, b) {
    var c;
    if(a ? a.F : a) {
      c = a.F(a, b)
    }else {
      var k = B[p.call(h, a)];
      k ? c = k : (k = B._) ? c = k : d(v.call(h, "ILookup.-lookup", a));
      c = c.call(h, a, b)
    }
    return c
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}();
function ya(a, b) {
  var c;
  if(a ? a.$ : a) {
    c = a.$(a, b)
  }else {
    var e = ya[p.call(h, a)];
    e ? c = e : (e = ya._) ? c = e : d(v.call(h, "IAssociative.-contains-key?", a));
    c = c.call(h, a, b)
  }
  return c
}
function za(a, b, c) {
  if(a ? a.K : a) {
    a = a.K(a, b, c)
  }else {
    var e;
    var f = za[p.call(h, a)];
    f ? e = f : (f = za._) ? e = f : d(v.call(h, "IAssociative.-assoc", a));
    a = e.call(h, a, b, c)
  }
  return a
}
var Aa = {};
function Ba(a, b) {
  var c;
  if(a ? a.O : a) {
    c = a.O(a, b)
  }else {
    var e = Ba[p.call(h, a)];
    e ? c = e : (e = Ba._) ? c = e : d(v.call(h, "IMap.-dissoc", a));
    c = c.call(h, a, b)
  }
  return c
}
var Ca = {};
function Da(a, b) {
  var c;
  if(a ? a.fa : a) {
    c = a.fa(0, b)
  }else {
    var e = Da[p.call(h, a)];
    e ? c = e : (e = Da._) ? c = e : d(v.call(h, "ISet.-disjoin", a));
    c = c.call(h, a, b)
  }
  return c
}
var Ea = {};
function Fa(a) {
  if(a ? a.ia : a) {
    a = a.state
  }else {
    var b;
    var c = Fa[p.call(h, a)];
    c ? b = c : (c = Fa._) ? b = c : d(v.call(h, "IDeref.-deref", a));
    a = b.call(h, a)
  }
  return a
}
var Ga = {};
function Ha(a) {
  if(a ? a.p : a) {
    a = a.p(a)
  }else {
    var b;
    var c = Ha[p.call(h, a)];
    c ? b = c : (c = Ha._) ? b = c : d(v.call(h, "IMeta.-meta", a));
    a = b.call(h, a)
  }
  return a
}
function Ia(a, b) {
  var c;
  if(a ? a.t : a) {
    c = a.t(a, b)
  }else {
    var e = Ia[p.call(h, a)];
    e ? c = e : (e = Ia._) ? c = e : d(v.call(h, "IWithMeta.-with-meta", a));
    c = c.call(h, a, b)
  }
  return c
}
var Ja = function() {
  function a(a, b, c) {
    if(a ? a.da : a) {
      a = a.da(a, b, c)
    }else {
      var k;
      var j = Ja[p.call(h, a)];
      j ? k = j : (j = Ja._) ? k = j : d(v.call(h, "IReduce.-reduce", a));
      a = k.call(h, a, b, c)
    }
    return a
  }
  function b(a, b) {
    var c;
    if(a ? a.ca : a) {
      c = a.ca(a, b)
    }else {
      var k = Ja[p.call(h, a)];
      k ? c = k : (k = Ja._) ? c = k : d(v.call(h, "IReduce.-reduce", a));
      c = c.call(h, a, b)
    }
    return c
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}();
function C(a, b) {
  var c;
  if(a ? a.j : a) {
    c = a.j(a, b)
  }else {
    var e = C[p.call(h, a)];
    e ? c = e : (e = C._) ? c = e : d(v.call(h, "IEquiv.-equiv", a));
    c = c.call(h, a, b)
  }
  return c
}
function D(a) {
  if(a ? a.k : a) {
    a = a.k(a)
  }else {
    var b;
    var c = D[p.call(h, a)];
    c ? b = c : (c = D._) ? b = c : d(v.call(h, "IHash.-hash", a));
    a = b.call(h, a)
  }
  return a
}
function Ka(a) {
  if(a ? a.r : a) {
    a = a.r(a)
  }else {
    var b;
    var c = Ka[p.call(h, a)];
    c ? b = c : (c = Ka._) ? b = c : d(v.call(h, "ISeqable.-seq", a));
    a = b.call(h, a)
  }
  return a
}
var La = {}, Ma = {};
function Na(a, b) {
  var c;
  if(a ? a.l : a) {
    c = a.l(a, b)
  }else {
    var e = Na[p.call(h, a)];
    e ? c = e : (e = Na._) ? c = e : d(v.call(h, "IPrintable.-pr-seq", a));
    c = c.call(h, a, b)
  }
  return c
}
function Oa(a, b, c) {
  if(a ? a.ga : a) {
    a = a.ga(a, b, c)
  }else {
    var e;
    var f = Oa[p.call(h, a)];
    f ? e = f : (f = Oa._) ? e = f : d(v.call(h, "IWatchable.-notify-watches", a));
    a = e.call(h, a, b, c)
  }
  return a
}
function Pa(a, b) {
  return a === b
}
function Qa(a, b) {
  return C(a, b)
}
D["null"] = n(0);
B["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return h;
      case 3:
        return c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
za["null"] = function(a, b, c) {
  return E(b, c)
};
z["null"] = function(a, b) {
  return F(b)
};
Ja["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b.call(h);
      case 3:
        return c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
Ma["null"] = g;
Na["null"] = function() {
  return F("nil")
};
Ca["null"] = g;
Da["null"] = n(h);
y["null"] = n(0);
va["null"] = g;
wa["null"] = n(h);
xa["null"] = function() {
  return F()
};
C["null"] = function(a, b) {
  return b === h
};
Ia["null"] = n(h);
Ga["null"] = g;
Ha["null"] = n(h);
A["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return h;
      case 3:
        return c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
Aa["null"] = g;
Ba["null"] = n(h);
Date.prototype.j = function(a, b) {
  return a.toString() === b.toString()
};
D.number = ba();
C.number = function(a, b) {
  return a === b
};
D["boolean"] = function(a) {
  return a === g ? 1 : 0
};
D["function"] = function(a) {
  return da.call(h, a)
};
var Ra = function() {
  function a(a, b, c, e) {
    for(;;) {
      if(e < y(a)) {
        c = b.call(h, c, A.a(a, e)), e += 1
      }else {
        return c
      }
    }
  }
  function b(a, b, c) {
    for(var e = 0;;) {
      if(e < y(a)) {
        c = b.call(h, c, A.a(a, e)), e += 1
      }else {
        return c
      }
    }
  }
  function c(a, b) {
    if(u(Qa(0, y(a)))) {
      return b.call(h)
    }
    for(var c = A.a(a, 0), e = 1;;) {
      if(e < y(a)) {
        c = b.call(h, c, A.a(a, e)), e += 1
      }else {
        return c
      }
    }
  }
  var e = h, e = function(e, i, k, j) {
    switch(arguments.length) {
      case 2:
        return c.call(this, e, i);
      case 3:
        return b.call(this, e, i, k);
      case 4:
        return a.call(this, e, i, k, j)
    }
    d("Invalid arity: " + arguments.length)
  };
  e.a = c;
  e.b = b;
  e.m = a;
  return e
}();
function Sa(a, b) {
  this.u = a;
  this.D = b
}
o = Sa.prototype;
o.k = function(a) {
  return G(a)
};
o.ca = function(a, b) {
  return Ra.m(this.u, b, this.u[this.D], this.D + 1)
};
o.da = function(a, b, c) {
  return Ra.m(this.u, b, c, this.D)
};
o.n = function(a, b) {
  return I(b, a)
};
o.j = function(a, b) {
  return Ta(a, b)
};
o.R = g;
o.aa = function(a, b) {
  var c = b + this.D;
  return c < this.u.length ? this.u[c] : h
};
o.ba = function(a, b, c) {
  a = b + this.D;
  return a < this.u.length ? this.u[a] : c
};
o.v = function() {
  return this.u.length - this.D
};
o.V = g;
o.P = function() {
  return this.u[this.D]
};
o.Q = function() {
  return this.D + 1 < this.u.length ? new Sa(this.u, this.D + 1) : F()
};
o.r = ba();
function Ua(a) {
  return u(C(0, a.length)) ? h : new Sa(a, 0)
}
function J(a) {
  return Ua(a)
}
Ja.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return Ra.a(a, b);
      case 3:
        return Ra.b(a, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
B.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return a[b];
      case 3:
        return A.b(a, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
A.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b < a.length ? a[b] : h;
      case 3:
        return b < a.length ? a[b] : c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
y.array = function(a) {
  return a.length
};
Ka.array = function(a) {
  return Ua(a)
};
function K(a) {
  return u(a) ? Ka(a) : h
}
function L(a) {
  a = K(a);
  return u(a) ? wa(a) : h
}
function M(a) {
  return xa(K(a))
}
function N(a) {
  return u(a) ? K(M(a)) : h
}
y._ = function(a) {
  for(var a = K(a), b = 0;;) {
    if(u(a)) {
      a = N(a), b += 1
    }else {
      return b
    }
  }
};
C._ = function(a, b) {
  return a === b
};
function O(a) {
  return u(a) ? l : g
}
var Wa = function() {
  var a = h, b = function() {
    function b(a, c, k) {
      var j = h;
      r(k) && (j = J(Array.prototype.slice.call(arguments, 2)));
      return e.call(this, a, c, j)
    }
    function e(b, c, e) {
      for(;;) {
        if(u(e)) {
          b = a.call(h, b, c), c = L(e), e = N(e)
        }else {
          return a.call(h, b, c)
        }
      }
    }
    b.e = 2;
    b.c = function(a) {
      var b = L(a), c = L(N(a)), a = M(N(a));
      return e.call(this, b, c, a)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return z(a, e);
      default:
        return b.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  a.e = 2;
  a.c = b.c;
  a.a = function(a, b) {
    return z(a, b)
  };
  a.b = b;
  return a
}();
function Xa(a) {
  return y(a)
}
var P = function() {
  function a(a, b, c) {
    return A.b(a, Math.floor(b), c)
  }
  function b(a, b) {
    return A.a(a, Math.floor(b))
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}(), Q = function() {
  function a(a, b, c) {
    return B.b(a, b, c)
  }
  function b(a, b) {
    return B.a(a, b)
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}(), Ya = function() {
  var a = h, b = function() {
    function b(a, c, k, j) {
      var q = h;
      r(j) && (q = J(Array.prototype.slice.call(arguments, 3)));
      return e.call(this, a, c, k, q)
    }
    function e(b, c, e, j) {
      for(;;) {
        if(b = a.call(h, b, c, e), u(j)) {
          c = L(j), e = L(N(j)), j = N(N(j))
        }else {
          return b
        }
      }
    }
    b.e = 3;
    b.c = function(a) {
      var b = L(a), c = L(N(a)), j = L(N(N(a))), a = M(N(N(a)));
      return e.call(this, b, c, j, a)
    };
    return b
  }(), a = function(a, e, f, i) {
    switch(arguments.length) {
      case 3:
        return za(a, e, f);
      default:
        return b.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  a.e = 3;
  a.c = b.c;
  a.b = function(a, b, f) {
    return za(a, b, f)
  };
  a.m = b;
  return a
}(), Za = function() {
  var a = h, b = function() {
    function b(a, c, k) {
      var j = h;
      r(k) && (j = J(Array.prototype.slice.call(arguments, 2)));
      return e.call(this, a, c, j)
    }
    function e(b, c, e) {
      for(;;) {
        if(b = a.call(h, b, c), u(e)) {
          c = L(e), e = N(e)
        }else {
          return b
        }
      }
    }
    b.e = 2;
    b.c = function(a) {
      var b = L(a), c = L(N(a)), a = M(N(a));
      return e.call(this, b, c, a)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return Ba(a, e);
      default:
        return b.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  a.e = 2;
  a.c = b.c;
  a.h = ba();
  a.a = function(a, b) {
    return Ba(a, b)
  };
  a.b = b;
  return a
}();
function $a(a, b) {
  return Ia(a, b)
}
function ab(a) {
  var b;
  u(a) ? (b = a.o, b = u(b) ? O.call(h, a.hasOwnProperty("cljs$core$IMeta$")) : b) : b = a;
  b = u(b) ? g : ua.call(h, Ga, a);
  return u(b) ? Ha(a) : h
}
var bb = function() {
  var a = h, b = function() {
    function b(a, c, k) {
      var j = h;
      r(k) && (j = J(Array.prototype.slice.call(arguments, 2)));
      return e.call(this, a, c, j)
    }
    function e(b, c, e) {
      for(;;) {
        if(b = a.call(h, b, c), u(e)) {
          c = L(e), e = N(e)
        }else {
          return b
        }
      }
    }
    b.e = 2;
    b.c = function(a) {
      var b = L(a), c = L(N(a)), a = M(N(a));
      return e.call(this, b, c, a)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return Da(a, e);
      default:
        return b.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  a.e = 2;
  a.c = b.c;
  a.h = ba();
  a.a = function(a, b) {
    return Da(a, b)
  };
  a.b = b;
  return a
}();
function cb(a) {
  return D(a)
}
function db(a) {
  if(a === h) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.ja, b = u(b) ? O.call(h, a.hasOwnProperty("cljs$core$ISet$")) : b) : b = a;
    a = u(b) ? g : ua.call(h, Ca, a)
  }
  return a
}
function eb(a) {
  if(a === h) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.U, b = u(b) ? O.call(h, a.hasOwnProperty("cljs$core$IMap$")) : b) : b = a;
    a = u(b) ? g : ua.call(h, Aa, a)
  }
  return a
}
function fb(a) {
  var b;
  u(a) ? (b = a.ka, b = u(b) ? O.call(h, a.hasOwnProperty("cljs$core$IVector$")) : b) : b = a;
  return u(b) ? g : ua.call(h, Ea, a)
}
function gb(a) {
  var b = [];
  la.call(h, a, function(a, e) {
    return b.push(e)
  });
  return b
}
var hb = {};
function ib(a) {
  if(a === h) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.V, b = u(b) ? O.call(h, a.hasOwnProperty("cljs$core$ISeq$")) : b) : b = a;
    a = u(b) ? g : ua.call(h, va, a)
  }
  return a
}
function jb(a) {
  return u(a) ? g : l
}
function kb(a) {
  var b = ca.call(h, a);
  return u(b) ? C(a.charAt(0), "\ufdd0") : b
}
function lb(a) {
  var b = ca.call(h, a);
  return u(b) ? C(a.charAt(0), "\ufdd1") : b
}
function mb(a, b) {
  return B.b(a, b, hb) === hb ? l : g
}
var R = function() {
  function a(a, b, c) {
    return Ja.b(c, a, b)
  }
  function b(a, b) {
    return Ja.a(b, a)
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}(), nb = function() {
  function a(a, b, c) {
    for(c = K(c);;) {
      if(u(c)) {
        b = a.call(h, b, L(c)), c = N(c)
      }else {
        return b
      }
    }
  }
  function b(a, b) {
    var c = K(b);
    return u(c) ? R.b(a, L(c), N(c)) : a.call(h)
  }
  var c = h, c = function(c, f, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 3:
        return a.call(this, c, f, i)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.b = a;
  return c
}();
Ja._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return nb.a(b, a);
      case 3:
        return nb.b(b, c, a)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
var ob = function() {
  function a(a) {
    return a * c.call(h)
  }
  function b() {
    return Math.random.call(h)
  }
  var c = h, c = function(c) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, c)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.T = b;
  c.h = a;
  return c
}();
function pb(a, b) {
  for(var c = b, e = K(a);;) {
    var f = e;
    if(u(u(f) ? 0 < c : f)) {
      c -= 1, e = N(e)
    }else {
      return e
    }
  }
}
A._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var e;
        var f = pb(a, b);
        u(f) ? e = L(f) : d(Error("Index out of bounds"));
        return e;
      case 3:
        return e = pb(a, b), u(e) ? L(e) : c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
var qb = function() {
  function a(a) {
    return a === h ? "" : a.toString()
  }
  var b = h, c = function() {
    function a(b, e) {
      var j = h;
      r(e) && (j = J(Array.prototype.slice.call(arguments, 1)));
      return c.call(this, b, j)
    }
    function c(a, e) {
      return function(a, c) {
        for(;;) {
          if(u(c)) {
            var e = a.append(b.call(h, L(c))), f = N(c), a = e, c = f
          }else {
            return b.call(h, a)
          }
        }
      }.call(h, new ta(b.call(h, a)), e)
    }
    a.e = 1;
    a.c = function(a) {
      var b = L(a), a = M(a);
      return c.call(this, b, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return a.call(this, b);
      default:
        return c.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  b.e = 1;
  b.c = c.c;
  b.T = n("");
  b.h = a;
  b.a = c;
  return b
}(), S = function() {
  function a(a) {
    return u(lb(a)) ? a.substring(2, a.length) : u(kb(a)) ? qb(":", a.substring(2, a.length)) : a === h ? "" : a.toString()
  }
  var b = h, c = function() {
    function a(b, e) {
      var j = h;
      r(e) && (j = J(Array.prototype.slice.call(arguments, 1)));
      return c.call(this, b, j)
    }
    function c(a, e) {
      return function(a, c) {
        for(;;) {
          if(u(c)) {
            var e = a.append(b.call(h, L(c))), f = N(c), a = e, c = f
          }else {
            return qb.h(a)
          }
        }
      }.call(h, new ta(b.call(h, a)), e)
    }
    a.e = 1;
    a.c = function(a) {
      var b = L(a), a = M(a);
      return c.call(this, b, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return a.call(this, b);
      default:
        return c.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  b.e = 1;
  b.c = c.c;
  b.T = n("");
  b.h = a;
  b.a = c;
  return b
}(), rb = function() {
  var a = h, a = function(a, c, e) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, e)
    }
    d("Invalid arity: " + arguments.length)
  };
  a.a = function(a, c) {
    return a.substring(c)
  };
  a.b = function(a, c, e) {
    return a.substring(c, e)
  };
  return a
}();
function Ta(a, b) {
  var c;
  u(b) ? (c = b.R, c = u(c) ? O.call(h, b.hasOwnProperty("cljs$core$ISequential$")) : c) : c = b;
  c = u(c) ? g : ua.call(h, La, b);
  if(u(c)) {
    a: {
      c = K(a);
      for(var e = K(b);;) {
        if(c === h) {
          c = e === h;
          break a
        }
        if(e !== h && u(Qa(L(c), L(e)))) {
          c = N(c), e = N(e)
        }else {
          c = l;
          break a
        }
      }
      c = aa
    }
  }else {
    c = h
  }
  return jb(c)
}
function G(a) {
  return R.b(function(a, c) {
    var e = D(c);
    return a ^ e + 2654435769 + (a << 6) + (a >> 2)
  }, cb(L(a)), N(a))
}
function sb(a, b, c, e) {
  this.f = a;
  this.W = b;
  this.S = c;
  this.w = e
}
o = sb.prototype;
o.k = function(a) {
  return G(a)
};
o.R = g;
o.n = function(a, b) {
  return new sb(this.f, b, a, this.w + 1)
};
o.r = ba();
o.v = m("w");
o.V = g;
o.P = m("W");
o.Q = m("S");
o.j = function(a, b) {
  return Ta(a, b)
};
o.t = function(a, b) {
  return new sb(b, this.W, this.S, this.w)
};
o.o = g;
o.p = m("f");
function tb(a) {
  this.f = a
}
o = tb.prototype;
o.k = function(a) {
  return G(a)
};
o.R = g;
o.n = function(a, b) {
  return new sb(this.f, b, h, 1)
};
o.r = n(h);
o.v = n(0);
o.V = g;
o.P = n(h);
o.Q = n(h);
o.j = function(a, b) {
  return Ta(a, b)
};
o.t = function(a, b) {
  return new tb(b)
};
o.o = g;
o.p = m("f");
var ub = new tb(h), F = function() {
  function a(a) {
    var c = h;
    r(a) && (c = J(Array.prototype.slice.call(arguments, 0)));
    return R.b(Wa, ub, R.b(Wa, ub, c))
  }
  a.e = 0;
  a.c = function(a) {
    a = K(a);
    return R.b(Wa, ub, R.b(Wa, ub, a))
  };
  return a
}();
function vb(a, b, c) {
  this.f = a;
  this.W = b;
  this.S = c
}
o = vb.prototype;
o.r = ba();
o.k = function(a) {
  return G(a)
};
o.j = function(a, b) {
  return Ta(a, b)
};
o.R = g;
o.n = function(a, b) {
  return new vb(h, b, a)
};
o.V = g;
o.P = m("W");
o.Q = function() {
  return this.S === h ? ub : this.S
};
o.o = g;
o.p = m("f");
o.t = function(a, b) {
  return new vb(b, this.W, this.S)
};
function I(a, b) {
  return new vb(h, a, b)
}
Ja.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return Ra.a(a, b);
      case 3:
        return Ra.b(a, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
B.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return A.a(a, b);
      case 3:
        return A.b(a, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
A.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b < y(a) ? a.charAt(b) : h;
      case 3:
        return b < y(a) ? a.charAt(b) : c
    }
    d("Invalid arity: " + arguments.length)
  }
}();
y.string = function(a) {
  return a.length
};
Ka.string = function(a) {
  return Ua(a)
};
D.string = function(a) {
  return ka.call(h, a)
};
String.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return Q.a(b, this.toString());
      case 3:
        return Q.b(b, this.toString(), c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
String.prototype.apply = function(a, b) {
  return 2 > y(b) ? Q.a(b[0], a) : Q.b(b[0], a, b[1])
};
function wb(a) {
  var b = a.x;
  if(u(a.ea)) {
    return b
  }
  a.x = b.call(h);
  a.ea = g;
  return a.x
}
function T(a, b, c) {
  this.f = a;
  this.ea = b;
  this.x = c
}
o = T.prototype;
o.r = function(a) {
  return K(wb(a))
};
o.k = function(a) {
  return G(a)
};
o.j = function(a, b) {
  return Ta(a, b)
};
o.R = g;
o.n = function(a, b) {
  return I(b, a)
};
o.V = g;
o.P = function(a) {
  return L(wb(a))
};
o.Q = function(a) {
  return M(wb(a))
};
o.o = g;
o.p = m("f");
o.t = function(a, b) {
  return new T(b, this.ea, this.x)
};
function xb(a) {
  for(var b = [];;) {
    if(u(K(a))) {
      b.push(L(a)), a = N(a)
    }else {
      return b
    }
  }
}
function yb(a, b) {
  for(var c = a, e = b, f = 0;;) {
    var i;
    i = (i = 0 < e) ? K(c) : i;
    if(u(i)) {
      c = N(c), e -= 1, f += 1
    }else {
      return f
    }
  }
}
var Ab = function zb(b) {
  return b === h ? h : N(b) === h ? K(L(b)) : I(L(b), zb.call(h, N(b)))
}, U = function() {
  function a(a, b) {
    return new T(h, l, function() {
      var c = K(a);
      return u(c) ? I(L(c), e.call(h, M(c), b)) : b
    })
  }
  function b(a) {
    return new T(h, l, function() {
      return a
    })
  }
  function c() {
    return new T(h, l, n(h))
  }
  var e = h, f = function() {
    function a(c, e, f) {
      var i = h;
      r(f) && (i = J(Array.prototype.slice.call(arguments, 2)));
      return b.call(this, c, e, i)
    }
    function b(a, c, f) {
      return function H(a, b) {
        return new T(h, l, function() {
          var c = K(a);
          return u(c) ? I(L(c), H.call(h, M(c), b)) : u(b) ? H.call(h, L(b), N(b)) : h
        })
      }.call(h, e.call(h, a, c), f)
    }
    a.e = 2;
    a.c = function(a) {
      var c = L(a), e = L(N(a)), a = M(N(a));
      return b.call(this, c, e, a)
    };
    return a
  }(), e = function(e, k, j) {
    switch(arguments.length) {
      case 0:
        return c.call(this);
      case 1:
        return b.call(this, e);
      case 2:
        return a.call(this, e, k);
      default:
        return f.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  e.e = 2;
  e.c = f.c;
  e.T = c;
  e.h = b;
  e.a = a;
  e.b = f;
  return e
}(), Bb = function() {
  function a(a, b, c, e) {
    return I(a, I(b, I(c, e)))
  }
  function b(a, b, c) {
    return I(a, I(b, c))
  }
  var c = h, e = function() {
    function a(b, c, e, f, s) {
      var t = h;
      r(s) && (t = J(Array.prototype.slice.call(arguments, 4)));
      return I(b, I(c, I(e, I(f, Ab(t)))))
    }
    a.e = 4;
    a.c = function(a) {
      var b = L(a), c = L(N(a)), e = L(N(N(a))), f = L(N(N(N(a)))), a = M(N(N(N(a))));
      return I(b, I(c, I(e, I(f, Ab(a)))))
    };
    return a
  }(), c = function(c, i, k, j, q) {
    switch(arguments.length) {
      case 1:
        return K(c);
      case 2:
        return I(c, i);
      case 3:
        return b.call(this, c, i, k);
      case 4:
        return a.call(this, c, i, k, j);
      default:
        return e.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.e = 4;
  c.c = e.c;
  c.h = function(a) {
    return K(a)
  };
  c.a = function(a, b) {
    return I(a, b)
  };
  c.b = b;
  c.m = a;
  c.Y = e;
  return c
}(), V = function() {
  function a(a, b, c, e, f) {
    b = Bb.m(b, c, e, f);
    c = a.e;
    return u(a.c) ? yb(b, c) <= c ? a.apply(a, xb(b)) : a.c(b) : a.apply(a, xb(b))
  }
  function b(a, b, c, e) {
    b = Bb.b(b, c, e);
    c = a.e;
    return u(a.c) ? yb(b, c) <= c ? a.apply(a, xb(b)) : a.c(b) : a.apply(a, xb(b))
  }
  function c(a, b, c) {
    b = Bb.a(b, c);
    c = a.e;
    return u(a.c) ? yb(b, c) <= c ? a.apply(a, xb(b)) : a.c(b) : a.apply(a, xb(b))
  }
  function e(a, b) {
    var c = a.e;
    return u(a.c) ? yb(b, c + 1) <= c ? a.apply(a, xb(b)) : a.c(b) : a.apply(a, xb(b))
  }
  var f = h, i = function() {
    function a(c, e, f, i, k, ia) {
      var Va = h;
      r(ia) && (Va = J(Array.prototype.slice.call(arguments, 5)));
      return b.call(this, c, e, f, i, k, Va)
    }
    function b(a, c, e, f, i, j) {
      c = I(c, I(e, I(f, I(i, Ab(j)))));
      e = a.e;
      return u(a.c) ? yb(c, e) <= e ? a.apply(a, xb(c)) : a.c(c) : a.apply(a, xb(c))
    }
    a.e = 5;
    a.c = function(a) {
      var c = L(a), e = L(N(a)), f = L(N(N(a))), i = L(N(N(N(a)))), k = L(N(N(N(N(a))))), a = M(N(N(N(N(a)))));
      return b.call(this, c, e, f, i, k, a)
    };
    return a
  }(), f = function(f, j, q, s, t, H) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, j);
      case 3:
        return c.call(this, f, j, q);
      case 4:
        return b.call(this, f, j, q, s);
      case 5:
        return a.call(this, f, j, q, s, t);
      default:
        return i.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  f.e = 5;
  f.c = i.c;
  f.a = e;
  f.b = c;
  f.m = b;
  f.Y = a;
  f.ha = i;
  return f
}();
function Cb(a) {
  return u(K(a)) ? a : h
}
function Db(a, b) {
  for(;;) {
    if(K(b) === h) {
      return g
    }
    if(u(a.call(h, L(b)))) {
      var c = a, e = N(b), a = c, b = e
    }else {
      return l
    }
  }
}
function Eb(a) {
  return a
}
var W = function() {
  function a(a, b, c, f) {
    return new T(h, l, function() {
      var s = K(b), t = K(c), H = K(f);
      return u(u(s) ? u(t) ? H : t : s) ? I(a.call(h, L(s), L(t), L(H)), e.call(h, a, M(s), M(t), M(H))) : h
    })
  }
  function b(a, b, c) {
    return new T(h, l, function() {
      var f = K(b), s = K(c);
      return u(u(f) ? s : f) ? I(a.call(h, L(f), L(s)), e.call(h, a, M(f), M(s))) : h
    })
  }
  function c(a, b) {
    return new T(h, l, function() {
      var c = K(b);
      return u(c) ? I(a.call(h, L(c)), e.call(h, a, M(c))) : h
    })
  }
  var e = h, f = function() {
    function a(c, e, f, i, H) {
      var w = h;
      r(H) && (w = J(Array.prototype.slice.call(arguments, 4)));
      return b.call(this, c, e, f, i, w)
    }
    function b(a, c, f, i, k) {
      return e.call(h, function(b) {
        return V.a(a, b)
      }, function ia(a) {
        return new T(h, l, function() {
          var b = e.call(h, K, a);
          return u(Db(Eb, b)) ? I(e.call(h, L, b), ia.call(h, e.call(h, M, b))) : h
        })
      }.call(h, Wa(k, i, f, c)))
    }
    a.e = 4;
    a.c = function(a) {
      var c = L(a), e = L(N(a)), f = L(N(N(a))), i = L(N(N(N(a)))), a = M(N(N(N(a))));
      return b.call(this, c, e, f, i, a)
    };
    return a
  }(), e = function(e, k, j, q, s) {
    switch(arguments.length) {
      case 2:
        return c.call(this, e, k);
      case 3:
        return b.call(this, e, k, j);
      case 4:
        return a.call(this, e, k, j, q);
      default:
        return f.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  e.e = 4;
  e.c = f.c;
  e.a = c;
  e.b = b;
  e.m = a;
  e.Y = f;
  return e
}(), Gb = function Fb(b, c) {
  return new T(h, l, function() {
    if(0 < b) {
      var e = K(c);
      return u(e) ? I(L(e), Fb.call(h, b - 1, M(e))) : h
    }
    return h
  })
};
function Hb(a, b) {
  function c(a, b) {
    for(;;) {
      var c = K(b), k = 0 < a;
      if(u(k ? c : k)) {
        k = a - 1, c = M(c), a = k, b = c
      }else {
        return c
      }
    }
  }
  return new T(h, l, function() {
    return c.call(h, a, b)
  })
}
var Ib = function() {
  function a(a, b) {
    return Gb(a, c.call(h, b))
  }
  function b(a) {
    return new T(h, l, function() {
      return I(a, c.call(h, a))
    })
  }
  var c = h, c = function(c, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return a.call(this, c, f)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.h = b;
  c.a = a;
  return c
}(), Jb = function() {
  function a(a, c) {
    return new T(h, l, function() {
      var i = K(a), k = K(c);
      return u(u(i) ? k : i) ? I(L(i), I(L(k), b.call(h, M(i), M(k)))) : h
    })
  }
  var b = h, c = function() {
    function a(b, e, j) {
      var q = h;
      r(j) && (q = J(Array.prototype.slice.call(arguments, 2)));
      return c.call(this, b, e, q)
    }
    function c(a, e, f) {
      return new T(h, l, function() {
        var c = W.a(K, Wa(f, e, a));
        return u(Db(Eb, c)) ? U.a(W.a(L, c), V.a(b, W.a(M, c))) : h
      })
    }
    a.e = 2;
    a.c = function(a) {
      var b = L(a), e = L(N(a)), a = M(N(a));
      return c.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, i) {
    switch(arguments.length) {
      case 2:
        return a.call(this, b, f);
      default:
        return c.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  b.e = 2;
  b.c = c.c;
  b.a = a;
  b.b = c;
  return b
}();
function Kb(a, b) {
  return Hb(1, Jb.a(Ib.h(a), b))
}
function Lb(a) {
  return function c(a, f) {
    return new T(h, l, function() {
      var i = K(a);
      return u(i) ? I(L(i), c.call(h, M(i), f)) : u(K(f)) ? c.call(h, L(f), M(f)) : h
    })
  }.call(h, h, a)
}
var Mb = function() {
  function a(a, b) {
    return Lb(W.a(a, b))
  }
  var b = h, c = function() {
    function a(b, c, e) {
      var j = h;
      r(e) && (j = J(Array.prototype.slice.call(arguments, 2)));
      return Lb(V.m(W, b, c, j))
    }
    a.e = 2;
    a.c = function(a) {
      var b = L(a), c = L(N(a)), a = M(N(a));
      return Lb(V.m(W, b, c, a))
    };
    return a
  }(), b = function(b, f, i) {
    switch(arguments.length) {
      case 2:
        return a.call(this, b, f);
      default:
        return c.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  b.e = 2;
  b.c = c.c;
  b.a = a;
  b.b = c;
  return b
}();
function Nb(a, b) {
  return R.b(z, a, b)
}
var Ob = function() {
  function a(a, b, c, j) {
    return new T(h, l, function() {
      var q = K(j);
      if(u(q)) {
        var s = Gb(a, q);
        return u(Qa(a, y(s))) ? I(s, e.call(h, a, b, c, Hb(b, q))) : F(Gb(a, U.a(s, c)))
      }
      return h
    })
  }
  function b(a, b, c) {
    return new T(h, l, function() {
      var j = K(c);
      if(u(j)) {
        var q = Gb(a, j);
        return u(Qa(a, y(q))) ? I(q, e.call(h, a, b, Hb(b, j))) : h
      }
      return h
    })
  }
  function c(a, b) {
    return e.call(h, a, a, b)
  }
  var e = h, e = function(e, i, k, j) {
    switch(arguments.length) {
      case 2:
        return c.call(this, e, i);
      case 3:
        return b.call(this, e, i, k);
      case 4:
        return a.call(this, e, i, k, j)
    }
    d("Invalid arity: " + arguments.length)
  };
  e.a = c;
  e.b = b;
  e.m = a;
  return e
}(), Qb = function Pb(b, c, e) {
  var f = P.call(h, c, 0, h), c = pb.call(h, c, 1);
  return u(c) ? Ya.b(b, f, Pb.call(h, Q.a(b, f), c, e)) : Ya.b(b, f, e)
};
function Rb(a) {
  a = a.i;
  return 32 > a ? 0 : a - 1 >> 5 << 5
}
function Sb(a, b) {
  for(var c = a, e = b;;) {
    if(u(C(0, c))) {
      return e
    }
    var f = x(Tb);
    f[0] = e;
    e = f;
    c -= 5
  }
}
var Vb = function Ub(b, c, e, f) {
  var i = x(e), k = b.i - 1 >> c & 31;
  u(C(5, c)) ? i[k] = f : (e = e[k], b = u(e) ? Ub.call(h, b, c - 5, e, f) : Sb(c - 5, f), i[k] = b);
  return i
}, Xb = function Wb(b, c, e, f, i) {
  var k = x(e);
  if(0 === c) {
    k[f & 31] = i
  }else {
    var j = f >> c & 31;
    k[j] = Wb.call(h, b, c - 5, e[j], f, i)
  }
  return k
};
function Yb(a, b, c, e, f) {
  this.f = a;
  this.i = b;
  this.shift = c;
  this.root = e;
  this.N = f
}
o = Yb.prototype;
o.k = function(a) {
  return G(a)
};
o.F = function(a, b) {
  return A.b(a, b, h)
};
o.G = function(a, b, c) {
  return A.b(a, b, c)
};
o.K = function(a, b, c) {
  var e = 0 <= b;
  if(e ? b < this.i : e) {
    return Rb(a) <= b ? (a = x(this.N), a[b & 31] = c, new Yb(this.f, this.i, this.shift, this.root, a)) : new Yb(this.f, this.i, this.shift, Xb(a, this.shift, this.root, b, c), this.N)
  }
  if(u(C(b, this.i))) {
    return z(a, c)
  }
  d(Error(S("Index ", b, " out of bounds  [0,", this.i, "]")))
};
o.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return B.a(this, b);
      case 3:
        return B.b(this, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
o.R = g;
o.n = function(a, b) {
  if(32 > this.i - Rb(a)) {
    var c = x(this.N);
    c.push(b);
    return new Yb(this.f, this.i + 1, this.shift, this.root, c)
  }
  var e = this.i >> 5 > 1 << this.shift, c = e ? this.shift + 5 : this.shift;
  e ? (e = x(Tb), e[0] = this.root, e[1] = Sb(this.shift, this.N)) : e = Vb(a, this.shift, this.root, this.N);
  return new Yb(this.f, this.i + 1, c, e, [b])
};
o.ca = function(a, b) {
  return Ra.a(a, b)
};
o.da = function(a, b, c) {
  return Ra.b(a, b, c)
};
o.r = function(a) {
  var b = this;
  return 0 < b.i ? function e(f) {
    return new T(h, l, function() {
      return f < b.i ? I(A.a(a, f), e.call(h, f + 1)) : h
    })
  }.call(h, 0) : h
};
o.v = m("i");
o.ka = g;
o.j = function(a, b) {
  return Ta(a, b)
};
o.t = function(a, b) {
  return new Yb(b, this.i, this.shift, this.root, this.N)
};
o.o = g;
o.p = m("f");
o.aa = function(a, b) {
  var c;
  a: {
    var e = 0 <= b;
    if(e ? b < a.i : e) {
      if(b >= Rb(a)) {
        c = a.N
      }else {
        for(var e = a.root, f = a.shift;;) {
          if(0 < f) {
            var i = f - 5, e = e[b >> f & 31], f = i
          }else {
            c = e;
            break a
          }
        }
      }
    }else {
      d(Error(S("No item ", b, " in vector of length ", a.i)))
    }
  }
  return c[b & 31]
};
o.ba = function(a, b, c) {
  var e = 0 <= b;
  return(e ? b < this.i : e) ? A.a(a, b) : c
};
var Tb = Array(32), Zb = new Yb(h, 0, 5, Tb, []);
function X(a) {
  return Nb(Zb, a)
}
function $b(a) {
  return R.b(Wa, Zb, a)
}
var Y = function() {
  function a(a) {
    var c = h;
    r(a) && (c = J(Array.prototype.slice.call(arguments, 0)));
    return $b(c)
  }
  a.e = 0;
  a.c = function(a) {
    a = K(a);
    return $b(a)
  };
  return a
}();
X([]);
function ac() {
}
ac.prototype.j = n(l);
var bc = new ac;
function cc(a, b) {
  return jb(u(eb(b)) ? u(Qa(y(a), y(b))) ? Db(Eb, W.a(function(a) {
    return Qa(Q.b(b, L(a), bc), L(N(a)))
  }, a)) : h : h)
}
function dc(a, b, c) {
  for(var e = c.length, f = 0;;) {
    if(f < e) {
      if(u(C(b, c[f]))) {
        return f
      }
      f += a
    }else {
      return h
    }
  }
}
var ec = function() {
  function a(a, b, c, k) {
    var j = ca.call(h, a);
    return u(u(j) ? b.hasOwnProperty(a) : j) ? c : k
  }
  function b(a, b) {
    return c.call(h, a, b, g, l)
  }
  var c = h, c = function(c, f, i, k) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, f);
      case 4:
        return a.call(this, c, f, i, k)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.a = b;
  c.m = a;
  return c
}();
function fc(a, b) {
  var c = D(a), e = D(b);
  return c < e ? -1 : c > e ? 1 : 0
}
function hc(a, b, c) {
  this.f = a;
  this.keys = b;
  this.I = c
}
o = hc.prototype;
o.k = function(a) {
  return G(a)
};
o.F = function(a, b) {
  return B.b(a, b, h)
};
o.G = function(a, b, c) {
  return ec.m(b, this.I, this.I[b], c)
};
o.K = function(a, b, c) {
  if(u(ca.call(h, b))) {
    var a = ma.call(h, this.I), e = a.hasOwnProperty(b);
    a[b] = c;
    if(u(e)) {
      return new hc(this.f, this.keys, a)
    }
    c = x(this.keys);
    c.push(b);
    return new hc(this.f, c, a)
  }
  return $a(Nb(E(b, c), K(a)), this.f)
};
o.$ = function(a, b) {
  return ec.a(b, this.I)
};
o.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return B.a(this, b);
      case 3:
        return B.b(this, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
o.n = function(a, b) {
  return u(fb(b)) ? za(a, A.a(b, 0), A.a(b, 1)) : R.b(z, a, b)
};
o.r = function() {
  var a = this;
  return 0 < a.keys.length ? W.a(function(b) {
    return Y(b, a.I[b])
  }, a.keys.sort(fc)) : h
};
o.v = function() {
  return this.keys.length
};
o.j = function(a, b) {
  return cc(a, b)
};
o.t = function(a, b) {
  return new hc(b, this.keys, this.I)
};
o.o = g;
o.p = m("f");
o.U = g;
o.O = function(a, b) {
  var c = ca.call(h, b);
  if(u(u(c) ? this.I.hasOwnProperty(b) : c)) {
    var c = x(this.keys), e = ma.call(h, this.I);
    c.splice(dc(1, b, c), 1);
    delete e[b];
    return new hc(this.f, c, e)
  }
  return a
};
function ic(a, b) {
  return new hc(h, a, b)
}
function jc(a, b, c) {
  this.f = a;
  this.w = b;
  this.z = c
}
o = jc.prototype;
o.k = function(a) {
  return G(a)
};
o.F = function(a, b) {
  return B.b(a, b, h)
};
o.G = function(a, b, c) {
  a = this.z[D(b)];
  b = u(a) ? dc(2, b, a) : h;
  return u(b) ? a[b + 1] : c
};
o.K = function(a, b, c) {
  var a = D(b), e = this.z[a];
  if(u(e)) {
    var e = x(e), f = ma.call(h, this.z);
    f[a] = e;
    a = dc(2, b, e);
    if(u(a)) {
      return e[a + 1] = c, new jc(this.f, this.w, f)
    }
    e.push(b, c);
    return new jc(this.f, this.w + 1, f)
  }
  e = ma.call(h, this.z);
  e[a] = [b, c];
  return new jc(this.f, this.w + 1, e)
};
o.$ = function(a, b) {
  var c = this.z[D(b)], c = u(c) ? dc(2, b, c) : h;
  return u(c) ? g : l
};
o.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return B.a(this, b);
      case 3:
        return B.b(this, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
o.n = function(a, b) {
  return u(fb(b)) ? za(a, A.a(b, 0), A.a(b, 1)) : R.b(z, a, b)
};
o.r = function() {
  var a = this;
  if(0 < a.w) {
    var b = gb(a.z).sort();
    return Mb.a(function(b) {
      return W.a($b, Ob.a(2, a.z[b]))
    }, b)
  }
  return h
};
o.v = m("w");
o.j = function(a, b) {
  return cc(a, b)
};
o.t = function(a, b) {
  return new jc(b, this.w, this.z)
};
o.o = g;
o.p = m("f");
o.U = g;
o.O = function(a, b) {
  var c = D(b), e = this.z[c], f = u(e) ? dc(2, b, e) : h;
  if(u(O(f))) {
    return a
  }
  var i = ma.call(h, this.z);
  3 > e.length ? delete i[c] : (e = x(e), e.splice(f, 2), i[c] = e);
  return new jc(this.f, this.w - 1, i)
};
var kc = new jc(h, 0, {}), E = function() {
  function a(a) {
    var e = h;
    r(a) && (e = J(Array.prototype.slice.call(arguments, 0)));
    return b.call(this, e)
  }
  function b(a) {
    for(var a = K(a), b = kc;;) {
      if(u(a)) {
        var f = N(N(a)), b = Ya.b(b, L(a), L(N(a))), a = f
      }else {
        return b
      }
    }
  }
  a.e = 0;
  a.c = function(a) {
    a = K(a);
    return b.call(this, a)
  };
  return a
}();
function lc(a, b) {
  this.f = a;
  this.X = b
}
o = lc.prototype;
o.k = function(a) {
  return G(a)
};
o.F = function(a, b) {
  return B.b(a, b, h)
};
o.G = function(a, b, c) {
  return u(ya(this.X, b)) ? b : c
};
o.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return B.a(this, b);
      case 3:
        return B.b(this, b, c)
    }
    d("Invalid arity: " + arguments.length)
  }
}();
o.n = function(a, b) {
  return new lc(this.f, Ya.b(this.X, b, h))
};
o.r = function() {
  return K(W.a(L, this.X))
};
o.ja = g;
o.fa = function(a, b) {
  return new lc(this.f, Za.a(this.X, b))
};
o.v = function(a) {
  return Xa(K(a))
};
o.j = function(a, b) {
  var c = db(b);
  return u(c) ? (c = Qa(y(a), y(b)), u(c) ? Db(function(b) {
    return mb(a, b)
  }, b) : c) : c
};
o.t = function(a, b) {
  return new lc(b, this.X)
};
o.o = g;
o.p = m("f");
var mc = new lc(h, E());
function nc(a) {
  for(var a = K(a), b = mc;;) {
    if(u(O.call(h, O(K(a))))) {
      var c = M(a), b = Wa.a(b, L(a)), a = c
    }else {
      return b
    }
  }
}
function oc(a) {
  var b = ca.call(h, a);
  u(b) && (b = C(a.charAt(0), "\ufdd0"), b = u(b) ? b : C(a.charAt(0), "\ufdd1"), b = O(b));
  if(u(b)) {
    return a
  }
  b = kb(a);
  b = u(b) ? b : lb(a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), 0 > b ? rb.a(a, 2) : rb.a(a, b + 1)
  }
  d(Error(S("Doesn't support name: ", a)))
}
function pc(a) {
  var b;
  b = kb(a);
  b = u(b) ? b : lb(a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), -1 < b ? rb.b(a, 2, b) : h
  }
  d(Error(S("Doesn't support namespace: ", a)))
}
function Z(a, b, c, e, f, i) {
  return U(X([b]), Lb(Kb(X([c]), W.a(function(b) {
    return a.call(h, b, f)
  }, i))), X([e]))
}
var $ = function qc(b, c) {
  return b === h ? F("nil") : aa === b ? F("#<undefined>") : U.a(u(function() {
    var e = Q.a(c, "\ufdd0'meta");
    return u(e) ? (u(b) ? (e = b.o, e = u(e) ? O.call(h, b.hasOwnProperty("cljs$core$IMeta$")) : e) : e = b, e = u(e) ? g : ua.call(h, Ga, b), u(e) ? ab(b) : e) : e
  }()) ? U(X(["^"]), qc.call(h, ab(b), c), X([" "])) : h, u(function() {
    var c;
    u(b) ? (c = b.q, c = u(c) ? O.call(h, b.hasOwnProperty("cljs$core$IPrintable$")) : c) : c = b;
    return u(c) ? g : ua.call(h, Ma, b)
  }()) ? Na(b, c) : F("#<", S.h(b), ">"))
};
function rc(a) {
  var b = ic(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":g, "\ufdd0'readably":g, "\ufdd0'meta":l, "\ufdd0'dup":l}), c = L(a), e = new ta, a = K.call(h, a);
  if(u(a)) {
    for(var f = L.call(h, a);;) {
      f !== c && e.append(" ");
      var i = K.call(h, $(f, b));
      if(u(i)) {
        for(f = L.call(h, i);;) {
          if(e.append(f), f = N.call(h, i), u(f)) {
            i = f, f = L.call(h, i)
          }else {
            break
          }
        }
      }
      a = N.call(h, a);
      if(u(a)) {
        f = a, a = L.call(h, f), i = f, f = a, a = i
      }else {
        break
      }
    }
  }
  return e
}
var sc = function() {
  function a(a) {
    var c = h;
    r(a) && (c = J(Array.prototype.slice.call(arguments, 0)));
    return S.h(rc(c))
  }
  a.e = 0;
  a.c = function(a) {
    a = K(a);
    return S.h(rc(a))
  };
  return a
}();
jc.prototype.q = g;
jc.prototype.l = function(a, b) {
  return Z(function(a) {
    return Z($, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
Ma.number = g;
Na.number = function(a) {
  return F(S.h(a))
};
Sa.prototype.q = g;
Sa.prototype.l = function(a, b) {
  return Z($, "(", " ", ")", b, a)
};
T.prototype.q = g;
T.prototype.l = function(a, b) {
  return Z($, "(", " ", ")", b, a)
};
Ma["boolean"] = g;
Na["boolean"] = function(a) {
  return F(S.h(a))
};
lc.prototype.q = g;
lc.prototype.l = function(a, b) {
  return Z($, "#{", " ", "}", b, a)
};
Ma.string = g;
Na.string = function(a, b) {
  return u(kb(a)) ? F(S(":", function() {
    var b = pc(a);
    return u(b) ? S(b, "/") : h
  }(), oc(a))) : u(lb(a)) ? F(S(function() {
    var b = pc(a);
    return u(b) ? S(b, "/") : h
  }(), oc(a))) : F(u("\ufdd0'readably".call(h, b)) ? ja.call(h, a) : a)
};
Yb.prototype.q = g;
Yb.prototype.l = function(a, b) {
  return Z($, "[", " ", "]", b, a)
};
sb.prototype.q = g;
sb.prototype.l = function(a, b) {
  return Z($, "(", " ", ")", b, a)
};
Ma.array = g;
Na.array = function(a, b) {
  return Z($, "#<Array [", ", ", "]>", b, a)
};
Ma["function"] = g;
Na["function"] = function(a) {
  return F("#<", S.h(a), ">")
};
tb.prototype.q = g;
tb.prototype.l = function() {
  return F("()")
};
vb.prototype.q = g;
vb.prototype.l = function(a, b) {
  return Z($, "(", " ", ")", b, a)
};
hc.prototype.q = g;
hc.prototype.l = function(a, b) {
  return Z(function(a) {
    return Z($, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
function tc(a, b, c, e) {
  this.state = a;
  this.f = b;
  this.ma = c;
  this.na = e
}
o = tc.prototype;
o.k = function(a) {
  return da.call(h, a)
};
o.ga = function(a, b, c) {
  var e = K.call(h, this.na);
  if(u(e)) {
    var f = L.call(h, e);
    P.call(h, f, 0, h);
    for(P.call(h, f, 1, h);;) {
      var i = f, f = P.call(h, i, 0, h), i = P.call(h, i, 1, h);
      i.call(h, f, a, b, c);
      e = N.call(h, e);
      if(u(e)) {
        f = e, e = L.call(h, f), i = f, f = e, e = i
      }else {
        return h
      }
    }
  }else {
    return h
  }
};
o.q = g;
o.l = function(a, b) {
  return U(X(["#<Atom: "]), Na(this.state, b), ">")
};
o.o = g;
o.p = m("f");
o.ia = m("state");
o.j = function(a, b) {
  return a === b
};
var uc = function() {
  function a(a) {
    return new tc(a, h, h, h)
  }
  var b = h, c = function() {
    function a(c, e) {
      var j = h;
      r(e) && (j = J(Array.prototype.slice.call(arguments, 1)));
      return b.call(this, c, j)
    }
    function b(a, c) {
      var e = u(ib.call(h, c)) ? V.call(h, E, c) : c, f = Q.call(h, e, "\ufdd0'validator"), e = Q.call(h, e, "\ufdd0'meta");
      return new tc(a, e, f, h)
    }
    a.e = 1;
    a.c = function(a) {
      var c = L(a), a = M(a);
      return b.call(this, c, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      default:
        return c.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  b.e = 1;
  b.c = c.c;
  b.h = a;
  b.a = c;
  return b
}();
function vc(a, b) {
  var c = a.ma;
  u(c) && !u(c.call(h, b)) && d(Error(S.call(h, "Assert failed: ", "Validator rejected reference state", "\n", sc.call(h, $a(F("\ufdd1'validate", "\ufdd1'new-value"), E("\ufdd0'line", 3282))))));
  c = a.state;
  a.state = b;
  Oa(a, c, b);
  return b
}
var wc = function() {
  function a(a, b, c, e, f) {
    return vc(a, b.call(h, a.state, c, e, f))
  }
  function b(a, b, c, e) {
    return vc(a, b.call(h, a.state, c, e))
  }
  function c(a, b, c) {
    return vc(a, b.call(h, a.state, c))
  }
  function e(a, b) {
    return vc(a, b.call(h, a.state))
  }
  var f = h, i = function() {
    function a(b, c, e, f, i, k) {
      var ia = h;
      r(k) && (ia = J(Array.prototype.slice.call(arguments, 5)));
      return vc(b, V(c, b.state, e, f, i, ia))
    }
    a.e = 5;
    a.c = function(a) {
      var b = L(a), c = L(N(a)), e = L(N(N(a))), f = L(N(N(N(a)))), i = L(N(N(N(N(a))))), a = M(N(N(N(N(a)))));
      return vc(b, V(c, b.state, e, f, i, a))
    };
    return a
  }(), f = function(f, j, q, s, t, H) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, j);
      case 3:
        return c.call(this, f, j, q);
      case 4:
        return b.call(this, f, j, q, s);
      case 5:
        return a.call(this, f, j, q, s, t);
      default:
        return i.apply(this, arguments)
    }
    d("Invalid arity: " + arguments.length)
  };
  f.e = 5;
  f.c = i.c;
  f.a = e;
  f.b = c;
  f.m = b;
  f.Y = a;
  f.ha = i;
  return f
}();
function xc(a) {
  return Fa(a)
}
ob = function() {
  function a(a) {
    return Math.random() * a
  }
  function b() {
    return c.call(h, 1)
  }
  var c = h, c = function(c) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, c)
    }
    d("Invalid arity: " + arguments.length)
  };
  c.T = b;
  c.h = a;
  return c
}();
uc.h(ic(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":ic([], {}), "\ufdd0'descendants":ic([], {}), "\ufdd0'ancestors":ic([], {})}));
var yc = uc.h(nc([])), zc = uc.h(h), Ac = Math.PI, Bc = 2 * Ac, Cc = Ac / 2;
function Dc(a) {
  for(;;) {
    if(function() {
      var b = 0 === a;
      return b ? b : a === Bc
    }()) {
      return 0
    }
    if(function() {
      var b = Bc > a;
      return b ? 0 < a : b
    }()) {
      return a
    }
    a > Bc ? a -= Bc : 0 > a ? a += Bc : d("huh?")
  }
}
function Ec(a) {
  var b = Dc(a);
  return function() {
    var a = 0 <= b;
    return a ? b <= Cc : a
  }() ? X([g, g]) : function() {
    var a = Cc <= b;
    return a ? b <= Ac : a
  }() ? X([g, l]) : function() {
    var a = Ac <= b;
    return a ? b <= 3 * Cc : a
  }() ? X([l, l]) : X([l, g])
}
var Fc = function() {
  var a = window.ra;
  if(u(a)) {
    return a
  }
  a = window.sa;
  if(u(a)) {
    return a
  }
  a = window.oa;
  if(u(a)) {
    return a
  }
  a = window.qa;
  if(u(a)) {
    return a
  }
  a = window.pa;
  return u(a) ? a : function(a) {
    return setTimeout.call(h, a, 17)
  }
}(), Gc = document.getElementById("screen"), Hc = document.getElementById("fps"), Ic = Math.ceil.call(h, 180), Jc = 360 / Math.tan.call(h, 60 * (Math.PI / 180) / 2), Kc;
a: {
  for(var Lc = 0, Mc = X([]);;) {
    if(720 < Lc) {
      Kc = Mc;
      break a
    }
    var Nc = document.createElement("div"), Oc = new Image, Pc = Nc.style;
    Pc.position = "absolute";
    Pc.left = S(Lc, "px");
    Pc.width = S(4, "px");
    Pc.overflow = "hidden";
    var Qc = Oc.style;
    Qc.position = "absolute";
    Qc.left = "0px";
    Oc.src = "res/wall3.png";
    Nc.la = Oc;
    Nc.appendChild(Oc);
    Gc.appendChild(Nc);
    var Rc = Lc + 4, Sc = Wa.a(Mc, Nc), Lc = Rc, Mc = Sc
  }
  Kc = aa
}
function Tc(a, b, c, e, f, i, k) {
  this.x = a;
  this.y = b;
  this.B = c;
  this.A = e;
  this.C = f;
  this.g = i;
  this.d = k;
  5 < arguments.length ? (this.g = i, this.d = k) : this.d = this.g = h
}
o = Tc.prototype;
o.k = function(a) {
  return G.call(h, a)
};
o.F = function(a, b) {
  return B.call(h, a, b, h)
};
o.G = function(a, b, c) {
  return"\ufdd0'x" === b ? this.x : "\ufdd0'y" === b ? this.y : "\ufdd0'rot" === b ? this.B : "\ufdd0'move-speed" === b ? this.A : "\ufdd0'rot-speed" === b ? this.C : Q.call(h, this.d, b, c)
};
o.K = function(a, b, c) {
  return u(Pa.call(h, "\ufdd0'x", b)) ? new Tc(c, this.y, this.B, this.A, this.C, this.g, this.d) : u(Pa.call(h, "\ufdd0'y", b)) ? new Tc(this.x, c, this.B, this.A, this.C, this.g, this.d) : u(Pa.call(h, "\ufdd0'rot", b)) ? new Tc(this.x, this.y, c, this.A, this.C, this.g, this.d) : u(Pa.call(h, "\ufdd0'move-speed", b)) ? new Tc(this.x, this.y, this.B, c, this.C, this.g, this.d) : u(Pa.call(h, "\ufdd0'rot-speed", b)) ? new Tc(this.x, this.y, this.B, this.A, c, this.g, this.d) : new Tc(this.x, this.y, 
  this.B, this.A, this.C, this.g, Ya.call(h, this.d, b, c))
};
o.n = function(a, b) {
  return u(fb.call(h, b)) ? za.call(h, a, A.call(h, b, 0), A.call(h, b, 1)) : R.call(h, z, a, b)
};
o.r = function() {
  return K.call(h, U.call(h, X([Y.call(h, "\ufdd0'x", this.x), Y.call(h, "\ufdd0'y", this.y), Y.call(h, "\ufdd0'rot", this.B), Y.call(h, "\ufdd0'move-speed", this.A), Y.call(h, "\ufdd0'rot-speed", this.C)]), this.d))
};
o.q = g;
o.l = function(a, b) {
  return Z.call(h, function(a) {
    return Z.call(h, $, "", " ", "", b, a)
  }, S.call(h, "#", "argh.core.Player", "{"), ", ", "}", b, U.call(h, X([Y.call(h, "\ufdd0'x", this.x), Y.call(h, "\ufdd0'y", this.y), Y.call(h, "\ufdd0'rot", this.B), Y.call(h, "\ufdd0'move-speed", this.A), Y.call(h, "\ufdd0'rot-speed", this.C)]), this.d))
};
o.v = function() {
  return 5 + Xa.call(h, this.d)
};
o.j = function(a, b) {
  var c = a.constructor === b.constructor;
  return c ? cc.call(h, a, b) : c
};
o.t = function(a, b) {
  return new Tc(this.x, this.y, this.B, this.A, this.C, b, this.d)
};
o.o = g;
o.p = m("g");
o.U = g;
o.O = function(a, b) {
  return u(mb.call(h, nc(["\ufdd0'y", "\ufdd0'x", "\ufdd0'rot", "\ufdd0'rot-speed", "\ufdd0'move-speed"]), b)) ? Za.call(h, $a.call(h, Nb.call(h, ic([], {}), a), this.g), b) : new Tc(this.x, this.y, this.B, this.A, this.C, this.g, Cb.call(h, Za.call(h, this.d, b)))
};
function Uc(a, b, c, e, f) {
  this.J = a;
  this.H = b;
  this.data = c;
  this.g = e;
  this.d = f;
  3 < arguments.length ? (this.g = e, this.d = f) : this.d = this.g = h
}
o = Uc.prototype;
o.k = function(a) {
  return G.call(h, a)
};
o.F = function(a, b) {
  return B.call(h, a, b, h)
};
o.G = function(a, b, c) {
  return"\ufdd0'w" === b ? this.J : "\ufdd0'h" === b ? this.H : "\ufdd0'data" === b ? this.data : Q.call(h, this.d, b, c)
};
o.K = function(a, b, c) {
  return u(Pa.call(h, "\ufdd0'w", b)) ? new Uc(c, this.H, this.data, this.g, this.d) : u(Pa.call(h, "\ufdd0'h", b)) ? new Uc(this.J, c, this.data, this.g, this.d) : u(Pa.call(h, "\ufdd0'data", b)) ? new Uc(this.J, this.H, c, this.g, this.d) : new Uc(this.J, this.H, this.data, this.g, Ya.call(h, this.d, b, c))
};
o.n = function(a, b) {
  return u(fb.call(h, b)) ? za.call(h, a, A.call(h, b, 0), A.call(h, b, 1)) : R.call(h, z, a, b)
};
o.r = function() {
  return K.call(h, U.call(h, X([Y.call(h, "\ufdd0'w", this.J), Y.call(h, "\ufdd0'h", this.H), Y.call(h, "\ufdd0'data", this.data)]), this.d))
};
o.q = g;
o.l = function(a, b) {
  return Z.call(h, function(a) {
    return Z.call(h, $, "", " ", "", b, a)
  }, S.call(h, "#", "argh.core.Level", "{"), ", ", "}", b, U.call(h, X([Y.call(h, "\ufdd0'w", this.J), Y.call(h, "\ufdd0'h", this.H), Y.call(h, "\ufdd0'data", this.data)]), this.d))
};
o.v = function() {
  return 3 + Xa.call(h, this.d)
};
o.j = function(a, b) {
  var c = a.constructor === b.constructor;
  return c ? cc.call(h, a, b) : c
};
o.t = function(a, b) {
  return new Uc(this.J, this.H, this.data, b, this.d)
};
o.o = g;
o.p = m("g");
o.U = g;
o.O = function(a, b) {
  return u(mb.call(h, nc(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), b)) ? Za.call(h, $a.call(h, Nb.call(h, ic([], {}), a), this.g), b) : new Uc(this.J, this.H, this.data, this.g, Cb.call(h, Za.call(h, this.d, b)))
};
function Vc(a, b, c, e) {
  this.M = a;
  this.L = b;
  this.g = c;
  this.d = e;
  2 < arguments.length ? (this.g = c, this.d = e) : this.d = this.g = h
}
o = Vc.prototype;
o.k = function(a) {
  return G.call(h, a)
};
o.F = function(a, b) {
  return B.call(h, a, b, h)
};
o.G = function(a, b, c) {
  return"\ufdd0'player" === b ? this.M : "\ufdd0'level" === b ? this.L : Q.call(h, this.d, b, c)
};
o.K = function(a, b, c) {
  return u(Pa.call(h, "\ufdd0'player", b)) ? new Vc(c, this.L, this.g, this.d) : u(Pa.call(h, "\ufdd0'level", b)) ? new Vc(this.M, c, this.g, this.d) : new Vc(this.M, this.L, this.g, Ya.call(h, this.d, b, c))
};
o.n = function(a, b) {
  return u(fb.call(h, b)) ? za.call(h, a, A.call(h, b, 0), A.call(h, b, 1)) : R.call(h, z, a, b)
};
o.r = function() {
  return K.call(h, U.call(h, X([Y.call(h, "\ufdd0'player", this.M), Y.call(h, "\ufdd0'level", this.L)]), this.d))
};
o.q = g;
o.l = function(a, b) {
  return Z.call(h, function(a) {
    return Z.call(h, $, "", " ", "", b, a)
  }, S.call(h, "#", "argh.core.Game", "{"), ", ", "}", b, U.call(h, X([Y.call(h, "\ufdd0'player", this.M), Y.call(h, "\ufdd0'level", this.L)]), this.d))
};
o.v = function() {
  return 2 + Xa.call(h, this.d)
};
o.j = function(a, b) {
  var c = a.constructor === b.constructor;
  return c ? cc.call(h, a, b) : c
};
o.t = function(a, b) {
  return new Vc(this.M, this.L, b, this.d)
};
o.o = g;
o.p = m("g");
o.U = g;
o.O = function(a, b) {
  return u(mb.call(h, nc(["\ufdd0'player", "\ufdd0'level"]), b)) ? Za.call(h, $a.call(h, Nb.call(h, ic([], {}), a), this.g), b) : new Vc(this.M, this.L, this.g, Cb.call(h, Za.call(h, this.d, b)))
};
function Wc(a, b, c) {
  var a = u(ib.call(h, a)) ? V.call(h, E, a) : a, e = Q.call(h, a, "\ufdd0'player"), f = u(ib.call(h, e)) ? V.call(h, E, e) : e, e = Q.call(h, f, "\ufdd0'y"), f = Q.call(h, f, "\ufdd0'x"), i;
  var k = Q.call(h, a, "\ufdd0'level");
  i = b + f;
  var j = c + e, q = u(ib.call(h, k)) ? V.call(h, E, k) : k, k = Q.call(h, q, "\ufdd0'data"), s = Q.call(h, q, "\ufdd0'h"), q = Q.call(h, q, "\ufdd0'w"), t = O(0 > i);
  u(t) ? (t = O(0 > j), i = u(t) ? (s = s > j) ? (s = q > i) ? 0 === P.a(P.a(k, Math.floor.call(h, j)), Math.floor.call(h, i)) : s : s : t) : i = t;
  return u(i) ? Qb(Qb(a, X(["\ufdd0'player", "\ufdd0'x"]), b + f), X(["\ufdd0'player", "\ufdd0'y"]), c + e) : a
}
var Xc;
a: {
  for(var Yc = [27, 38, 40, 37, 39], Zc = ["\ufdd0'escape", "\ufdd0'up", "\ufdd0'down", "\ufdd0'left", "\ufdd0'right"], $c = Yc.length, ad = 0, bd = kc;;) {
    if(ad < $c) {
      var cd = ad + 1, dd = Ya.b(bd, Yc[ad], Zc[ad]), ad = cd, bd = dd
    }else {
      Xc = bd;
      break a
    }
  }
  Xc = aa
}
function ed() {
  for(var a = xc.call(h, zc), b = u(ib.call(h, a)) ? V.call(h, E, a) : a, a = Q.call(h, b, "\ufdd0'player"), a = u(ib.call(h, a)) ? V.call(h, E, a) : a, c = Q.call(h, a, "\ufdd0'x"), e = Q.call(h, a, "\ufdd0'y"), a = Q.call(h, a, "\ufdd0'rot"), b = Q.call(h, b, "\ufdd0'level"), b = u(ib.call(h, b)) ? V.call(h, E, b) : b, f = Q.call(h, b, "\ufdd0'data"), i = Q.call(h, b, "\ufdd0'h"), k = Q.call(h, b, "\ufdd0'w"), b = 0;;) {
    if(b < Ic) {
      var j = 4 * (b + Ic / -2), j = a + Math.asin.call(h, j / Math.sqrt.call(h, j * j + Jc * Jc)), q = function() {
        return function(a, b, j, q, s, t) {
          for(;;) {
            var w;
            w = aa;
            w = (w = 0 < a) ? a < k : w;
            u(w) && (w = (w = 0 < b) ? b < i : w);
            if(u(O.call(h, w))) {
              return X([a, b, 0, 0])
            }
            w = Math.floor.call(h, s + a);
            var H = Math.floor.call(h, t + b);
            if(0 < P.a(P.a(f, H), w)) {
              return X([a, b, (a - c) * (a - c) + (b - e) * (b - e), P.a(P.a(f, H), w), a % 1, b % 1])
            }
            b += q;
            a += j
          }
        }
      }(b), s = Ec(j), t = P.call(h, s, 0, h), s = P.call(h, s, 1, h), H = Math.tan.call(h, j), w = u(s) ? Math.ceil.call(h, c) : Math.floor.call(h, c), w = q.call(h, w, e + (w - c) * H, u(s) ? 1 : -1, (u(s) ? 1 : -1) * H, u(s) ? 0 : -1, 0);
      P.call(h, w, 0, h);
      P.call(h, w, 1, h);
      var ia = P.call(h, w, 2, h);
      P.call(h, w, 3, h);
      P.call(h, w, 4, h);
      var s = P.call(h, w, 5, h), Va = u(t) ? Math.ceil.call(h, e) : Math.floor.call(h, e), t = q.call(h, c + (Va - e) / H, Va, (u(t) ? 1 : -1) / H, u(t) ? 1 : -1, 0, u(t) ? 0 : -1);
      P.call(h, t, 0, h);
      P.call(h, t, 1, h);
      var gc = P.call(h, t, 2, h);
      P.call(h, t, 3, h);
      q = P.call(h, t, 4, h);
      P.call(h, t, 5, h);
      H = function() {
        var a = 0 === ia;
        return a ? a : (a = 0 < gc) ? gc < ia : a
      }();
      s = u(H) ? q : s;
      w = u(H) ? t : w;
      P.call(h, w, 0, h);
      P.call(h, w, 1, h);
      q = P.call(h, w, 2, h);
      P.call(h, w, 3, h);
      if(0 !== q) {
        j = Math.round.call(h, Jc / (Math.cos.call(h, a - j) * Math.sqrt.call(h, q))), w = 4 * j, q = Math.round.call(h, (480 - j) / 2), s *= w, t = P.a(Kc, b), t.style.cssText = ["position: absolute; left: ", 4 * b, "px; height: ", j, "px; width:5px; top: ", q, "px; overflow: hidden"].join(""), t.la.style.cssText = ["position: absolute; height: ", j, "px; width: ", 2 * w, "px; left: ", -s, "px; top: 0px;"].join("")
      }
      b += 1
    }else {
      break
    }
  }
}
var fd = uc.h((new Date).getTime());
(function() {
  function a(a) {
    return function(c) {
      wc.b(yc, a, Xc.call(h, c.keyCode));
      return c.preventDefault()
    }
  }
  document.onkeydown = a.call(h, Wa);
  return document.onkeyup = a.call(h, bb)
})();
var gd = new Tc(10, 11, ob.T(), 0.1, 3 * (Ac / 180)), hd, id = X([X([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 3, 0, 3, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1]), X([1, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]), X([1, 0, 0, 3, 0, 3, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 
0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 4, 0, 0, 4, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 4, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 4, 0, 0, 4, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 4, 3, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]), X([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])]);
hd = new Uc(Xa(P.a(id, 0)), y(id), id);
vc(zc, new Vc(gd, hd));
Fc.call(h, function jd() {
  if(u("\ufdd0'escape".call(h, xc.call(h, yc)))) {
    return h
  }
  var b = (new Date).getTime(), c = 1E3 / (b - xc.call(h, fd)), e = 0.06 * (b - xc.call(h, fd));
  Hc.innerHTML = S(Math.floor.call(h, 100 * c) / 100, " fps");
  wc.a(zc, function(b) {
    for(var c = e;;) {
      if(0 < c) {
        var c = c - 1, k = xc.call(h, yc), b = u(ib.call(h, b)) ? V.call(h, E, b) : b, j = Q.call(h, b, "\ufdd0'player"), q = u(ib.call(h, j)) ? V.call(h, E, j) : j, j = Q.call(h, q, "\ufdd0'rot"), s = Q.call(h, q, "\ufdd0'rot-speed"), t = Q.call(h, q, "\ufdd0'move-speed");
        Q.call(h, q, "\ufdd0'y");
        Q.call(h, q, "\ufdd0'x");
        q = u(k.call(h, "\ufdd0'down")) ? -1 : u(k.call(h, "\ufdd0'up")) ? 1 : 0;
        k = u(k.call(h, "\ufdd0'left")) ? -1 : u(k.call(h, "\ufdd0'right")) ? 1 : 0;
        t *= q;
        k = Dc(j + k * s);
        b = Wc(Wc(Qb(b, X(["\ufdd0'player", "\ufdd0'rot"]), k), t * Math.cos.call(h, k), 0), 0, t * Math.sin.call(h, k))
      }else {
        return b
      }
    }
  });
  vc(fd, (new Date).getTime());
  ed();
  return Fc.call(h, jd)
});
