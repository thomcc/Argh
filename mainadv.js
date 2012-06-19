function c(a) {
  throw a;
}
var h = !0, j = null, l = !1;
function aa() {
  return function(a) {
    return a
  }
}
function m(a) {
  return function() {
    return this[a]
  }
}
function p(a) {
  return function() {
    return a
  }
}
var q, ba = this;
function r(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var d = Object.prototype.toString.call(a);
      if("[object Window]" == d) {
        return"object"
      }
      if("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
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
function s(a) {
  return void 0 !== a
}
function ca(a) {
  return"string" == typeof a
}
function ea(a) {
  return a[ga] || (a[ga] = ++ha)
}
var ga = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), ha = 0;
var ia = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"}, ja = {"'":"\\'"};
function ka(a) {
  var n;
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0), g = b, i = d + 1, k;
    if(!(k = ia[e])) {
      if(!(31 < f && 127 > f)) {
        if(e in ja) {
          e = ja[e]
        }else {
          if(e in ia) {
            n = ja[e] = ia[e], e = n
          }else {
            f = e;
            k = e.charCodeAt(0);
            if(31 < k && 127 > k) {
              f = e
            }else {
              if(256 > k) {
                if(f = "\\x", 16 > k || 256 < k) {
                  f += "0"
                }
              }else {
                f = "\\u", 4096 > k && (f += "0")
              }
              f += k.toString(16).toUpperCase()
            }
            e = ja[e] = f
          }
        }
      }
      k = e
    }
    g[i] = k
  }
  b.push('"');
  return b.join("")
}
function la(a) {
  return("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
}
function ma(a) {
  for(var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d), b %= 4294967296
  }
  return b
}
;function na(a, b, d) {
  for(var e in a) {
    b.call(d, a[e], e, a)
  }
}
function oa(a) {
  var b = {}, d;
  for(d in a) {
    b[d] = a[d]
  }
  return b
}
;var pa, qa, ra, sa, ta;
(ta = "ScriptEngine" in ba && "JScript" == ba.ScriptEngine()) && (ba.ScriptEngineMajorVersion(), ba.ScriptEngineMinorVersion(), ba.ScriptEngineBuildVersion());
function ua(a, b) {
  this.A = ta ? [] : "";
  a != j && this.append.apply(this, arguments)
}
ta ? (ua.prototype.ja = 0, ua.prototype.append = function(a, b, d) {
  b == j ? this.A[this.ja++] = a : (this.A.push.apply(this.A, arguments), this.ja = this.A.length);
  return this
}) : ua.prototype.append = function(a, b, d) {
  this.A += a;
  if(b != j) {
    for(var e = 1;e < arguments.length;e++) {
      this.A += arguments[e]
    }
  }
  return this
};
ua.prototype.clear = function() {
  ta ? this.ja = this.A.length = 0 : this.A = ""
};
ua.prototype.toString = function() {
  if(ta) {
    var a = this.A.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.A
};
function va() {
  c(Error("No *print-fn* fn set for evaluation environment"))
}
function u(a) {
  return a != j && a !== l
}
function wa(a, b) {
  var d = a[r.call(j, b)];
  if(u(d)) {
    return d
  }
  d = a._;
  return u(d) ? d : l
}
function v(a, b) {
  return Error("No protocol method " + a + " defined for type " + r.call(j, b) + ": " + b)
}
function xa(a) {
  return Array.prototype.slice.call(a)
}
function ya(a) {
  if(a ? a.F : a) {
    a = a.F(a)
  }else {
    var b;
    var d = ya[r.call(j, a)];
    d ? b = d : (d = ya._) ? b = d : c(v.call(j, "ICounted.-count", a));
    a = b.call(j, a)
  }
  return a
}
function za(a) {
  if(a ? a.L : a) {
    a = a.L(a)
  }else {
    var b;
    var d = za[r.call(j, a)];
    d ? b = d : (d = za._) ? b = d : c(v.call(j, "IEmptyableCollection.-empty", a));
    a = b.call(j, a)
  }
  return a
}
var Aa = {};
function Ba(a, b) {
  var d;
  if(a ? a.t : a) {
    d = a.t(a, b)
  }else {
    var e = Ba[r.call(j, a)];
    e ? d = e : (e = Ba._) ? d = e : c(v.call(j, "ICollection.-conj", a));
    d = d.call(j, a, b)
  }
  return d
}
var x = function() {
  function a(a, b, d) {
    if(a ? a.ma : a) {
      a = a.ma(a, b, d)
    }else {
      var i;
      var k = x[r.call(j, a)];
      k ? i = k : (k = x._) ? i = k : c(v.call(j, "IIndexed.-nth", a));
      a = i.call(j, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.la : a) {
      d = a.la(a, b)
    }else {
      var i = x[r.call(j, a)];
      i ? d = i : (i = x._) ? d = i : c(v.call(j, "IIndexed.-nth", a));
      d = d.call(j, a, b)
    }
    return d
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), Ca = {};
function Da(a) {
  if(a ? a.W : a) {
    a = a.W(a)
  }else {
    var b;
    var d = Da[r.call(j, a)];
    d ? b = d : (d = Da._) ? b = d : c(v.call(j, "ISeq.-first", a));
    a = b.call(j, a)
  }
  return a
}
function Ea(a) {
  if(a ? a.X : a) {
    a = a.X(a)
  }else {
    var b;
    var d = Ea[r.call(j, a)];
    d ? b = d : (d = Ea._) ? b = d : c(v.call(j, "ISeq.-rest", a));
    a = b.call(j, a)
  }
  return a
}
var y = function() {
  function a(a, b, d) {
    if(a ? a.O : a) {
      a = a.O(a, b, d)
    }else {
      var i;
      var k = y[r.call(j, a)];
      k ? i = k : (k = y._) ? i = k : c(v.call(j, "ILookup.-lookup", a));
      a = i.call(j, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.N : a) {
      d = a.N(a, b)
    }else {
      var i = y[r.call(j, a)];
      i ? d = i : (i = y._) ? d = i : c(v.call(j, "ILookup.-lookup", a));
      d = d.call(j, a, b)
    }
    return d
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}();
function Ka(a, b) {
  var d;
  if(a ? a.ka : a) {
    d = a.ka(a, b)
  }else {
    var e = Ka[r.call(j, a)];
    e ? d = e : (e = Ka._) ? d = e : c(v.call(j, "IAssociative.-contains-key?", a));
    d = d.call(j, a, b)
  }
  return d
}
function La(a, b, d) {
  if(a ? a.S : a) {
    a = a.S(a, b, d)
  }else {
    var e;
    var f = La[r.call(j, a)];
    f ? e = f : (f = La._) ? e = f : c(v.call(j, "IAssociative.-assoc", a));
    a = e.call(j, a, b, d)
  }
  return a
}
var Ma = {};
function Na(a, b) {
  var d;
  if(a ? a.V : a) {
    d = a.V(a, b)
  }else {
    var e = Na[r.call(j, a)];
    e ? d = e : (e = Na._) ? d = e : c(v.call(j, "IMap.-dissoc", a));
    d = d.call(j, a, b)
  }
  return d
}
var Oa = {};
function Pa(a, b) {
  var d;
  if(a ? a.ua : a) {
    d = a.ua(0, b)
  }else {
    var e = Pa[r.call(j, a)];
    e ? d = e : (e = Pa._) ? d = e : c(v.call(j, "ISet.-disjoin", a));
    d = d.call(j, a, b)
  }
  return d
}
function Qa(a) {
  if(a ? a.fa : a) {
    a = a.fa(a)
  }else {
    var b;
    var d = Qa[r.call(j, a)];
    d ? b = d : (d = Qa._) ? b = d : c(v.call(j, "IStack.-peek", a));
    a = b.call(j, a)
  }
  return a
}
function Ra(a) {
  if(a ? a.ga : a) {
    a = a.ga(a)
  }else {
    var b;
    var d = Ra[r.call(j, a)];
    d ? b = d : (d = Ra._) ? b = d : c(v.call(j, "IStack.-pop", a));
    a = b.call(j, a)
  }
  return a
}
var Sa = {};
function Ta(a) {
  if(a ? a.wa : a) {
    a = a.state
  }else {
    var b;
    var d = Ta[r.call(j, a)];
    d ? b = d : (d = Ta._) ? b = d : c(v.call(j, "IDeref.-deref", a));
    a = b.call(j, a)
  }
  return a
}
var Ua = {};
function Va(a) {
  if(a ? a.v : a) {
    a = a.v(a)
  }else {
    var b;
    var d = Va[r.call(j, a)];
    d ? b = d : (d = Va._) ? b = d : c(v.call(j, "IMeta.-meta", a));
    a = b.call(j, a)
  }
  return a
}
function Wa(a, b) {
  var d;
  if(a ? a.C : a) {
    d = a.C(a, b)
  }else {
    var e = Wa[r.call(j, a)];
    e ? d = e : (e = Wa._) ? d = e : c(v.call(j, "IWithMeta.-with-meta", a));
    d = d.call(j, a, b)
  }
  return d
}
var Xa = function() {
  function a(a, b, d) {
    if(a ? a.oa : a) {
      a = a.oa(a, b, d)
    }else {
      var i;
      var k = Xa[r.call(j, a)];
      k ? i = k : (k = Xa._) ? i = k : c(v.call(j, "IReduce.-reduce", a));
      a = i.call(j, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.na : a) {
      d = a.na(a, b)
    }else {
      var i = Xa[r.call(j, a)];
      i ? d = i : (i = Xa._) ? d = i : c(v.call(j, "IReduce.-reduce", a));
      d = d.call(j, a, b)
    }
    return d
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}();
function Za(a, b) {
  var d;
  if(a ? a.j : a) {
    d = a.j(a, b)
  }else {
    var e = Za[r.call(j, a)];
    e ? d = e : (e = Za._) ? d = e : c(v.call(j, "IEquiv.-equiv", a));
    d = d.call(j, a, b)
  }
  return d
}
function $a(a) {
  if(a ? a.k : a) {
    a = a.k(a)
  }else {
    var b;
    var d = $a[r.call(j, a)];
    d ? b = d : (d = $a._) ? b = d : c(v.call(j, "IHash.-hash", a));
    a = b.call(j, a)
  }
  return a
}
function ab(a) {
  if(a ? a.z : a) {
    a = a.z(a)
  }else {
    var b;
    var d = ab[r.call(j, a)];
    d ? b = d : (d = ab._) ? b = d : c(v.call(j, "ISeqable.-seq", a));
    a = b.call(j, a)
  }
  return a
}
var bb = {}, cb = {};
function db(a, b) {
  var d;
  if(a ? a.l : a) {
    d = a.l(a, b)
  }else {
    var e = db[r.call(j, a)];
    e ? d = e : (e = db._) ? d = e : c(v.call(j, "IPrintable.-pr-seq", a));
    d = d.call(j, a, b)
  }
  return d
}
function eb(a, b, d) {
  if(a ? a.va : a) {
    a = a.va(a, b, d)
  }else {
    var e;
    var f = eb[r.call(j, a)];
    f ? e = f : (f = eb._) ? e = f : c(v.call(j, "IWatchable.-notify-watches", a));
    a = e.call(j, a, b, d)
  }
  return a
}
function fb(a, b) {
  return a === b
}
function z(a, b) {
  return Za.call(j, a, b)
}
$a["null"] = p(0);
y["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return j;
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
La["null"] = function(a, b, d) {
  return gb.call(j, b, d)
};
Aa["null"] = h;
Ba["null"] = function(a, b) {
  return hb.call(j, b)
};
Xa["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b.call(j);
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
cb["null"] = h;
db["null"] = function() {
  return hb.call(j, "nil")
};
Oa["null"] = h;
Pa["null"] = p(j);
ya["null"] = p(0);
Qa["null"] = p(j);
Ra["null"] = p(j);
Ca["null"] = h;
Da["null"] = p(j);
Ea["null"] = function() {
  return hb.call(j)
};
Za["null"] = function(a, b) {
  return b === j
};
Wa["null"] = p(j);
Ua["null"] = h;
Va["null"] = p(j);
x["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return j;
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
za["null"] = p(j);
Ma["null"] = h;
Na["null"] = p(j);
Date.prototype.j = function(a, b) {
  return a.toString() === b.toString()
};
$a.number = aa();
Za.number = function(a, b) {
  return a === b
};
$a["boolean"] = function(a) {
  return a === h ? 1 : 0
};
$a["function"] = function(a) {
  return ea.call(j, a)
};
function ib(a) {
  return a + 1
}
var mb = function() {
  function a(a, b, d, e) {
    for(;;) {
      if(e < ya.call(j, a)) {
        d = b.call(j, d, x.call(j, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function b(a, b, d) {
    for(var e = 0;;) {
      if(e < ya.call(j, a)) {
        d = b.call(j, d, x.call(j, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function d(a, b) {
    if(u(z.call(j, 0, ya.call(j, a)))) {
      return b.call(j)
    }
    for(var d = x.call(j, a, 0), e = 1;;) {
      if(e < ya.call(j, a)) {
        d = b.call(j, d, x.call(j, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  var e = j, e = function(e, g, i, k) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, g);
      case 3:
        return b.call(this, e, g, i);
      case 4:
        return a.call(this, e, g, i, k)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.a = d;
  e.c = b;
  e.J = a;
  return e
}();
function nb(a, b) {
  this.D = a;
  this.M = b
}
q = nb.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.na = function(a, b) {
  return mb.call(j, this.D, b, this.D[this.M], this.M + 1)
};
q.oa = function(a, b, d) {
  return mb.call(j, this.D, b, d, this.M)
};
q.B = h;
q.t = function(a, b) {
  return A.call(j, b, a)
};
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.Y = h;
q.la = function(a, b) {
  var d = b + this.M;
  return d < this.D.length ? this.D[d] : j
};
q.ma = function(a, b, d) {
  a = b + this.M;
  return a < this.D.length ? this.D[a] : d
};
q.F = function() {
  return this.D.length - this.M
};
q.ba = h;
q.W = function() {
  return this.D[this.M]
};
q.X = function() {
  return this.M + 1 < this.D.length ? new nb(this.D, this.M + 1) : hb.call(j)
};
q.z = aa();
function qb(a, b) {
  return u(z.call(j, 0, a.length)) ? j : new nb(a, b)
}
function B(a, b) {
  return qb.call(j, a, b)
}
Xa.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return mb.call(j, a, b);
      case 3:
        return mb.call(j, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
y.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return a[b];
      case 3:
        return x.call(j, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
x.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b < a.length ? a[b] : j;
      case 3:
        return b < a.length ? a[b] : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
ya.array = function(a) {
  return a.length
};
ab.array = function(a) {
  return B.call(j, a, 0)
};
function C(a) {
  return u(a) ? ab.call(j, a) : j
}
function D(a) {
  a = C.call(j, a);
  return u(a) ? Da.call(j, a) : j
}
function E(a) {
  return Ea.call(j, C.call(j, a))
}
function F(a) {
  return u(a) ? C.call(j, E.call(j, a)) : j
}
function rb(a) {
  return D.call(j, F.call(j, a))
}
function sb(a) {
  return F.call(j, F.call(j, a))
}
ya._ = function(a) {
  for(var a = C.call(j, a), b = 0;;) {
    if(u(a)) {
      a = F.call(j, a), b += 1
    }else {
      return b
    }
  }
};
Za._ = function(a, b) {
  return a === b
};
function G(a) {
  return u(a) ? l : h
}
var H = function() {
  function a(a, b) {
    return Ba.call(j, a, b)
  }
  var b = j, d = function() {
    function a(b, e, k) {
      var n = j;
      s(k) && (n = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(u(f)) {
          a = b.call(j, a, e), e = D.call(j, f), f = F.call(j, f)
        }else {
          return b.call(j, a, e)
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), a = E(F(a));
      return d.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.a = a;
  b.c = d;
  return b
}();
function tb(a) {
  return za.call(j, a)
}
function I(a) {
  return ya.call(j, a)
}
var J = function() {
  function a(a, b, d) {
    return x.call(j, a, Math.floor(b), d)
  }
  function b(a, b) {
    return x.call(j, a, Math.floor(b))
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), K = function() {
  function a(a, b, d) {
    return y.call(j, a, b, d)
  }
  function b(a, b) {
    return y.call(j, a, b)
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), ub = function() {
  function a(a, b, d) {
    return La.call(j, a, b, d)
  }
  var b = j, d = function() {
    function a(b, e, k, n) {
      var o = j;
      s(n) && (o = B(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, b, e, k, o)
    }
    function d(a, e, f, n) {
      for(;;) {
        if(a = b.call(j, a, e, f), u(n)) {
          e = D.call(j, n), f = rb.call(j, n), n = sb.call(j, n)
        }else {
          return a
        }
      }
    }
    a.d = 3;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), n = D(F(F(a))), a = E(F(F(a)));
      return d.call(this, b, e, n, a)
    };
    return a
  }(), b = function(b, f, g, i) {
    switch(arguments.length) {
      case 3:
        return a.call(this, b, f, g);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 3;
  b.b = d.b;
  b.c = a;
  b.J = d;
  return b
}(), vb = function() {
  function a(a, b) {
    return Na.call(j, a, b)
  }
  var b = j, d = function() {
    function a(b, e, k) {
      var n = j;
      s(k) && (n = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(j, a, e), u(f)) {
          e = D.call(j, f), f = F.call(j, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), a = E(F(a));
      return d.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 1:
        return b;
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.g = aa();
  b.a = a;
  b.c = d;
  return b
}();
function wb(a, b) {
  return Wa.call(j, a, b)
}
function xb(a) {
  var b;
  u(a) ? (b = a.u, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$IMeta$")) : b) : b = a;
  b = u(b) ? h : wa.call(j, Ua, a);
  return u(b) ? Va.call(j, a) : j
}
var yb = function() {
  function a(a, b) {
    return Pa.call(j, a, b)
  }
  var b = j, d = function() {
    function a(b, e, k) {
      var n = j;
      s(k) && (n = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(j, a, e), u(f)) {
          e = D.call(j, f), f = F.call(j, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), a = E(F(a));
      return d.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 1:
        return b;
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.g = aa();
  b.a = a;
  b.c = d;
  return b
}();
function zb(a) {
  return $a.call(j, a)
}
function Ab(a) {
  return G.call(j, C.call(j, a))
}
function Bb(a) {
  if(a === j) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.B, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$ICollection$")) : b) : b = a;
    a = u(b) ? h : wa.call(j, Aa, a)
  }
  return a
}
function Cb(a) {
  if(a === j) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.xa, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$ISet$")) : b) : b = a;
    a = u(b) ? h : wa.call(j, Oa, a)
  }
  return a
}
function Db(a) {
  var b;
  u(a) ? (b = a.Y, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$ISequential$")) : b) : b = a;
  return u(b) ? h : wa.call(j, bb, a)
}
function Eb(a) {
  if(a === j) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.aa, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$IMap$")) : b) : b = a;
    a = u(b) ? h : wa.call(j, Ma, a)
  }
  return a
}
function Fb(a) {
  var b;
  u(a) ? (b = a.ya, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$IVector$")) : b) : b = a;
  return u(b) ? h : wa.call(j, Sa, a)
}
function Gb() {
  return{}
}
function Hb(a) {
  var b = [];
  na.call(j, a, function(a, e) {
    return b.push(e)
  });
  return b
}
function Lb(a, b) {
  return delete a[b]
}
var Mb = Gb.call(j);
function Nb(a) {
  if(a === j) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.ba, b = u(b) ? G.call(j, a.hasOwnProperty("cljs$core$ISeq$")) : b) : b = a;
    a = u(b) ? h : wa.call(j, Ca, a)
  }
  return a
}
function Ob(a) {
  return u(a) ? h : l
}
function Pb(a) {
  var b = ca.call(j, a);
  return u(b) ? G.call(j, function() {
    var b = z.call(j, a.charAt(0), "\ufdd0");
    return u(b) ? b : z.call(j, a.charAt(0), "\ufdd1")
  }()) : b
}
function Qb(a) {
  var b = ca.call(j, a);
  return u(b) ? z.call(j, a.charAt(0), "\ufdd0") : b
}
function Rb(a) {
  var b = ca.call(j, a);
  return u(b) ? z.call(j, a.charAt(0), "\ufdd1") : b
}
function Sb(a, b) {
  return y.call(j, a, b, Mb) === Mb ? l : h
}
var N = function() {
  function a(a, b, d) {
    return Xa.call(j, d, a, b)
  }
  function b(a, b) {
    return Xa.call(j, b, a)
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), Tb = function() {
  function a(a, b, d) {
    for(d = C.call(j, d);;) {
      if(u(d)) {
        b = a.call(j, b, D.call(j, d)), d = F.call(j, d)
      }else {
        return b
      }
    }
  }
  function b(a, b) {
    var d = C.call(j, b);
    return u(d) ? N.call(j, a, D.call(j, d), F.call(j, d)) : a.call(j)
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}();
Xa._ = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Tb.call(j, b, a);
      case 3:
        return Tb.call(j, b, d, a)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var Ub = function() {
  var a = j, b = function() {
    function b(d, f, g) {
      var i = j;
      s(g) && (i = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(j, a, d + f, i)
    }
    b.d = 2;
    b.b = function(b) {
      var d = D(b), g = D(F(b)), b = E(F(b));
      return N.call(j, a, d + g, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + e;
      default:
        return b.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  a.d = 2;
  a.b = b.b;
  a.P = p(0);
  a.g = aa();
  a.a = function(a, b) {
    return a + b
  };
  a.c = b;
  return a
}(), Vb = function() {
  var a = j, b = function() {
    function b(d, f, g) {
      var i = j;
      s(g) && (i = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(j, a, d - f, i)
    }
    b.d = 2;
    b.b = function(b) {
      var d = D(b), g = D(F(b)), b = E(F(b));
      return N.call(j, a, d - g, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - e;
      default:
        return b.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  a.d = 2;
  a.b = b.b;
  a.g = function(a) {
    return-a
  };
  a.a = function(a, b) {
    return a - b
  };
  a.c = b;
  return a
}(), Wb = function() {
  var a = j, b = function() {
    function b(d, f, g) {
      var i = j;
      s(g) && (i = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(j, a, d * f, i)
    }
    b.d = 2;
    b.b = function(b) {
      var d = D(b), g = D(F(b)), b = E(F(b));
      return N.call(j, a, d * g, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * e;
      default:
        return b.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  a.d = 2;
  a.b = b.b;
  a.P = p(1);
  a.g = aa();
  a.a = function(a, b) {
    return a * b
  };
  a.c = b;
  return a
}();
function Xb(a) {
  return 0 <= a ? Math.floor.call(j, a) : Math.ceil.call(j, a)
}
var Yb = function() {
  function a(a) {
    return a * d.call(j)
  }
  function b() {
    return Math.random.call(j)
  }
  var d = j, d = function(d) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, d)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.P = b;
  d.g = a;
  return d
}();
function Zb(a) {
  return Xb.call(j, Yb.call(j, a))
}
var $b = function() {
  function a(a, b) {
    return Za.call(j, a, b)
  }
  var b = j, d = function() {
    function a(b, e, k) {
      var n = j;
      s(k) && (n = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(u(b.call(j, a, e))) {
          if(u(F.call(j, f))) {
            a = e, e = D.call(j, f), f = F.call(j, f)
          }else {
            return b.call(j, e, D.call(j, f))
          }
        }else {
          return l
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), a = E(F(a));
      return d.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 1:
        return h;
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.g = p(h);
  b.a = a;
  b.c = d;
  return b
}();
function ac(a, b) {
  for(var d = b, e = C.call(j, a);;) {
    var f = e;
    if(u(u(f) ? 0 < d : f)) {
      d -= 1, e = F.call(j, e)
    }else {
      return e
    }
  }
}
x._ = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        var e;
        var f = ac.call(j, a, b);
        u(f) ? e = D.call(j, f) : c(Error("Index out of bounds"));
        return e;
      case 3:
        return e = ac.call(j, a, b), u(e) ? D.call(j, e) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var bc = function() {
  function a(a) {
    return a === j ? "" : a.toString()
  }
  var b = j, d = function() {
    function a(b, e) {
      var k = j;
      s(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(j, D.call(j, d))), f = F.call(j, d), a = e, d = f
          }else {
            return b.call(j, a)
          }
        }
      }.call(j, new ua(b.call(j, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = D(a), a = E(a);
      return d.call(this, b, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return a.call(this, b);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 1;
  b.b = d.b;
  b.P = p("");
  b.g = a;
  b.a = d;
  return b
}(), O = function() {
  function a(a) {
    return u(Rb.call(j, a)) ? a.substring(2, a.length) : u(Qb.call(j, a)) ? bc.call(j, ":", a.substring(2, a.length)) : a === j ? "" : a.toString()
  }
  var b = j, d = function() {
    function a(b, e) {
      var k = j;
      s(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(j, D.call(j, d))), f = F.call(j, d), a = e, d = f
          }else {
            return bc.call(j, a)
          }
        }
      }.call(j, new ua(b.call(j, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = D(a), a = E(a);
      return d.call(this, b, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return a.call(this, b);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 1;
  b.b = d.b;
  b.P = p("");
  b.g = a;
  b.a = d;
  return b
}(), cc = function() {
  var a = j, a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a.substring(d);
      case 3:
        return a.substring(d, e)
    }
    c("Invalid arity: " + arguments.length)
  };
  a.a = function(a, d) {
    return a.substring(d)
  };
  a.c = function(a, d, e) {
    return a.substring(d, e)
  };
  return a
}(), dc = function() {
  function a(a, b) {
    return d.call(j, bc.call(j, a, "/", b))
  }
  function b(a) {
    return u(Qb.call(j, a)) ? a : u(Rb.call(j, a)) ? bc.call(j, "\ufdd0", "'", cc.call(j, a, 2)) : bc.call(j, "\ufdd0", "'", a)
  }
  var d = j, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.g = b;
  d.a = a;
  return d
}();
function pb(a, b) {
  return Ob.call(j, u(Db.call(j, b)) ? function() {
    for(var d = C.call(j, a), e = C.call(j, b);;) {
      if(d === j) {
        return e === j
      }
      if(e !== j && u(z.call(j, D.call(j, d), D.call(j, e)))) {
        d = F.call(j, d), e = F.call(j, e)
      }else {
        return l
      }
    }
  }() : j)
}
function ec(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
}
function ob(a) {
  return N.call(j, function(a, d) {
    return ec.call(j, a, zb.call(j, d))
  }, zb.call(j, D.call(j, a)), F.call(j, a))
}
function fc(a, b, d, e) {
  this.f = a;
  this.Z = b;
  this.$ = d;
  this.G = e
}
q = fc.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.Y = h;
q.B = h;
q.t = function(a, b) {
  return new fc(this.f, b, a, this.G + 1)
};
q.z = aa();
q.F = m("G");
q.fa = m("Z");
q.ga = function(a) {
  return Ea.call(j, a)
};
q.ba = h;
q.W = m("Z");
q.X = m("$");
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.C = function(a, b) {
  return new fc(b, this.Z, this.$, this.G)
};
q.u = h;
q.v = m("f");
q.L = function() {
  return gc
};
function hc(a) {
  this.f = a
}
q = hc.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.Y = h;
q.B = h;
q.t = function(a, b) {
  return new fc(this.f, b, j, 1)
};
q.z = p(j);
q.F = p(0);
q.fa = p(j);
q.ga = p(j);
q.ba = h;
q.W = p(j);
q.X = p(j);
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.C = function(a, b) {
  return new hc(b)
};
q.u = h;
q.v = m("f");
q.L = aa();
var gc = new hc(j);
function ic(a) {
  return N.call(j, H, gc, a)
}
var hb = function() {
  function a(a) {
    var d = j;
    s(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return N.call(j, H, gc, ic.call(j, d))
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return N.call(j, H, gc, ic.call(j, a))
  };
  return a
}();
function jc(a, b, d) {
  this.f = a;
  this.Z = b;
  this.$ = d
}
q = jc.prototype;
q.z = aa();
q.k = function(a) {
  return ob.call(j, a)
};
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.Y = h;
q.L = function() {
  return wb.call(j, gc, this.f)
};
q.B = h;
q.t = function(a, b) {
  return new jc(j, b, a)
};
q.ba = h;
q.W = m("Z");
q.X = function() {
  return this.$ === j ? gc : this.$
};
q.u = h;
q.v = m("f");
q.C = function(a, b) {
  return new jc(b, this.Z, this.$)
};
function A(a, b) {
  return new jc(j, a, b)
}
Xa.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return mb.call(j, a, b);
      case 3:
        return mb.call(j, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
y.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return x.call(j, a, b);
      case 3:
        return x.call(j, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
x.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b < ya.call(j, a) ? a.charAt(b) : j;
      case 3:
        return b < ya.call(j, a) ? a.charAt(b) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
ya.string = function(a) {
  return a.length
};
ab.string = function(a) {
  return qb.call(j, a, 0)
};
$a.string = function(a) {
  return ma.call(j, a)
};
String.prototype.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return K.call(j, b, this.toString());
      case 3:
        return K.call(j, b, this.toString(), d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
String.prototype.apply = function(a, b) {
  return 2 > I.call(j, b) ? K.call(j, b[0], a) : K.call(j, b[0], a, b[1])
};
function kc(a) {
  var b = a.x;
  if(u(a.qa)) {
    return b
  }
  a.x = b.call(j);
  a.qa = h;
  return a.x
}
function P(a, b, d) {
  this.f = a;
  this.qa = b;
  this.x = d
}
q = P.prototype;
q.z = function(a) {
  return C.call(j, kc.call(j, a))
};
q.k = function(a) {
  return ob.call(j, a)
};
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.Y = h;
q.L = function() {
  return wb.call(j, gc, this.f)
};
q.B = h;
q.t = function(a, b) {
  return A.call(j, b, a)
};
q.ba = h;
q.W = function(a) {
  return D.call(j, kc.call(j, a))
};
q.X = function(a) {
  return E.call(j, kc.call(j, a))
};
q.u = h;
q.v = m("f");
q.C = function(a, b) {
  return new P(b, this.qa, this.x)
};
function lc(a) {
  for(var b = [];;) {
    if(u(C.call(j, a))) {
      b.push(D.call(j, a)), a = F.call(j, a)
    }else {
      return b
    }
  }
}
function mc(a, b) {
  for(var d = a, e = b, f = 0;;) {
    var g;
    g = (g = 0 < e) ? C.call(j, d) : g;
    if(u(g)) {
      d = F.call(j, d), e -= 1, f += 1
    }else {
      return f
    }
  }
}
var oc = function nc(b) {
  return b === j ? j : F.call(j, b) === j ? C.call(j, D.call(j, b)) : A.call(j, D.call(j, b), nc.call(j, F.call(j, b)))
}, pc = function() {
  function a(a, b) {
    return new P(j, l, function() {
      var d = C.call(j, a);
      return u(d) ? A.call(j, D.call(j, d), e.call(j, E.call(j, d), b)) : b
    })
  }
  function b(a) {
    return new P(j, l, function() {
      return a
    })
  }
  function d() {
    return new P(j, l, p(j))
  }
  var e = j, f = function() {
    function a(d, e, f) {
      var g = j;
      s(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, d, e, g)
    }
    function b(a, d, f) {
      return function w(a, b) {
        return new P(j, l, function() {
          var d = C.call(j, a);
          return u(d) ? A.call(j, D.call(j, d), w.call(j, E.call(j, d), b)) : u(b) ? w.call(j, D.call(j, b), F.call(j, b)) : j
        })
      }.call(j, e.call(j, a, d), f)
    }
    a.d = 2;
    a.b = function(a) {
      var d = D(a), e = D(F(a)), a = E(F(a));
      return b.call(this, d, e, a)
    };
    return a
  }(), e = function(e, i, k) {
    switch(arguments.length) {
      case 0:
        return d.call(this);
      case 1:
        return b.call(this, e);
      case 2:
        return a.call(this, e, i);
      default:
        return f.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.d = 2;
  e.b = f.b;
  e.P = d;
  e.g = b;
  e.a = a;
  e.c = f;
  return e
}(), qc = function() {
  function a(a, b, d, e) {
    return A.call(j, a, A.call(j, b, A.call(j, d, e)))
  }
  function b(a, b, d) {
    return A.call(j, a, A.call(j, b, d))
  }
  function d(a, b) {
    return A.call(j, a, b)
  }
  function e(a) {
    return C.call(j, a)
  }
  var f = j, g = function() {
    function a(d, e, f, g, i) {
      var L = j;
      s(i) && (L = B(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, L)
    }
    function b(a, d, e, f, g) {
      return A.call(j, a, A.call(j, d, A.call(j, e, A.call(j, f, oc.call(j, g)))))
    }
    a.d = 4;
    a.b = function(a) {
      var d = D(a), e = D(F(a)), f = D(F(F(a))), g = D(F(F(F(a)))), a = E(F(F(F(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), f = function(f, k, n, o, t) {
    switch(arguments.length) {
      case 1:
        return e.call(this, f);
      case 2:
        return d.call(this, f, k);
      case 3:
        return b.call(this, f, k, n);
      case 4:
        return a.call(this, f, k, n, o);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 4;
  f.b = g.b;
  f.g = e;
  f.a = d;
  f.c = b;
  f.J = a;
  f.pa = g;
  return f
}(), Q = function() {
  function a(a, b, d, e, f) {
    b = qc.call(j, b, d, e, f);
    d = a.d;
    return u(a.b) ? mc.call(j, b, d) <= d ? a.apply(a, lc.call(j, b)) : a.b(b) : a.apply(a, lc.call(j, b))
  }
  function b(a, b, d, e) {
    b = qc.call(j, b, d, e);
    d = a.d;
    return u(a.b) ? mc.call(j, b, d) <= d ? a.apply(a, lc.call(j, b)) : a.b(b) : a.apply(a, lc.call(j, b))
  }
  function d(a, b, d) {
    b = qc.call(j, b, d);
    d = a.d;
    return u(a.b) ? mc.call(j, b, d) <= d ? a.apply(a, lc.call(j, b)) : a.b(b) : a.apply(a, lc.call(j, b))
  }
  function e(a, b) {
    var d = a.d;
    return u(a.b) ? mc.call(j, b, d + 1) <= d ? a.apply(a, lc.call(j, b)) : a.b(b) : a.apply(a, lc.call(j, b))
  }
  var f = j, g = function() {
    function a(d, e, f, g, i, L) {
      var R = j;
      s(L) && (R = B(Array.prototype.slice.call(arguments, 5), 0));
      return b.call(this, d, e, f, g, i, R)
    }
    function b(a, d, e, f, g, i) {
      d = A.call(j, d, A.call(j, e, A.call(j, f, A.call(j, g, oc.call(j, i)))));
      e = a.d;
      return u(a.b) ? mc.call(j, d, e) <= e ? a.apply(a, lc.call(j, d)) : a.b(d) : a.apply(a, lc.call(j, d))
    }
    a.d = 5;
    a.b = function(a) {
      var d = D(a), e = D(F(a)), f = D(F(F(a))), g = D(F(F(F(a)))), i = D(F(F(F(F(a))))), a = E(F(F(F(F(a)))));
      return b.call(this, d, e, f, g, i, a)
    };
    return a
  }(), f = function(f, k, n, o, t, w) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, n);
      case 4:
        return b.call(this, f, k, n, o);
      case 5:
        return a.call(this, f, k, n, o, t);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.J = b;
  f.pa = a;
  f.za = g;
  return f
}(), rc = function() {
  function a(a, b) {
    return G.call(j, z.call(j, a, b))
  }
  function b() {
    return l
  }
  var d = j, e = function() {
    function a(b, d, e) {
      var f = j;
      s(e) && (f = B(Array.prototype.slice.call(arguments, 2), 0));
      return G.call(j, Q.call(j, z, b, d, f))
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), d = D(F(a)), a = E(F(a));
      return G.call(j, Q.call(j, z, b, d, a))
    };
    return a
  }(), d = function(d, g, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this);
      case 2:
        return a.call(this, d, g);
      default:
        return e.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.d = 2;
  d.b = e.b;
  d.g = b;
  d.a = a;
  d.c = e;
  return d
}();
function wc(a) {
  return u(C.call(j, a)) ? a : j
}
function xc(a, b) {
  for(;;) {
    if(C.call(j, b) === j) {
      return h
    }
    if(u(a.call(j, D.call(j, b)))) {
      var d = a, e = F.call(j, b), a = d, b = e
    }else {
      return l
    }
  }
}
function yc(a, b) {
  for(;;) {
    if(u(C.call(j, b))) {
      var d = a.call(j, D.call(j, b));
      if(u(d)) {
        return d
      }
      var d = a, e = F.call(j, b), a = d, b = e
    }else {
      return j
    }
  }
}
function zc(a) {
  return a
}
var Ac = function() {
  function a(a, b, d, f) {
    return new P(j, l, function() {
      var o = C.call(j, b), t = C.call(j, d), w = C.call(j, f);
      return u(u(o) ? u(t) ? w : t : o) ? A.call(j, a.call(j, D.call(j, o), D.call(j, t), D.call(j, w)), e.call(j, a, E.call(j, o), E.call(j, t), E.call(j, w))) : j
    })
  }
  function b(a, b, d) {
    return new P(j, l, function() {
      var f = C.call(j, b), o = C.call(j, d);
      return u(u(f) ? o : f) ? A.call(j, a.call(j, D.call(j, f), D.call(j, o)), e.call(j, a, E.call(j, f), E.call(j, o))) : j
    })
  }
  function d(a, b) {
    return new P(j, l, function() {
      var d = C.call(j, b);
      return u(d) ? A.call(j, a.call(j, D.call(j, d)), e.call(j, a, E.call(j, d))) : j
    })
  }
  var e = j, f = function() {
    function a(d, e, f, g, w) {
      var Y = j;
      s(w) && (Y = B(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, Y)
    }
    function b(a, d, f, g, i) {
      return e.call(j, function(b) {
        return Q.call(j, a, b)
      }, function L(a) {
        return new P(j, l, function() {
          var b = e.call(j, C, a);
          return u(xc.call(j, zc, b)) ? A.call(j, e.call(j, D, b), L.call(j, e.call(j, E, b))) : j
        })
      }.call(j, H.call(j, i, g, f, d)))
    }
    a.d = 4;
    a.b = function(a) {
      var d = D(a), e = D(F(a)), f = D(F(F(a))), g = D(F(F(F(a)))), a = E(F(F(F(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), e = function(e, i, k, n, o) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, i);
      case 3:
        return b.call(this, e, i, k);
      case 4:
        return a.call(this, e, i, k, n);
      default:
        return f.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.d = 4;
  e.b = f.b;
  e.a = d;
  e.c = b;
  e.J = a;
  e.pa = f;
  return e
}(), Cc = function Bc(b, d) {
  return new P(j, l, function() {
    if(0 < b) {
      var e = C.call(j, d);
      return u(e) ? A.call(j, D.call(j, e), Bc.call(j, b - 1, E.call(j, e))) : j
    }
    return j
  })
};
function Dc(a, b) {
  function d(a, b) {
    for(;;) {
      var d = C.call(j, b), i = 0 < a;
      if(u(i ? d : i)) {
        i = a - 1, d = E.call(j, d), a = i, b = d
      }else {
        return d
      }
    }
  }
  return new P(j, l, function() {
    return d.call(j, a, b)
  })
}
var Ec = function() {
  function a(a, b) {
    return Cc.call(j, a, d.call(j, b))
  }
  function b(a) {
    return new P(j, l, function() {
      return A.call(j, a, d.call(j, a))
    })
  }
  var d = j, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.g = b;
  d.a = a;
  return d
}(), Fc = function() {
  function a(a, d) {
    return new P(j, l, function() {
      var g = C.call(j, a), i = C.call(j, d);
      return u(u(g) ? i : g) ? A.call(j, D.call(j, g), A.call(j, D.call(j, i), b.call(j, E.call(j, g), E.call(j, i)))) : j
    })
  }
  var b = j, d = function() {
    function a(b, e, k) {
      var n = j;
      s(k) && (n = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      return new P(j, l, function() {
        var d = Ac.call(j, C, H.call(j, f, e, a));
        return u(xc.call(j, zc, d)) ? pc.call(j, Ac.call(j, D, d), Q.call(j, b, Ac.call(j, E, d))) : j
      })
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), e = D(F(a)), a = E(F(a));
      return d.call(this, b, e, a)
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.a = a;
  b.c = d;
  return b
}();
function Gc(a, b) {
  return Dc.call(j, 1, Fc.call(j, Ec.call(j, a), b))
}
function Hc(a) {
  return function d(a, f) {
    return new P(j, l, function() {
      var g = C.call(j, a);
      return u(g) ? A.call(j, D.call(j, g), d.call(j, E.call(j, g), f)) : u(C.call(j, f)) ? d.call(j, D.call(j, f), E.call(j, f)) : j
    })
  }.call(j, j, a)
}
var Ic = function() {
  function a(a, b) {
    return Hc.call(j, Ac.call(j, a, b))
  }
  var b = j, d = function() {
    function a(b, d, e) {
      var k = j;
      s(e) && (k = B(Array.prototype.slice.call(arguments, 2), 0));
      return Hc.call(j, Q.call(j, Ac, b, d, k))
    }
    a.d = 2;
    a.b = function(a) {
      var b = D(a), d = D(F(a)), a = E(F(a));
      return Hc.call(j, Q.call(j, Ac, b, d, a))
    };
    return a
  }(), b = function(b, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(this, b, f);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 2;
  b.b = d.b;
  b.a = a;
  b.c = d;
  return b
}(), Kc = function Jc(b, d) {
  return new P(j, l, function() {
    var e = C.call(j, d);
    if(u(e)) {
      var f = D.call(j, e), e = E.call(j, e);
      return u(b.call(j, f)) ? A.call(j, f, Jc.call(j, b, e)) : Jc.call(j, b, e)
    }
    return j
  })
};
function Lc(a, b) {
  return N.call(j, Ba, a, b)
}
var Nc = function() {
  function a(a, b, d, k) {
    return new P(j, l, function() {
      var n = C.call(j, k);
      if(u(n)) {
        var o = Cc.call(j, a, n);
        return u(z.call(j, a, I.call(j, o))) ? A.call(j, o, e.call(j, a, b, d, Dc.call(j, b, n))) : hb.call(j, Cc.call(j, a, pc.call(j, o, d)))
      }
      return j
    })
  }
  function b(a, b, d) {
    return new P(j, l, function() {
      var k = C.call(j, d);
      if(u(k)) {
        var n = Cc.call(j, a, k);
        return u(z.call(j, a, I.call(j, n))) ? A.call(j, n, e.call(j, a, b, Dc.call(j, b, k))) : j
      }
      return j
    })
  }
  function d(a, b) {
    return e.call(j, a, a, b)
  }
  var e = j, e = function(e, g, i, k) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, g);
      case 3:
        return b.call(this, e, g, i);
      case 4:
        return a.call(this, e, g, i, k)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.a = d;
  e.c = b;
  e.J = a;
  return e
}(), Oc = function() {
  function a(a, b, d) {
    for(var i = Mb, b = C.call(j, b);;) {
      if(u(b)) {
        a = K.call(j, a, D.call(j, b), i);
        if(i === a) {
          return d
        }
        b = F.call(j, b)
      }else {
        return a
      }
    }
  }
  function b(a, b) {
    return N.call(j, K, a, b)
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), Qc = function Pc(b, d, e) {
  var f = J.call(j, d, 0, j), d = ac.call(j, d, 1);
  return u(d) ? ub.call(j, b, f, Pc.call(j, K.call(j, b, f), d, e)) : ub.call(j, b, f, e)
}, Rc = function() {
  function a(a, e, f, g) {
    var i = j;
    s(g) && (i = B(Array.prototype.slice.call(arguments, 3), 0));
    return b.call(this, a, e, f, i)
  }
  function b(b, e, f, g) {
    var i = J.call(j, e, 0, j), e = ac.call(j, e, 1);
    return u(e) ? ub.call(j, b, i, Q.call(j, a, K.call(j, b, i), e, f, g)) : ub.call(j, b, i, Q.call(j, f, K.call(j, b, i), g))
  }
  a.d = 3;
  a.b = function(a) {
    var e = D(a), f = D(F(a)), g = D(F(F(a))), a = E(F(F(a)));
    return b.call(this, e, f, g, a)
  };
  return a
}();
function Sc(a) {
  a = a.i;
  return 32 > a ? 0 : a - 1 >> 5 << 5
}
function Tc(a, b) {
  for(var d = a, e = b;;) {
    if(u(z.call(j, 0, d))) {
      return e
    }
    var f = xa.call(j, Uc);
    f[0] = e;
    e = f;
    d -= 5
  }
}
var Wc = function Vc(b, d, e, f) {
  var g = xa.call(j, e), i = b.i - 1 >> d & 31;
  u(z.call(j, 5, d)) ? g[i] = f : (e = e[i], b = u(e) ? Vc.call(j, b, d - 5, e, f) : Tc.call(j, d - 5, f), g[i] = b);
  return g
};
function Xc(a, b) {
  var d = 0 <= b;
  if(d ? b < a.i : d) {
    if(b >= Sc.call(j, a)) {
      return a.R
    }
    for(var d = a.root, e = a.shift;;) {
      if(0 < e) {
        var f = e - 5, d = d[b >> e & 31], e = f
      }else {
        return d
      }
    }
  }else {
    c(Error(O.call(j, "No item ", b, " in vector of length ", a.i)))
  }
}
var Zc = function Yc(b, d, e, f, g) {
  var i = xa.call(j, e);
  if(0 === d) {
    i[f & 31] = g
  }else {
    var k = f >> d & 31;
    i[k] = Yc.call(j, b, d - 5, e[k], f, g)
  }
  return i
}, ad = function $c(b, d, e) {
  var f = b.i - 2 >> d & 31;
  if(5 < d) {
    b = $c.call(j, b, d - 5, e[f]);
    if((d = b === j) ? 0 === f : d) {
      return j
    }
    e = xa.call(j, e);
    e[f] = b;
    return e
  }
  if(0 === f) {
    return j
  }
  e = xa.call(j, e);
  e[f] = j;
  return e
};
function bd(a, b, d, e, f) {
  this.f = a;
  this.i = b;
  this.shift = d;
  this.root = e;
  this.R = f
}
q = bd.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.N = function(a, b) {
  return x.call(j, a, b, j)
};
q.O = function(a, b, d) {
  return x.call(j, a, b, d)
};
q.S = function(a, b, d) {
  var e = 0 <= b;
  if(e ? b < this.i : e) {
    return Sc.call(j, a) <= b ? (a = xa.call(j, this.R), a[b & 31] = d, new bd(this.f, this.i, this.shift, this.root, a)) : new bd(this.f, this.i, this.shift, Zc.call(j, a, this.shift, this.root, b, d), this.R)
  }
  if(u(z.call(j, b, this.i))) {
    return Ba.call(j, a, d)
  }
  c(Error(O.call(j, "Index ", b, " out of bounds  [0,", this.i, "]")))
};
q.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(j, this, b);
      case 3:
        return y.call(j, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
q.Y = h;
q.B = h;
q.t = function(a, b) {
  if(32 > this.i - Sc.call(j, a)) {
    var d = xa.call(j, this.R);
    d.push(b);
    return new bd(this.f, this.i + 1, this.shift, this.root, d)
  }
  var e = this.i >> 5 > 1 << this.shift, d = e ? this.shift + 5 : this.shift;
  e ? (e = xa.call(j, Uc), e[0] = this.root, e[1] = Tc.call(j, this.shift, this.R)) : e = Wc.call(j, a, this.shift, this.root, this.R);
  return new bd(this.f, this.i + 1, d, e, [b])
};
q.na = function(a, b) {
  return mb.call(j, a, b)
};
q.oa = function(a, b, d) {
  return mb.call(j, a, b, d)
};
q.z = function(a) {
  var b = this;
  return 0 < b.i ? function e(f) {
    return new P(j, l, function() {
      return f < b.i ? A.call(j, x.call(j, a, f), e.call(j, f + 1)) : j
    })
  }.call(j, 0) : j
};
q.F = m("i");
q.fa = function(a) {
  return 0 < this.i ? x.call(j, a, this.i - 1) : j
};
q.ga = function(a) {
  0 === this.i && c(Error("Can't pop empty vector"));
  if(u(z.call(j, 1, this.i))) {
    return Wa.call(j, cd, this.f)
  }
  if(1 < this.i - Sc.call(j, a)) {
    return new bd(this.f, this.i - 1, this.shift, this.root, xa.call(j, this.R))
  }
  var a = Xc.call(j, a, this.i - 2), b = ad.call(j, this.shift, this.root), b = b === j ? Uc : b, d = this.i - 1, e = 5 < this.shift;
  return(e ? b[1] === j : e) ? new bd(this.f, d, this.shift - 5, b[0], a) : new bd(this.f, d, this.shift, b, a)
};
q.ya = h;
q.j = function(a, b) {
  return pb.call(j, a, b)
};
q.C = function(a, b) {
  return new bd(b, this.i, this.shift, this.root, this.R)
};
q.u = h;
q.v = m("f");
q.la = function(a, b) {
  return Xc.call(j, a, b)[b & 31]
};
q.ma = function(a, b, d) {
  var e = 0 <= b;
  return(e ? b < this.i : e) ? x.call(j, a, b) : d
};
q.L = function() {
  return wb.call(j, cd, this.f)
};
var Uc = Array(32), cd = new bd(j, 0, 5, Uc, []);
function S(a) {
  return Lc.call(j, cd, a)
}
function dd(a) {
  return N.call(j, H, cd, a)
}
var T = function() {
  function a(a) {
    var d = j;
    s(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return dd.call(j, d)
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return dd.call(j, a)
  };
  return a
}();
S([]);
function fd() {
}
fd.prototype.j = p(l);
var gd = new fd;
function hd(a, b) {
  return Ob.call(j, u(Eb.call(j, b)) ? u(z.call(j, I.call(j, a), I.call(j, b))) ? xc.call(j, zc, Ac.call(j, function(a) {
    return z.call(j, K.call(j, b, D.call(j, a), gd), rb.call(j, a))
  }, a)) : j : j)
}
function id(a, b, d) {
  for(var e = d.length, f = 0;;) {
    if(f < e) {
      if(u(z.call(j, b, d[f]))) {
        return f
      }
      f += a
    }else {
      return j
    }
  }
}
var jd = function() {
  function a(a, b, d, i) {
    var k = ca.call(j, a);
    return u(u(k) ? b.hasOwnProperty(a) : k) ? d : i
  }
  function b(a, b) {
    return d.call(j, a, b, h, l)
  }
  var d = j, d = function(d, f, g, i) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 4:
        return a.call(this, d, f, g, i)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.J = a;
  return d
}();
function kd(a, b) {
  var d = zb.call(j, a), e = zb.call(j, b);
  return d < e ? -1 : d > e ? 1 : 0
}
function ld(a, b, d) {
  this.f = a;
  this.keys = b;
  this.Q = d
}
q = ld.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.N = function(a, b) {
  return y.call(j, a, b, j)
};
q.O = function(a, b, d) {
  return jd.call(j, b, this.Q, this.Q[b], d)
};
q.S = function(a, b, d) {
  if(u(ca.call(j, b))) {
    var a = oa.call(j, this.Q), e = a.hasOwnProperty(b);
    a[b] = d;
    if(u(e)) {
      return new ld(this.f, this.keys, a)
    }
    d = xa.call(j, this.keys);
    d.push(b);
    return new ld(this.f, d, a)
  }
  return wb.call(j, Lc.call(j, gb.call(j, b, d), C.call(j, a)), this.f)
};
q.ka = function(a, b) {
  return jd.call(j, b, this.Q)
};
q.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(j, this, b);
      case 3:
        return y.call(j, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
q.B = h;
q.t = function(a, b) {
  return u(Fb.call(j, b)) ? La.call(j, a, x.call(j, b, 0), x.call(j, b, 1)) : N.call(j, Ba, a, b)
};
q.z = function() {
  var a = this;
  return 0 < a.keys.length ? Ac.call(j, function(b) {
    return T.call(j, b, a.Q[b])
  }, a.keys.sort(kd)) : j
};
q.F = function() {
  return this.keys.length
};
q.j = function(a, b) {
  return hd.call(j, a, b)
};
q.C = function(a, b) {
  return new ld(b, this.keys, this.Q)
};
q.u = h;
q.v = m("f");
q.L = function() {
  return wb.call(j, md, this.f)
};
q.aa = h;
q.V = function(a, b) {
  var d = ca.call(j, b);
  if(u(u(d) ? this.Q.hasOwnProperty(b) : d)) {
    var d = xa.call(j, this.keys), e = oa.call(j, this.Q);
    d.splice(id.call(j, 1, b, d), 1);
    Lb.call(j, e, b);
    return new ld(this.f, d, e)
  }
  return a
};
var md = new ld(j, [], Gb.call(j));
function U(a, b) {
  return new ld(j, a, b)
}
function nd(a, b, d) {
  this.f = a;
  this.G = b;
  this.K = d
}
q = nd.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.N = function(a, b) {
  return y.call(j, a, b, j)
};
q.O = function(a, b, d) {
  a = this.K[zb.call(j, b)];
  b = u(a) ? id.call(j, 2, b, a) : j;
  return u(b) ? a[b + 1] : d
};
q.S = function(a, b, d) {
  var a = zb.call(j, b), e = this.K[a];
  if(u(e)) {
    var e = xa.call(j, e), f = oa.call(j, this.K);
    f[a] = e;
    a = id.call(j, 2, b, e);
    if(u(a)) {
      return e[a + 1] = d, new nd(this.f, this.G, f)
    }
    e.push(b, d);
    return new nd(this.f, this.G + 1, f)
  }
  e = oa.call(j, this.K);
  e[a] = [b, d];
  return new nd(this.f, this.G + 1, e)
};
q.ka = function(a, b) {
  var d = this.K[zb.call(j, b)], d = u(d) ? id.call(j, 2, b, d) : j;
  return u(d) ? h : l
};
q.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(j, this, b);
      case 3:
        return y.call(j, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
q.B = h;
q.t = function(a, b) {
  return u(Fb.call(j, b)) ? La.call(j, a, x.call(j, b, 0), x.call(j, b, 1)) : N.call(j, Ba, a, b)
};
q.z = function() {
  var a = this;
  if(0 < a.G) {
    var b = Hb.call(j, a.K).sort();
    return Ic.call(j, function(b) {
      return Ac.call(j, dd, Nc.call(j, 2, a.K[b]))
    }, b)
  }
  return j
};
q.F = m("G");
q.j = function(a, b) {
  return hd.call(j, a, b)
};
q.C = function(a, b) {
  return new nd(b, this.G, this.K)
};
q.u = h;
q.v = m("f");
q.L = function() {
  return wb.call(j, od, this.f)
};
q.aa = h;
q.V = function(a, b) {
  var d = zb.call(j, b), e = this.K[d], f = u(e) ? id.call(j, 2, b, e) : j;
  if(u(G.call(j, f))) {
    return a
  }
  var g = oa.call(j, this.K);
  3 > e.length ? Lb.call(j, g, d) : (e = xa.call(j, e), e.splice(f, 2), g[d] = e);
  return new nd(this.f, this.G - 1, g)
};
var od = new nd(j, 0, Gb.call(j)), gb = function() {
  function a(a) {
    var e = j;
    s(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    for(var a = C.call(j, a), b = od;;) {
      if(u(a)) {
        var f = sb.call(j, a), b = ub.call(j, b, D.call(j, a), rb.call(j, a)), a = f
      }else {
        return b
      }
    }
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return b.call(this, a)
  };
  return a
}();
function pd(a) {
  return C.call(j, Ac.call(j, D, a))
}
var qd = function() {
  function a(a) {
    var e = j;
    s(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    return u(yc.call(j, zc, a)) ? N.call(j, function(a, b) {
      return H.call(j, u(a) ? a : U([], {}), b)
    }, a) : j
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return b.call(this, a)
  };
  return a
}();
function rd(a, b) {
  this.f = a;
  this.ca = b
}
q = rd.prototype;
q.k = function(a) {
  return ob.call(j, a)
};
q.N = function(a, b) {
  return y.call(j, a, b, j)
};
q.O = function(a, b, d) {
  return u(Ka.call(j, this.ca, b)) ? b : d
};
q.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(j, this, b);
      case 3:
        return y.call(j, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
q.B = h;
q.t = function(a, b) {
  return new rd(this.f, ub.call(j, this.ca, b, j))
};
q.z = function() {
  return pd.call(j, this.ca)
};
q.xa = h;
q.ua = function(a, b) {
  return new rd(this.f, vb.call(j, this.ca, b))
};
q.F = function(a) {
  return I.call(j, C.call(j, a))
};
q.j = function(a, b) {
  var d = Cb.call(j, b);
  return u(d) ? (d = z.call(j, I.call(j, a), I.call(j, b)), u(d) ? xc.call(j, function(b) {
    return Sb.call(j, a, b)
  }, b) : d) : d
};
q.C = function(a, b) {
  return new rd(b, this.ca)
};
q.u = h;
q.v = m("f");
q.L = function() {
  return wb.call(j, sd, this.f)
};
var sd = new rd(j, gb.call(j));
function td(a) {
  for(var a = C.call(j, a), b = sd;;) {
    if(u(G.call(j, Ab.call(j, a)))) {
      var d = E.call(j, a), b = H.call(j, b, D.call(j, a)), a = d
    }else {
      return b
    }
  }
}
function ud(a) {
  if(u(Pb.call(j, a))) {
    return a
  }
  var b;
  b = Qb.call(j, a);
  b = u(b) ? b : Rb.call(j, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), 0 > b ? cc.call(j, a, 2) : cc.call(j, a, b + 1)
  }
  c(Error(O.call(j, "Doesn't support name: ", a)))
}
function vd(a) {
  var b;
  b = Qb.call(j, a);
  b = u(b) ? b : Rb.call(j, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), -1 < b ? cc.call(j, a, 2, b) : j
  }
  c(Error(O.call(j, "Doesn't support namespace: ", a)))
}
function wd(a, b) {
  var d = a.exec(b);
  return u(z.call(j, D.call(j, d), b)) ? u(z.call(j, I.call(j, d), 1)) ? D.call(j, d) : dd.call(j, d) : j
}
function xd(a, b) {
  var d = a.exec(b);
  return d === j ? j : u(z.call(j, I.call(j, d), 1)) ? D.call(j, d) : dd.call(j, d)
}
function V(a, b, d, e, f, g) {
  return pc.call(j, S([b]), Hc.call(j, Gc.call(j, S([d]), Ac.call(j, function(b) {
    return a.call(j, b, f)
  }, g))), S([e]))
}
function yd(a) {
  va.call(j, a);
  return j
}
function zd() {
  return j
}
var Bd = function Ad(b, d) {
  return b === j ? hb.call(j, "nil") : void 0 === b ? hb.call(j, "#<undefined>") : pc.call(j, u(function() {
    var e = K.call(j, d, "\ufdd0'meta");
    return u(e) ? (u(b) ? (e = b.u, e = u(e) ? G.call(j, b.hasOwnProperty("cljs$core$IMeta$")) : e) : e = b, e = u(e) ? h : wa.call(j, Ua, b), u(e) ? xb.call(j, b) : e) : e
  }()) ? pc.call(j, S(["^"]), Ad.call(j, xb.call(j, b), d), S([" "])) : j, u(function() {
    var d;
    u(b) ? (d = b.w, d = u(d) ? G.call(j, b.hasOwnProperty("cljs$core$IPrintable$")) : d) : d = b;
    return u(d) ? h : wa.call(j, cb, b)
  }()) ? db.call(j, b, d) : hb.call(j, "#<", O.call(j, b), ">"))
};
function Cd(a, b) {
  var d = D.call(j, a), e = new ua, f = C.call(j, a);
  if(u(f)) {
    for(var g = D.call(j, f);;) {
      g !== d && e.append(" ");
      var i = C.call(j, Bd.call(j, g, b));
      if(u(i)) {
        for(g = D.call(j, i);;) {
          if(e.append(g), g = F.call(j, i), u(g)) {
            i = g, g = D.call(j, i)
          }else {
            break
          }
        }
      }
      f = F.call(j, f);
      if(u(f)) {
        g = f, f = D.call(j, g), i = g, g = f, f = i
      }else {
        break
      }
    }
  }
  return e
}
function Dd(a, b) {
  return O.call(j, Cd.call(j, a, b))
}
function Ed(a, b) {
  var d = D.call(j, a), e = C.call(j, a);
  if(u(e)) {
    for(var f = D.call(j, e);;) {
      f !== d && yd.call(j, " ");
      var g = C.call(j, Bd.call(j, f, b));
      if(u(g)) {
        for(f = D.call(j, g);;) {
          if(yd.call(j, f), f = F.call(j, g), u(f)) {
            g = f, f = D.call(j, g)
          }else {
            break
          }
        }
      }
      e = F.call(j, e);
      if(u(e)) {
        f = e, e = D.call(j, f), g = f, f = e, e = g
      }else {
        return j
      }
    }
  }else {
    return j
  }
}
function Fd(a) {
  yd.call(j, "\n");
  return u(K.call(j, a, "\ufdd0'flush-on-newline")) ? zd.call(j) : j
}
function Gd() {
  return U(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":h, "\ufdd0'readably":h, "\ufdd0'meta":l, "\ufdd0'dup":l})
}
var Hd = function() {
  function a(a) {
    var d = j;
    s(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return Dd.call(j, d, Gd.call(j))
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return Dd.call(j, a, Gd.call(j))
  };
  return a
}(), Id = function() {
  function a(a) {
    var d = j;
    s(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return Ed.call(j, d, Gd.call(j))
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return Ed.call(j, a, Gd.call(j))
  };
  return a
}(), Jd = function() {
  function a(a) {
    var e = j;
    s(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    Ed.call(j, a, Gd.call(j));
    return Fd.call(j, Gd.call(j))
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return b.call(this, a)
  };
  return a
}();
nd.prototype.w = h;
nd.prototype.l = function(a, b) {
  return V.call(j, function(a) {
    return V.call(j, Bd, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cb.number = h;
db.number = function(a) {
  return hb.call(j, O.call(j, a))
};
nb.prototype.w = h;
nb.prototype.l = function(a, b) {
  return V.call(j, Bd, "(", " ", ")", b, a)
};
P.prototype.w = h;
P.prototype.l = function(a, b) {
  return V.call(j, Bd, "(", " ", ")", b, a)
};
cb["boolean"] = h;
db["boolean"] = function(a) {
  return hb.call(j, O.call(j, a))
};
rd.prototype.w = h;
rd.prototype.l = function(a, b) {
  return V.call(j, Bd, "#{", " ", "}", b, a)
};
cb.string = h;
db.string = function(a, b) {
  return u(Qb.call(j, a)) ? hb.call(j, O.call(j, ":", function() {
    var b = vd.call(j, a);
    return u(b) ? O.call(j, b, "/") : j
  }(), ud.call(j, a))) : u(Rb.call(j, a)) ? hb.call(j, O.call(j, function() {
    var b = vd.call(j, a);
    return u(b) ? O.call(j, b, "/") : j
  }(), ud.call(j, a))) : hb.call(j, u("\ufdd0'readably".call(j, b)) ? ka.call(j, a) : a)
};
bd.prototype.w = h;
bd.prototype.l = function(a, b) {
  return V.call(j, Bd, "[", " ", "]", b, a)
};
fc.prototype.w = h;
fc.prototype.l = function(a, b) {
  return V.call(j, Bd, "(", " ", ")", b, a)
};
cb.array = h;
db.array = function(a, b) {
  return V.call(j, Bd, "#<Array [", ", ", "]>", b, a)
};
cb["function"] = h;
db["function"] = function(a) {
  return hb.call(j, "#<", O.call(j, a), ">")
};
hc.prototype.w = h;
hc.prototype.l = function() {
  return hb.call(j, "()")
};
jc.prototype.w = h;
jc.prototype.l = function(a, b) {
  return V.call(j, Bd, "(", " ", ")", b, a)
};
ld.prototype.w = h;
ld.prototype.l = function(a, b) {
  return V.call(j, function(a) {
    return V.call(j, Bd, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
function Kd(a, b, d, e) {
  this.state = a;
  this.f = b;
  this.Da = d;
  this.Ea = e
}
q = Kd.prototype;
q.k = function(a) {
  return ea.call(j, a)
};
q.va = function(a, b, d) {
  var e = C.call(j, this.Ea);
  if(u(e)) {
    var f = D.call(j, e);
    J.call(j, f, 0, j);
    for(J.call(j, f, 1, j);;) {
      var g = f, f = J.call(j, g, 0, j), g = J.call(j, g, 1, j);
      g.call(j, f, a, b, d);
      e = F.call(j, e);
      if(u(e)) {
        f = e, e = D.call(j, f), g = f, f = e, e = g
      }else {
        return j
      }
    }
  }else {
    return j
  }
};
q.w = h;
q.l = function(a, b) {
  return pc.call(j, S(["#<Atom: "]), db.call(j, this.state, b), ">")
};
q.u = h;
q.v = m("f");
q.wa = m("state");
q.j = function(a, b) {
  return a === b
};
var X = function() {
  function a(a) {
    return new Kd(a, j, j, j)
  }
  var b = j, d = function() {
    function a(d, e) {
      var k = j;
      s(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, d, k)
    }
    function b(a, d) {
      var e = u(Nb.call(j, d)) ? Q.call(j, gb, d) : d, f = K.call(j, e, "\ufdd0'validator"), e = K.call(j, e, "\ufdd0'meta");
      return new Kd(a, e, f, j)
    }
    a.d = 1;
    a.b = function(a) {
      var d = D(a), a = E(a);
      return b.call(this, d, a)
    };
    return a
  }(), b = function(b, f) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      default:
        return d.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  b.d = 1;
  b.b = d.b;
  b.g = a;
  b.a = d;
  return b
}();
function Ld(a, b) {
  var d = a.Da;
  u(d) && !u(d.call(j, b)) && c(Error(O.call(j, "Assert failed: ", "Validator rejected reference state", "\n", Hd.call(j, wb(hb("\ufdd1'validate", "\ufdd1'new-value"), gb("\ufdd0'line", 3282))))));
  d = a.state;
  a.state = b;
  eb.call(j, a, d, b);
  return b
}
var Z = function() {
  function a(a, b, d, e, f) {
    return Ld.call(j, a, b.call(j, a.state, d, e, f))
  }
  function b(a, b, d, e) {
    return Ld.call(j, a, b.call(j, a.state, d, e))
  }
  function d(a, b, d) {
    return Ld.call(j, a, b.call(j, a.state, d))
  }
  function e(a, b) {
    return Ld.call(j, a, b.call(j, a.state))
  }
  var f = j, g = function() {
    function a(b, d, e, f, g, i) {
      var L = j;
      s(i) && (L = B(Array.prototype.slice.call(arguments, 5), 0));
      return Ld.call(j, b, Q.call(j, d, b.state, e, f, g, L))
    }
    a.d = 5;
    a.b = function(a) {
      var b = D(a), d = D(F(a)), e = D(F(F(a))), f = D(F(F(F(a)))), g = D(F(F(F(F(a))))), a = E(F(F(F(F(a)))));
      return Ld.call(j, b, Q.call(j, d, b.state, e, f, g, a))
    };
    return a
  }(), f = function(f, k, n, o, t, w) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, n);
      case 4:
        return b.call(this, f, k, n, o);
      case 5:
        return a.call(this, f, k, n, o, t);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.J = b;
  f.pa = a;
  f.za = g;
  return f
}();
function $(a) {
  return Ta.call(j, a)
}
var Yb = function() {
  function a(a) {
    return Math.random() * a
  }
  function b() {
    return d.call(j, 1)
  }
  var d = j, d = function(d) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, d)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.P = b;
  d.g = a;
  return d
}(), Zb = function(a) {
  return Math.floor(Math.random() * a)
}, Md = X.call(j, function() {
  return U(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":U([], {}), "\ufdd0'descendants":U([], {}), "\ufdd0'ancestors":U([], {})})
}.call(j)), Nd = function() {
  function a(a, b, g) {
    var i = z.call(j, b, g);
    if(u(i)) {
      return i
    }
    i = Sb.call(j, "\ufdd0'ancestors".call(j, a).call(j, b), g);
    if(u(i)) {
      return i
    }
    i = Fb.call(j, g);
    if(u(i)) {
      if(i = Fb.call(j, b), u(i)) {
        if(i = z.call(j, I.call(j, g), I.call(j, b)), u(i)) {
          for(var i = h, k = 0;;) {
            var n;
            n = G.call(j, i);
            n = u(n) ? n : z.call(j, k, I.call(j, g));
            if(u(n)) {
              return i
            }
            i = d.call(j, a, b.call(j, k), g.call(j, k));
            k += 1
          }
        }else {
          return i
        }
      }else {
        return i
      }
    }else {
      return i
    }
  }
  function b(a, b) {
    return d.call(j, $.call(j, Md), a, b)
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), Od = function() {
  function a(a, b) {
    return wc.call(j, K.call(j, "\ufdd0'parents".call(j, a), b))
  }
  function b(a) {
    return d.call(j, $.call(j, Md), a)
  }
  var d = j, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.g = b;
  d.a = a;
  return d
}();
function Pd(a, b, d, e) {
  Z.call(j, a, function() {
    return $.call(j, b)
  });
  return Z.call(j, d, function() {
    return $.call(j, e)
  })
}
var Rd = function Qd(b, d, e) {
  var f = $.call(j, e).call(j, b), f = u(u(f) ? f.call(j, d) : f) ? h : j;
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = Od.call(j, d);;) {
      if(0 < I.call(j, f)) {
        Qd.call(j, b, D.call(j, f), e), f = E.call(j, f)
      }else {
        return j
      }
    }
  }();
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = Od.call(j, b);;) {
      if(0 < I.call(j, f)) {
        Qd.call(j, D.call(j, f), d, e), f = E.call(j, f)
      }else {
        return j
      }
    }
  }();
  return u(f) ? f : l
};
function Sd(a, b, d) {
  d = Rd.call(j, a, b, d);
  return u(d) ? d : Nd.call(j, a, b)
}
var Ud = function Td(b, d, e, f, g, i, k) {
  var n = N.call(j, function(e, f) {
    var i = J.call(j, f, 0, j);
    J.call(j, f, 1, j);
    if(u(Nd.call(j, d, i))) {
      var k;
      k = (k = e === j) ? k : Sd.call(j, i, D.call(j, e), g);
      k = u(k) ? f : e;
      u(Sd.call(j, D.call(j, k), i, g)) || c(Error(O.call(j, "Multiple methods in multimethod '", b, "' match dispatch value: ", d, " -> ", i, " and ", D.call(j, k), ", and neither is preferred")));
      return k
    }
    return e
  }, j, $.call(j, f));
  if(u(n)) {
    if(u(z.call(j, $.call(j, k), $.call(j, e)))) {
      return Z.call(j, i, ub, d, rb.call(j, n)), rb.call(j, n)
    }
    Pd.call(j, i, f, k, e);
    return Td.call(j, b, d, e, f, g, i, k)
  }
  return j
};
function Vd(a, b, d) {
  if(a ? a.ra : a) {
    a = a.ra(a, b, d)
  }else {
    var e;
    var f = Vd[r.call(j, a)];
    f ? e = f : (f = Vd._) ? e = f : c(v.call(j, "IMultiFn.-add-method", a));
    a = e.call(j, a, b, d)
  }
  return a
}
function Wd(a, b) {
  var d;
  if(a ? a.ta : a) {
    d = a.ta(0, b)
  }else {
    var e = Wd[r.call(j, a)];
    e ? d = e : (e = Wd._) ? d = e : c(v.call(j, "IMultiFn.-get-method", a));
    d = d.call(j, a, b)
  }
  return d
}
function Xd(a, b) {
  var d;
  if(a ? a.sa : a) {
    d = a.sa(a, b)
  }else {
    var e = Xd[r.call(j, a)];
    e ? d = e : (e = Xd._) ? d = e : c(v.call(j, "IMultiFn.-dispatch", a));
    d = d.call(j, a, b)
  }
  return d
}
function Yd(a, b, d) {
  b = Q.call(j, b, d);
  a = Wd.call(j, a, b);
  u(a) || c(Error(O.call(j, "No method in multimethod '", ud, "' for dispatch value: ", b)));
  return Q.call(j, a, d)
}
function Zd(a, b, d, e, f, g, i, k) {
  this.name = a;
  this.Ba = b;
  this.Aa = d;
  this.ha = e;
  this.da = f;
  this.Ca = g;
  this.ia = i;
  this.ea = k
}
q = Zd.prototype;
q.k = function(a) {
  return ea.call(j, a)
};
q.ra = function(a, b, d) {
  Z.call(j, this.da, ub, b, d);
  Pd.call(j, this.ia, this.da, this.ea, this.ha);
  return a
};
q.ta = function(a, b) {
  u(z.call(j, $.call(j, this.ea), $.call(j, this.ha))) || Pd.call(j, this.ia, this.da, this.ea, this.ha);
  var d = $.call(j, this.ia).call(j, b);
  if(u(d)) {
    return d
  }
  d = Ud.call(j, this.name, b, this.ha, this.da, this.Ca, this.ia, this.ea);
  return u(d) ? d : $.call(j, this.da).call(j, this.Aa)
};
q.sa = function(a, b) {
  return Yd.call(j, a, this.Ba, b)
};
q.call = function() {
  function a(a, d) {
    var e = j;
    s(d) && (e = B(Array.prototype.slice.call(arguments, 1), 0));
    return Xd.call(j, this, e)
  }
  a.d = 1;
  a.b = function(a) {
    D(a);
    a = E(a);
    return Xd.call(j, this, a)
  };
  return a
}();
q.apply = function(a, b) {
  return Xd.call(j, this, b)
};
function $d() {
  return ba.navigator ? ba.navigator.userAgent : j
}
sa = ra = qa = pa = l;
var ae;
if(ae = $d()) {
  var be = ba.navigator;
  pa = 0 == ae.indexOf("Opera");
  qa = !pa && -1 != ae.indexOf("MSIE");
  ra = !pa && -1 != ae.indexOf("WebKit");
  sa = !pa && !ra && "Gecko" == be.product
}
var ce = qa, de = sa, ee = ra, fe;
a: {
  var ge = "", ie;
  if(pa && ba.opera) {
    var je = ba.opera.version, ge = "function" == typeof je ? je() : je
  }else {
    if(de ? ie = /rv\:([^\);]+)(\)|;)/ : ce ? ie = /MSIE\s+([^\);]+)(\)|;)/ : ee && (ie = /WebKit\/(\S+)/), ie) {
      var ke = ie.exec($d()), ge = ke ? ke[1] : ""
    }
  }
  if(ce) {
    var le, me = ba.document;
    le = me ? me.documentMode : void 0;
    if(le > parseFloat(ge)) {
      fe = "" + le;
      break a
    }
  }
  fe = ge
}
var ne = {};
function oe(a) {
  var b;
  if(!(b = ne[a])) {
    b = 0;
    for(var d = ("" + fe).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), g = 0;0 == b && g < f;g++) {
      var i = d[g] || "", k = e[g] || "", n = RegExp("(\\d*)(\\D*)", "g"), o = RegExp("(\\d*)(\\D*)", "g");
      do {
        var t = n.exec(i) || ["", "", ""], w = o.exec(k) || ["", "", ""];
        if(0 == t[0].length && 0 == w[0].length) {
          break
        }
        b = ((0 == t[1].length ? 0 : parseInt(t[1], 10)) < (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? -1 : (0 == t[1].length ? 0 : parseInt(t[1], 10)) > (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? 1 : 0) || ((0 == t[2].length) < (0 == w[2].length) ? -1 : (0 == t[2].length) > (0 == w[2].length) ? 1 : 0) || (t[2] < w[2] ? -1 : t[2] > w[2] ? 1 : 0)
      }while(0 == b)
    }
    b = ne[a] = 0 <= b
  }
  return b
}
;!ce || oe("9");
!de && !ce || ce && oe("9") || de && oe("1.9.1");
ce && oe("9");
function pe(a) {
  return document.createTextNode(a)
}
function qe(a, b) {
  a.appendChild(b)
}
;function re(a, b, d) {
  if(u(Pb.call(j, b))) {
    return a.replace(RegExp(la.call(j, b), "g"), d)
  }
  if(u(b.hasOwnProperty("source"))) {
    return a.replace(RegExp(b.source, "g"), d)
  }
  c(O.call(j, "Invalid match arg: ", b))
}
var se = function() {
  function a(a, b, d) {
    if(1 > d) {
      return dd.call(j, O.call(j, a).split(b))
    }
    for(var i = S([]);;) {
      if(u(z.call(j, d, 1))) {
        return H.call(j, i, a)
      }
      var k = xd.call(j, b, a);
      if(u(k)) {
        var n = k, k = a.indexOf(n), n = a.substring(k + I.call(j, n)), d = d - 1, i = H.call(j, i, a.substring(0, k)), a = n
      }else {
        return H.call(j, i, a)
      }
    }
  }
  function b(a, b) {
    return dd.call(j, O.call(j, a).split(b))
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}();
var te = U(["\ufdd0'xhtml", "\ufdd0'svg"], {"\ufdd0'xhtml":"http://www.w3.org/1999/xhtml", "\ufdd0'svg":"http://www.w3.org/2000/svg"}), ue = X.call(j, 0), ve = function() {
  function a(a, b, d) {
    a.setAttribute(ud.call(j, b), d);
    return a
  }
  function b(a, b) {
    if(u(a)) {
      if(u(G.call(j, Eb.call(j, b)))) {
        return a.getAttribute(ud.call(j, b))
      }
      var g = C.call(j, b);
      if(u(g)) {
        var i = D.call(j, g);
        J.call(j, i, 0, j);
        for(J.call(j, i, 1, j);;) {
          var k = i, i = J.call(j, k, 0, j), k = J.call(j, k, 1, j);
          d.call(j, a, i, k);
          g = F.call(j, g);
          if(u(g)) {
            i = g, g = D.call(j, i), k = i, i = g, g = k
          }else {
            break
          }
        }
      }
      return a
    }
    return j
  }
  var d = j, d = function(d, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 3:
        return a.call(this, d, f, g)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.c = a;
  return d
}(), ye = function we(b, d) {
  var e = C.call(j, d);
  if(u(e)) {
    for(var f = D.call(j, e);;) {
      if(f === j ? f = j : (u(Eb.call(j, f)) && c("Maps cannot be used as content"), f = u(Pb.call(j, f)) ? pe.call(j, f) : u(Fb.call(j, f)) ? xe.call(j, f) : u(Nb.call(j, f)) ? we.call(j, b, f) : u(f.nodeName) ? f : j), u(f) && qe.call(j, b, f), f = F.call(j, e), u(f)) {
        e = f, f = D.call(j, e)
      }else {
        return j
      }
    }
  }else {
    return j
  }
}, ze = /([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?/;
function Ae(a) {
  var b = J.call(j, a, 0, j), a = ac.call(j, a, 1);
  u(G.call(j, function() {
    var a = Qb.call(j, b);
    if(u(a)) {
      return a
    }
    a = Rb.call(j, b);
    return u(a) ? a : Pb.call(j, b)
  }())) && c(O.call(j, b, " is not a valid tag name."));
  var d = wd.call(j, ze, ud.call(j, b));
  J.call(j, d, 0, j);
  var e = J.call(j, d, 1, j), f = J.call(j, d, 2, j), g = J.call(j, d, 3, j), i = function() {
    var a = se.call(j, e, /:/), b = J.call(j, a, 0, j), a = J.call(j, a, 1, j), d = te.call(j, dc.call(j, b));
    return u(a) ? S([u(d) ? d : b, a]) : S(["\ufdd0'xhtml".call(j, te), b])
  }(), d = J.call(j, i, 0, j), i = J.call(j, i, 1, j), f = Lc.call(j, U([], {}), Kc.call(j, function(a) {
    return G.call(j, rb.call(j, a) === j)
  }, U(["\ufdd0'id", "\ufdd0'class"], {"\ufdd0'id":u(f) ? f : j, "\ufdd0'class":u(g) ? re.call(j, g, /\./, " ") : j}))), g = D.call(j, a);
  return u(Eb.call(j, g)) ? S([d, i, qd.call(j, f, g), F.call(j, a)]) : S([d, i, f, a])
}
function Be(a, b) {
  return document.createElementNS(a, b)
}
function xe(a) {
  var b = Ae.call(j, a), d = J.call(j, b, 0, j), e = J.call(j, b, 1, j), a = J.call(j, b, 2, j), b = J.call(j, b, 3, j), d = Be.call(j, d, e);
  ve.call(j, d, a);
  ye.call(j, d, b);
  return d
}
var Ce = function() {
  function a(a) {
    var e = j;
    s(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    a = Ac.call(j, xe, a);
    return u(rb.call(j, a)) ? a : D.call(j, a)
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return b.call(this, a)
  };
  return a
}();
var De = Z.a(ue, ib);
function Ee(a, b) {
  var d = Ce.call(j, S(["\ufdd0'div#wrapper", S(["\ufdd0'div#content", S(["\ufdd0'h1", "Argh!"]), S(["\ufdd0'div.clearfix", S(["\ufdd0'canvas#screen", U(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":a, "\ufdd0'height":b})]), S(["\ufdd0'div#status", S(["\ufdd0'span#fps"]), S(["\ufdd0'div#minimap", S(["\ufdd0'canvas#ent", U(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":120, "\ufdd0'height":120})]), S(["\ufdd0'canvas#map", U(["\ufdd0'width", "\ufdd0'height"], {"\ufdd0'width":120, "\ufdd0'height":120})])])])]), 
  Fe.call(j)])]));
  d.setAttribute("crateGroup", De);
  return d
}
var Ge = Z.a(ue, ib);
function Fe() {
  var a = Ce.call(j, S(["\ufdd0'div#about", S(["\ufdd0'p", "Control with arrow keys, strafing is possible with A and D. You can also\n      halt the game with ESC."]), S(["\ufdd0'p", 'This "game" was an experiment where I learn what would be necessary\n       to make a game in ClojureScript, which is something I did for ', S(["\ufdd0'a", U(["\ufdd0'href"], {"\ufdd0'href":"http://www.ludumdare.com/compo/"}), "Ludum Dare 23"]), "."]), S(["\ufdd0'p", "Source is ", 
  S(["\ufdd0'a", U(["\ufdd0'href"], {"\ufdd0'href":"https://github.com/thomcc/Argh"}), "located on github"]), ". Do whatever you want with it."]), S(["\ufdd0'p", "It should work best on chrome, but I've also tested in Firefox."])]));
  a.setAttribute("crateGroup", Ge);
  return a
}
;var Ie = function() {
  function a(a, e, f) {
    var g = j;
    s(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g;
    g = console;
    g = u(g) ? $.call(j, a).call(j, "\ufdd0'debug") : g;
    return u(g) ? (a = Q.call(j, O, He.call(j, a), " :: ", b, f), console.log(a)) : j
  }
  a.d = 2;
  a.b = function(a) {
    var e = D(a), f = D(F(a)), a = E(F(a));
    return b.call(this, e, f, a)
  };
  return a
}();
function Je(a) {
  return u(Bb.call(j, a)) ? a : S([a])
}
function Ke() {
  return U(["\ufdd0'in", "\ufdd0'out", "\ufdd0'constraints"], {"\ufdd0'in":S([]), "\ufdd0'out":S([]), "\ufdd0'constraints":S([])})
}
function He(a) {
  return Le.call(j, a, S(["\ufdd0'name"]))
}
function Le(a, b) {
  return Oc.call(j, $.call(j, a), b)
}
function Me(a, b, d) {
  return Z.call(j, a, function(a) {
    return Qc.call(j, a, b, d)
  })
}
var Ne = function() {
  function a(a, e) {
    var f = j;
    s(e) && (f = B(Array.prototype.slice.call(arguments, 1), 0));
    return b.call(this, a, f)
  }
  function b(a, b) {
    return Z.call(j, a, function(a) {
      return Q.call(j, Rc, a, b)
    })
  }
  a.d = 1;
  a.b = function(a) {
    var e = D(a), a = E(a);
    return b.call(this, e, a)
  };
  return a
}();
function Oe(a) {
  return Le.call(j, a, S(["\ufdd0'current"]))
}
function Pe(a, b, d) {
  return Me.call(j, a, S(["\ufdd0'states", b]), d)
}
function Qe(a, b, d) {
  return Me.call(j, a, S(["\ufdd0'events", b]), d)
}
function Re(a, b) {
  return Rc.call(j, a, S(["\ufdd0'in"]), H, b)
}
function Se(a, b) {
  var d = Le.call(j, a, S(["\ufdd0'states", b, "\ufdd0'constraints"]));
  return u(d) ? xc.call(j, function(a) {
    return a.call(j, b)
  }, d) : h
}
var Te = function() {
  function a(a, e, f) {
    var g = j;
    s(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    b = C.call(j, Je.call(j, b));
    if(u(b)) {
      for(var g = D.call(j, b);;) {
        if(u(Se.call(j, a, g))) {
          var i = Le.call(j, a, S(["\ufdd0'states", g, "\ufdd0'in"]));
          Ne.call(j, a, S(["\ufdd0'current"]), H, g);
          Ie.call(j, a, "(set ", O.call(j, g), ") -> ", Hd.call(j, Oe.call(j, a)));
          if(u(C.call(j, i)) && (Ie.call(j, a, "(in ", O.call(j, g), ")"), i = C.call(j, i), u(i))) {
            for(g = D.call(j, i);;) {
              if(Q.call(j, g, f), g = F.call(j, i), u(g)) {
                i = g, g = D.call(j, i)
              }else {
                break
              }
            }
          }
        }
        b = F.call(j, b);
        if(u(b)) {
          g = b, b = D.call(j, g), i = g, g = b, b = i
        }else {
          break
        }
      }
    }
    return a
  }
  a.d = 2;
  a.b = function(a) {
    var e = D(a), f = D(F(a)), a = E(F(a));
    return b.call(this, e, f, a)
  };
  return a
}(), Ue = function() {
  function a(a, e, f) {
    var g = j;
    s(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g = C.call(j, Je.call(j, b));
    if(u(g)) {
      for(b = D.call(j, g);;) {
        var i = Le.call(j, a, S(["\ufdd0'events", b]));
        u(i) && (i = Q.call(j, i, f), Ie.call(j, a, "(trans ", O.call(j, b), ") -> ", Ob.call(j, i), " :: context ", Hd.call(j, f)));
        b = F.call(j, g);
        if(u(b)) {
          g = b, b = D.call(j, g)
        }else {
          return j
        }
      }
    }else {
      return j
    }
  }
  a.d = 2;
  a.b = function(a) {
    var e = D(a), f = D(F(a)), a = E(F(a));
    return b.call(this, e, f, a)
  };
  return a
}();
var Ve = function() {
  function a(a) {
    var e = j;
    s(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    a = J.call(j, a, 0, j);
    return X.call(j, U(["\ufdd0'debug", "\ufdd0'name", "\ufdd0'current", "\ufdd0'states", "\ufdd0'events"], {"\ufdd0'debug":h, "\ufdd0'name":ud.call(j, a), "\ufdd0'current":td([]), "\ufdd0'states":U([], {}), "\ufdd0'events":U([], {})}))
  }
  a.d = 0;
  a.b = function(a) {
    a = C(a);
    return b.call(this, a)
  };
  return a
}().call(j, "\ufdd0'page"), We = X.g(U([], {}));
function Xe(a) {
  var b = K.a($(We), a);
  if(u(b)) {
    return b
  }
  b = document.getElementById(ud(a));
  Z.J(We, ub, a, b);
  return b
}
var Ye = U(["\ufdd0'wall", "\ufdd0'test", "\ufdd0'test2", "\ufdd0'floor", "\ufdd0'step"], {"\ufdd0'wall":"res/wallnew.png", "\ufdd0'test":"res/test.png", "\ufdd0'test2":"res/testgrad.png", "\ufdd0'floor":"res/wallnew.png", "\ufdd0'step":"res/step.wav"}), va = function(a) {
  return console.log(a)
};
function Ze(a, b, d, e, f) {
  this.I = a;
  this.H = b;
  this.data = d;
  this.h = e;
  this.e = f;
  3 < arguments.length ? (this.h = e, this.e = f) : this.e = this.h = j
}
q = Ze.prototype;
q.k = function(a) {
  return ob(a)
};
q.N = function(a, b) {
  return y.c(a, b, j)
};
q.O = function(a, b, d) {
  return"\ufdd0'w" === b ? this.I : "\ufdd0'h" === b ? this.H : "\ufdd0'data" === b ? this.data : K.c(this.e, b, d)
};
q.S = function(a, b, d) {
  return u(fb.call(j, "\ufdd0'w", b)) ? new Ze(d, this.H, this.data, this.h, this.e) : u(fb.call(j, "\ufdd0'h", b)) ? new Ze(this.I, d, this.data, this.h, this.e) : u(fb.call(j, "\ufdd0'data", b)) ? new Ze(this.I, this.H, d, this.h, this.e) : new Ze(this.I, this.H, this.data, this.h, ub.c(this.e, b, d))
};
q.call = function(a, b, d) {
  a = (a = -1 < b) ? b < this.I : a;
  u(a) && (a = (a = -1 < d) ? d < this.H : a);
  return u(a) ? this.data[d][b] : 2
};
q.B = h;
q.t = function(a, b) {
  return u(Fb(b)) ? La(a, x.a(b, 0), x.a(b, 1)) : N.c(Ba, a, b)
};
q.toString = function() {
  for(var a = [O("Width: ", this.I, ". Height: ", this.H, ".")], b = this.H, d = 0;;) {
    if(d < b) {
      for(var e = [], f = this.data[d], g = this.I, i = 0;;) {
        if(i < g) {
          e.push(function() {
            var a = f[i];
            return u($b.call(j, 0, a)) ? "." : u($b.call(j, 1, a)) ? "#" : u($b.call(j, 2, a)) ? "$" : "?"
          }()), i += 1
        }else {
          break
        }
      }
      a.push(e.join(""));
      d += 1
    }else {
      break
    }
  }
  return a.join("\n")
};
q.z = function() {
  return C(pc.a(S([T("\ufdd0'w", this.I), T("\ufdd0'h", this.H), T("\ufdd0'data", this.data)]), this.e))
};
q.w = h;
q.l = function(a, b) {
  return V(function(a) {
    return V(Bd, "", " ", "", b, a)
  }, O("#", "argh.level.Level", "{"), ", ", "}", b, pc.a(S([T("\ufdd0'w", this.I), T("\ufdd0'h", this.H), T("\ufdd0'data", this.data)]), this.e))
};
q.F = function() {
  return 3 + I(this.e)
};
q.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? hd(a, b) : d
};
q.C = function(a, b) {
  return new Ze(this.I, this.H, this.data, b, this.e)
};
q.u = h;
q.v = m("h");
q.aa = h;
q.V = function(a, b) {
  return u(Sb(td(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), b)) ? vb.a(wb(Lc(U([], {}), a), this.h), b) : new Ze(this.I, this.H, this.data, this.h, wc(vb.a(this.e, b)))
};
function $e(a, b, d) {
  return new Ze(a, b, d)
}
function af(a, b, d) {
  for(var e = [], f = -1;;) {
    if(1 >= f) {
      for(var g = -1;;) {
        if(1 >= g) {
          var i = g === f, i = G(i ? 0 === f : i);
          u(u(i) ? 0 === d[b + f][a + g] : i) && e.push("\ufdd0'found");
          g += 1
        }else {
          break
        }
      }
      f += 1
    }else {
      break
    }
  }
  return e.length
}
function bf(a, b, d) {
  for(var e = Array(b), f = 0;;) {
    if(f < b) {
      var g = Array(a);
      e[f] = g;
      for(var i = a, k = 0;;) {
        if(k < i) {
          g[k] = d.call(j, k, f), k += 1
        }else {
          break
        }
      }
      f += 1
    }else {
      break
    }
  }
  return e
}
function cf(a, b, d) {
  for(var e = 0;;) {
    if(25E3 > e) {
      var f = Zb(a - 2) + 1, g = Zb(b - 2) + 1;
      d[g][f] = u(rc.a(h, 6 > af(f, g, d))) ? 0 : 1;
      e += 1
    }else {
      break
    }
  }
  return d
}
function df(a, b, d) {
  for(var e = 0;;) {
    if(e < a) {
      d[0][e] = 2, d[b - 1][e] = 2, e += 1
    }else {
      break
    }
  }
  for(e = 0;;) {
    if(e < b) {
      d[e][0] = 2, d[e][a - 1] = 2, e += 1
    }else {
      break
    }
  }
  return d
}
function ef(a, b) {
  return $e(a, b, df(a, b, cf(a, b, bf(a, b, function() {
    return 0.85 > Yb.P() ? 0 : 1
  }))))
}
function ff(a, b) {
  return ef(a, b)
}
function gf(a) {
  var a = u(Nb(a)) ? Q.a(gb, a) : a, b = K.a(a, "\ufdd0'h"), d = K.a(a, "\ufdd0'w"), e;
  a: {
    e = K.a(a, "\ufdd0'data");
    for(var f = xa(e), g = 0;;) {
      if(g < e.length) {
        f[g] = xa(f[g]), g += 1
      }else {
        e = f;
        break a
      }
    }
    e = void 0
  }
  for(var f = X.g(S([-1, -1])), g = X.g(-1), i = 0;;) {
    if(i < d) {
      for(var k = b, n = 0;;) {
        if(n < k) {
          var o = 0 === e[n][i];
          if(o ? 0 === a.call(j, i, n) : o) {
            o = X.g(0), hf.call(j, i, n, a, e, o), $(o) > $(g) && (Ld(g, $(o)), Ld(f, S([i, n])))
          }
          n += 1
        }else {
          break
        }
      }
      i += 1
    }else {
      break
    }
  }
  return $(f)
}
function hf(a, b, d, e, f) {
  for(a = S([S([a, b])]);;) {
    var g = Qa.call(j, a), b = J.c(g, 0, j), g = J.c(g, 1, j);
    if(0 < I(a)) {
      var i = 0 === e[g][b];
      (i ? 0 === d.call(j, b, g) : i) ? (e[g][b] = -1, Z.a(f, ib), a = H.a(H.a(H.a(H.a(Ra.call(j, a), S([b + 1, g])), S([b - 1, g])), S([b, g + 1])), S([b, g - 1]))) : a = Ra.call(j, a)
    }else {
      return j
    }
  }
}
;var jf = X.g(td([])), kf = X.g(U([], {})), lf = X.g(l);
function mf(a, b) {
  Z.J(kf, ub, a, b);
  Z.c(jf, yb, a);
  return u(Ab($(jf))) ? (Ld(lf, h), Ue.call(j, Ve, "\ufdd0'loaded")) : j
}
function nf() {
  return u(G($(lf))) ? (u(h) && Jd("couldn't load everything... gonna go for it regardless"), Ld(lf, h), Z.a(jf, tb), Ue.call(j, Ve, "\ufdd0'loaded")) : u(h) ? Jd("Assets loaded successfully") : j
}
var of = function() {
  var a = X.g(U([], {})), b = X.g(U([], {})), d = X.g(U([], {})), e = X.g(U([], {})), f = K.c(U([], {}), "\ufdd0'hierarchy", Md);
  return new Zd("loaded", function() {
    function a(b, d) {
      s(d) && B(Array.prototype.slice.call(arguments, 1), 0);
      return b
    }
    a.d = 1;
    a.b = function(a) {
      var b = D(a);
      E(a);
      return b
    };
    return a
  }(), "\ufdd0'default", f, a, b, d, e)
}();
Vd(of, "\ufdd0'default", function(a, b, d) {
  return u(h) ? (Jd(O("Don't know what to do with ", a, ", ", b, ".")), Id(d)) : j
});
Vd(of, "\ufdd0'image", function(a, b, d) {
  var a = document.createElement(ud("\ufdd0'canvas")), e = d.width, f = d.height;
  a.width = e;
  a.height = f;
  a.getContext("2d").drawImage(d, 0, 0, e, f);
  return mf(b, a)
});
Vd(of, "\ufdd0'sound", function(a, b, d) {
  return mf(b, function() {
    d.currentTime = 0;
    return d.play()
  })
});
function pf(a) {
  return u(wd.call(j, /(.*)\.(png|gif|jpe?g)/, a)) ? "\ufdd0'image" : u(wd.call(j, /(.*)\.wav/, a)) ? "\ufdd0'sound" : "\ufdd0'unknown"
}
var qf = function() {
  var a = X.g(U([], {})), b = X.g(U([], {})), d = X.g(U([], {})), e = X.g(U([], {})), f = K.c(U([], {}), "\ufdd0'hierarchy", Md);
  return new Zd("load", function(a, b) {
    return pf(b)
  }, "\ufdd0'default", f, a, b, d, e)
}();
Vd(qf, "\ufdd0'default", function(a, b) {
  return u(h) ? Jd(O("Don't know how to load ", a, " from url ", b)) : j
});
Vd(qf, "\ufdd0'image", function(a, b) {
  var d = document.createElement(ud("\ufdd0'img"));
  d.src = b;
  return d.onload = function() {
    return of.call(j, "\ufdd0'image", a, d)
  }
});
Vd(qf, "\ufdd0'sound", function(a, b) {
  var d = new Audio(b);
  return d.addEventListener("canplaythrough", function() {
    return of.call(j, "\ufdd0'sound", a, d)
  })
});
var rf, sf = X.g(U([], {})), tf = X.g(U([], {})), uf = X.g(U([], {})), vf = X.g(U([], {})), wf = K.c(U([], {}), "\ufdd0'hierarchy", Md);
rf = new Zd("temp-asset", pf, "\ufdd0'default", wf, sf, tf, uf, vf);
Vd(rf, "\ufdd0'sound", function() {
  return p(j)
});
Vd(rf, "\ufdd0'image", function() {
  var a = document.createElement(ud("\ufdd0'canvas"));
  a.width = 16;
  a.height = 16;
  return a
});
function xf(a, b, d, e, f, g, i, k, n, o, t) {
  this.x = a;
  this.y = b;
  this.s = d;
  this.m = e;
  this.q = f;
  this.r = g;
  this.n = i;
  this.o = k;
  this.p = n;
  this.h = o;
  this.e = t;
  9 < arguments.length ? (this.h = o, this.e = t) : this.e = this.h = j
}
q = xf.prototype;
q.k = function(a) {
  return ob(a)
};
q.N = function(a, b) {
  return y.c(a, b, j)
};
q.O = function(a, b, d) {
  return"\ufdd0'x" === b ? this.x : "\ufdd0'y" === b ? this.y : "\ufdd0'z" === b ? this.s : "\ufdd0'rot" === b ? this.m : "\ufdd0'xacc" === b ? this.q : "\ufdd0'yacc" === b ? this.r : "\ufdd0'rotacc" === b ? this.n : "\ufdd0'walk" === b ? this.o : "\ufdd0'walkphase" === b ? this.p : K.c(this.e, b, d)
};
q.S = function(a, b, d) {
  return u(fb.call(j, "\ufdd0'x", b)) ? new xf(d, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'y", b)) ? new xf(this.x, d, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'z", b)) ? new xf(this.x, this.y, d, this.m, this.q, this.r, this.n, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'rot", b)) ? new xf(this.x, this.y, this.s, d, this.q, this.r, this.n, this.o, this.p, this.h, this.e) : 
  u(fb.call(j, "\ufdd0'xacc", b)) ? new xf(this.x, this.y, this.s, this.m, d, this.r, this.n, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'yacc", b)) ? new xf(this.x, this.y, this.s, this.m, this.q, d, this.n, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'rotacc", b)) ? new xf(this.x, this.y, this.s, this.m, this.q, this.r, d, this.o, this.p, this.h, this.e) : u(fb.call(j, "\ufdd0'walk", b)) ? new xf(this.x, this.y, this.s, this.m, this.q, this.r, this.n, d, this.p, this.h, this.e) : 
  u(fb.call(j, "\ufdd0'walkphase", b)) ? new xf(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, d, this.h, this.e) : new xf(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.h, ub.c(this.e, b, d))
};
q.B = h;
q.t = function(a, b) {
  return u(Fb(b)) ? La(a, x.a(b, 0), x.a(b, 1)) : N.c(Ba, a, b)
};
q.z = function() {
  return C(pc.a(S([T("\ufdd0'x", this.x), T("\ufdd0'y", this.y), T("\ufdd0'z", this.s), T("\ufdd0'rot", this.m), T("\ufdd0'xacc", this.q), T("\ufdd0'yacc", this.r), T("\ufdd0'rotacc", this.n), T("\ufdd0'walk", this.o), T("\ufdd0'walkphase", this.p)]), this.e))
};
q.w = h;
q.l = function(a, b) {
  return V(function(a) {
    return V(Bd, "", " ", "", b, a)
  }, O("#", "argh.game.Player", "{"), ", ", "}", b, pc.a(S([T("\ufdd0'x", this.x), T("\ufdd0'y", this.y), T("\ufdd0'z", this.s), T("\ufdd0'rot", this.m), T("\ufdd0'xacc", this.q), T("\ufdd0'yacc", this.r), T("\ufdd0'rotacc", this.n), T("\ufdd0'walk", this.o), T("\ufdd0'walkphase", this.p)]), this.e))
};
q.F = function() {
  return 9 + I(this.e)
};
q.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? hd(a, b) : d
};
q.C = function(a, b) {
  return new xf(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, b, this.e)
};
q.u = h;
q.v = m("h");
q.aa = h;
q.V = function(a, b) {
  return u(Sb(td("\ufdd0'z,\ufdd0'y,\ufdd0'x,\ufdd0'xacc,\ufdd0'rot,\ufdd0'yacc,\ufdd0'walkphase,\ufdd0'rotacc,\ufdd0'walk".split(",")), b)) ? vb.a(wb(Lc(U([], {}), a), this.h), b) : new xf(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.h, wc(vb.a(this.e, b)))
};
function yf(a, b, d, e) {
  this.U = a;
  this.T = b;
  this.h = d;
  this.e = e;
  2 < arguments.length ? (this.h = d, this.e = e) : this.e = this.h = j
}
q = yf.prototype;
q.k = function(a) {
  return ob(a)
};
q.N = function(a, b) {
  return y.c(a, b, j)
};
q.O = function(a, b, d) {
  return"\ufdd0'player" === b ? this.U : "\ufdd0'level" === b ? this.T : K.c(this.e, b, d)
};
q.S = function(a, b, d) {
  return u(fb.call(j, "\ufdd0'player", b)) ? new yf(d, this.T, this.h, this.e) : u(fb.call(j, "\ufdd0'level", b)) ? new yf(this.U, d, this.h, this.e) : new yf(this.U, this.T, this.h, ub.c(this.e, b, d))
};
q.B = h;
q.t = function(a, b) {
  return u(Fb(b)) ? La(a, x.a(b, 0), x.a(b, 1)) : N.c(Ba, a, b)
};
q.z = function() {
  return C(pc.a(S([T("\ufdd0'player", this.U), T("\ufdd0'level", this.T)]), this.e))
};
q.w = h;
q.l = function(a, b) {
  return V(function(a) {
    return V(Bd, "", " ", "", b, a)
  }, O("#", "argh.game.Game", "{"), ", ", "}", b, pc.a(S([T("\ufdd0'player", this.U), T("\ufdd0'level", this.T)]), this.e))
};
q.F = function() {
  return 2 + I(this.e)
};
q.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? hd(a, b) : d
};
q.C = function(a, b) {
  return new yf(this.U, this.T, b, this.e)
};
q.u = h;
q.v = m("h");
q.aa = h;
q.V = function(a, b) {
  return u(Sb(td(["\ufdd0'player", "\ufdd0'level"]), b)) ? vb.a(wb(Lc(U([], {}), a), this.h), b) : new yf(this.U, this.T, this.h, wc(vb.a(this.e, b)))
};
function zf(a, b, d) {
  var e = Math.floor.call(j, 0.5 + b - 0.3), f = Math.floor.call(j, 0.5 + b + 0.3), g = Math.floor.call(j, 0.5 + d - 0.3), i = Math.floor.call(j, 0.5 + d + 0.3);
  return G(function() {
    var b = 0 < a.call(j, e, g);
    if(b || (b = 0 < a.call(j, f, g))) {
      return b
    }
    return(b = 0 < a.call(j, e, i)) ? b : 0 < a.call(j, f, i)
  }())
}
function Af(a, b) {
  var d = u(Nb(a)) ? Q.a(gb, a) : a;
  K.a(d, "\ufdd0'rotacc");
  K.a(d, "\ufdd0'rot");
  var e = K.a(d, "\ufdd0'y"), f = K.a(d, "\ufdd0'x"), g = K.a(d, "\ufdd0'yacc"), i = K.a(d, "\ufdd0'xacc"), k = Math.floor.call(j, Math.abs.call(j, 100 * i) + 1), n = function() {
    for(var a = k, d = f, g = i;;) {
      if(0 === a) {
        return S([d, g])
      }
      if(u(zf(b, d + g * (a / k), e))) {
        return S([d + g * (a / k), g])
      }
      a -= 1;
      g = 0
    }
  }(), o = J.c(n, 0, j);
  J.c(n, 1, j);
  var t = Math.floor.call(j, Math.abs.call(j, 100 * g) + 1), n = function() {
    for(var a = t, d = e, i = g;;) {
      if(0 === a) {
        return S([d, i])
      }
      if(u(zf(b, f, d + i * (a / t)))) {
        return S([d + i * (a / t), i])
      }
      a -= 1;
      i = 0
    }
  }(), w = J.c(n, 0, j);
  J.c(n, 1, j);
  return ub(d, "\ufdd0'x", o, "\ufdd0'y", w, "\ufdd0'xacc", i, "\ufdd0'yacc", g)
}
function Bf(a, b, d) {
  return u(a.call(j, d)) ? -1 : u(a.call(j, b)) ? 1 : 0
}
function Cf(a, b) {
  var d = u(Nb(a)) ? Q.a(gb, a) : a, e = K.a(d, "\ufdd0'player"), f = u(Nb(e)) ? Q.a(gb, e) : e, g = K.a(f, "\ufdd0'rotacc"), i = K.a(f, "\ufdd0'rot");
  K.a(f, "\ufdd0'y");
  K.a(f, "\ufdd0'x");
  var e = K.a(d, "\ufdd0'level"), k = Bf(b, "\ufdd0'strafer", "\ufdd0'strafel"), n = Bf(b, "\ufdd0'down", "\ufdd0'up"), o = k * k + n * n, o = 0 < o ? Math.sqrt.call(j, o) : 1, k = k / o, o = n / o, t = 0.05 * Bf(b, "\ufdd0'left", "\ufdd0'right"), n = Math.sqrt.call(j, k * k + o * o), f = Rc(Rc(Rc(Rc(Rc(Rc(f, S(["\ufdd0'walk"]), Wb, 0.6), S(["\ufdd0'walk"]), Ub, n), S(["\ufdd0'walkphase"]), Ub, n), S(["\ufdd0'rotacc"]), Ub, t), S(["\ufdd0'xacc"]), Vb, 0.03 * (k * Math.cos.call(j, i) + o * Math.sin.call(j, 
  i))), S(["\ufdd0'yacc"]), Vb, 0.03 * (o * Math.cos.call(j, i) - k * Math.sin.call(j, i)));
  0.7 < n && K.a($(kf), "\ufdd0'step").call(j);
  return Rc(Qc(d, S(["\ufdd0'player"]), Af(f, e)), S(["\ufdd0'player"]), function(a) {
    return Rc(Rc(Rc(Rc(a, S(["\ufdd0'xacc"]), Wb, 0.6), S(["\ufdd0'yacc"]), Wb, 0.6), S(["\ufdd0'rot"]), Ub, g), S(["\ufdd0'rotacc"]), Wb, 0.4)
  })
}
;function Df(a) {
  return a.getContext("2d").getImageData(0, 0, a.width, a.height)
}
var Ef = function() {
  function a(a, b) {
    var d = a.getContext("2d");
    d.fillStyle = b;
    d.fillRect(0, 0, a.width, a.height);
    return d
  }
  function b(a) {
    var b = a.getContext("2d");
    b.clearRect(0, 0, a.width, a.height);
    return b
  }
  var d = j, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.g = b;
  d.a = a;
  return d
}(), Ff = function() {
  var a = window.Ia;
  if(u(a)) {
    return a
  }
  a = window.Ja;
  if(u(a)) {
    return a
  }
  a = window.Fa;
  if(u(a)) {
    return a
  }
  a = window.Ha;
  if(u(a)) {
    return a
  }
  a = window.Ga;
  return u(a) ? a : function(a) {
    return setTimeout(a, 17)
  }
}();
function Gf(a, b) {
  for(var d = Array(a), e = 0;;) {
    if(e < a) {
      d[e] = b, e += 1
    }else {
      break
    }
  }
  return d
}
function Hf(a, b) {
  function d(a, b, d, e) {
    var f = 2 * (-0.5 - sc), k = 2 * (0.5 - sc), a = 2 * (a - 0.5 - g), b = 2 * (b - 0.5 - i), d = 2 * (d - 0.5 - g), n = 2 * (e - 0.5 - i), e = a * jb - b * kb, o = b * jb + a * kb, a = d * jb - n * kb, n = n * jb + d * kb;
    if((d = 0.2 > o) ? 0.2 > n : d) {
      return j
    }
    var t = 0.2 > o, d = 0.2 > n, b = (0.2 - o) / (n - o), w = t ? e + b * (a - e) : e, o = t ? o + b * (n - o) : o, n = d ? o + b * (n - o) : n, t = t ? 0 + 16 * b : 0, M = d ? 0 + 16 * b : 16, e = ed - w / o * L, w = ed - (d ? w + b * (a - w) : a) / n * L;
    if(e < w) {
      for(var R = 0 > Math.ceil.call(j, e) ? 0 : Math.ceil.call(j, e), a = Y < Math.ceil.call(j, w) ? Y : Math.ceil.call(j, w), d = f / o * L + Ib, b = k / o * L + Ib, f = f / n * L + Ib, k = k / n * L + Ib, o = 1 / o, W = 1 / n, n = W - o, t = t * o, M = M * W - t, w = 1 / (w - e);;) {
        if(R < a) {
          var da = w * (R - e), W = o + n * da;
          if(he[R] <= W) {
            he[R] = W;
            for(var Ya = Math.floor.call(j, (t + M * da) / W), tc = d + da * (f - d) - 0.5, Jb = b + da * (k - b), lb = 0 > Math.ceil.call(j, tc) ? 0 : Math.ceil.call(j, tc), da = L < Math.ceil.call(j, Jb) ? L : Math.ceil.call(j, Jb), Jb = 1 / (Jb - tc);;) {
              if(lb < da) {
                var Kb = Math.floor.call(j, 16 * Jb * (lb - tc)), Kb = 4 * (Ya + 16 * Kb), uc = 4 * (R + lb * Y);
                vc[R + lb * Y] = 4 / W;
                fa[uc] = Mc[Kb];
                fa[1 + uc] = Mc[1 + Kb];
                fa[2 + uc] = Mc[2 + Kb];
                fa[3 + uc] = 255;
                lb += 1
              }else {
                break
              }
            }
          }
          R += 1
        }else {
          return j
        }
      }
    }else {
      return j
    }
  }
  for(var e = u(Nb(a)) ? Q.a(gb, a) : a, f = K.a(e, "\ufdd0'player"), f = u(Nb(f)) ? Q.a(gb, f) : f, g = K.a(f, "\ufdd0'x"), i = K.a(f, "\ufdd0'y"), k = K.a(f, "\ufdd0'z"), n = K.a(f, "\ufdd0'rot"), o = K.a(f, "\ufdd0'walkphase"), t = K.a(f, "\ufdd0'walk"), w = K.a(e, "\ufdd0'level"), Y = b.width, L = b.height, e = b.getContext("2d"), R = Df(K.a($(kf), "\ufdd0'floor")).data, Mc = Df(K.a($(kf), "\ufdd0'wall")).data, f = e.createImageData(Y, L), fa = f.data, vc = Gf(Y * L, 1E4), he = Gf(Y, 0), sc = 
  0.01 * t * Math.sin.call(j, 0.4 * o) - k - 0.2, ed = Y / 2, Ib = L / 3, jb = Math.cos.call(j, n), kb = Math.sin.call(j, n), k = Math.floor.call(j, g), n = Math.floor.call(j, i), o = Y * L, t = 0;;) {
    if(t < o) {
      fa[3 + 4 * t] = 255, t += 1
    }else {
      break
    }
  }
  for(o = n - 6;;) {
    if(o <= n + 6) {
      for(t = k - 6;;) {
        if(t <= k + 6) {
          var M = w.call(j, t + 1, o), W = w.call(j, t, o + 1);
          0 < w.call(j, t, o) ? (0 < M || d.call(j, t + 1, o + 1, t + 1, o), 0 < W || d.call(j, t, o + 1, t + 1, o + 1)) : (0 < M && d.call(j, t + 1, o, t + 1, o + 1), 0 < W && d.call(j, t + 1, o + 1, t, o + 1));
          t += 1
        }else {
          break
        }
      }
      o += 1
    }else {
      break
    }
  }
  for(k = 0;;) {
    if(k < L) {
      o = (k + 0.5 - Ib) / L;
      n = k * Y;
      o = 0 > o ? (4 + 8 * sc) / -o : (4 - 8 * sc) / o;
      t = Y;
      for(M = 0;;) {
        if(M < t) {
          if(vc[M + n] > o) {
            var da = o * ((ed - M) / L), W = 2 * (da * jb + o * kb + 8 * (0.5 + g)), Ya = 2 * (o * jb + -1 * da * kb + 8 * (0.5 + i));
            0 < w.call(j, W >> 4, Ya >> 4) || (da = 4 * (M + n), W = 4 * ((W & 15) + 16 * (Ya & 15)), vc[M + n] = o, fa[da] = R[W], fa[1 + da] = R[1 + W], fa[2 + da] = R[2 + W], fa[3 + da] = 255)
          }
          M += 1
        }else {
          break
        }
      }
      k += 1
    }else {
      break
    }
  }
  w = Y * L;
  for(R = 0;;) {
    if(R < w) {
      M = vc[R], 0 < M && (W = R % Y, da = 14 * Math.floor.call(j, R / Y), Ya = (W - Y / 2) / Y, k = 4 * R, n = fa[k], o = fa[1 + k], t = fa[2 + k], M = Math.floor.call(j, 300 - 6 * M * (2 * Ya * Ya + 1)) + 4 * (W + da & 3) >> 4 << 4, M = 0 > (255 < Math.floor.call(j, M) ? 255 : Math.floor.call(j, M)) ? 0 : 255 < Math.floor.call(j, M) ? 255 : Math.floor.call(j, M), fa[k] = Math.floor.call(j, n * M / 255), fa[1 + k] = Math.floor.call(j, o * M / 255), fa[2 + k] = Math.floor.call(j, t * M / 255)), R += 
      1
    }else {
      break
    }
  }
  return e.putImageData(f, 0, 0)
}
function If(a, b) {
  for(var d = u(Nb(a)) ? Q.a(gb, a) : a, d = K.a(d, "\ufdd0'level"), d = u(Nb(d)) ? Q.a(gb, d) : d, e = K.a(d, "\ufdd0'h"), f = K.a(d, "\ufdd0'w"), g = b.getContext("2d"), i = b.width / f, k = 0;;) {
    if(k < e) {
      for(var n = f, o = 0;;) {
        if(o < n) {
          var t = g, w = S(["white", "gray", "black"]).call(j, d.call(j, o, k));
          t.fillStyle = w;
          t.fillRect(i * o, i * k, i, i);
          o += 1
        }else {
          break
        }
      }
      k += 1
    }else {
      return j
    }
  }
}
function Jf(a, b) {
  var d = u(Nb(a)) ? Q.a(gb, a) : a, e = K.a(d, "\ufdd0'player"), f = u(Nb(e)) ? Q.a(gb, e) : e, e = K.a(f, "\ufdd0'x"), f = K.a(f, "\ufdd0'y"), d = K.a(d, "\ufdd0'level"), d = u(Nb(d)) ? Q.a(gb, d) : d, d = K.a(d, "\ufdd0'w");
  Ef.g(b);
  var d = b.width / d, g = b.getContext("2d");
  g.fillStyle = "green";
  g.fillRect(e * d, f * d, d, d);
  return g
}
;var Kf = X.g(td([])), Lf = X.g(j), Mf = document.createElement("canvas");
Mf.width = 160;
Mf.height = 120;
var Nf = j, Of = j, Pf = X.g((new Date).getTime()), Rf = function Qf() {
  if(u("\ufdd0'escape".call(j, $(Kf)))) {
    return j
  }
  var b = (new Date).getTime(), d = 1E3 / (b - $(Pf)), e = 0.06 * (b - $(Pf)), f = $(Kf);
  Xe("\ufdd0'fps").innerHTML = O(Math.floor.call(j, 100 * d) / 100, " fps");
  Z.a(Lf, function(b) {
    for(var d = e;;) {
      if(0 < d) {
        d -= 1, b = Cf(b, f)
      }else {
        return b
      }
    }
  });
  Ld(Pf, (new Date).getTime());
  Ef.a(Mf, "black");
  Ff.call(j, Qf);
  Hf.call(j, $(Lf), Mf);
  Jf.call(j, $(Lf), Of);
  return Nf.getContext("2d").drawImage(Mf, 0, 0, Nf.width, Nf.height)
}, Sf;
a: {
  for(var Tf = [65, 68, 37, 38, 39, 40, 83, 87, 27], Uf = "\ufdd0'strafel,\ufdd0'strafer,\ufdd0'left,\ufdd0'up,\ufdd0'right,\ufdd0'down,\ufdd0'down,\ufdd0'up,\ufdd0'escape".split(","), Vf = Tf.length, Wf = 0, Xf = od;;) {
    if(Wf < Vf) {
      var Yf = Wf + 1, Zf = ub.call(j, Xf, Tf[Wf], Uf[Wf]), Wf = Yf, Xf = Zf
    }else {
      Sf = Xf;
      break a
    }
  }
  Sf = void 0
}
function $f() {
  function a(a) {
    return function(d) {
      Z.c(Kf, a, Sf.call(j, d.keyCode));
      return d.preventDefault()
    }
  }
  document.onkeydown = a.call(j, H);
  document.onkeyup = a.call(j, yb)
}
function ag(a) {
  Ef.a(Nf, "black");
  var b = Nf, d = b.getContext("2d");
  d.fillStyle = "white";
  d.font = "30px sans-serif";
  d.fillText(a, (b.width - d.measureText(a).width) / 2, b.height / 2)
}
var bg = Re.call(j, Ke.call(j), function() {
  ag("Loading assets...");
  var a = C(Ye);
  if(u(a)) {
    var b = D(a);
    J.c(b, 0, j);
    for(J.c(b, 1, j);;) {
      var d = b, b = J.c(d, 0, j), d = J.c(d, 1, j);
      Z.J(kf, ub, b, rf.call(j, d));
      Z.c(jf, H, b);
      qf.call(j, b, d);
      a = F(a);
      if(u(a)) {
        b = a, a = D(b), d = b, b = a, a = d
      }else {
        break
      }
    }
  }
  return setTimeout(nf, 1E3)
});
Pe.call(j, Ve, "\ufdd0'loading", bg);
var cg = Re.call(j, Ke.call(j), function() {
  ag("Initializing game...");
  Of = Xe("\ufdd0'ent");
  ag("Binding events...");
  $f();
  ag("Generating world...");
  var a = ff.call(j, 60, 60), b, d = gf.call(j, a);
  b = J.c(d, 0, j);
  d = J.c(d, 1, j);
  b = new xf(b, d, 0, Yb.P(), 0, 0, 0, 0, 0);
  Ld(Lf, new yf(b, a));
  If.call(j, $(Lf), Xe("\ufdd0'map"));
  ag("Starting game loop!");
  return Ff.call(j, Rf)
});
Pe.call(j, Ve, "\ufdd0'playing", cg);
Qe.call(j, Ve, "\ufdd0'init", function() {
  document.body.appendChild(Ee.call(j, 640, 480));
  Nf = Xe("\ufdd0'screen");
  return Te.call(j, Ve, "\ufdd0'loading")
});
Qe.call(j, Ve, "\ufdd0'loaded", function() {
  return Te.call(j, Ve, "\ufdd0'playing")
});
Ue.call(j, Ve, "\ufdd0'init");
