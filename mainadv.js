function c(a) {
  throw a;
}
var h = !0, i = null, l = !1;
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
function o(a) {
  return function() {
    return a
  }
}
var p;
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
function t(a) {
  return void 0 !== a
}
function ba(a) {
  return"string" == typeof a
}
function ca(a) {
  return a[ea] || (a[ea] = ++fa)
}
var ea = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), fa = 0;
var ga = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"}, ha = {"'":"\\'"};
function ia(a) {
  var n;
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0), g = b, j = d + 1, k;
    if(!(k = ga[e])) {
      if(!(31 < f && 127 > f)) {
        if(e in ha) {
          e = ha[e]
        }else {
          if(e in ga) {
            n = ha[e] = ga[e], e = n
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
            e = ha[e] = f
          }
        }
      }
      k = e
    }
    g[j] = k
  }
  b.push('"');
  return b.join("")
}
function ja(a) {
  for(var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d), b %= 4294967296
  }
  return b
}
;function ka(a, b, d) {
  for(var e in a) {
    b.call(d, a[e], e, a)
  }
}
function la(a) {
  var b = {}, d;
  for(d in a) {
    b[d] = a[d]
  }
  return b
}
;var ma;
(ma = "ScriptEngine" in this && "JScript" == this.ScriptEngine()) && (this.ScriptEngineMajorVersion(), this.ScriptEngineMinorVersion(), this.ScriptEngineBuildVersion());
function na(a, b) {
  this.A = ma ? [] : "";
  a != i && this.append.apply(this, arguments)
}
ma ? (na.prototype.ha = 0, na.prototype.append = function(a, b, d) {
  b == i ? this.A[this.ha++] = a : (this.A.push.apply(this.A, arguments), this.ha = this.A.length);
  return this
}) : na.prototype.append = function(a, b, d) {
  this.A += a;
  if(b != i) {
    for(var e = 1;e < arguments.length;e++) {
      this.A += arguments[e]
    }
  }
  return this
};
na.prototype.clear = function() {
  ma ? this.ha = this.A.length = 0 : this.A = ""
};
na.prototype.toString = function() {
  if(ma) {
    var a = this.A.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.A
};
function oa() {
  c(Error("No *print-fn* fn set for evaluation environment"))
}
function u(a) {
  return a != i && a !== l
}
function pa(a, b) {
  var d = a[r.call(i, b)];
  if(u(d)) {
    return d
  }
  d = a._;
  return u(d) ? d : l
}
function v(a, b) {
  return Error("No protocol method " + a + " defined for type " + r.call(i, b) + ": " + b)
}
function qa(a) {
  return Array.prototype.slice.call(a)
}
function ra(a) {
  if(a ? a.F : a) {
    a = a.F(a)
  }else {
    var b;
    var d = ra[r.call(i, a)];
    d ? b = d : (d = ra._) ? b = d : c(v.call(i, "ICounted.-count", a));
    a = b.call(i, a)
  }
  return a
}
function sa(a) {
  if(a ? a.K : a) {
    a = a.K(a)
  }else {
    var b;
    var d = sa[r.call(i, a)];
    d ? b = d : (d = sa._) ? b = d : c(v.call(i, "IEmptyableCollection.-empty", a));
    a = b.call(i, a)
  }
  return a
}
var ta = {};
function ua(a, b) {
  var d;
  if(a ? a.t : a) {
    d = a.t(a, b)
  }else {
    var e = ua[r.call(i, a)];
    e ? d = e : (e = ua._) ? d = e : c(v.call(i, "ICollection.-conj", a));
    d = d.call(i, a, b)
  }
  return d
}
var w = function() {
  function a(a, b, d) {
    if(a ? a.ka : a) {
      a = a.ka(a, b, d)
    }else {
      var j;
      var k = w[r.call(i, a)];
      k ? j = k : (k = w._) ? j = k : c(v.call(i, "IIndexed.-nth", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.ja : a) {
      d = a.ja(a, b)
    }else {
      var j = w[r.call(i, a)];
      j ? d = j : (j = w._) ? d = j : c(v.call(i, "IIndexed.-nth", a));
      d = d.call(i, a, b)
    }
    return d
  }
  var d = i, d = function(d, f, g) {
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
}(), va = {};
function wa(a) {
  if(a ? a.W : a) {
    a = a.W(a)
  }else {
    var b;
    var d = wa[r.call(i, a)];
    d ? b = d : (d = wa._) ? b = d : c(v.call(i, "ISeq.-first", a));
    a = b.call(i, a)
  }
  return a
}
function xa(a) {
  if(a ? a.X : a) {
    a = a.X(a)
  }else {
    var b;
    var d = xa[r.call(i, a)];
    d ? b = d : (d = xa._) ? b = d : c(v.call(i, "ISeq.-rest", a));
    a = b.call(i, a)
  }
  return a
}
var y = function() {
  function a(a, b, d) {
    if(a ? a.N : a) {
      a = a.N(a, b, d)
    }else {
      var j;
      var k = y[r.call(i, a)];
      k ? j = k : (k = y._) ? j = k : c(v.call(i, "ILookup.-lookup", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.M : a) {
      d = a.M(a, b)
    }else {
      var j = y[r.call(i, a)];
      j ? d = j : (j = y._) ? d = j : c(v.call(i, "ILookup.-lookup", a));
      d = d.call(i, a, b)
    }
    return d
  }
  var d = i, d = function(d, f, g) {
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
function ya(a, b) {
  var d;
  if(a ? a.ia : a) {
    d = a.ia(a, b)
  }else {
    var e = ya[r.call(i, a)];
    e ? d = e : (e = ya._) ? d = e : c(v.call(i, "IAssociative.-contains-key?", a));
    d = d.call(i, a, b)
  }
  return d
}
function za(a, b, d) {
  if(a ? a.R : a) {
    a = a.R(a, b, d)
  }else {
    var e;
    var f = za[r.call(i, a)];
    f ? e = f : (f = za._) ? e = f : c(v.call(i, "IAssociative.-assoc", a));
    a = e.call(i, a, b, d)
  }
  return a
}
var Aa = {};
function Ba(a, b) {
  var d;
  if(a ? a.V : a) {
    d = a.V(a, b)
  }else {
    var e = Ba[r.call(i, a)];
    e ? d = e : (e = Ba._) ? d = e : c(v.call(i, "IMap.-dissoc", a));
    d = d.call(i, a, b)
  }
  return d
}
var Ca = {};
function Ia(a, b) {
  var d;
  if(a ? a.sa : a) {
    d = a.sa(0, b)
  }else {
    var e = Ia[r.call(i, a)];
    e ? d = e : (e = Ia._) ? d = e : c(v.call(i, "ISet.-disjoin", a));
    d = d.call(i, a, b)
  }
  return d
}
var Ja = {};
function Ka(a) {
  if(a ? a.ua : a) {
    a = a.state
  }else {
    var b;
    var d = Ka[r.call(i, a)];
    d ? b = d : (d = Ka._) ? b = d : c(v.call(i, "IDeref.-deref", a));
    a = b.call(i, a)
  }
  return a
}
var La = {};
function Ma(a) {
  if(a ? a.v : a) {
    a = a.v(a)
  }else {
    var b;
    var d = Ma[r.call(i, a)];
    d ? b = d : (d = Ma._) ? b = d : c(v.call(i, "IMeta.-meta", a));
    a = b.call(i, a)
  }
  return a
}
function Na(a, b) {
  var d;
  if(a ? a.C : a) {
    d = a.C(a, b)
  }else {
    var e = Na[r.call(i, a)];
    e ? d = e : (e = Na._) ? d = e : c(v.call(i, "IWithMeta.-with-meta", a));
    d = d.call(i, a, b)
  }
  return d
}
var Oa = function() {
  function a(a, b, d) {
    if(a ? a.ma : a) {
      a = a.ma(a, b, d)
    }else {
      var j;
      var k = Oa[r.call(i, a)];
      k ? j = k : (k = Oa._) ? j = k : c(v.call(i, "IReduce.-reduce", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.la : a) {
      d = a.la(a, b)
    }else {
      var j = Oa[r.call(i, a)];
      j ? d = j : (j = Oa._) ? d = j : c(v.call(i, "IReduce.-reduce", a));
      d = d.call(i, a, b)
    }
    return d
  }
  var d = i, d = function(d, f, g) {
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
function Pa(a, b) {
  var d;
  if(a ? a.j : a) {
    d = a.j(a, b)
  }else {
    var e = Pa[r.call(i, a)];
    e ? d = e : (e = Pa._) ? d = e : c(v.call(i, "IEquiv.-equiv", a));
    d = d.call(i, a, b)
  }
  return d
}
function Qa(a) {
  if(a ? a.k : a) {
    a = a.k(a)
  }else {
    var b;
    var d = Qa[r.call(i, a)];
    d ? b = d : (d = Qa._) ? b = d : c(v.call(i, "IHash.-hash", a));
    a = b.call(i, a)
  }
  return a
}
function Ra(a) {
  if(a ? a.z : a) {
    a = a.z(a)
  }else {
    var b;
    var d = Ra[r.call(i, a)];
    d ? b = d : (d = Ra._) ? b = d : c(v.call(i, "ISeqable.-seq", a));
    a = b.call(i, a)
  }
  return a
}
var Sa = {}, Ta = {};
function Ua(a, b) {
  var d;
  if(a ? a.l : a) {
    d = a.l(a, b)
  }else {
    var e = Ua[r.call(i, a)];
    e ? d = e : (e = Ua._) ? d = e : c(v.call(i, "IPrintable.-pr-seq", a));
    d = d.call(i, a, b)
  }
  return d
}
function Va(a, b, d) {
  if(a ? a.ta : a) {
    a = a.ta(a, b, d)
  }else {
    var e;
    var f = Va[r.call(i, a)];
    f ? e = f : (f = Va._) ? e = f : c(v.call(i, "IWatchable.-notify-watches", a));
    a = e.call(i, a, b, d)
  }
  return a
}
function Wa(a, b) {
  return a === b
}
function z(a, b) {
  return Pa.call(i, a, b)
}
Qa["null"] = o(0);
y["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return i;
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
za["null"] = function(a, b, d) {
  return Xa.call(i, b, d)
};
ta["null"] = h;
ua["null"] = function(a, b) {
  return A.call(i, b)
};
Oa["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b.call(i);
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
Ta["null"] = h;
Ua["null"] = function() {
  return A.call(i, "nil")
};
Ca["null"] = h;
Ia["null"] = o(i);
ra["null"] = o(0);
va["null"] = h;
wa["null"] = o(i);
xa["null"] = function() {
  return A.call(i)
};
Pa["null"] = function(a, b) {
  return b === i
};
Na["null"] = o(i);
La["null"] = h;
Ma["null"] = o(i);
w["null"] = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return i;
      case 3:
        return d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
sa["null"] = o(i);
Aa["null"] = h;
Ba["null"] = o(i);
Date.prototype.j = function(a, b) {
  return a.toString() === b.toString()
};
Qa.number = aa();
Pa.number = function(a, b) {
  return a === b
};
Qa["boolean"] = function(a) {
  return a === h ? 1 : 0
};
Qa["function"] = function(a) {
  return ca.call(i, a)
};
function Ya(a) {
  return a + 1
}
var Za = function() {
  function a(a, b, d, e) {
    for(;;) {
      if(e < ra.call(i, a)) {
        d = b.call(i, d, w.call(i, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function b(a, b, d) {
    for(var e = 0;;) {
      if(e < ra.call(i, a)) {
        d = b.call(i, d, w.call(i, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function d(a, b) {
    if(u(z.call(i, 0, ra.call(i, a)))) {
      return b.call(i)
    }
    for(var d = w.call(i, a, 0), e = 1;;) {
      if(e < ra.call(i, a)) {
        d = b.call(i, d, w.call(i, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  var e = i, e = function(e, g, j, k) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, g);
      case 3:
        return b.call(this, e, g, j);
      case 4:
        return a.call(this, e, g, j, k)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.a = d;
  e.c = b;
  e.P = a;
  return e
}();
function $a(a, b) {
  this.D = a;
  this.L = b
}
p = $a.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.la = function(a, b) {
  return Za.call(i, this.D, b, this.D[this.L], this.L + 1)
};
p.ma = function(a, b, d) {
  return Za.call(i, this.D, b, d, this.L)
};
p.B = h;
p.t = function(a, b) {
  return B.call(i, b, a)
};
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.Y = h;
p.ja = function(a, b) {
  var d = b + this.L;
  return d < this.D.length ? this.D[d] : i
};
p.ka = function(a, b, d) {
  a = b + this.L;
  return a < this.D.length ? this.D[a] : d
};
p.F = function() {
  return this.D.length - this.L
};
p.aa = h;
p.W = function() {
  return this.D[this.L]
};
p.X = function() {
  return this.L + 1 < this.D.length ? new $a(this.D, this.L + 1) : A.call(i)
};
p.z = aa();
function fb(a, b) {
  return u(z.call(i, 0, a.length)) ? i : new $a(a, b)
}
function C(a, b) {
  return fb.call(i, a, b)
}
Oa.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Za.call(i, a, b);
      case 3:
        return Za.call(i, a, b, d)
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
        return w.call(i, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
w.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b < a.length ? a[b] : i;
      case 3:
        return b < a.length ? a[b] : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
ra.array = function(a) {
  return a.length
};
Ra.array = function(a) {
  return C.call(i, a, 0)
};
function D(a) {
  return u(a) ? Ra.call(i, a) : i
}
function E(a) {
  a = D.call(i, a);
  return u(a) ? wa.call(i, a) : i
}
function F(a) {
  return xa.call(i, D.call(i, a))
}
function G(a) {
  return u(a) ? D.call(i, F.call(i, a)) : i
}
function gb(a) {
  return E.call(i, G.call(i, a))
}
function hb(a) {
  return G.call(i, G.call(i, a))
}
ra._ = function(a) {
  for(var a = D.call(i, a), b = 0;;) {
    if(u(a)) {
      a = G.call(i, a), b += 1
    }else {
      return b
    }
  }
};
Pa._ = function(a, b) {
  return a === b
};
function H(a) {
  return u(a) ? l : h
}
var ib = function() {
  function a(a, b) {
    return ua.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var n = i;
      t(k) && (n = C(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(u(f)) {
          a = b.call(i, a, e), e = E.call(i, f), f = G.call(i, f)
        }else {
          return b.call(i, a, e)
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), a = F(G(a));
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
function jb(a) {
  return sa.call(i, a)
}
function J(a) {
  return ra.call(i, a)
}
var K = function() {
  function a(a, b, d) {
    return w.call(i, a, Math.floor(b), d)
  }
  function b(a, b) {
    return w.call(i, a, Math.floor(b))
  }
  var d = i, d = function(d, f, g) {
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
}(), M = function() {
  function a(a, b, d) {
    return y.call(i, a, b, d)
  }
  function b(a, b) {
    return y.call(i, a, b)
  }
  var d = i, d = function(d, f, g) {
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
}(), kb = function() {
  function a(a, b, d) {
    return za.call(i, a, b, d)
  }
  var b = i, d = function() {
    function a(b, e, k, n) {
      var q = i;
      t(n) && (q = C(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, b, e, k, q)
    }
    function d(a, e, f, n) {
      for(;;) {
        if(a = b.call(i, a, e, f), u(n)) {
          e = E.call(i, n), f = gb.call(i, n), n = hb.call(i, n)
        }else {
          return a
        }
      }
    }
    a.d = 3;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), n = E(G(G(a))), a = F(G(G(a)));
      return d.call(this, b, e, n, a)
    };
    return a
  }(), b = function(b, f, g, j) {
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
  b.P = d;
  return b
}(), lb = function() {
  function a(a, b) {
    return Ba.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var n = i;
      t(k) && (n = C(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(i, a, e), u(f)) {
          e = E.call(i, f), f = G.call(i, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), a = F(G(a));
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
  b.h = aa();
  b.a = a;
  b.c = d;
  return b
}();
function mb(a, b) {
  return Na.call(i, a, b)
}
function nb(a) {
  var b;
  u(a) ? (b = a.u, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$IMeta$")) : b) : b = a;
  b = u(b) ? h : pa.call(i, La, a);
  return u(b) ? Ma.call(i, a) : i
}
var ob = function() {
  function a(a, b) {
    return Ia.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var n = i;
      t(k) && (n = C(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(i, a, e), u(f)) {
          e = E.call(i, f), f = G.call(i, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), a = F(G(a));
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
  b.h = aa();
  b.a = a;
  b.c = d;
  return b
}();
function pb(a) {
  return Qa.call(i, a)
}
function qb(a) {
  return H.call(i, D.call(i, a))
}
function rb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.B, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$ICollection$")) : b) : b = a;
    a = u(b) ? h : pa.call(i, ta, a)
  }
  return a
}
function sb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.va, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$ISet$")) : b) : b = a;
    a = u(b) ? h : pa.call(i, Ca, a)
  }
  return a
}
function vb(a) {
  var b;
  u(a) ? (b = a.Y, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$ISequential$")) : b) : b = a;
  return u(b) ? h : pa.call(i, Sa, a)
}
function wb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.$, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$IMap$")) : b) : b = a;
    a = u(b) ? h : pa.call(i, Aa, a)
  }
  return a
}
function xb(a) {
  var b;
  u(a) ? (b = a.wa, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$IVector$")) : b) : b = a;
  return u(b) ? h : pa.call(i, Ja, a)
}
function yb() {
  return{}
}
function zb(a) {
  var b = [];
  ka.call(i, a, function(a, e) {
    return b.push(e)
  });
  return b
}
function Ab(a, b) {
  return delete a[b]
}
var Bb = yb.call(i);
function Cb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.aa, b = u(b) ? H.call(i, a.hasOwnProperty("cljs$core$ISeq$")) : b) : b = a;
    a = u(b) ? h : pa.call(i, va, a)
  }
  return a
}
function Db(a) {
  return u(a) ? h : l
}
function Eb(a) {
  var b = ba.call(i, a);
  return u(b) ? H.call(i, function() {
    var b = z.call(i, a.charAt(0), "\ufdd0");
    return u(b) ? b : z.call(i, a.charAt(0), "\ufdd1")
  }()) : b
}
function Fb(a) {
  var b = ba.call(i, a);
  return u(b) ? z.call(i, a.charAt(0), "\ufdd0") : b
}
function Gb(a) {
  var b = ba.call(i, a);
  return u(b) ? z.call(i, a.charAt(0), "\ufdd1") : b
}
function Hb(a, b) {
  return y.call(i, a, b, Bb) === Bb ? l : h
}
var N = function() {
  function a(a, b, d) {
    return Oa.call(i, d, a, b)
  }
  function b(a, b) {
    return Oa.call(i, b, a)
  }
  var d = i, d = function(d, f, g) {
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
}(), Ib = function() {
  function a(a, b, d) {
    for(d = D.call(i, d);;) {
      if(u(d)) {
        b = a.call(i, b, E.call(i, d)), d = G.call(i, d)
      }else {
        return b
      }
    }
  }
  function b(a, b) {
    var d = D.call(i, b);
    return u(d) ? N.call(i, a, E.call(i, d), G.call(i, d)) : a.call(i)
  }
  var d = i, d = function(d, f, g) {
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
Oa._ = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Ib.call(i, b, a);
      case 3:
        return Ib.call(i, b, d, a)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var Jb = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = C(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d + f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(G(b)), b = F(G(b));
      return N.call(i, a, d + g, b)
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
  a.O = o(0);
  a.h = aa();
  a.a = function(a, b) {
    return a + b
  };
  a.c = b;
  return a
}(), Kb = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = C(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d - f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(G(b)), b = F(G(b));
      return N.call(i, a, d - g, b)
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
  a.h = function(a) {
    return-a
  };
  a.a = function(a, b) {
    return a - b
  };
  a.c = b;
  return a
}(), Lb = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = C(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d * f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(G(b)), b = F(G(b));
      return N.call(i, a, d * g, b)
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
  a.O = o(1);
  a.h = aa();
  a.a = function(a, b) {
    return a * b
  };
  a.c = b;
  return a
}();
function Mb(a) {
  return 0 <= a ? Math.floor.call(i, a) : Math.ceil.call(i, a)
}
var Nb = function() {
  function a(a) {
    return a * d.call(i)
  }
  function b() {
    return Math.random.call(i)
  }
  var d = i, d = function(d) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, d)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.O = b;
  d.h = a;
  return d
}();
function Ob(a) {
  return Mb.call(i, Nb.call(i, a))
}
var Pb = function() {
  function a(a, b) {
    return Pa.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var n = i;
      t(k) && (n = C(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      for(;;) {
        if(u(b.call(i, a, e))) {
          if(u(G.call(i, f))) {
            a = e, e = E.call(i, f), f = G.call(i, f)
          }else {
            return b.call(i, e, E.call(i, f))
          }
        }else {
          return l
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), a = F(G(a));
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
  b.h = o(h);
  b.a = a;
  b.c = d;
  return b
}();
function Qb(a, b) {
  for(var d = b, e = D.call(i, a);;) {
    var f = e;
    if(u(u(f) ? 0 < d : f)) {
      d -= 1, e = G.call(i, e)
    }else {
      return e
    }
  }
}
w._ = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        var e;
        var f = Qb.call(i, a, b);
        u(f) ? e = E.call(i, f) : c(Error("Index out of bounds"));
        return e;
      case 3:
        return e = Qb.call(i, a, b), u(e) ? E.call(i, e) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var Rb = function() {
  function a(a) {
    return a === i ? "" : a.toString()
  }
  var b = i, d = function() {
    function a(b, e) {
      var k = i;
      t(e) && (k = C(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(i, E.call(i, d))), f = G.call(i, d), a = e, d = f
          }else {
            return b.call(i, a)
          }
        }
      }.call(i, new na(b.call(i, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = E(a), a = F(a);
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
  b.O = o("");
  b.h = a;
  b.a = d;
  return b
}(), O = function() {
  function a(a) {
    return u(Gb.call(i, a)) ? a.substring(2, a.length) : u(Fb.call(i, a)) ? Rb.call(i, ":", a.substring(2, a.length)) : a === i ? "" : a.toString()
  }
  var b = i, d = function() {
    function a(b, e) {
      var k = i;
      t(e) && (k = C(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(i, E.call(i, d))), f = G.call(i, d), a = e, d = f
          }else {
            return Rb.call(i, a)
          }
        }
      }.call(i, new na(b.call(i, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = E(a), a = F(a);
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
  b.O = o("");
  b.h = a;
  b.a = d;
  return b
}(), Xb = function() {
  var a = i, a = function(a, d, e) {
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
}();
function eb(a, b) {
  return Db.call(i, u(vb.call(i, b)) ? function() {
    for(var d = D.call(i, a), e = D.call(i, b);;) {
      if(d === i) {
        return e === i
      }
      if(e !== i && u(z.call(i, E.call(i, d), E.call(i, e)))) {
        d = G.call(i, d), e = G.call(i, e)
      }else {
        return l
      }
    }
  }() : i)
}
function Yb(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
}
function ab(a) {
  return N.call(i, function(a, d) {
    return Yb.call(i, a, pb.call(i, d))
  }, pb.call(i, E.call(i, a)), G.call(i, a))
}
function Zb(a, b, d, e) {
  this.f = a;
  this.ba = b;
  this.Z = d;
  this.G = e
}
p = Zb.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.Y = h;
p.B = h;
p.t = function(a, b) {
  return new Zb(this.f, b, a, this.G + 1)
};
p.z = aa();
p.F = m("G");
p.aa = h;
p.W = m("ba");
p.X = m("Z");
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.C = function(a, b) {
  return new Zb(b, this.ba, this.Z, this.G)
};
p.u = h;
p.v = m("f");
p.K = function() {
  return $b
};
function ac(a) {
  this.f = a
}
p = ac.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.Y = h;
p.B = h;
p.t = function(a, b) {
  return new Zb(this.f, b, i, 1)
};
p.z = o(i);
p.F = o(0);
p.aa = h;
p.W = o(i);
p.X = o(i);
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.C = function(a, b) {
  return new ac(b)
};
p.u = h;
p.v = m("f");
p.K = aa();
var $b = new ac(i);
function bc(a) {
  return N.call(i, ib, $b, a)
}
var A = function() {
  function a(a) {
    var d = i;
    t(a) && (d = C(Array.prototype.slice.call(arguments, 0), 0));
    return N.call(i, ib, $b, bc.call(i, d))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return N.call(i, ib, $b, bc.call(i, a))
  };
  return a
}();
function cc(a, b, d) {
  this.f = a;
  this.ba = b;
  this.Z = d
}
p = cc.prototype;
p.z = aa();
p.k = function(a) {
  return ab.call(i, a)
};
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.Y = h;
p.K = function() {
  return mb.call(i, $b, this.f)
};
p.B = h;
p.t = function(a, b) {
  return new cc(i, b, a)
};
p.aa = h;
p.W = m("ba");
p.X = function() {
  return this.Z === i ? $b : this.Z
};
p.u = h;
p.v = m("f");
p.C = function(a, b) {
  return new cc(b, this.ba, this.Z)
};
function B(a, b) {
  return new cc(i, a, b)
}
Oa.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Za.call(i, a, b);
      case 3:
        return Za.call(i, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
y.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return w.call(i, a, b);
      case 3:
        return w.call(i, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
w.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return b < ra.call(i, a) ? a.charAt(b) : i;
      case 3:
        return b < ra.call(i, a) ? a.charAt(b) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
ra.string = function(a) {
  return a.length
};
Ra.string = function(a) {
  return fb.call(i, a, 0)
};
Qa.string = function(a) {
  return ja.call(i, a)
};
String.prototype.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return M.call(i, b, this.toString());
      case 3:
        return M.call(i, b, this.toString(), d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
String.prototype.apply = function(a, b) {
  return 2 > J.call(i, b) ? M.call(i, b[0], a) : M.call(i, b[0], a, b[1])
};
function dc(a) {
  var b = a.x;
  if(u(a.oa)) {
    return b
  }
  a.x = b.call(i);
  a.oa = h;
  return a.x
}
function P(a, b, d) {
  this.f = a;
  this.oa = b;
  this.x = d
}
p = P.prototype;
p.z = function(a) {
  return D.call(i, dc.call(i, a))
};
p.k = function(a) {
  return ab.call(i, a)
};
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.Y = h;
p.K = function() {
  return mb.call(i, $b, this.f)
};
p.B = h;
p.t = function(a, b) {
  return B.call(i, b, a)
};
p.aa = h;
p.W = function(a) {
  return E.call(i, dc.call(i, a))
};
p.X = function(a) {
  return F.call(i, dc.call(i, a))
};
p.u = h;
p.v = m("f");
p.C = function(a, b) {
  return new P(b, this.oa, this.x)
};
function ec(a) {
  for(var b = [];;) {
    if(u(D.call(i, a))) {
      b.push(E.call(i, a)), a = G.call(i, a)
    }else {
      return b
    }
  }
}
function fc(a, b) {
  for(var d = a, e = b, f = 0;;) {
    var g;
    g = (g = 0 < e) ? D.call(i, d) : g;
    if(u(g)) {
      d = G.call(i, d), e -= 1, f += 1
    }else {
      return f
    }
  }
}
var hc = function gc(b) {
  return b === i ? i : G.call(i, b) === i ? D.call(i, E.call(i, b)) : B.call(i, E.call(i, b), gc.call(i, G.call(i, b)))
}, ic = function() {
  function a(a, b) {
    return new P(i, l, function() {
      var d = D.call(i, a);
      return u(d) ? B.call(i, E.call(i, d), e.call(i, F.call(i, d), b)) : b
    })
  }
  function b(a) {
    return new P(i, l, function() {
      return a
    })
  }
  function d() {
    return new P(i, l, o(i))
  }
  var e = i, f = function() {
    function a(d, e, f) {
      var g = i;
      t(f) && (g = C(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, d, e, g)
    }
    function b(a, d, f) {
      return function x(a, b) {
        return new P(i, l, function() {
          var d = D.call(i, a);
          return u(d) ? B.call(i, E.call(i, d), x.call(i, F.call(i, d), b)) : u(b) ? x.call(i, E.call(i, b), G.call(i, b)) : i
        })
      }.call(i, e.call(i, a, d), f)
    }
    a.d = 2;
    a.b = function(a) {
      var d = E(a), e = E(G(a)), a = F(G(a));
      return b.call(this, d, e, a)
    };
    return a
  }(), e = function(e, j, k) {
    switch(arguments.length) {
      case 0:
        return d.call(this);
      case 1:
        return b.call(this, e);
      case 2:
        return a.call(this, e, j);
      default:
        return f.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.d = 2;
  e.b = f.b;
  e.O = d;
  e.h = b;
  e.a = a;
  e.c = f;
  return e
}(), jc = function() {
  function a(a, b, d, e) {
    return B.call(i, a, B.call(i, b, B.call(i, d, e)))
  }
  function b(a, b, d) {
    return B.call(i, a, B.call(i, b, d))
  }
  function d(a, b) {
    return B.call(i, a, b)
  }
  function e(a) {
    return D.call(i, a)
  }
  var f = i, g = function() {
    function a(d, e, f, g, j) {
      var I = i;
      t(j) && (I = C(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, I)
    }
    function b(a, d, e, f, g) {
      return B.call(i, a, B.call(i, d, B.call(i, e, B.call(i, f, hc.call(i, g)))))
    }
    a.d = 4;
    a.b = function(a) {
      var d = E(a), e = E(G(a)), f = E(G(G(a))), g = E(G(G(G(a)))), a = F(G(G(G(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), f = function(f, k, n, q, s) {
    switch(arguments.length) {
      case 1:
        return e.call(this, f);
      case 2:
        return d.call(this, f, k);
      case 3:
        return b.call(this, f, k, n);
      case 4:
        return a.call(this, f, k, n, q);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 4;
  f.b = g.b;
  f.h = e;
  f.a = d;
  f.c = b;
  f.P = a;
  f.na = g;
  return f
}(), Q = function() {
  function a(a, b, d, e, f) {
    b = jc.call(i, b, d, e, f);
    d = a.d;
    return u(a.b) ? fc.call(i, b, d) <= d ? a.apply(a, ec.call(i, b)) : a.b(b) : a.apply(a, ec.call(i, b))
  }
  function b(a, b, d, e) {
    b = jc.call(i, b, d, e);
    d = a.d;
    return u(a.b) ? fc.call(i, b, d) <= d ? a.apply(a, ec.call(i, b)) : a.b(b) : a.apply(a, ec.call(i, b))
  }
  function d(a, b, d) {
    b = jc.call(i, b, d);
    d = a.d;
    return u(a.b) ? fc.call(i, b, d) <= d ? a.apply(a, ec.call(i, b)) : a.b(b) : a.apply(a, ec.call(i, b))
  }
  function e(a, b) {
    var d = a.d;
    return u(a.b) ? fc.call(i, b, d + 1) <= d ? a.apply(a, ec.call(i, b)) : a.b(b) : a.apply(a, ec.call(i, b))
  }
  var f = i, g = function() {
    function a(d, e, f, g, j, I) {
      var L = i;
      t(I) && (L = C(Array.prototype.slice.call(arguments, 5), 0));
      return b.call(this, d, e, f, g, j, L)
    }
    function b(a, d, e, f, g, j) {
      d = B.call(i, d, B.call(i, e, B.call(i, f, B.call(i, g, hc.call(i, j)))));
      e = a.d;
      return u(a.b) ? fc.call(i, d, e) <= e ? a.apply(a, ec.call(i, d)) : a.b(d) : a.apply(a, ec.call(i, d))
    }
    a.d = 5;
    a.b = function(a) {
      var d = E(a), e = E(G(a)), f = E(G(G(a))), g = E(G(G(G(a)))), j = E(G(G(G(G(a))))), a = F(G(G(G(G(a)))));
      return b.call(this, d, e, f, g, j, a)
    };
    return a
  }(), f = function(f, k, n, q, s, x) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, n);
      case 4:
        return b.call(this, f, k, n, q);
      case 5:
        return a.call(this, f, k, n, q, s);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.P = b;
  f.na = a;
  f.xa = g;
  return f
}(), kc = function() {
  function a(a, b) {
    return H.call(i, z.call(i, a, b))
  }
  function b() {
    return l
  }
  var d = i, e = function() {
    function a(b, d, e) {
      var f = i;
      t(e) && (f = C(Array.prototype.slice.call(arguments, 2), 0));
      return H.call(i, Q.call(i, z, b, d, f))
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), d = E(G(a)), a = F(G(a));
      return H.call(i, Q.call(i, z, b, d, a))
    };
    return a
  }(), d = function(d, g, j) {
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
  d.h = b;
  d.a = a;
  d.c = e;
  return d
}();
function lc(a) {
  return u(D.call(i, a)) ? a : i
}
function nc(a, b) {
  for(;;) {
    if(D.call(i, b) === i) {
      return h
    }
    if(u(a.call(i, E.call(i, b)))) {
      var d = a, e = G.call(i, b), a = d, b = e
    }else {
      return l
    }
  }
}
function oc(a) {
  return a
}
var pc = function() {
  function a(a, b, d, f) {
    return new P(i, l, function() {
      var q = D.call(i, b), s = D.call(i, d), x = D.call(i, f);
      return u(u(q) ? u(s) ? x : s : q) ? B.call(i, a.call(i, E.call(i, q), E.call(i, s), E.call(i, x)), e.call(i, a, F.call(i, q), F.call(i, s), F.call(i, x))) : i
    })
  }
  function b(a, b, d) {
    return new P(i, l, function() {
      var f = D.call(i, b), q = D.call(i, d);
      return u(u(f) ? q : f) ? B.call(i, a.call(i, E.call(i, f), E.call(i, q)), e.call(i, a, F.call(i, f), F.call(i, q))) : i
    })
  }
  function d(a, b) {
    return new P(i, l, function() {
      var d = D.call(i, b);
      return u(d) ? B.call(i, a.call(i, E.call(i, d)), e.call(i, a, F.call(i, d))) : i
    })
  }
  var e = i, f = function() {
    function a(d, e, f, g, x) {
      var V = i;
      t(x) && (V = C(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, V)
    }
    function b(a, d, f, g, j) {
      return e.call(i, function(b) {
        return Q.call(i, a, b)
      }, function I(a) {
        return new P(i, l, function() {
          var b = e.call(i, D, a);
          return u(nc.call(i, oc, b)) ? B.call(i, e.call(i, E, b), I.call(i, e.call(i, F, b))) : i
        })
      }.call(i, ib.call(i, j, g, f, d)))
    }
    a.d = 4;
    a.b = function(a) {
      var d = E(a), e = E(G(a)), f = E(G(G(a))), g = E(G(G(G(a)))), a = F(G(G(G(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), e = function(e, j, k, n, q) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, j);
      case 3:
        return b.call(this, e, j, k);
      case 4:
        return a.call(this, e, j, k, n);
      default:
        return f.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.d = 4;
  e.b = f.b;
  e.a = d;
  e.c = b;
  e.P = a;
  e.na = f;
  return e
}(), rc = function qc(b, d) {
  return new P(i, l, function() {
    if(0 < b) {
      var e = D.call(i, d);
      return u(e) ? B.call(i, E.call(i, e), qc.call(i, b - 1, F.call(i, e))) : i
    }
    return i
  })
};
function sc(a, b) {
  function d(a, b) {
    for(;;) {
      var d = D.call(i, b), j = 0 < a;
      if(u(j ? d : j)) {
        j = a - 1, d = F.call(i, d), a = j, b = d
      }else {
        return d
      }
    }
  }
  return new P(i, l, function() {
    return d.call(i, a, b)
  })
}
var tc = function() {
  function a(a, b) {
    return rc.call(i, a, d.call(i, b))
  }
  function b(a) {
    return new P(i, l, function() {
      return B.call(i, a, d.call(i, a))
    })
  }
  var d = i, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.h = b;
  d.a = a;
  return d
}(), uc = function() {
  function a(a, d) {
    return new P(i, l, function() {
      var g = D.call(i, a), j = D.call(i, d);
      return u(u(g) ? j : g) ? B.call(i, E.call(i, g), B.call(i, E.call(i, j), b.call(i, F.call(i, g), F.call(i, j)))) : i
    })
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var n = i;
      t(k) && (n = C(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, n)
    }
    function d(a, e, f) {
      return new P(i, l, function() {
        var d = pc.call(i, D, ib.call(i, f, e, a));
        return u(nc.call(i, oc, d)) ? ic.call(i, pc.call(i, E, d), Q.call(i, b, pc.call(i, F, d))) : i
      })
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(G(a)), a = F(G(a));
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
function vc(a, b) {
  return sc.call(i, 1, uc.call(i, tc.call(i, a), b))
}
function wc(a) {
  return function d(a, f) {
    return new P(i, l, function() {
      var g = D.call(i, a);
      return u(g) ? B.call(i, E.call(i, g), d.call(i, F.call(i, g), f)) : u(D.call(i, f)) ? d.call(i, E.call(i, f), F.call(i, f)) : i
    })
  }.call(i, i, a)
}
var xc = function() {
  function a(a, b) {
    return wc.call(i, pc.call(i, a, b))
  }
  var b = i, d = function() {
    function a(b, d, e) {
      var k = i;
      t(e) && (k = C(Array.prototype.slice.call(arguments, 2), 0));
      return wc.call(i, Q.call(i, pc, b, d, k))
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), d = E(G(a)), a = F(G(a));
      return wc.call(i, Q.call(i, pc, b, d, a))
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
function yc(a, b) {
  return N.call(i, ua, a, b)
}
var zc = function() {
  function a(a, b, d, k) {
    return new P(i, l, function() {
      var n = D.call(i, k);
      if(u(n)) {
        var q = rc.call(i, a, n);
        return u(z.call(i, a, J.call(i, q))) ? B.call(i, q, e.call(i, a, b, d, sc.call(i, b, n))) : A.call(i, rc.call(i, a, ic.call(i, q, d)))
      }
      return i
    })
  }
  function b(a, b, d) {
    return new P(i, l, function() {
      var k = D.call(i, d);
      if(u(k)) {
        var n = rc.call(i, a, k);
        return u(z.call(i, a, J.call(i, n))) ? B.call(i, n, e.call(i, a, b, sc.call(i, b, k))) : i
      }
      return i
    })
  }
  function d(a, b) {
    return e.call(i, a, a, b)
  }
  var e = i, e = function(e, g, j, k) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, g);
      case 3:
        return b.call(this, e, g, j);
      case 4:
        return a.call(this, e, g, j, k)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.a = d;
  e.c = b;
  e.P = a;
  return e
}(), Ac = function() {
  function a(a, b, d) {
    for(var j = Bb, b = D.call(i, b);;) {
      if(u(b)) {
        a = M.call(i, a, E.call(i, b), j);
        if(j === a) {
          return d
        }
        b = G.call(i, b)
      }else {
        return a
      }
    }
  }
  function b(a, b) {
    return N.call(i, M, a, b)
  }
  var d = i, d = function(d, f, g) {
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
}(), Cc = function Bc(b, d, e) {
  var f = K.call(i, d, 0, i), d = Qb.call(i, d, 1);
  return u(d) ? kb.call(i, b, f, Bc.call(i, M.call(i, b, f), d, e)) : kb.call(i, b, f, e)
}, Dc = function() {
  function a(a, e, f, g) {
    var j = i;
    t(g) && (j = C(Array.prototype.slice.call(arguments, 3), 0));
    return b.call(this, a, e, f, j)
  }
  function b(b, e, f, g) {
    var j = K.call(i, e, 0, i), e = Qb.call(i, e, 1);
    return u(e) ? kb.call(i, b, j, Q.call(i, a, M.call(i, b, j), e, f, g)) : kb.call(i, b, j, Q.call(i, f, M.call(i, b, j), g))
  }
  a.d = 3;
  a.b = function(a) {
    var e = E(a), f = E(G(a)), g = E(G(G(a))), a = F(G(G(a)));
    return b.call(this, e, f, g, a)
  };
  return a
}();
function Ec(a) {
  a = a.i;
  return 32 > a ? 0 : a - 1 >> 5 << 5
}
function Hc(a, b) {
  for(var d = a, e = b;;) {
    if(u(z.call(i, 0, d))) {
      return e
    }
    var f = qa.call(i, Ic);
    f[0] = e;
    e = f;
    d -= 5
  }
}
var Kc = function Jc(b, d, e, f) {
  var g = qa.call(i, e), j = b.i - 1 >> d & 31;
  u(z.call(i, 5, d)) ? g[j] = f : (e = e[j], b = u(e) ? Jc.call(i, b, d - 5, e, f) : Hc.call(i, d - 5, f), g[j] = b);
  return g
};
function Lc(a, b) {
  var d = 0 <= b;
  if(d ? b < a.i : d) {
    if(b >= Ec.call(i, a)) {
      return a.U
    }
    for(var d = a.root, e = a.shift;;) {
      if(0 < e) {
        var f = e - 5, d = d[b >> e & 31], e = f
      }else {
        return d
      }
    }
  }else {
    c(Error(O.call(i, "No item ", b, " in vector of length ", a.i)))
  }
}
var Nc = function Mc(b, d, e, f, g) {
  var j = qa.call(i, e);
  if(0 === d) {
    j[f & 31] = g
  }else {
    var k = f >> d & 31;
    j[k] = Mc.call(i, b, d - 5, e[k], f, g)
  }
  return j
};
function Oc(a, b, d, e, f) {
  this.f = a;
  this.i = b;
  this.shift = d;
  this.root = e;
  this.U = f
}
p = Oc.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.M = function(a, b) {
  return w.call(i, a, b, i)
};
p.N = function(a, b, d) {
  return w.call(i, a, b, d)
};
p.R = function(a, b, d) {
  var e = 0 <= b;
  if(e ? b < this.i : e) {
    return Ec.call(i, a) <= b ? (a = qa.call(i, this.U), a[b & 31] = d, new Oc(this.f, this.i, this.shift, this.root, a)) : new Oc(this.f, this.i, this.shift, Nc.call(i, a, this.shift, this.root, b, d), this.U)
  }
  if(u(z.call(i, b, this.i))) {
    return ua.call(i, a, d)
  }
  c(Error(O.call(i, "Index ", b, " out of bounds  [0,", this.i, "]")))
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(i, this, b);
      case 3:
        return y.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.Y = h;
p.B = h;
p.t = function(a, b) {
  if(32 > this.i - Ec.call(i, a)) {
    var d = qa.call(i, this.U);
    d.push(b);
    return new Oc(this.f, this.i + 1, this.shift, this.root, d)
  }
  var e = this.i >> 5 > 1 << this.shift, d = e ? this.shift + 5 : this.shift;
  e ? (e = qa.call(i, Ic), e[0] = this.root, e[1] = Hc.call(i, this.shift, this.U)) : e = Kc.call(i, a, this.shift, this.root, this.U);
  return new Oc(this.f, this.i + 1, d, e, [b])
};
p.la = function(a, b) {
  return Za.call(i, a, b)
};
p.ma = function(a, b, d) {
  return Za.call(i, a, b, d)
};
p.z = function(a) {
  var b = this;
  return 0 < b.i ? function e(f) {
    return new P(i, l, function() {
      return f < b.i ? B.call(i, w.call(i, a, f), e.call(i, f + 1)) : i
    })
  }.call(i, 0) : i
};
p.F = m("i");
p.wa = h;
p.j = function(a, b) {
  return eb.call(i, a, b)
};
p.C = function(a, b) {
  return new Oc(b, this.i, this.shift, this.root, this.U)
};
p.u = h;
p.v = m("f");
p.ja = function(a, b) {
  return Lc.call(i, a, b)[b & 31]
};
p.ka = function(a, b, d) {
  var e = 0 <= b;
  return(e ? b < this.i : e) ? w.call(i, a, b) : d
};
p.K = function() {
  return mb.call(i, Pc, this.f)
};
var Ic = Array(32), Pc = new Oc(i, 0, 5, Ic, []);
function T(a) {
  return yc.call(i, Pc, a)
}
function Qc(a) {
  return N.call(i, ib, Pc, a)
}
var U = function() {
  function a(a) {
    var d = i;
    t(a) && (d = C(Array.prototype.slice.call(arguments, 0), 0));
    return Qc.call(i, d)
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return Qc.call(i, a)
  };
  return a
}();
T([]);
function Rc() {
}
Rc.prototype.j = o(l);
var Sc = new Rc;
function Tc(a, b) {
  return Db.call(i, u(wb.call(i, b)) ? u(z.call(i, J.call(i, a), J.call(i, b))) ? nc.call(i, oc, pc.call(i, function(a) {
    return z.call(i, M.call(i, b, E.call(i, a), Sc), gb.call(i, a))
  }, a)) : i : i)
}
function Uc(a, b, d) {
  for(var e = d.length, f = 0;;) {
    if(f < e) {
      if(u(z.call(i, b, d[f]))) {
        return f
      }
      f += a
    }else {
      return i
    }
  }
}
var Vc = function() {
  function a(a, b, d, j) {
    var k = ba.call(i, a);
    return u(u(k) ? b.hasOwnProperty(a) : k) ? d : j
  }
  function b(a, b) {
    return d.call(i, a, b, h, l)
  }
  var d = i, d = function(d, f, g, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, d, f);
      case 4:
        return a.call(this, d, f, g, j)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.a = b;
  d.P = a;
  return d
}();
function Wc(a, b) {
  var d = pb.call(i, a), e = pb.call(i, b);
  return d < e ? -1 : d > e ? 1 : 0
}
function Xc(a, b, d) {
  this.f = a;
  this.keys = b;
  this.Q = d
}
p = Xc.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.M = function(a, b) {
  return y.call(i, a, b, i)
};
p.N = function(a, b, d) {
  return Vc.call(i, b, this.Q, this.Q[b], d)
};
p.R = function(a, b, d) {
  if(u(ba.call(i, b))) {
    var a = la.call(i, this.Q), e = a.hasOwnProperty(b);
    a[b] = d;
    if(u(e)) {
      return new Xc(this.f, this.keys, a)
    }
    d = qa.call(i, this.keys);
    d.push(b);
    return new Xc(this.f, d, a)
  }
  return mb.call(i, yc.call(i, Xa.call(i, b, d), D.call(i, a)), this.f)
};
p.ia = function(a, b) {
  return Vc.call(i, b, this.Q)
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(i, this, b);
      case 3:
        return y.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return u(xb.call(i, b)) ? za.call(i, a, w.call(i, b, 0), w.call(i, b, 1)) : N.call(i, ua, a, b)
};
p.z = function() {
  var a = this;
  return 0 < a.keys.length ? pc.call(i, function(b) {
    return U.call(i, b, a.Q[b])
  }, a.keys.sort(Wc)) : i
};
p.F = function() {
  return this.keys.length
};
p.j = function(a, b) {
  return Tc.call(i, a, b)
};
p.C = function(a, b) {
  return new Xc(b, this.keys, this.Q)
};
p.u = h;
p.v = m("f");
p.K = function() {
  return mb.call(i, Yc, this.f)
};
p.$ = h;
p.V = function(a, b) {
  var d = ba.call(i, b);
  if(u(u(d) ? this.Q.hasOwnProperty(b) : d)) {
    var d = qa.call(i, this.keys), e = la.call(i, this.Q);
    d.splice(Uc.call(i, 1, b, d), 1);
    Ab.call(i, e, b);
    return new Xc(this.f, d, e)
  }
  return a
};
var Yc = new Xc(i, [], yb.call(i));
function W(a, b) {
  return new Xc(i, a, b)
}
function Zc(a, b, d) {
  this.f = a;
  this.G = b;
  this.J = d
}
p = Zc.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.M = function(a, b) {
  return y.call(i, a, b, i)
};
p.N = function(a, b, d) {
  a = this.J[pb.call(i, b)];
  b = u(a) ? Uc.call(i, 2, b, a) : i;
  return u(b) ? a[b + 1] : d
};
p.R = function(a, b, d) {
  var a = pb.call(i, b), e = this.J[a];
  if(u(e)) {
    var e = qa.call(i, e), f = la.call(i, this.J);
    f[a] = e;
    a = Uc.call(i, 2, b, e);
    if(u(a)) {
      return e[a + 1] = d, new Zc(this.f, this.G, f)
    }
    e.push(b, d);
    return new Zc(this.f, this.G + 1, f)
  }
  e = la.call(i, this.J);
  e[a] = [b, d];
  return new Zc(this.f, this.G + 1, e)
};
p.ia = function(a, b) {
  var d = this.J[pb.call(i, b)], d = u(d) ? Uc.call(i, 2, b, d) : i;
  return u(d) ? h : l
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(i, this, b);
      case 3:
        return y.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return u(xb.call(i, b)) ? za.call(i, a, w.call(i, b, 0), w.call(i, b, 1)) : N.call(i, ua, a, b)
};
p.z = function() {
  var a = this;
  if(0 < a.G) {
    var b = zb.call(i, a.J).sort();
    return xc.call(i, function(b) {
      return pc.call(i, Qc, zc.call(i, 2, a.J[b]))
    }, b)
  }
  return i
};
p.F = m("G");
p.j = function(a, b) {
  return Tc.call(i, a, b)
};
p.C = function(a, b) {
  return new Zc(b, this.G, this.J)
};
p.u = h;
p.v = m("f");
p.K = function() {
  return mb.call(i, $c, this.f)
};
p.$ = h;
p.V = function(a, b) {
  var d = pb.call(i, b), e = this.J[d], f = u(e) ? Uc.call(i, 2, b, e) : i;
  if(u(H.call(i, f))) {
    return a
  }
  var g = la.call(i, this.J);
  3 > e.length ? Ab.call(i, g, d) : (e = qa.call(i, e), e.splice(f, 2), g[d] = e);
  return new Zc(this.f, this.G - 1, g)
};
var $c = new Zc(i, 0, yb.call(i)), Xa = function() {
  function a(a) {
    var e = i;
    t(a) && (e = C(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    for(var a = D.call(i, a), b = $c;;) {
      if(u(a)) {
        var f = hb.call(i, a), b = kb.call(i, b, E.call(i, a), gb.call(i, a)), a = f
      }else {
        return b
      }
    }
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return b.call(this, a)
  };
  return a
}();
function ad(a) {
  return D.call(i, pc.call(i, E, a))
}
function bd(a, b) {
  this.f = a;
  this.ca = b
}
p = bd.prototype;
p.k = function(a) {
  return ab.call(i, a)
};
p.M = function(a, b) {
  return y.call(i, a, b, i)
};
p.N = function(a, b, d) {
  return u(ya.call(i, this.ca, b)) ? b : d
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return y.call(i, this, b);
      case 3:
        return y.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return new bd(this.f, kb.call(i, this.ca, b, i))
};
p.z = function() {
  return ad.call(i, this.ca)
};
p.va = h;
p.sa = function(a, b) {
  return new bd(this.f, lb.call(i, this.ca, b))
};
p.F = function(a) {
  return J.call(i, D.call(i, a))
};
p.j = function(a, b) {
  var d = sb.call(i, b);
  return u(d) ? (d = z.call(i, J.call(i, a), J.call(i, b)), u(d) ? nc.call(i, function(b) {
    return Hb.call(i, a, b)
  }, b) : d) : d
};
p.C = function(a, b) {
  return new bd(b, this.ca)
};
p.u = h;
p.v = m("f");
p.K = function() {
  return mb.call(i, cd, this.f)
};
var cd = new bd(i, Xa.call(i));
function dd(a) {
  for(var a = D.call(i, a), b = cd;;) {
    if(u(H.call(i, qb.call(i, a)))) {
      var d = F.call(i, a), b = ib.call(i, b, E.call(i, a)), a = d
    }else {
      return b
    }
  }
}
function ed(a) {
  if(u(Eb.call(i, a))) {
    return a
  }
  var b;
  b = Fb.call(i, a);
  b = u(b) ? b : Gb.call(i, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), 0 > b ? Xb.call(i, a, 2) : Xb.call(i, a, b + 1)
  }
  c(Error(O.call(i, "Doesn't support name: ", a)))
}
function fd(a) {
  var b;
  b = Fb.call(i, a);
  b = u(b) ? b : Gb.call(i, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), -1 < b ? Xb.call(i, a, 2, b) : i
  }
  c(Error(O.call(i, "Doesn't support namespace: ", a)))
}
function gd(a, b) {
  var d = a.exec(b);
  return u(z.call(i, E.call(i, d), b)) ? u(z.call(i, J.call(i, d), 1)) ? E.call(i, d) : Qc.call(i, d) : i
}
function X(a, b, d, e, f, g) {
  return ic.call(i, T([b]), wc.call(i, vc.call(i, T([d]), pc.call(i, function(b) {
    return a.call(i, b, f)
  }, g))), T([e]))
}
function hd(a) {
  oa.call(i, a);
  return i
}
function id() {
  return i
}
var kd = function jd(b, d) {
  return b === i ? A.call(i, "nil") : void 0 === b ? A.call(i, "#<undefined>") : ic.call(i, u(function() {
    var e = M.call(i, d, "\ufdd0'meta");
    return u(e) ? (u(b) ? (e = b.u, e = u(e) ? H.call(i, b.hasOwnProperty("cljs$core$IMeta$")) : e) : e = b, e = u(e) ? h : pa.call(i, La, b), u(e) ? nb.call(i, b) : e) : e
  }()) ? ic.call(i, T(["^"]), jd.call(i, nb.call(i, b), d), T([" "])) : i, u(function() {
    var d;
    u(b) ? (d = b.w, d = u(d) ? H.call(i, b.hasOwnProperty("cljs$core$IPrintable$")) : d) : d = b;
    return u(d) ? h : pa.call(i, Ta, b)
  }()) ? Ua.call(i, b, d) : A.call(i, "#<", O.call(i, b), ">"))
};
function ld(a, b) {
  var d = E.call(i, a), e = new na, f = D.call(i, a);
  if(u(f)) {
    for(var g = E.call(i, f);;) {
      g !== d && e.append(" ");
      var j = D.call(i, kd.call(i, g, b));
      if(u(j)) {
        for(g = E.call(i, j);;) {
          if(e.append(g), g = G.call(i, j), u(g)) {
            j = g, g = E.call(i, j)
          }else {
            break
          }
        }
      }
      f = G.call(i, f);
      if(u(f)) {
        g = f, f = E.call(i, g), j = g, g = f, f = j
      }else {
        break
      }
    }
  }
  return e
}
function md(a, b) {
  return O.call(i, ld.call(i, a, b))
}
function nd(a, b) {
  var d = E.call(i, a), e = D.call(i, a);
  if(u(e)) {
    for(var f = E.call(i, e);;) {
      f !== d && hd.call(i, " ");
      var g = D.call(i, kd.call(i, f, b));
      if(u(g)) {
        for(f = E.call(i, g);;) {
          if(hd.call(i, f), f = G.call(i, g), u(f)) {
            g = f, f = E.call(i, g)
          }else {
            break
          }
        }
      }
      e = G.call(i, e);
      if(u(e)) {
        f = e, e = E.call(i, f), g = f, f = e, e = g
      }else {
        return i
      }
    }
  }else {
    return i
  }
}
function od(a) {
  hd.call(i, "\n");
  return u(M.call(i, a, "\ufdd0'flush-on-newline")) ? id.call(i) : i
}
function pd() {
  return W(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":h, "\ufdd0'readably":h, "\ufdd0'meta":l, "\ufdd0'dup":l})
}
var qd = function() {
  function a(a) {
    var d = i;
    t(a) && (d = C(Array.prototype.slice.call(arguments, 0), 0));
    return md.call(i, d, pd.call(i))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return md.call(i, a, pd.call(i))
  };
  return a
}(), rd = function() {
  function a(a) {
    var d = i;
    t(a) && (d = C(Array.prototype.slice.call(arguments, 0), 0));
    return nd.call(i, d, pd.call(i))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return nd.call(i, a, pd.call(i))
  };
  return a
}(), sd = function() {
  function a(a) {
    var e = i;
    t(a) && (e = C(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    nd.call(i, a, pd.call(i));
    return od.call(i, pd.call(i))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return b.call(this, a)
  };
  return a
}();
Zc.prototype.w = h;
Zc.prototype.l = function(a, b) {
  return X.call(i, function(a) {
    return X.call(i, kd, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
Ta.number = h;
Ua.number = function(a) {
  return A.call(i, O.call(i, a))
};
$a.prototype.w = h;
$a.prototype.l = function(a, b) {
  return X.call(i, kd, "(", " ", ")", b, a)
};
P.prototype.w = h;
P.prototype.l = function(a, b) {
  return X.call(i, kd, "(", " ", ")", b, a)
};
Ta["boolean"] = h;
Ua["boolean"] = function(a) {
  return A.call(i, O.call(i, a))
};
bd.prototype.w = h;
bd.prototype.l = function(a, b) {
  return X.call(i, kd, "#{", " ", "}", b, a)
};
Ta.string = h;
Ua.string = function(a, b) {
  return u(Fb.call(i, a)) ? A.call(i, O.call(i, ":", function() {
    var b = fd.call(i, a);
    return u(b) ? O.call(i, b, "/") : i
  }(), ed.call(i, a))) : u(Gb.call(i, a)) ? A.call(i, O.call(i, function() {
    var b = fd.call(i, a);
    return u(b) ? O.call(i, b, "/") : i
  }(), ed.call(i, a))) : A.call(i, u("\ufdd0'readably".call(i, b)) ? ia.call(i, a) : a)
};
Oc.prototype.w = h;
Oc.prototype.l = function(a, b) {
  return X.call(i, kd, "[", " ", "]", b, a)
};
Zb.prototype.w = h;
Zb.prototype.l = function(a, b) {
  return X.call(i, kd, "(", " ", ")", b, a)
};
Ta.array = h;
Ua.array = function(a, b) {
  return X.call(i, kd, "#<Array [", ", ", "]>", b, a)
};
Ta["function"] = h;
Ua["function"] = function(a) {
  return A.call(i, "#<", O.call(i, a), ">")
};
ac.prototype.w = h;
ac.prototype.l = function() {
  return A.call(i, "()")
};
cc.prototype.w = h;
cc.prototype.l = function(a, b) {
  return X.call(i, kd, "(", " ", ")", b, a)
};
Xc.prototype.w = h;
Xc.prototype.l = function(a, b) {
  return X.call(i, function(a) {
    return X.call(i, kd, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
function td(a, b, d, e) {
  this.state = a;
  this.f = b;
  this.Ba = d;
  this.Ca = e
}
p = td.prototype;
p.k = function(a) {
  return ca.call(i, a)
};
p.ta = function(a, b, d) {
  var e = D.call(i, this.Ca);
  if(u(e)) {
    var f = E.call(i, e);
    K.call(i, f, 0, i);
    for(K.call(i, f, 1, i);;) {
      var g = f, f = K.call(i, g, 0, i), g = K.call(i, g, 1, i);
      g.call(i, f, a, b, d);
      e = G.call(i, e);
      if(u(e)) {
        f = e, e = E.call(i, f), g = f, f = e, e = g
      }else {
        return i
      }
    }
  }else {
    return i
  }
};
p.w = h;
p.l = function(a, b) {
  return ic.call(i, T(["#<Atom: "]), Ua.call(i, this.state, b), ">")
};
p.u = h;
p.v = m("f");
p.ua = m("state");
p.j = function(a, b) {
  return a === b
};
var Y = function() {
  function a(a) {
    return new td(a, i, i, i)
  }
  var b = i, d = function() {
    function a(d, e) {
      var k = i;
      t(e) && (k = C(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, d, k)
    }
    function b(a, d) {
      var e = u(Cb.call(i, d)) ? Q.call(i, Xa, d) : d, f = M.call(i, e, "\ufdd0'validator"), e = M.call(i, e, "\ufdd0'meta");
      return new td(a, e, f, i)
    }
    a.d = 1;
    a.b = function(a) {
      var d = E(a), a = F(a);
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
  b.h = a;
  b.a = d;
  return b
}();
function ud(a, b) {
  var d = a.Ba;
  u(d) && !u(d.call(i, b)) && c(Error(O.call(i, "Assert failed: ", "Validator rejected reference state", "\n", qd.call(i, mb(A("\ufdd1'validate", "\ufdd1'new-value"), Xa("\ufdd0'line", 3282))))));
  d = a.state;
  a.state = b;
  Va.call(i, a, d, b);
  return b
}
var vd = function() {
  function a(a, b, d, e, f) {
    return ud.call(i, a, b.call(i, a.state, d, e, f))
  }
  function b(a, b, d, e) {
    return ud.call(i, a, b.call(i, a.state, d, e))
  }
  function d(a, b, d) {
    return ud.call(i, a, b.call(i, a.state, d))
  }
  function e(a, b) {
    return ud.call(i, a, b.call(i, a.state))
  }
  var f = i, g = function() {
    function a(b, d, e, f, g, j) {
      var I = i;
      t(j) && (I = C(Array.prototype.slice.call(arguments, 5), 0));
      return ud.call(i, b, Q.call(i, d, b.state, e, f, g, I))
    }
    a.d = 5;
    a.b = function(a) {
      var b = E(a), d = E(G(a)), e = E(G(G(a))), f = E(G(G(G(a)))), g = E(G(G(G(G(a))))), a = F(G(G(G(G(a)))));
      return ud.call(i, b, Q.call(i, d, b.state, e, f, g, a))
    };
    return a
  }(), f = function(f, k, n, q, s, x) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, n);
      case 4:
        return b.call(this, f, k, n, q);
      case 5:
        return a.call(this, f, k, n, q, s);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.P = b;
  f.na = a;
  f.xa = g;
  return f
}();
function Z(a) {
  return Ka.call(i, a)
}
var Nb = function() {
  function a(a) {
    return Math.random() * a
  }
  function b() {
    return d.call(i, 1)
  }
  var d = i, d = function(d) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a.call(this, d)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.O = b;
  d.h = a;
  return d
}(), Ob = function(a) {
  return Math.floor(Math.random() * a)
}, wd = Y.call(i, function() {
  return W(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":W([], {}), "\ufdd0'descendants":W([], {}), "\ufdd0'ancestors":W([], {})})
}.call(i)), xd = function() {
  function a(a, b, g) {
    var j = z.call(i, b, g);
    if(u(j)) {
      return j
    }
    j = Hb.call(i, "\ufdd0'ancestors".call(i, a).call(i, b), g);
    if(u(j)) {
      return j
    }
    j = xb.call(i, g);
    if(u(j)) {
      if(j = xb.call(i, b), u(j)) {
        if(j = z.call(i, J.call(i, g), J.call(i, b)), u(j)) {
          for(var j = h, k = 0;;) {
            var n;
            n = H.call(i, j);
            n = u(n) ? n : z.call(i, k, J.call(i, g));
            if(u(n)) {
              return j
            }
            j = d.call(i, a, b.call(i, k), g.call(i, k));
            k += 1
          }
        }else {
          return j
        }
      }else {
        return j
      }
    }else {
      return j
    }
  }
  function b(a, b) {
    return d.call(i, Z.call(i, wd), a, b)
  }
  var d = i, d = function(d, f, g) {
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
}(), yd = function() {
  function a(a, b) {
    return lc.call(i, M.call(i, "\ufdd0'parents".call(i, a), b))
  }
  function b(a) {
    return d.call(i, Z.call(i, wd), a)
  }
  var d = i, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.h = b;
  d.a = a;
  return d
}();
function zd(a, b, d, e) {
  vd.call(i, a, function() {
    return Z.call(i, b)
  });
  return vd.call(i, d, function() {
    return Z.call(i, e)
  })
}
var Cd = function Bd(b, d, e) {
  var f = Z.call(i, e).call(i, b), f = u(u(f) ? f.call(i, d) : f) ? h : i;
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = yd.call(i, d);;) {
      if(0 < J.call(i, f)) {
        Bd.call(i, b, E.call(i, f), e), f = F.call(i, f)
      }else {
        return i
      }
    }
  }();
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = yd.call(i, b);;) {
      if(0 < J.call(i, f)) {
        Bd.call(i, E.call(i, f), d, e), f = F.call(i, f)
      }else {
        return i
      }
    }
  }();
  return u(f) ? f : l
};
function Dd(a, b, d) {
  d = Cd.call(i, a, b, d);
  return u(d) ? d : xd.call(i, a, b)
}
var Fd = function Ed(b, d, e, f, g, j, k) {
  var n = N.call(i, function(e, f) {
    var j = K.call(i, f, 0, i);
    K.call(i, f, 1, i);
    if(u(xd.call(i, d, j))) {
      var k;
      k = (k = e === i) ? k : Dd.call(i, j, E.call(i, e), g);
      k = u(k) ? f : e;
      u(Dd.call(i, E.call(i, k), j, g)) || c(Error(O.call(i, "Multiple methods in multimethod '", b, "' match dispatch value: ", d, " -> ", j, " and ", E.call(i, k), ", and neither is preferred")));
      return k
    }
    return e
  }, i, Z.call(i, f));
  if(u(n)) {
    if(u(z.call(i, Z.call(i, k), Z.call(i, e)))) {
      return vd.call(i, j, kb, d, gb.call(i, n)), gb.call(i, n)
    }
    zd.call(i, j, f, k, e);
    return Ed.call(i, b, d, e, f, g, j, k)
  }
  return i
};
function Gd(a, b, d) {
  if(a ? a.pa : a) {
    a = a.pa(a, b, d)
  }else {
    var e;
    var f = Gd[r.call(i, a)];
    f ? e = f : (f = Gd._) ? e = f : c(v.call(i, "IMultiFn.-add-method", a));
    a = e.call(i, a, b, d)
  }
  return a
}
function Hd(a, b) {
  var d;
  if(a ? a.ra : a) {
    d = a.ra(0, b)
  }else {
    var e = Hd[r.call(i, a)];
    e ? d = e : (e = Hd._) ? d = e : c(v.call(i, "IMultiFn.-get-method", a));
    d = d.call(i, a, b)
  }
  return d
}
function Id(a, b) {
  var d;
  if(a ? a.qa : a) {
    d = a.qa(a, b)
  }else {
    var e = Id[r.call(i, a)];
    e ? d = e : (e = Id._) ? d = e : c(v.call(i, "IMultiFn.-dispatch", a));
    d = d.call(i, a, b)
  }
  return d
}
function Jd(a, b, d) {
  b = Q.call(i, b, d);
  a = Hd.call(i, a, b);
  u(a) || c(Error(O.call(i, "No method in multimethod '", ed, "' for dispatch value: ", b)));
  return Q.call(i, a, d)
}
function Kd(a, b, d, e, f, g, j, k) {
  this.name = a;
  this.za = b;
  this.ya = d;
  this.fa = e;
  this.da = f;
  this.Aa = g;
  this.ga = j;
  this.ea = k
}
p = Kd.prototype;
p.k = function(a) {
  return ca.call(i, a)
};
p.pa = function(a, b, d) {
  vd.call(i, this.da, kb, b, d);
  zd.call(i, this.ga, this.da, this.ea, this.fa);
  return a
};
p.ra = function(a, b) {
  u(z.call(i, Z.call(i, this.ea), Z.call(i, this.fa))) || zd.call(i, this.ga, this.da, this.ea, this.fa);
  var d = Z.call(i, this.ga).call(i, b);
  if(u(d)) {
    return d
  }
  d = Fd.call(i, this.name, b, this.fa, this.da, this.Aa, this.ga, this.ea);
  return u(d) ? d : Z.call(i, this.da).call(i, this.ya)
};
p.qa = function(a, b) {
  return Jd.call(i, a, this.za, b)
};
p.call = function() {
  function a(a, d) {
    var e = i;
    t(d) && (e = C(Array.prototype.slice.call(arguments, 1), 0));
    return Id.call(i, this, e)
  }
  a.d = 1;
  a.b = function(a) {
    E(a);
    a = F(a);
    return Id.call(i, this, a)
  };
  return a
}();
p.apply = function(a, b) {
  return Id.call(i, this, b)
};
function Ld(a) {
  return a.getContext("2d").getImageData(0, 0, a.width, a.height)
}
var Md = function() {
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
  var d = i, d = function(d, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, d);
      case 2:
        return a.call(this, d, f)
    }
    c("Invalid arity: " + arguments.length)
  };
  d.h = b;
  d.a = a;
  return d
}(), Nd = function() {
  var a = window.Ga;
  if(u(a)) {
    return a
  }
  a = window.Ha;
  if(u(a)) {
    return a
  }
  a = window.Da;
  if(u(a)) {
    return a
  }
  a = window.Fa;
  if(u(a)) {
    return a
  }
  a = window.Ea;
  return u(a) ? a : function(a) {
    return setTimeout(a, 17)
  }
}();
var Pd = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = C(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g;
    g = console;
    g = u(g) ? Z.call(i, a).call(i, "\ufdd0'debug") : g;
    return u(g) ? (a = Q.call(i, O, Od.call(i, a), " :: ", b, f), console.log(a)) : i
  }
  a.d = 2;
  a.b = function(a) {
    var e = E(a), f = E(G(a)), a = F(G(a));
    return b.call(this, e, f, a)
  };
  return a
}();
function Qd(a) {
  return u(rb.call(i, a)) ? a : T([a])
}
function Rd() {
  return W(["\ufdd0'in", "\ufdd0'out", "\ufdd0'constraints"], {"\ufdd0'in":T([]), "\ufdd0'out":T([]), "\ufdd0'constraints":T([])})
}
function Od(a) {
  return Sd.call(i, a, T(["\ufdd0'name"]))
}
function Sd(a, b) {
  return Ac.call(i, Z.call(i, a), b)
}
function Td(a, b, d) {
  return vd.call(i, a, function(a) {
    return Cc.call(i, a, b, d)
  })
}
var Ud = function() {
  function a(a, e) {
    var f = i;
    t(e) && (f = C(Array.prototype.slice.call(arguments, 1), 0));
    return b.call(this, a, f)
  }
  function b(a, b) {
    return vd.call(i, a, function(a) {
      return Q.call(i, Dc, a, b)
    })
  }
  a.d = 1;
  a.b = function(a) {
    var e = E(a), a = F(a);
    return b.call(this, e, a)
  };
  return a
}();
function Vd(a) {
  return Sd.call(i, a, T(["\ufdd0'current"]))
}
function Wd(a, b, d) {
  return Td.call(i, a, T(["\ufdd0'states", b]), d)
}
function Xd(a, b, d) {
  return Td.call(i, a, T(["\ufdd0'events", b]), d)
}
function Yd(a, b) {
  return Dc.call(i, a, T(["\ufdd0'in"]), ib, b)
}
function Zd(a, b) {
  var d = Sd.call(i, a, T(["\ufdd0'states", b, "\ufdd0'constraints"]));
  return u(d) ? nc.call(i, function(a) {
    return a.call(i, b)
  }, d) : h
}
var $d = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = C(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    b = D.call(i, Qd.call(i, b));
    if(u(b)) {
      for(var g = E.call(i, b);;) {
        if(u(Zd.call(i, a, g))) {
          var j = Sd.call(i, a, T(["\ufdd0'states", g, "\ufdd0'in"]));
          Ud.call(i, a, T(["\ufdd0'current"]), ib, g);
          Pd.call(i, a, "(set ", O.call(i, g), ") -> ", qd.call(i, Vd.call(i, a)));
          if(u(D.call(i, j)) && (Pd.call(i, a, "(in ", O.call(i, g), ")"), j = D.call(i, j), u(j))) {
            for(g = E.call(i, j);;) {
              if(Q.call(i, g, f), g = G.call(i, j), u(g)) {
                j = g, g = E.call(i, j)
              }else {
                break
              }
            }
          }
        }
        b = G.call(i, b);
        if(u(b)) {
          g = b, b = E.call(i, g), j = g, g = b, b = j
        }else {
          break
        }
      }
    }
    return a
  }
  a.d = 2;
  a.b = function(a) {
    var e = E(a), f = E(G(a)), a = F(G(a));
    return b.call(this, e, f, a)
  };
  return a
}(), ae = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = C(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g = D.call(i, Qd.call(i, b));
    if(u(g)) {
      for(b = E.call(i, g);;) {
        var j = Sd.call(i, a, T(["\ufdd0'events", b]));
        u(j) && (j = Q.call(i, j, f), Pd.call(i, a, "(trans ", O.call(i, b), ") -> ", Db.call(i, j), " :: context ", qd.call(i, f)));
        b = G.call(i, g);
        if(u(b)) {
          g = b, b = E.call(i, g)
        }else {
          return i
        }
      }
    }else {
      return i
    }
  }
  a.d = 2;
  a.b = function(a) {
    var e = E(a), f = E(G(a)), a = F(G(a));
    return b.call(this, e, f, a)
  };
  return a
}();
var be = document.getElementById("screen"), ce = document.getElementById("fps"), de = function() {
  function a(a) {
    var e = i;
    t(a) && (e = C(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    a = K.call(i, a, 0, i);
    return Y.call(i, W(["\ufdd0'debug", "\ufdd0'name", "\ufdd0'current", "\ufdd0'states", "\ufdd0'events"], {"\ufdd0'debug":h, "\ufdd0'name":ed.call(i, a), "\ufdd0'current":dd([]), "\ufdd0'states":W([], {}), "\ufdd0'events":W([], {})}))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return b.call(this, a)
  };
  return a
}().call(i, "\ufdd0'page");
screen.width = 640;
screen.height = 480;
var ee = W(["\ufdd0'wall", "\ufdd0'test", "\ufdd0'test2", "\ufdd0'floor"], {"\ufdd0'wall":"res/wallnew.png", "\ufdd0'test":"res/test.png", "\ufdd0'test2":"res/testgrad.png", "\ufdd0'floor":"res/wallnew.png"}), oa = function(a) {
  return console.log(a)
};
var fe = Y.h(dd([])), ge = Y.h(W([], {})), he = Y.h(l);
function ie() {
  return u(H(Z(he))) ? (u(l) && sd("couldn't load everything... gonna go for it regardless"), ud(he, h), vd.a(fe, jb), ae.call(i, de, "\ufdd0'loaded")) : u(l) ? sd("Assets loaded successfully") : i
}
var je = function() {
  var a = Y.h(W([], {})), b = Y.h(W([], {})), d = Y.h(W([], {})), e = Y.h(W([], {})), f = M.c(W([], {}), "\ufdd0'hierarchy", wd);
  return new Kd("loaded", function() {
    function a(b, d) {
      t(d) && C(Array.prototype.slice.call(arguments, 1), 0);
      return b
    }
    a.d = 1;
    a.b = function(a) {
      var b = E(a);
      F(a);
      return b
    };
    return a
  }(), "\ufdd0'default", f, a, b, d, e)
}();
Gd(je, "\ufdd0'default", function(a, b, d) {
  return u(l) ? (sd(O("Don't know what to do with ", a, ", ", b, ".")), rd(d)) : i
});
Gd(je, "\ufdd0'image", function(a, b, d) {
  var a = document.createElement(ed("\ufdd0'canvas")), e = d.width, f = d.height;
  a.width = e;
  a.height = f;
  a.getContext("2d").drawImage(d, 0, 0, e, f);
  vd.P(ge, kb, b, a);
  vd.c(fe, ob, b);
  u(qb(Z(fe))) ? (ud(he, h), b = ae.call(i, de, "\ufdd0'loaded")) : b = i;
  return b
});
var ke = function() {
  var a = Y.h(W([], {})), b = Y.h(W([], {})), d = Y.h(W([], {})), e = Y.h(W([], {})), f = M.c(W([], {}), "\ufdd0'hierarchy", wd);
  return new Kd("load", function(a, b) {
    return u(gd.call(i, /(.*)\.(png|gif|jpe?g)/, b)) ? "\ufdd0'image" : "\ufdd0'unknown"
  }, "\ufdd0'default", f, a, b, d, e)
}();
Gd(ke, "\ufdd0'default", function(a, b) {
  return u(l) ? sd(O("Don't know how to load ", a, " from url ", b)) : i
});
Gd(ke, "\ufdd0'image", function(a, b) {
  var d = document.createElement(ed("\ufdd0'img"));
  d.src = b;
  return d.onload = function() {
    return je.call(i, "\ufdd0'image", a, d)
  }
});
function le(a, b) {
  for(var d = Array(a), e = 0;;) {
    if(e < a) {
      d[e] = b, e += 1
    }else {
      break
    }
  }
  return d
}
function me(a, b) {
  function d(a, b, d, e) {
    var f = 2 * (-0.5 - Sb), k = 2 * (0.5 - Sb), a = 2 * (a - 0.5 - g), b = 2 * (b - 0.5 - j), d = 2 * (d - 0.5 - g), n = 2 * (e - 0.5 - j), e = a * bb - b * cb, b = b * bb + a * cb, a = d * bb - n * cb, d = n * bb + d * cb;
    if((n = 0.2 > b) ? 0.2 > d : n) {
      return i
    }
    var q = 0.2 > b, s = 0.2 > d, L = (0.2 - b) / (d - b), x = q ? e + L * (a - e) : e, n = q ? b + L * (d - b) : b, R = s ? n + L * (d - n) : d, e = Fc - x / n * I, x = Fc - (s ? x + L * (a - x) : a) / R * I;
    if(e < x) {
      for(var a = V < Math.ceil.call(i, x) ? V : Math.ceil.call(i, x), b = f / n * I + tb, d = k / n * I + tb, f = f / R * I + tb, k = k / R * I + tb, n = 1 / n, S = 1 / R, R = S - n, q = (q ? 0 + 16 * L : 0) * n, s = (s ? 0 + 16 * L : 16) * S - q, L = 1 / (x - e), x = 0 > Math.ceil.call(i, e) ? 0 : Math.ceil.call(i, e);;) {
        if(x < a) {
          var da = L * (x - e), S = n + R * da;
          if(Ad[x] <= S) {
            Ad[x] = S;
            for(var Wb = Math.floor.call(i, (q + s * da) / S), Tb = b + da * (f - b) - 0.5, ub = d + da * (k - d), da = I < Math.ceil.call(i, ub) ? I : Math.ceil.call(i, ub), ub = 1 / (ub - Tb), db = 0 > Math.ceil.call(i, Tb) ? 0 : Math.ceil.call(i, Tb);;) {
              if(db < da) {
                var Gc = 4 * (Wb + 16 * Math.floor.call(i, 16 * ub * (db - Tb))), Ub = 4 * (x + db * V);
                Vb[x + db * V] = 4 / S;
                $[Ub] = mc[Gc];
                $[1 + Ub] = mc[1 + Gc];
                $[2 + Ub] = mc[2 + Gc];
                $[3 + Ub] = 255;
                db += 1
              }else {
                break
              }
            }
          }
          x += 1
        }else {
          return i
        }
      }
    }else {
      return i
    }
  }
  for(var e = u(Cb(a)) ? Q.a(Xa, a) : a, f = M.a(e, "\ufdd0'player"), f = u(Cb(f)) ? Q.a(Xa, f) : f, g = M.a(f, "\ufdd0'x"), j = M.a(f, "\ufdd0'y"), k = M.a(f, "\ufdd0'z"), n = M.a(f, "\ufdd0'rot"), q = M.a(f, "\ufdd0'walkphase"), s = M.a(f, "\ufdd0'walk"), x = M.a(e, "\ufdd0'level"), V = b.width, I = b.height, e = b.getContext("2d"), L = Ld(M.a(Z(ge), "\ufdd0'floor")).data, mc = Ld(M.a(Z(ge), "\ufdd0'wall")).data, f = e.createImageData(V, I), $ = f.data, Vb = le(V * I, 1E4), Ad = le(V, 0), Sb = 
  0.01 * s * Math.sin.call(i, 0.4 * q) - k - 0.2, Fc = V / 2, tb = I / 3, bb = Math.cos.call(i, n), cb = Math.sin.call(i, n), k = Math.floor.call(i, g), n = Math.floor.call(i, j), q = V * I, s = 0;;) {
    if(s < q) {
      $[3 + 4 * s] = 255, s += 1
    }else {
      break
    }
  }
  for(q = n - 6;;) {
    if(q <= n + 6) {
      for(s = k - 6;;) {
        if(s <= k + 6) {
          var R = x.call(i, s + 1, q), S = x.call(i, s, q + 1);
          0 < x.call(i, s, q) ? (0 < R || d.call(i, s + 1, q + 1, s + 1, q), 0 < S || d.call(i, s, q + 1, s + 1, q + 1)) : (0 < R && d.call(i, s + 1, q, s + 1, q + 1), 0 < S && d.call(i, s + 1, q + 1, s, q + 1));
          s += 1
        }else {
          break
        }
      }
      q += 1
    }else {
      break
    }
  }
  for(k = 0;;) {
    if(k < I) {
      q = (k + 0.5 - tb) / I;
      n = k * V;
      q = 0 > q ? (4 + 8 * Sb) / -q : (4 - 8 * Sb) / q;
      s = V;
      for(R = 0;;) {
        if(R < s) {
          if(Vb[R + n] > q) {
            var da = q * ((Fc - R) / I), S = 2 * (da * bb + q * cb + 8 * (0.5 + g)), Wb = 2 * (q * bb + -1 * da * cb + 8 * (0.5 + j));
            0 < x.call(i, S >> 4, Wb >> 4) || (da = 4 * (R + n), S = 4 * ((S & 15) + 16 * (Wb & 15)), Vb[R + n] = q, $[da] = L[S], $[1 + da] = L[1 + S], $[2 + da] = L[2 + S], $[3 + da] = 255)
          }
          R += 1
        }else {
          break
        }
      }
      k += 1
    }else {
      break
    }
  }
  x = V * I;
  for(L = 0;;) {
    if(L < x) {
      s = Vb[L], 0 < s && (R = L % V, S = (R - V / 2) / V, k = 4 * L, n = $[1 + k], q = $[2 + k], s = Math.floor.call(i, 300 - 6 * s * (2 * S * S + 1)) + 4 * (R + 14 * Math.floor.call(i, L / V) & 3) >> 4 << 4, s = 0 > (255 < Math.floor.call(i, s) ? 255 : Math.floor.call(i, s)) ? 0 : 255 < Math.floor.call(i, s) ? 255 : Math.floor.call(i, s), $[k] = Math.floor.call(i, $[k] * s / 255), $[1 + k] = Math.floor.call(i, n * s / 255), $[2 + k] = Math.floor.call(i, q * s / 255)), L += 1
    }else {
      break
    }
  }
  return e.putImageData(f, 0, 0)
}
;function ne(a, b, d, e, f) {
  this.I = a;
  this.H = b;
  this.data = d;
  this.g = e;
  this.e = f;
  3 < arguments.length ? (this.g = e, this.e = f) : this.e = this.g = i
}
p = ne.prototype;
p.k = function(a) {
  return ab(a)
};
p.M = function(a, b) {
  return y.c(a, b, i)
};
p.N = function(a, b, d) {
  return"\ufdd0'w" === b ? this.I : "\ufdd0'h" === b ? this.H : "\ufdd0'data" === b ? this.data : M.c(this.e, b, d)
};
p.R = function(a, b, d) {
  return u(Wa.call(i, "\ufdd0'w", b)) ? new ne(d, this.H, this.data, this.g, this.e) : u(Wa.call(i, "\ufdd0'h", b)) ? new ne(this.I, d, this.data, this.g, this.e) : u(Wa.call(i, "\ufdd0'data", b)) ? new ne(this.I, this.H, d, this.g, this.e) : new ne(this.I, this.H, this.data, this.g, kb.c(this.e, b, d))
};
p.call = function(a, b, d) {
  a = (a = -1 < b) ? b < this.I : a;
  u(a) && (a = (a = -1 < d) ? d < this.H : a);
  return u(a) ? this.data[d][b] : 2
};
p.B = h;
p.t = function(a, b) {
  return u(xb(b)) ? za(a, w.a(b, 0), w.a(b, 1)) : N.c(ua, a, b)
};
p.toString = function() {
  for(var a = [O("Width: ", this.I, ". Height: ", this.H, ".")], b = this.H, d = 0;;) {
    if(d < b) {
      for(var e = [], f = this.data[d], g = this.I, j = 0;;) {
        if(j < g) {
          e.push(function() {
            var a = f[j];
            return u(Pb.call(i, 0, a)) ? "." : u(Pb.call(i, 1, a)) ? "#" : u(Pb.call(i, 2, a)) ? "$" : "?"
          }()), j += 1
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
p.z = function() {
  return D(ic.a(T([U("\ufdd0'w", this.I), U("\ufdd0'h", this.H), U("\ufdd0'data", this.data)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(kd, "", " ", "", b, a)
  }, O("#", "argh.level.Level", "{"), ", ", "}", b, ic.a(T([U("\ufdd0'w", this.I), U("\ufdd0'h", this.H), U("\ufdd0'data", this.data)]), this.e))
};
p.F = function() {
  return 3 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Tc(a, b) : d
};
p.C = function(a, b) {
  return new ne(this.I, this.H, this.data, b, this.e)
};
p.u = h;
p.v = m("g");
p.$ = h;
p.V = function(a, b) {
  return u(Hb(dd(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), b)) ? lb.a(mb(yc(W([], {}), a), this.g), b) : new ne(this.I, this.H, this.data, this.g, lc(lb.a(this.e, b)))
};
function oe(a, b, d) {
  return new ne(a, b, d)
}
function pe(a, b, d) {
  for(var e = [], f = -1;;) {
    if(1 >= f) {
      for(var g = -1;;) {
        if(1 >= g) {
          var j = g === f, j = H(j ? 0 === f : j);
          u(u(j) ? 0 === d[b + f][a + g] : j) && e.push("\ufdd0'found");
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
function qe(a, b, d) {
  for(var e = Array(b), f = 0;;) {
    if(f < b) {
      var g = Array(a);
      e[f] = g;
      for(var j = a, k = 0;;) {
        if(k < j) {
          g[k] = d.call(i, k, f), k += 1
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
function re(a, b, d) {
  for(var e = 0;;) {
    if(2E4 > e) {
      var f = Ob(a - 2) + 1, g = Ob(b - 2) + 1;
      d[g][f] = u(kc.a(h, 6 > pe(f, g, d))) ? 0 : 1;
      e += 1
    }else {
      break
    }
  }
  return d
}
function se(a, b, d) {
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
function te(a, b) {
  var d = oe(a, b, se(a, b, re(a, b, qe(a, b, function() {
    return 0.85 > Nb.O() ? 0 : 1
  }))));
  rd(d.toString());
  return d
}
function ue(a, b) {
  return te(a, b)
}
function ve(a) {
  var a = u(Cb(a)) ? Q.a(Xa, a) : a, b = M.a(a, "\ufdd0'h"), d = M.a(a, "\ufdd0'w"), e;
  a: {
    var f = M.a(a, "\ufdd0'data"), g = qa(f);
    for(e = 0;;) {
      if(e < f.length) {
        g[e] = qa(g[e]), e += 1
      }else {
        e = g;
        break a
      }
    }
    e = void 0
  }
  for(var f = Y.h(T([-1, -1])), g = Y.h(-1), j = 0;;) {
    if(j < d) {
      for(var k = b, n = 0;;) {
        if(n < k) {
          var q = 0 === e[n][j];
          if(q ? 0 === a.call(i, j, n) : q) {
            q = Y.h(0), we.call(i, j, n, a, e, q), Z(q) > Z(g) && (ud(g, Z(q)), ud(f, T([j, n])))
          }
          n += 1
        }else {
          break
        }
      }
      j += 1
    }else {
      break
    }
  }
  u(l) && (b = Z(f), a = K.c(b, 0, i), b = K.c(b, 1, i), sd(O("Found cave at [", a, ", ", b, "] of size ", Z(g), ".")));
  return Z(f)
}
var we = function xe(b, d, e, f, g) {
  var j = 0 === f[d][b];
  return(j ? 0 === e.call(i, b, d) : j) ? (f[d][b] = -1, vd.a(g, Ya), xe.call(i, b + 1, d, e, f, g), xe.call(i, b - 1, d, e, f, g), xe.call(i, b, d + 1, e, f, g), xe.call(i, b, d - 1, e, f, g)) : i
};
function ye(a, b, d, e, f, g, j, k, n, q, s) {
  this.x = a;
  this.y = b;
  this.s = d;
  this.m = e;
  this.q = f;
  this.r = g;
  this.n = j;
  this.o = k;
  this.p = n;
  this.g = q;
  this.e = s;
  9 < arguments.length ? (this.g = q, this.e = s) : this.e = this.g = i
}
p = ye.prototype;
p.k = function(a) {
  return ab(a)
};
p.M = function(a, b) {
  return y.c(a, b, i)
};
p.N = function(a, b, d) {
  return"\ufdd0'x" === b ? this.x : "\ufdd0'y" === b ? this.y : "\ufdd0'z" === b ? this.s : "\ufdd0'rot" === b ? this.m : "\ufdd0'xacc" === b ? this.q : "\ufdd0'yacc" === b ? this.r : "\ufdd0'rotacc" === b ? this.n : "\ufdd0'walk" === b ? this.o : "\ufdd0'walkphase" === b ? this.p : M.c(this.e, b, d)
};
p.R = function(a, b, d) {
  return u(Wa.call(i, "\ufdd0'x", b)) ? new ye(d, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'y", b)) ? new ye(this.x, d, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'z", b)) ? new ye(this.x, this.y, d, this.m, this.q, this.r, this.n, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'rot", b)) ? new ye(this.x, this.y, this.s, d, this.q, this.r, this.n, this.o, this.p, this.g, this.e) : 
  u(Wa.call(i, "\ufdd0'xacc", b)) ? new ye(this.x, this.y, this.s, this.m, d, this.r, this.n, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'yacc", b)) ? new ye(this.x, this.y, this.s, this.m, this.q, d, this.n, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'rotacc", b)) ? new ye(this.x, this.y, this.s, this.m, this.q, this.r, d, this.o, this.p, this.g, this.e) : u(Wa.call(i, "\ufdd0'walk", b)) ? new ye(this.x, this.y, this.s, this.m, this.q, this.r, this.n, d, this.p, this.g, this.e) : 
  u(Wa.call(i, "\ufdd0'walkphase", b)) ? new ye(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, d, this.g, this.e) : new ye(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.g, kb.c(this.e, b, d))
};
p.B = h;
p.t = function(a, b) {
  return u(xb(b)) ? za(a, w.a(b, 0), w.a(b, 1)) : N.c(ua, a, b)
};
p.z = function() {
  return D(ic.a(T([U("\ufdd0'x", this.x), U("\ufdd0'y", this.y), U("\ufdd0'z", this.s), U("\ufdd0'rot", this.m), U("\ufdd0'xacc", this.q), U("\ufdd0'yacc", this.r), U("\ufdd0'rotacc", this.n), U("\ufdd0'walk", this.o), U("\ufdd0'walkphase", this.p)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(kd, "", " ", "", b, a)
  }, O("#", "argh.game.Player", "{"), ", ", "}", b, ic.a(T([U("\ufdd0'x", this.x), U("\ufdd0'y", this.y), U("\ufdd0'z", this.s), U("\ufdd0'rot", this.m), U("\ufdd0'xacc", this.q), U("\ufdd0'yacc", this.r), U("\ufdd0'rotacc", this.n), U("\ufdd0'walk", this.o), U("\ufdd0'walkphase", this.p)]), this.e))
};
p.F = function() {
  return 9 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Tc(a, b) : d
};
p.C = function(a, b) {
  return new ye(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, b, this.e)
};
p.u = h;
p.v = m("g");
p.$ = h;
p.V = function(a, b) {
  return u(Hb(dd("\ufdd0'z,\ufdd0'y,\ufdd0'x,\ufdd0'xacc,\ufdd0'rot,\ufdd0'yacc,\ufdd0'walkphase,\ufdd0'rotacc,\ufdd0'walk".split(",")), b)) ? lb.a(mb(yc(W([], {}), a), this.g), b) : new ye(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.g, lc(lb.a(this.e, b)))
};
function ze(a, b, d, e) {
  this.T = a;
  this.S = b;
  this.g = d;
  this.e = e;
  2 < arguments.length ? (this.g = d, this.e = e) : this.e = this.g = i
}
p = ze.prototype;
p.k = function(a) {
  return ab(a)
};
p.M = function(a, b) {
  return y.c(a, b, i)
};
p.N = function(a, b, d) {
  return"\ufdd0'player" === b ? this.T : "\ufdd0'level" === b ? this.S : M.c(this.e, b, d)
};
p.R = function(a, b, d) {
  return u(Wa.call(i, "\ufdd0'player", b)) ? new ze(d, this.S, this.g, this.e) : u(Wa.call(i, "\ufdd0'level", b)) ? new ze(this.T, d, this.g, this.e) : new ze(this.T, this.S, this.g, kb.c(this.e, b, d))
};
p.B = h;
p.t = function(a, b) {
  return u(xb(b)) ? za(a, w.a(b, 0), w.a(b, 1)) : N.c(ua, a, b)
};
p.z = function() {
  return D(ic.a(T([U("\ufdd0'player", this.T), U("\ufdd0'level", this.S)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(kd, "", " ", "", b, a)
  }, O("#", "argh.game.Game", "{"), ", ", "}", b, ic.a(T([U("\ufdd0'player", this.T), U("\ufdd0'level", this.S)]), this.e))
};
p.F = function() {
  return 2 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Tc(a, b) : d
};
p.C = function(a, b) {
  return new ze(this.T, this.S, b, this.e)
};
p.u = h;
p.v = m("g");
p.$ = h;
p.V = function(a, b) {
  return u(Hb(dd(["\ufdd0'player", "\ufdd0'level"]), b)) ? lb.a(mb(yc(W([], {}), a), this.g), b) : new ze(this.T, this.S, this.g, lc(lb.a(this.e, b)))
};
function Ae(a, b, d) {
  var e = Math.floor.call(i, 0.5 + b - 0.3), f = Math.floor.call(i, 0.5 + b + 0.3), g = Math.floor.call(i, 0.5 + d - 0.3), j = Math.floor.call(i, 0.5 + d + 0.3);
  return H(function() {
    var b = 0 < a.call(i, e, g);
    if(b || (b = 0 < a.call(i, f, g))) {
      return b
    }
    return(b = 0 < a.call(i, e, j)) ? b : 0 < a.call(i, f, j)
  }())
}
function Be(a, b) {
  var d = u(Cb(a)) ? Q.a(Xa, a) : a;
  M.a(d, "\ufdd0'rotacc");
  M.a(d, "\ufdd0'rot");
  var e = M.a(d, "\ufdd0'y"), f = M.a(d, "\ufdd0'x"), g = M.a(d, "\ufdd0'yacc"), j = M.a(d, "\ufdd0'xacc"), k = Math.floor.call(i, Math.abs.call(i, 100 * j) + 1), n = function() {
    for(var a = k, d = f, g = j;;) {
      if(0 === a) {
        return T([d, g])
      }
      if(u(Ae(b, d + g * (a / k), e))) {
        return T([d + g * (a / k), g])
      }
      a -= 1;
      g = 0
    }
  }(), q = K.c(n, 0, i);
  K.c(n, 1, i);
  var s = Math.floor.call(i, Math.abs.call(i, 100 * g) + 1), n = function() {
    for(var a = s, d = e, j = g;;) {
      if(0 === a) {
        return T([d, j])
      }
      if(u(Ae(b, f, d + j * (a / s)))) {
        return T([d + j * (a / s), j])
      }
      a -= 1;
      j = 0
    }
  }(), x = K.c(n, 0, i);
  K.c(n, 1, i);
  return kb(d, "\ufdd0'x", q, "\ufdd0'y", x, "\ufdd0'xacc", j, "\ufdd0'yacc", g)
}
function Ce(a, b, d) {
  return u(a.call(i, d)) ? -1 : u(a.call(i, b)) ? 1 : 0
}
var De = document.getElementById("step");
function Ee(a, b) {
  var d = u(Cb(a)) ? Q.a(Xa, a) : a, e = M.a(d, "\ufdd0'player"), f = u(Cb(e)) ? Q.a(Xa, e) : e, g = M.a(f, "\ufdd0'rotacc"), j = M.a(f, "\ufdd0'rot");
  M.a(f, "\ufdd0'y");
  M.a(f, "\ufdd0'x");
  var e = M.a(d, "\ufdd0'level"), k = Ce(b, "\ufdd0'strafer", "\ufdd0'strafel"), n = Ce(b, "\ufdd0'down", "\ufdd0'up"), q = k * k + n * n, q = 0 < q ? Math.sqrt.call(i, q) : 1, k = k / q, q = n / q, s = 0.05 * Ce(b, "\ufdd0'left", "\ufdd0'right"), n = Math.sqrt.call(i, k * k + q * q), f = Dc(Dc(Dc(Dc(Dc(Dc(f, T(["\ufdd0'walk"]), Lb, 0.6), T(["\ufdd0'walk"]), Jb, n), T(["\ufdd0'walkphase"]), Jb, n), T(["\ufdd0'rotacc"]), Jb, s), T(["\ufdd0'xacc"]), Kb, 0.03 * (k * Math.cos.call(i, j) + q * Math.sin.call(i, 
  j))), T(["\ufdd0'yacc"]), Kb, 0.03 * (q * Math.cos.call(i, j) - k * Math.sin.call(i, j))), d = Dc(Cc(d, T(["\ufdd0'player"]), Be(f, e)), T(["\ufdd0'player"]), function(a) {
    return Dc(Dc(Dc(Dc(a, T(["\ufdd0'xacc"]), Lb, 0.6), T(["\ufdd0'yacc"]), Lb, 0.6), T(["\ufdd0'rot"]), Jb, g), T(["\ufdd0'rotacc"]), Lb, 0.4)
  });
  0.7 < n && De.play();
  return d
}
;var Fe = Y.h(dd([])), Ge = Y.h(i), He = document.createElement("canvas");
He.width = 160;
He.height = 120;
var Ie = Y.h((new Date).getTime()), Ke = function Je() {
  if(u("\ufdd0'escape".call(i, Z(Fe)))) {
    return i
  }
  var b = (new Date).getTime(), d = 1E3 / (b - Z(Ie)), e = 0.06 * (b - Z(Ie)), f = Z(Fe);
  ce.innerHTML = O(Math.floor.call(i, 100 * d) / 100, " fps");
  vd.a(Ge, function(b) {
    for(var d = e;;) {
      if(0 < d) {
        d -= 1, b = Ee(b, f)
      }else {
        return b
      }
    }
  });
  ud(Ie, (new Date).getTime());
  Md.a(He, "black");
  Nd.call(i, Je);
  me.call(i, Z(Ge), He);
  return be.getContext("2d").drawImage(He, 0, 0, be.width, be.height)
}, Le;
a: {
  for(var Me = [65, 68, 37, 38, 39, 40, 83, 87, 27], Ne = "\ufdd0'strafel,\ufdd0'strafer,\ufdd0'left,\ufdd0'up,\ufdd0'right,\ufdd0'down,\ufdd0'down,\ufdd0'up,\ufdd0'escape".split(","), Oe = Me.length, Pe = 0, Qe = $c;;) {
    if(Pe < Oe) {
      var Re = Pe + 1, Se = kb.call(i, Qe, Me[Pe], Ne[Pe]), Pe = Re, Qe = Se
    }else {
      Le = Qe;
      break a
    }
  }
  Le = void 0
}
function Te() {
  function a(a) {
    return function(d) {
      vd.c(Fe, a, Le.call(i, d.keyCode));
      return d.preventDefault()
    }
  }
  document.onkeydown = a.call(i, ib);
  document.onkeyup = a.call(i, ob)
}
function Ue(a) {
  Md.a(be, "black");
  var b = be.getContext("2d");
  b.fillStyle = "white";
  b.font = "30px sans-serif";
  b.fillText(a, (be.width - b.measureText(a).width) / 2, be.height / 2)
}
var Ve = Yd.call(i, Rd.call(i), function() {
  Ue("Loading assets...");
  var a = D(ee);
  if(u(a)) {
    var b = E(a);
    K.c(b, 0, i);
    for(K.c(b, 1, i);;) {
      var d = b, b = K.c(d, 0, i), d = K.c(d, 1, i);
      vd.c(fe, ib, b);
      ke.call(i, b, d);
      a = G(a);
      if(u(a)) {
        b = a, a = E(b), d = b, b = a, a = d
      }else {
        break
      }
    }
  }
  return setTimeout(ie, 1E3)
});
Wd.call(i, de, "\ufdd0'loading", Ve);
var We = Yd.call(i, Rd.call(i), function() {
  Ue("Initializing game...");
  Ue("Binding events...");
  Te();
  Ue("Generating world...");
  var a = ue.call(i, 60, 60), b, d = ve.call(i, a);
  b = K.c(d, 0, i);
  d = K.c(d, 1, i);
  b = new ye(b, d, 0, Nb.O(), 0, 0, 0, 0, 0);
  ud(Ge, new ze(b, a));
  Ue("Starting game loop!");
  return Nd.call(i, Ke)
});
Wd.call(i, de, "\ufdd0'playing", We);
Xd.call(i, de, "\ufdd0'init", function() {
  return $d.call(i, de, "\ufdd0'loading")
});
Xd.call(i, de, "\ufdd0'loaded", function() {
  return $d.call(i, de, "\ufdd0'playing")
});
ae.call(i, de, "\ufdd0'init");
