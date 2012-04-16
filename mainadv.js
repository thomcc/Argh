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
function n(a) {
  return function() {
    return a
  }
}
var p;
function s(a) {
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
  return a[da] || (a[da] = ++ea)
}
var da = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), ea = 0;
var fa = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"}, ga = {"'":"\\'"};
function ha(a) {
  var o;
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0), g = b, j = d + 1, k;
    if(!(k = fa[e])) {
      if(!(31 < f && 127 > f)) {
        if(e in ga) {
          e = ga[e]
        }else {
          if(e in fa) {
            o = ga[e] = fa[e], e = o
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
            e = ga[e] = f
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
function ia(a) {
  for(var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d), b %= 4294967296
  }
  return b
}
;function ja(a, b, d) {
  for(var e in a) {
    b.call(d, a[e], e, a)
  }
}
function ka(a) {
  var b = {}, d;
  for(d in a) {
    b[d] = a[d]
  }
  return b
}
;var la;
(la = "ScriptEngine" in this && "JScript" == this.ScriptEngine()) && (this.ScriptEngineMajorVersion(), this.ScriptEngineMinorVersion(), this.ScriptEngineBuildVersion());
function ma(a, b) {
  this.A = la ? [] : "";
  a != i && this.append.apply(this, arguments)
}
la ? (ma.prototype.ga = 0, ma.prototype.append = function(a, b, d) {
  b == i ? this.A[this.ga++] = a : (this.A.push.apply(this.A, arguments), this.ga = this.A.length);
  return this
}) : ma.prototype.append = function(a, b, d) {
  this.A += a;
  if(b != i) {
    for(var e = 1;e < arguments.length;e++) {
      this.A += arguments[e]
    }
  }
  return this
};
ma.prototype.clear = function() {
  la ? this.ga = this.A.length = 0 : this.A = ""
};
ma.prototype.toString = function() {
  if(la) {
    var a = this.A.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.A
};
function na() {
  c(Error("No *print-fn* fn set for evaluation environment"))
}
function u(a) {
  return a != i && a !== l
}
function oa(a, b) {
  var d = a[s.call(i, b)];
  if(u(d)) {
    return d
  }
  d = a._;
  return u(d) ? d : l
}
function v(a, b) {
  return Error("No protocol method " + a + " defined for type " + s.call(i, b) + ": " + b)
}
function pa(a) {
  return Array.prototype.slice.call(a)
}
function qa(a) {
  if(a ? a.F : a) {
    a = a.F(a)
  }else {
    var b;
    var d = qa[s.call(i, a)];
    d ? b = d : (d = qa._) ? b = d : c(v.call(i, "ICounted.-count", a));
    a = b.call(i, a)
  }
  return a
}
var ra = {};
function sa(a, b) {
  var d;
  if(a ? a.t : a) {
    d = a.t(a, b)
  }else {
    var e = sa[s.call(i, a)];
    e ? d = e : (e = sa._) ? d = e : c(v.call(i, "ICollection.-conj", a));
    d = d.call(i, a, b)
  }
  return d
}
var w = function() {
  function a(a, b, d) {
    if(a ? a.ja : a) {
      a = a.ja(a, b, d)
    }else {
      var j;
      var k = w[s.call(i, a)];
      k ? j = k : (k = w._) ? j = k : c(v.call(i, "IIndexed.-nth", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.ia : a) {
      d = a.ia(a, b)
    }else {
      var j = w[s.call(i, a)];
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
}(), ta = {};
function ua(a) {
  if(a ? a.V : a) {
    a = a.V(a)
  }else {
    var b;
    var d = ua[s.call(i, a)];
    d ? b = d : (d = ua._) ? b = d : c(v.call(i, "ISeq.-first", a));
    a = b.call(i, a)
  }
  return a
}
function va(a) {
  if(a ? a.W : a) {
    a = a.W(a)
  }else {
    var b;
    var d = va[s.call(i, a)];
    d ? b = d : (d = va._) ? b = d : c(v.call(i, "ISeq.-rest", a));
    a = b.call(i, a)
  }
  return a
}
var x = function() {
  function a(a, b, d) {
    if(a ? a.M : a) {
      a = a.M(a, b, d)
    }else {
      var j;
      var k = x[s.call(i, a)];
      k ? j = k : (k = x._) ? j = k : c(v.call(i, "ILookup.-lookup", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.L : a) {
      d = a.L(a, b)
    }else {
      var j = x[s.call(i, a)];
      j ? d = j : (j = x._) ? d = j : c(v.call(i, "ILookup.-lookup", a));
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
function xa(a, b) {
  var d;
  if(a ? a.ha : a) {
    d = a.ha(a, b)
  }else {
    var e = xa[s.call(i, a)];
    e ? d = e : (e = xa._) ? d = e : c(v.call(i, "IAssociative.-contains-key?", a));
    d = d.call(i, a, b)
  }
  return d
}
function ya(a, b, d) {
  if(a ? a.Q : a) {
    a = a.Q(a, b, d)
  }else {
    var e;
    var f = ya[s.call(i, a)];
    f ? e = f : (f = ya._) ? e = f : c(v.call(i, "IAssociative.-assoc", a));
    a = e.call(i, a, b, d)
  }
  return a
}
var za = {};
function Aa(a, b) {
  var d;
  if(a ? a.U : a) {
    d = a.U(a, b)
  }else {
    var e = Aa[s.call(i, a)];
    e ? d = e : (e = Aa._) ? d = e : c(v.call(i, "IMap.-dissoc", a));
    d = d.call(i, a, b)
  }
  return d
}
var Ba = {};
function Ha(a, b) {
  var d;
  if(a ? a.ra : a) {
    d = a.ra(0, b)
  }else {
    var e = Ha[s.call(i, a)];
    e ? d = e : (e = Ha._) ? d = e : c(v.call(i, "ISet.-disjoin", a));
    d = d.call(i, a, b)
  }
  return d
}
var Ia = {};
function Ja(a) {
  if(a ? a.ta : a) {
    a = a.state
  }else {
    var b;
    var d = Ja[s.call(i, a)];
    d ? b = d : (d = Ja._) ? b = d : c(v.call(i, "IDeref.-deref", a));
    a = b.call(i, a)
  }
  return a
}
var Ka = {};
function La(a) {
  if(a ? a.v : a) {
    a = a.v(a)
  }else {
    var b;
    var d = La[s.call(i, a)];
    d ? b = d : (d = La._) ? b = d : c(v.call(i, "IMeta.-meta", a));
    a = b.call(i, a)
  }
  return a
}
function Ma(a, b) {
  var d;
  if(a ? a.C : a) {
    d = a.C(a, b)
  }else {
    var e = Ma[s.call(i, a)];
    e ? d = e : (e = Ma._) ? d = e : c(v.call(i, "IWithMeta.-with-meta", a));
    d = d.call(i, a, b)
  }
  return d
}
var Na = function() {
  function a(a, b, d) {
    if(a ? a.la : a) {
      a = a.la(a, b, d)
    }else {
      var j;
      var k = Na[s.call(i, a)];
      k ? j = k : (k = Na._) ? j = k : c(v.call(i, "IReduce.-reduce", a));
      a = j.call(i, a, b, d)
    }
    return a
  }
  function b(a, b) {
    var d;
    if(a ? a.ka : a) {
      d = a.ka(a, b)
    }else {
      var j = Na[s.call(i, a)];
      j ? d = j : (j = Na._) ? d = j : c(v.call(i, "IReduce.-reduce", a));
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
function Oa(a, b) {
  var d;
  if(a ? a.j : a) {
    d = a.j(a, b)
  }else {
    var e = Oa[s.call(i, a)];
    e ? d = e : (e = Oa._) ? d = e : c(v.call(i, "IEquiv.-equiv", a));
    d = d.call(i, a, b)
  }
  return d
}
function Pa(a) {
  if(a ? a.k : a) {
    a = a.k(a)
  }else {
    var b;
    var d = Pa[s.call(i, a)];
    d ? b = d : (d = Pa._) ? b = d : c(v.call(i, "IHash.-hash", a));
    a = b.call(i, a)
  }
  return a
}
function Qa(a) {
  if(a ? a.z : a) {
    a = a.z(a)
  }else {
    var b;
    var d = Qa[s.call(i, a)];
    d ? b = d : (d = Qa._) ? b = d : c(v.call(i, "ISeqable.-seq", a));
    a = b.call(i, a)
  }
  return a
}
var Ra = {}, Sa = {};
function Ta(a, b) {
  var d;
  if(a ? a.l : a) {
    d = a.l(a, b)
  }else {
    var e = Ta[s.call(i, a)];
    e ? d = e : (e = Ta._) ? d = e : c(v.call(i, "IPrintable.-pr-seq", a));
    d = d.call(i, a, b)
  }
  return d
}
function Ua(a, b, d) {
  if(a ? a.sa : a) {
    a = a.sa(a, b, d)
  }else {
    var e;
    var f = Ua[s.call(i, a)];
    f ? e = f : (f = Ua._) ? e = f : c(v.call(i, "IWatchable.-notify-watches", a));
    a = e.call(i, a, b, d)
  }
  return a
}
function Va(a, b) {
  return a === b
}
function y(a, b) {
  return Oa.call(i, a, b)
}
Pa["null"] = n(0);
x["null"] = function() {
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
ya["null"] = function(a, b, d) {
  return Wa.call(i, b, d)
};
ra["null"] = h;
sa["null"] = function(a, b) {
  return z.call(i, b)
};
Na["null"] = function() {
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
Sa["null"] = h;
Ta["null"] = function() {
  return z.call(i, "nil")
};
Ba["null"] = h;
Ha["null"] = n(i);
qa["null"] = n(0);
ta["null"] = h;
ua["null"] = n(i);
va["null"] = function() {
  return z.call(i)
};
Oa["null"] = function(a, b) {
  return b === i
};
Ma["null"] = n(i);
Ka["null"] = h;
La["null"] = n(i);
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
za["null"] = h;
Aa["null"] = n(i);
Date.prototype.j = function(a, b) {
  return a.toString() === b.toString()
};
Pa.number = aa();
Oa.number = function(a, b) {
  return a === b
};
Pa["boolean"] = function(a) {
  return a === h ? 1 : 0
};
Pa["function"] = function(a) {
  return ca.call(i, a)
};
var Xa = function() {
  function a(a, b, d, e) {
    for(;;) {
      if(e < qa.call(i, a)) {
        d = b.call(i, d, w.call(i, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function b(a, b, d) {
    for(var e = 0;;) {
      if(e < qa.call(i, a)) {
        d = b.call(i, d, w.call(i, a, e)), e += 1
      }else {
        return d
      }
    }
  }
  function d(a, b) {
    if(u(y.call(i, 0, qa.call(i, a)))) {
      return b.call(i)
    }
    for(var d = w.call(i, a, 0), e = 1;;) {
      if(e < qa.call(i, a)) {
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
  e.O = a;
  return e
}();
function Ya(a, b) {
  this.D = a;
  this.J = b
}
p = Ya.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.ka = function(a, b) {
  return Xa.call(i, this.D, b, this.D[this.J], this.J + 1)
};
p.la = function(a, b, d) {
  return Xa.call(i, this.D, b, d, this.J)
};
p.B = h;
p.t = function(a, b) {
  return A.call(i, b, a)
};
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.X = h;
p.ia = function(a, b) {
  var d = b + this.J;
  return d < this.D.length ? this.D[d] : i
};
p.ja = function(a, b, d) {
  a = b + this.J;
  return a < this.D.length ? this.D[a] : d
};
p.F = function() {
  return this.D.length - this.J
};
p.$ = h;
p.V = function() {
  return this.D[this.J]
};
p.W = function() {
  return this.J + 1 < this.D.length ? new Ya(this.D, this.J + 1) : z.call(i)
};
p.z = aa();
function eb(a, b) {
  return u(y.call(i, 0, a.length)) ? i : new Ya(a, b)
}
function B(a, b) {
  return eb.call(i, a, b)
}
Na.array = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Xa.call(i, a, b);
      case 3:
        return Xa.call(i, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
x.array = function() {
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
qa.array = function(a) {
  return a.length
};
Qa.array = function(a) {
  return B.call(i, a, 0)
};
function D(a) {
  return u(a) ? Qa.call(i, a) : i
}
function E(a) {
  a = D.call(i, a);
  return u(a) ? ua.call(i, a) : i
}
function G(a) {
  return va.call(i, D.call(i, a))
}
function H(a) {
  return u(a) ? D.call(i, G.call(i, a)) : i
}
function fb(a) {
  return E.call(i, H.call(i, a))
}
function gb(a) {
  return H.call(i, H.call(i, a))
}
qa._ = function(a) {
  for(var a = D.call(i, a), b = 0;;) {
    if(u(a)) {
      a = H.call(i, a), b += 1
    }else {
      return b
    }
  }
};
Oa._ = function(a, b) {
  return a === b
};
function I(a) {
  return u(a) ? l : h
}
var hb = function() {
  function a(a, b) {
    return sa.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var o = i;
      t(k) && (o = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, o)
    }
    function d(a, e, f) {
      for(;;) {
        if(u(f)) {
          a = b.call(i, a, e), e = E.call(i, f), f = H.call(i, f)
        }else {
          return b.call(i, a, e)
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(H(a)), a = G(H(a));
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
function J(a) {
  return qa.call(i, a)
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
}(), L = function() {
  function a(a, b, d) {
    return x.call(i, a, b, d)
  }
  function b(a, b) {
    return x.call(i, a, b)
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
}(), ib = function() {
  function a(a, b, d) {
    return ya.call(i, a, b, d)
  }
  var b = i, d = function() {
    function a(b, e, k, o) {
      var q = i;
      t(o) && (q = B(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, b, e, k, q)
    }
    function d(a, e, f, o) {
      for(;;) {
        if(a = b.call(i, a, e, f), u(o)) {
          e = E.call(i, o), f = fb.call(i, o), o = gb.call(i, o)
        }else {
          return a
        }
      }
    }
    a.d = 3;
    a.b = function(a) {
      var b = E(a), e = E(H(a)), o = E(H(H(a))), a = G(H(H(a)));
      return d.call(this, b, e, o, a)
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
  b.O = d;
  return b
}(), jb = function() {
  function a(a, b) {
    return Aa.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var o = i;
      t(k) && (o = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, o)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(i, a, e), u(f)) {
          e = E.call(i, f), f = H.call(i, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(H(a)), a = G(H(a));
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
function kb(a, b) {
  return Ma.call(i, a, b)
}
function lb(a) {
  var b;
  u(a) ? (b = a.u, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$IMeta$")) : b) : b = a;
  b = u(b) ? h : oa.call(i, Ka, a);
  return u(b) ? La.call(i, a) : i
}
var mb = function() {
  function a(a, b) {
    return Ha.call(i, a, b)
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var o = i;
      t(k) && (o = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, o)
    }
    function d(a, e, f) {
      for(;;) {
        if(a = b.call(i, a, e), u(f)) {
          e = E.call(i, f), f = H.call(i, f)
        }else {
          return a
        }
      }
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(H(a)), a = G(H(a));
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
function nb(a) {
  return Pa.call(i, a)
}
function ob(a) {
  return I.call(i, D.call(i, a))
}
function pb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.B, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$ICollection$")) : b) : b = a;
    a = u(b) ? h : oa.call(i, ra, a)
  }
  return a
}
function qb(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.ua, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$ISet$")) : b) : b = a;
    a = u(b) ? h : oa.call(i, Ba, a)
  }
  return a
}
function tb(a) {
  var b;
  u(a) ? (b = a.X, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$ISequential$")) : b) : b = a;
  return u(b) ? h : oa.call(i, Ra, a)
}
function ub(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.Z, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$IMap$")) : b) : b = a;
    a = u(b) ? h : oa.call(i, za, a)
  }
  return a
}
function vb(a) {
  var b;
  u(a) ? (b = a.va, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$IVector$")) : b) : b = a;
  return u(b) ? h : oa.call(i, Ia, a)
}
function wb() {
  return{}
}
function xb(a) {
  var b = [];
  ja.call(i, a, function(a, e) {
    return b.push(e)
  });
  return b
}
function yb(a, b) {
  return delete a[b]
}
var zb = wb.call(i);
function Ab(a) {
  if(a === i) {
    a = l
  }else {
    var b;
    u(a) ? (b = a.$, b = u(b) ? I.call(i, a.hasOwnProperty("cljs$core$ISeq$")) : b) : b = a;
    a = u(b) ? h : oa.call(i, ta, a)
  }
  return a
}
function Bb(a) {
  return u(a) ? h : l
}
function Cb(a) {
  var b = ba.call(i, a);
  return u(b) ? I.call(i, function() {
    var b = y.call(i, a.charAt(0), "\ufdd0");
    return u(b) ? b : y.call(i, a.charAt(0), "\ufdd1")
  }()) : b
}
function Db(a) {
  var b = ba.call(i, a);
  return u(b) ? y.call(i, a.charAt(0), "\ufdd0") : b
}
function Eb(a) {
  var b = ba.call(i, a);
  return u(b) ? y.call(i, a.charAt(0), "\ufdd1") : b
}
function Fb(a, b) {
  return x.call(i, a, b, zb) === zb ? l : h
}
var N = function() {
  function a(a, b, d) {
    return Na.call(i, d, a, b)
  }
  function b(a, b) {
    return Na.call(i, b, a)
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
}(), Gb = function() {
  function a(a, b, d) {
    for(d = D.call(i, d);;) {
      if(u(d)) {
        b = a.call(i, b, E.call(i, d)), d = H.call(i, d)
      }else {
        return b
      }
    }
  }
  function b(a, b) {
    var d = D.call(i, b);
    return u(d) ? N.call(i, a, E.call(i, d), H.call(i, d)) : a.call(i)
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
Na._ = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Gb.call(i, b, a);
      case 3:
        return Gb.call(i, b, d, a)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var Hb = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d + f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(H(b)), b = G(H(b));
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
  a.N = n(0);
  a.h = aa();
  a.a = function(a, b) {
    return a + b
  };
  a.c = b;
  return a
}(), Ib = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d - f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(H(b)), b = G(H(b));
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
}(), Jb = function() {
  var a = i, b = function() {
    function b(d, f, g) {
      var j = i;
      t(g) && (j = B(Array.prototype.slice.call(arguments, 2), 0));
      return N.call(i, a, d * f, j)
    }
    b.d = 2;
    b.b = function(b) {
      var d = E(b), g = E(H(b)), b = G(H(b));
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
  a.N = n(1);
  a.h = aa();
  a.a = function(a, b) {
    return a * b
  };
  a.c = b;
  return a
}();
function Kb(a) {
  return 0 <= a ? Math.floor.call(i, a) : Math.ceil.call(i, a)
}
var Lb = function() {
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
  d.N = b;
  d.h = a;
  return d
}();
function Mb(a) {
  return Kb.call(i, Lb.call(i, a))
}
function Nb(a, b) {
  for(var d = b, e = D.call(i, a);;) {
    var f = e;
    if(u(u(f) ? 0 < d : f)) {
      d -= 1, e = H.call(i, e)
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
        var f = Nb.call(i, a, b);
        u(f) ? e = E.call(i, f) : c(Error("Index out of bounds"));
        return e;
      case 3:
        return e = Nb.call(i, a, b), u(e) ? E.call(i, e) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
var Ob = function() {
  function a(a) {
    return a === i ? "" : a.toString()
  }
  var b = i, d = function() {
    function a(b, e) {
      var k = i;
      t(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(i, E.call(i, d))), f = H.call(i, d), a = e, d = f
          }else {
            return b.call(i, a)
          }
        }
      }.call(i, new ma(b.call(i, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = E(a), a = G(a);
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
  b.N = n("");
  b.h = a;
  b.a = d;
  return b
}(), O = function() {
  function a(a) {
    return u(Eb.call(i, a)) ? a.substring(2, a.length) : u(Db.call(i, a)) ? Ob.call(i, ":", a.substring(2, a.length)) : a === i ? "" : a.toString()
  }
  var b = i, d = function() {
    function a(b, e) {
      var k = i;
      t(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return d.call(this, b, k)
    }
    function d(a, e) {
      return function(a, d) {
        for(;;) {
          if(u(d)) {
            var e = a.append(b.call(i, E.call(i, d))), f = H.call(i, d), a = e, d = f
          }else {
            return Ob.call(i, a)
          }
        }
      }.call(i, new ma(b.call(i, a)), e)
    }
    a.d = 1;
    a.b = function(a) {
      var b = E(a), a = G(a);
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
  b.N = n("");
  b.h = a;
  b.a = d;
  return b
}(), Pb = function() {
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
function db(a, b) {
  return Bb.call(i, u(tb.call(i, b)) ? function() {
    for(var d = D.call(i, a), e = D.call(i, b);;) {
      if(d === i) {
        return e === i
      }
      if(e !== i && u(y.call(i, E.call(i, d), E.call(i, e)))) {
        d = H.call(i, d), e = H.call(i, e)
      }else {
        return l
      }
    }
  }() : i)
}
function Qb(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
}
function cb(a) {
  return N.call(i, function(a, d) {
    return Qb.call(i, a, nb.call(i, d))
  }, nb.call(i, E.call(i, a)), H.call(i, a))
}
function Ub(a, b, d, e) {
  this.g = a;
  this.aa = b;
  this.Y = d;
  this.G = e
}
p = Ub.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.X = h;
p.B = h;
p.t = function(a, b) {
  return new Ub(this.g, b, a, this.G + 1)
};
p.z = aa();
p.F = m("G");
p.$ = h;
p.V = m("aa");
p.W = m("Y");
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.C = function(a, b) {
  return new Ub(b, this.aa, this.Y, this.G)
};
p.u = h;
p.v = m("g");
function Vb(a) {
  this.g = a
}
p = Vb.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.X = h;
p.B = h;
p.t = function(a, b) {
  return new Ub(this.g, b, i, 1)
};
p.z = n(i);
p.F = n(0);
p.$ = h;
p.V = n(i);
p.W = n(i);
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.C = function(a, b) {
  return new Vb(b)
};
p.u = h;
p.v = m("g");
var Wb = new Vb(i);
function Xb(a) {
  return N.call(i, hb, Wb, a)
}
var z = function() {
  function a(a) {
    var d = i;
    t(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return N.call(i, hb, Wb, Xb.call(i, d))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return N.call(i, hb, Wb, Xb.call(i, a))
  };
  return a
}();
function Yb(a, b, d) {
  this.g = a;
  this.aa = b;
  this.Y = d
}
p = Yb.prototype;
p.z = aa();
p.k = function(a) {
  return cb.call(i, a)
};
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.X = h;
p.B = h;
p.t = function(a, b) {
  return new Yb(i, b, a)
};
p.$ = h;
p.V = m("aa");
p.W = function() {
  return this.Y === i ? Wb : this.Y
};
p.u = h;
p.v = m("g");
p.C = function(a, b) {
  return new Yb(b, this.aa, this.Y)
};
function A(a, b) {
  return new Yb(i, a, b)
}
Na.string = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return Xa.call(i, a, b);
      case 3:
        return Xa.call(i, a, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
x.string = function() {
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
        return b < qa.call(i, a) ? a.charAt(b) : i;
      case 3:
        return b < qa.call(i, a) ? a.charAt(b) : d
    }
    c("Invalid arity: " + arguments.length)
  }
}();
qa.string = function(a) {
  return a.length
};
Qa.string = function(a) {
  return eb.call(i, a, 0)
};
Pa.string = function(a) {
  return ia.call(i, a)
};
String.prototype.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return L.call(i, b, this.toString());
      case 3:
        return L.call(i, b, this.toString(), d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
String.prototype.apply = function(a, b) {
  return 2 > J.call(i, b) ? L.call(i, b[0], a) : L.call(i, b[0], a, b[1])
};
function Zb(a) {
  var b = a.x;
  if(u(a.na)) {
    return b
  }
  a.x = b.call(i);
  a.na = h;
  return a.x
}
function Q(a, b, d) {
  this.g = a;
  this.na = b;
  this.x = d
}
p = Q.prototype;
p.z = function(a) {
  return D.call(i, Zb.call(i, a))
};
p.k = function(a) {
  return cb.call(i, a)
};
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.X = h;
p.B = h;
p.t = function(a, b) {
  return A.call(i, b, a)
};
p.$ = h;
p.V = function(a) {
  return E.call(i, Zb.call(i, a))
};
p.W = function(a) {
  return G.call(i, Zb.call(i, a))
};
p.u = h;
p.v = m("g");
p.C = function(a, b) {
  return new Q(b, this.na, this.x)
};
function $b(a) {
  for(var b = [];;) {
    if(u(D.call(i, a))) {
      b.push(E.call(i, a)), a = H.call(i, a)
    }else {
      return b
    }
  }
}
function ac(a, b) {
  for(var d = a, e = b, f = 0;;) {
    var g;
    g = (g = 0 < e) ? D.call(i, d) : g;
    if(u(g)) {
      d = H.call(i, d), e -= 1, f += 1
    }else {
      return f
    }
  }
}
var cc = function bc(b) {
  return b === i ? i : H.call(i, b) === i ? D.call(i, E.call(i, b)) : A.call(i, E.call(i, b), bc.call(i, H.call(i, b)))
}, dc = function() {
  function a(a, b) {
    return new Q(i, l, function() {
      var d = D.call(i, a);
      return u(d) ? A.call(i, E.call(i, d), e.call(i, G.call(i, d), b)) : b
    })
  }
  function b(a) {
    return new Q(i, l, function() {
      return a
    })
  }
  function d() {
    return new Q(i, l, n(i))
  }
  var e = i, f = function() {
    function a(d, e, f) {
      var g = i;
      t(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, d, e, g)
    }
    function b(a, d, f) {
      return function C(a, b) {
        return new Q(i, l, function() {
          var d = D.call(i, a);
          return u(d) ? A.call(i, E.call(i, d), C.call(i, G.call(i, d), b)) : u(b) ? C.call(i, E.call(i, b), H.call(i, b)) : i
        })
      }.call(i, e.call(i, a, d), f)
    }
    a.d = 2;
    a.b = function(a) {
      var d = E(a), e = E(H(a)), a = G(H(a));
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
  e.N = d;
  e.h = b;
  e.a = a;
  e.c = f;
  return e
}(), ec = function() {
  function a(a, b, d, e) {
    return A.call(i, a, A.call(i, b, A.call(i, d, e)))
  }
  function b(a, b, d) {
    return A.call(i, a, A.call(i, b, d))
  }
  function d(a, b) {
    return A.call(i, a, b)
  }
  function e(a) {
    return D.call(i, a)
  }
  var f = i, g = function() {
    function a(d, e, f, g, j) {
      var F = i;
      t(j) && (F = B(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, F)
    }
    function b(a, d, e, f, g) {
      return A.call(i, a, A.call(i, d, A.call(i, e, A.call(i, f, cc.call(i, g)))))
    }
    a.d = 4;
    a.b = function(a) {
      var d = E(a), e = E(H(a)), f = E(H(H(a))), g = E(H(H(H(a)))), a = G(H(H(H(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), f = function(f, k, o, q, r) {
    switch(arguments.length) {
      case 1:
        return e.call(this, f);
      case 2:
        return d.call(this, f, k);
      case 3:
        return b.call(this, f, k, o);
      case 4:
        return a.call(this, f, k, o, q);
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
  f.O = a;
  f.ma = g;
  return f
}(), R = function() {
  function a(a, b, d, e, f) {
    b = ec.call(i, b, d, e, f);
    d = a.d;
    return u(a.b) ? ac.call(i, b, d) <= d ? a.apply(a, $b.call(i, b)) : a.b(b) : a.apply(a, $b.call(i, b))
  }
  function b(a, b, d, e) {
    b = ec.call(i, b, d, e);
    d = a.d;
    return u(a.b) ? ac.call(i, b, d) <= d ? a.apply(a, $b.call(i, b)) : a.b(b) : a.apply(a, $b.call(i, b))
  }
  function d(a, b, d) {
    b = ec.call(i, b, d);
    d = a.d;
    return u(a.b) ? ac.call(i, b, d) <= d ? a.apply(a, $b.call(i, b)) : a.b(b) : a.apply(a, $b.call(i, b))
  }
  function e(a, b) {
    var d = a.d;
    return u(a.b) ? ac.call(i, b, d + 1) <= d ? a.apply(a, $b.call(i, b)) : a.b(b) : a.apply(a, $b.call(i, b))
  }
  var f = i, g = function() {
    function a(d, e, f, g, j, F) {
      var P = i;
      t(F) && (P = B(Array.prototype.slice.call(arguments, 5), 0));
      return b.call(this, d, e, f, g, j, P)
    }
    function b(a, d, e, f, g, j) {
      d = A.call(i, d, A.call(i, e, A.call(i, f, A.call(i, g, cc.call(i, j)))));
      e = a.d;
      return u(a.b) ? ac.call(i, d, e) <= e ? a.apply(a, $b.call(i, d)) : a.b(d) : a.apply(a, $b.call(i, d))
    }
    a.d = 5;
    a.b = function(a) {
      var d = E(a), e = E(H(a)), f = E(H(H(a))), g = E(H(H(H(a)))), j = E(H(H(H(H(a))))), a = G(H(H(H(H(a)))));
      return b.call(this, d, e, f, g, j, a)
    };
    return a
  }(), f = function(f, k, o, q, r, C) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, o);
      case 4:
        return b.call(this, f, k, o, q);
      case 5:
        return a.call(this, f, k, o, q, r);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.O = b;
  f.ma = a;
  f.wa = g;
  return f
}(), gc = function() {
  function a(a, b) {
    return I.call(i, y.call(i, a, b))
  }
  function b() {
    return l
  }
  var d = i, e = function() {
    function a(b, d, e) {
      var f = i;
      t(e) && (f = B(Array.prototype.slice.call(arguments, 2), 0));
      return I.call(i, R.call(i, y, b, d, f))
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), d = E(H(a)), a = G(H(a));
      return I.call(i, R.call(i, y, b, d, a))
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
function hc(a) {
  return u(D.call(i, a)) ? a : i
}
function ic(a, b) {
  for(;;) {
    if(D.call(i, b) === i) {
      return h
    }
    if(u(a.call(i, E.call(i, b)))) {
      var d = a, e = H.call(i, b), a = d, b = e
    }else {
      return l
    }
  }
}
function jc(a) {
  return a
}
var kc = function() {
  function a(a, b, d, f) {
    return new Q(i, l, function() {
      var q = D.call(i, b), r = D.call(i, d), C = D.call(i, f);
      return u(u(q) ? u(r) ? C : r : q) ? A.call(i, a.call(i, E.call(i, q), E.call(i, r), E.call(i, C)), e.call(i, a, G.call(i, q), G.call(i, r), G.call(i, C))) : i
    })
  }
  function b(a, b, d) {
    return new Q(i, l, function() {
      var f = D.call(i, b), q = D.call(i, d);
      return u(u(f) ? q : f) ? A.call(i, a.call(i, E.call(i, f), E.call(i, q)), e.call(i, a, G.call(i, f), G.call(i, q))) : i
    })
  }
  function d(a, b) {
    return new Q(i, l, function() {
      var d = D.call(i, b);
      return u(d) ? A.call(i, a.call(i, E.call(i, d)), e.call(i, a, G.call(i, d))) : i
    })
  }
  var e = i, f = function() {
    function a(d, e, f, g, C) {
      var S = i;
      t(C) && (S = B(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, d, e, f, g, S)
    }
    function b(a, d, f, g, j) {
      return e.call(i, function(b) {
        return R.call(i, a, b)
      }, function F(a) {
        return new Q(i, l, function() {
          var b = e.call(i, D, a);
          return u(ic.call(i, jc, b)) ? A.call(i, e.call(i, E, b), F.call(i, e.call(i, G, b))) : i
        })
      }.call(i, hb.call(i, j, g, f, d)))
    }
    a.d = 4;
    a.b = function(a) {
      var d = E(a), e = E(H(a)), f = E(H(H(a))), g = E(H(H(H(a)))), a = G(H(H(H(a))));
      return b.call(this, d, e, f, g, a)
    };
    return a
  }(), e = function(e, j, k, o, q) {
    switch(arguments.length) {
      case 2:
        return d.call(this, e, j);
      case 3:
        return b.call(this, e, j, k);
      case 4:
        return a.call(this, e, j, k, o);
      default:
        return f.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  e.d = 4;
  e.b = f.b;
  e.a = d;
  e.c = b;
  e.O = a;
  e.ma = f;
  return e
}(), mc = function lc(b, d) {
  return new Q(i, l, function() {
    if(0 < b) {
      var e = D.call(i, d);
      return u(e) ? A.call(i, E.call(i, e), lc.call(i, b - 1, G.call(i, e))) : i
    }
    return i
  })
};
function nc(a, b) {
  function d(a, b) {
    for(;;) {
      var d = D.call(i, b), j = 0 < a;
      if(u(j ? d : j)) {
        j = a - 1, d = G.call(i, d), a = j, b = d
      }else {
        return d
      }
    }
  }
  return new Q(i, l, function() {
    return d.call(i, a, b)
  })
}
var oc = function() {
  function a(a, b) {
    return mc.call(i, a, d.call(i, b))
  }
  function b(a) {
    return new Q(i, l, function() {
      return A.call(i, a, d.call(i, a))
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
}(), pc = function() {
  function a(a, d) {
    return new Q(i, l, function() {
      var g = D.call(i, a), j = D.call(i, d);
      return u(u(g) ? j : g) ? A.call(i, E.call(i, g), A.call(i, E.call(i, j), b.call(i, G.call(i, g), G.call(i, j)))) : i
    })
  }
  var b = i, d = function() {
    function a(b, e, k) {
      var o = i;
      t(k) && (o = B(Array.prototype.slice.call(arguments, 2), 0));
      return d.call(this, b, e, o)
    }
    function d(a, e, f) {
      return new Q(i, l, function() {
        var d = kc.call(i, D, hb.call(i, f, e, a));
        return u(ic.call(i, jc, d)) ? dc.call(i, kc.call(i, E, d), R.call(i, b, kc.call(i, G, d))) : i
      })
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), e = E(H(a)), a = G(H(a));
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
function qc(a, b) {
  return nc.call(i, 1, pc.call(i, oc.call(i, a), b))
}
function rc(a) {
  return function d(a, f) {
    return new Q(i, l, function() {
      var g = D.call(i, a);
      return u(g) ? A.call(i, E.call(i, g), d.call(i, G.call(i, g), f)) : u(D.call(i, f)) ? d.call(i, E.call(i, f), G.call(i, f)) : i
    })
  }.call(i, i, a)
}
var sc = function() {
  function a(a, b) {
    return rc.call(i, kc.call(i, a, b))
  }
  var b = i, d = function() {
    function a(b, d, e) {
      var k = i;
      t(e) && (k = B(Array.prototype.slice.call(arguments, 2), 0));
      return rc.call(i, R.call(i, kc, b, d, k))
    }
    a.d = 2;
    a.b = function(a) {
      var b = E(a), d = E(H(a)), a = G(H(a));
      return rc.call(i, R.call(i, kc, b, d, a))
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
  return N.call(i, sa, a, b)
}
var wc = function() {
  function a(a, b, d, k) {
    return new Q(i, l, function() {
      var o = D.call(i, k);
      if(u(o)) {
        var q = mc.call(i, a, o);
        return u(y.call(i, a, J.call(i, q))) ? A.call(i, q, e.call(i, a, b, d, nc.call(i, b, o))) : z.call(i, mc.call(i, a, dc.call(i, q, d)))
      }
      return i
    })
  }
  function b(a, b, d) {
    return new Q(i, l, function() {
      var k = D.call(i, d);
      if(u(k)) {
        var o = mc.call(i, a, k);
        return u(y.call(i, a, J.call(i, o))) ? A.call(i, o, e.call(i, a, b, nc.call(i, b, k))) : i
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
  e.O = a;
  return e
}(), xc = function() {
  function a(a, b, d) {
    for(var j = zb, b = D.call(i, b);;) {
      if(u(b)) {
        a = L.call(i, a, E.call(i, b), j);
        if(j === a) {
          return d
        }
        b = H.call(i, b)
      }else {
        return a
      }
    }
  }
  function b(a, b) {
    return N.call(i, L, a, b)
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
}(), zc = function yc(b, d, e) {
  var f = K.call(i, d, 0, i), d = Nb.call(i, d, 1);
  return u(d) ? ib.call(i, b, f, yc.call(i, L.call(i, b, f), d, e)) : ib.call(i, b, f, e)
}, Ac = function() {
  function a(a, e, f, g) {
    var j = i;
    t(g) && (j = B(Array.prototype.slice.call(arguments, 3), 0));
    return b.call(this, a, e, f, j)
  }
  function b(b, e, f, g) {
    var j = K.call(i, e, 0, i), e = Nb.call(i, e, 1);
    return u(e) ? ib.call(i, b, j, R.call(i, a, L.call(i, b, j), e, f, g)) : ib.call(i, b, j, R.call(i, f, L.call(i, b, j), g))
  }
  a.d = 3;
  a.b = function(a) {
    var e = E(a), f = E(H(a)), g = E(H(H(a))), a = G(H(H(a)));
    return b.call(this, e, f, g, a)
  };
  return a
}();
function Bc(a) {
  a = a.i;
  return 32 > a ? 0 : a - 1 >> 5 << 5
}
function Cc(a, b) {
  for(var d = a, e = b;;) {
    if(u(y.call(i, 0, d))) {
      return e
    }
    var f = pa.call(i, Dc);
    f[0] = e;
    e = f;
    d -= 5
  }
}
var Fc = function Ec(b, d, e, f) {
  var g = pa.call(i, e), j = b.i - 1 >> d & 31;
  u(y.call(i, 5, d)) ? g[j] = f : (e = e[j], b = u(e) ? Ec.call(i, b, d - 5, e, f) : Cc.call(i, d - 5, f), g[j] = b);
  return g
};
function Gc(a, b) {
  var d = 0 <= b;
  if(d ? b < a.i : d) {
    if(b >= Bc.call(i, a)) {
      return a.T
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
var Ic = function Hc(b, d, e, f, g) {
  var j = pa.call(i, e);
  if(0 === d) {
    j[f & 31] = g
  }else {
    var k = f >> d & 31;
    j[k] = Hc.call(i, b, d - 5, e[k], f, g)
  }
  return j
};
function Jc(a, b, d, e, f) {
  this.g = a;
  this.i = b;
  this.shift = d;
  this.root = e;
  this.T = f
}
p = Jc.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.L = function(a, b) {
  return w.call(i, a, b, i)
};
p.M = function(a, b, d) {
  return w.call(i, a, b, d)
};
p.Q = function(a, b, d) {
  var e = 0 <= b;
  if(e ? b < this.i : e) {
    return Bc.call(i, a) <= b ? (a = pa.call(i, this.T), a[b & 31] = d, new Jc(this.g, this.i, this.shift, this.root, a)) : new Jc(this.g, this.i, this.shift, Ic.call(i, a, this.shift, this.root, b, d), this.T)
  }
  if(u(y.call(i, b, this.i))) {
    return sa.call(i, a, d)
  }
  c(Error(O.call(i, "Index ", b, " out of bounds  [0,", this.i, "]")))
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return x.call(i, this, b);
      case 3:
        return x.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.X = h;
p.B = h;
p.t = function(a, b) {
  if(32 > this.i - Bc.call(i, a)) {
    var d = pa.call(i, this.T);
    d.push(b);
    return new Jc(this.g, this.i + 1, this.shift, this.root, d)
  }
  var e = this.i >> 5 > 1 << this.shift, d = e ? this.shift + 5 : this.shift;
  e ? (e = pa.call(i, Dc), e[0] = this.root, e[1] = Cc.call(i, this.shift, this.T)) : e = Fc.call(i, a, this.shift, this.root, this.T);
  return new Jc(this.g, this.i + 1, d, e, [b])
};
p.ka = function(a, b) {
  return Xa.call(i, a, b)
};
p.la = function(a, b, d) {
  return Xa.call(i, a, b, d)
};
p.z = function(a) {
  var b = this;
  return 0 < b.i ? function e(f) {
    return new Q(i, l, function() {
      return f < b.i ? A.call(i, w.call(i, a, f), e.call(i, f + 1)) : i
    })
  }.call(i, 0) : i
};
p.F = m("i");
p.va = h;
p.j = function(a, b) {
  return db.call(i, a, b)
};
p.C = function(a, b) {
  return new Jc(b, this.i, this.shift, this.root, this.T)
};
p.u = h;
p.v = m("g");
p.ia = function(a, b) {
  return Gc.call(i, a, b)[b & 31]
};
p.ja = function(a, b, d) {
  var e = 0 <= b;
  return(e ? b < this.i : e) ? w.call(i, a, b) : d
};
var Dc = Array(32), Kc = new Jc(i, 0, 5, Dc, []);
function T(a) {
  return vc.call(i, Kc, a)
}
function Lc(a) {
  return N.call(i, hb, Kc, a)
}
var V = function() {
  function a(a) {
    var d = i;
    t(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return Lc.call(i, d)
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return Lc.call(i, a)
  };
  return a
}();
T([]);
function Mc() {
}
Mc.prototype.j = n(l);
var Nc = new Mc;
function Oc(a, b) {
  return Bb.call(i, u(ub.call(i, b)) ? u(y.call(i, J.call(i, a), J.call(i, b))) ? ic.call(i, jc, kc.call(i, function(a) {
    return y.call(i, L.call(i, b, E.call(i, a), Nc), fb.call(i, a))
  }, a)) : i : i)
}
function Pc(a, b, d) {
  for(var e = d.length, f = 0;;) {
    if(f < e) {
      if(u(y.call(i, b, d[f]))) {
        return f
      }
      f += a
    }else {
      return i
    }
  }
}
var Qc = function() {
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
  d.O = a;
  return d
}();
function Rc(a, b) {
  var d = nb.call(i, a), e = nb.call(i, b);
  return d < e ? -1 : d > e ? 1 : 0
}
function Sc(a, b, d) {
  this.g = a;
  this.keys = b;
  this.P = d
}
p = Sc.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.L = function(a, b) {
  return x.call(i, a, b, i)
};
p.M = function(a, b, d) {
  return Qc.call(i, b, this.P, this.P[b], d)
};
p.Q = function(a, b, d) {
  if(u(ba.call(i, b))) {
    var a = ka.call(i, this.P), e = a.hasOwnProperty(b);
    a[b] = d;
    if(u(e)) {
      return new Sc(this.g, this.keys, a)
    }
    d = pa.call(i, this.keys);
    d.push(b);
    return new Sc(this.g, d, a)
  }
  return kb.call(i, vc.call(i, Wa.call(i, b, d), D.call(i, a)), this.g)
};
p.ha = function(a, b) {
  return Qc.call(i, b, this.P)
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return x.call(i, this, b);
      case 3:
        return x.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return u(vb.call(i, b)) ? ya.call(i, a, w.call(i, b, 0), w.call(i, b, 1)) : N.call(i, sa, a, b)
};
p.z = function() {
  var a = this;
  return 0 < a.keys.length ? kc.call(i, function(b) {
    return V.call(i, b, a.P[b])
  }, a.keys.sort(Rc)) : i
};
p.F = function() {
  return this.keys.length
};
p.j = function(a, b) {
  return Oc.call(i, a, b)
};
p.C = function(a, b) {
  return new Sc(b, this.keys, this.P)
};
p.u = h;
p.v = m("g");
p.Z = h;
p.U = function(a, b) {
  var d = ba.call(i, b);
  if(u(u(d) ? this.P.hasOwnProperty(b) : d)) {
    var d = pa.call(i, this.keys), e = ka.call(i, this.P);
    d.splice(Pc.call(i, 1, b, d), 1);
    yb.call(i, e, b);
    return new Sc(this.g, d, e)
  }
  return a
};
function W(a, b) {
  return new Sc(i, a, b)
}
function Tc(a, b, d) {
  this.g = a;
  this.G = b;
  this.H = d
}
p = Tc.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.L = function(a, b) {
  return x.call(i, a, b, i)
};
p.M = function(a, b, d) {
  a = this.H[nb.call(i, b)];
  b = u(a) ? Pc.call(i, 2, b, a) : i;
  return u(b) ? a[b + 1] : d
};
p.Q = function(a, b, d) {
  var a = nb.call(i, b), e = this.H[a];
  if(u(e)) {
    var e = pa.call(i, e), f = ka.call(i, this.H);
    f[a] = e;
    a = Pc.call(i, 2, b, e);
    if(u(a)) {
      return e[a + 1] = d, new Tc(this.g, this.G, f)
    }
    e.push(b, d);
    return new Tc(this.g, this.G + 1, f)
  }
  e = ka.call(i, this.H);
  e[a] = [b, d];
  return new Tc(this.g, this.G + 1, e)
};
p.ha = function(a, b) {
  var d = this.H[nb.call(i, b)], d = u(d) ? Pc.call(i, 2, b, d) : i;
  return u(d) ? h : l
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return x.call(i, this, b);
      case 3:
        return x.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return u(vb.call(i, b)) ? ya.call(i, a, w.call(i, b, 0), w.call(i, b, 1)) : N.call(i, sa, a, b)
};
p.z = function() {
  var a = this;
  if(0 < a.G) {
    var b = xb.call(i, a.H).sort();
    return sc.call(i, function(b) {
      return kc.call(i, Lc, wc.call(i, 2, a.H[b]))
    }, b)
  }
  return i
};
p.F = m("G");
p.j = function(a, b) {
  return Oc.call(i, a, b)
};
p.C = function(a, b) {
  return new Tc(b, this.G, this.H)
};
p.u = h;
p.v = m("g");
p.Z = h;
p.U = function(a, b) {
  var d = nb.call(i, b), e = this.H[d], f = u(e) ? Pc.call(i, 2, b, e) : i;
  if(u(I.call(i, f))) {
    return a
  }
  var g = ka.call(i, this.H);
  3 > e.length ? yb.call(i, g, d) : (e = pa.call(i, e), e.splice(f, 2), g[d] = e);
  return new Tc(this.g, this.G - 1, g)
};
var Uc = new Tc(i, 0, wb.call(i)), Wa = function() {
  function a(a) {
    var e = i;
    t(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    for(var a = D.call(i, a), b = Uc;;) {
      if(u(a)) {
        var f = gb.call(i, a), b = ib.call(i, b, E.call(i, a), fb.call(i, a)), a = f
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
function Vc(a) {
  return D.call(i, kc.call(i, E, a))
}
function Wc(a, b) {
  this.g = a;
  this.ba = b
}
p = Wc.prototype;
p.k = function(a) {
  return cb.call(i, a)
};
p.L = function(a, b) {
  return x.call(i, a, b, i)
};
p.M = function(a, b, d) {
  return u(xa.call(i, this.ba, b)) ? b : d
};
p.call = function() {
  return function(a, b, d) {
    switch(arguments.length) {
      case 2:
        return x.call(i, this, b);
      case 3:
        return x.call(i, this, b, d)
    }
    c("Invalid arity: " + arguments.length)
  }
}();
p.B = h;
p.t = function(a, b) {
  return new Wc(this.g, ib.call(i, this.ba, b, i))
};
p.z = function() {
  return Vc.call(i, this.ba)
};
p.ua = h;
p.ra = function(a, b) {
  return new Wc(this.g, jb.call(i, this.ba, b))
};
p.F = function(a) {
  return J.call(i, D.call(i, a))
};
p.j = function(a, b) {
  var d = qb.call(i, b);
  return u(d) ? (d = y.call(i, J.call(i, a), J.call(i, b)), u(d) ? ic.call(i, function(b) {
    return Fb.call(i, a, b)
  }, b) : d) : d
};
p.C = function(a, b) {
  return new Wc(b, this.ba)
};
p.u = h;
p.v = m("g");
var Xc = new Wc(i, Wa.call(i));
function Yc(a) {
  for(var a = D.call(i, a), b = Xc;;) {
    if(u(I.call(i, ob.call(i, a)))) {
      var d = G.call(i, a), b = hb.call(i, b, E.call(i, a)), a = d
    }else {
      return b
    }
  }
}
function Zc(a) {
  if(u(Cb.call(i, a))) {
    return a
  }
  var b;
  b = Db.call(i, a);
  b = u(b) ? b : Eb.call(i, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), 0 > b ? Pb.call(i, a, 2) : Pb.call(i, a, b + 1)
  }
  c(Error(O.call(i, "Doesn't support name: ", a)))
}
function $c(a) {
  var b;
  b = Db.call(i, a);
  b = u(b) ? b : Eb.call(i, a);
  if(u(b)) {
    return b = a.lastIndexOf("/"), -1 < b ? Pb.call(i, a, 2, b) : i
  }
  c(Error(O.call(i, "Doesn't support namespace: ", a)))
}
function ad(a, b) {
  var d = a.exec(b);
  return u(y.call(i, E.call(i, d), b)) ? u(y.call(i, J.call(i, d), 1)) ? E.call(i, d) : Lc.call(i, d) : i
}
function X(a, b, d, e, f, g) {
  return dc.call(i, T([b]), rc.call(i, qc.call(i, T([d]), kc.call(i, function(b) {
    return a.call(i, b, f)
  }, g))), T([e]))
}
function bd(a) {
  na.call(i, a);
  return i
}
function cd() {
  return i
}
var ed = function dd(b, d) {
  return b === i ? z.call(i, "nil") : void 0 === b ? z.call(i, "#<undefined>") : dc.call(i, u(function() {
    var e = L.call(i, d, "\ufdd0'meta");
    return u(e) ? (u(b) ? (e = b.u, e = u(e) ? I.call(i, b.hasOwnProperty("cljs$core$IMeta$")) : e) : e = b, e = u(e) ? h : oa.call(i, Ka, b), u(e) ? lb.call(i, b) : e) : e
  }()) ? dc.call(i, T(["^"]), dd.call(i, lb.call(i, b), d), T([" "])) : i, u(function() {
    var d;
    u(b) ? (d = b.w, d = u(d) ? I.call(i, b.hasOwnProperty("cljs$core$IPrintable$")) : d) : d = b;
    return u(d) ? h : oa.call(i, Sa, b)
  }()) ? Ta.call(i, b, d) : z.call(i, "#<", O.call(i, b), ">"))
};
function fd(a, b) {
  var d = E.call(i, a), e = new ma, f = D.call(i, a);
  if(u(f)) {
    for(var g = E.call(i, f);;) {
      g !== d && e.append(" ");
      var j = D.call(i, ed.call(i, g, b));
      if(u(j)) {
        for(g = E.call(i, j);;) {
          if(e.append(g), g = H.call(i, j), u(g)) {
            j = g, g = E.call(i, j)
          }else {
            break
          }
        }
      }
      f = H.call(i, f);
      if(u(f)) {
        g = f, f = E.call(i, g), j = g, g = f, f = j
      }else {
        break
      }
    }
  }
  return e
}
function gd(a, b) {
  return O.call(i, fd.call(i, a, b))
}
function hd(a, b) {
  var d = E.call(i, a), e = D.call(i, a);
  if(u(e)) {
    for(var f = E.call(i, e);;) {
      f !== d && bd.call(i, " ");
      var g = D.call(i, ed.call(i, f, b));
      if(u(g)) {
        for(f = E.call(i, g);;) {
          if(bd.call(i, f), f = H.call(i, g), u(f)) {
            g = f, f = E.call(i, g)
          }else {
            break
          }
        }
      }
      e = H.call(i, e);
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
function id(a) {
  bd.call(i, "\n");
  return u(L.call(i, a, "\ufdd0'flush-on-newline")) ? cd.call(i) : i
}
function jd() {
  return W(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":h, "\ufdd0'readably":h, "\ufdd0'meta":l, "\ufdd0'dup":l})
}
var kd = function() {
  function a(a) {
    var d = i;
    t(a) && (d = B(Array.prototype.slice.call(arguments, 0), 0));
    return gd.call(i, d, jd.call(i))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return gd.call(i, a, jd.call(i))
  };
  return a
}(), ld = function() {
  function a(a) {
    var e = i;
    t(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    hd.call(i, a, jd.call(i));
    return id.call(i, jd.call(i))
  }
  a.d = 0;
  a.b = function(a) {
    a = D(a);
    return b.call(this, a)
  };
  return a
}();
Tc.prototype.w = h;
Tc.prototype.l = function(a, b) {
  return X.call(i, function(a) {
    return X.call(i, ed, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
Sa.number = h;
Ta.number = function(a) {
  return z.call(i, O.call(i, a))
};
Ya.prototype.w = h;
Ya.prototype.l = function(a, b) {
  return X.call(i, ed, "(", " ", ")", b, a)
};
Q.prototype.w = h;
Q.prototype.l = function(a, b) {
  return X.call(i, ed, "(", " ", ")", b, a)
};
Sa["boolean"] = h;
Ta["boolean"] = function(a) {
  return z.call(i, O.call(i, a))
};
Wc.prototype.w = h;
Wc.prototype.l = function(a, b) {
  return X.call(i, ed, "#{", " ", "}", b, a)
};
Sa.string = h;
Ta.string = function(a, b) {
  return u(Db.call(i, a)) ? z.call(i, O.call(i, ":", function() {
    var b = $c.call(i, a);
    return u(b) ? O.call(i, b, "/") : i
  }(), Zc.call(i, a))) : u(Eb.call(i, a)) ? z.call(i, O.call(i, function() {
    var b = $c.call(i, a);
    return u(b) ? O.call(i, b, "/") : i
  }(), Zc.call(i, a))) : z.call(i, u("\ufdd0'readably".call(i, b)) ? ha.call(i, a) : a)
};
Jc.prototype.w = h;
Jc.prototype.l = function(a, b) {
  return X.call(i, ed, "[", " ", "]", b, a)
};
Ub.prototype.w = h;
Ub.prototype.l = function(a, b) {
  return X.call(i, ed, "(", " ", ")", b, a)
};
Sa.array = h;
Ta.array = function(a, b) {
  return X.call(i, ed, "#<Array [", ", ", "]>", b, a)
};
Sa["function"] = h;
Ta["function"] = function(a) {
  return z.call(i, "#<", O.call(i, a), ">")
};
Vb.prototype.w = h;
Vb.prototype.l = function() {
  return z.call(i, "()")
};
Yb.prototype.w = h;
Yb.prototype.l = function(a, b) {
  return X.call(i, ed, "(", " ", ")", b, a)
};
Sc.prototype.w = h;
Sc.prototype.l = function(a, b) {
  return X.call(i, function(a) {
    return X.call(i, ed, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
function md(a, b, d, e) {
  this.state = a;
  this.g = b;
  this.Aa = d;
  this.Ba = e
}
p = md.prototype;
p.k = function(a) {
  return ca.call(i, a)
};
p.sa = function(a, b, d) {
  var e = D.call(i, this.Ba);
  if(u(e)) {
    var f = E.call(i, e);
    K.call(i, f, 0, i);
    for(K.call(i, f, 1, i);;) {
      var g = f, f = K.call(i, g, 0, i), g = K.call(i, g, 1, i);
      g.call(i, f, a, b, d);
      e = H.call(i, e);
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
  return dc.call(i, T(["#<Atom: "]), Ta.call(i, this.state, b), ">")
};
p.u = h;
p.v = m("g");
p.ta = m("state");
p.j = function(a, b) {
  return a === b
};
var nd = function() {
  function a(a) {
    return new md(a, i, i, i)
  }
  var b = i, d = function() {
    function a(d, e) {
      var k = i;
      t(e) && (k = B(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, d, k)
    }
    function b(a, d) {
      var e = u(Ab.call(i, d)) ? R.call(i, Wa, d) : d, f = L.call(i, e, "\ufdd0'validator"), e = L.call(i, e, "\ufdd0'meta");
      return new md(a, e, f, i)
    }
    a.d = 1;
    a.b = function(a) {
      var d = E(a), a = G(a);
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
function od(a, b) {
  var d = a.Aa;
  u(d) && !u(d.call(i, b)) && c(Error(O.call(i, "Assert failed: ", "Validator rejected reference state", "\n", kd.call(i, kb(z("\ufdd1'validate", "\ufdd1'new-value"), Wa("\ufdd0'line", 3282))))));
  d = a.state;
  a.state = b;
  Ua.call(i, a, d, b);
  return b
}
var pd = function() {
  function a(a, b, d, e, f) {
    return od.call(i, a, b.call(i, a.state, d, e, f))
  }
  function b(a, b, d, e) {
    return od.call(i, a, b.call(i, a.state, d, e))
  }
  function d(a, b, d) {
    return od.call(i, a, b.call(i, a.state, d))
  }
  function e(a, b) {
    return od.call(i, a, b.call(i, a.state))
  }
  var f = i, g = function() {
    function a(b, d, e, f, g, j) {
      var F = i;
      t(j) && (F = B(Array.prototype.slice.call(arguments, 5), 0));
      return od.call(i, b, R.call(i, d, b.state, e, f, g, F))
    }
    a.d = 5;
    a.b = function(a) {
      var b = E(a), d = E(H(a)), e = E(H(H(a))), f = E(H(H(H(a)))), g = E(H(H(H(H(a))))), a = G(H(H(H(H(a)))));
      return od.call(i, b, R.call(i, d, b.state, e, f, g, a))
    };
    return a
  }(), f = function(f, k, o, q, r, C) {
    switch(arguments.length) {
      case 2:
        return e.call(this, f, k);
      case 3:
        return d.call(this, f, k, o);
      case 4:
        return b.call(this, f, k, o, q);
      case 5:
        return a.call(this, f, k, o, q, r);
      default:
        return g.apply(this, arguments)
    }
    c("Invalid arity: " + arguments.length)
  };
  f.d = 5;
  f.b = g.b;
  f.a = e;
  f.c = d;
  f.O = b;
  f.ma = a;
  f.wa = g;
  return f
}();
function Z(a) {
  return Ja.call(i, a)
}
var Lb = function() {
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
  d.N = b;
  d.h = a;
  return d
}(), Mb = function(a) {
  return Math.floor(Math.random() * a)
}, qd = nd.call(i, function() {
  return W(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":W([], {}), "\ufdd0'descendants":W([], {}), "\ufdd0'ancestors":W([], {})})
}.call(i)), td = function() {
  function a(a, b, g) {
    var j = y.call(i, b, g);
    if(u(j)) {
      return j
    }
    j = Fb.call(i, "\ufdd0'ancestors".call(i, a).call(i, b), g);
    if(u(j)) {
      return j
    }
    j = vb.call(i, g);
    if(u(j)) {
      if(j = vb.call(i, b), u(j)) {
        if(j = y.call(i, J.call(i, g), J.call(i, b)), u(j)) {
          for(var j = h, k = 0;;) {
            var o;
            o = I.call(i, j);
            o = u(o) ? o : y.call(i, k, J.call(i, g));
            if(u(o)) {
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
    return d.call(i, Z.call(i, qd), a, b)
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
}(), ud = function() {
  function a(a, b) {
    return hc.call(i, L.call(i, "\ufdd0'parents".call(i, a), b))
  }
  function b(a) {
    return d.call(i, Z.call(i, qd), a)
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
function vd(a, b, d, e) {
  pd.call(i, a, function() {
    return Z.call(i, b)
  });
  return pd.call(i, d, function() {
    return Z.call(i, e)
  })
}
var xd = function wd(b, d, e) {
  var f = Z.call(i, e).call(i, b), f = u(u(f) ? f.call(i, d) : f) ? h : i;
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = ud.call(i, d);;) {
      if(0 < J.call(i, f)) {
        wd.call(i, b, E.call(i, f), e), f = G.call(i, f)
      }else {
        return i
      }
    }
  }();
  if(u(f)) {
    return f
  }
  f = function() {
    for(var f = ud.call(i, b);;) {
      if(0 < J.call(i, f)) {
        wd.call(i, E.call(i, f), d, e), f = G.call(i, f)
      }else {
        return i
      }
    }
  }();
  return u(f) ? f : l
};
function yd(a, b, d) {
  d = xd.call(i, a, b, d);
  return u(d) ? d : td.call(i, a, b)
}
var Ad = function zd(b, d, e, f, g, j, k) {
  var o = N.call(i, function(e, f) {
    var j = K.call(i, f, 0, i);
    K.call(i, f, 1, i);
    if(u(td.call(i, d, j))) {
      var k;
      k = (k = e === i) ? k : yd.call(i, j, E.call(i, e), g);
      k = u(k) ? f : e;
      u(yd.call(i, E.call(i, k), j, g)) || c(Error(O.call(i, "Multiple methods in multimethod '", b, "' match dispatch value: ", d, " -> ", j, " and ", E.call(i, k), ", and neither is preferred")));
      return k
    }
    return e
  }, i, Z.call(i, f));
  if(u(o)) {
    if(u(y.call(i, Z.call(i, k), Z.call(i, e)))) {
      return pd.call(i, j, ib, d, fb.call(i, o)), fb.call(i, o)
    }
    vd.call(i, j, f, k, e);
    return zd.call(i, b, d, e, f, g, j, k)
  }
  return i
};
function Bd(a, b, d) {
  if(a ? a.oa : a) {
    a = a.oa(a, b, d)
  }else {
    var e;
    var f = Bd[s.call(i, a)];
    f ? e = f : (f = Bd._) ? e = f : c(v.call(i, "IMultiFn.-add-method", a));
    a = e.call(i, a, b, d)
  }
  return a
}
function Cd(a, b) {
  var d;
  if(a ? a.qa : a) {
    d = a.qa(0, b)
  }else {
    var e = Cd[s.call(i, a)];
    e ? d = e : (e = Cd._) ? d = e : c(v.call(i, "IMultiFn.-get-method", a));
    d = d.call(i, a, b)
  }
  return d
}
function Dd(a, b) {
  var d;
  if(a ? a.pa : a) {
    d = a.pa(a, b)
  }else {
    var e = Dd[s.call(i, a)];
    e ? d = e : (e = Dd._) ? d = e : c(v.call(i, "IMultiFn.-dispatch", a));
    d = d.call(i, a, b)
  }
  return d
}
function Ed(a, b, d) {
  b = R.call(i, b, d);
  a = Cd.call(i, a, b);
  u(a) || c(Error(O.call(i, "No method in multimethod '", Zc, "' for dispatch value: ", b)));
  return R.call(i, a, d)
}
function Fd(a, b, d, e, f, g, j, k) {
  this.name = a;
  this.ya = b;
  this.xa = d;
  this.ea = e;
  this.ca = f;
  this.za = g;
  this.fa = j;
  this.da = k
}
p = Fd.prototype;
p.k = function(a) {
  return ca.call(i, a)
};
p.oa = function(a, b, d) {
  pd.call(i, this.ca, ib, b, d);
  vd.call(i, this.fa, this.ca, this.da, this.ea);
  return a
};
p.qa = function(a, b) {
  u(y.call(i, Z.call(i, this.da), Z.call(i, this.ea))) || vd.call(i, this.fa, this.ca, this.da, this.ea);
  var d = Z.call(i, this.fa).call(i, b);
  if(u(d)) {
    return d
  }
  d = Ad.call(i, this.name, b, this.ea, this.ca, this.za, this.fa, this.da);
  return u(d) ? d : Z.call(i, this.ca).call(i, this.xa)
};
p.pa = function(a, b) {
  return Ed.call(i, a, this.ya, b)
};
p.call = function() {
  function a(a, d) {
    var e = i;
    t(d) && (e = B(Array.prototype.slice.call(arguments, 1), 0));
    return Dd.call(i, this, e)
  }
  a.d = 1;
  a.b = function(a) {
    E(a);
    a = G(a);
    return Dd.call(i, this, a)
  };
  return a
}();
p.apply = function(a, b) {
  return Dd.call(i, this, b)
};
function Gd(a) {
  return a.getContext("2d").getImageData(0, 0, a.width, a.height)
}
var Hd = function() {
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
}(), Id = function() {
  var a = window.Fa;
  if(u(a)) {
    return a
  }
  a = window.Ga;
  if(u(a)) {
    return a
  }
  a = window.Ca;
  if(u(a)) {
    return a
  }
  a = window.Ea;
  if(u(a)) {
    return a
  }
  a = window.Da;
  return u(a) ? a : function(a) {
    return setTimeout(a, 17)
  }
}();
var Kd = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g;
    g = console;
    g = u(g) ? Z.call(i, a).call(i, "\ufdd0'debug") : g;
    return u(g) ? (a = R.call(i, O, Jd.call(i, a), " :: ", b, f), console.log(a)) : i
  }
  a.d = 2;
  a.b = function(a) {
    var e = E(a), f = E(H(a)), a = G(H(a));
    return b.call(this, e, f, a)
  };
  return a
}();
function Ld(a) {
  return u(pb.call(i, a)) ? a : T([a])
}
function Md() {
  return W(["\ufdd0'in", "\ufdd0'out", "\ufdd0'constraints"], {"\ufdd0'in":T([]), "\ufdd0'out":T([]), "\ufdd0'constraints":T([])})
}
function Jd(a) {
  return Nd.call(i, a, T(["\ufdd0'name"]))
}
function Nd(a, b) {
  return xc.call(i, Z.call(i, a), b)
}
function Od(a, b, d) {
  return pd.call(i, a, function(a) {
    return zc.call(i, a, b, d)
  })
}
var Pd = function() {
  function a(a, e) {
    var f = i;
    t(e) && (f = B(Array.prototype.slice.call(arguments, 1), 0));
    return b.call(this, a, f)
  }
  function b(a, b) {
    return pd.call(i, a, function(a) {
      return R.call(i, Ac, a, b)
    })
  }
  a.d = 1;
  a.b = function(a) {
    var e = E(a), a = G(a);
    return b.call(this, e, a)
  };
  return a
}();
function Qd(a) {
  return Nd.call(i, a, T(["\ufdd0'current"]))
}
function Rd(a, b, d) {
  return Od.call(i, a, T(["\ufdd0'states", b]), d)
}
function Sd(a, b, d) {
  return Od.call(i, a, T(["\ufdd0'events", b]), d)
}
function Td(a, b) {
  return Ac.call(i, a, T(["\ufdd0'in"]), hb, b)
}
function Ud(a, b) {
  var d = Nd.call(i, a, T(["\ufdd0'states", b, "\ufdd0'constraints"]));
  return u(d) ? ic.call(i, function(a) {
    return a.call(i, b)
  }, d) : h
}
var Vd = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    b = D.call(i, Ld.call(i, b));
    if(u(b)) {
      for(var g = E.call(i, b);;) {
        if(u(Ud.call(i, a, g))) {
          var j = Nd.call(i, a, T(["\ufdd0'states", g, "\ufdd0'in"]));
          Pd.call(i, a, T(["\ufdd0'current"]), hb, g);
          Kd.call(i, a, "(set ", O.call(i, g), ") -> ", kd.call(i, Qd.call(i, a)));
          if(u(D.call(i, j)) && (Kd.call(i, a, "(in ", O.call(i, g), ")"), j = D.call(i, j), u(j))) {
            for(g = E.call(i, j);;) {
              if(R.call(i, g, f), g = H.call(i, j), u(g)) {
                j = g, g = E.call(i, j)
              }else {
                break
              }
            }
          }
        }
        b = H.call(i, b);
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
    var e = E(a), f = E(H(a)), a = G(H(a));
    return b.call(this, e, f, a)
  };
  return a
}(), Wd = function() {
  function a(a, e, f) {
    var g = i;
    t(f) && (g = B(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, e, g)
  }
  function b(a, b, f) {
    var g = D.call(i, Ld.call(i, b));
    if(u(g)) {
      for(b = E.call(i, g);;) {
        var j = Nd.call(i, a, T(["\ufdd0'events", b]));
        u(j) && (j = R.call(i, j, f), Kd.call(i, a, "(trans ", O.call(i, b), ") -> ", Bb.call(i, j), " :: context ", kd.call(i, f)));
        b = H.call(i, g);
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
    var e = E(a), f = E(H(a)), a = G(H(a));
    return b.call(this, e, f, a)
  };
  return a
}();
var Xd = document.getElementById("screen"), Yd = document.getElementById("fps"), Zd = function() {
  function a(a) {
    var e = i;
    t(a) && (e = B(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, e)
  }
  function b(a) {
    a = K.call(i, a, 0, i);
    return nd.call(i, W(["\ufdd0'debug", "\ufdd0'name", "\ufdd0'current", "\ufdd0'states", "\ufdd0'events"], {"\ufdd0'debug":h, "\ufdd0'name":Zc.call(i, a), "\ufdd0'current":Yc([]), "\ufdd0'states":W([], {}), "\ufdd0'events":W([], {})}))
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
var $d = W(["\ufdd0'wall", "\ufdd0'test", "\ufdd0'test2", "\ufdd0'floor"], {"\ufdd0'wall":"res/wall.png", "\ufdd0'test":"res/test.png", "\ufdd0'test2":"res/testgrad.png", "\ufdd0'floor":"res/floor.png"}), na = function(a) {
  return console.log(a)
};
var ae = nd.h(Yc([])), be = nd.h(W([], {})), ce = function() {
  var a = nd.h(W([], {})), b = nd.h(W([], {})), d = nd.h(W([], {})), e = nd.h(W([], {})), f = L.c(W([], {}), "\ufdd0'hierarchy", qd);
  return new Fd("load", function(a, b) {
    return u(ad.call(i, /(.*)\.(png|gif|jpe?g)/, b)) ? "\ufdd0'image" : "\ufdd0'unknown"
  }, "\ufdd0'default", f, a, b, d, e)
}();
Bd(ce, "\ufdd0'default", function(a, b) {
  return u(h) ? ld(O("Don't know how to load ", a, " from url ", b)) : i
});
Bd(ce, "\ufdd0'image", function(a, b) {
  var d = document.createElement(Zc("\ufdd0'img"));
  d.src = b;
  return d.onload = function() {
    var b = document.createElement(Zc("\ufdd0'canvas")), f = d.width, g = d.height;
    b.width = f;
    b.height = g;
    b.getContext("2d").drawImage(d, 0, 0, f, g);
    pd.O(be, ib, a, b);
    pd.c(ae, mb, a);
    return u(ob(Z(ae))) ? Wd.call(i, Zd, "\ufdd0'loaded") : i
  }
});
function de(a, b) {
  for(var d = Array(a), e = 0;;) {
    if(e < a) {
      d[e] = b, e += 1
    }else {
      break
    }
  }
  return d
}
function ee(a, b) {
  function d(a, b, d, e) {
    var f = 2 * (a - 0.5 - g), k = 2 * (b - 0.5 - j), b = f * Za - k * $a, a = 2 * (-0.5 - ab), o = 2 * (0.5 - ab), k = k * Za + f * $a, q = 2 * (d - 0.5 - g), r = 2 * (e - 0.5 - j), e = q * Za - r * $a, d = 2 * (-0.5 - ab), f = 2 * (0.5 - ab), q = r * Za + q * $a;
    if((r = 0.2 > k) ? 0.2 > q : r) {
      return i
    }
    var r = 0.2 > k, P = 0.2 > q, C = (0.2 - k) / (q - k), Y = r ? b + C * (e - b) : b, k = r ? k + C * (q - k) : k, q = P ? k + C * (q - k) : q, b = tc - Y / k * F, Y = tc - (P ? Y + C * (e - Y) : e) / q * F;
    if(b < Y) {
      for(var e = S < Math.ceil.call(i, Y) ? S : Math.ceil.call(i, Y), a = a / k * F + rb, o = o / k * F + rb, d = d / q * F + rb, f = f / q * F + rb, k = 1 / k, M = 1 / q, q = M - k, r = (r ? 0 + 16 * C : 0) * k, P = (P ? 0 + 16 * C : 16) * M - r, C = 1 / (Y - b), Y = 0 > Math.ceil.call(i, b) ? 0 : Math.ceil.call(i, b);;) {
        if(Y < e) {
          var U = C * (Y - b), M = k + q * U;
          if(rd[Y] <= M) {
            rd[Y] = M;
            for(var wa = Math.floor.call(i, (r + P * U) / M), Rb = a + U * (d - a) - 0.5, sb = o + U * (f - o), U = F < Math.ceil.call(i, sb) ? F : Math.ceil.call(i, sb), sb = 1 / (sb - Rb), bb = 0 > Math.ceil.call(i, Rb) ? 0 : Math.ceil.call(i, Rb);;) {
              if(bb < U) {
                var uc = 4 * (wa + 16 * Math.floor.call(i, 16 * sb * (bb - Rb))), Sb = 4 * (Y + bb * S);
                Tb[Y + bb * S] = 4 / M;
                $[Sb] = fc[uc];
                $[1 + Sb] = fc[1 + uc];
                $[2 + Sb] = fc[2 + uc];
                $[3 + Sb] = 255;
                bb += 1
              }else {
                break
              }
            }
          }
          Y += 1
        }else {
          return i
        }
      }
    }else {
      return i
    }
  }
  for(var e = u(Ab(a)) ? R.a(Wa, a) : a, f = L.a(e, "\ufdd0'player"), f = u(Ab(f)) ? R.a(Wa, f) : f, g = L.a(f, "\ufdd0'x"), j = L.a(f, "\ufdd0'y"), k = L.a(f, "\ufdd0'z"), o = L.a(f, "\ufdd0'rot"), q = L.a(f, "\ufdd0'walkphase"), r = L.a(f, "\ufdd0'walk"), C = L.a(e, "\ufdd0'level"), S = b.width, F = b.height, e = b.getContext("2d"), P = Gd(L.a(Z(be), "\ufdd0'floor")).data, fc = Gd(L.a(Z(be), "\ufdd0'wall")).data, f = e.createImageData(S, F), $ = f.data, Tb = de(S * F, 1E4), rd = de(S, 0), ab = 
  0.01 * r * Math.sin.call(i, 0.4 * q) - k - 0.2, tc = S / 2, rb = F / 3, Za = Math.cos.call(i, o), $a = Math.sin.call(i, o), k = Math.floor.call(i, g), o = Math.floor.call(i, j), q = S * F, r = 0;;) {
    if(r < q) {
      $[3 + 4 * r] = 255, r += 1
    }else {
      break
    }
  }
  for(q = o - 6;;) {
    if(q <= o + 6) {
      for(r = k - 6;;) {
        if(r <= k + 6) {
          var M = C.call(i, r + 1, q), U = C.call(i, r, q + 1);
          0 < C.call(i, r, q) ? (0 < M || d.call(i, r + 1, q + 1, r + 1, q), 0 < U || d.call(i, r, q + 1, r + 1, q + 1)) : (0 < M && d.call(i, r + 1, q, r + 1, q + 1), 0 < U && d.call(i, r + 1, q + 1, r, q + 1));
          r += 1
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
    if(k < F) {
      q = (k + 0.5 - rb) / F;
      o = k * S;
      q = 0 > q ? (4 + 8 * ab) / -q : (4 - 8 * ab) / q;
      r = S;
      for(M = 0;;) {
        if(M < r) {
          if(Tb[M + o] > q) {
            var wa = q * ((tc - M) / F), U = 2 * (wa * Za + q * $a + 8 * (0.5 + g)), sd = 2 * (q * Za + -1 * wa * $a + 8 * (0.5 + j));
            0 < C.call(i, U >> 4, sd >> 4) || (wa = 4 * (M + o), U = 4 * ((U & 15) + 16 * (sd & 15)), Tb[M + o] = q, $[wa] = P[U], $[1 + wa] = P[1 + U], $[2 + wa] = P[2 + U], $[3 + wa] = 255)
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
  C = S * F;
  for(P = 0;;) {
    if(P < C) {
      r = Tb[P], 0 < r && (M = P % S, U = (M - S / 2) / S, k = 4 * P, o = $[1 + k], q = $[2 + k], r = Math.floor.call(i, 300 - 6 * r * (2 * U * U + 1)) + 4 * (M + 14 * Math.floor.call(i, P / S) & 3) >> 4 << 4, r = 0 > (255 < Math.floor.call(i, r) ? 255 : Math.floor.call(i, r)) ? 0 : 255 < Math.floor.call(i, r) ? 255 : Math.floor.call(i, r), $[k] = Math.floor.call(i, $[k] * r / 255), $[1 + k] = Math.floor.call(i, o * r / 255), $[2 + k] = Math.floor.call(i, q * r / 255)), P += 1
    }else {
      break
    }
  }
  return e.putImageData(f, 0, 0)
}
;function fe(a, b, d, e, f) {
  this.K = a;
  this.I = b;
  this.data = d;
  this.f = e;
  this.e = f;
  3 < arguments.length ? (this.f = e, this.e = f) : this.e = this.f = i
}
p = fe.prototype;
p.k = function(a) {
  return cb(a)
};
p.L = function(a, b) {
  return x.c(a, b, i)
};
p.M = function(a, b, d) {
  return"\ufdd0'w" === b ? this.K : "\ufdd0'h" === b ? this.I : "\ufdd0'data" === b ? this.data : L.c(this.e, b, d)
};
p.Q = function(a, b, d) {
  return u(Va.call(i, "\ufdd0'w", b)) ? new fe(d, this.I, this.data, this.f, this.e) : u(Va.call(i, "\ufdd0'h", b)) ? new fe(this.K, d, this.data, this.f, this.e) : u(Va.call(i, "\ufdd0'data", b)) ? new fe(this.K, this.I, d, this.f, this.e) : new fe(this.K, this.I, this.data, this.f, ib.c(this.e, b, d))
};
p.call = function(a, b, d) {
  a = (a = -1 < b) ? b < this.K : a;
  u(a) && (a = (a = -1 < d) ? d < this.I : a);
  return u(a) ? this.data[d][b] : 2
};
p.B = h;
p.t = function(a, b) {
  return u(vb(b)) ? ya(a, w.a(b, 0), w.a(b, 1)) : N.c(sa, a, b)
};
p.z = function() {
  return D(dc.a(T([V("\ufdd0'w", this.K), V("\ufdd0'h", this.I), V("\ufdd0'data", this.data)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(ed, "", " ", "", b, a)
  }, O("#", "argh.level.Level", "{"), ", ", "}", b, dc.a(T([V("\ufdd0'w", this.K), V("\ufdd0'h", this.I), V("\ufdd0'data", this.data)]), this.e))
};
p.F = function() {
  return 3 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Oc(a, b) : d
};
p.C = function(a, b) {
  return new fe(this.K, this.I, this.data, b, this.e)
};
p.u = h;
p.v = m("f");
p.Z = h;
p.U = function(a, b) {
  return u(Fb(Yc(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), b)) ? jb.a(kb(vc(W([], {}), a), this.f), b) : new fe(this.K, this.I, this.data, this.f, hc(jb.a(this.e, b)))
};
function ge(a, b, d) {
  return new fe(a, b, d)
}
function he(a, b, d) {
  for(var e = [], f = -1;;) {
    if(1 >= f) {
      for(var g = -1;;) {
        if(1 >= g) {
          var j = g === f, j = I(j ? 0 === f : j);
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
function ie(a, b, d) {
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
function je(a, b, d) {
  for(var e = 0;;) {
    if(2E4 > e) {
      var f = Mb(a - 2) + 1, g = Mb(b - 2) + 1;
      d[g][f] = u(gc.a(h, 6 > he(f, g, d))) ? 0 : 1;
      e += 1
    }else {
      break
    }
  }
  return d
}
function ke(a, b, d) {
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
function le(a, b) {
  return ge(a, b, ke(a, b, je(a, b, ie(a, b, function() {
    return 0.85 > Lb.N() ? 0 : 1
  }))))
}
function me(a, b) {
  return le(a, b)
}
function ne(a) {
  for(var a = u(Ab(a)) ? R.a(Wa, a) : a, b = L.a(a, "\ufdd0'h"), d = [], e = L.a(a, "\ufdd0'w"), f = 0;;) {
    if(f < e) {
      for(var g = b, j = 0;;) {
        if(j < g) {
          0 === a.call(i, f, j) && d.push(T([f, j])), j += 1
        }else {
          break
        }
      }
      f += 1
    }else {
      break
    }
  }
  return K.call(i, d, Mb.call(i, J.call(i, d)))
}
;function oe(a, b, d, e, f, g, j, k, o, q, r) {
  this.x = a;
  this.y = b;
  this.s = d;
  this.m = e;
  this.q = f;
  this.r = g;
  this.n = j;
  this.o = k;
  this.p = o;
  this.f = q;
  this.e = r;
  9 < arguments.length ? (this.f = q, this.e = r) : this.e = this.f = i
}
p = oe.prototype;
p.k = function(a) {
  return cb(a)
};
p.L = function(a, b) {
  return x.c(a, b, i)
};
p.M = function(a, b, d) {
  return"\ufdd0'x" === b ? this.x : "\ufdd0'y" === b ? this.y : "\ufdd0'z" === b ? this.s : "\ufdd0'rot" === b ? this.m : "\ufdd0'xacc" === b ? this.q : "\ufdd0'yacc" === b ? this.r : "\ufdd0'rotacc" === b ? this.n : "\ufdd0'walk" === b ? this.o : "\ufdd0'walkphase" === b ? this.p : L.c(this.e, b, d)
};
p.Q = function(a, b, d) {
  return u(Va.call(i, "\ufdd0'x", b)) ? new oe(d, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'y", b)) ? new oe(this.x, d, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'z", b)) ? new oe(this.x, this.y, d, this.m, this.q, this.r, this.n, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'rot", b)) ? new oe(this.x, this.y, this.s, d, this.q, this.r, this.n, this.o, this.p, this.f, this.e) : 
  u(Va.call(i, "\ufdd0'xacc", b)) ? new oe(this.x, this.y, this.s, this.m, d, this.r, this.n, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'yacc", b)) ? new oe(this.x, this.y, this.s, this.m, this.q, d, this.n, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'rotacc", b)) ? new oe(this.x, this.y, this.s, this.m, this.q, this.r, d, this.o, this.p, this.f, this.e) : u(Va.call(i, "\ufdd0'walk", b)) ? new oe(this.x, this.y, this.s, this.m, this.q, this.r, this.n, d, this.p, this.f, this.e) : 
  u(Va.call(i, "\ufdd0'walkphase", b)) ? new oe(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, d, this.f, this.e) : new oe(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.f, ib.c(this.e, b, d))
};
p.B = h;
p.t = function(a, b) {
  return u(vb(b)) ? ya(a, w.a(b, 0), w.a(b, 1)) : N.c(sa, a, b)
};
p.z = function() {
  return D(dc.a(T([V("\ufdd0'x", this.x), V("\ufdd0'y", this.y), V("\ufdd0'z", this.s), V("\ufdd0'rot", this.m), V("\ufdd0'xacc", this.q), V("\ufdd0'yacc", this.r), V("\ufdd0'rotacc", this.n), V("\ufdd0'walk", this.o), V("\ufdd0'walkphase", this.p)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(ed, "", " ", "", b, a)
  }, O("#", "argh.game.Player", "{"), ", ", "}", b, dc.a(T([V("\ufdd0'x", this.x), V("\ufdd0'y", this.y), V("\ufdd0'z", this.s), V("\ufdd0'rot", this.m), V("\ufdd0'xacc", this.q), V("\ufdd0'yacc", this.r), V("\ufdd0'rotacc", this.n), V("\ufdd0'walk", this.o), V("\ufdd0'walkphase", this.p)]), this.e))
};
p.F = function() {
  return 9 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Oc(a, b) : d
};
p.C = function(a, b) {
  return new oe(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, b, this.e)
};
p.u = h;
p.v = m("f");
p.Z = h;
p.U = function(a, b) {
  return u(Fb(Yc("\ufdd0'z,\ufdd0'y,\ufdd0'x,\ufdd0'xacc,\ufdd0'rot,\ufdd0'yacc,\ufdd0'walkphase,\ufdd0'rotacc,\ufdd0'walk".split(",")), b)) ? jb.a(kb(vc(W([], {}), a), this.f), b) : new oe(this.x, this.y, this.s, this.m, this.q, this.r, this.n, this.o, this.p, this.f, hc(jb.a(this.e, b)))
};
function pe(a, b, d, e) {
  this.S = a;
  this.R = b;
  this.f = d;
  this.e = e;
  2 < arguments.length ? (this.f = d, this.e = e) : this.e = this.f = i
}
p = pe.prototype;
p.k = function(a) {
  return cb(a)
};
p.L = function(a, b) {
  return x.c(a, b, i)
};
p.M = function(a, b, d) {
  return"\ufdd0'player" === b ? this.S : "\ufdd0'level" === b ? this.R : L.c(this.e, b, d)
};
p.Q = function(a, b, d) {
  return u(Va.call(i, "\ufdd0'player", b)) ? new pe(d, this.R, this.f, this.e) : u(Va.call(i, "\ufdd0'level", b)) ? new pe(this.S, d, this.f, this.e) : new pe(this.S, this.R, this.f, ib.c(this.e, b, d))
};
p.B = h;
p.t = function(a, b) {
  return u(vb(b)) ? ya(a, w.a(b, 0), w.a(b, 1)) : N.c(sa, a, b)
};
p.z = function() {
  return D(dc.a(T([V("\ufdd0'player", this.S), V("\ufdd0'level", this.R)]), this.e))
};
p.w = h;
p.l = function(a, b) {
  return X(function(a) {
    return X(ed, "", " ", "", b, a)
  }, O("#", "argh.game.Game", "{"), ", ", "}", b, dc.a(T([V("\ufdd0'player", this.S), V("\ufdd0'level", this.R)]), this.e))
};
p.F = function() {
  return 2 + J(this.e)
};
p.j = function(a, b) {
  var d = a.constructor === b.constructor;
  return d ? Oc(a, b) : d
};
p.C = function(a, b) {
  return new pe(this.S, this.R, b, this.e)
};
p.u = h;
p.v = m("f");
p.Z = h;
p.U = function(a, b) {
  return u(Fb(Yc(["\ufdd0'player", "\ufdd0'level"]), b)) ? jb.a(kb(vc(W([], {}), a), this.f), b) : new pe(this.S, this.R, this.f, hc(jb.a(this.e, b)))
};
function qe(a, b, d) {
  var e = Math.floor.call(i, 0.5 + b - 0.3), f = Math.floor.call(i, 0.5 + b + 0.3), g = Math.floor.call(i, 0.5 + d - 0.3), j = Math.floor.call(i, 0.5 + d + 0.3);
  return I(function() {
    var b = 0 < a.call(i, e, g);
    if(b || (b = 0 < a.call(i, f, g))) {
      return b
    }
    return(b = 0 < a.call(i, e, j)) ? b : 0 < a.call(i, f, j)
  }())
}
function re(a, b) {
  var d = u(Ab(a)) ? R.a(Wa, a) : a;
  L.a(d, "\ufdd0'rotacc");
  L.a(d, "\ufdd0'rot");
  var e = L.a(d, "\ufdd0'y"), f = L.a(d, "\ufdd0'x"), g = L.a(d, "\ufdd0'yacc"), j = L.a(d, "\ufdd0'xacc"), k = Math.floor.call(i, Math.abs.call(i, 100 * j) + 1), o = function() {
    for(var a = k, d = f, g = j;;) {
      if(0 === a) {
        return T([d, g])
      }
      if(u(qe(b, d + g * (a / k), e))) {
        return T([d + g * (a / k), g])
      }
      a -= 1;
      g = 0
    }
  }(), q = K.c(o, 0, i);
  K.c(o, 1, i);
  var r = Math.floor.call(i, Math.abs.call(i, 100 * g) + 1), o = function() {
    for(var a = r, d = e, j = g;;) {
      if(0 === a) {
        return T([d, j])
      }
      if(u(qe(b, f, d + j * (a / r)))) {
        return T([d + j * (a / r), j])
      }
      a -= 1;
      j = 0
    }
  }(), C = K.c(o, 0, i);
  K.c(o, 1, i);
  return ib(d, "\ufdd0'x", q, "\ufdd0'y", C, "\ufdd0'xacc", j, "\ufdd0'yacc", g)
}
function se(a, b, d) {
  return u(a.call(i, d)) ? -1 : u(a.call(i, b)) ? 1 : 0
}
function te(a, b) {
  var d = u(Ab(a)) ? R.a(Wa, a) : a, e = L.a(d, "\ufdd0'player"), f = u(Ab(e)) ? R.a(Wa, e) : e, g = L.a(f, "\ufdd0'rotacc"), j = L.a(f, "\ufdd0'rot");
  L.a(f, "\ufdd0'y");
  L.a(f, "\ufdd0'x");
  var e = L.a(d, "\ufdd0'level"), k = se(b, "\ufdd0'strafer", "\ufdd0'strafel"), o = se(b, "\ufdd0'down", "\ufdd0'up"), q = k * k + o * o, q = 0 < q ? Math.sqrt.call(i, q) : 1, k = k / q, o = o / q, q = 0.05 * se(b, "\ufdd0'left", "\ufdd0'right"), f = Ac(Ac(Ac(Ac(Ac(Ac(f, T(["\ufdd0'walk"]), Jb, 0.6), T(["\ufdd0'walk"]), Hb, Math.sqrt.call(i, k * k + o * o)), T(["\ufdd0'walkphase"]), Hb, Math.sqrt.call(i, k * k + o * o)), T(["\ufdd0'rotacc"]), Hb, q), T(["\ufdd0'xacc"]), Ib, 0.03 * (k * Math.cos.call(i, 
  j) + o * Math.sin.call(i, j))), T(["\ufdd0'yacc"]), Ib, 0.03 * (o * Math.cos.call(i, j) - k * Math.sin.call(i, j)));
  return Ac(zc(d, T(["\ufdd0'player"]), re(f, e)), T(["\ufdd0'player"]), function(a) {
    return Ac(Ac(Ac(Ac(a, T(["\ufdd0'xacc"]), Jb, 0.6), T(["\ufdd0'yacc"]), Jb, 0.6), T(["\ufdd0'rot"]), Hb, g), T(["\ufdd0'rotacc"]), Jb, 0.4)
  })
}
;var ue = nd.h(Yc([])), ve = nd.h(i), we = document.createElement("canvas");
we.width = 160;
we.height = 120;
var xe = nd.h((new Date).getTime()), ze = function ye() {
  if(u("\ufdd0'escape".call(i, Z(ue)))) {
    return i
  }
  var b = (new Date).getTime(), d = 1E3 / (b - Z(xe)), e = 0.06 * (b - Z(xe)), f = Z(ue);
  Yd.innerHTML = O(Math.floor.call(i, 100 * d) / 100, " fps");
  pd.a(ve, function(b) {
    for(var d = e;;) {
      if(0 < d) {
        d -= 1, b = te(b, f)
      }else {
        return b
      }
    }
  });
  od(xe, (new Date).getTime());
  Hd.a(we, "black");
  Id.call(i, ye);
  ee.call(i, Z(ve), we);
  return Xd.getContext("2d").drawImage(we, 0, 0, Xd.width, Xd.height)
}, Ae;
a: {
  for(var Be = [65, 68, 37, 38, 39, 40, 83, 87, 27], Ce = "\ufdd0'strafel,\ufdd0'strafer,\ufdd0'left,\ufdd0'up,\ufdd0'right,\ufdd0'down,\ufdd0'down,\ufdd0'up,\ufdd0'escape".split(","), De = Be.length, Ee = 0, Fe = Uc;;) {
    if(Ee < De) {
      var Ge = Ee + 1, He = ib.call(i, Fe, Be[Ee], Ce[Ee]), Ee = Ge, Fe = He
    }else {
      Ae = Fe;
      break a
    }
  }
  Ae = void 0
}
function Ie() {
  function a(a) {
    return function(d) {
      pd.c(ue, a, Ae.call(i, d.keyCode));
      return d.preventDefault()
    }
  }
  document.onkeydown = a.call(i, hb);
  document.onkeyup = a.call(i, mb)
}
function Je(a) {
  Hd.a(Xd, "black");
  var b = Xd.getContext("2d");
  b.fillStyle = "white";
  b.font = "30px sans-serif";
  b.fillText(a, (Xd.width - b.measureText(a).width) / 2, Xd.height / 2)
}
var Ke = Td.call(i, Md.call(i), function() {
  Je("Loading assets...");
  var a;
  a: {
    var b = D($d);
    if(u(b)) {
      var d = E(b);
      K.c(d, 0, i);
      for(K.c(d, 1, i);;) {
        var e = d, d = K.c(e, 0, i), e = K.c(e, 1, i);
        pd.c(ae, hb, d);
        ce.call(i, d, e);
        b = H(b);
        if(u(b)) {
          d = b, b = E(d), e = d, d = b, b = e
        }else {
          a = i;
          break a
        }
      }
    }else {
      a = i
    }
  }
  return a
});
Rd.call(i, Zd, "\ufdd0'loading", Ke);
var Le = Td.call(i, Md.call(i), function() {
  Je("Initializing game...");
  Je("Binding events...");
  Ie();
  Je("Generating world...");
  var a = me.call(i, 60, 60), b, d = ne.call(i, a);
  b = K.c(d, 0, i);
  d = K.c(d, 1, i);
  b = new oe(b, d, 0, Lb.N(), 0, 0, 0, 0, 0);
  od(ve, new pe(b, a));
  Je("Starting game loop!");
  return Id.call(i, ze)
});
Rd.call(i, Zd, "\ufdd0'playing", Le);
Sd.call(i, Zd, "\ufdd0'init", function() {
  return Vd.call(i, Zd, "\ufdd0'loading")
});
Sd.call(i, Zd, "\ufdd0'loaded", function() {
  return Vd.call(i, Zd, "\ufdd0'playing")
});
Wd.call(i, Zd, "\ufdd0'init");
