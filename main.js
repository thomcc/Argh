var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.getObjectByName(name) && !goog.implicitNamespaces_[name]) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.require = function(rule) {
  if(!COMPILED) {
    if(goog.getObjectByName(rule)) {
      return
    }
    var path = goog.getPathFromDeps_(rule);
    if(path) {
      goog.included_[path] = true;
      goog.writeScripts_()
    }else {
      var errorMessage = "goog.require could not find: " + rule;
      if(goog.global.console) {
        goog.global.console["error"](errorMessage)
      }
      throw Error(errorMessage);
    }
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return arguments[0]
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
if(!COMPILED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(requireName in deps.nameToPath) {
            visitNode(deps.nameToPath[requireName])
          }else {
            if(!goog.getObjectByName(requireName)) {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(object, propName) {
  if(object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName)
  }else {
    return goog.propertyIsEnumerableCustom_(object, propName)
  }
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
Object.prototype.clone;
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  var context = selfObj || goog.global;
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs)
    }
  }else {
    return function() {
      return fn.apply(context, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = style
};
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.subs = function(str, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var replacement = String(arguments[i]).replace(/\$/g, "$$$$");
    str = str.replace(/\%s/, replacement)
  }
  return str
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str)
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str))
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
  return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if(test1 < test2) {
    return-1
  }else {
    if(test1 == test2) {
      return 0
    }else {
      return 1
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if(str1 == str2) {
    return 0
  }
  if(!str1) {
    return-1
  }
  if(!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for(var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if(a != b) {
      var num1 = parseInt(a, 10);
      if(!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if(!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if(tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(str) {
  str = String(str);
  if(!goog.string.encodeUriRegExp_.test(str)) {
    return encodeURIComponent(str)
  }
  return str
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if(opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(str)) {
      return str
    }
    if(str.indexOf("&") != -1) {
      str = str.replace(goog.string.amperRe_, "&amp;")
    }
    if(str.indexOf("<") != -1) {
      str = str.replace(goog.string.ltRe_, "&lt;")
    }
    if(str.indexOf(">") != -1) {
      str = str.replace(goog.string.gtRe_, "&gt;")
    }
    if(str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, "&quot;")
    }
    return str
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(str) {
  if(goog.string.contains(str, "&")) {
    if("document" in goog.global && !goog.string.contains(str, "<")) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    }else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var el = goog.global["document"]["createElement"]("div");
  el["innerHTML"] = "<pre>x" + str + "</pre>";
  if(el["firstChild"][goog.string.NORMALIZE_FN_]) {
    el["firstChild"][goog.string.NORMALIZE_FN_]()
  }
  str = el["firstChild"]["firstChild"]["nodeValue"].slice(1);
  el["innerHTML"] = "";
  return goog.string.canonicalizeNewlines(str)
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if(!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for(var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if(str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(str.length > chars) {
    str = str.substring(0, chars - 3) + "..."
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(opt_trailingChars) {
    if(opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
  }else {
    if(str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos)
    }
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if(s.quote) {
    return s.quote()
  }else {
    var sb = ['"'];
    for(var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
    }
    sb.push('"');
    return sb.join("")
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for(var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join("")
};
goog.string.escapeChar = function(c) {
  if(c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if(c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if(cc > 31 && cc < 127) {
    rv = c
  }else {
    if(cc < 256) {
      rv = "\\x";
      if(cc < 16 || cc > 256) {
        rv += "0"
      }
    }else {
      rv = "\\u";
      if(cc < 4096) {
        rv += "0"
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
};
goog.string.toMap = function(s) {
  var rv = {};
  for(var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true
  }
  return rv
};
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if(index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if(index == -1) {
    index = s.length
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for(var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if(v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
    }while(order == 0)
  }
  return order
};
goog.string.compareElements_ = function(left, right) {
  if(left < right) {
    return-1
  }else {
    if(left > right) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for(var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_
  }
  return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if(num == 0 && goog.string.isEmpty(str)) {
    return NaN
  }
  return num
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(str) {
  return goog.string.toCamelCaseCache_[str] || (goog.string.toCamelCaseCache_[str] = String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(str) {
  return goog.string.toSelectorCaseCache_[str] || (goog.string.toSelectorCaseCache_[str] = String(str).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  this.stack = (new Error).stack || "";
  if(opt_msg) {
    this.message = String(opt_msg)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.string");
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if(givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs
  }else {
    if(defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs
    }
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
};
goog.asserts.fail = function(opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3))
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.NATIVE_ARRAY_PROTOTYPES = true;
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i < arr.length;i++) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if(fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i >= 0;i--) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;--i) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      var val = arr2[i];
      if(f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
};
goog.array.reduce = function(arr, f, val, opt_obj) {
  if(arr.reduce) {
    if(opt_obj) {
      return arr.reduce(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduce(f, val)
    }
  }
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.reduceRight = function(arr, f, val, opt_obj) {
  if(arr.reduceRight) {
    if(opt_obj) {
      return arr.reduceRight(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduceRight(f, val)
    }
  }
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;i--) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0
};
goog.array.clear = function(arr) {
  if(!goog.isArray(arr)) {
    for(var i = arr.length - 1;i >= 0;i--) {
      delete arr[i]
    }
  }
  arr.length = 0
};
goog.array.insert = function(arr, obj) {
  if(!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if(arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  }else {
    goog.array.insertAt(arr, obj, i)
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if(rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if(i >= 0) {
    goog.array.removeAt(arr, i);
    return true
  }
  return false
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(arr) {
  if(goog.isArray(arr)) {
    return goog.array.concat(arr)
  }else {
    var rv = [];
    for(var i = 0, len = arr.length;i < len;i++) {
      rv[i] = arr[i]
    }
    return rv
  }
};
goog.array.toArray = function(object) {
  if(goog.isArray(object)) {
    return goog.array.concat(object)
  }
  return goog.array.clone(object)
};
goog.array.extend = function(arr1, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if(goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && arr2.hasOwnProperty("callee")) {
      arr1.push.apply(arr1, arr2)
    }else {
      if(isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for(var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j]
        }
      }else {
        arr1.push(arr2)
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if(arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start)
  }else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
  }
};
goog.array.removeDuplicates = function(arr, opt_rv) {
  var returnArray = opt_rv || arr;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while(cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
    if(!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while(left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if(isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    }else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if(compareResult > 0) {
      left = middle + 1
    }else {
      right = middle;
      found = !compareResult
    }
  }
  return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for(var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(arr, stableCompareFn);
  for(var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key])
  })
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for(var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if(compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if(!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for(var i = 0;i < l;i++) {
    if(!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
  return goog.array.equals(arr1, arr2, opt_equalsFn)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if(index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter) {
  var buckets = {};
  for(var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter(value, i, array);
    if(goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value)
    }
  }
  return buckets
};
goog.array.repeat = function(value, n) {
  var array = [];
  for(var i = 0;i < n;i++) {
    array[i] = value
  }
  return array
};
goog.array.flatten = function(var_args) {
  var result = [];
  for(var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if(goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element))
    }else {
      result.push(element)
    }
  }
  return result
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if(array.length) {
    n %= array.length;
    if(n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n))
    }else {
      if(n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
};
goog.array.zip = function(var_args) {
  if(!arguments.length) {
    return[]
  }
  var result = [];
  for(var i = 0;true;i++) {
    var value = [];
    for(var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if(i >= arr.length) {
        return result
      }
      value.push(arr[i])
    }
    result.push(value)
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for(var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp
  }
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for(var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
};
goog.object.some = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
};
goog.object.every = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for(var key in obj) {
    rv++
  }
  return rv
};
goog.object.getAnyKey = function(obj) {
  for(var key in obj) {
    return key
  }
};
goog.object.getAnyValue = function(obj) {
  for(var key in obj) {
    return obj[key]
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = obj[key]
  }
  return res
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = key
  }
  return res
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for(var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if(!goog.isDef(obj)) {
      break
    }
  }
  return obj
};
goog.object.containsKey = function(obj, key) {
  return key in obj
};
goog.object.containsValue = function(obj, val) {
  for(var key in obj) {
    if(obj[key] == val) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(obj, f, opt_this) {
  for(var key in obj) {
    if(f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key]
};
goog.object.isEmpty = function(obj) {
  for(var key in obj) {
    return false
  }
  return true
};
goog.object.clear = function(obj) {
  for(var i in obj) {
    delete obj[i]
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if(rv = key in obj) {
    delete obj[key]
  }
  return rv
};
goog.object.add = function(obj, key, val) {
  if(key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
  if(key in obj) {
    return obj[key]
  }
  return opt_val
};
goog.object.set = function(obj, key, value) {
  obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
};
goog.object.clone = function(obj) {
  var res = {};
  for(var key in obj) {
    res[key] = obj[key]
  }
  return res
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for(var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for(var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for(key in source) {
      target[key] = source[key]
    }
    for(var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if(Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for(var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {};
  for(var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true
  }
  return rv
};
goog.provide("goog.userAgent.jscript");
goog.require("goog.string");
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  var hasScriptEngine = "ScriptEngine" in goog.global;
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = hasScriptEngine && goog.global["ScriptEngine"]() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global["ScriptEngineMajorVersion"]() + "." + goog.global["ScriptEngineMinorVersion"]() + "." + goog.global["ScriptEngineBuildVersion"]() : "0"
};
if(!goog.userAgent.jscript.ASSUME_NO_JSCRIPT) {
  goog.userAgent.jscript.init_()
}
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, version) >= 0
};
goog.provide("goog.string.StringBuffer");
goog.require("goog.userAgent.jscript");
goog.string.StringBuffer = function(opt_a1, var_args) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  if(opt_a1 != null) {
    this.append.apply(this, arguments)
  }
};
goog.string.StringBuffer.prototype.set = function(s) {
  this.clear();
  this.append(s)
};
if(goog.userAgent.jscript.HAS_JSCRIPT) {
  goog.string.StringBuffer.prototype.bufferLength_ = 0;
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    if(opt_a2 == null) {
      this.buffer_[this.bufferLength_++] = a1
    }else {
      this.buffer_.push.apply(this.buffer_, arguments);
      this.bufferLength_ = this.buffer_.length
    }
    return this
  }
}else {
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    this.buffer_ += a1;
    if(opt_a2 != null) {
      for(var i = 1;i < arguments.length;i++) {
        this.buffer_ += arguments[i]
      }
    }
    return this
  }
}
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.buffer_.length = 0;
    this.bufferLength_ = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join("");
    this.clear();
    if(str) {
      this.append(str)
    }
    return str
  }else {
    return this.buffer_
  }
};
goog.provide("cljs.core");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
goog.require("goog.object");
goog.require("goog.array");
cljs.core._STAR_print_fn_STAR_ = function _STAR_print_fn_STAR_(_) {
  throw new Error("No *print-fn* fn set for evaluation environment");
};
void 0;
void 0;
void 0;
cljs.core.truth_ = function truth_(x) {
  return x != null && x !== false
};
cljs.core.type_satisfies_ = function type_satisfies_(p, x) {
  var or__3700__auto____14427 = p[goog.typeOf.call(null, x)];
  if(cljs.core.truth_(or__3700__auto____14427)) {
    return or__3700__auto____14427
  }else {
    var or__3700__auto____14428 = p["_"];
    if(cljs.core.truth_(or__3700__auto____14428)) {
      return or__3700__auto____14428
    }else {
      return false
    }
  }
};
cljs.core.is_proto_ = function is_proto_(x) {
  return x.constructor.prototype === x
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function missing_protocol(proto, obj) {
  return Error.call(null, "No protocol method " + proto + " defined for type " + goog.typeOf.call(null, obj) + ": " + obj)
};
cljs.core.aclone = function aclone(array_like) {
  return Array.prototype.slice.call(array_like)
};
cljs.core.array = function array(var_args) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.aget = function aget(array, i) {
  return array[i]
};
cljs.core.aset = function aset(array, i, val) {
  return array[i] = val
};
cljs.core.alength = function alength(array) {
  return array.length
};
void 0;
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var _invoke = null;
  var _invoke__1 = function(this$) {
    if(function() {
      var and__3698__auto____14431 = this$;
      if(and__3698__auto____14431) {
        return this$.cljs$core$IFn$_invoke__1
      }else {
        return and__3698__auto____14431
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__1(this$)
    }else {
      return function() {
        var or__3700__auto____14432 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14432) {
          return or__3700__auto____14432
        }else {
          var or__3700__auto____14433 = cljs.core._invoke["_"];
          if(or__3700__auto____14433) {
            return or__3700__auto____14433
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__3698__auto____14434 = this$;
      if(and__3698__auto____14434) {
        return this$.cljs$core$IFn$_invoke__2
      }else {
        return and__3698__auto____14434
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__2(this$, a)
    }else {
      return function() {
        var or__3700__auto____14435 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14435) {
          return or__3700__auto____14435
        }else {
          var or__3700__auto____14436 = cljs.core._invoke["_"];
          if(or__3700__auto____14436) {
            return or__3700__auto____14436
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__3698__auto____14437 = this$;
      if(and__3698__auto____14437) {
        return this$.cljs$core$IFn$_invoke__3
      }else {
        return and__3698__auto____14437
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__3(this$, a, b)
    }else {
      return function() {
        var or__3700__auto____14438 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14438) {
          return or__3700__auto____14438
        }else {
          var or__3700__auto____14439 = cljs.core._invoke["_"];
          if(or__3700__auto____14439) {
            return or__3700__auto____14439
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__3698__auto____14440 = this$;
      if(and__3698__auto____14440) {
        return this$.cljs$core$IFn$_invoke__4
      }else {
        return and__3698__auto____14440
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__4(this$, a, b, c)
    }else {
      return function() {
        var or__3700__auto____14441 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14441) {
          return or__3700__auto____14441
        }else {
          var or__3700__auto____14442 = cljs.core._invoke["_"];
          if(or__3700__auto____14442) {
            return or__3700__auto____14442
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__3698__auto____14443 = this$;
      if(and__3698__auto____14443) {
        return this$.cljs$core$IFn$_invoke__5
      }else {
        return and__3698__auto____14443
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__5(this$, a, b, c, d)
    }else {
      return function() {
        var or__3700__auto____14444 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14444) {
          return or__3700__auto____14444
        }else {
          var or__3700__auto____14445 = cljs.core._invoke["_"];
          if(or__3700__auto____14445) {
            return or__3700__auto____14445
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__3698__auto____14446 = this$;
      if(and__3698__auto____14446) {
        return this$.cljs$core$IFn$_invoke__6
      }else {
        return and__3698__auto____14446
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__6(this$, a, b, c, d, e)
    }else {
      return function() {
        var or__3700__auto____14447 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14447) {
          return or__3700__auto____14447
        }else {
          var or__3700__auto____14448 = cljs.core._invoke["_"];
          if(or__3700__auto____14448) {
            return or__3700__auto____14448
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__3698__auto____14449 = this$;
      if(and__3698__auto____14449) {
        return this$.cljs$core$IFn$_invoke__7
      }else {
        return and__3698__auto____14449
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__7(this$, a, b, c, d, e, f)
    }else {
      return function() {
        var or__3700__auto____14450 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14450) {
          return or__3700__auto____14450
        }else {
          var or__3700__auto____14451 = cljs.core._invoke["_"];
          if(or__3700__auto____14451) {
            return or__3700__auto____14451
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__3698__auto____14452 = this$;
      if(and__3698__auto____14452) {
        return this$.cljs$core$IFn$_invoke__8
      }else {
        return and__3698__auto____14452
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__8(this$, a, b, c, d, e, f, g)
    }else {
      return function() {
        var or__3700__auto____14453 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14453) {
          return or__3700__auto____14453
        }else {
          var or__3700__auto____14454 = cljs.core._invoke["_"];
          if(or__3700__auto____14454) {
            return or__3700__auto____14454
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__3698__auto____14455 = this$;
      if(and__3698__auto____14455) {
        return this$.cljs$core$IFn$_invoke__9
      }else {
        return and__3698__auto____14455
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__9(this$, a, b, c, d, e, f, g, h)
    }else {
      return function() {
        var or__3700__auto____14456 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14456) {
          return or__3700__auto____14456
        }else {
          var or__3700__auto____14457 = cljs.core._invoke["_"];
          if(or__3700__auto____14457) {
            return or__3700__auto____14457
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__3698__auto____14458 = this$;
      if(and__3698__auto____14458) {
        return this$.cljs$core$IFn$_invoke__10
      }else {
        return and__3698__auto____14458
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      return function() {
        var or__3700__auto____14459 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14459) {
          return or__3700__auto____14459
        }else {
          var or__3700__auto____14460 = cljs.core._invoke["_"];
          if(or__3700__auto____14460) {
            return or__3700__auto____14460
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__3698__auto____14461 = this$;
      if(and__3698__auto____14461) {
        return this$.cljs$core$IFn$_invoke__11
      }else {
        return and__3698__auto____14461
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      return function() {
        var or__3700__auto____14462 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14462) {
          return or__3700__auto____14462
        }else {
          var or__3700__auto____14463 = cljs.core._invoke["_"];
          if(or__3700__auto____14463) {
            return or__3700__auto____14463
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__3698__auto____14464 = this$;
      if(and__3698__auto____14464) {
        return this$.cljs$core$IFn$_invoke__12
      }else {
        return and__3698__auto____14464
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      return function() {
        var or__3700__auto____14465 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14465) {
          return or__3700__auto____14465
        }else {
          var or__3700__auto____14466 = cljs.core._invoke["_"];
          if(or__3700__auto____14466) {
            return or__3700__auto____14466
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__3698__auto____14467 = this$;
      if(and__3698__auto____14467) {
        return this$.cljs$core$IFn$_invoke__13
      }else {
        return and__3698__auto____14467
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      return function() {
        var or__3700__auto____14468 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14468) {
          return or__3700__auto____14468
        }else {
          var or__3700__auto____14469 = cljs.core._invoke["_"];
          if(or__3700__auto____14469) {
            return or__3700__auto____14469
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__3698__auto____14470 = this$;
      if(and__3698__auto____14470) {
        return this$.cljs$core$IFn$_invoke__14
      }else {
        return and__3698__auto____14470
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      return function() {
        var or__3700__auto____14471 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14471) {
          return or__3700__auto____14471
        }else {
          var or__3700__auto____14472 = cljs.core._invoke["_"];
          if(or__3700__auto____14472) {
            return or__3700__auto____14472
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__3698__auto____14473 = this$;
      if(and__3698__auto____14473) {
        return this$.cljs$core$IFn$_invoke__15
      }else {
        return and__3698__auto____14473
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      return function() {
        var or__3700__auto____14474 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14474) {
          return or__3700__auto____14474
        }else {
          var or__3700__auto____14475 = cljs.core._invoke["_"];
          if(or__3700__auto____14475) {
            return or__3700__auto____14475
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__3698__auto____14476 = this$;
      if(and__3698__auto____14476) {
        return this$.cljs$core$IFn$_invoke__16
      }else {
        return and__3698__auto____14476
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      return function() {
        var or__3700__auto____14477 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14477) {
          return or__3700__auto____14477
        }else {
          var or__3700__auto____14478 = cljs.core._invoke["_"];
          if(or__3700__auto____14478) {
            return or__3700__auto____14478
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__3698__auto____14479 = this$;
      if(and__3698__auto____14479) {
        return this$.cljs$core$IFn$_invoke__17
      }else {
        return and__3698__auto____14479
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      return function() {
        var or__3700__auto____14480 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14480) {
          return or__3700__auto____14480
        }else {
          var or__3700__auto____14481 = cljs.core._invoke["_"];
          if(or__3700__auto____14481) {
            return or__3700__auto____14481
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__3698__auto____14482 = this$;
      if(and__3698__auto____14482) {
        return this$.cljs$core$IFn$_invoke__18
      }else {
        return and__3698__auto____14482
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      return function() {
        var or__3700__auto____14483 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14483) {
          return or__3700__auto____14483
        }else {
          var or__3700__auto____14484 = cljs.core._invoke["_"];
          if(or__3700__auto____14484) {
            return or__3700__auto____14484
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__3698__auto____14485 = this$;
      if(and__3698__auto____14485) {
        return this$.cljs$core$IFn$_invoke__19
      }else {
        return and__3698__auto____14485
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      return function() {
        var or__3700__auto____14486 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14486) {
          return or__3700__auto____14486
        }else {
          var or__3700__auto____14487 = cljs.core._invoke["_"];
          if(or__3700__auto____14487) {
            return or__3700__auto____14487
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__3698__auto____14488 = this$;
      if(and__3698__auto____14488) {
        return this$.cljs$core$IFn$_invoke__20
      }else {
        return and__3698__auto____14488
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      return function() {
        var or__3700__auto____14489 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14489) {
          return or__3700__auto____14489
        }else {
          var or__3700__auto____14490 = cljs.core._invoke["_"];
          if(or__3700__auto____14490) {
            return or__3700__auto____14490
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__3698__auto____14491 = this$;
      if(and__3698__auto____14491) {
        return this$.cljs$core$IFn$_invoke__21
      }else {
        return and__3698__auto____14491
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      return function() {
        var or__3700__auto____14492 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____14492) {
          return or__3700__auto____14492
        }else {
          var or__3700__auto____14493 = cljs.core._invoke["_"];
          if(or__3700__auto____14493) {
            return or__3700__auto____14493
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
  };
  _invoke = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return _invoke__1.call(this, this$);
      case 2:
        return _invoke__2.call(this, this$, a);
      case 3:
        return _invoke__3.call(this, this$, a, b);
      case 4:
        return _invoke__4.call(this, this$, a, b, c);
      case 5:
        return _invoke__5.call(this, this$, a, b, c, d);
      case 6:
        return _invoke__6.call(this, this$, a, b, c, d, e);
      case 7:
        return _invoke__7.call(this, this$, a, b, c, d, e, f);
      case 8:
        return _invoke__8.call(this, this$, a, b, c, d, e, f, g);
      case 9:
        return _invoke__9.call(this, this$, a, b, c, d, e, f, g, h);
      case 10:
        return _invoke__10.call(this, this$, a, b, c, d, e, f, g, h, i);
      case 11:
        return _invoke__11.call(this, this$, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return _invoke__12.call(this, this$, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return _invoke__13.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return _invoke__14.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return _invoke__15.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return _invoke__16.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return _invoke__17.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return _invoke__18.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return _invoke__19.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s);
      case 20:
        return _invoke__20.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t);
      case 21:
        return _invoke__21.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _invoke.__1 = _invoke__1;
  _invoke.__2 = _invoke__2;
  _invoke.__3 = _invoke__3;
  _invoke.__4 = _invoke__4;
  _invoke.__5 = _invoke__5;
  _invoke.__6 = _invoke__6;
  _invoke.__7 = _invoke__7;
  _invoke.__8 = _invoke__8;
  _invoke.__9 = _invoke__9;
  _invoke.__10 = _invoke__10;
  _invoke.__11 = _invoke__11;
  _invoke.__12 = _invoke__12;
  _invoke.__13 = _invoke__13;
  _invoke.__14 = _invoke__14;
  _invoke.__15 = _invoke__15;
  _invoke.__16 = _invoke__16;
  _invoke.__17 = _invoke__17;
  _invoke.__18 = _invoke__18;
  _invoke.__19 = _invoke__19;
  _invoke.__20 = _invoke__20;
  _invoke.__21 = _invoke__21;
  return _invoke
}();
void 0;
void 0;
cljs.core.ICounted = {};
cljs.core._count = function _count(coll) {
  if(function() {
    var and__3698__auto____14578 = coll;
    if(and__3698__auto____14578) {
      return coll.cljs$core$ICounted$_count__1
    }else {
      return and__3698__auto____14578
    }
  }()) {
    return coll.cljs$core$ICounted$_count__1(coll)
  }else {
    return function() {
      var or__3700__auto____14579 = cljs.core._count[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14579) {
        return or__3700__auto____14579
      }else {
        var or__3700__auto____14580 = cljs.core._count["_"];
        if(or__3700__auto____14580) {
          return or__3700__auto____14580
        }else {
          throw cljs.core.missing_protocol.call(null, "ICounted.-count", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function _empty(coll) {
  if(function() {
    var and__3698__auto____14585 = coll;
    if(and__3698__auto____14585) {
      return coll.cljs$core$IEmptyableCollection$_empty__1
    }else {
      return and__3698__auto____14585
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty__1(coll)
  }else {
    return function() {
      var or__3700__auto____14586 = cljs.core._empty[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14586) {
        return or__3700__auto____14586
      }else {
        var or__3700__auto____14587 = cljs.core._empty["_"];
        if(or__3700__auto____14587) {
          return or__3700__auto____14587
        }else {
          throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ICollection = {};
cljs.core._conj = function _conj(coll, o) {
  if(function() {
    var and__3698__auto____14592 = coll;
    if(and__3698__auto____14592) {
      return coll.cljs$core$ICollection$_conj__2
    }else {
      return and__3698__auto____14592
    }
  }()) {
    return coll.cljs$core$ICollection$_conj__2(coll, o)
  }else {
    return function() {
      var or__3700__auto____14593 = cljs.core._conj[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14593) {
        return or__3700__auto____14593
      }else {
        var or__3700__auto____14594 = cljs.core._conj["_"];
        if(or__3700__auto____14594) {
          return or__3700__auto____14594
        }else {
          throw cljs.core.missing_protocol.call(null, "ICollection.-conj", coll);
        }
      }
    }().call(null, coll, o)
  }
};
void 0;
void 0;
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var _nth = null;
  var _nth__2 = function(coll, n) {
    if(function() {
      var and__3698__auto____14599 = coll;
      if(and__3698__auto____14599) {
        return coll.cljs$core$IIndexed$_nth__2
      }else {
        return and__3698__auto____14599
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth__2(coll, n)
    }else {
      return function() {
        var or__3700__auto____14600 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__3700__auto____14600) {
          return or__3700__auto____14600
        }else {
          var or__3700__auto____14601 = cljs.core._nth["_"];
          if(or__3700__auto____14601) {
            return or__3700__auto____14601
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__3698__auto____14602 = coll;
      if(and__3698__auto____14602) {
        return coll.cljs$core$IIndexed$_nth__3
      }else {
        return and__3698__auto____14602
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth__3(coll, n, not_found)
    }else {
      return function() {
        var or__3700__auto____14603 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__3700__auto____14603) {
          return or__3700__auto____14603
        }else {
          var or__3700__auto____14604 = cljs.core._nth["_"];
          if(or__3700__auto____14604) {
            return or__3700__auto____14604
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n, not_found)
    }
  };
  _nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return _nth__2.call(this, coll, n);
      case 3:
        return _nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _nth.__2 = _nth__2;
  _nth.__3 = _nth__3;
  return _nth
}();
void 0;
void 0;
cljs.core.ISeq = {};
cljs.core._first = function _first(coll) {
  if(function() {
    var and__3698__auto____14613 = coll;
    if(and__3698__auto____14613) {
      return coll.cljs$core$ISeq$_first__1
    }else {
      return and__3698__auto____14613
    }
  }()) {
    return coll.cljs$core$ISeq$_first__1(coll)
  }else {
    return function() {
      var or__3700__auto____14614 = cljs.core._first[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14614) {
        return or__3700__auto____14614
      }else {
        var or__3700__auto____14615 = cljs.core._first["_"];
        if(or__3700__auto____14615) {
          return or__3700__auto____14615
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__3698__auto____14616 = coll;
    if(and__3698__auto____14616) {
      return coll.cljs$core$ISeq$_rest__1
    }else {
      return and__3698__auto____14616
    }
  }()) {
    return coll.cljs$core$ISeq$_rest__1(coll)
  }else {
    return function() {
      var or__3700__auto____14617 = cljs.core._rest[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14617) {
        return or__3700__auto____14617
      }else {
        var or__3700__auto____14618 = cljs.core._rest["_"];
        if(or__3700__auto____14618) {
          return or__3700__auto____14618
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-rest", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var _lookup = null;
  var _lookup__2 = function(o, k) {
    if(function() {
      var and__3698__auto____14627 = o;
      if(and__3698__auto____14627) {
        return o.cljs$core$ILookup$_lookup__2
      }else {
        return and__3698__auto____14627
      }
    }()) {
      return o.cljs$core$ILookup$_lookup__2(o, k)
    }else {
      return function() {
        var or__3700__auto____14628 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__3700__auto____14628) {
          return or__3700__auto____14628
        }else {
          var or__3700__auto____14629 = cljs.core._lookup["_"];
          if(or__3700__auto____14629) {
            return or__3700__auto____14629
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__3698__auto____14630 = o;
      if(and__3698__auto____14630) {
        return o.cljs$core$ILookup$_lookup__3
      }else {
        return and__3698__auto____14630
      }
    }()) {
      return o.cljs$core$ILookup$_lookup__3(o, k, not_found)
    }else {
      return function() {
        var or__3700__auto____14631 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__3700__auto____14631) {
          return or__3700__auto____14631
        }else {
          var or__3700__auto____14632 = cljs.core._lookup["_"];
          if(or__3700__auto____14632) {
            return or__3700__auto____14632
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k, not_found)
    }
  };
  _lookup = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return _lookup__2.call(this, o, k);
      case 3:
        return _lookup__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _lookup.__2 = _lookup__2;
  _lookup.__3 = _lookup__3;
  return _lookup
}();
void 0;
void 0;
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(coll, k) {
  if(function() {
    var and__3698__auto____14641 = coll;
    if(and__3698__auto____14641) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK___2
    }else {
      return and__3698__auto____14641
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK___2(coll, k)
  }else {
    return function() {
      var or__3700__auto____14642 = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14642) {
        return or__3700__auto____14642
      }else {
        var or__3700__auto____14643 = cljs.core._contains_key_QMARK_["_"];
        if(or__3700__auto____14643) {
          return or__3700__auto____14643
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__3698__auto____14644 = coll;
    if(and__3698__auto____14644) {
      return coll.cljs$core$IAssociative$_assoc__3
    }else {
      return and__3698__auto____14644
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc__3(coll, k, v)
  }else {
    return function() {
      var or__3700__auto____14645 = cljs.core._assoc[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14645) {
        return or__3700__auto____14645
      }else {
        var or__3700__auto____14646 = cljs.core._assoc["_"];
        if(or__3700__auto____14646) {
          return or__3700__auto____14646
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", coll);
        }
      }
    }().call(null, coll, k, v)
  }
};
void 0;
void 0;
cljs.core.IMap = {};
cljs.core._dissoc = function _dissoc(coll, k) {
  if(function() {
    var and__3698__auto____14655 = coll;
    if(and__3698__auto____14655) {
      return coll.cljs$core$IMap$_dissoc__2
    }else {
      return and__3698__auto____14655
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc__2(coll, k)
  }else {
    return function() {
      var or__3700__auto____14656 = cljs.core._dissoc[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14656) {
        return or__3700__auto____14656
      }else {
        var or__3700__auto____14657 = cljs.core._dissoc["_"];
        if(or__3700__auto____14657) {
          return or__3700__auto____14657
        }else {
          throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", coll);
        }
      }
    }().call(null, coll, k)
  }
};
void 0;
void 0;
cljs.core.ISet = {};
cljs.core._disjoin = function _disjoin(coll, v) {
  if(function() {
    var and__3698__auto____14662 = coll;
    if(and__3698__auto____14662) {
      return coll.cljs$core$ISet$_disjoin__2
    }else {
      return and__3698__auto____14662
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin__2(coll, v)
  }else {
    return function() {
      var or__3700__auto____14663 = cljs.core._disjoin[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14663) {
        return or__3700__auto____14663
      }else {
        var or__3700__auto____14664 = cljs.core._disjoin["_"];
        if(or__3700__auto____14664) {
          return or__3700__auto____14664
        }else {
          throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", coll);
        }
      }
    }().call(null, coll, v)
  }
};
void 0;
void 0;
cljs.core.IStack = {};
cljs.core._peek = function _peek(coll) {
  if(function() {
    var and__3698__auto____14669 = coll;
    if(and__3698__auto____14669) {
      return coll.cljs$core$IStack$_peek__1
    }else {
      return and__3698__auto____14669
    }
  }()) {
    return coll.cljs$core$IStack$_peek__1(coll)
  }else {
    return function() {
      var or__3700__auto____14670 = cljs.core._peek[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14670) {
        return or__3700__auto____14670
      }else {
        var or__3700__auto____14671 = cljs.core._peek["_"];
        if(or__3700__auto____14671) {
          return or__3700__auto____14671
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__3698__auto____14672 = coll;
    if(and__3698__auto____14672) {
      return coll.cljs$core$IStack$_pop__1
    }else {
      return and__3698__auto____14672
    }
  }()) {
    return coll.cljs$core$IStack$_pop__1(coll)
  }else {
    return function() {
      var or__3700__auto____14673 = cljs.core._pop[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14673) {
        return or__3700__auto____14673
      }else {
        var or__3700__auto____14674 = cljs.core._pop["_"];
        if(or__3700__auto____14674) {
          return or__3700__auto____14674
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-pop", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.IVector = {};
cljs.core._assoc_n = function _assoc_n(coll, n, val) {
  if(function() {
    var and__3698__auto____14683 = coll;
    if(and__3698__auto____14683) {
      return coll.cljs$core$IVector$_assoc_n__3
    }else {
      return and__3698__auto____14683
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n__3(coll, n, val)
  }else {
    return function() {
      var or__3700__auto____14684 = cljs.core._assoc_n[goog.typeOf.call(null, coll)];
      if(or__3700__auto____14684) {
        return or__3700__auto____14684
      }else {
        var or__3700__auto____14685 = cljs.core._assoc_n["_"];
        if(or__3700__auto____14685) {
          return or__3700__auto____14685
        }else {
          throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", coll);
        }
      }
    }().call(null, coll, n, val)
  }
};
void 0;
void 0;
cljs.core.IDeref = {};
cljs.core._deref = function _deref(o) {
  if(function() {
    var and__3698__auto____14690 = o;
    if(and__3698__auto____14690) {
      return o.cljs$core$IDeref$_deref__1
    }else {
      return and__3698__auto____14690
    }
  }()) {
    return o.cljs$core$IDeref$_deref__1(o)
  }else {
    return function() {
      var or__3700__auto____14691 = cljs.core._deref[goog.typeOf.call(null, o)];
      if(or__3700__auto____14691) {
        return or__3700__auto____14691
      }else {
        var or__3700__auto____14692 = cljs.core._deref["_"];
        if(or__3700__auto____14692) {
          return or__3700__auto____14692
        }else {
          throw cljs.core.missing_protocol.call(null, "IDeref.-deref", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function _deref_with_timeout(o, msec, timeout_val) {
  if(function() {
    var and__3698__auto____14697 = o;
    if(and__3698__auto____14697) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout__3
    }else {
      return and__3698__auto____14697
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout__3(o, msec, timeout_val)
  }else {
    return function() {
      var or__3700__auto____14698 = cljs.core._deref_with_timeout[goog.typeOf.call(null, o)];
      if(or__3700__auto____14698) {
        return or__3700__auto____14698
      }else {
        var or__3700__auto____14699 = cljs.core._deref_with_timeout["_"];
        if(or__3700__auto____14699) {
          return or__3700__auto____14699
        }else {
          throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", o);
        }
      }
    }().call(null, o, msec, timeout_val)
  }
};
void 0;
void 0;
cljs.core.IMeta = {};
cljs.core._meta = function _meta(o) {
  if(function() {
    var and__3698__auto____14704 = o;
    if(and__3698__auto____14704) {
      return o.cljs$core$IMeta$_meta__1
    }else {
      return and__3698__auto____14704
    }
  }()) {
    return o.cljs$core$IMeta$_meta__1(o)
  }else {
    return function() {
      var or__3700__auto____14705 = cljs.core._meta[goog.typeOf.call(null, o)];
      if(or__3700__auto____14705) {
        return or__3700__auto____14705
      }else {
        var or__3700__auto____14706 = cljs.core._meta["_"];
        if(or__3700__auto____14706) {
          return or__3700__auto____14706
        }else {
          throw cljs.core.missing_protocol.call(null, "IMeta.-meta", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.IWithMeta = {};
cljs.core._with_meta = function _with_meta(o, meta) {
  if(function() {
    var and__3698__auto____14711 = o;
    if(and__3698__auto____14711) {
      return o.cljs$core$IWithMeta$_with_meta__2
    }else {
      return and__3698__auto____14711
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta__2(o, meta)
  }else {
    return function() {
      var or__3700__auto____14712 = cljs.core._with_meta[goog.typeOf.call(null, o)];
      if(or__3700__auto____14712) {
        return or__3700__auto____14712
      }else {
        var or__3700__auto____14713 = cljs.core._with_meta["_"];
        if(or__3700__auto____14713) {
          return or__3700__auto____14713
        }else {
          throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", o);
        }
      }
    }().call(null, o, meta)
  }
};
void 0;
void 0;
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var _reduce = null;
  var _reduce__2 = function(coll, f) {
    if(function() {
      var and__3698__auto____14718 = coll;
      if(and__3698__auto____14718) {
        return coll.cljs$core$IReduce$_reduce__2
      }else {
        return and__3698__auto____14718
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce__2(coll, f)
    }else {
      return function() {
        var or__3700__auto____14719 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__3700__auto____14719) {
          return or__3700__auto____14719
        }else {
          var or__3700__auto____14720 = cljs.core._reduce["_"];
          if(or__3700__auto____14720) {
            return or__3700__auto____14720
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__3698__auto____14721 = coll;
      if(and__3698__auto____14721) {
        return coll.cljs$core$IReduce$_reduce__3
      }else {
        return and__3698__auto____14721
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce__3(coll, f, start)
    }else {
      return function() {
        var or__3700__auto____14722 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__3700__auto____14722) {
          return or__3700__auto____14722
        }else {
          var or__3700__auto____14723 = cljs.core._reduce["_"];
          if(or__3700__auto____14723) {
            return or__3700__auto____14723
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f, start)
    }
  };
  _reduce = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return _reduce__2.call(this, coll, f);
      case 3:
        return _reduce__3.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _reduce.__2 = _reduce__2;
  _reduce.__3 = _reduce__3;
  return _reduce
}();
void 0;
void 0;
cljs.core.IEquiv = {};
cljs.core._equiv = function _equiv(o, other) {
  if(function() {
    var and__3698__auto____14732 = o;
    if(and__3698__auto____14732) {
      return o.cljs$core$IEquiv$_equiv__2
    }else {
      return and__3698__auto____14732
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv__2(o, other)
  }else {
    return function() {
      var or__3700__auto____14733 = cljs.core._equiv[goog.typeOf.call(null, o)];
      if(or__3700__auto____14733) {
        return or__3700__auto____14733
      }else {
        var or__3700__auto____14734 = cljs.core._equiv["_"];
        if(or__3700__auto____14734) {
          return or__3700__auto____14734
        }else {
          throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", o);
        }
      }
    }().call(null, o, other)
  }
};
void 0;
void 0;
cljs.core.IHash = {};
cljs.core._hash = function _hash(o) {
  if(function() {
    var and__3698__auto____14739 = o;
    if(and__3698__auto____14739) {
      return o.cljs$core$IHash$_hash__1
    }else {
      return and__3698__auto____14739
    }
  }()) {
    return o.cljs$core$IHash$_hash__1(o)
  }else {
    return function() {
      var or__3700__auto____14740 = cljs.core._hash[goog.typeOf.call(null, o)];
      if(or__3700__auto____14740) {
        return or__3700__auto____14740
      }else {
        var or__3700__auto____14741 = cljs.core._hash["_"];
        if(or__3700__auto____14741) {
          return or__3700__auto____14741
        }else {
          throw cljs.core.missing_protocol.call(null, "IHash.-hash", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.ISeqable = {};
cljs.core._seq = function _seq(o) {
  if(function() {
    var and__3698__auto____14746 = o;
    if(and__3698__auto____14746) {
      return o.cljs$core$ISeqable$_seq__1
    }else {
      return and__3698__auto____14746
    }
  }()) {
    return o.cljs$core$ISeqable$_seq__1(o)
  }else {
    return function() {
      var or__3700__auto____14747 = cljs.core._seq[goog.typeOf.call(null, o)];
      if(or__3700__auto____14747) {
        return or__3700__auto____14747
      }else {
        var or__3700__auto____14748 = cljs.core._seq["_"];
        if(or__3700__auto____14748) {
          return or__3700__auto____14748
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.ISequential = {};
void 0;
void 0;
cljs.core.IRecord = {};
void 0;
void 0;
cljs.core.IPrintable = {};
cljs.core._pr_seq = function _pr_seq(o, opts) {
  if(function() {
    var and__3698__auto____14753 = o;
    if(and__3698__auto____14753) {
      return o.cljs$core$IPrintable$_pr_seq__2
    }else {
      return and__3698__auto____14753
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq__2(o, opts)
  }else {
    return function() {
      var or__3700__auto____14754 = cljs.core._pr_seq[goog.typeOf.call(null, o)];
      if(or__3700__auto____14754) {
        return or__3700__auto____14754
      }else {
        var or__3700__auto____14755 = cljs.core._pr_seq["_"];
        if(or__3700__auto____14755) {
          return or__3700__auto____14755
        }else {
          throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", o);
        }
      }
    }().call(null, o, opts)
  }
};
void 0;
void 0;
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function _realized_QMARK_(d) {
  if(function() {
    var and__3698__auto____14760 = d;
    if(and__3698__auto____14760) {
      return d.cljs$core$IPending$_realized_QMARK___1
    }else {
      return and__3698__auto____14760
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK___1(d)
  }else {
    return function() {
      var or__3700__auto____14761 = cljs.core._realized_QMARK_[goog.typeOf.call(null, d)];
      if(or__3700__auto____14761) {
        return or__3700__auto____14761
      }else {
        var or__3700__auto____14762 = cljs.core._realized_QMARK_["_"];
        if(or__3700__auto____14762) {
          return or__3700__auto____14762
        }else {
          throw cljs.core.missing_protocol.call(null, "IPending.-realized?", d);
        }
      }
    }().call(null, d)
  }
};
void 0;
void 0;
cljs.core.IWatchable = {};
cljs.core._notify_watches = function _notify_watches(this$, oldval, newval) {
  if(function() {
    var and__3698__auto____14767 = this$;
    if(and__3698__auto____14767) {
      return this$.cljs$core$IWatchable$_notify_watches__3
    }else {
      return and__3698__auto____14767
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches__3(this$, oldval, newval)
  }else {
    return function() {
      var or__3700__auto____14768 = cljs.core._notify_watches[goog.typeOf.call(null, this$)];
      if(or__3700__auto____14768) {
        return or__3700__auto____14768
      }else {
        var or__3700__auto____14769 = cljs.core._notify_watches["_"];
        if(or__3700__auto____14769) {
          return or__3700__auto____14769
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__3698__auto____14770 = this$;
    if(and__3698__auto____14770) {
      return this$.cljs$core$IWatchable$_add_watch__3
    }else {
      return and__3698__auto____14770
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch__3(this$, key, f)
  }else {
    return function() {
      var or__3700__auto____14771 = cljs.core._add_watch[goog.typeOf.call(null, this$)];
      if(or__3700__auto____14771) {
        return or__3700__auto____14771
      }else {
        var or__3700__auto____14772 = cljs.core._add_watch["_"];
        if(or__3700__auto____14772) {
          return or__3700__auto____14772
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__3698__auto____14773 = this$;
    if(and__3698__auto____14773) {
      return this$.cljs$core$IWatchable$_remove_watch__2
    }else {
      return and__3698__auto____14773
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch__2(this$, key)
  }else {
    return function() {
      var or__3700__auto____14774 = cljs.core._remove_watch[goog.typeOf.call(null, this$)];
      if(or__3700__auto____14774) {
        return or__3700__auto____14774
      }else {
        var or__3700__auto____14775 = cljs.core._remove_watch["_"];
        if(or__3700__auto____14775) {
          return or__3700__auto____14775
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", this$);
        }
      }
    }().call(null, this$, key)
  }
};
void 0;
cljs.core.identical_QMARK_ = function identical_QMARK_(x, y) {
  return x === y
};
cljs.core._EQ_ = function _EQ_(x, y) {
  return cljs.core._equiv(x, y)
};
cljs.core.nil_QMARK_ = function nil_QMARK_(x) {
  return x === null
};
cljs.core.type = function type(x) {
  return x.constructor
};
void 0;
void 0;
void 0;
cljs.core.IHash["null"] = true;
cljs.core._hash["null"] = function(o) {
  return 0
};
cljs.core.ILookup["null"] = true;
cljs.core._lookup["null"] = function() {
  var G__14788 = null;
  var G__14788__2 = function(o, k) {
    return null
  };
  var G__14788__3 = function(o, k, not_found) {
    return not_found
  };
  G__14788 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__14788__2.call(this, o, k);
      case 3:
        return G__14788__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14788
}();
cljs.core.IAssociative["null"] = true;
cljs.core._assoc["null"] = function(_, k, v) {
  return cljs.core.hash_map(k, v)
};
cljs.core.ICollection["null"] = true;
cljs.core._conj["null"] = function(_, o) {
  return cljs.core.list(o)
};
cljs.core.IReduce["null"] = true;
cljs.core._reduce["null"] = function() {
  var G__14789 = null;
  var G__14789__2 = function(_, f) {
    return f.call(null)
  };
  var G__14789__3 = function(_, f, start) {
    return start
  };
  G__14789 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__14789__2.call(this, _, f);
      case 3:
        return G__14789__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14789
}();
cljs.core.IPrintable["null"] = true;
cljs.core._pr_seq["null"] = function(o) {
  return cljs.core.list("nil")
};
cljs.core.ISet["null"] = true;
cljs.core._disjoin["null"] = function(_, v) {
  return null
};
cljs.core.ICounted["null"] = true;
cljs.core._count["null"] = function(_) {
  return 0
};
cljs.core.IStack["null"] = true;
cljs.core._peek["null"] = function(_) {
  return null
};
cljs.core._pop["null"] = function(_) {
  return null
};
cljs.core.ISeq["null"] = true;
cljs.core._first["null"] = function(_) {
  return null
};
cljs.core._rest["null"] = function(_) {
  return cljs.core.list()
};
cljs.core.IEquiv["null"] = true;
cljs.core._equiv["null"] = function(_, o) {
  return o === null
};
cljs.core.IWithMeta["null"] = true;
cljs.core._with_meta["null"] = function(_, meta) {
  return null
};
cljs.core.IMeta["null"] = true;
cljs.core._meta["null"] = function(_) {
  return null
};
cljs.core.IIndexed["null"] = true;
cljs.core._nth["null"] = function() {
  var G__14790 = null;
  var G__14790__2 = function(_, n) {
    return null
  };
  var G__14790__3 = function(_, n, not_found) {
    return not_found
  };
  G__14790 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__14790__2.call(this, _, n);
      case 3:
        return G__14790__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14790
}();
cljs.core.IEmptyableCollection["null"] = true;
cljs.core._empty["null"] = function(_) {
  return null
};
cljs.core.IMap["null"] = true;
cljs.core._dissoc["null"] = function(_, k) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv__2 = function(o, other) {
  return o.toString() === other.toString()
};
cljs.core.IHash["number"] = true;
cljs.core._hash["number"] = function(o) {
  return o
};
cljs.core.IEquiv["number"] = true;
cljs.core._equiv["number"] = function(x, o) {
  return x === o
};
cljs.core.IHash["boolean"] = true;
cljs.core._hash["boolean"] = function(o) {
  return o === true ? 1 : 0
};
cljs.core.IHash["function"] = true;
cljs.core._hash["function"] = function(o) {
  return goog.getUid.call(null, o)
};
cljs.core.inc = function inc(x) {
  return x + 1
};
cljs.core.ci_reduce = function() {
  var ci_reduce = null;
  var ci_reduce__2 = function(cicoll, f) {
    if(cljs.core.truth_(cljs.core._EQ_(0, cljs.core._count(cicoll)))) {
      return f.call(null)
    }else {
      var val__14791 = cljs.core._nth.__2(cicoll, 0);
      var n__14792 = 1;
      while(true) {
        if(n__14792 < cljs.core._count(cicoll)) {
          var G__14799 = f.call(null, val__14791, cljs.core._nth.__2(cicoll, n__14792));
          var G__14800 = n__14792 + 1;
          val__14791 = G__14799;
          n__14792 = G__14800;
          continue
        }else {
          return val__14791
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var val__14793 = val;
    var n__14794 = 0;
    while(true) {
      if(n__14794 < cljs.core._count(cicoll)) {
        var G__14802 = f.call(null, val__14793, cljs.core._nth.__2(cicoll, n__14794));
        var G__14803 = n__14794 + 1;
        val__14793 = G__14802;
        n__14794 = G__14803;
        continue
      }else {
        return val__14793
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var val__14795 = val;
    var n__14796 = idx;
    while(true) {
      if(n__14796 < cljs.core._count(cicoll)) {
        var G__14805 = f.call(null, val__14795, cljs.core._nth.__2(cicoll, n__14796));
        var G__14806 = n__14796 + 1;
        val__14795 = G__14805;
        n__14796 = G__14806;
        continue
      }else {
        return val__14795
      }
      break
    }
  };
  ci_reduce = function(cicoll, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return ci_reduce__2.call(this, cicoll, f);
      case 3:
        return ci_reduce__3.call(this, cicoll, f, val);
      case 4:
        return ci_reduce__4.call(this, cicoll, f, val, idx)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ci_reduce.__2 = ci_reduce__2;
  ci_reduce.__3 = ci_reduce__3;
  ci_reduce.__4 = ci_reduce__4;
  return ci_reduce
}();
void 0;
void 0;
cljs.core.IndexedSeq = function(a, i) {
  this.a = a;
  this.i = i
};
cljs.core.IndexedSeq.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__14807 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce__2 = function(_, f) {
  var this__14808 = this;
  return cljs.core.ci_reduce.__4(this__14808.a, f, this__14808.a[this__14808.i], this__14808.i + 1)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce__3 = function(_, f, start) {
  var this__14809 = this;
  return cljs.core.ci_reduce.__4(this__14809.a, f, start, this__14809.i)
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__14810 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__14811 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__14812 = this;
  var i__14813 = n + this__14812.i;
  if(i__14813 < this__14812.a.length) {
    return this__14812.a[i__14813]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__14814 = this;
  var i__14815 = n + this__14814.i;
  if(i__14815 < this__14814.a.length) {
    return this__14814.a[i__14815]
  }else {
    return not_found
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count__1 = function(_) {
  var this__14816 = this;
  return this__14816.a.length - this__14816.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first__1 = function(_) {
  var this__14817 = this;
  return this__14817.a[this__14817.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest__1 = function(_) {
  var this__14818 = this;
  if(this__14818.i + 1 < this__14818.a.length) {
    return new cljs.core.IndexedSeq(this__14818.a, this__14818.i + 1)
  }else {
    return cljs.core.list()
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq__1 = function(this$) {
  var this__14819 = this;
  return this$
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function prim_seq(prim, i) {
  if(cljs.core.truth_(cljs.core._EQ_(0, prim.length))) {
    return null
  }else {
    return new cljs.core.IndexedSeq(prim, i)
  }
};
cljs.core.array_seq = function array_seq(array, i) {
  return cljs.core.prim_seq(array, i)
};
cljs.core.IReduce["array"] = true;
cljs.core._reduce["array"] = function() {
  var G__14824 = null;
  var G__14824__2 = function(array, f) {
    return cljs.core.ci_reduce.__2(array, f)
  };
  var G__14824__3 = function(array, f, start) {
    return cljs.core.ci_reduce.__3(array, f, start)
  };
  G__14824 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__14824__2.call(this, array, f);
      case 3:
        return G__14824__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14824
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__14825 = null;
  var G__14825__2 = function(array, k) {
    return array[k]
  };
  var G__14825__3 = function(array, k, not_found) {
    return cljs.core._nth.__3(array, k, not_found)
  };
  G__14825 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__14825__2.call(this, array, k);
      case 3:
        return G__14825__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14825
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__14826 = null;
  var G__14826__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__14826__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__14826 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__14826__2.call(this, array, n);
      case 3:
        return G__14826__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14826
}();
cljs.core.ICounted["array"] = true;
cljs.core._count["array"] = function(a) {
  return a.length
};
cljs.core.ISeqable["array"] = true;
cljs.core._seq["array"] = function(array) {
  return cljs.core.array_seq(array, 0)
};
cljs.core.seq = function seq(coll) {
  if(cljs.core.truth_(coll)) {
    return cljs.core._seq(coll)
  }else {
    return null
  }
};
cljs.core.first = function first(coll) {
  var temp__3850__auto____14830 = cljs.core.seq(coll);
  if(cljs.core.truth_(temp__3850__auto____14830)) {
    var s__14831 = temp__3850__auto____14830;
    return cljs.core._first(s__14831)
  }else {
    return null
  }
};
cljs.core.rest = function rest(coll) {
  return cljs.core._rest(cljs.core.seq(coll))
};
cljs.core.next = function next(coll) {
  if(cljs.core.truth_(coll)) {
    return cljs.core.seq(cljs.core.rest(coll))
  }else {
    return null
  }
};
cljs.core.second = function second(coll) {
  return cljs.core.first(cljs.core.next(coll))
};
cljs.core.ffirst = function ffirst(coll) {
  return cljs.core.first(cljs.core.first(coll))
};
cljs.core.nfirst = function nfirst(coll) {
  return cljs.core.next(cljs.core.first(coll))
};
cljs.core.fnext = function fnext(coll) {
  return cljs.core.first(cljs.core.next(coll))
};
cljs.core.nnext = function nnext(coll) {
  return cljs.core.next(cljs.core.next(coll))
};
cljs.core.last = function last(s) {
  while(true) {
    if(cljs.core.truth_(cljs.core.next(s))) {
      var G__14835 = cljs.core.next(s);
      s = G__14835;
      continue
    }else {
      return cljs.core.first(s)
    }
    break
  }
};
cljs.core.ICounted["_"] = true;
cljs.core._count["_"] = function(x) {
  var s__14836 = cljs.core.seq(x);
  var n__14837 = 0;
  while(true) {
    if(cljs.core.truth_(s__14836)) {
      var G__14839 = cljs.core.next(s__14836);
      var G__14840 = n__14837 + 1;
      s__14836 = G__14839;
      n__14837 = G__14840;
      continue
    }else {
      return n__14837
    }
    break
  }
};
cljs.core.IEquiv["_"] = true;
cljs.core._equiv["_"] = function(x, o) {
  return x === o
};
cljs.core.not = function not(x) {
  if(cljs.core.truth_(x)) {
    return false
  }else {
    return true
  }
};
cljs.core.conj = function() {
  var conj = null;
  var conj__2 = function(coll, x) {
    return cljs.core._conj(coll, x)
  };
  var conj__3 = function() {
    var G__14842__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__14844 = conj.call(null, coll, x);
          var G__14845 = cljs.core.first(xs);
          var G__14846 = cljs.core.next(xs);
          coll = G__14844;
          x = G__14845;
          xs = G__14846;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__14842 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14842__delegate.call(this, coll, x, xs)
    };
    G__14842.cljs$lang$maxFixedArity = 2;
    G__14842.cljs$lang$applyTo = function(arglist__14847) {
      var coll = cljs.core.first(arglist__14847);
      var x = cljs.core.first(cljs.core.next(arglist__14847));
      var xs = cljs.core.rest(cljs.core.next(arglist__14847));
      return G__14842__delegate.call(this, coll, x, xs)
    };
    return G__14842
  }();
  conj = function(coll, x, var_args) {
    var xs = var_args;
    switch(arguments.length) {
      case 2:
        return conj__2.call(this, coll, x);
      default:
        return conj__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  conj.cljs$lang$maxFixedArity = 2;
  conj.cljs$lang$applyTo = conj__3.cljs$lang$applyTo;
  conj.__2 = conj__2;
  conj.__3 = conj__3;
  return conj
}();
cljs.core.empty = function empty(coll) {
  return cljs.core._empty(coll)
};
cljs.core.count = function count(coll) {
  return cljs.core._count(coll)
};
cljs.core.nth = function() {
  var nth = null;
  var nth__2 = function(coll, n) {
    return cljs.core._nth.__2(coll, Math.floor(n))
  };
  var nth__3 = function(coll, n, not_found) {
    return cljs.core._nth.__3(coll, Math.floor(n), not_found)
  };
  nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return nth__2.call(this, coll, n);
      case 3:
        return nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  nth.__2 = nth__2;
  nth.__3 = nth__3;
  return nth
}();
cljs.core.get = function() {
  var get = null;
  var get__2 = function(o, k) {
    return cljs.core._lookup.__2(o, k)
  };
  var get__3 = function(o, k, not_found) {
    return cljs.core._lookup.__3(o, k, not_found)
  };
  get = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return get__2.call(this, o, k);
      case 3:
        return get__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get.__2 = get__2;
  get.__3 = get__3;
  return get
}();
cljs.core.assoc = function() {
  var assoc = null;
  var assoc__3 = function(coll, k, v) {
    return cljs.core._assoc(coll, k, v)
  };
  var assoc__4 = function() {
    var G__14849__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__14848 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__14851 = ret__14848;
          var G__14852 = cljs.core.first(kvs);
          var G__14853 = cljs.core.second(kvs);
          var G__14854 = cljs.core.nnext(kvs);
          coll = G__14851;
          k = G__14852;
          v = G__14853;
          kvs = G__14854;
          continue
        }else {
          return ret__14848
        }
        break
      }
    };
    var G__14849 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__14849__delegate.call(this, coll, k, v, kvs)
    };
    G__14849.cljs$lang$maxFixedArity = 3;
    G__14849.cljs$lang$applyTo = function(arglist__14855) {
      var coll = cljs.core.first(arglist__14855);
      var k = cljs.core.first(cljs.core.next(arglist__14855));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__14855)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__14855)));
      return G__14849__delegate.call(this, coll, k, v, kvs)
    };
    return G__14849
  }();
  assoc = function(coll, k, v, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc__3.call(this, coll, k, v);
      default:
        return assoc__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  assoc.cljs$lang$maxFixedArity = 3;
  assoc.cljs$lang$applyTo = assoc__4.cljs$lang$applyTo;
  assoc.__3 = assoc__3;
  assoc.__4 = assoc__4;
  return assoc
}();
cljs.core.dissoc = function() {
  var dissoc = null;
  var dissoc__1 = function(coll) {
    return coll
  };
  var dissoc__2 = function(coll, k) {
    return cljs.core._dissoc(coll, k)
  };
  var dissoc__3 = function() {
    var G__14857__delegate = function(coll, k, ks) {
      while(true) {
        var ret__14856 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__14859 = ret__14856;
          var G__14860 = cljs.core.first(ks);
          var G__14861 = cljs.core.next(ks);
          coll = G__14859;
          k = G__14860;
          ks = G__14861;
          continue
        }else {
          return ret__14856
        }
        break
      }
    };
    var G__14857 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14857__delegate.call(this, coll, k, ks)
    };
    G__14857.cljs$lang$maxFixedArity = 2;
    G__14857.cljs$lang$applyTo = function(arglist__14862) {
      var coll = cljs.core.first(arglist__14862);
      var k = cljs.core.first(cljs.core.next(arglist__14862));
      var ks = cljs.core.rest(cljs.core.next(arglist__14862));
      return G__14857__delegate.call(this, coll, k, ks)
    };
    return G__14857
  }();
  dissoc = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return dissoc__1.call(this, coll);
      case 2:
        return dissoc__2.call(this, coll, k);
      default:
        return dissoc__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  dissoc.cljs$lang$maxFixedArity = 2;
  dissoc.cljs$lang$applyTo = dissoc__3.cljs$lang$applyTo;
  dissoc.__1 = dissoc__1;
  dissoc.__2 = dissoc__2;
  dissoc.__3 = dissoc__3;
  return dissoc
}();
cljs.core.with_meta = function with_meta(o, meta) {
  return cljs.core._with_meta(o, meta)
};
cljs.core.meta = function meta(o) {
  if(cljs.core.truth_(function() {
    var x__457__auto____14863 = o;
    if(cljs.core.truth_(function() {
      var and__3698__auto____14864 = x__457__auto____14863;
      if(cljs.core.truth_(and__3698__auto____14864)) {
        var and__3698__auto____14865 = x__457__auto____14863.cljs$core$IMeta$;
        if(cljs.core.truth_(and__3698__auto____14865)) {
          return cljs.core.not.call(null, x__457__auto____14863.hasOwnProperty("cljs$core$IMeta$"))
        }else {
          return and__3698__auto____14865
        }
      }else {
        return and__3698__auto____14864
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__457__auto____14863)
    }
  }())) {
    return cljs.core._meta(o)
  }else {
    return null
  }
};
cljs.core.peek = function peek(coll) {
  return cljs.core._peek(coll)
};
cljs.core.pop = function pop(coll) {
  return cljs.core._pop(coll)
};
cljs.core.disj = function() {
  var disj = null;
  var disj__1 = function(coll) {
    return coll
  };
  var disj__2 = function(coll, k) {
    return cljs.core._disjoin(coll, k)
  };
  var disj__3 = function() {
    var G__14871__delegate = function(coll, k, ks) {
      while(true) {
        var ret__14870 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__14873 = ret__14870;
          var G__14874 = cljs.core.first(ks);
          var G__14875 = cljs.core.next(ks);
          coll = G__14873;
          k = G__14874;
          ks = G__14875;
          continue
        }else {
          return ret__14870
        }
        break
      }
    };
    var G__14871 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14871__delegate.call(this, coll, k, ks)
    };
    G__14871.cljs$lang$maxFixedArity = 2;
    G__14871.cljs$lang$applyTo = function(arglist__14876) {
      var coll = cljs.core.first(arglist__14876);
      var k = cljs.core.first(cljs.core.next(arglist__14876));
      var ks = cljs.core.rest(cljs.core.next(arglist__14876));
      return G__14871__delegate.call(this, coll, k, ks)
    };
    return G__14871
  }();
  disj = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return disj__1.call(this, coll);
      case 2:
        return disj__2.call(this, coll, k);
      default:
        return disj__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  disj.cljs$lang$maxFixedArity = 2;
  disj.cljs$lang$applyTo = disj__3.cljs$lang$applyTo;
  disj.__1 = disj__1;
  disj.__2 = disj__2;
  disj.__3 = disj__3;
  return disj
}();
cljs.core.hash = function hash(o) {
  return cljs.core._hash(o)
};
cljs.core.empty_QMARK_ = function empty_QMARK_(coll) {
  return cljs.core.not(cljs.core.seq(coll))
};
cljs.core.coll_QMARK_ = function coll_QMARK_(x) {
  if(x === null) {
    return false
  }else {
    var x__457__auto____14877 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____14878 = x__457__auto____14877;
      if(cljs.core.truth_(and__3698__auto____14878)) {
        var and__3698__auto____14879 = x__457__auto____14877.cljs$core$ICollection$;
        if(cljs.core.truth_(and__3698__auto____14879)) {
          return cljs.core.not.call(null, x__457__auto____14877.hasOwnProperty("cljs$core$ICollection$"))
        }else {
          return and__3698__auto____14879
        }
      }else {
        return and__3698__auto____14878
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, x__457__auto____14877)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x === null) {
    return false
  }else {
    var x__457__auto____14884 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____14885 = x__457__auto____14884;
      if(cljs.core.truth_(and__3698__auto____14885)) {
        var and__3698__auto____14886 = x__457__auto____14884.cljs$core$ISet$;
        if(cljs.core.truth_(and__3698__auto____14886)) {
          return cljs.core.not.call(null, x__457__auto____14884.hasOwnProperty("cljs$core$ISet$"))
        }else {
          return and__3698__auto____14886
        }
      }else {
        return and__3698__auto____14885
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, x__457__auto____14884)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var x__457__auto____14891 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____14892 = x__457__auto____14891;
    if(cljs.core.truth_(and__3698__auto____14892)) {
      var and__3698__auto____14893 = x__457__auto____14891.cljs$core$IAssociative$;
      if(cljs.core.truth_(and__3698__auto____14893)) {
        return cljs.core.not.call(null, x__457__auto____14891.hasOwnProperty("cljs$core$IAssociative$"))
      }else {
        return and__3698__auto____14893
      }
    }else {
      return and__3698__auto____14892
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, x__457__auto____14891)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var x__457__auto____14897 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____14898 = x__457__auto____14897;
    if(cljs.core.truth_(and__3698__auto____14898)) {
      var and__3698__auto____14899 = x__457__auto____14897.cljs$core$ISequential$;
      if(cljs.core.truth_(and__3698__auto____14899)) {
        return cljs.core.not.call(null, x__457__auto____14897.hasOwnProperty("cljs$core$ISequential$"))
      }else {
        return and__3698__auto____14899
      }
    }else {
      return and__3698__auto____14898
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, x__457__auto____14897)
  }
};
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var x__457__auto____14903 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____14904 = x__457__auto____14903;
    if(cljs.core.truth_(and__3698__auto____14904)) {
      var and__3698__auto____14905 = x__457__auto____14903.cljs$core$ICounted$;
      if(cljs.core.truth_(and__3698__auto____14905)) {
        return cljs.core.not.call(null, x__457__auto____14903.hasOwnProperty("cljs$core$ICounted$"))
      }else {
        return and__3698__auto____14905
      }
    }else {
      return and__3698__auto____14904
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, x__457__auto____14903)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x === null) {
    return false
  }else {
    var x__457__auto____14909 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____14910 = x__457__auto____14909;
      if(cljs.core.truth_(and__3698__auto____14910)) {
        var and__3698__auto____14911 = x__457__auto____14909.cljs$core$IMap$;
        if(cljs.core.truth_(and__3698__auto____14911)) {
          return cljs.core.not.call(null, x__457__auto____14909.hasOwnProperty("cljs$core$IMap$"))
        }else {
          return and__3698__auto____14911
        }
      }else {
        return and__3698__auto____14910
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, x__457__auto____14909)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var x__457__auto____14916 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____14917 = x__457__auto____14916;
    if(cljs.core.truth_(and__3698__auto____14917)) {
      var and__3698__auto____14918 = x__457__auto____14916.cljs$core$IVector$;
      if(cljs.core.truth_(and__3698__auto____14918)) {
        return cljs.core.not.call(null, x__457__auto____14916.hasOwnProperty("cljs$core$IVector$"))
      }else {
        return and__3698__auto____14918
      }
    }else {
      return and__3698__auto____14917
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, x__457__auto____14916)
  }
};
cljs.core.js_obj = function js_obj() {
  return{}
};
cljs.core.js_keys = function js_keys(obj) {
  var keys__14922 = [];
  goog.object.forEach.call(null, obj, function(val, key, obj) {
    return keys__14922.push(key)
  });
  return keys__14922
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.lookup_sentinel = cljs.core.js_obj();
cljs.core.false_QMARK_ = function false_QMARK_(x) {
  return x === false
};
cljs.core.true_QMARK_ = function true_QMARK_(x) {
  return x === true
};
cljs.core.undefined_QMARK_ = function undefined_QMARK_(x) {
  return void 0 === x
};
cljs.core.instance_QMARK_ = function instance_QMARK_(t, o) {
  return o != null && (o instanceof t || o.constructor === t || t === Object)
};
cljs.core.seq_QMARK_ = function seq_QMARK_(s) {
  if(s === null) {
    return false
  }else {
    var x__457__auto____14923 = s;
    if(cljs.core.truth_(function() {
      var and__3698__auto____14924 = x__457__auto____14923;
      if(cljs.core.truth_(and__3698__auto____14924)) {
        var and__3698__auto____14925 = x__457__auto____14923.cljs$core$ISeq$;
        if(cljs.core.truth_(and__3698__auto____14925)) {
          return cljs.core.not.call(null, x__457__auto____14923.hasOwnProperty("cljs$core$ISeq$"))
        }else {
          return and__3698__auto____14925
        }
      }else {
        return and__3698__auto____14924
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, x__457__auto____14923)
    }
  }
};
cljs.core.boolean$ = function boolean$(x) {
  if(cljs.core.truth_(x)) {
    return true
  }else {
    return false
  }
};
cljs.core.string_QMARK_ = function string_QMARK_(x) {
  var and__3698__auto____14931 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____14931)) {
    return cljs.core.not(function() {
      var or__3700__auto____14932 = cljs.core._EQ_(x.charAt(0), "\ufdd0");
      if(cljs.core.truth_(or__3700__auto____14932)) {
        return or__3700__auto____14932
      }else {
        return cljs.core._EQ_(x.charAt(0), "\ufdd1")
      }
    }())
  }else {
    return and__3698__auto____14931
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__3698__auto____14935 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____14935)) {
    return cljs.core._EQ_(x.charAt(0), "\ufdd0")
  }else {
    return and__3698__auto____14935
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__3698__auto____14937 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____14937)) {
    return cljs.core._EQ_(x.charAt(0), "\ufdd1")
  }else {
    return and__3698__auto____14937
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber.call(null, n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction.call(null, f)
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__3698__auto____14939 = cljs.core.number_QMARK_(n);
  if(cljs.core.truth_(and__3698__auto____14939)) {
    return n == n.toFixed()
  }else {
    return and__3698__auto____14939
  }
};
cljs.core.contains_QMARK_ = function contains_QMARK_(coll, v) {
  if(cljs.core._lookup.__3(coll, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return false
  }else {
    return true
  }
};
cljs.core.find = function find(coll, k) {
  if(cljs.core.truth_(function() {
    var and__3698__auto____14942 = coll;
    if(cljs.core.truth_(and__3698__auto____14942)) {
      var and__3698__auto____14943 = cljs.core.associative_QMARK_(coll);
      if(cljs.core.truth_(and__3698__auto____14943)) {
        return cljs.core.contains_QMARK_(coll, k)
      }else {
        return and__3698__auto____14943
      }
    }else {
      return and__3698__auto____14942
    }
  }())) {
    return cljs.core.PersistentVector.fromArray([k, cljs.core._lookup.__2(coll, k)])
  }else {
    return null
  }
};
cljs.core.distinct_QMARK_ = function() {
  var distinct_QMARK_ = null;
  var distinct_QMARK___1 = function(x) {
    return true
  };
  var distinct_QMARK___2 = function(x, y) {
    return cljs.core.not(cljs.core._EQ_(x, y))
  };
  var distinct_QMARK___3 = function() {
    var G__14951__delegate = function(x, y, more) {
      if(cljs.core.truth_(cljs.core.not(cljs.core._EQ_(x, y)))) {
        var s__14947 = cljs.core.set([y, x]);
        var xs__14948 = more;
        while(true) {
          var x__14949 = cljs.core.first(xs__14948);
          var etc__14950 = cljs.core.next(xs__14948);
          if(cljs.core.truth_(xs__14948)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_(s__14947, x__14949))) {
              return false
            }else {
              var G__14955 = cljs.core.conj.__2(s__14947, x__14949);
              var G__14956 = etc__14950;
              s__14947 = G__14955;
              xs__14948 = G__14956;
              continue
            }
          }else {
            return true
          }
          break
        }
      }else {
        return false
      }
    };
    var G__14951 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14951__delegate.call(this, x, y, more)
    };
    G__14951.cljs$lang$maxFixedArity = 2;
    G__14951.cljs$lang$applyTo = function(arglist__14957) {
      var x = cljs.core.first(arglist__14957);
      var y = cljs.core.first(cljs.core.next(arglist__14957));
      var more = cljs.core.rest(cljs.core.next(arglist__14957));
      return G__14951__delegate.call(this, x, y, more)
    };
    return G__14951
  }();
  distinct_QMARK_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return distinct_QMARK___1.call(this, x);
      case 2:
        return distinct_QMARK___2.call(this, x, y);
      default:
        return distinct_QMARK___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  distinct_QMARK_.cljs$lang$maxFixedArity = 2;
  distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3.cljs$lang$applyTo;
  distinct_QMARK_.__1 = distinct_QMARK___1;
  distinct_QMARK_.__2 = distinct_QMARK___2;
  distinct_QMARK_.__3 = distinct_QMARK___3;
  return distinct_QMARK_
}();
cljs.core.compare = function compare(x, y) {
  return goog.array.defaultCompare.call(null, x, y)
};
cljs.core.fn__GT_comparator = function fn__GT_comparator(f) {
  if(cljs.core.truth_(cljs.core._EQ_(f, cljs.core.compare))) {
    return cljs.core.compare
  }else {
    return function(x, y) {
      var r__14958 = f.call(null, x, y);
      if(cljs.core.truth_(cljs.core.number_QMARK_(r__14958))) {
        return r__14958
      }else {
        if(cljs.core.truth_(r__14958)) {
          return-1
        }else {
          if(cljs.core.truth_(f.call(null, y, x))) {
            return 1
          }else {
            return 0
          }
        }
      }
    }
  }
};
void 0;
cljs.core.sort = function() {
  var sort = null;
  var sort__1 = function(coll) {
    return sort.call(null, cljs.core.compare, coll)
  };
  var sort__2 = function(comp, coll) {
    if(cljs.core.truth_(cljs.core.seq(coll))) {
      var a__14963 = cljs.core.to_array(coll);
      goog.array.stableSort.call(null, a__14963, cljs.core.fn__GT_comparator(comp));
      return cljs.core.seq(a__14963)
    }else {
      return cljs.core.List.EMPTY
    }
  };
  sort = function(comp, coll) {
    switch(arguments.length) {
      case 1:
        return sort__1.call(this, comp);
      case 2:
        return sort__2.call(this, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort.__1 = sort__1;
  sort.__2 = sort__2;
  return sort
}();
cljs.core.sort_by = function() {
  var sort_by = null;
  var sort_by__2 = function(keyfn, coll) {
    return sort_by.call(null, keyfn, cljs.core.compare, coll)
  };
  var sort_by__3 = function(keyfn, comp, coll) {
    return cljs.core.sort.__2(function(x, y) {
      return cljs.core.fn__GT_comparator(comp).call(null, keyfn.call(null, x), keyfn.call(null, y))
    }, coll)
  };
  sort_by = function(keyfn, comp, coll) {
    switch(arguments.length) {
      case 2:
        return sort_by__2.call(this, keyfn, comp);
      case 3:
        return sort_by__3.call(this, keyfn, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort_by.__2 = sort_by__2;
  sort_by.__3 = sort_by__3;
  return sort_by
}();
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__2 = function(f, coll) {
    return cljs.core._reduce.__2(coll, f)
  };
  var reduce__3 = function(f, val, coll) {
    return cljs.core._reduce.__3(coll, f, val)
  };
  reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return reduce__2.call(this, f, val);
      case 3:
        return reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reduce.__2 = reduce__2;
  reduce.__3 = reduce__3;
  return reduce
}();
cljs.core.seq_reduce = function() {
  var seq_reduce = null;
  var seq_reduce__2 = function(f, coll) {
    var temp__3847__auto____14965 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3847__auto____14965)) {
      var s__14966 = temp__3847__auto____14965;
      return cljs.core.reduce.__3(f, cljs.core.first(s__14966), cljs.core.next(s__14966))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__14967 = val;
    var coll__14968 = cljs.core.seq(coll);
    while(true) {
      if(cljs.core.truth_(coll__14968)) {
        var G__14971 = f.call(null, val__14967, cljs.core.first(coll__14968));
        var G__14972 = cljs.core.next(coll__14968);
        val__14967 = G__14971;
        coll__14968 = G__14972;
        continue
      }else {
        return val__14967
      }
      break
    }
  };
  seq_reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return seq_reduce__2.call(this, f, val);
      case 3:
        return seq_reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  seq_reduce.__2 = seq_reduce__2;
  seq_reduce.__3 = seq_reduce__3;
  return seq_reduce
}();
cljs.core.IReduce["_"] = true;
cljs.core._reduce["_"] = function() {
  var G__14973 = null;
  var G__14973__2 = function(coll, f) {
    return cljs.core.seq_reduce.__2(f, coll)
  };
  var G__14973__3 = function(coll, f, start) {
    return cljs.core.seq_reduce.__3(f, start, coll)
  };
  G__14973 = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return G__14973__2.call(this, coll, f);
      case 3:
        return G__14973__3.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__14973
}();
cljs.core._PLUS_ = function() {
  var _PLUS_ = null;
  var _PLUS___0 = function() {
    return 0
  };
  var _PLUS___1 = function(x) {
    return x
  };
  var _PLUS___2 = function(x, y) {
    return x + y
  };
  var _PLUS___3 = function() {
    var G__14974__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_PLUS_, x + y, more)
    };
    var G__14974 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14974__delegate.call(this, x, y, more)
    };
    G__14974.cljs$lang$maxFixedArity = 2;
    G__14974.cljs$lang$applyTo = function(arglist__14975) {
      var x = cljs.core.first(arglist__14975);
      var y = cljs.core.first(cljs.core.next(arglist__14975));
      var more = cljs.core.rest(cljs.core.next(arglist__14975));
      return G__14974__delegate.call(this, x, y, more)
    };
    return G__14974
  }();
  _PLUS_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _PLUS___0.call(this);
      case 1:
        return _PLUS___1.call(this, x);
      case 2:
        return _PLUS___2.call(this, x, y);
      default:
        return _PLUS___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _PLUS_.cljs$lang$maxFixedArity = 2;
  _PLUS_.cljs$lang$applyTo = _PLUS___3.cljs$lang$applyTo;
  _PLUS_.__0 = _PLUS___0;
  _PLUS_.__1 = _PLUS___1;
  _PLUS_.__2 = _PLUS___2;
  _PLUS_.__3 = _PLUS___3;
  return _PLUS_
}();
cljs.core._ = function() {
  var _ = null;
  var ___1 = function(x) {
    return-x
  };
  var ___2 = function(x, y) {
    return x - y
  };
  var ___3 = function() {
    var G__14976__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_, x - y, more)
    };
    var G__14976 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14976__delegate.call(this, x, y, more)
    };
    G__14976.cljs$lang$maxFixedArity = 2;
    G__14976.cljs$lang$applyTo = function(arglist__14977) {
      var x = cljs.core.first(arglist__14977);
      var y = cljs.core.first(cljs.core.next(arglist__14977));
      var more = cljs.core.rest(cljs.core.next(arglist__14977));
      return G__14976__delegate.call(this, x, y, more)
    };
    return G__14976
  }();
  _ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return ___1.call(this, x);
      case 2:
        return ___2.call(this, x, y);
      default:
        return ___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _.cljs$lang$maxFixedArity = 2;
  _.cljs$lang$applyTo = ___3.cljs$lang$applyTo;
  _.__1 = ___1;
  _.__2 = ___2;
  _.__3 = ___3;
  return _
}();
cljs.core._STAR_ = function() {
  var _STAR_ = null;
  var _STAR___0 = function() {
    return 1
  };
  var _STAR___1 = function(x) {
    return x
  };
  var _STAR___2 = function(x, y) {
    return x * y
  };
  var _STAR___3 = function() {
    var G__14978__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_STAR_, x * y, more)
    };
    var G__14978 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14978__delegate.call(this, x, y, more)
    };
    G__14978.cljs$lang$maxFixedArity = 2;
    G__14978.cljs$lang$applyTo = function(arglist__14979) {
      var x = cljs.core.first(arglist__14979);
      var y = cljs.core.first(cljs.core.next(arglist__14979));
      var more = cljs.core.rest(cljs.core.next(arglist__14979));
      return G__14978__delegate.call(this, x, y, more)
    };
    return G__14978
  }();
  _STAR_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _STAR___0.call(this);
      case 1:
        return _STAR___1.call(this, x);
      case 2:
        return _STAR___2.call(this, x, y);
      default:
        return _STAR___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _STAR_.cljs$lang$maxFixedArity = 2;
  _STAR_.cljs$lang$applyTo = _STAR___3.cljs$lang$applyTo;
  _STAR_.__0 = _STAR___0;
  _STAR_.__1 = _STAR___1;
  _STAR_.__2 = _STAR___2;
  _STAR_.__3 = _STAR___3;
  return _STAR_
}();
cljs.core._SLASH_ = function() {
  var _SLASH_ = null;
  var _SLASH___1 = function(x) {
    return _SLASH_.call(null, 1, x)
  };
  var _SLASH___2 = function(x, y) {
    return x / y
  };
  var _SLASH___3 = function() {
    var G__14980__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__14980 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14980__delegate.call(this, x, y, more)
    };
    G__14980.cljs$lang$maxFixedArity = 2;
    G__14980.cljs$lang$applyTo = function(arglist__14981) {
      var x = cljs.core.first(arglist__14981);
      var y = cljs.core.first(cljs.core.next(arglist__14981));
      var more = cljs.core.rest(cljs.core.next(arglist__14981));
      return G__14980__delegate.call(this, x, y, more)
    };
    return G__14980
  }();
  _SLASH_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _SLASH___1.call(this, x);
      case 2:
        return _SLASH___2.call(this, x, y);
      default:
        return _SLASH___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _SLASH_.cljs$lang$maxFixedArity = 2;
  _SLASH_.cljs$lang$applyTo = _SLASH___3.cljs$lang$applyTo;
  _SLASH_.__1 = _SLASH___1;
  _SLASH_.__2 = _SLASH___2;
  _SLASH_.__3 = _SLASH___3;
  return _SLASH_
}();
cljs.core._LT_ = function() {
  var _LT_ = null;
  var _LT___1 = function(x) {
    return true
  };
  var _LT___2 = function(x, y) {
    return x < y
  };
  var _LT___3 = function() {
    var G__14982__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__14985 = y;
            var G__14986 = cljs.core.first(more);
            var G__14987 = cljs.core.next(more);
            x = G__14985;
            y = G__14986;
            more = G__14987;
            continue
          }else {
            return y < cljs.core.first(more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__14982 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14982__delegate.call(this, x, y, more)
    };
    G__14982.cljs$lang$maxFixedArity = 2;
    G__14982.cljs$lang$applyTo = function(arglist__14988) {
      var x = cljs.core.first(arglist__14988);
      var y = cljs.core.first(cljs.core.next(arglist__14988));
      var more = cljs.core.rest(cljs.core.next(arglist__14988));
      return G__14982__delegate.call(this, x, y, more)
    };
    return G__14982
  }();
  _LT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT___1.call(this, x);
      case 2:
        return _LT___2.call(this, x, y);
      default:
        return _LT___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT_.cljs$lang$maxFixedArity = 2;
  _LT_.cljs$lang$applyTo = _LT___3.cljs$lang$applyTo;
  _LT_.__1 = _LT___1;
  _LT_.__2 = _LT___2;
  _LT_.__3 = _LT___3;
  return _LT_
}();
cljs.core._LT__EQ_ = function() {
  var _LT__EQ_ = null;
  var _LT__EQ___1 = function(x) {
    return true
  };
  var _LT__EQ___2 = function(x, y) {
    return x <= y
  };
  var _LT__EQ___3 = function() {
    var G__14989__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__14992 = y;
            var G__14993 = cljs.core.first(more);
            var G__14994 = cljs.core.next(more);
            x = G__14992;
            y = G__14993;
            more = G__14994;
            continue
          }else {
            return y <= cljs.core.first(more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__14989 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14989__delegate.call(this, x, y, more)
    };
    G__14989.cljs$lang$maxFixedArity = 2;
    G__14989.cljs$lang$applyTo = function(arglist__14995) {
      var x = cljs.core.first(arglist__14995);
      var y = cljs.core.first(cljs.core.next(arglist__14995));
      var more = cljs.core.rest(cljs.core.next(arglist__14995));
      return G__14989__delegate.call(this, x, y, more)
    };
    return G__14989
  }();
  _LT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT__EQ___1.call(this, x);
      case 2:
        return _LT__EQ___2.call(this, x, y);
      default:
        return _LT__EQ___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT__EQ_.cljs$lang$maxFixedArity = 2;
  _LT__EQ_.cljs$lang$applyTo = _LT__EQ___3.cljs$lang$applyTo;
  _LT__EQ_.__1 = _LT__EQ___1;
  _LT__EQ_.__2 = _LT__EQ___2;
  _LT__EQ_.__3 = _LT__EQ___3;
  return _LT__EQ_
}();
cljs.core._GT_ = function() {
  var _GT_ = null;
  var _GT___1 = function(x) {
    return true
  };
  var _GT___2 = function(x, y) {
    return x > y
  };
  var _GT___3 = function() {
    var G__14996__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__14999 = y;
            var G__15000 = cljs.core.first(more);
            var G__15001 = cljs.core.next(more);
            x = G__14999;
            y = G__15000;
            more = G__15001;
            continue
          }else {
            return y > cljs.core.first(more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__14996 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__14996__delegate.call(this, x, y, more)
    };
    G__14996.cljs$lang$maxFixedArity = 2;
    G__14996.cljs$lang$applyTo = function(arglist__15002) {
      var x = cljs.core.first(arglist__15002);
      var y = cljs.core.first(cljs.core.next(arglist__15002));
      var more = cljs.core.rest(cljs.core.next(arglist__15002));
      return G__14996__delegate.call(this, x, y, more)
    };
    return G__14996
  }();
  _GT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT___1.call(this, x);
      case 2:
        return _GT___2.call(this, x, y);
      default:
        return _GT___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT_.cljs$lang$maxFixedArity = 2;
  _GT_.cljs$lang$applyTo = _GT___3.cljs$lang$applyTo;
  _GT_.__1 = _GT___1;
  _GT_.__2 = _GT___2;
  _GT_.__3 = _GT___3;
  return _GT_
}();
cljs.core._GT__EQ_ = function() {
  var _GT__EQ_ = null;
  var _GT__EQ___1 = function(x) {
    return true
  };
  var _GT__EQ___2 = function(x, y) {
    return x >= y
  };
  var _GT__EQ___3 = function() {
    var G__15003__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__15006 = y;
            var G__15007 = cljs.core.first(more);
            var G__15008 = cljs.core.next(more);
            x = G__15006;
            y = G__15007;
            more = G__15008;
            continue
          }else {
            return y >= cljs.core.first(more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__15003 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15003__delegate.call(this, x, y, more)
    };
    G__15003.cljs$lang$maxFixedArity = 2;
    G__15003.cljs$lang$applyTo = function(arglist__15009) {
      var x = cljs.core.first(arglist__15009);
      var y = cljs.core.first(cljs.core.next(arglist__15009));
      var more = cljs.core.rest(cljs.core.next(arglist__15009));
      return G__15003__delegate.call(this, x, y, more)
    };
    return G__15003
  }();
  _GT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT__EQ___1.call(this, x);
      case 2:
        return _GT__EQ___2.call(this, x, y);
      default:
        return _GT__EQ___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT__EQ_.cljs$lang$maxFixedArity = 2;
  _GT__EQ_.cljs$lang$applyTo = _GT__EQ___3.cljs$lang$applyTo;
  _GT__EQ_.__1 = _GT__EQ___1;
  _GT__EQ_.__2 = _GT__EQ___2;
  _GT__EQ_.__3 = _GT__EQ___3;
  return _GT__EQ_
}();
cljs.core.dec = function dec(x) {
  return x - 1
};
cljs.core.max = function() {
  var max = null;
  var max__1 = function(x) {
    return x
  };
  var max__2 = function(x, y) {
    return x > y ? x : y
  };
  var max__3 = function() {
    var G__15010__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(max, x > y ? x : y, more)
    };
    var G__15010 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15010__delegate.call(this, x, y, more)
    };
    G__15010.cljs$lang$maxFixedArity = 2;
    G__15010.cljs$lang$applyTo = function(arglist__15011) {
      var x = cljs.core.first(arglist__15011);
      var y = cljs.core.first(cljs.core.next(arglist__15011));
      var more = cljs.core.rest(cljs.core.next(arglist__15011));
      return G__15010__delegate.call(this, x, y, more)
    };
    return G__15010
  }();
  max = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return max__1.call(this, x);
      case 2:
        return max__2.call(this, x, y);
      default:
        return max__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  max.cljs$lang$maxFixedArity = 2;
  max.cljs$lang$applyTo = max__3.cljs$lang$applyTo;
  max.__1 = max__1;
  max.__2 = max__2;
  max.__3 = max__3;
  return max
}();
cljs.core.min = function() {
  var min = null;
  var min__1 = function(x) {
    return x
  };
  var min__2 = function(x, y) {
    return x < y ? x : y
  };
  var min__3 = function() {
    var G__15012__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(min, x < y ? x : y, more)
    };
    var G__15012 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15012__delegate.call(this, x, y, more)
    };
    G__15012.cljs$lang$maxFixedArity = 2;
    G__15012.cljs$lang$applyTo = function(arglist__15013) {
      var x = cljs.core.first(arglist__15013);
      var y = cljs.core.first(cljs.core.next(arglist__15013));
      var more = cljs.core.rest(cljs.core.next(arglist__15013));
      return G__15012__delegate.call(this, x, y, more)
    };
    return G__15012
  }();
  min = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return min__1.call(this, x);
      case 2:
        return min__2.call(this, x, y);
      default:
        return min__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  min.cljs$lang$maxFixedArity = 2;
  min.cljs$lang$applyTo = min__3.cljs$lang$applyTo;
  min.__1 = min__1;
  min.__2 = min__2;
  min.__3 = min__3;
  return min
}();
cljs.core.fix = function fix(q) {
  if(q >= 0) {
    return Math.floor.call(null, q)
  }else {
    return Math.ceil.call(null, q)
  }
};
cljs.core.mod = function mod(n, d) {
  return n % d
};
cljs.core.quot = function quot(n, d) {
  var rem__15015 = n % d;
  return cljs.core.fix((n - rem__15015) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__15016 = cljs.core.quot(n, d);
  return n - d * q__15016
};
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return Math.random.call(null)
  };
  var rand__1 = function(n) {
    return n * rand.call(null)
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.__0 = rand__0;
  rand.__1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return cljs.core.fix(cljs.core.rand.__1(n))
};
cljs.core.bit_xor = function bit_xor(x, y) {
  return x ^ y
};
cljs.core.bit_and = function bit_and(x, y) {
  return x & y
};
cljs.core.bit_or = function bit_or(x, y) {
  return x | y
};
cljs.core.bit_and_not = function bit_and_not(x, y) {
  return x & ~y
};
cljs.core.bit_clear = function bit_clear(x, n) {
  return x & ~(1 << n)
};
cljs.core.bit_flip = function bit_flip(x, n) {
  return x ^ 1 << n
};
cljs.core.bit_not = function bit_not(x) {
  return~x
};
cljs.core.bit_set = function bit_set(x, n) {
  return x | 1 << n
};
cljs.core.bit_test = function bit_test(x, n) {
  return(x & 1 << n) != 0
};
cljs.core.bit_shift_left = function bit_shift_left(x, n) {
  return x << n
};
cljs.core.bit_shift_right = function bit_shift_right(x, n) {
  return x >> n
};
cljs.core._EQ__EQ_ = function() {
  var _EQ__EQ_ = null;
  var _EQ__EQ___1 = function(x) {
    return true
  };
  var _EQ__EQ___2 = function(x, y) {
    return cljs.core._equiv(x, y)
  };
  var _EQ__EQ___3 = function() {
    var G__15017__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__15020 = y;
            var G__15021 = cljs.core.first(more);
            var G__15022 = cljs.core.next(more);
            x = G__15020;
            y = G__15021;
            more = G__15022;
            continue
          }else {
            return _EQ__EQ_.call(null, y, cljs.core.first(more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__15017 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15017__delegate.call(this, x, y, more)
    };
    G__15017.cljs$lang$maxFixedArity = 2;
    G__15017.cljs$lang$applyTo = function(arglist__15023) {
      var x = cljs.core.first(arglist__15023);
      var y = cljs.core.first(cljs.core.next(arglist__15023));
      var more = cljs.core.rest(cljs.core.next(arglist__15023));
      return G__15017__delegate.call(this, x, y, more)
    };
    return G__15017
  }();
  _EQ__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ__EQ___1.call(this, x);
      case 2:
        return _EQ__EQ___2.call(this, x, y);
      default:
        return _EQ__EQ___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ__EQ_.cljs$lang$maxFixedArity = 2;
  _EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3.cljs$lang$applyTo;
  _EQ__EQ_.__1 = _EQ__EQ___1;
  _EQ__EQ_.__2 = _EQ__EQ___2;
  _EQ__EQ_.__3 = _EQ__EQ___3;
  return _EQ__EQ_
}();
cljs.core.pos_QMARK_ = function pos_QMARK_(n) {
  return n > 0
};
cljs.core.zero_QMARK_ = function zero_QMARK_(n) {
  return n === 0
};
cljs.core.neg_QMARK_ = function neg_QMARK_(x) {
  return x < 0
};
cljs.core.nthnext = function nthnext(coll, n) {
  var n__15024 = n;
  var xs__15025 = cljs.core.seq(coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____15026 = xs__15025;
      if(cljs.core.truth_(and__3698__auto____15026)) {
        return n__15024 > 0
      }else {
        return and__3698__auto____15026
      }
    }())) {
      var G__15029 = n__15024 - 1;
      var G__15030 = cljs.core.next(xs__15025);
      n__15024 = G__15029;
      xs__15025 = G__15030;
      continue
    }else {
      return xs__15025
    }
    break
  }
};
cljs.core.IIndexed["_"] = true;
cljs.core._nth["_"] = function() {
  var G__15035 = null;
  var G__15035__2 = function(coll, n) {
    var temp__3847__auto____15031 = cljs.core.nthnext(coll, n);
    if(cljs.core.truth_(temp__3847__auto____15031)) {
      var xs__15032 = temp__3847__auto____15031;
      return cljs.core.first(xs__15032)
    }else {
      throw new Error("Index out of bounds");
    }
  };
  var G__15035__3 = function(coll, n, not_found) {
    var temp__3847__auto____15033 = cljs.core.nthnext(coll, n);
    if(cljs.core.truth_(temp__3847__auto____15033)) {
      var xs__15034 = temp__3847__auto____15033;
      return cljs.core.first(xs__15034)
    }else {
      return not_found
    }
  };
  G__15035 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15035__2.call(this, coll, n);
      case 3:
        return G__15035__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15035
}();
void 0;
cljs.core.str_STAR_ = function() {
  var str_STAR_ = null;
  var str_STAR___0 = function() {
    return""
  };
  var str_STAR___1 = function(x) {
    if(x === null) {
      return""
    }else {
      if("\ufdd0'else") {
        return x.toString()
      }else {
        return null
      }
    }
  };
  var str_STAR___2 = function() {
    var G__15040__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__15042 = sb.append(str_STAR_.call(null, cljs.core.first(more)));
            var G__15043 = cljs.core.next(more);
            sb = G__15042;
            more = G__15043;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__15040 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__15040__delegate.call(this, x, ys)
    };
    G__15040.cljs$lang$maxFixedArity = 1;
    G__15040.cljs$lang$applyTo = function(arglist__15044) {
      var x = cljs.core.first(arglist__15044);
      var ys = cljs.core.rest(arglist__15044);
      return G__15040__delegate.call(this, x, ys)
    };
    return G__15040
  }();
  str_STAR_ = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str_STAR___0.call(this);
      case 1:
        return str_STAR___1.call(this, x);
      default:
        return str_STAR___2.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  str_STAR_.cljs$lang$maxFixedArity = 1;
  str_STAR_.cljs$lang$applyTo = str_STAR___2.cljs$lang$applyTo;
  str_STAR_.__0 = str_STAR___0;
  str_STAR_.__1 = str_STAR___1;
  str_STAR_.__2 = str_STAR___2;
  return str_STAR_
}();
cljs.core.str = function() {
  var str = null;
  var str__0 = function() {
    return""
  };
  var str__1 = function(x) {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_(x))) {
      return x.substring(2, x.length)
    }else {
      if(cljs.core.truth_(cljs.core.keyword_QMARK_(x))) {
        return cljs.core.str_STAR_(":", x.substring(2, x.length))
      }else {
        if(x === null) {
          return""
        }else {
          if("\ufdd0'else") {
            return x.toString()
          }else {
            return null
          }
        }
      }
    }
  };
  var str__2 = function() {
    var G__15049__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__15051 = sb.append(str.call(null, cljs.core.first(more)));
            var G__15052 = cljs.core.next(more);
            sb = G__15051;
            more = G__15052;
            continue
          }else {
            return cljs.core.str_STAR_.__1(sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__15049 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__15049__delegate.call(this, x, ys)
    };
    G__15049.cljs$lang$maxFixedArity = 1;
    G__15049.cljs$lang$applyTo = function(arglist__15053) {
      var x = cljs.core.first(arglist__15053);
      var ys = cljs.core.rest(arglist__15053);
      return G__15049__delegate.call(this, x, ys)
    };
    return G__15049
  }();
  str = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str__0.call(this);
      case 1:
        return str__1.call(this, x);
      default:
        return str__2.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  str.cljs$lang$maxFixedArity = 1;
  str.cljs$lang$applyTo = str__2.cljs$lang$applyTo;
  str.__0 = str__0;
  str.__1 = str__1;
  str.__2 = str__2;
  return str
}();
cljs.core.subs = function() {
  var subs = null;
  var subs__2 = function(s, start) {
    return s.substring(start)
  };
  var subs__3 = function(s, start, end) {
    return s.substring(start, end)
  };
  subs = function(s, start, end) {
    switch(arguments.length) {
      case 2:
        return subs__2.call(this, s, start);
      case 3:
        return subs__3.call(this, s, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subs.__2 = subs__2;
  subs.__3 = subs__3;
  return subs
}();
cljs.core.symbol = function() {
  var symbol = null;
  var symbol__1 = function(name) {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_(name))) {
      name
    }else {
      if(cljs.core.truth_(cljs.core.keyword_QMARK_(name))) {
        cljs.core.str_STAR_("\ufdd1", "'", cljs.core.subs.__2(name, 2))
      }else {
      }
    }
    return cljs.core.str_STAR_("\ufdd1", "'", name)
  };
  var symbol__2 = function(ns, name) {
    return symbol.call(null, cljs.core.str_STAR_(ns, "/", name))
  };
  symbol = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return symbol__1.call(this, ns);
      case 2:
        return symbol__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  symbol.__1 = symbol__1;
  symbol.__2 = symbol__2;
  return symbol
}();
cljs.core.keyword = function() {
  var keyword = null;
  var keyword__1 = function(name) {
    if(cljs.core.truth_(cljs.core.keyword_QMARK_(name))) {
      return name
    }else {
      if(cljs.core.truth_(cljs.core.symbol_QMARK_(name))) {
        return cljs.core.str_STAR_("\ufdd0", "'", cljs.core.subs.__2(name, 2))
      }else {
        if("\ufdd0'else") {
          return cljs.core.str_STAR_("\ufdd0", "'", name)
        }else {
          return null
        }
      }
    }
  };
  var keyword__2 = function(ns, name) {
    return keyword.call(null, cljs.core.str_STAR_(ns, "/", name))
  };
  keyword = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return keyword__1.call(this, ns);
      case 2:
        return keyword__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  keyword.__1 = keyword__1;
  keyword.__2 = keyword__2;
  return keyword
}();
cljs.core.equiv_sequential = function equiv_sequential(x, y) {
  return cljs.core.boolean$(cljs.core.truth_(cljs.core.sequential_QMARK_(y)) ? function() {
    var xs__15059 = cljs.core.seq(x);
    var ys__15060 = cljs.core.seq(y);
    while(true) {
      if(xs__15059 === null) {
        return ys__15060 === null
      }else {
        if(ys__15060 === null) {
          return false
        }else {
          if(cljs.core.truth_(cljs.core._EQ_(cljs.core.first(xs__15059), cljs.core.first(ys__15060)))) {
            var G__15064 = cljs.core.next(xs__15059);
            var G__15065 = cljs.core.next(ys__15060);
            xs__15059 = G__15064;
            ys__15060 = G__15065;
            continue
          }else {
            if("\ufdd0'else") {
              return false
            }else {
              return null
            }
          }
        }
      }
      break
    }
  }() : null)
};
cljs.core.hash_combine = function hash_combine(seed, hash) {
  return seed ^ hash + 2654435769 + (seed << 6) + (seed >> 2)
};
cljs.core.hash_coll = function hash_coll(coll) {
  return cljs.core.reduce.__3(function(p1__15067_SHARP_, p2__15068_SHARP_) {
    return cljs.core.hash_combine(p1__15067_SHARP_, cljs.core.hash(p2__15068_SHARP_))
  }, cljs.core.hash(cljs.core.first(coll)), cljs.core.next(coll))
};
void 0;
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__15069__15070 = cljs.core.seq.call(null, fn_map);
  if(cljs.core.truth_(G__15069__15070)) {
    var G__15072__15074 = cljs.core.first.call(null, G__15069__15070);
    var vec__15073__15075 = G__15072__15074;
    var key_name__15076 = cljs.core.nth.call(null, vec__15073__15075, 0, null);
    var f__15077 = cljs.core.nth.call(null, vec__15073__15075, 1, null);
    var G__15069__15078 = G__15069__15070;
    var G__15072__15079 = G__15072__15074;
    var G__15069__15080 = G__15069__15078;
    while(true) {
      var vec__15081__15082 = G__15072__15079;
      var key_name__15083 = cljs.core.nth.call(null, vec__15081__15082, 0, null);
      var f__15084 = cljs.core.nth.call(null, vec__15081__15082, 1, null);
      var G__15069__15085 = G__15069__15080;
      var str_name__15086 = cljs.core.name(key_name__15083);
      obj[str_name__15086] = f__15084;
      var temp__3850__auto____15087 = cljs.core.next.call(null, G__15069__15085);
      if(cljs.core.truth_(temp__3850__auto____15087)) {
        var G__15069__15088 = temp__3850__auto____15087;
        var G__15091 = cljs.core.first.call(null, G__15069__15088);
        var G__15092 = G__15069__15088;
        G__15072__15079 = G__15091;
        G__15069__15080 = G__15092;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return obj
};
cljs.core.List = function(meta, first, rest, count) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.count = count
};
cljs.core.List.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.List")
};
cljs.core.List.prototype.cljs$core$IHash$ = true;
cljs.core.List.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15093 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15094 = this;
  return new cljs.core.List(this__15094.meta, o, coll, this__15094.count + 1)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15095 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15096 = this;
  return this__15096.count
};
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15097 = this;
  return this__15097.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15098 = this;
  return cljs.core._rest(coll)
};
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15099 = this;
  return this__15099.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15100 = this;
  return this__15100.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15101 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15102 = this;
  return new cljs.core.List(meta, this__15102.first, this__15102.rest, this__15102.count)
};
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15103 = this;
  return this__15103.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15104 = this;
  return cljs.core.List.EMPTY
};
cljs.core.List;
cljs.core.EmptyList = function(meta) {
  this.meta = meta
};
cljs.core.EmptyList.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = true;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15105 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15106 = this;
  return new cljs.core.List(this__15106.meta, o, null, 1)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15107 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15108 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15109 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15110 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15111 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15112 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15113 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15114 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15115 = this;
  return this__15115.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15116 = this;
  return coll
};
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reverse = function reverse(coll) {
  return cljs.core.reduce.__3(cljs.core.conj, cljs.core.List.EMPTY, coll)
};
cljs.core.list = function() {
  var list__delegate = function(items) {
    return cljs.core.reduce.__3(cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse(items))
  };
  var list = function(var_args) {
    var items = null;
    if(goog.isDef(var_args)) {
      items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return list__delegate.call(this, items)
  };
  list.cljs$lang$maxFixedArity = 0;
  list.cljs$lang$applyTo = function(arglist__15117) {
    var items = cljs.core.seq(arglist__15117);
    return list__delegate.call(this, items)
  };
  return list
}();
cljs.core.Cons = function(meta, first, rest) {
  this.meta = meta;
  this.first = first;
  this.rest = rest
};
cljs.core.Cons.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Cons")
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15118 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15119 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15120 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15121 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__15121.meta)
};
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15122 = this;
  return new cljs.core.Cons(null, o, coll)
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15123 = this;
  return this__15123.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15124 = this;
  if(this__15124.rest === null) {
    return cljs.core.List.EMPTY
  }else {
    return this__15124.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15125 = this;
  return this__15125.meta
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15126 = this;
  return new cljs.core.Cons(meta, this__15126.first, this__15126.rest)
};
cljs.core.Cons;
cljs.core.cons = function cons(x, seq) {
  return new cljs.core.Cons(null, x, seq)
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__15128 = null;
  var G__15128__2 = function(string, f) {
    return cljs.core.ci_reduce.__2(string, f)
  };
  var G__15128__3 = function(string, f, start) {
    return cljs.core.ci_reduce.__3(string, f, start)
  };
  G__15128 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__15128__2.call(this, string, f);
      case 3:
        return G__15128__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15128
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__15129 = null;
  var G__15129__2 = function(string, k) {
    return cljs.core._nth.__2(string, k)
  };
  var G__15129__3 = function(string, k, not_found) {
    return cljs.core._nth.__3(string, k, not_found)
  };
  G__15129 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15129__2.call(this, string, k);
      case 3:
        return G__15129__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15129
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__15130 = null;
  var G__15130__2 = function(string, n) {
    if(n < cljs.core._count(string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__15130__3 = function(string, n, not_found) {
    if(n < cljs.core._count(string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__15130 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15130__2.call(this, string, n);
      case 3:
        return G__15130__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15130
}();
cljs.core.ICounted["string"] = true;
cljs.core._count["string"] = function(s) {
  return s.length
};
cljs.core.ISeqable["string"] = true;
cljs.core._seq["string"] = function(string) {
  return cljs.core.prim_seq(string, 0)
};
cljs.core.IHash["string"] = true;
cljs.core._hash["string"] = function(o) {
  return goog.string.hashCode.call(null, o)
};
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = function() {
  var G__15139 = null;
  var G__15139__2 = function(tsym15133, coll) {
    var tsym15133__15135 = this;
    var this$__15136 = tsym15133__15135;
    return cljs.core.get.__2(coll, this$__15136.toString())
  };
  var G__15139__3 = function(tsym15134, coll, not_found) {
    var tsym15134__15137 = this;
    var this$__15138 = tsym15134__15137;
    return cljs.core.get.__3(coll, this$__15138.toString(), not_found)
  };
  G__15139 = function(tsym15134, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15139__2.call(this, tsym15134, coll);
      case 3:
        return G__15139__3.call(this, tsym15134, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15139
}();
String["prototype"]["apply"] = function(s, args) {
  if(cljs.core.count(args) < 2) {
    return cljs.core.get.__2(args[0], s)
  }else {
    return cljs.core.get.__3(args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__15141 = lazy_seq.x;
  if(cljs.core.truth_(lazy_seq.realized)) {
    return x__15141
  }else {
    lazy_seq.x = x__15141.call(null);
    lazy_seq.realized = true;
    return lazy_seq.x
  }
};
cljs.core.LazySeq = function(meta, realized, x) {
  this.meta = meta;
  this.realized = realized;
  this.x = x
};
cljs.core.LazySeq.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15143 = this;
  return cljs.core.seq(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15144 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15145 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15146 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__15146.meta)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15147 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15148 = this;
  return cljs.core.first(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15149 = this;
  return cljs.core.rest(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15150 = this;
  return this__15150.meta
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15151 = this;
  return new cljs.core.LazySeq(meta, this__15151.realized, this__15151.x)
};
cljs.core.LazySeq;
cljs.core.to_array = function to_array(s) {
  var ary__15152 = [];
  var s__15153 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.seq(s__15153))) {
      ary__15152.push(cljs.core.first(s__15153));
      var G__15155 = cljs.core.next(s__15153);
      s__15153 = G__15155;
      continue
    }else {
      return ary__15152
    }
    break
  }
};
cljs.core.bounded_count = function bounded_count(s, n) {
  var s__15156 = s;
  var i__15157 = n;
  var sum__15158 = 0;
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____15159 = i__15157 > 0;
      if(and__3698__auto____15159) {
        return cljs.core.seq(s__15156)
      }else {
        return and__3698__auto____15159
      }
    }())) {
      var G__15162 = cljs.core.next(s__15156);
      var G__15163 = i__15157 - 1;
      var G__15164 = sum__15158 + 1;
      s__15156 = G__15162;
      i__15157 = G__15163;
      sum__15158 = G__15164;
      continue
    }else {
      return sum__15158
    }
    break
  }
};
cljs.core.spread = function spread(arglist) {
  if(arglist === null) {
    return null
  }else {
    if(cljs.core.next(arglist) === null) {
      return cljs.core.seq(cljs.core.first(arglist))
    }else {
      if("\ufdd0'else") {
        return cljs.core.cons(cljs.core.first(arglist), spread.call(null, cljs.core.next(arglist)))
      }else {
        return null
      }
    }
  }
};
cljs.core.concat = function() {
  var concat = null;
  var concat__0 = function() {
    return new cljs.core.LazySeq(null, false, function() {
      return null
    })
  };
  var concat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return x
    })
  };
  var concat__2 = function(x, y) {
    return new cljs.core.LazySeq(null, false, function() {
      var s__15168 = cljs.core.seq(x);
      if(cljs.core.truth_(s__15168)) {
        return cljs.core.cons(cljs.core.first(s__15168), concat.call(null, cljs.core.rest(s__15168), y))
      }else {
        return y
      }
    })
  };
  var concat__3 = function() {
    var G__15172__delegate = function(x, y, zs) {
      var cat__15170 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__15169 = cljs.core.seq(xys);
          if(cljs.core.truth_(xys__15169)) {
            return cljs.core.cons(cljs.core.first(xys__15169), cat.call(null, cljs.core.rest(xys__15169), zs))
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first(zs), cljs.core.next(zs))
            }else {
              return null
            }
          }
        })
      };
      return cat__15170.call(null, concat.call(null, x, y), zs)
    };
    var G__15172 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15172__delegate.call(this, x, y, zs)
    };
    G__15172.cljs$lang$maxFixedArity = 2;
    G__15172.cljs$lang$applyTo = function(arglist__15175) {
      var x = cljs.core.first(arglist__15175);
      var y = cljs.core.first(cljs.core.next(arglist__15175));
      var zs = cljs.core.rest(cljs.core.next(arglist__15175));
      return G__15172__delegate.call(this, x, y, zs)
    };
    return G__15172
  }();
  concat = function(x, y, var_args) {
    var zs = var_args;
    switch(arguments.length) {
      case 0:
        return concat__0.call(this);
      case 1:
        return concat__1.call(this, x);
      case 2:
        return concat__2.call(this, x, y);
      default:
        return concat__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  concat.cljs$lang$maxFixedArity = 2;
  concat.cljs$lang$applyTo = concat__3.cljs$lang$applyTo;
  concat.__0 = concat__0;
  concat.__1 = concat__1;
  concat.__2 = concat__2;
  concat.__3 = concat__3;
  return concat
}();
cljs.core.list_STAR_ = function() {
  var list_STAR_ = null;
  var list_STAR___1 = function(args) {
    return cljs.core.seq(args)
  };
  var list_STAR___2 = function(a, args) {
    return cljs.core.cons(a, args)
  };
  var list_STAR___3 = function(a, b, args) {
    return cljs.core.cons(a, cljs.core.cons(b, args))
  };
  var list_STAR___4 = function(a, b, c, args) {
    return cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, args)))
  };
  var list_STAR___5 = function() {
    var G__15176__delegate = function(a, b, c, d, more) {
      return cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.spread(more)))))
    };
    var G__15176 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__15176__delegate.call(this, a, b, c, d, more)
    };
    G__15176.cljs$lang$maxFixedArity = 4;
    G__15176.cljs$lang$applyTo = function(arglist__15177) {
      var a = cljs.core.first(arglist__15177);
      var b = cljs.core.first(cljs.core.next(arglist__15177));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15177)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15177))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15177))));
      return G__15176__delegate.call(this, a, b, c, d, more)
    };
    return G__15176
  }();
  list_STAR_ = function(a, b, c, d, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return list_STAR___1.call(this, a);
      case 2:
        return list_STAR___2.call(this, a, b);
      case 3:
        return list_STAR___3.call(this, a, b, c);
      case 4:
        return list_STAR___4.call(this, a, b, c, d);
      default:
        return list_STAR___5.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  list_STAR_.cljs$lang$maxFixedArity = 4;
  list_STAR_.cljs$lang$applyTo = list_STAR___5.cljs$lang$applyTo;
  list_STAR_.__1 = list_STAR___1;
  list_STAR_.__2 = list_STAR___2;
  list_STAR_.__3 = list_STAR___3;
  list_STAR_.__4 = list_STAR___4;
  list_STAR_.__5 = list_STAR___5;
  return list_STAR_
}();
cljs.core.apply = function() {
  var apply = null;
  var apply__2 = function(f, args) {
    var fixed_arity__15178 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(args, fixed_arity__15178 + 1) <= fixed_arity__15178) {
        return f.apply(f, cljs.core.to_array(args))
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array(args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__15179 = cljs.core.list_STAR_.__2(x, args);
    var fixed_arity__15180 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__15179, fixed_arity__15180) <= fixed_arity__15180) {
        return f.apply(f, cljs.core.to_array(arglist__15179))
      }else {
        return f.cljs$lang$applyTo(arglist__15179)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__15179))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__15181 = cljs.core.list_STAR_.__3(x, y, args);
    var fixed_arity__15182 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__15181, fixed_arity__15182) <= fixed_arity__15182) {
        return f.apply(f, cljs.core.to_array(arglist__15181))
      }else {
        return f.cljs$lang$applyTo(arglist__15181)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__15181))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__15183 = cljs.core.list_STAR_.__4(x, y, z, args);
    var fixed_arity__15184 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__15183, fixed_arity__15184) <= fixed_arity__15184) {
        return f.apply(f, cljs.core.to_array(arglist__15183))
      }else {
        return f.cljs$lang$applyTo(arglist__15183)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__15183))
    }
  };
  var apply__6 = function() {
    var G__15195__delegate = function(f, a, b, c, d, args) {
      var arglist__15185 = cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.spread(args)))));
      var fixed_arity__15186 = f.cljs$lang$maxFixedArity;
      if(cljs.core.truth_(f.cljs$lang$applyTo)) {
        if(cljs.core.bounded_count(arglist__15185, fixed_arity__15186) <= fixed_arity__15186) {
          return f.apply(f, cljs.core.to_array(arglist__15185))
        }else {
          return f.cljs$lang$applyTo(arglist__15185)
        }
      }else {
        return f.apply(f, cljs.core.to_array(arglist__15185))
      }
    };
    var G__15195 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__15195__delegate.call(this, f, a, b, c, d, args)
    };
    G__15195.cljs$lang$maxFixedArity = 5;
    G__15195.cljs$lang$applyTo = function(arglist__15198) {
      var f = cljs.core.first(arglist__15198);
      var a = cljs.core.first(cljs.core.next(arglist__15198));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15198)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15198))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15198)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15198)))));
      return G__15195__delegate.call(this, f, a, b, c, d, args)
    };
    return G__15195
  }();
  apply = function(f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return apply__2.call(this, f, a);
      case 3:
        return apply__3.call(this, f, a, b);
      case 4:
        return apply__4.call(this, f, a, b, c);
      case 5:
        return apply__5.call(this, f, a, b, c, d);
      default:
        return apply__6.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  apply.cljs$lang$maxFixedArity = 5;
  apply.cljs$lang$applyTo = apply__6.cljs$lang$applyTo;
  apply.__2 = apply__2;
  apply.__3 = apply__3;
  apply.__4 = apply__4;
  apply.__5 = apply__5;
  apply.__6 = apply__6;
  return apply
}();
cljs.core.vary_meta = function() {
  var vary_meta__delegate = function(obj, f, args) {
    return cljs.core.with_meta(obj, cljs.core.apply.__3(f, cljs.core.meta(obj), args))
  };
  var vary_meta = function(obj, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return vary_meta__delegate.call(this, obj, f, args)
  };
  vary_meta.cljs$lang$maxFixedArity = 2;
  vary_meta.cljs$lang$applyTo = function(arglist__15199) {
    var obj = cljs.core.first(arglist__15199);
    var f = cljs.core.first(cljs.core.next(arglist__15199));
    var args = cljs.core.rest(cljs.core.next(arglist__15199));
    return vary_meta__delegate.call(this, obj, f, args)
  };
  return vary_meta
}();
cljs.core.not_EQ_ = function() {
  var not_EQ_ = null;
  var not_EQ___1 = function(x) {
    return false
  };
  var not_EQ___2 = function(x, y) {
    return cljs.core.not(cljs.core._EQ_(x, y))
  };
  var not_EQ___3 = function() {
    var G__15200__delegate = function(x, y, more) {
      return cljs.core.not(cljs.core.apply.__4(cljs.core._EQ_, x, y, more))
    };
    var G__15200 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15200__delegate.call(this, x, y, more)
    };
    G__15200.cljs$lang$maxFixedArity = 2;
    G__15200.cljs$lang$applyTo = function(arglist__15201) {
      var x = cljs.core.first(arglist__15201);
      var y = cljs.core.first(cljs.core.next(arglist__15201));
      var more = cljs.core.rest(cljs.core.next(arglist__15201));
      return G__15200__delegate.call(this, x, y, more)
    };
    return G__15200
  }();
  not_EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return not_EQ___1.call(this, x);
      case 2:
        return not_EQ___2.call(this, x, y);
      default:
        return not_EQ___3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  not_EQ_.cljs$lang$maxFixedArity = 2;
  not_EQ_.cljs$lang$applyTo = not_EQ___3.cljs$lang$applyTo;
  not_EQ_.__1 = not_EQ___1;
  not_EQ_.__2 = not_EQ___2;
  not_EQ_.__3 = not_EQ___3;
  return not_EQ_
}();
cljs.core.not_empty = function not_empty(coll) {
  if(cljs.core.truth_(cljs.core.seq(coll))) {
    return coll
  }else {
    return null
  }
};
cljs.core.every_QMARK_ = function every_QMARK_(pred, coll) {
  while(true) {
    if(cljs.core.seq(coll) === null) {
      return true
    }else {
      if(cljs.core.truth_(pred.call(null, cljs.core.first(coll)))) {
        var G__15205 = pred;
        var G__15206 = cljs.core.next(coll);
        pred = G__15205;
        coll = G__15206;
        continue
      }else {
        if("\ufdd0'else") {
          return false
        }else {
          return null
        }
      }
    }
    break
  }
};
cljs.core.not_every_QMARK_ = function not_every_QMARK_(pred, coll) {
  return cljs.core.not(cljs.core.every_QMARK_(pred, coll))
};
cljs.core.some = function some(pred, coll) {
  while(true) {
    if(cljs.core.truth_(cljs.core.seq(coll))) {
      var or__3700__auto____15208 = pred.call(null, cljs.core.first(coll));
      if(cljs.core.truth_(or__3700__auto____15208)) {
        return or__3700__auto____15208
      }else {
        var G__15211 = pred;
        var G__15212 = cljs.core.next(coll);
        pred = G__15211;
        coll = G__15212;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.not_any_QMARK_ = function not_any_QMARK_(pred, coll) {
  return cljs.core.not(cljs.core.some(pred, coll))
};
cljs.core.even_QMARK_ = function even_QMARK_(n) {
  if(cljs.core.truth_(cljs.core.integer_QMARK_(n))) {
    return(n & 1) === 0
  }else {
    throw new Error(cljs.core.str("Argument must be an integer: ", n));
  }
};
cljs.core.odd_QMARK_ = function odd_QMARK_(n) {
  return cljs.core.not(cljs.core.even_QMARK_(n))
};
cljs.core.identity = function identity(x) {
  return x
};
cljs.core.complement = function complement(f) {
  return function() {
    var G__15214 = null;
    var G__15214__0 = function() {
      return cljs.core.not(f.call(null))
    };
    var G__15214__1 = function(x) {
      return cljs.core.not(f.call(null, x))
    };
    var G__15214__2 = function(x, y) {
      return cljs.core.not(f.call(null, x, y))
    };
    var G__15214__3 = function() {
      var G__15215__delegate = function(x, y, zs) {
        return cljs.core.not(cljs.core.apply.__4(f, x, y, zs))
      };
      var G__15215 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__15215__delegate.call(this, x, y, zs)
      };
      G__15215.cljs$lang$maxFixedArity = 2;
      G__15215.cljs$lang$applyTo = function(arglist__15216) {
        var x = cljs.core.first(arglist__15216);
        var y = cljs.core.first(cljs.core.next(arglist__15216));
        var zs = cljs.core.rest(cljs.core.next(arglist__15216));
        return G__15215__delegate.call(this, x, y, zs)
      };
      return G__15215
    }();
    G__15214 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__15214__0.call(this);
        case 1:
          return G__15214__1.call(this, x);
        case 2:
          return G__15214__2.call(this, x, y);
        default:
          return G__15214__3.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__15214.cljs$lang$maxFixedArity = 2;
    G__15214.cljs$lang$applyTo = G__15214__3.cljs$lang$applyTo;
    return G__15214
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__15217__delegate = function(args) {
      return x
    };
    var G__15217 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__15217__delegate.call(this, args)
    };
    G__15217.cljs$lang$maxFixedArity = 0;
    G__15217.cljs$lang$applyTo = function(arglist__15218) {
      var args = cljs.core.seq(arglist__15218);
      return G__15217__delegate.call(this, args)
    };
    return G__15217
  }()
};
cljs.core.comp = function() {
  var comp = null;
  var comp__0 = function() {
    return cljs.core.identity
  };
  var comp__1 = function(f) {
    return f
  };
  var comp__2 = function(f, g) {
    return function() {
      var G__15222 = null;
      var G__15222__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__15222__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__15222__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__15222__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__15222__4 = function() {
        var G__15223__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.__5(g, x, y, z, args))
        };
        var G__15223 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15223__delegate.call(this, x, y, z, args)
        };
        G__15223.cljs$lang$maxFixedArity = 3;
        G__15223.cljs$lang$applyTo = function(arglist__15224) {
          var x = cljs.core.first(arglist__15224);
          var y = cljs.core.first(cljs.core.next(arglist__15224));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15224)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15224)));
          return G__15223__delegate.call(this, x, y, z, args)
        };
        return G__15223
      }();
      G__15222 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__15222__0.call(this);
          case 1:
            return G__15222__1.call(this, x);
          case 2:
            return G__15222__2.call(this, x, y);
          case 3:
            return G__15222__3.call(this, x, y, z);
          default:
            return G__15222__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__15222.cljs$lang$maxFixedArity = 3;
      G__15222.cljs$lang$applyTo = G__15222__4.cljs$lang$applyTo;
      return G__15222
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__15225 = null;
      var G__15225__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__15225__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__15225__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__15225__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__15225__4 = function() {
        var G__15226__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.__5(h, x, y, z, args)))
        };
        var G__15226 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15226__delegate.call(this, x, y, z, args)
        };
        G__15226.cljs$lang$maxFixedArity = 3;
        G__15226.cljs$lang$applyTo = function(arglist__15227) {
          var x = cljs.core.first(arglist__15227);
          var y = cljs.core.first(cljs.core.next(arglist__15227));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15227)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15227)));
          return G__15226__delegate.call(this, x, y, z, args)
        };
        return G__15226
      }();
      G__15225 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__15225__0.call(this);
          case 1:
            return G__15225__1.call(this, x);
          case 2:
            return G__15225__2.call(this, x, y);
          case 3:
            return G__15225__3.call(this, x, y, z);
          default:
            return G__15225__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__15225.cljs$lang$maxFixedArity = 3;
      G__15225.cljs$lang$applyTo = G__15225__4.cljs$lang$applyTo;
      return G__15225
    }()
  };
  var comp__4 = function() {
    var G__15228__delegate = function(f1, f2, f3, fs) {
      var fs__15219 = cljs.core.reverse(cljs.core.list_STAR_.__4(f1, f2, f3, fs));
      return function() {
        var G__15229__delegate = function(args) {
          var ret__15220 = cljs.core.apply.__2(cljs.core.first(fs__15219), args);
          var fs__15221 = cljs.core.next(fs__15219);
          while(true) {
            if(cljs.core.truth_(fs__15221)) {
              var G__15231 = cljs.core.first(fs__15221).call(null, ret__15220);
              var G__15232 = cljs.core.next(fs__15221);
              ret__15220 = G__15231;
              fs__15221 = G__15232;
              continue
            }else {
              return ret__15220
            }
            break
          }
        };
        var G__15229 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__15229__delegate.call(this, args)
        };
        G__15229.cljs$lang$maxFixedArity = 0;
        G__15229.cljs$lang$applyTo = function(arglist__15233) {
          var args = cljs.core.seq(arglist__15233);
          return G__15229__delegate.call(this, args)
        };
        return G__15229
      }()
    };
    var G__15228 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__15228__delegate.call(this, f1, f2, f3, fs)
    };
    G__15228.cljs$lang$maxFixedArity = 3;
    G__15228.cljs$lang$applyTo = function(arglist__15234) {
      var f1 = cljs.core.first(arglist__15234);
      var f2 = cljs.core.first(cljs.core.next(arglist__15234));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15234)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15234)));
      return G__15228__delegate.call(this, f1, f2, f3, fs)
    };
    return G__15228
  }();
  comp = function(f1, f2, f3, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 0:
        return comp__0.call(this);
      case 1:
        return comp__1.call(this, f1);
      case 2:
        return comp__2.call(this, f1, f2);
      case 3:
        return comp__3.call(this, f1, f2, f3);
      default:
        return comp__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  comp.cljs$lang$maxFixedArity = 3;
  comp.cljs$lang$applyTo = comp__4.cljs$lang$applyTo;
  comp.__0 = comp__0;
  comp.__1 = comp__1;
  comp.__2 = comp__2;
  comp.__3 = comp__3;
  comp.__4 = comp__4;
  return comp
}();
cljs.core.partial = function() {
  var partial = null;
  var partial__2 = function(f, arg1) {
    return function() {
      var G__15235__delegate = function(args) {
        return cljs.core.apply.__3(f, arg1, args)
      };
      var G__15235 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__15235__delegate.call(this, args)
      };
      G__15235.cljs$lang$maxFixedArity = 0;
      G__15235.cljs$lang$applyTo = function(arglist__15236) {
        var args = cljs.core.seq(arglist__15236);
        return G__15235__delegate.call(this, args)
      };
      return G__15235
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__15237__delegate = function(args) {
        return cljs.core.apply.__4(f, arg1, arg2, args)
      };
      var G__15237 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__15237__delegate.call(this, args)
      };
      G__15237.cljs$lang$maxFixedArity = 0;
      G__15237.cljs$lang$applyTo = function(arglist__15238) {
        var args = cljs.core.seq(arglist__15238);
        return G__15237__delegate.call(this, args)
      };
      return G__15237
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__15239__delegate = function(args) {
        return cljs.core.apply.__5(f, arg1, arg2, arg3, args)
      };
      var G__15239 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__15239__delegate.call(this, args)
      };
      G__15239.cljs$lang$maxFixedArity = 0;
      G__15239.cljs$lang$applyTo = function(arglist__15240) {
        var args = cljs.core.seq(arglist__15240);
        return G__15239__delegate.call(this, args)
      };
      return G__15239
    }()
  };
  var partial__5 = function() {
    var G__15241__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__15242__delegate = function(args) {
          return cljs.core.apply.__5(f, arg1, arg2, arg3, cljs.core.concat.__2(more, args))
        };
        var G__15242 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__15242__delegate.call(this, args)
        };
        G__15242.cljs$lang$maxFixedArity = 0;
        G__15242.cljs$lang$applyTo = function(arglist__15243) {
          var args = cljs.core.seq(arglist__15243);
          return G__15242__delegate.call(this, args)
        };
        return G__15242
      }()
    };
    var G__15241 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__15241__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__15241.cljs$lang$maxFixedArity = 4;
    G__15241.cljs$lang$applyTo = function(arglist__15244) {
      var f = cljs.core.first(arglist__15244);
      var arg1 = cljs.core.first(cljs.core.next(arglist__15244));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15244)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15244))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15244))));
      return G__15241__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    return G__15241
  }();
  partial = function(f, arg1, arg2, arg3, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return partial__2.call(this, f, arg1);
      case 3:
        return partial__3.call(this, f, arg1, arg2);
      case 4:
        return partial__4.call(this, f, arg1, arg2, arg3);
      default:
        return partial__5.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partial.cljs$lang$maxFixedArity = 4;
  partial.cljs$lang$applyTo = partial__5.cljs$lang$applyTo;
  partial.__2 = partial__2;
  partial.__3 = partial__3;
  partial.__4 = partial__4;
  partial.__5 = partial__5;
  return partial
}();
cljs.core.fnil = function() {
  var fnil = null;
  var fnil__2 = function(f, x) {
    return function() {
      var G__15245 = null;
      var G__15245__1 = function(a) {
        return f.call(null, a === null ? x : a)
      };
      var G__15245__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b)
      };
      var G__15245__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b, c)
      };
      var G__15245__4 = function() {
        var G__15246__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b, c, ds)
        };
        var G__15246 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15246__delegate.call(this, a, b, c, ds)
        };
        G__15246.cljs$lang$maxFixedArity = 3;
        G__15246.cljs$lang$applyTo = function(arglist__15247) {
          var a = cljs.core.first(arglist__15247);
          var b = cljs.core.first(cljs.core.next(arglist__15247));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15247)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15247)));
          return G__15246__delegate.call(this, a, b, c, ds)
        };
        return G__15246
      }();
      G__15245 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__15245__1.call(this, a);
          case 2:
            return G__15245__2.call(this, a, b);
          case 3:
            return G__15245__3.call(this, a, b, c);
          default:
            return G__15245__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__15245.cljs$lang$maxFixedArity = 3;
      G__15245.cljs$lang$applyTo = G__15245__4.cljs$lang$applyTo;
      return G__15245
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__15248 = null;
      var G__15248__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b === null ? y : b)
      };
      var G__15248__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b === null ? y : b, c)
      };
      var G__15248__4 = function() {
        var G__15249__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b === null ? y : b, c, ds)
        };
        var G__15249 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15249__delegate.call(this, a, b, c, ds)
        };
        G__15249.cljs$lang$maxFixedArity = 3;
        G__15249.cljs$lang$applyTo = function(arglist__15250) {
          var a = cljs.core.first(arglist__15250);
          var b = cljs.core.first(cljs.core.next(arglist__15250));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15250)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15250)));
          return G__15249__delegate.call(this, a, b, c, ds)
        };
        return G__15249
      }();
      G__15248 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__15248__2.call(this, a, b);
          case 3:
            return G__15248__3.call(this, a, b, c);
          default:
            return G__15248__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__15248.cljs$lang$maxFixedArity = 3;
      G__15248.cljs$lang$applyTo = G__15248__4.cljs$lang$applyTo;
      return G__15248
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__15251 = null;
      var G__15251__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b === null ? y : b)
      };
      var G__15251__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b === null ? y : b, c === null ? z : c)
      };
      var G__15251__4 = function() {
        var G__15252__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b === null ? y : b, c === null ? z : c, ds)
        };
        var G__15252 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15252__delegate.call(this, a, b, c, ds)
        };
        G__15252.cljs$lang$maxFixedArity = 3;
        G__15252.cljs$lang$applyTo = function(arglist__15253) {
          var a = cljs.core.first(arglist__15253);
          var b = cljs.core.first(cljs.core.next(arglist__15253));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15253)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15253)));
          return G__15252__delegate.call(this, a, b, c, ds)
        };
        return G__15252
      }();
      G__15251 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__15251__2.call(this, a, b);
          case 3:
            return G__15251__3.call(this, a, b, c);
          default:
            return G__15251__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__15251.cljs$lang$maxFixedArity = 3;
      G__15251.cljs$lang$applyTo = G__15251__4.cljs$lang$applyTo;
      return G__15251
    }()
  };
  fnil = function(f, x, y, z) {
    switch(arguments.length) {
      case 2:
        return fnil__2.call(this, f, x);
      case 3:
        return fnil__3.call(this, f, x, y);
      case 4:
        return fnil__4.call(this, f, x, y, z)
    }
    throw"Invalid arity: " + arguments.length;
  };
  fnil.__2 = fnil__2;
  fnil.__3 = fnil__3;
  fnil.__4 = fnil__4;
  return fnil
}();
cljs.core.map_indexed = function map_indexed(f, coll) {
  var mapi__15256 = function mpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15254 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15254)) {
        var s__15255 = temp__3850__auto____15254;
        return cljs.core.cons(f.call(null, idx, cljs.core.first(s__15255)), mpi.call(null, idx + 1, cljs.core.rest(s__15255)))
      }else {
        return null
      }
    })
  };
  return mapi__15256.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____15258 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____15258)) {
      var s__15259 = temp__3850__auto____15258;
      var x__15260 = f.call(null, cljs.core.first(s__15259));
      if(x__15260 === null) {
        return keep.call(null, f, cljs.core.rest(s__15259))
      }else {
        return cljs.core.cons(x__15260, keep.call(null, f, cljs.core.rest(s__15259)))
      }
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__15272 = function kpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15269 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15269)) {
        var s__15270 = temp__3850__auto____15269;
        var x__15271 = f.call(null, idx, cljs.core.first(s__15270));
        if(x__15271 === null) {
          return kpi.call(null, idx + 1, cljs.core.rest(s__15270))
        }else {
          return cljs.core.cons(x__15271, kpi.call(null, idx + 1, cljs.core.rest(s__15270)))
        }
      }else {
        return null
      }
    })
  };
  return keepi__15272.call(null, 0, coll)
};
cljs.core.every_pred = function() {
  var every_pred = null;
  var every_pred__1 = function(p) {
    return function() {
      var ep1 = null;
      var ep1__0 = function() {
        return true
      };
      var ep1__1 = function(x) {
        return cljs.core.boolean$(p.call(null, x))
      };
      var ep1__2 = function(x, y) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15281 = p.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15281)) {
            return p.call(null, y)
          }else {
            return and__3698__auto____15281
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15282 = p.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15282)) {
            var and__3698__auto____15283 = p.call(null, y);
            if(cljs.core.truth_(and__3698__auto____15283)) {
              return p.call(null, z)
            }else {
              return and__3698__auto____15283
            }
          }else {
            return and__3698__auto____15282
          }
        }())
      };
      var ep1__4 = function() {
        var G__15322__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____15284 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____15284)) {
              return cljs.core.every_QMARK_(p, args)
            }else {
              return and__3698__auto____15284
            }
          }())
        };
        var G__15322 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15322__delegate.call(this, x, y, z, args)
        };
        G__15322.cljs$lang$maxFixedArity = 3;
        G__15322.cljs$lang$applyTo = function(arglist__15324) {
          var x = cljs.core.first(arglist__15324);
          var y = cljs.core.first(cljs.core.next(arglist__15324));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15324)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15324)));
          return G__15322__delegate.call(this, x, y, z, args)
        };
        return G__15322
      }();
      ep1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep1__0.call(this);
          case 1:
            return ep1__1.call(this, x);
          case 2:
            return ep1__2.call(this, x, y);
          case 3:
            return ep1__3.call(this, x, y, z);
          default:
            return ep1__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep1.cljs$lang$maxFixedArity = 3;
      ep1.cljs$lang$applyTo = ep1__4.cljs$lang$applyTo;
      ep1.__0 = ep1__0;
      ep1.__1 = ep1__1;
      ep1.__2 = ep1__2;
      ep1.__3 = ep1__3;
      ep1.__4 = ep1__4;
      return ep1
    }()
  };
  var every_pred__2 = function(p1, p2) {
    return function() {
      var ep2 = null;
      var ep2__0 = function() {
        return true
      };
      var ep2__1 = function(x) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15285 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15285)) {
            return p2.call(null, x)
          }else {
            return and__3698__auto____15285
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15286 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15286)) {
            var and__3698__auto____15287 = p1.call(null, y);
            if(cljs.core.truth_(and__3698__auto____15287)) {
              var and__3698__auto____15288 = p2.call(null, x);
              if(cljs.core.truth_(and__3698__auto____15288)) {
                return p2.call(null, y)
              }else {
                return and__3698__auto____15288
              }
            }else {
              return and__3698__auto____15287
            }
          }else {
            return and__3698__auto____15286
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15289 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15289)) {
            var and__3698__auto____15290 = p1.call(null, y);
            if(cljs.core.truth_(and__3698__auto____15290)) {
              var and__3698__auto____15291 = p1.call(null, z);
              if(cljs.core.truth_(and__3698__auto____15291)) {
                var and__3698__auto____15292 = p2.call(null, x);
                if(cljs.core.truth_(and__3698__auto____15292)) {
                  var and__3698__auto____15293 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____15293)) {
                    return p2.call(null, z)
                  }else {
                    return and__3698__auto____15293
                  }
                }else {
                  return and__3698__auto____15292
                }
              }else {
                return and__3698__auto____15291
              }
            }else {
              return and__3698__auto____15290
            }
          }else {
            return and__3698__auto____15289
          }
        }())
      };
      var ep2__4 = function() {
        var G__15334__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____15294 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____15294)) {
              return cljs.core.every_QMARK_(function(p1__15263_SHARP_) {
                var and__3698__auto____15295 = p1.call(null, p1__15263_SHARP_);
                if(cljs.core.truth_(and__3698__auto____15295)) {
                  return p2.call(null, p1__15263_SHARP_)
                }else {
                  return and__3698__auto____15295
                }
              }, args)
            }else {
              return and__3698__auto____15294
            }
          }())
        };
        var G__15334 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15334__delegate.call(this, x, y, z, args)
        };
        G__15334.cljs$lang$maxFixedArity = 3;
        G__15334.cljs$lang$applyTo = function(arglist__15337) {
          var x = cljs.core.first(arglist__15337);
          var y = cljs.core.first(cljs.core.next(arglist__15337));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15337)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15337)));
          return G__15334__delegate.call(this, x, y, z, args)
        };
        return G__15334
      }();
      ep2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep2__0.call(this);
          case 1:
            return ep2__1.call(this, x);
          case 2:
            return ep2__2.call(this, x, y);
          case 3:
            return ep2__3.call(this, x, y, z);
          default:
            return ep2__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep2.cljs$lang$maxFixedArity = 3;
      ep2.cljs$lang$applyTo = ep2__4.cljs$lang$applyTo;
      ep2.__0 = ep2__0;
      ep2.__1 = ep2__1;
      ep2.__2 = ep2__2;
      ep2.__3 = ep2__3;
      ep2.__4 = ep2__4;
      return ep2
    }()
  };
  var every_pred__3 = function(p1, p2, p3) {
    return function() {
      var ep3 = null;
      var ep3__0 = function() {
        return true
      };
      var ep3__1 = function(x) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15296 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15296)) {
            var and__3698__auto____15297 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____15297)) {
              return p3.call(null, x)
            }else {
              return and__3698__auto____15297
            }
          }else {
            return and__3698__auto____15296
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15298 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15298)) {
            var and__3698__auto____15299 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____15299)) {
              var and__3698__auto____15300 = p3.call(null, x);
              if(cljs.core.truth_(and__3698__auto____15300)) {
                var and__3698__auto____15301 = p1.call(null, y);
                if(cljs.core.truth_(and__3698__auto____15301)) {
                  var and__3698__auto____15302 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____15302)) {
                    return p3.call(null, y)
                  }else {
                    return and__3698__auto____15302
                  }
                }else {
                  return and__3698__auto____15301
                }
              }else {
                return and__3698__auto____15300
              }
            }else {
              return and__3698__auto____15299
            }
          }else {
            return and__3698__auto____15298
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____15303 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____15303)) {
            var and__3698__auto____15304 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____15304)) {
              var and__3698__auto____15305 = p3.call(null, x);
              if(cljs.core.truth_(and__3698__auto____15305)) {
                var and__3698__auto____15306 = p1.call(null, y);
                if(cljs.core.truth_(and__3698__auto____15306)) {
                  var and__3698__auto____15307 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____15307)) {
                    var and__3698__auto____15308 = p3.call(null, y);
                    if(cljs.core.truth_(and__3698__auto____15308)) {
                      var and__3698__auto____15309 = p1.call(null, z);
                      if(cljs.core.truth_(and__3698__auto____15309)) {
                        var and__3698__auto____15310 = p2.call(null, z);
                        if(cljs.core.truth_(and__3698__auto____15310)) {
                          return p3.call(null, z)
                        }else {
                          return and__3698__auto____15310
                        }
                      }else {
                        return and__3698__auto____15309
                      }
                    }else {
                      return and__3698__auto____15308
                    }
                  }else {
                    return and__3698__auto____15307
                  }
                }else {
                  return and__3698__auto____15306
                }
              }else {
                return and__3698__auto____15305
              }
            }else {
              return and__3698__auto____15304
            }
          }else {
            return and__3698__auto____15303
          }
        }())
      };
      var ep3__4 = function() {
        var G__15353__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____15311 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____15311)) {
              return cljs.core.every_QMARK_(function(p1__15264_SHARP_) {
                var and__3698__auto____15312 = p1.call(null, p1__15264_SHARP_);
                if(cljs.core.truth_(and__3698__auto____15312)) {
                  var and__3698__auto____15313 = p2.call(null, p1__15264_SHARP_);
                  if(cljs.core.truth_(and__3698__auto____15313)) {
                    return p3.call(null, p1__15264_SHARP_)
                  }else {
                    return and__3698__auto____15313
                  }
                }else {
                  return and__3698__auto____15312
                }
              }, args)
            }else {
              return and__3698__auto____15311
            }
          }())
        };
        var G__15353 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15353__delegate.call(this, x, y, z, args)
        };
        G__15353.cljs$lang$maxFixedArity = 3;
        G__15353.cljs$lang$applyTo = function(arglist__15357) {
          var x = cljs.core.first(arglist__15357);
          var y = cljs.core.first(cljs.core.next(arglist__15357));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15357)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15357)));
          return G__15353__delegate.call(this, x, y, z, args)
        };
        return G__15353
      }();
      ep3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep3__0.call(this);
          case 1:
            return ep3__1.call(this, x);
          case 2:
            return ep3__2.call(this, x, y);
          case 3:
            return ep3__3.call(this, x, y, z);
          default:
            return ep3__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep3.cljs$lang$maxFixedArity = 3;
      ep3.cljs$lang$applyTo = ep3__4.cljs$lang$applyTo;
      ep3.__0 = ep3__0;
      ep3.__1 = ep3__1;
      ep3.__2 = ep3__2;
      ep3.__3 = ep3__3;
      ep3.__4 = ep3__4;
      return ep3
    }()
  };
  var every_pred__4 = function() {
    var G__15358__delegate = function(p1, p2, p3, ps) {
      var ps__15314 = cljs.core.list_STAR_.__4(p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_(function(p1__15265_SHARP_) {
            return p1__15265_SHARP_.call(null, x)
          }, ps__15314)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_(function(p1__15266_SHARP_) {
            var and__3698__auto____15315 = p1__15266_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3698__auto____15315)) {
              return p1__15266_SHARP_.call(null, y)
            }else {
              return and__3698__auto____15315
            }
          }, ps__15314)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_(function(p1__15267_SHARP_) {
            var and__3698__auto____15316 = p1__15267_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3698__auto____15316)) {
              var and__3698__auto____15317 = p1__15267_SHARP_.call(null, y);
              if(cljs.core.truth_(and__3698__auto____15317)) {
                return p1__15267_SHARP_.call(null, z)
              }else {
                return and__3698__auto____15317
              }
            }else {
              return and__3698__auto____15316
            }
          }, ps__15314)
        };
        var epn__4 = function() {
          var G__15362__delegate = function(x, y, z, args) {
            return cljs.core.boolean$(function() {
              var and__3698__auto____15318 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__3698__auto____15318)) {
                return cljs.core.every_QMARK_(function(p1__15268_SHARP_) {
                  return cljs.core.every_QMARK_(p1__15268_SHARP_, args)
                }, ps__15314)
              }else {
                return and__3698__auto____15318
              }
            }())
          };
          var G__15362 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__15362__delegate.call(this, x, y, z, args)
          };
          G__15362.cljs$lang$maxFixedArity = 3;
          G__15362.cljs$lang$applyTo = function(arglist__15364) {
            var x = cljs.core.first(arglist__15364);
            var y = cljs.core.first(cljs.core.next(arglist__15364));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15364)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15364)));
            return G__15362__delegate.call(this, x, y, z, args)
          };
          return G__15362
        }();
        epn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return epn__0.call(this);
            case 1:
              return epn__1.call(this, x);
            case 2:
              return epn__2.call(this, x, y);
            case 3:
              return epn__3.call(this, x, y, z);
            default:
              return epn__4.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        epn.cljs$lang$maxFixedArity = 3;
        epn.cljs$lang$applyTo = epn__4.cljs$lang$applyTo;
        epn.__0 = epn__0;
        epn.__1 = epn__1;
        epn.__2 = epn__2;
        epn.__3 = epn__3;
        epn.__4 = epn__4;
        return epn
      }()
    };
    var G__15358 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__15358__delegate.call(this, p1, p2, p3, ps)
    };
    G__15358.cljs$lang$maxFixedArity = 3;
    G__15358.cljs$lang$applyTo = function(arglist__15365) {
      var p1 = cljs.core.first(arglist__15365);
      var p2 = cljs.core.first(cljs.core.next(arglist__15365));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15365)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15365)));
      return G__15358__delegate.call(this, p1, p2, p3, ps)
    };
    return G__15358
  }();
  every_pred = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return every_pred__1.call(this, p1);
      case 2:
        return every_pred__2.call(this, p1, p2);
      case 3:
        return every_pred__3.call(this, p1, p2, p3);
      default:
        return every_pred__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  every_pred.cljs$lang$maxFixedArity = 3;
  every_pred.cljs$lang$applyTo = every_pred__4.cljs$lang$applyTo;
  every_pred.__1 = every_pred__1;
  every_pred.__2 = every_pred__2;
  every_pred.__3 = every_pred__3;
  every_pred.__4 = every_pred__4;
  return every_pred
}();
cljs.core.some_fn = function() {
  var some_fn = null;
  var some_fn__1 = function(p) {
    return function() {
      var sp1 = null;
      var sp1__0 = function() {
        return null
      };
      var sp1__1 = function(x) {
        return p.call(null, x)
      };
      var sp1__2 = function(x, y) {
        var or__3700__auto____15367 = p.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15367)) {
          return or__3700__auto____15367
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__3700__auto____15368 = p.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15368)) {
          return or__3700__auto____15368
        }else {
          var or__3700__auto____15369 = p.call(null, y);
          if(cljs.core.truth_(or__3700__auto____15369)) {
            return or__3700__auto____15369
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__15408__delegate = function(x, y, z, args) {
          var or__3700__auto____15370 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____15370)) {
            return or__3700__auto____15370
          }else {
            return cljs.core.some(p, args)
          }
        };
        var G__15408 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15408__delegate.call(this, x, y, z, args)
        };
        G__15408.cljs$lang$maxFixedArity = 3;
        G__15408.cljs$lang$applyTo = function(arglist__15410) {
          var x = cljs.core.first(arglist__15410);
          var y = cljs.core.first(cljs.core.next(arglist__15410));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15410)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15410)));
          return G__15408__delegate.call(this, x, y, z, args)
        };
        return G__15408
      }();
      sp1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp1__0.call(this);
          case 1:
            return sp1__1.call(this, x);
          case 2:
            return sp1__2.call(this, x, y);
          case 3:
            return sp1__3.call(this, x, y, z);
          default:
            return sp1__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp1.cljs$lang$maxFixedArity = 3;
      sp1.cljs$lang$applyTo = sp1__4.cljs$lang$applyTo;
      sp1.__0 = sp1__0;
      sp1.__1 = sp1__1;
      sp1.__2 = sp1__2;
      sp1.__3 = sp1__3;
      sp1.__4 = sp1__4;
      return sp1
    }()
  };
  var some_fn__2 = function(p1, p2) {
    return function() {
      var sp2 = null;
      var sp2__0 = function() {
        return null
      };
      var sp2__1 = function(x) {
        var or__3700__auto____15371 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15371)) {
          return or__3700__auto____15371
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__3700__auto____15372 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15372)) {
          return or__3700__auto____15372
        }else {
          var or__3700__auto____15373 = p1.call(null, y);
          if(cljs.core.truth_(or__3700__auto____15373)) {
            return or__3700__auto____15373
          }else {
            var or__3700__auto____15374 = p2.call(null, x);
            if(cljs.core.truth_(or__3700__auto____15374)) {
              return or__3700__auto____15374
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__3700__auto____15375 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15375)) {
          return or__3700__auto____15375
        }else {
          var or__3700__auto____15376 = p1.call(null, y);
          if(cljs.core.truth_(or__3700__auto____15376)) {
            return or__3700__auto____15376
          }else {
            var or__3700__auto____15377 = p1.call(null, z);
            if(cljs.core.truth_(or__3700__auto____15377)) {
              return or__3700__auto____15377
            }else {
              var or__3700__auto____15378 = p2.call(null, x);
              if(cljs.core.truth_(or__3700__auto____15378)) {
                return or__3700__auto____15378
              }else {
                var or__3700__auto____15379 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____15379)) {
                  return or__3700__auto____15379
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__15420__delegate = function(x, y, z, args) {
          var or__3700__auto____15380 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____15380)) {
            return or__3700__auto____15380
          }else {
            return cljs.core.some(function(p1__15275_SHARP_) {
              var or__3700__auto____15381 = p1.call(null, p1__15275_SHARP_);
              if(cljs.core.truth_(or__3700__auto____15381)) {
                return or__3700__auto____15381
              }else {
                return p2.call(null, p1__15275_SHARP_)
              }
            }, args)
          }
        };
        var G__15420 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15420__delegate.call(this, x, y, z, args)
        };
        G__15420.cljs$lang$maxFixedArity = 3;
        G__15420.cljs$lang$applyTo = function(arglist__15423) {
          var x = cljs.core.first(arglist__15423);
          var y = cljs.core.first(cljs.core.next(arglist__15423));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15423)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15423)));
          return G__15420__delegate.call(this, x, y, z, args)
        };
        return G__15420
      }();
      sp2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp2__0.call(this);
          case 1:
            return sp2__1.call(this, x);
          case 2:
            return sp2__2.call(this, x, y);
          case 3:
            return sp2__3.call(this, x, y, z);
          default:
            return sp2__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp2.cljs$lang$maxFixedArity = 3;
      sp2.cljs$lang$applyTo = sp2__4.cljs$lang$applyTo;
      sp2.__0 = sp2__0;
      sp2.__1 = sp2__1;
      sp2.__2 = sp2__2;
      sp2.__3 = sp2__3;
      sp2.__4 = sp2__4;
      return sp2
    }()
  };
  var some_fn__3 = function(p1, p2, p3) {
    return function() {
      var sp3 = null;
      var sp3__0 = function() {
        return null
      };
      var sp3__1 = function(x) {
        var or__3700__auto____15382 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15382)) {
          return or__3700__auto____15382
        }else {
          var or__3700__auto____15383 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____15383)) {
            return or__3700__auto____15383
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__3700__auto____15384 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15384)) {
          return or__3700__auto____15384
        }else {
          var or__3700__auto____15385 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____15385)) {
            return or__3700__auto____15385
          }else {
            var or__3700__auto____15386 = p3.call(null, x);
            if(cljs.core.truth_(or__3700__auto____15386)) {
              return or__3700__auto____15386
            }else {
              var or__3700__auto____15387 = p1.call(null, y);
              if(cljs.core.truth_(or__3700__auto____15387)) {
                return or__3700__auto____15387
              }else {
                var or__3700__auto____15388 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____15388)) {
                  return or__3700__auto____15388
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__3700__auto____15389 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____15389)) {
          return or__3700__auto____15389
        }else {
          var or__3700__auto____15390 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____15390)) {
            return or__3700__auto____15390
          }else {
            var or__3700__auto____15391 = p3.call(null, x);
            if(cljs.core.truth_(or__3700__auto____15391)) {
              return or__3700__auto____15391
            }else {
              var or__3700__auto____15392 = p1.call(null, y);
              if(cljs.core.truth_(or__3700__auto____15392)) {
                return or__3700__auto____15392
              }else {
                var or__3700__auto____15393 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____15393)) {
                  return or__3700__auto____15393
                }else {
                  var or__3700__auto____15394 = p3.call(null, y);
                  if(cljs.core.truth_(or__3700__auto____15394)) {
                    return or__3700__auto____15394
                  }else {
                    var or__3700__auto____15395 = p1.call(null, z);
                    if(cljs.core.truth_(or__3700__auto____15395)) {
                      return or__3700__auto____15395
                    }else {
                      var or__3700__auto____15396 = p2.call(null, z);
                      if(cljs.core.truth_(or__3700__auto____15396)) {
                        return or__3700__auto____15396
                      }else {
                        return p3.call(null, z)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      var sp3__4 = function() {
        var G__15439__delegate = function(x, y, z, args) {
          var or__3700__auto____15397 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____15397)) {
            return or__3700__auto____15397
          }else {
            return cljs.core.some(function(p1__15276_SHARP_) {
              var or__3700__auto____15398 = p1.call(null, p1__15276_SHARP_);
              if(cljs.core.truth_(or__3700__auto____15398)) {
                return or__3700__auto____15398
              }else {
                var or__3700__auto____15399 = p2.call(null, p1__15276_SHARP_);
                if(cljs.core.truth_(or__3700__auto____15399)) {
                  return or__3700__auto____15399
                }else {
                  return p3.call(null, p1__15276_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__15439 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__15439__delegate.call(this, x, y, z, args)
        };
        G__15439.cljs$lang$maxFixedArity = 3;
        G__15439.cljs$lang$applyTo = function(arglist__15443) {
          var x = cljs.core.first(arglist__15443);
          var y = cljs.core.first(cljs.core.next(arglist__15443));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15443)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15443)));
          return G__15439__delegate.call(this, x, y, z, args)
        };
        return G__15439
      }();
      sp3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp3__0.call(this);
          case 1:
            return sp3__1.call(this, x);
          case 2:
            return sp3__2.call(this, x, y);
          case 3:
            return sp3__3.call(this, x, y, z);
          default:
            return sp3__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp3.cljs$lang$maxFixedArity = 3;
      sp3.cljs$lang$applyTo = sp3__4.cljs$lang$applyTo;
      sp3.__0 = sp3__0;
      sp3.__1 = sp3__1;
      sp3.__2 = sp3__2;
      sp3.__3 = sp3__3;
      sp3.__4 = sp3__4;
      return sp3
    }()
  };
  var some_fn__4 = function() {
    var G__15444__delegate = function(p1, p2, p3, ps) {
      var ps__15400 = cljs.core.list_STAR_.__4(p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some(function(p1__15277_SHARP_) {
            return p1__15277_SHARP_.call(null, x)
          }, ps__15400)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some(function(p1__15278_SHARP_) {
            var or__3700__auto____15401 = p1__15278_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3700__auto____15401)) {
              return or__3700__auto____15401
            }else {
              return p1__15278_SHARP_.call(null, y)
            }
          }, ps__15400)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some(function(p1__15279_SHARP_) {
            var or__3700__auto____15402 = p1__15279_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3700__auto____15402)) {
              return or__3700__auto____15402
            }else {
              var or__3700__auto____15403 = p1__15279_SHARP_.call(null, y);
              if(cljs.core.truth_(or__3700__auto____15403)) {
                return or__3700__auto____15403
              }else {
                return p1__15279_SHARP_.call(null, z)
              }
            }
          }, ps__15400)
        };
        var spn__4 = function() {
          var G__15448__delegate = function(x, y, z, args) {
            var or__3700__auto____15404 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__3700__auto____15404)) {
              return or__3700__auto____15404
            }else {
              return cljs.core.some(function(p1__15280_SHARP_) {
                return cljs.core.some(p1__15280_SHARP_, args)
              }, ps__15400)
            }
          };
          var G__15448 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__15448__delegate.call(this, x, y, z, args)
          };
          G__15448.cljs$lang$maxFixedArity = 3;
          G__15448.cljs$lang$applyTo = function(arglist__15450) {
            var x = cljs.core.first(arglist__15450);
            var y = cljs.core.first(cljs.core.next(arglist__15450));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15450)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15450)));
            return G__15448__delegate.call(this, x, y, z, args)
          };
          return G__15448
        }();
        spn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return spn__0.call(this);
            case 1:
              return spn__1.call(this, x);
            case 2:
              return spn__2.call(this, x, y);
            case 3:
              return spn__3.call(this, x, y, z);
            default:
              return spn__4.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        spn.cljs$lang$maxFixedArity = 3;
        spn.cljs$lang$applyTo = spn__4.cljs$lang$applyTo;
        spn.__0 = spn__0;
        spn.__1 = spn__1;
        spn.__2 = spn__2;
        spn.__3 = spn__3;
        spn.__4 = spn__4;
        return spn
      }()
    };
    var G__15444 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__15444__delegate.call(this, p1, p2, p3, ps)
    };
    G__15444.cljs$lang$maxFixedArity = 3;
    G__15444.cljs$lang$applyTo = function(arglist__15451) {
      var p1 = cljs.core.first(arglist__15451);
      var p2 = cljs.core.first(cljs.core.next(arglist__15451));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15451)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15451)));
      return G__15444__delegate.call(this, p1, p2, p3, ps)
    };
    return G__15444
  }();
  some_fn = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return some_fn__1.call(this, p1);
      case 2:
        return some_fn__2.call(this, p1, p2);
      case 3:
        return some_fn__3.call(this, p1, p2, p3);
      default:
        return some_fn__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  some_fn.cljs$lang$maxFixedArity = 3;
  some_fn.cljs$lang$applyTo = some_fn__4.cljs$lang$applyTo;
  some_fn.__1 = some_fn__1;
  some_fn.__2 = some_fn__2;
  some_fn.__3 = some_fn__3;
  some_fn.__4 = some_fn__4;
  return some_fn
}();
cljs.core.map = function() {
  var map = null;
  var map__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15452 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15452)) {
        var s__15453 = temp__3850__auto____15452;
        return cljs.core.cons(f.call(null, cljs.core.first(s__15453)), map.call(null, f, cljs.core.rest(s__15453)))
      }else {
        return null
      }
    })
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__15454 = cljs.core.seq(c1);
      var s2__15455 = cljs.core.seq(c2);
      if(cljs.core.truth_(function() {
        var and__3698__auto____15456 = s1__15454;
        if(cljs.core.truth_(and__3698__auto____15456)) {
          return s2__15455
        }else {
          return and__3698__auto____15456
        }
      }())) {
        return cljs.core.cons(f.call(null, cljs.core.first(s1__15454), cljs.core.first(s2__15455)), map.call(null, f, cljs.core.rest(s1__15454), cljs.core.rest(s2__15455)))
      }else {
        return null
      }
    })
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__15457 = cljs.core.seq(c1);
      var s2__15458 = cljs.core.seq(c2);
      var s3__15459 = cljs.core.seq(c3);
      if(cljs.core.truth_(function() {
        var and__3698__auto____15460 = s1__15457;
        if(cljs.core.truth_(and__3698__auto____15460)) {
          var and__3698__auto____15461 = s2__15458;
          if(cljs.core.truth_(and__3698__auto____15461)) {
            return s3__15459
          }else {
            return and__3698__auto____15461
          }
        }else {
          return and__3698__auto____15460
        }
      }())) {
        return cljs.core.cons(f.call(null, cljs.core.first(s1__15457), cljs.core.first(s2__15458), cljs.core.first(s3__15459)), map.call(null, f, cljs.core.rest(s1__15457), cljs.core.rest(s2__15458), cljs.core.rest(s3__15459)))
      }else {
        return null
      }
    })
  };
  var map__5 = function() {
    var G__15470__delegate = function(f, c1, c2, c3, colls) {
      var step__15463 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__15462 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.truth_(cljs.core.every_QMARK_(cljs.core.identity, ss__15462))) {
            return cljs.core.cons(map.call(null, cljs.core.first, ss__15462), step.call(null, map.call(null, cljs.core.rest, ss__15462)))
          }else {
            return null
          }
        })
      };
      return map.call(null, function(p1__15366_SHARP_) {
        return cljs.core.apply.__2(f, p1__15366_SHARP_)
      }, step__15463.call(null, cljs.core.conj(colls, c3, c2, c1)))
    };
    var G__15470 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__15470__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__15470.cljs$lang$maxFixedArity = 4;
    G__15470.cljs$lang$applyTo = function(arglist__15472) {
      var f = cljs.core.first(arglist__15472);
      var c1 = cljs.core.first(cljs.core.next(arglist__15472));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15472)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15472))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__15472))));
      return G__15470__delegate.call(this, f, c1, c2, c3, colls)
    };
    return G__15470
  }();
  map = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return map__2.call(this, f, c1);
      case 3:
        return map__3.call(this, f, c1, c2);
      case 4:
        return map__4.call(this, f, c1, c2, c3);
      default:
        return map__5.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  map.cljs$lang$maxFixedArity = 4;
  map.cljs$lang$applyTo = map__5.cljs$lang$applyTo;
  map.__2 = map__2;
  map.__3 = map__3;
  map.__4 = map__4;
  map.__5 = map__5;
  return map
}();
cljs.core.take = function take(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    if(n > 0) {
      var temp__3850__auto____15473 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15473)) {
        var s__15474 = temp__3850__auto____15473;
        return cljs.core.cons(cljs.core.first(s__15474), take.call(null, n - 1, cljs.core.rest(s__15474)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.drop = function drop(n, coll) {
  var step__15479 = function(n, coll) {
    while(true) {
      var s__15477 = cljs.core.seq(coll);
      if(cljs.core.truth_(function() {
        var and__3698__auto____15478 = n > 0;
        if(and__3698__auto____15478) {
          return s__15477
        }else {
          return and__3698__auto____15478
        }
      }())) {
        var G__15482 = n - 1;
        var G__15483 = cljs.core.rest(s__15477);
        n = G__15482;
        coll = G__15483;
        continue
      }else {
        return s__15477
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__15479.call(null, n, coll)
  })
};
cljs.core.drop_last = function() {
  var drop_last = null;
  var drop_last__1 = function(s) {
    return drop_last.call(null, 1, s)
  };
  var drop_last__2 = function(n, s) {
    return cljs.core.map.__3(function(x, _) {
      return x
    }, s, cljs.core.drop(n, s))
  };
  drop_last = function(n, s) {
    switch(arguments.length) {
      case 1:
        return drop_last__1.call(this, n);
      case 2:
        return drop_last__2.call(this, n, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  drop_last.__1 = drop_last__1;
  drop_last.__2 = drop_last__2;
  return drop_last
}();
cljs.core.take_last = function take_last(n, coll) {
  var s__15484 = cljs.core.seq(coll);
  var lead__15485 = cljs.core.seq(cljs.core.drop(n, coll));
  while(true) {
    if(cljs.core.truth_(lead__15485)) {
      var G__15487 = cljs.core.next(s__15484);
      var G__15488 = cljs.core.next(lead__15485);
      s__15484 = G__15487;
      lead__15485 = G__15488;
      continue
    }else {
      return s__15484
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__15491 = function(pred, coll) {
    while(true) {
      var s__15489 = cljs.core.seq(coll);
      if(cljs.core.truth_(function() {
        var and__3698__auto____15490 = s__15489;
        if(cljs.core.truth_(and__3698__auto____15490)) {
          return pred.call(null, cljs.core.first(s__15489))
        }else {
          return and__3698__auto____15490
        }
      }())) {
        var G__15494 = pred;
        var G__15495 = cljs.core.rest(s__15489);
        pred = G__15494;
        coll = G__15495;
        continue
      }else {
        return s__15489
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__15491.call(null, pred, coll)
  })
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____15496 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____15496)) {
      var s__15497 = temp__3850__auto____15496;
      return cljs.core.concat.__2(s__15497, cycle.call(null, s__15497))
    }else {
      return null
    }
  })
};
cljs.core.split_at = function split_at(n, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take(n, coll), cljs.core.drop(n, coll)])
};
cljs.core.repeat = function() {
  var repeat = null;
  var repeat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(x, repeat.call(null, x))
    })
  };
  var repeat__2 = function(n, x) {
    return cljs.core.take(n, repeat.call(null, x))
  };
  repeat = function(n, x) {
    switch(arguments.length) {
      case 1:
        return repeat__1.call(this, n);
      case 2:
        return repeat__2.call(this, n, x)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeat.__1 = repeat__1;
  repeat.__2 = repeat__2;
  return repeat
}();
cljs.core.replicate = function replicate(n, x) {
  return cljs.core.take(n, cljs.core.repeat.__1(x))
};
cljs.core.repeatedly = function() {
  var repeatedly = null;
  var repeatedly__1 = function(f) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(f.call(null), repeatedly.call(null, f))
    })
  };
  var repeatedly__2 = function(n, f) {
    return cljs.core.take(n, repeatedly.call(null, f))
  };
  repeatedly = function(n, f) {
    switch(arguments.length) {
      case 1:
        return repeatedly__1.call(this, n);
      case 2:
        return repeatedly__2.call(this, n, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeatedly.__1 = repeatedly__1;
  repeatedly.__2 = repeatedly__2;
  return repeatedly
}();
cljs.core.iterate = function iterate(f, x) {
  return cljs.core.cons(x, new cljs.core.LazySeq(null, false, function() {
    return iterate.call(null, f, f.call(null, x))
  }))
};
cljs.core.interleave = function() {
  var interleave = null;
  var interleave__2 = function(c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__15499 = cljs.core.seq(c1);
      var s2__15500 = cljs.core.seq(c2);
      if(cljs.core.truth_(function() {
        var and__3698__auto____15501 = s1__15499;
        if(cljs.core.truth_(and__3698__auto____15501)) {
          return s2__15500
        }else {
          return and__3698__auto____15501
        }
      }())) {
        return cljs.core.cons(cljs.core.first(s1__15499), cljs.core.cons(cljs.core.first(s2__15500), interleave.call(null, cljs.core.rest(s1__15499), cljs.core.rest(s2__15500))))
      }else {
        return null
      }
    })
  };
  var interleave__3 = function() {
    var G__15505__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__15502 = cljs.core.map.__2(cljs.core.seq, cljs.core.conj(colls, c2, c1));
        if(cljs.core.truth_(cljs.core.every_QMARK_(cljs.core.identity, ss__15502))) {
          return cljs.core.concat.__2(cljs.core.map.__2(cljs.core.first, ss__15502), cljs.core.apply.__2(interleave, cljs.core.map.__2(cljs.core.rest, ss__15502)))
        }else {
          return null
        }
      })
    };
    var G__15505 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15505__delegate.call(this, c1, c2, colls)
    };
    G__15505.cljs$lang$maxFixedArity = 2;
    G__15505.cljs$lang$applyTo = function(arglist__15507) {
      var c1 = cljs.core.first(arglist__15507);
      var c2 = cljs.core.first(cljs.core.next(arglist__15507));
      var colls = cljs.core.rest(cljs.core.next(arglist__15507));
      return G__15505__delegate.call(this, c1, c2, colls)
    };
    return G__15505
  }();
  interleave = function(c1, c2, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return interleave__2.call(this, c1, c2);
      default:
        return interleave__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  interleave.cljs$lang$maxFixedArity = 2;
  interleave.cljs$lang$applyTo = interleave__3.cljs$lang$applyTo;
  interleave.__2 = interleave__2;
  interleave.__3 = interleave__3;
  return interleave
}();
cljs.core.interpose = function interpose(sep, coll) {
  return cljs.core.drop(1, cljs.core.interleave.__2(cljs.core.repeat.__1(sep), coll))
};
cljs.core.flatten1 = function flatten1(colls) {
  var cat__15510 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3847__auto____15508 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3847__auto____15508)) {
        var coll__15509 = temp__3847__auto____15508;
        return cljs.core.cons(cljs.core.first(coll__15509), cat.call(null, cljs.core.rest(coll__15509), colls))
      }else {
        if(cljs.core.truth_(cljs.core.seq(colls))) {
          return cat.call(null, cljs.core.first(colls), cljs.core.rest(colls))
        }else {
          return null
        }
      }
    })
  };
  return cat__15510.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1(cljs.core.map.__2(f, coll))
  };
  var mapcat__3 = function() {
    var G__15513__delegate = function(f, coll, colls) {
      return cljs.core.flatten1(cljs.core.apply.__4(cljs.core.map, f, coll, colls))
    };
    var G__15513 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__15513__delegate.call(this, f, coll, colls)
    };
    G__15513.cljs$lang$maxFixedArity = 2;
    G__15513.cljs$lang$applyTo = function(arglist__15514) {
      var f = cljs.core.first(arglist__15514);
      var coll = cljs.core.first(cljs.core.next(arglist__15514));
      var colls = cljs.core.rest(cljs.core.next(arglist__15514));
      return G__15513__delegate.call(this, f, coll, colls)
    };
    return G__15513
  }();
  mapcat = function(f, coll, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapcat__2.call(this, f, coll);
      default:
        return mapcat__3.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapcat.cljs$lang$maxFixedArity = 2;
  mapcat.cljs$lang$applyTo = mapcat__3.cljs$lang$applyTo;
  mapcat.__2 = mapcat__2;
  mapcat.__3 = mapcat__3;
  return mapcat
}();
cljs.core.filter = function filter(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____15515 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____15515)) {
      var s__15516 = temp__3850__auto____15515;
      var f__15517 = cljs.core.first(s__15516);
      var r__15518 = cljs.core.rest(s__15516);
      if(cljs.core.truth_(pred.call(null, f__15517))) {
        return cljs.core.cons(f__15517, filter.call(null, pred, r__15518))
      }else {
        return filter.call(null, pred, r__15518)
      }
    }else {
      return null
    }
  })
};
cljs.core.remove = function remove(pred, coll) {
  return cljs.core.filter(cljs.core.complement(pred), coll)
};
cljs.core.tree_seq = function tree_seq(branch_QMARK_, children, root) {
  var walk__15522 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.__2(walk, children.call(null, node)) : null)
    })
  };
  return walk__15522.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter(function(p1__15521_SHARP_) {
    return cljs.core.not(cljs.core.sequential_QMARK_(p1__15521_SHARP_))
  }, cljs.core.rest(cljs.core.tree_seq(cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  return cljs.core.reduce.__3(cljs.core._conj, to, from)
};
cljs.core.partition = function() {
  var partition = null;
  var partition__2 = function(n, coll) {
    return partition.call(null, n, n, coll)
  };
  var partition__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15523 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15523)) {
        var s__15524 = temp__3850__auto____15523;
        var p__15525 = cljs.core.take(n, s__15524);
        if(cljs.core.truth_(cljs.core._EQ_(n, cljs.core.count(p__15525)))) {
          return cljs.core.cons(p__15525, partition.call(null, n, step, cljs.core.drop(step, s__15524)))
        }else {
          return null
        }
      }else {
        return null
      }
    })
  };
  var partition__4 = function(n, step, pad, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15526 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15526)) {
        var s__15527 = temp__3850__auto____15526;
        var p__15528 = cljs.core.take(n, s__15527);
        if(cljs.core.truth_(cljs.core._EQ_(n, cljs.core.count(p__15528)))) {
          return cljs.core.cons(p__15528, partition.call(null, n, step, pad, cljs.core.drop(step, s__15527)))
        }else {
          return cljs.core.list(cljs.core.take(n, cljs.core.concat.__2(p__15528, pad)))
        }
      }else {
        return null
      }
    })
  };
  partition = function(n, step, pad, coll) {
    switch(arguments.length) {
      case 2:
        return partition__2.call(this, n, step);
      case 3:
        return partition__3.call(this, n, step, pad);
      case 4:
        return partition__4.call(this, n, step, pad, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition.__2 = partition__2;
  partition.__3 = partition__3;
  partition.__4 = partition__4;
  return partition
}();
cljs.core.get_in = function() {
  var get_in = null;
  var get_in__2 = function(m, ks) {
    return cljs.core.reduce.__3(cljs.core.get, m, ks)
  };
  var get_in__3 = function(m, ks, not_found) {
    var sentinel__15533 = cljs.core.lookup_sentinel;
    var m__15534 = m;
    var ks__15535 = cljs.core.seq(ks);
    while(true) {
      if(cljs.core.truth_(ks__15535)) {
        var m__15536 = cljs.core.get.__3(m__15534, cljs.core.first(ks__15535), sentinel__15533);
        if(sentinel__15533 === m__15536) {
          return not_found
        }else {
          var G__15539 = sentinel__15533;
          var G__15540 = m__15536;
          var G__15541 = cljs.core.next(ks__15535);
          sentinel__15533 = G__15539;
          m__15534 = G__15540;
          ks__15535 = G__15541;
          continue
        }
      }else {
        return m__15534
      }
      break
    }
  };
  get_in = function(m, ks, not_found) {
    switch(arguments.length) {
      case 2:
        return get_in__2.call(this, m, ks);
      case 3:
        return get_in__3.call(this, m, ks, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get_in.__2 = get_in__2;
  get_in.__3 = get_in__3;
  return get_in
}();
cljs.core.assoc_in = function assoc_in(m, p__15542, v) {
  var vec__15543__15544 = p__15542;
  var k__15545 = cljs.core.nth.call(null, vec__15543__15544, 0, null);
  var ks__15546 = cljs.core.nthnext.call(null, vec__15543__15544, 1);
  if(cljs.core.truth_(ks__15546)) {
    return cljs.core.assoc.__3(m, k__15545, assoc_in.call(null, cljs.core.get.__2(m, k__15545), ks__15546, v))
  }else {
    return cljs.core.assoc.__3(m, k__15545, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__15548, f, args) {
    var vec__15549__15550 = p__15548;
    var k__15551 = cljs.core.nth.call(null, vec__15549__15550, 0, null);
    var ks__15552 = cljs.core.nthnext.call(null, vec__15549__15550, 1);
    if(cljs.core.truth_(ks__15552)) {
      return cljs.core.assoc.__3(m, k__15551, cljs.core.apply.__5(update_in, cljs.core.get.__2(m, k__15551), ks__15552, f, args))
    }else {
      return cljs.core.assoc.__3(m, k__15551, cljs.core.apply.__3(f, cljs.core.get.__2(m, k__15551), args))
    }
  };
  var update_in = function(m, p__15548, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__15548, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__15554) {
    var m = cljs.core.first(arglist__15554);
    var p__15548 = cljs.core.first(cljs.core.next(arglist__15554));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15554)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15554)));
    return update_in__delegate.call(this, m, p__15548, f, args)
  };
  return update_in
}();
cljs.core.Vector = function(meta, array) {
  this.meta = meta;
  this.array = array
};
cljs.core.Vector.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$ = true;
cljs.core.Vector.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15555 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__15556 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__15557 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__15558 = this;
  var new_array__15559 = cljs.core.aclone(this__15558.array);
  new_array__15559[k] = v;
  return new cljs.core.Vector(this__15558.meta, new_array__15559)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = function() {
  var G__15588 = null;
  var G__15588__2 = function(tsym15560, k) {
    var this__15562 = this;
    var tsym15560__15563 = this;
    var coll__15564 = tsym15560__15563;
    return cljs.core._lookup.__2(coll__15564, k)
  };
  var G__15588__3 = function(tsym15561, k, not_found) {
    var this__15565 = this;
    var tsym15561__15566 = this;
    var coll__15567 = tsym15561__15566;
    return cljs.core._lookup.__3(coll__15567, k, not_found)
  };
  G__15588 = function(tsym15561, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15588__2.call(this, tsym15561, k);
      case 3:
        return G__15588__3.call(this, tsym15561, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15588
}();
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15568 = this;
  var new_array__15569 = cljs.core.aclone(this__15568.array);
  new_array__15569.push(o);
  return new cljs.core.Vector(this__15568.meta, new_array__15569)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce__2 = function(v, f) {
  var this__15570 = this;
  return cljs.core.ci_reduce.__2(this__15570.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce__3 = function(v, f, start) {
  var this__15571 = this;
  return cljs.core.ci_reduce.__3(this__15571.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15572 = this;
  if(this__15572.array.length > 0) {
    var vector_seq__15573 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__15572.array.length) {
          return cljs.core.cons(this__15572.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__15573.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15574 = this;
  return this__15574.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15575 = this;
  var count__15576 = this__15575.array.length;
  if(count__15576 > 0) {
    return this__15575.array[count__15576 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15577 = this;
  if(this__15577.array.length > 0) {
    var new_array__15578 = cljs.core.aclone(this__15577.array);
    new_array__15578.pop();
    return new cljs.core.Vector(this__15577.meta, new_array__15578)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n__3 = function(coll, n, val) {
  var this__15579 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15580 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15581 = this;
  return new cljs.core.Vector(meta, this__15581.array)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15582 = this;
  return this__15582.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__15583 = this;
  if(function() {
    var and__3698__auto____15584 = 0 <= n;
    if(and__3698__auto____15584) {
      return n < this__15583.array.length
    }else {
      return and__3698__auto____15584
    }
  }()) {
    return this__15583.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__15586 = this;
  if(function() {
    var and__3698__auto____15587 = 0 <= n;
    if(and__3698__auto____15587) {
      return n < this__15586.array.length
    }else {
      return and__3698__auto____15587
    }
  }()) {
    return this__15586.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15585 = this;
  return cljs.core.with_meta(cljs.core.Vector.EMPTY, this__15585.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, []);
cljs.core.Vector.fromArray = function(xs) {
  return new cljs.core.Vector(null, xs)
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt__15597 = pv.cnt;
  if(cnt__15597 < 32) {
    return 0
  }else {
    return cnt__15597 - 1 >> 5 << 5
  }
};
cljs.core.new_path = function new_path(level, node) {
  var ll__15599 = level;
  var ret__15600 = node;
  while(true) {
    if(cljs.core.truth_(cljs.core._EQ_(0, ll__15599))) {
      return ret__15600
    }else {
      var embed__15601 = ret__15600;
      var r__15602 = cljs.core.aclone(cljs.core.PersistentVector.EMPTY_NODE);
      var ___15603 = r__15602[0] = embed__15601;
      var G__15605 = ll__15599 - 5;
      var G__15606 = r__15602;
      ll__15599 = G__15605;
      ret__15600 = G__15606;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__15607 = cljs.core.aclone(parent);
  var subidx__15608 = pv.cnt - 1 >> level & 31;
  if(cljs.core.truth_(cljs.core._EQ_(5, level))) {
    ret__15607[subidx__15608] = tailnode;
    return ret__15607
  }else {
    var temp__3847__auto____15609 = parent[subidx__15608];
    if(cljs.core.truth_(temp__3847__auto____15609)) {
      var child__15610 = temp__3847__auto____15609;
      var node_to_insert__15611 = push_tail.call(null, pv, level - 5, child__15610, tailnode);
      var ___15612 = ret__15607[subidx__15608] = node_to_insert__15611;
      return ret__15607
    }else {
      var node_to_insert__15613 = cljs.core.new_path(level - 5, tailnode);
      var ___15614 = ret__15607[subidx__15608] = node_to_insert__15613;
      return ret__15607
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__3698__auto____15617 = 0 <= i;
    if(and__3698__auto____15617) {
      return i < pv.cnt
    }else {
      return and__3698__auto____15617
    }
  }()) {
    if(i >= cljs.core.tail_off(pv)) {
      return pv.tail
    }else {
      var node__15618 = pv.root;
      var level__15619 = pv.shift;
      while(true) {
        if(level__15619 > 0) {
          var G__15624 = node__15618[i >> level__15619 & 31];
          var G__15625 = level__15619 - 5;
          node__15618 = G__15624;
          level__15619 = G__15625;
          continue
        }else {
          return node__15618
        }
        break
      }
    }
  }else {
    throw new Error(cljs.core.str("No item ", i, " in vector of length ", pv.cnt));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__15626 = cljs.core.aclone(node);
  if(level === 0) {
    ret__15626[i & 31] = val;
    return ret__15626
  }else {
    var subidx__15627 = i >> level & 31;
    var ___15628 = ret__15626[subidx__15627] = do_assoc.call(null, pv, level - 5, node[subidx__15627], i, val);
    return ret__15626
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__15630 = pv.cnt - 2 >> level & 31;
  if(level > 5) {
    var new_child__15631 = pop_tail.call(null, pv, level - 5, node[subidx__15630]);
    if(function() {
      var and__3698__auto____15632 = new_child__15631 === null;
      if(and__3698__auto____15632) {
        return subidx__15630 === 0
      }else {
        return and__3698__auto____15632
      }
    }()) {
      return null
    }else {
      var ret__15633 = cljs.core.aclone(node);
      var ___15634 = ret__15633[subidx__15630] = new_child__15631;
      return ret__15633
    }
  }else {
    if(subidx__15630 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__15635 = cljs.core.aclone(node);
        var ___15636 = ret__15635[subidx__15630] = null;
        return ret__15635
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector = function(meta, cnt, shift, root, tail) {
  this.meta = meta;
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail
};
cljs.core.PersistentVector.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15642 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__15643 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__15644 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__15645 = this;
  if(function() {
    var and__3698__auto____15646 = 0 <= k;
    if(and__3698__auto____15646) {
      return k < this__15645.cnt
    }else {
      return and__3698__auto____15646
    }
  }()) {
    if(cljs.core.tail_off(coll) <= k) {
      var new_tail__15647 = cljs.core.aclone(this__15645.tail);
      new_tail__15647[k & 31] = v;
      return new cljs.core.PersistentVector(this__15645.meta, this__15645.cnt, this__15645.shift, this__15645.root, new_tail__15647)
    }else {
      return new cljs.core.PersistentVector(this__15645.meta, this__15645.cnt, this__15645.shift, cljs.core.do_assoc(coll, this__15645.shift, this__15645.root, k, v), this__15645.tail)
    }
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(k, this__15645.cnt))) {
      return cljs.core._conj(coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error(cljs.core.str("Index ", k, " out of bounds  [0,", this__15645.cnt, "]"));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = function() {
  var G__15687 = null;
  var G__15687__2 = function(tsym15648, k) {
    var this__15650 = this;
    var tsym15648__15651 = this;
    var coll__15652 = tsym15648__15651;
    return cljs.core._lookup.__2(coll__15652, k)
  };
  var G__15687__3 = function(tsym15649, k, not_found) {
    var this__15653 = this;
    var tsym15649__15654 = this;
    var coll__15655 = tsym15649__15654;
    return cljs.core._lookup.__3(coll__15655, k, not_found)
  };
  G__15687 = function(tsym15649, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15687__2.call(this, tsym15649, k);
      case 3:
        return G__15687__3.call(this, tsym15649, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15687
}();
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15656 = this;
  if(this__15656.cnt - cljs.core.tail_off(coll) < 32) {
    var new_tail__15657 = cljs.core.aclone(this__15656.tail);
    new_tail__15657.push(o);
    return new cljs.core.PersistentVector(this__15656.meta, this__15656.cnt + 1, this__15656.shift, this__15656.root, new_tail__15657)
  }else {
    var root_overflow_QMARK___15658 = this__15656.cnt >> 5 > 1 << this__15656.shift;
    var new_shift__15659 = root_overflow_QMARK___15658 ? this__15656.shift + 5 : this__15656.shift;
    var new_root__15661 = root_overflow_QMARK___15658 ? function() {
      var n_r__15660 = cljs.core.aclone(cljs.core.PersistentVector.EMPTY_NODE);
      n_r__15660[0] = this__15656.root;
      n_r__15660[1] = cljs.core.new_path(this__15656.shift, this__15656.tail);
      return n_r__15660
    }() : cljs.core.push_tail(coll, this__15656.shift, this__15656.root, this__15656.tail);
    return new cljs.core.PersistentVector(this__15656.meta, this__15656.cnt + 1, new_shift__15659, new_root__15661, [o])
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce__2 = function(v, f) {
  var this__15662 = this;
  return cljs.core.ci_reduce.__2(v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce__3 = function(v, f, start) {
  var this__15663 = this;
  return cljs.core.ci_reduce.__3(v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15664 = this;
  if(this__15664.cnt > 0) {
    var vector_seq__15665 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__15664.cnt) {
          return cljs.core.cons(cljs.core._nth.__2(coll, i), vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__15665.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15666 = this;
  return this__15666.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15667 = this;
  if(this__15667.cnt > 0) {
    return cljs.core._nth.__2(coll, this__15667.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15668 = this;
  if(this__15668.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(1, this__15668.cnt))) {
      return cljs.core._with_meta(cljs.core.PersistentVector.EMPTY, this__15668.meta)
    }else {
      if(1 < this__15668.cnt - cljs.core.tail_off(coll)) {
        return new cljs.core.PersistentVector(this__15668.meta, this__15668.cnt - 1, this__15668.shift, this__15668.root, cljs.core.aclone(this__15668.tail))
      }else {
        if("\ufdd0'else") {
          var new_tail__15669 = cljs.core.array_for(coll, this__15668.cnt - 2);
          var nr__15670 = cljs.core.pop_tail(this__15668.shift, this__15668.root);
          var new_root__15671 = nr__15670 === null ? cljs.core.PersistentVector.EMPTY_NODE : nr__15670;
          var cnt_1__15672 = this__15668.cnt - 1;
          if(function() {
            var and__3698__auto____15673 = 5 < this__15668.shift;
            if(and__3698__auto____15673) {
              return new_root__15671[1] === null
            }else {
              return and__3698__auto____15673
            }
          }()) {
            return new cljs.core.PersistentVector(this__15668.meta, cnt_1__15672, this__15668.shift - 5, new_root__15671[0], new_tail__15669)
          }else {
            return new cljs.core.PersistentVector(this__15668.meta, cnt_1__15672, this__15668.shift, new_root__15671, new_tail__15669)
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n__3 = function(coll, n, val) {
  var this__15674 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15675 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15676 = this;
  return new cljs.core.PersistentVector(meta, this__15676.cnt, this__15676.shift, this__15676.root, this__15676.tail)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15677 = this;
  return this__15677.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__15678 = this;
  return cljs.core.array_for(coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__15680 = this;
  if(function() {
    var and__3698__auto____15681 = 0 <= n;
    if(and__3698__auto____15681) {
      return n < this__15680.cnt
    }else {
      return and__3698__auto____15681
    }
  }()) {
    return cljs.core._nth.__2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15679 = this;
  return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY, this__15679.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = new Array(32);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, []);
cljs.core.PersistentVector.fromArray = function(xs) {
  return cljs.core.into(cljs.core.PersistentVector.EMPTY, xs)
};
cljs.core.vec = function vec(coll) {
  return cljs.core.reduce.__3(cljs.core.conj, cljs.core.PersistentVector.EMPTY, coll)
};
cljs.core.vector = function() {
  var vector__delegate = function(args) {
    return cljs.core.vec(args)
  };
  var vector = function(var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return vector__delegate.call(this, args)
  };
  vector.cljs$lang$maxFixedArity = 0;
  vector.cljs$lang$applyTo = function(arglist__15700) {
    var args = cljs.core.seq(arglist__15700);
    return vector__delegate.call(this, args)
  };
  return vector
}();
cljs.core.Subvec = function(meta, v, start, end) {
  this.meta = meta;
  this.v = v;
  this.start = start;
  this.end = end
};
cljs.core.Subvec.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$ = true;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15701 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__15702 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__15703 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, key, val) {
  var this__15704 = this;
  var v_pos__15705 = this__15704.start + key;
  return new cljs.core.Subvec(this__15704.meta, cljs.core._assoc(this__15704.v, v_pos__15705, val), this__15704.start, this__15704.end > v_pos__15705 + 1 ? this__15704.end : v_pos__15705 + 1)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = function() {
  var G__15729 = null;
  var G__15729__2 = function(tsym15706, k) {
    var this__15708 = this;
    var tsym15706__15709 = this;
    var coll__15710 = tsym15706__15709;
    return cljs.core._lookup.__2(coll__15710, k)
  };
  var G__15729__3 = function(tsym15707, k, not_found) {
    var this__15711 = this;
    var tsym15707__15712 = this;
    var coll__15713 = tsym15707__15712;
    return cljs.core._lookup.__3(coll__15713, k, not_found)
  };
  G__15729 = function(tsym15707, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15729__2.call(this, tsym15707, k);
      case 3:
        return G__15729__3.call(this, tsym15707, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15729
}();
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15714 = this;
  return new cljs.core.Subvec(this__15714.meta, cljs.core._assoc_n(this__15714.v, this__15714.end, o), this__15714.start, this__15714.end + 1)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce__2 = function(coll, f) {
  var this__15715 = this;
  return cljs.core.ci_reduce.__2(coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce__3 = function(coll, f, start) {
  var this__15716 = this;
  return cljs.core.ci_reduce.__3(coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15717 = this;
  var subvec_seq__15718 = function subvec_seq(i) {
    if(cljs.core.truth_(cljs.core._EQ_(i, this__15717.end))) {
      return null
    }else {
      return cljs.core.cons(cljs.core._nth.__2(this__15717.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }))
    }
  };
  return subvec_seq__15718.call(null, this__15717.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15719 = this;
  return this__15719.end - this__15719.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15720 = this;
  return cljs.core._nth.__2(this__15720.v, this__15720.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15721 = this;
  if(cljs.core.truth_(cljs.core._EQ_(this__15721.start, this__15721.end))) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__15721.meta, this__15721.v, this__15721.start, this__15721.end - 1)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n__3 = function(coll, n, val) {
  var this__15722 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15723 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15724 = this;
  return new cljs.core.Subvec(meta, this__15724.v, this__15724.start, this__15724.end)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15725 = this;
  return this__15725.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__15726 = this;
  return cljs.core._nth.__2(this__15726.v, this__15726.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__15728 = this;
  return cljs.core._nth.__3(this__15728.v, this__15728.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15727 = this;
  return cljs.core.with_meta(cljs.core.Vector.EMPTY, this__15727.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var subvec = null;
  var subvec__2 = function(v, start) {
    return subvec.call(null, v, start, cljs.core.count(v))
  };
  var subvec__3 = function(v, start, end) {
    return new cljs.core.Subvec(null, v, start, end)
  };
  subvec = function(v, start, end) {
    switch(arguments.length) {
      case 2:
        return subvec__2.call(this, v, start);
      case 3:
        return subvec__3.call(this, v, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subvec.__2 = subvec__2;
  subvec.__3 = subvec__3;
  return subvec
}();
cljs.core.PersistentQueueSeq = function(meta, front, rear) {
  this.meta = meta;
  this.front = front;
  this.rear = rear
};
cljs.core.PersistentQueueSeq.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15732 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15733 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15734 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15735 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__15735.meta)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15736 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15737 = this;
  return cljs.core._first(this__15737.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15738 = this;
  var temp__3847__auto____15739 = cljs.core.next(this__15738.front);
  if(cljs.core.truth_(temp__3847__auto____15739)) {
    var f1__15740 = temp__3847__auto____15739;
    return new cljs.core.PersistentQueueSeq(this__15738.meta, f1__15740, this__15738.rear)
  }else {
    if(this__15738.rear === null) {
      return cljs.core._empty(coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__15738.meta, this__15738.rear, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15741 = this;
  return this__15741.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15742 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__15742.front, this__15742.rear)
};
cljs.core.PersistentQueueSeq;
cljs.core.PersistentQueue = function(meta, count, front, rear) {
  this.meta = meta;
  this.count = count;
  this.front = front;
  this.rear = rear
};
cljs.core.PersistentQueue.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15745 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15746 = this;
  if(cljs.core.truth_(this__15746.front)) {
    return new cljs.core.PersistentQueue(this__15746.meta, this__15746.count + 1, this__15746.front, cljs.core.conj.__2(function() {
      var or__3700__auto____15747 = this__15746.rear;
      if(cljs.core.truth_(or__3700__auto____15747)) {
        return or__3700__auto____15747
      }else {
        return cljs.core.PersistentVector.fromArray([])
      }
    }(), o))
  }else {
    return new cljs.core.PersistentQueue(this__15746.meta, this__15746.count + 1, cljs.core.conj.__2(this__15746.front, o), cljs.core.PersistentVector.fromArray([]))
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15748 = this;
  var rear__15749 = cljs.core.seq(this__15748.rear);
  if(cljs.core.truth_(function() {
    var or__3700__auto____15750 = this__15748.front;
    if(cljs.core.truth_(or__3700__auto____15750)) {
      return or__3700__auto____15750
    }else {
      return rear__15749
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__15748.front, cljs.core.seq(rear__15749))
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15751 = this;
  return this__15751.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__15752 = this;
  return cljs.core._first(this__15752.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__15753 = this;
  if(cljs.core.truth_(this__15753.front)) {
    var temp__3847__auto____15754 = cljs.core.next(this__15753.front);
    if(cljs.core.truth_(temp__3847__auto____15754)) {
      var f1__15755 = temp__3847__auto____15754;
      return new cljs.core.PersistentQueue(this__15753.meta, this__15753.count - 1, f1__15755, this__15753.rear)
    }else {
      return new cljs.core.PersistentQueue(this__15753.meta, this__15753.count - 1, cljs.core.seq(this__15753.rear), cljs.core.PersistentVector.fromArray([]))
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__15756 = this;
  return cljs.core.first(this__15756.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__15757 = this;
  return cljs.core.rest(cljs.core.seq(coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15758 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15759 = this;
  return new cljs.core.PersistentQueue(meta, this__15759.count, this__15759.front, this__15759.rear)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15760 = this;
  return this__15760.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15761 = this;
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.fromArray([]));
cljs.core.NeverEquiv = function() {
};
cljs.core.NeverEquiv.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = true;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv__2 = function(o, other) {
  var this__15768 = this;
  return false
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function equiv_map(x, y) {
  return cljs.core.boolean$(cljs.core.truth_(cljs.core.map_QMARK_(y)) ? cljs.core.truth_(cljs.core._EQ_(cljs.core.count(x), cljs.core.count(y))) ? cljs.core.every_QMARK_(cljs.core.identity, cljs.core.map.__2(function(xkv) {
    return cljs.core._EQ_(cljs.core.get.__3(y, cljs.core.first(xkv), cljs.core.never_equiv), cljs.core.second(xkv))
  }, x)) : null : null)
};
cljs.core.scan_array = function scan_array(incr, k, array) {
  var len__15769 = array.length;
  var i__15770 = 0;
  while(true) {
    if(i__15770 < len__15769) {
      if(cljs.core.truth_(cljs.core._EQ_(k, array[i__15770]))) {
        return i__15770
      }else {
        var G__15773 = i__15770 + incr;
        i__15770 = G__15773;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var obj_map_contains_key_QMARK_ = null;
  var obj_map_contains_key_QMARK___2 = function(k, strobj) {
    return obj_map_contains_key_QMARK_.call(null, k, strobj, true, false)
  };
  var obj_map_contains_key_QMARK___4 = function(k, strobj, true_val, false_val) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____15774 = goog.isString.call(null, k);
      if(cljs.core.truth_(and__3698__auto____15774)) {
        return strobj.hasOwnProperty(k)
      }else {
        return and__3698__auto____15774
      }
    }())) {
      return true_val
    }else {
      return false_val
    }
  };
  obj_map_contains_key_QMARK_ = function(k, strobj, true_val, false_val) {
    switch(arguments.length) {
      case 2:
        return obj_map_contains_key_QMARK___2.call(this, k, strobj);
      case 4:
        return obj_map_contains_key_QMARK___4.call(this, k, strobj, true_val, false_val)
    }
    throw"Invalid arity: " + arguments.length;
  };
  obj_map_contains_key_QMARK_.__2 = obj_map_contains_key_QMARK___2;
  obj_map_contains_key_QMARK_.__4 = obj_map_contains_key_QMARK___4;
  return obj_map_contains_key_QMARK_
}();
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__15778 = cljs.core.hash(a);
  var b__15779 = cljs.core.hash(b);
  if(a__15778 < b__15779) {
    return-1
  }else {
    if(a__15778 > b__15779) {
      return 1
    }else {
      if("\ufdd0'else") {
        return 0
      }else {
        return null
      }
    }
  }
};
cljs.core.ObjMap = function(meta, keys, strobj) {
  this.meta = meta;
  this.keys = keys;
  this.strobj = strobj
};
cljs.core.ObjMap.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15783 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__15784 = this;
  return cljs.core._lookup.__3(coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__15785 = this;
  return cljs.core.obj_map_contains_key_QMARK_.__4(k, this__15785.strobj, this__15785.strobj[k], not_found)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__15786 = this;
  if(cljs.core.truth_(goog.isString.call(null, k))) {
    var new_strobj__15787 = goog.object.clone.call(null, this__15786.strobj);
    var overwrite_QMARK___15788 = new_strobj__15787.hasOwnProperty(k);
    new_strobj__15787[k] = v;
    if(cljs.core.truth_(overwrite_QMARK___15788)) {
      return new cljs.core.ObjMap(this__15786.meta, this__15786.keys, new_strobj__15787)
    }else {
      var new_keys__15789 = cljs.core.aclone(this__15786.keys);
      new_keys__15789.push(k);
      return new cljs.core.ObjMap(this__15786.meta, new_keys__15789, new_strobj__15787)
    }
  }else {
    return cljs.core.with_meta(cljs.core.into(cljs.core.hash_map(k, v), cljs.core.seq(coll)), this__15786.meta)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK___2 = function(coll, k) {
  var this__15790 = this;
  return cljs.core.obj_map_contains_key_QMARK_.__2(k, this__15790.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = function() {
  var G__15812 = null;
  var G__15812__2 = function(tsym15791, k) {
    var this__15793 = this;
    var tsym15791__15794 = this;
    var coll__15795 = tsym15791__15794;
    return cljs.core._lookup.__2(coll__15795, k)
  };
  var G__15812__3 = function(tsym15792, k, not_found) {
    var this__15796 = this;
    var tsym15792__15797 = this;
    var coll__15798 = tsym15792__15797;
    return cljs.core._lookup.__3(coll__15798, k, not_found)
  };
  G__15812 = function(tsym15792, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15812__2.call(this, tsym15792, k);
      case 3:
        return G__15812__3.call(this, tsym15792, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15812
}();
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj__2 = function(coll, entry) {
  var this__15799 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_(entry))) {
    return cljs.core._assoc(coll, cljs.core._nth.__2(entry, 0), cljs.core._nth.__2(entry, 1))
  }else {
    return cljs.core.reduce.__3(cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15800 = this;
  if(this__15800.keys.length > 0) {
    return cljs.core.map.__2(function(p1__15777_SHARP_) {
      return cljs.core.vector(p1__15777_SHARP_, this__15800.strobj[p1__15777_SHARP_])
    }, this__15800.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15801 = this;
  return this__15801.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15802 = this;
  return cljs.core.equiv_map(coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15803 = this;
  return new cljs.core.ObjMap(meta, this__15803.keys, this__15803.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15804 = this;
  return this__15804.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15805 = this;
  return cljs.core.with_meta(cljs.core.ObjMap.EMPTY, this__15805.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc__2 = function(coll, k) {
  var this__15806 = this;
  if(cljs.core.truth_(function() {
    var and__3698__auto____15807 = goog.isString.call(null, k);
    if(cljs.core.truth_(and__3698__auto____15807)) {
      return this__15806.strobj.hasOwnProperty(k)
    }else {
      return and__3698__auto____15807
    }
  }())) {
    var new_keys__15808 = cljs.core.aclone(this__15806.keys);
    var new_strobj__15809 = goog.object.clone.call(null, this__15806.strobj);
    new_keys__15808.splice(cljs.core.scan_array(1, k, new_keys__15808), 1);
    cljs.core.js_delete(new_strobj__15809, k);
    return new cljs.core.ObjMap(this__15806.meta, new_keys__15808, new_strobj__15809)
  }else {
    return coll
  }
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], cljs.core.js_obj());
cljs.core.ObjMap.fromObject = function(ks, obj) {
  return new cljs.core.ObjMap(null, ks, obj)
};
cljs.core.HashMap = function(meta, count, hashobj) {
  this.meta = meta;
  this.count = count;
  this.hashobj = hashobj
};
cljs.core.HashMap.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = true;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15818 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__15819 = this;
  return cljs.core._lookup.__3(coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__15820 = this;
  var bucket__15821 = this__15820.hashobj[cljs.core.hash(k)];
  var i__15822 = cljs.core.truth_(bucket__15821) ? cljs.core.scan_array(2, k, bucket__15821) : null;
  if(cljs.core.truth_(i__15822)) {
    return bucket__15821[i__15822 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__15823 = this;
  var h__15824 = cljs.core.hash(k);
  var bucket__15825 = this__15823.hashobj[h__15824];
  if(cljs.core.truth_(bucket__15825)) {
    var new_bucket__15826 = cljs.core.aclone(bucket__15825);
    var new_hashobj__15827 = goog.object.clone.call(null, this__15823.hashobj);
    new_hashobj__15827[h__15824] = new_bucket__15826;
    var temp__3847__auto____15828 = cljs.core.scan_array(2, k, new_bucket__15826);
    if(cljs.core.truth_(temp__3847__auto____15828)) {
      var i__15829 = temp__3847__auto____15828;
      new_bucket__15826[i__15829 + 1] = v;
      return new cljs.core.HashMap(this__15823.meta, this__15823.count, new_hashobj__15827)
    }else {
      new_bucket__15826.push(k, v);
      return new cljs.core.HashMap(this__15823.meta, this__15823.count + 1, new_hashobj__15827)
    }
  }else {
    var new_hashobj__15830 = goog.object.clone.call(null, this__15823.hashobj);
    new_hashobj__15830[h__15824] = [k, v];
    return new cljs.core.HashMap(this__15823.meta, this__15823.count + 1, new_hashobj__15830)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK___2 = function(coll, k) {
  var this__15831 = this;
  var bucket__15832 = this__15831.hashobj[cljs.core.hash(k)];
  var i__15833 = cljs.core.truth_(bucket__15832) ? cljs.core.scan_array(2, k, bucket__15832) : null;
  if(cljs.core.truth_(i__15833)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = function() {
  var G__15860 = null;
  var G__15860__2 = function(tsym15834, k) {
    var this__15836 = this;
    var tsym15834__15837 = this;
    var coll__15838 = tsym15834__15837;
    return cljs.core._lookup.__2(coll__15838, k)
  };
  var G__15860__3 = function(tsym15835, k, not_found) {
    var this__15839 = this;
    var tsym15835__15840 = this;
    var coll__15841 = tsym15835__15840;
    return cljs.core._lookup.__3(coll__15841, k, not_found)
  };
  G__15860 = function(tsym15835, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15860__2.call(this, tsym15835, k);
      case 3:
        return G__15860__3.call(this, tsym15835, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15860
}();
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj__2 = function(coll, entry) {
  var this__15842 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_(entry))) {
    return cljs.core._assoc(coll, cljs.core._nth.__2(entry, 0), cljs.core._nth.__2(entry, 1))
  }else {
    return cljs.core.reduce.__3(cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15843 = this;
  if(this__15843.count > 0) {
    var hashes__15844 = cljs.core.js_keys(this__15843.hashobj).sort();
    return cljs.core.mapcat.__2(function(p1__15817_SHARP_) {
      return cljs.core.map.__2(cljs.core.vec, cljs.core.partition.__2(2, this__15843.hashobj[p1__15817_SHARP_]))
    }, hashes__15844)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15845 = this;
  return this__15845.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15846 = this;
  return cljs.core.equiv_map(coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15847 = this;
  return new cljs.core.HashMap(meta, this__15847.count, this__15847.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15848 = this;
  return this__15848.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15849 = this;
  return cljs.core.with_meta(cljs.core.HashMap.EMPTY, this__15849.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc__2 = function(coll, k) {
  var this__15850 = this;
  var h__15851 = cljs.core.hash(k);
  var bucket__15852 = this__15850.hashobj[h__15851];
  var i__15853 = cljs.core.truth_(bucket__15852) ? cljs.core.scan_array(2, k, bucket__15852) : null;
  if(cljs.core.truth_(cljs.core.not(i__15853))) {
    return coll
  }else {
    var new_hashobj__15854 = goog.object.clone.call(null, this__15850.hashobj);
    if(3 > bucket__15852.length) {
      cljs.core.js_delete(new_hashobj__15854, h__15851)
    }else {
      var new_bucket__15855 = cljs.core.aclone(bucket__15852);
      new_bucket__15855.splice(i__15853, 2);
      new_hashobj__15854[h__15851] = new_bucket__15855
    }
    return new cljs.core.HashMap(this__15850.meta, this__15850.count - 1, new_hashobj__15854)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj());
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__15865 = ks.length;
  var i__15866 = 0;
  var out__15867 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__15866 < len__15865) {
      var G__15869 = i__15866 + 1;
      var G__15870 = cljs.core.assoc.__3(out__15867, ks[i__15866], vs[i__15866]);
      i__15866 = G__15869;
      out__15867 = G__15870;
      continue
    }else {
      return out__15867
    }
    break
  }
};
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$__15871 = cljs.core.seq(keyvals);
    var out__15872 = cljs.core.HashMap.EMPTY;
    while(true) {
      if(cljs.core.truth_(in$__15871)) {
        var G__15874 = cljs.core.nnext(in$__15871);
        var G__15875 = cljs.core.assoc.__3(out__15872, cljs.core.first(in$__15871), cljs.core.second(in$__15871));
        in$__15871 = G__15874;
        out__15872 = G__15875;
        continue
      }else {
        return out__15872
      }
      break
    }
  };
  var hash_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return hash_map__delegate.call(this, keyvals)
  };
  hash_map.cljs$lang$maxFixedArity = 0;
  hash_map.cljs$lang$applyTo = function(arglist__15876) {
    var keyvals = cljs.core.seq(arglist__15876);
    return hash_map__delegate.call(this, keyvals)
  };
  return hash_map
}();
cljs.core.keys = function keys(hash_map) {
  return cljs.core.seq(cljs.core.map.__2(cljs.core.first, hash_map))
};
cljs.core.vals = function vals(hash_map) {
  return cljs.core.seq(cljs.core.map.__2(cljs.core.second, hash_map))
};
cljs.core.merge = function() {
  var merge__delegate = function(maps) {
    if(cljs.core.truth_(cljs.core.some(cljs.core.identity, maps))) {
      return cljs.core.reduce.__2(function(p1__15877_SHARP_, p2__15878_SHARP_) {
        return cljs.core.conj.__2(function() {
          var or__3700__auto____15879 = p1__15877_SHARP_;
          if(cljs.core.truth_(or__3700__auto____15879)) {
            return or__3700__auto____15879
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), p2__15878_SHARP_)
      }, maps)
    }else {
      return null
    }
  };
  var merge = function(var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return merge__delegate.call(this, maps)
  };
  merge.cljs$lang$maxFixedArity = 0;
  merge.cljs$lang$applyTo = function(arglist__15882) {
    var maps = cljs.core.seq(arglist__15882);
    return merge__delegate.call(this, maps)
  };
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some(cljs.core.identity, maps))) {
      var merge_entry__15885 = function(m, e) {
        var k__15883 = cljs.core.first(e);
        var v__15884 = cljs.core.second(e);
        if(cljs.core.truth_(cljs.core.contains_QMARK_(m, k__15883))) {
          return cljs.core.assoc.__3(m, k__15883, f.call(null, cljs.core.get.__2(m, k__15883), v__15884))
        }else {
          return cljs.core.assoc.__3(m, k__15883, v__15884)
        }
      };
      var merge2__15887 = function(m1, m2) {
        return cljs.core.reduce.__3(merge_entry__15885, function() {
          var or__3700__auto____15886 = m1;
          if(cljs.core.truth_(or__3700__auto____15886)) {
            return or__3700__auto____15886
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), cljs.core.seq(m2))
      };
      return cljs.core.reduce.__2(merge2__15887, maps)
    }else {
      return null
    }
  };
  var merge_with = function(f, var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return merge_with__delegate.call(this, f, maps)
  };
  merge_with.cljs$lang$maxFixedArity = 1;
  merge_with.cljs$lang$applyTo = function(arglist__15891) {
    var f = cljs.core.first(arglist__15891);
    var maps = cljs.core.rest(arglist__15891);
    return merge_with__delegate.call(this, f, maps)
  };
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__15893 = cljs.core.ObjMap.fromObject([], {});
  var keys__15894 = cljs.core.seq(keyseq);
  while(true) {
    if(cljs.core.truth_(keys__15894)) {
      var key__15895 = cljs.core.first(keys__15894);
      var entry__15896 = cljs.core.get.__3(map, key__15895, "\ufdd0'user/not-found");
      var G__15898 = cljs.core.truth_(cljs.core.not_EQ_.__2(entry__15896, "\ufdd0'user/not-found")) ? cljs.core.assoc.__3(ret__15893, key__15895, entry__15896) : ret__15893;
      var G__15899 = cljs.core.next(keys__15894);
      ret__15893 = G__15898;
      keys__15894 = G__15899;
      continue
    }else {
      return ret__15893
    }
    break
  }
};
cljs.core.Set = function(meta, hash_map) {
  this.meta = meta;
  this.hash_map = hash_map
};
cljs.core.Set.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Set")
};
cljs.core.Set.prototype.cljs$core$IHash$ = true;
cljs.core.Set.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__15900 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Set.prototype.cljs$core$ILookup$ = true;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup__2 = function(coll, v) {
  var this__15901 = this;
  return cljs.core._lookup.__3(coll, v, null)
};
cljs.core.Set.prototype.cljs$core$ILookup$_lookup__3 = function(coll, v, not_found) {
  var this__15902 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_(this__15902.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.Set.prototype.cljs$core$IFn$ = true;
cljs.core.Set.prototype.call = function() {
  var G__15922 = null;
  var G__15922__2 = function(tsym15903, k) {
    var this__15905 = this;
    var tsym15903__15906 = this;
    var coll__15907 = tsym15903__15906;
    return cljs.core._lookup.__2(coll__15907, k)
  };
  var G__15922__3 = function(tsym15904, k, not_found) {
    var this__15908 = this;
    var tsym15904__15909 = this;
    var coll__15910 = tsym15904__15909;
    return cljs.core._lookup.__3(coll__15910, k, not_found)
  };
  G__15922 = function(tsym15904, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__15922__2.call(this, tsym15904, k);
      case 3:
        return G__15922__3.call(this, tsym15904, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__15922
}();
cljs.core.Set.prototype.cljs$core$ICollection$ = true;
cljs.core.Set.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__15911 = this;
  return new cljs.core.Set(this__15911.meta, cljs.core.assoc.__3(this__15911.hash_map, o, null))
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = true;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__15912 = this;
  return cljs.core.keys(this__15912.hash_map)
};
cljs.core.Set.prototype.cljs$core$ISet$ = true;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin__2 = function(coll, v) {
  var this__15913 = this;
  return new cljs.core.Set(this__15913.meta, cljs.core.dissoc.__2(this__15913.hash_map, v))
};
cljs.core.Set.prototype.cljs$core$ICounted$ = true;
cljs.core.Set.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__15914 = this;
  return cljs.core.count(cljs.core.seq(coll))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = true;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__15915 = this;
  var and__3698__auto____15916 = cljs.core.set_QMARK_(other);
  if(cljs.core.truth_(and__3698__auto____15916)) {
    var and__3698__auto____15917 = cljs.core._EQ_(cljs.core.count(coll), cljs.core.count(other));
    if(cljs.core.truth_(and__3698__auto____15917)) {
      return cljs.core.every_QMARK_(function(p1__15892_SHARP_) {
        return cljs.core.contains_QMARK_(coll, p1__15892_SHARP_)
      }, other)
    }else {
      return and__3698__auto____15917
    }
  }else {
    return and__3698__auto____15916
  }
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__15918 = this;
  return new cljs.core.Set(meta, this__15918.hash_map)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = true;
cljs.core.Set.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__15919 = this;
  return this__15919.meta
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__15920 = this;
  return cljs.core.with_meta(cljs.core.Set.EMPTY, this__15920.meta)
};
cljs.core.Set;
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map());
cljs.core.set = function set(coll) {
  var in$__15926 = cljs.core.seq(coll);
  var out__15927 = cljs.core.Set.EMPTY;
  while(true) {
    if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_(in$__15926)))) {
      var G__15929 = cljs.core.rest(in$__15926);
      var G__15930 = cljs.core.conj.__2(out__15927, cljs.core.first(in$__15926));
      in$__15926 = G__15929;
      out__15927 = G__15930;
      continue
    }else {
      return out__15927
    }
    break
  }
};
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.truth_(cljs.core.vector_QMARK_(coll))) {
    var n__15931 = cljs.core.count(coll);
    return cljs.core.reduce.__3(function(v, i) {
      var temp__3847__auto____15932 = cljs.core.find(smap, cljs.core.nth.__2(v, i));
      if(cljs.core.truth_(temp__3847__auto____15932)) {
        var e__15933 = temp__3847__auto____15932;
        return cljs.core.assoc.__3(v, i, cljs.core.second(e__15933))
      }else {
        return v
      }
    }, coll, cljs.core.take(n__15931, cljs.core.iterate(cljs.core.inc, 0)))
  }else {
    return cljs.core.map.__2(function(p1__15925_SHARP_) {
      var temp__3847__auto____15934 = cljs.core.find(smap, p1__15925_SHARP_);
      if(cljs.core.truth_(temp__3847__auto____15934)) {
        var e__15935 = temp__3847__auto____15934;
        return cljs.core.second(e__15935)
      }else {
        return p1__15925_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__15946 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__15939, seen) {
        while(true) {
          var vec__15940__15941 = p__15939;
          var f__15942 = cljs.core.nth.call(null, vec__15940__15941, 0, null);
          var xs__15943 = vec__15940__15941;
          var temp__3850__auto____15944 = cljs.core.seq(xs__15943);
          if(cljs.core.truth_(temp__3850__auto____15944)) {
            var s__15945 = temp__3850__auto____15944;
            if(cljs.core.truth_(cljs.core.contains_QMARK_(seen, f__15942))) {
              var G__15949 = cljs.core.rest(s__15945);
              var G__15950 = seen;
              p__15939 = G__15949;
              seen = G__15950;
              continue
            }else {
              return cljs.core.cons(f__15942, step.call(null, cljs.core.rest(s__15945), cljs.core.conj.__2(seen, f__15942)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    })
  };
  return step__15946.call(null, coll, cljs.core.set([]))
};
cljs.core.butlast = function butlast(s) {
  var ret__15951 = cljs.core.PersistentVector.fromArray([]);
  var s__15952 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.next(s__15952))) {
      var G__15954 = cljs.core.conj.__2(ret__15951, cljs.core.first(s__15952));
      var G__15955 = cljs.core.next(s__15952);
      ret__15951 = G__15954;
      s__15952 = G__15955;
      continue
    }else {
      return cljs.core.seq(ret__15951)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.truth_(cljs.core.string_QMARK_(x))) {
    return x
  }else {
    if(cljs.core.truth_(function() {
      var or__3700__auto____15956 = cljs.core.keyword_QMARK_(x);
      if(cljs.core.truth_(or__3700__auto____15956)) {
        return or__3700__auto____15956
      }else {
        return cljs.core.symbol_QMARK_(x)
      }
    }())) {
      var i__15957 = x.lastIndexOf("/");
      if(i__15957 < 0) {
        return cljs.core.subs.__2(x, 2)
      }else {
        return cljs.core.subs.__2(x, i__15957 + 1)
      }
    }else {
      if("\ufdd0'else") {
        throw new Error(cljs.core.str("Doesn't support name: ", x));
      }else {
        return null
      }
    }
  }
};
cljs.core.namespace = function namespace(x) {
  if(cljs.core.truth_(function() {
    var or__3700__auto____15963 = cljs.core.keyword_QMARK_(x);
    if(cljs.core.truth_(or__3700__auto____15963)) {
      return or__3700__auto____15963
    }else {
      return cljs.core.symbol_QMARK_(x)
    }
  }())) {
    var i__15964 = x.lastIndexOf("/");
    if(i__15964 > -1) {
      return cljs.core.subs.__3(x, 2, i__15964)
    }else {
      return null
    }
  }else {
    throw new Error(cljs.core.str("Doesn't support namespace: ", x));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__15970 = cljs.core.ObjMap.fromObject([], {});
  var ks__15971 = cljs.core.seq(keys);
  var vs__15972 = cljs.core.seq(vals);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____15973 = ks__15971;
      if(cljs.core.truth_(and__3698__auto____15973)) {
        return vs__15972
      }else {
        return and__3698__auto____15973
      }
    }())) {
      var G__15976 = cljs.core.assoc.__3(map__15970, cljs.core.first(ks__15971), cljs.core.first(vs__15972));
      var G__15977 = cljs.core.next(ks__15971);
      var G__15978 = cljs.core.next(vs__15972);
      map__15970 = G__15976;
      ks__15971 = G__15977;
      vs__15972 = G__15978;
      continue
    }else {
      return map__15970
    }
    break
  }
};
cljs.core.max_key = function() {
  var max_key = null;
  var max_key__2 = function(k, x) {
    return x
  };
  var max_key__3 = function(k, x, y) {
    if(k.call(null, x) > k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var max_key__4 = function() {
    var G__15982__delegate = function(k, x, y, more) {
      return cljs.core.reduce.__3(function(p1__15968_SHARP_, p2__15969_SHARP_) {
        return max_key.call(null, k, p1__15968_SHARP_, p2__15969_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__15982 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__15982__delegate.call(this, k, x, y, more)
    };
    G__15982.cljs$lang$maxFixedArity = 3;
    G__15982.cljs$lang$applyTo = function(arglist__15983) {
      var k = cljs.core.first(arglist__15983);
      var x = cljs.core.first(cljs.core.next(arglist__15983));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15983)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15983)));
      return G__15982__delegate.call(this, k, x, y, more)
    };
    return G__15982
  }();
  max_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return max_key__2.call(this, k, x);
      case 3:
        return max_key__3.call(this, k, x, y);
      default:
        return max_key__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  max_key.cljs$lang$maxFixedArity = 3;
  max_key.cljs$lang$applyTo = max_key__4.cljs$lang$applyTo;
  max_key.__2 = max_key__2;
  max_key.__3 = max_key__3;
  max_key.__4 = max_key__4;
  return max_key
}();
cljs.core.min_key = function() {
  var min_key = null;
  var min_key__2 = function(k, x) {
    return x
  };
  var min_key__3 = function(k, x, y) {
    if(k.call(null, x) < k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var min_key__4 = function() {
    var G__15985__delegate = function(k, x, y, more) {
      return cljs.core.reduce.__3(function(p1__15979_SHARP_, p2__15980_SHARP_) {
        return min_key.call(null, k, p1__15979_SHARP_, p2__15980_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__15985 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__15985__delegate.call(this, k, x, y, more)
    };
    G__15985.cljs$lang$maxFixedArity = 3;
    G__15985.cljs$lang$applyTo = function(arglist__15986) {
      var k = cljs.core.first(arglist__15986);
      var x = cljs.core.first(cljs.core.next(arglist__15986));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__15986)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__15986)));
      return G__15985__delegate.call(this, k, x, y, more)
    };
    return G__15985
  }();
  min_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return min_key__2.call(this, k, x);
      case 3:
        return min_key__3.call(this, k, x, y);
      default:
        return min_key__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  min_key.cljs$lang$maxFixedArity = 3;
  min_key.cljs$lang$applyTo = min_key__4.cljs$lang$applyTo;
  min_key.__2 = min_key__2;
  min_key.__3 = min_key__3;
  min_key.__4 = min_key__4;
  return min_key
}();
cljs.core.partition_all = function() {
  var partition_all = null;
  var partition_all__2 = function(n, coll) {
    return partition_all.call(null, n, n, coll)
  };
  var partition_all__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____15987 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____15987)) {
        var s__15988 = temp__3850__auto____15987;
        return cljs.core.cons(cljs.core.take(n, s__15988), partition_all.call(null, n, step, cljs.core.drop(step, s__15988)))
      }else {
        return null
      }
    })
  };
  partition_all = function(n, step, coll) {
    switch(arguments.length) {
      case 2:
        return partition_all__2.call(this, n, step);
      case 3:
        return partition_all__3.call(this, n, step, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition_all.__2 = partition_all__2;
  partition_all.__3 = partition_all__3;
  return partition_all
}();
cljs.core.take_while = function take_while(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____15990 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____15990)) {
      var s__15991 = temp__3850__auto____15990;
      if(cljs.core.truth_(pred.call(null, cljs.core.first(s__15991)))) {
        return cljs.core.cons(cljs.core.first(s__15991), take_while.call(null, pred, cljs.core.rest(s__15991)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.Range = function(meta, start, end, step) {
  this.meta = meta;
  this.start = start;
  this.end = end;
  this.step = step
};
cljs.core.Range.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Range")
};
cljs.core.Range.prototype.cljs$core$IHash$ = true;
cljs.core.Range.prototype.cljs$core$IHash$_hash__1 = function(rng) {
  var this__15994 = this;
  return cljs.core.hash_coll(rng)
};
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj__2 = function(rng, o) {
  var this__15995 = this;
  return cljs.core.cons(o, rng)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce__2 = function(rng, f) {
  var this__15996 = this;
  return cljs.core.ci_reduce.__2(rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce__3 = function(rng, f, s) {
  var this__15997 = this;
  return cljs.core.ci_reduce.__3(rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq__1 = function(rng) {
  var this__15998 = this;
  var comp__15999 = this__15998.step > 0 ? cljs.core._LT_ : cljs.core._GT_;
  if(cljs.core.truth_(comp__15999.call(null, this__15998.start, this__15998.end))) {
    return rng
  }else {
    return null
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count__1 = function(rng) {
  var this__16000 = this;
  if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._seq(rng)))) {
    return 0
  }else {
    return Math["ceil"].call(null, (this__16000.end - this__16000.start) / this__16000.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first__1 = function(rng) {
  var this__16001 = this;
  return this__16001.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest__1 = function(rng) {
  var this__16002 = this;
  if(cljs.core.truth_(cljs.core._seq(rng))) {
    return new cljs.core.Range(this__16002.meta, this__16002.start + this__16002.step, this__16002.end, this__16002.step)
  }else {
    return cljs.core.list()
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv__2 = function(rng, other) {
  var this__16003 = this;
  return cljs.core.equiv_sequential(rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta__2 = function(rng, meta) {
  var this__16004 = this;
  return new cljs.core.Range(meta, this__16004.start, this__16004.end, this__16004.step)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta__1 = function(rng) {
  var this__16005 = this;
  return this__16005.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth__2 = function(rng, n) {
  var this__16006 = this;
  if(n < cljs.core._count(rng)) {
    return this__16006.start + n * this__16006.step
  }else {
    if(cljs.core.truth_(function() {
      var and__3698__auto____16007 = this__16006.start > this__16006.end;
      if(and__3698__auto____16007) {
        return cljs.core._EQ_(this__16006.step, 0)
      }else {
        return and__3698__auto____16007
      }
    }())) {
      return this__16006.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth__3 = function(rng, n, not_found) {
  var this__16008 = this;
  if(n < cljs.core._count(rng)) {
    return this__16008.start + n * this__16008.step
  }else {
    if(cljs.core.truth_(function() {
      var and__3698__auto____16009 = this__16008.start > this__16008.end;
      if(and__3698__auto____16009) {
        return cljs.core._EQ_(this__16008.step, 0)
      }else {
        return and__3698__auto____16009
      }
    }())) {
      return this__16008.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(rng) {
  var this__16010 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__16010.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var range = null;
  var range__0 = function() {
    return range.call(null, 0, Number["MAX_VALUE"], 1)
  };
  var range__1 = function(end) {
    return range.call(null, 0, end, 1)
  };
  var range__2 = function(start, end) {
    return range.call(null, start, end, 1)
  };
  var range__3 = function(start, end, step) {
    return new cljs.core.Range(null, start, end, step)
  };
  range = function(start, end, step) {
    switch(arguments.length) {
      case 0:
        return range__0.call(this);
      case 1:
        return range__1.call(this, start);
      case 2:
        return range__2.call(this, start, end);
      case 3:
        return range__3.call(this, start, end, step)
    }
    throw"Invalid arity: " + arguments.length;
  };
  range.__0 = range__0;
  range.__1 = range__1;
  range.__2 = range__2;
  range.__3 = range__3;
  return range
}();
cljs.core.take_nth = function take_nth(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____16020 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____16020)) {
      var s__16021 = temp__3850__auto____16020;
      return cljs.core.cons(cljs.core.first(s__16021), take_nth.call(null, n, cljs.core.drop(n, s__16021)))
    }else {
      return null
    }
  })
};
cljs.core.split_with = function split_with(pred, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while(pred, coll), cljs.core.drop_while(pred, coll)])
};
cljs.core.partition_by = function partition_by(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____16024 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____16024)) {
      var s__16025 = temp__3850__auto____16024;
      var fst__16026 = cljs.core.first(s__16025);
      var fv__16027 = f.call(null, fst__16026);
      var run__16028 = cljs.core.cons(fst__16026, cljs.core.take_while(function(p1__16023_SHARP_) {
        return cljs.core._EQ_(fv__16027, f.call(null, p1__16023_SHARP_))
      }, cljs.core.next(s__16025)));
      return cljs.core.cons(run__16028, partition_by.call(null, f, cljs.core.seq(cljs.core.drop(cljs.core.count(run__16028), s__16025))))
    }else {
      return null
    }
  })
};
cljs.core.frequencies = function frequencies(coll) {
  return cljs.core.reduce.__3(function(counts, x) {
    return cljs.core.assoc.__3(counts, x, cljs.core.get.__3(counts, x, 0) + 1)
  }, cljs.core.ObjMap.fromObject([], {}), coll)
};
cljs.core.reductions = function() {
  var reductions = null;
  var reductions__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3847__auto____16040 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3847__auto____16040)) {
        var s__16041 = temp__3847__auto____16040;
        return reductions.call(null, f, cljs.core.first(s__16041), cljs.core.rest(s__16041))
      }else {
        return cljs.core.list(f.call(null))
      }
    })
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons(init, new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____16042 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____16042)) {
        var s__16043 = temp__3850__auto____16042;
        return reductions.call(null, f, f.call(null, init, cljs.core.first(s__16043)), cljs.core.rest(s__16043))
      }else {
        return null
      }
    }))
  };
  reductions = function(f, init, coll) {
    switch(arguments.length) {
      case 2:
        return reductions__2.call(this, f, init);
      case 3:
        return reductions__3.call(this, f, init, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reductions.__2 = reductions__2;
  reductions.__3 = reductions__3;
  return reductions
}();
cljs.core.juxt = function() {
  var juxt = null;
  var juxt__1 = function(f) {
    return function() {
      var G__16047 = null;
      var G__16047__0 = function() {
        return cljs.core.vector(f.call(null))
      };
      var G__16047__1 = function(x) {
        return cljs.core.vector(f.call(null, x))
      };
      var G__16047__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y))
      };
      var G__16047__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z))
      };
      var G__16047__4 = function() {
        var G__16048__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args))
        };
        var G__16048 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16048__delegate.call(this, x, y, z, args)
        };
        G__16048.cljs$lang$maxFixedArity = 3;
        G__16048.cljs$lang$applyTo = function(arglist__16049) {
          var x = cljs.core.first(arglist__16049);
          var y = cljs.core.first(cljs.core.next(arglist__16049));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16049)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16049)));
          return G__16048__delegate.call(this, x, y, z, args)
        };
        return G__16048
      }();
      G__16047 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__16047__0.call(this);
          case 1:
            return G__16047__1.call(this, x);
          case 2:
            return G__16047__2.call(this, x, y);
          case 3:
            return G__16047__3.call(this, x, y, z);
          default:
            return G__16047__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16047.cljs$lang$maxFixedArity = 3;
      G__16047.cljs$lang$applyTo = G__16047__4.cljs$lang$applyTo;
      return G__16047
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__16050 = null;
      var G__16050__0 = function() {
        return cljs.core.vector(f.call(null), g.call(null))
      };
      var G__16050__1 = function(x) {
        return cljs.core.vector(f.call(null, x), g.call(null, x))
      };
      var G__16050__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y), g.call(null, x, y))
      };
      var G__16050__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__16050__4 = function() {
        var G__16051__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args), cljs.core.apply.__5(g, x, y, z, args))
        };
        var G__16051 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16051__delegate.call(this, x, y, z, args)
        };
        G__16051.cljs$lang$maxFixedArity = 3;
        G__16051.cljs$lang$applyTo = function(arglist__16052) {
          var x = cljs.core.first(arglist__16052);
          var y = cljs.core.first(cljs.core.next(arglist__16052));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16052)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16052)));
          return G__16051__delegate.call(this, x, y, z, args)
        };
        return G__16051
      }();
      G__16050 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__16050__0.call(this);
          case 1:
            return G__16050__1.call(this, x);
          case 2:
            return G__16050__2.call(this, x, y);
          case 3:
            return G__16050__3.call(this, x, y, z);
          default:
            return G__16050__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16050.cljs$lang$maxFixedArity = 3;
      G__16050.cljs$lang$applyTo = G__16050__4.cljs$lang$applyTo;
      return G__16050
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__16053 = null;
      var G__16053__0 = function() {
        return cljs.core.vector(f.call(null), g.call(null), h.call(null))
      };
      var G__16053__1 = function(x) {
        return cljs.core.vector(f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__16053__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__16053__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__16053__4 = function() {
        var G__16054__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args), cljs.core.apply.__5(g, x, y, z, args), cljs.core.apply.__5(h, x, y, z, args))
        };
        var G__16054 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__16054__delegate.call(this, x, y, z, args)
        };
        G__16054.cljs$lang$maxFixedArity = 3;
        G__16054.cljs$lang$applyTo = function(arglist__16055) {
          var x = cljs.core.first(arglist__16055);
          var y = cljs.core.first(cljs.core.next(arglist__16055));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16055)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16055)));
          return G__16054__delegate.call(this, x, y, z, args)
        };
        return G__16054
      }();
      G__16053 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__16053__0.call(this);
          case 1:
            return G__16053__1.call(this, x);
          case 2:
            return G__16053__2.call(this, x, y);
          case 3:
            return G__16053__3.call(this, x, y, z);
          default:
            return G__16053__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__16053.cljs$lang$maxFixedArity = 3;
      G__16053.cljs$lang$applyTo = G__16053__4.cljs$lang$applyTo;
      return G__16053
    }()
  };
  var juxt__4 = function() {
    var G__16056__delegate = function(f, g, h, fs) {
      var fs__16046 = cljs.core.list_STAR_.__4(f, g, h, fs);
      return function() {
        var G__16057 = null;
        var G__16057__0 = function() {
          return cljs.core.reduce.__3(function(p1__16030_SHARP_, p2__16031_SHARP_) {
            return cljs.core.conj.__2(p1__16030_SHARP_, p2__16031_SHARP_.call(null))
          }, cljs.core.PersistentVector.fromArray([]), fs__16046)
        };
        var G__16057__1 = function(x) {
          return cljs.core.reduce.__3(function(p1__16032_SHARP_, p2__16033_SHARP_) {
            return cljs.core.conj.__2(p1__16032_SHARP_, p2__16033_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.fromArray([]), fs__16046)
        };
        var G__16057__2 = function(x, y) {
          return cljs.core.reduce.__3(function(p1__16034_SHARP_, p2__16035_SHARP_) {
            return cljs.core.conj.__2(p1__16034_SHARP_, p2__16035_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.fromArray([]), fs__16046)
        };
        var G__16057__3 = function(x, y, z) {
          return cljs.core.reduce.__3(function(p1__16036_SHARP_, p2__16037_SHARP_) {
            return cljs.core.conj.__2(p1__16036_SHARP_, p2__16037_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.fromArray([]), fs__16046)
        };
        var G__16057__4 = function() {
          var G__16058__delegate = function(x, y, z, args) {
            return cljs.core.reduce.__3(function(p1__16038_SHARP_, p2__16039_SHARP_) {
              return cljs.core.conj.__2(p1__16038_SHARP_, cljs.core.apply.__5(p2__16039_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.fromArray([]), fs__16046)
          };
          var G__16058 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__16058__delegate.call(this, x, y, z, args)
          };
          G__16058.cljs$lang$maxFixedArity = 3;
          G__16058.cljs$lang$applyTo = function(arglist__16059) {
            var x = cljs.core.first(arglist__16059);
            var y = cljs.core.first(cljs.core.next(arglist__16059));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16059)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16059)));
            return G__16058__delegate.call(this, x, y, z, args)
          };
          return G__16058
        }();
        G__16057 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__16057__0.call(this);
            case 1:
              return G__16057__1.call(this, x);
            case 2:
              return G__16057__2.call(this, x, y);
            case 3:
              return G__16057__3.call(this, x, y, z);
            default:
              return G__16057__4.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__16057.cljs$lang$maxFixedArity = 3;
        G__16057.cljs$lang$applyTo = G__16057__4.cljs$lang$applyTo;
        return G__16057
      }()
    };
    var G__16056 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__16056__delegate.call(this, f, g, h, fs)
    };
    G__16056.cljs$lang$maxFixedArity = 3;
    G__16056.cljs$lang$applyTo = function(arglist__16060) {
      var f = cljs.core.first(arglist__16060);
      var g = cljs.core.first(cljs.core.next(arglist__16060));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16060)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__16060)));
      return G__16056__delegate.call(this, f, g, h, fs)
    };
    return G__16056
  }();
  juxt = function(f, g, h, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 1:
        return juxt__1.call(this, f);
      case 2:
        return juxt__2.call(this, f, g);
      case 3:
        return juxt__3.call(this, f, g, h);
      default:
        return juxt__4.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  juxt.cljs$lang$maxFixedArity = 3;
  juxt.cljs$lang$applyTo = juxt__4.cljs$lang$applyTo;
  juxt.__1 = juxt__1;
  juxt.__2 = juxt__2;
  juxt.__3 = juxt__3;
  juxt.__4 = juxt__4;
  return juxt
}();
cljs.core.dorun = function() {
  var dorun = null;
  var dorun__1 = function(coll) {
    while(true) {
      if(cljs.core.truth_(cljs.core.seq(coll))) {
        var G__16063 = cljs.core.next(coll);
        coll = G__16063;
        continue
      }else {
        return null
      }
      break
    }
  };
  var dorun__2 = function(n, coll) {
    while(true) {
      if(cljs.core.truth_(function() {
        var and__3698__auto____16061 = cljs.core.seq(coll);
        if(cljs.core.truth_(and__3698__auto____16061)) {
          return n > 0
        }else {
          return and__3698__auto____16061
        }
      }())) {
        var G__16066 = n - 1;
        var G__16067 = cljs.core.next(coll);
        n = G__16066;
        coll = G__16067;
        continue
      }else {
        return null
      }
      break
    }
  };
  dorun = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return dorun__1.call(this, n);
      case 2:
        return dorun__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  dorun.__1 = dorun__1;
  dorun.__2 = dorun__2;
  return dorun
}();
cljs.core.doall = function() {
  var doall = null;
  var doall__1 = function(coll) {
    cljs.core.dorun.__1(coll);
    return coll
  };
  var doall__2 = function(n, coll) {
    cljs.core.dorun.__2(n, coll);
    return coll
  };
  doall = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return doall__1.call(this, n);
      case 2:
        return doall__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  doall.__1 = doall__1;
  doall.__2 = doall__2;
  return doall
}();
cljs.core.re_matches = function re_matches(re, s) {
  var matches__16068 = re.exec(s);
  if(cljs.core.truth_(cljs.core._EQ_(cljs.core.first(matches__16068), s))) {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.count(matches__16068), 1))) {
      return cljs.core.first(matches__16068)
    }else {
      return cljs.core.vec(matches__16068)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__16071 = re.exec(s);
  if(matches__16071 === null) {
    return null
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.count(matches__16071), 1))) {
      return cljs.core.first(matches__16071)
    }else {
      return cljs.core.vec(matches__16071)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__16074 = cljs.core.re_find(re, s);
  var match_idx__16075 = s.search(re);
  var match_str__16076 = cljs.core.truth_(cljs.core.coll_QMARK_(match_data__16074)) ? cljs.core.first(match_data__16074) : match_data__16074;
  var post_match__16077 = cljs.core.subs.__2(s, match_idx__16075 + cljs.core.count(match_str__16076));
  if(cljs.core.truth_(match_data__16074)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(match_data__16074, re_seq.call(null, re, post_match__16077))
    })
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__16080__16081 = cljs.core.re_find(/^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___16082 = cljs.core.nth.call(null, vec__16080__16081, 0, null);
  var flags__16083 = cljs.core.nth.call(null, vec__16080__16081, 1, null);
  var pattern__16084 = cljs.core.nth.call(null, vec__16080__16081, 2, null);
  return new RegExp(pattern__16084, flags__16083)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat(cljs.core.PersistentVector.fromArray([begin]), cljs.core.flatten1(cljs.core.interpose(cljs.core.PersistentVector.fromArray([sep]), cljs.core.map.__2(function(p1__16079_SHARP_) {
    return print_one.call(null, p1__16079_SHARP_, opts)
  }, coll))), cljs.core.PersistentVector.fromArray([end]))
};
cljs.core.string_print = function string_print(x) {
  cljs.core._STAR_print_fn_STAR_(x);
  return null
};
cljs.core.flush = function flush() {
  return null
};
cljs.core.pr_seq = function pr_seq(obj, opts) {
  if(obj === null) {
    return cljs.core.list("nil")
  }else {
    if(void 0 === obj) {
      return cljs.core.list("#<undefined>")
    }else {
      if("\ufdd0'else") {
        return cljs.core.concat.__2(cljs.core.truth_(function() {
          var and__3698__auto____16085 = cljs.core.get.__2(opts, "\ufdd0'meta");
          if(cljs.core.truth_(and__3698__auto____16085)) {
            var and__3698__auto____16089 = function() {
              var x__457__auto____16086 = obj;
              if(cljs.core.truth_(function() {
                var and__3698__auto____16087 = x__457__auto____16086;
                if(cljs.core.truth_(and__3698__auto____16087)) {
                  var and__3698__auto____16088 = x__457__auto____16086.cljs$core$IMeta$;
                  if(cljs.core.truth_(and__3698__auto____16088)) {
                    return cljs.core.not.call(null, x__457__auto____16086.hasOwnProperty("cljs$core$IMeta$"))
                  }else {
                    return and__3698__auto____16088
                  }
                }else {
                  return and__3698__auto____16087
                }
              }())) {
                return true
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__457__auto____16086)
              }
            }();
            if(cljs.core.truth_(and__3698__auto____16089)) {
              return cljs.core.meta(obj)
            }else {
              return and__3698__auto____16089
            }
          }else {
            return and__3698__auto____16085
          }
        }()) ? cljs.core.concat(cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta(obj), opts), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
          var x__457__auto____16090 = obj;
          if(cljs.core.truth_(function() {
            var and__3698__auto____16091 = x__457__auto____16090;
            if(cljs.core.truth_(and__3698__auto____16091)) {
              var and__3698__auto____16092 = x__457__auto____16090.cljs$core$IPrintable$;
              if(cljs.core.truth_(and__3698__auto____16092)) {
                return cljs.core.not.call(null, x__457__auto____16090.hasOwnProperty("cljs$core$IPrintable$"))
              }else {
                return and__3698__auto____16092
              }
            }else {
              return and__3698__auto____16091
            }
          }())) {
            return true
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, x__457__auto____16090)
          }
        }()) ? cljs.core._pr_seq(obj, opts) : cljs.core.list("#<", cljs.core.str.__1(obj), ">"))
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb = function pr_sb(objs, opts) {
  var first_obj__16104 = cljs.core.first(objs);
  var sb__16105 = new goog.string.StringBuffer;
  var G__16106__16107 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__16106__16107)) {
    var obj__16108 = cljs.core.first.call(null, G__16106__16107);
    var G__16106__16109 = G__16106__16107;
    while(true) {
      if(obj__16108 === first_obj__16104) {
      }else {
        sb__16105.append(" ")
      }
      var G__16110__16111 = cljs.core.seq.call(null, cljs.core.pr_seq(obj__16108, opts));
      if(cljs.core.truth_(G__16110__16111)) {
        var string__16112 = cljs.core.first.call(null, G__16110__16111);
        var G__16110__16113 = G__16110__16111;
        while(true) {
          sb__16105.append(string__16112);
          var temp__3850__auto____16114 = cljs.core.next.call(null, G__16110__16113);
          if(cljs.core.truth_(temp__3850__auto____16114)) {
            var G__16110__16115 = temp__3850__auto____16114;
            var G__16122 = cljs.core.first.call(null, G__16110__16115);
            var G__16123 = G__16110__16115;
            string__16112 = G__16122;
            G__16110__16113 = G__16123;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3850__auto____16116 = cljs.core.next.call(null, G__16106__16109);
      if(cljs.core.truth_(temp__3850__auto____16116)) {
        var G__16106__16117 = temp__3850__auto____16116;
        var G__16125 = cljs.core.first.call(null, G__16106__16117);
        var G__16126 = G__16106__16117;
        obj__16108 = G__16125;
        G__16106__16109 = G__16126;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return sb__16105
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  return cljs.core.str.__1(cljs.core.pr_sb(objs, opts))
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  var sb__16127 = cljs.core.pr_sb(objs, opts);
  sb__16127.append("\n");
  return cljs.core.str.__1(sb__16127)
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  var first_obj__16128 = cljs.core.first(objs);
  var G__16129__16130 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__16129__16130)) {
    var obj__16131 = cljs.core.first.call(null, G__16129__16130);
    var G__16129__16132 = G__16129__16130;
    while(true) {
      if(obj__16131 === first_obj__16128) {
      }else {
        cljs.core.string_print(" ")
      }
      var G__16133__16134 = cljs.core.seq.call(null, cljs.core.pr_seq(obj__16131, opts));
      if(cljs.core.truth_(G__16133__16134)) {
        var string__16135 = cljs.core.first.call(null, G__16133__16134);
        var G__16133__16136 = G__16133__16134;
        while(true) {
          cljs.core.string_print(string__16135);
          var temp__3850__auto____16137 = cljs.core.next.call(null, G__16133__16136);
          if(cljs.core.truth_(temp__3850__auto____16137)) {
            var G__16133__16138 = temp__3850__auto____16137;
            var G__16145 = cljs.core.first.call(null, G__16133__16138);
            var G__16146 = G__16133__16138;
            string__16135 = G__16145;
            G__16133__16136 = G__16146;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3850__auto____16139 = cljs.core.next.call(null, G__16129__16132);
      if(cljs.core.truth_(temp__3850__auto____16139)) {
        var G__16129__16140 = temp__3850__auto____16139;
        var G__16148 = cljs.core.first.call(null, G__16129__16140);
        var G__16149 = G__16129__16140;
        obj__16131 = G__16148;
        G__16129__16132 = G__16149;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.newline = function newline(opts) {
  cljs.core.string_print("\n");
  if(cljs.core.truth_(cljs.core.get.__2(opts, "\ufdd0'flush-on-newline"))) {
    return cljs.core.flush()
  }else {
    return null
  }
};
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = function pr_opts() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var pr_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts(objs, cljs.core.pr_opts())
  };
  var pr_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr_str__delegate.call(this, objs)
  };
  pr_str.cljs$lang$maxFixedArity = 0;
  pr_str.cljs$lang$applyTo = function(arglist__16151) {
    var objs = cljs.core.seq(arglist__16151);
    return pr_str__delegate.call(this, objs)
  };
  return pr_str
}();
cljs.core.prn_str = function() {
  var prn_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts(objs, cljs.core.pr_opts())
  };
  var prn_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn_str__delegate.call(this, objs)
  };
  prn_str.cljs$lang$maxFixedArity = 0;
  prn_str.cljs$lang$applyTo = function(arglist__16152) {
    var objs = cljs.core.seq(arglist__16152);
    return prn_str__delegate.call(this, objs)
  };
  return prn_str
}();
cljs.core.pr = function() {
  var pr__delegate = function(objs) {
    return cljs.core.pr_with_opts(objs, cljs.core.pr_opts())
  };
  var pr = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr__delegate.call(this, objs)
  };
  pr.cljs$lang$maxFixedArity = 0;
  pr.cljs$lang$applyTo = function(arglist__16153) {
    var objs = cljs.core.seq(arglist__16153);
    return pr__delegate.call(this, objs)
  };
  return pr
}();
cljs.core.print = function() {
  var cljs_core_print__delegate = function(objs) {
    return cljs.core.pr_with_opts(objs, cljs.core.assoc.__3(cljs.core.pr_opts(), "\ufdd0'readably", false))
  };
  var cljs_core_print = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return cljs_core_print__delegate.call(this, objs)
  };
  cljs_core_print.cljs$lang$maxFixedArity = 0;
  cljs_core_print.cljs$lang$applyTo = function(arglist__16154) {
    var objs = cljs.core.seq(arglist__16154);
    return cljs_core_print__delegate.call(this, objs)
  };
  return cljs_core_print
}();
cljs.core.print_str = function() {
  var print_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts(objs, cljs.core.assoc.__3(cljs.core.pr_opts(), "\ufdd0'readably", false))
  };
  var print_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return print_str__delegate.call(this, objs)
  };
  print_str.cljs$lang$maxFixedArity = 0;
  print_str.cljs$lang$applyTo = function(arglist__16155) {
    var objs = cljs.core.seq(arglist__16155);
    return print_str__delegate.call(this, objs)
  };
  return print_str
}();
cljs.core.println = function() {
  var println__delegate = function(objs) {
    cljs.core.pr_with_opts(objs, cljs.core.assoc.__3(cljs.core.pr_opts(), "\ufdd0'readably", false));
    return cljs.core.newline(cljs.core.pr_opts())
  };
  var println = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println__delegate.call(this, objs)
  };
  println.cljs$lang$maxFixedArity = 0;
  println.cljs$lang$applyTo = function(arglist__16156) {
    var objs = cljs.core.seq(arglist__16156);
    return println__delegate.call(this, objs)
  };
  return println
}();
cljs.core.println_str = function() {
  var println_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts(objs, cljs.core.assoc.__3(cljs.core.pr_opts(), "\ufdd0'readably", false))
  };
  var println_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println_str__delegate.call(this, objs)
  };
  println_str.cljs$lang$maxFixedArity = 0;
  println_str.cljs$lang$applyTo = function(arglist__16157) {
    var objs = cljs.core.seq(arglist__16157);
    return println_str__delegate.call(this, objs)
  };
  return println_str
}();
cljs.core.prn = function() {
  var prn__delegate = function(objs) {
    cljs.core.pr_with_opts(objs, cljs.core.pr_opts());
    return cljs.core.newline(cljs.core.pr_opts())
  };
  var prn = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn__delegate.call(this, objs)
  };
  prn.cljs$lang$maxFixedArity = 0;
  prn.cljs$lang$applyTo = function(arglist__16158) {
    var objs = cljs.core.seq(arglist__16158);
    return prn__delegate.call(this, objs)
  };
  return prn
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  var pr_pair__16159 = function(keyval) {
    return cljs.core.pr_sequential(cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential(pr_pair__16159, "{", ", ", "}", opts, coll)
};
cljs.core.IPrintable["number"] = true;
cljs.core._pr_seq["number"] = function(n, opts) {
  return cljs.core.list(cljs.core.str.__1(n))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["boolean"] = true;
cljs.core._pr_seq["boolean"] = function(bool, opts) {
  return cljs.core.list(cljs.core.str.__1(bool))
};
cljs.core.Set.prototype.cljs$core$IPrintable$ = true;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.IPrintable["string"] = true;
cljs.core._pr_seq["string"] = function(obj, opts) {
  if(cljs.core.truth_(cljs.core.keyword_QMARK_(obj))) {
    return cljs.core.list(cljs.core.str(":", function() {
      var temp__3850__auto____16160 = cljs.core.namespace(obj);
      if(cljs.core.truth_(temp__3850__auto____16160)) {
        var nspc__16161 = temp__3850__auto____16160;
        return cljs.core.str(nspc__16161, "/")
      }else {
        return null
      }
    }(), cljs.core.name(obj)))
  }else {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_(obj))) {
      return cljs.core.list(cljs.core.str(function() {
        var temp__3850__auto____16162 = cljs.core.namespace(obj);
        if(cljs.core.truth_(temp__3850__auto____16162)) {
          var nspc__16163 = temp__3850__auto____16162;
          return cljs.core.str(nspc__16163, "/")
        }else {
          return null
        }
      }(), cljs.core.name(obj)))
    }else {
      if("\ufdd0'else") {
        return cljs.core.list(cljs.core.truth_("\ufdd0'readably".call(null, opts)) ? goog.string.quote.call(null, obj) : obj)
      }else {
        return null
      }
    }
  }
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["array"] = true;
cljs.core._pr_seq["array"] = function(a, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "#<Array [", ", ", "]>", opts, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["function"] = true;
cljs.core._pr_seq["function"] = function(this$) {
  return cljs.core.list("#<", cljs.core.str.__1(this$), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.list("()")
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  return cljs.core.pr_sequential(cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  var pr_pair__16164 = function(keyval) {
    return cljs.core.pr_sequential(cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential(pr_pair__16164, "{", ", ", "}", opts, coll)
};
cljs.core.Atom = function(state, meta, validator, watches) {
  this.state = state;
  this.meta = meta;
  this.validator = validator;
  this.watches = watches
};
cljs.core.Atom.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$ = true;
cljs.core.Atom.prototype.cljs$core$IHash$_hash__1 = function(this$) {
  var this__16170 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches__3 = function(this$, oldval, newval) {
  var this__16171 = this;
  var G__16172__16173 = cljs.core.seq.call(null, this__16171.watches);
  if(cljs.core.truth_(G__16172__16173)) {
    var G__16175__16177 = cljs.core.first.call(null, G__16172__16173);
    var vec__16176__16178 = G__16175__16177;
    var key__16179 = cljs.core.nth.call(null, vec__16176__16178, 0, null);
    var f__16180 = cljs.core.nth.call(null, vec__16176__16178, 1, null);
    var G__16172__16181 = G__16172__16173;
    var G__16175__16182 = G__16175__16177;
    var G__16172__16183 = G__16172__16181;
    while(true) {
      var vec__16184__16185 = G__16175__16182;
      var key__16186 = cljs.core.nth.call(null, vec__16184__16185, 0, null);
      var f__16187 = cljs.core.nth.call(null, vec__16184__16185, 1, null);
      var G__16172__16188 = G__16172__16183;
      f__16187.call(null, key__16186, this$, oldval, newval);
      var temp__3850__auto____16189 = cljs.core.next.call(null, G__16172__16188);
      if(cljs.core.truth_(temp__3850__auto____16189)) {
        var G__16172__16190 = temp__3850__auto____16189;
        var G__16199 = cljs.core.first.call(null, G__16172__16190);
        var G__16200 = G__16172__16190;
        G__16175__16182 = G__16199;
        G__16172__16183 = G__16200;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch__3 = function(this$, key, f) {
  var this__16191 = this;
  return this$.watches = cljs.core.assoc.__3(this__16191.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch__2 = function(this$, key) {
  var this__16192 = this;
  return this$.watches = cljs.core.dissoc.__2(this__16192.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq__2 = function(a, opts) {
  var this__16193 = this;
  return cljs.core.concat(cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq(this__16193.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta__1 = function(_) {
  var this__16194 = this;
  return this__16194.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref__1 = function(_) {
  var this__16195 = this;
  return this__16195.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv__2 = function(o, other) {
  var this__16196 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__16207__delegate = function(x, p__16201) {
      var map__16202__16203 = p__16201;
      var map__16202__16204 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__16202__16203)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__16202__16203) : map__16202__16203;
      var validator__16205 = cljs.core.get.call(null, map__16202__16204, "\ufdd0'validator");
      var meta__16206 = cljs.core.get.call(null, map__16202__16204, "\ufdd0'meta");
      return new cljs.core.Atom(x, meta__16206, validator__16205, null)
    };
    var G__16207 = function(x, var_args) {
      var p__16201 = null;
      if(goog.isDef(var_args)) {
        p__16201 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__16207__delegate.call(this, x, p__16201)
    };
    G__16207.cljs$lang$maxFixedArity = 1;
    G__16207.cljs$lang$applyTo = function(arglist__16208) {
      var x = cljs.core.first(arglist__16208);
      var p__16201 = cljs.core.rest(arglist__16208);
      return G__16207__delegate.call(this, x, p__16201)
    };
    return G__16207
  }();
  atom = function(x, var_args) {
    var p__16201 = var_args;
    switch(arguments.length) {
      case 1:
        return atom__1.call(this, x);
      default:
        return atom__2.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  atom.cljs$lang$maxFixedArity = 1;
  atom.cljs$lang$applyTo = atom__2.cljs$lang$applyTo;
  atom.__1 = atom__1;
  atom.__2 = atom__2;
  return atom
}();
cljs.core.reset_BANG_ = function reset_BANG_(a, new_value) {
  var temp__3850__auto____16209 = a.validator;
  if(cljs.core.truth_(temp__3850__auto____16209)) {
    var validate__16210 = temp__3850__auto____16209;
    if(cljs.core.truth_(validate__16210.call(null, new_value))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", "Validator rejected reference state", "\n", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 3282)))));
    }
  }else {
  }
  var old_value__16211 = a.state;
  a.state = new_value;
  cljs.core._notify_watches(a, old_value__16211, new_value);
  return new_value
};
cljs.core.swap_BANG_ = function() {
  var swap_BANG_ = null;
  var swap_BANG___2 = function(a, f) {
    return cljs.core.reset_BANG_(a, f.call(null, a.state))
  };
  var swap_BANG___3 = function(a, f, x) {
    return cljs.core.reset_BANG_(a, f.call(null, a.state, x))
  };
  var swap_BANG___4 = function(a, f, x, y) {
    return cljs.core.reset_BANG_(a, f.call(null, a.state, x, y))
  };
  var swap_BANG___5 = function(a, f, x, y, z) {
    return cljs.core.reset_BANG_(a, f.call(null, a.state, x, y, z))
  };
  var swap_BANG___6 = function() {
    var G__16214__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_(a, cljs.core.apply(f, a.state, x, y, z, more))
    };
    var G__16214 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__16214__delegate.call(this, a, f, x, y, z, more)
    };
    G__16214.cljs$lang$maxFixedArity = 5;
    G__16214.cljs$lang$applyTo = function(arglist__16215) {
      var a = cljs.core.first(arglist__16215);
      var f = cljs.core.first(cljs.core.next(arglist__16215));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__16215)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16215))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16215)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__16215)))));
      return G__16214__delegate.call(this, a, f, x, y, z, more)
    };
    return G__16214
  }();
  swap_BANG_ = function(a, f, x, y, z, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return swap_BANG___2.call(this, a, f);
      case 3:
        return swap_BANG___3.call(this, a, f, x);
      case 4:
        return swap_BANG___4.call(this, a, f, x, y);
      case 5:
        return swap_BANG___5.call(this, a, f, x, y, z);
      default:
        return swap_BANG___6.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  swap_BANG_.cljs$lang$maxFixedArity = 5;
  swap_BANG_.cljs$lang$applyTo = swap_BANG___6.cljs$lang$applyTo;
  swap_BANG_.__2 = swap_BANG___2;
  swap_BANG_.__3 = swap_BANG___3;
  swap_BANG_.__4 = swap_BANG___4;
  swap_BANG_.__5 = swap_BANG___5;
  swap_BANG_.__6 = swap_BANG___6;
  return swap_BANG_
}();
cljs.core.compare_and_set_BANG_ = function compare_and_set_BANG_(a, oldval, newval) {
  if(cljs.core.truth_(cljs.core._EQ_(a.state, oldval))) {
    cljs.core.reset_BANG_(a, newval);
    return true
  }else {
    return false
  }
};
cljs.core.deref = function deref(o) {
  return cljs.core._deref(o)
};
cljs.core.set_validator_BANG_ = function set_validator_BANG_(iref, val) {
  return iref.validator = val
};
cljs.core.get_validator = function get_validator(iref) {
  return iref.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var alter_meta_BANG___delegate = function(iref, f, args) {
    return iref.meta = cljs.core.apply.__3(f, iref.meta, args)
  };
  var alter_meta_BANG_ = function(iref, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__16217) {
    var iref = cljs.core.first(arglist__16217);
    var f = cljs.core.first(cljs.core.next(arglist__16217));
    var args = cljs.core.rest(cljs.core.next(arglist__16217));
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  return alter_meta_BANG_
}();
cljs.core.reset_meta_BANG_ = function reset_meta_BANG_(iref, m) {
  return iref.meta = m
};
cljs.core.add_watch = function add_watch(iref, key, f) {
  return cljs.core._add_watch(iref, key, f)
};
cljs.core.remove_watch = function remove_watch(iref, key) {
  return cljs.core._remove_watch(iref, key)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var gensym = null;
  var gensym__0 = function() {
    return gensym.call(null, "G__")
  };
  var gensym__1 = function(prefix_string) {
    if(cljs.core.gensym_counter === null) {
      cljs.core.gensym_counter = cljs.core.atom.__1(0)
    }else {
    }
    return cljs.core.symbol.__1(cljs.core.str(prefix_string, cljs.core.swap_BANG_.__2(cljs.core.gensym_counter, cljs.core.inc)))
  };
  gensym = function(prefix_string) {
    switch(arguments.length) {
      case 0:
        return gensym__0.call(this);
      case 1:
        return gensym__1.call(this, prefix_string)
    }
    throw"Invalid arity: " + arguments.length;
  };
  gensym.__0 = gensym__0;
  gensym.__1 = gensym__1;
  return gensym
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(state, f) {
  this.state = state;
  this.f = f
};
cljs.core.Delay.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$ = true;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK___1 = function(d) {
  var this__16219 = this;
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this__16219.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref__1 = function(_) {
  var this__16220 = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.__2(this__16220.state, function(p__16221) {
    var curr_state__16222 = p__16221;
    var curr_state__16223 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, curr_state__16222)) ? cljs.core.apply.call(null, cljs.core.hash_map, curr_state__16222) : curr_state__16222;
    var done__16224 = cljs.core.get.call(null, curr_state__16223, "\ufdd0'done");
    if(cljs.core.truth_(done__16224)) {
      return curr_state__16223
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__16220.f.call(null)})
    }
  }))
};
cljs.core.Delay;
cljs.core.delay_QMARK_ = function delay_QMARK_(x) {
  return cljs.core.instance_QMARK_(cljs.core.Delay, x)
};
cljs.core.force = function force(x) {
  if(cljs.core.truth_(cljs.core.delay_QMARK_(x))) {
    return cljs.core.deref(x)
  }else {
    return x
  }
};
cljs.core.realized_QMARK_ = function realized_QMARK_(d) {
  return cljs.core._realized_QMARK_(d)
};
cljs.core.js__GT_clj = function() {
  var js__GT_clj__delegate = function(x, options) {
    var map__16227__16228 = options;
    var map__16227__16229 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__16227__16228)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__16227__16228) : map__16227__16228;
    var keywordize_keys__16230 = cljs.core.get.call(null, map__16227__16229, "\ufdd0'keywordize-keys");
    var keyfn__16231 = cljs.core.truth_(keywordize_keys__16230) ? cljs.core.keyword : cljs.core.str;
    var f__16237 = function thisfn(x) {
      if(cljs.core.truth_(cljs.core.seq_QMARK_(x))) {
        return cljs.core.doall.__1(cljs.core.map.__2(thisfn, x))
      }else {
        if(cljs.core.truth_(cljs.core.coll_QMARK_(x))) {
          return cljs.core.into(cljs.core.empty(x), cljs.core.map.__2(thisfn, x))
        }else {
          if(cljs.core.truth_(goog.isArray.call(null, x))) {
            return cljs.core.vec(cljs.core.map.__2(thisfn, x))
          }else {
            if(cljs.core.truth_(goog.isObject.call(null, x))) {
              return cljs.core.into(cljs.core.ObjMap.fromObject([], {}), function() {
                var iter__531__auto____16236 = function iter__16232(s__16233) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__16233__16234 = s__16233;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__16233__16234))) {
                        var k__16235 = cljs.core.first.call(null, s__16233__16234);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__16231.call(null, k__16235), thisfn.call(null, x[k__16235])]), iter__16232.call(null, cljs.core.rest.call(null, s__16233__16234)))
                      }else {
                        return null
                      }
                      break
                    }
                  })
                };
                return iter__531__auto____16236.call(null, cljs.core.js_keys(x))
              }())
            }else {
              if("\ufdd0'else") {
                return x
              }else {
                return null
              }
            }
          }
        }
      }
    };
    return f__16237.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__16244) {
    var x = cljs.core.first(arglist__16244);
    var options = cljs.core.rest(arglist__16244);
    return js__GT_clj__delegate.call(this, x, options)
  };
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__16245 = cljs.core.atom.__1(cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var G__16249__delegate = function(args) {
      var temp__3847__auto____16246 = cljs.core.get.__2(cljs.core.deref.call(null, mem__16245), args);
      if(cljs.core.truth_(temp__3847__auto____16246)) {
        var v__16247 = temp__3847__auto____16246;
        return v__16247
      }else {
        var ret__16248 = cljs.core.apply.__2(f, args);
        cljs.core.swap_BANG_.__4(mem__16245, cljs.core.assoc, args, ret__16248);
        return ret__16248
      }
    };
    var G__16249 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__16249__delegate.call(this, args)
    };
    G__16249.cljs$lang$maxFixedArity = 0;
    G__16249.cljs$lang$applyTo = function(arglist__16251) {
      var args = cljs.core.seq(arglist__16251);
      return G__16249__delegate.call(this, args)
    };
    return G__16249
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__16252 = f.call(null);
      if(cljs.core.truth_(cljs.core.fn_QMARK_(ret__16252))) {
        var G__16254 = ret__16252;
        f = G__16254;
        continue
      }else {
        return ret__16252
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__16255__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.__2(f, args)
      })
    };
    var G__16255 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__16255__delegate.call(this, f, args)
    };
    G__16255.cljs$lang$maxFixedArity = 1;
    G__16255.cljs$lang$applyTo = function(arglist__16256) {
      var f = cljs.core.first(arglist__16256);
      var args = cljs.core.rest(arglist__16256);
      return G__16255__delegate.call(this, f, args)
    };
    return G__16255
  }();
  trampoline = function(f, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 1:
        return trampoline__1.call(this, f);
      default:
        return trampoline__2.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  trampoline.cljs$lang$maxFixedArity = 1;
  trampoline.cljs$lang$applyTo = trampoline__2.cljs$lang$applyTo;
  trampoline.__1 = trampoline__1;
  trampoline.__2 = trampoline__2;
  return trampoline
}();
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return rand.call(null, 1)
  };
  var rand__1 = function(n) {
    return Math.random() * n
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.__0 = rand__0;
  rand.__1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return Math.floor(Math.random() * n)
};
cljs.core.rand_nth = function rand_nth(coll) {
  return cljs.core.nth.__2(coll, cljs.core.rand_int(cljs.core.count(coll)))
};
cljs.core.group_by = function group_by(f, coll) {
  return cljs.core.reduce.__3(function(ret, x) {
    var k__16257 = f.call(null, x);
    return cljs.core.assoc.__3(ret, k__16257, cljs.core.conj.__2(cljs.core.get.__3(ret, k__16257, cljs.core.PersistentVector.fromArray([])), x))
  }, cljs.core.ObjMap.fromObject([], {}), coll)
};
cljs.core.make_hierarchy = function make_hierarchy() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'descendants":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'ancestors":cljs.core.ObjMap.fromObject([], {})})
};
cljs.core.global_hierarchy = cljs.core.atom.__1(cljs.core.make_hierarchy());
cljs.core.isa_QMARK_ = function() {
  var isa_QMARK_ = null;
  var isa_QMARK___2 = function(child, parent) {
    return isa_QMARK_.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), child, parent)
  };
  var isa_QMARK___3 = function(h, child, parent) {
    var or__3700__auto____16258 = cljs.core._EQ_(child, parent);
    if(cljs.core.truth_(or__3700__auto____16258)) {
      return or__3700__auto____16258
    }else {
      var or__3700__auto____16259 = cljs.core.contains_QMARK_("\ufdd0'ancestors".call(null, h).call(null, child), parent);
      if(cljs.core.truth_(or__3700__auto____16259)) {
        return or__3700__auto____16259
      }else {
        var and__3698__auto____16260 = cljs.core.vector_QMARK_(parent);
        if(cljs.core.truth_(and__3698__auto____16260)) {
          var and__3698__auto____16261 = cljs.core.vector_QMARK_(child);
          if(cljs.core.truth_(and__3698__auto____16261)) {
            var and__3698__auto____16262 = cljs.core._EQ_(cljs.core.count(parent), cljs.core.count(child));
            if(cljs.core.truth_(and__3698__auto____16262)) {
              var ret__16263 = true;
              var i__16264 = 0;
              while(true) {
                if(cljs.core.truth_(function() {
                  var or__3700__auto____16265 = cljs.core.not(ret__16263);
                  if(cljs.core.truth_(or__3700__auto____16265)) {
                    return or__3700__auto____16265
                  }else {
                    return cljs.core._EQ_(i__16264, cljs.core.count(parent))
                  }
                }())) {
                  return ret__16263
                }else {
                  var G__16273 = isa_QMARK_.call(null, h, child.call(null, i__16264), parent.call(null, i__16264));
                  var G__16274 = i__16264 + 1;
                  ret__16263 = G__16273;
                  i__16264 = G__16274;
                  continue
                }
                break
              }
            }else {
              return and__3698__auto____16262
            }
          }else {
            return and__3698__auto____16261
          }
        }else {
          return and__3698__auto____16260
        }
      }
    }
  };
  isa_QMARK_ = function(h, child, parent) {
    switch(arguments.length) {
      case 2:
        return isa_QMARK___2.call(this, h, child);
      case 3:
        return isa_QMARK___3.call(this, h, child, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  isa_QMARK_.__2 = isa_QMARK___2;
  isa_QMARK_.__3 = isa_QMARK___3;
  return isa_QMARK_
}();
cljs.core.parents = function() {
  var parents = null;
  var parents__1 = function(tag) {
    return parents.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var parents__2 = function(h, tag) {
    return cljs.core.not_empty(cljs.core.get.__2("\ufdd0'parents".call(null, h), tag))
  };
  parents = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return parents__1.call(this, h);
      case 2:
        return parents__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  parents.__1 = parents__1;
  parents.__2 = parents__2;
  return parents
}();
cljs.core.ancestors = function() {
  var ancestors = null;
  var ancestors__1 = function(tag) {
    return ancestors.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var ancestors__2 = function(h, tag) {
    return cljs.core.not_empty(cljs.core.get.__2("\ufdd0'ancestors".call(null, h), tag))
  };
  ancestors = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return ancestors__1.call(this, h);
      case 2:
        return ancestors__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ancestors.__1 = ancestors__1;
  ancestors.__2 = ancestors__2;
  return ancestors
}();
cljs.core.descendants = function() {
  var descendants = null;
  var descendants__1 = function(tag) {
    return descendants.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var descendants__2 = function(h, tag) {
    return cljs.core.not_empty(cljs.core.get.__2("\ufdd0'descendants".call(null, h), tag))
  };
  descendants = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return descendants__1.call(this, h);
      case 2:
        return descendants__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  descendants.__1 = descendants__1;
  descendants.__2 = descendants__2;
  return descendants
}();
cljs.core.derive = function() {
  var derive = null;
  var derive__2 = function(tag, parent) {
    if(cljs.core.truth_(cljs.core.namespace(parent))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3566)))));
    }
    cljs.core.swap_BANG_.__4(cljs.core.global_hierarchy, derive, tag, parent);
    return null
  };
  var derive__3 = function(h, tag, parent) {
    if(cljs.core.truth_(cljs.core.not_EQ_.__2(tag, parent))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 3570)))));
    }
    var tp__16278 = "\ufdd0'parents".call(null, h);
    var td__16279 = "\ufdd0'descendants".call(null, h);
    var ta__16280 = "\ufdd0'ancestors".call(null, h);
    var tf__16281 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.__3(function(ret, k) {
        return cljs.core.assoc.__3(ret, k, cljs.core.reduce.__3(cljs.core.conj, cljs.core.get.__3(targets, k, cljs.core.set([])), cljs.core.cons(target, targets.call(null, target))))
      }, m, cljs.core.cons(source, sources.call(null, source)))
    };
    var or__3700__auto____16282 = cljs.core.truth_(cljs.core.contains_QMARK_(tp__16278.call(null, tag), parent)) ? null : function() {
      if(cljs.core.truth_(cljs.core.contains_QMARK_(ta__16280.call(null, tag), parent))) {
        throw new Error(cljs.core.str(tag, "already has", parent, "as ancestor"));
      }else {
      }
      if(cljs.core.truth_(cljs.core.contains_QMARK_(ta__16280.call(null, parent), tag))) {
        throw new Error(cljs.core.str("Cyclic derivation:", parent, "has", tag, "as ancestor"));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.__3("\ufdd0'parents".call(null, h), tag, cljs.core.conj.__2(cljs.core.get.__3(tp__16278, tag, cljs.core.set([])), parent)), "\ufdd0'ancestors":tf__16281.call(null, "\ufdd0'ancestors".call(null, h), tag, td__16279, parent, ta__16280), "\ufdd0'descendants":tf__16281.call(null, "\ufdd0'descendants".call(null, h), parent, ta__16280, tag, td__16279)})
    }();
    if(cljs.core.truth_(or__3700__auto____16282)) {
      return or__3700__auto____16282
    }else {
      return h
    }
  };
  derive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return derive__2.call(this, h, tag);
      case 3:
        return derive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  derive.__2 = derive__2;
  derive.__3 = derive__3;
  return derive
}();
cljs.core.underive = function() {
  var underive = null;
  var underive__2 = function(tag, parent) {
    cljs.core.swap_BANG_.__4(cljs.core.global_hierarchy, underive, tag, parent);
    return null
  };
  var underive__3 = function(h, tag, parent) {
    var parentMap__16288 = "\ufdd0'parents".call(null, h);
    var childsParents__16289 = cljs.core.truth_(parentMap__16288.call(null, tag)) ? cljs.core.disj.__2(parentMap__16288.call(null, tag), parent) : cljs.core.set([]);
    var newParents__16290 = cljs.core.truth_(cljs.core.not_empty(childsParents__16289)) ? cljs.core.assoc.__3(parentMap__16288, tag, childsParents__16289) : cljs.core.dissoc.__2(parentMap__16288, tag);
    var deriv_seq__16291 = cljs.core.flatten(cljs.core.map.__2(function(p1__16275_SHARP_) {
      return cljs.core.cons(cljs.core.first(p1__16275_SHARP_), cljs.core.interpose(cljs.core.first(p1__16275_SHARP_), cljs.core.second(p1__16275_SHARP_)))
    }, cljs.core.seq(newParents__16290)));
    if(cljs.core.truth_(cljs.core.contains_QMARK_(parentMap__16288.call(null, tag), parent))) {
      return cljs.core.reduce.__3(function(p1__16276_SHARP_, p2__16277_SHARP_) {
        return cljs.core.apply.__3(cljs.core.derive, p1__16276_SHARP_, p2__16277_SHARP_)
      }, cljs.core.make_hierarchy(), cljs.core.partition.__2(2, deriv_seq__16291))
    }else {
      return h
    }
  };
  underive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return underive__2.call(this, h, tag);
      case 3:
        return underive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  underive.__2 = underive__2;
  underive.__3 = underive__3;
  return underive
}();
cljs.core.reset_cache = function reset_cache(method_cache, method_table, cached_hierarchy, hierarchy) {
  cljs.core.swap_BANG_.__2(method_cache, function(_) {
    return cljs.core.deref(method_table)
  });
  return cljs.core.swap_BANG_.__2(cached_hierarchy, function(_) {
    return cljs.core.deref(hierarchy)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(x, y, prefer_table) {
  var xprefs__16293 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3700__auto____16295 = cljs.core.truth_(function() {
    var and__3698__auto____16294 = xprefs__16293;
    if(cljs.core.truth_(and__3698__auto____16294)) {
      return xprefs__16293.call(null, y)
    }else {
      return and__3698__auto____16294
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__3700__auto____16295)) {
    return or__3700__auto____16295
  }else {
    var or__3700__auto____16297 = function() {
      var ps__16296 = cljs.core.parents.__1(y);
      while(true) {
        if(cljs.core.count(ps__16296) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first(ps__16296), prefer_table))) {
          }else {
          }
          var G__16304 = cljs.core.rest(ps__16296);
          ps__16296 = G__16304;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__3700__auto____16297)) {
      return or__3700__auto____16297
    }else {
      var or__3700__auto____16299 = function() {
        var ps__16298 = cljs.core.parents.__1(x);
        while(true) {
          if(cljs.core.count(ps__16298) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first(ps__16298), y, prefer_table))) {
            }else {
            }
            var G__16308 = cljs.core.rest(ps__16298);
            ps__16298 = G__16308;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__3700__auto____16299)) {
        return or__3700__auto____16299
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3700__auto____16310 = cljs.core.prefers_STAR_(x, y, prefer_table);
  if(cljs.core.truth_(or__3700__auto____16310)) {
    return or__3700__auto____16310
  }else {
    return cljs.core.isa_QMARK_.__2(x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__16320 = cljs.core.reduce.__3(function(be, p__16312) {
    var vec__16313__16314 = p__16312;
    var k__16315 = cljs.core.nth.call(null, vec__16313__16314, 0, null);
    var ___16316 = cljs.core.nth.call(null, vec__16313__16314, 1, null);
    var e__16317 = vec__16313__16314;
    if(cljs.core.truth_(cljs.core.isa_QMARK_.__2(dispatch_val, k__16315))) {
      var be2__16319 = cljs.core.truth_(function() {
        var or__3700__auto____16318 = be === null;
        if(or__3700__auto____16318) {
          return or__3700__auto____16318
        }else {
          return cljs.core.dominates(k__16315, cljs.core.first(be), prefer_table)
        }
      }()) ? e__16317 : be;
      if(cljs.core.truth_(cljs.core.dominates(cljs.core.first(be2__16319), k__16315, prefer_table))) {
      }else {
        throw new Error(cljs.core.str("Multiple methods in multimethod '", name, "' match dispatch value: ", dispatch_val, " -> ", k__16315, " and ", cljs.core.first(be2__16319), ", and neither is preferred"));
      }
      return be2__16319
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__16320)) {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy)))) {
      cljs.core.swap_BANG_.__4(method_cache, cljs.core.assoc, dispatch_val, cljs.core.second(best_entry__16320));
      return cljs.core.second(best_entry__16320)
    }else {
      cljs.core.reset_cache(method_cache, method_table, cached_hierarchy, hierarchy);
      return find_and_cache_best_method.call(null, name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy)
    }
  }else {
    return null
  }
};
void 0;
cljs.core.IMultiFn = {};
cljs.core._reset = function _reset(mf) {
  if(function() {
    var and__3698__auto____16326 = mf;
    if(and__3698__auto____16326) {
      return mf.cljs$core$IMultiFn$_reset__1
    }else {
      return and__3698__auto____16326
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset__1(mf)
  }else {
    return function() {
      var or__3700__auto____16327 = cljs.core._reset[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16327) {
        return or__3700__auto____16327
      }else {
        var or__3700__auto____16328 = cljs.core._reset["_"];
        if(or__3700__auto____16328) {
          return or__3700__auto____16328
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__3698__auto____16329 = mf;
    if(and__3698__auto____16329) {
      return mf.cljs$core$IMultiFn$_add_method__3
    }else {
      return and__3698__auto____16329
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method__3(mf, dispatch_val, method)
  }else {
    return function() {
      var or__3700__auto____16330 = cljs.core._add_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16330) {
        return or__3700__auto____16330
      }else {
        var or__3700__auto____16331 = cljs.core._add_method["_"];
        if(or__3700__auto____16331) {
          return or__3700__auto____16331
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__3698__auto____16332 = mf;
    if(and__3698__auto____16332) {
      return mf.cljs$core$IMultiFn$_remove_method__2
    }else {
      return and__3698__auto____16332
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method__2(mf, dispatch_val)
  }else {
    return function() {
      var or__3700__auto____16333 = cljs.core._remove_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16333) {
        return or__3700__auto____16333
      }else {
        var or__3700__auto____16334 = cljs.core._remove_method["_"];
        if(or__3700__auto____16334) {
          return or__3700__auto____16334
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__3698__auto____16335 = mf;
    if(and__3698__auto____16335) {
      return mf.cljs$core$IMultiFn$_prefer_method__3
    }else {
      return and__3698__auto____16335
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method__3(mf, dispatch_val, dispatch_val_y)
  }else {
    return function() {
      var or__3700__auto____16336 = cljs.core._prefer_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16336) {
        return or__3700__auto____16336
      }else {
        var or__3700__auto____16337 = cljs.core._prefer_method["_"];
        if(or__3700__auto____16337) {
          return or__3700__auto____16337
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__3698__auto____16338 = mf;
    if(and__3698__auto____16338) {
      return mf.cljs$core$IMultiFn$_get_method__2
    }else {
      return and__3698__auto____16338
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method__2(mf, dispatch_val)
  }else {
    return function() {
      var or__3700__auto____16339 = cljs.core._get_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16339) {
        return or__3700__auto____16339
      }else {
        var or__3700__auto____16340 = cljs.core._get_method["_"];
        if(or__3700__auto____16340) {
          return or__3700__auto____16340
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__3698__auto____16341 = mf;
    if(and__3698__auto____16341) {
      return mf.cljs$core$IMultiFn$_methods__1
    }else {
      return and__3698__auto____16341
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods__1(mf)
  }else {
    return function() {
      var or__3700__auto____16342 = cljs.core._methods[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16342) {
        return or__3700__auto____16342
      }else {
        var or__3700__auto____16343 = cljs.core._methods["_"];
        if(or__3700__auto____16343) {
          return or__3700__auto____16343
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__3698__auto____16344 = mf;
    if(and__3698__auto____16344) {
      return mf.cljs$core$IMultiFn$_prefers__1
    }else {
      return and__3698__auto____16344
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers__1(mf)
  }else {
    return function() {
      var or__3700__auto____16345 = cljs.core._prefers[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16345) {
        return or__3700__auto____16345
      }else {
        var or__3700__auto____16346 = cljs.core._prefers["_"];
        if(or__3700__auto____16346) {
          return or__3700__auto____16346
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__3698__auto____16347 = mf;
    if(and__3698__auto____16347) {
      return mf.cljs$core$IMultiFn$_dispatch__2
    }else {
      return and__3698__auto____16347
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch__2(mf, args)
  }else {
    return function() {
      var or__3700__auto____16348 = cljs.core._dispatch[goog.typeOf.call(null, mf)];
      if(or__3700__auto____16348) {
        return or__3700__auto____16348
      }else {
        var or__3700__auto____16349 = cljs.core._dispatch["_"];
        if(or__3700__auto____16349) {
          return or__3700__auto____16349
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
void 0;
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__16382 = cljs.core.apply.__2(dispatch_fn, args);
  var target_fn__16383 = cljs.core._get_method(mf, dispatch_val__16382);
  if(cljs.core.truth_(target_fn__16383)) {
  }else {
    throw new Error(cljs.core.str("No method in multimethod '", cljs.core.name, "' for dispatch value: ", dispatch_val__16382));
  }
  return cljs.core.apply.__2(target_fn__16383, args)
};
cljs.core.MultiFn = function(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  this.name = name;
  this.dispatch_fn = dispatch_fn;
  this.default_dispatch_val = default_dispatch_val;
  this.hierarchy = hierarchy;
  this.method_table = method_table;
  this.prefer_table = prefer_table;
  this.method_cache = method_cache;
  this.cached_hierarchy = cached_hierarchy
};
cljs.core.MultiFn.cljs$core$IPrintable$_pr_seq = function(this__372__auto__) {
  return cljs.core.list.call(null, "cljs.core.MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$ = true;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash__1 = function(this$) {
  var this__16385 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset__1 = function(mf) {
  var this__16386 = this;
  cljs.core.swap_BANG_.__2(this__16386.method_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__16386.method_cache, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__16386.prefer_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__16386.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method__3 = function(mf, dispatch_val, method) {
  var this__16387 = this;
  cljs.core.swap_BANG_.__4(this__16387.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache(this__16387.method_cache, this__16387.method_table, this__16387.cached_hierarchy, this__16387.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method__2 = function(mf, dispatch_val) {
  var this__16388 = this;
  cljs.core.swap_BANG_.__3(this__16388.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache(this__16388.method_cache, this__16388.method_table, this__16388.cached_hierarchy, this__16388.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method__2 = function(mf, dispatch_val) {
  var this__16389 = this;
  if(cljs.core.truth_(cljs.core._EQ_(cljs.core.deref.call(null, this__16389.cached_hierarchy), cljs.core.deref.call(null, this__16389.hierarchy)))) {
  }else {
    cljs.core.reset_cache(this__16389.method_cache, this__16389.method_table, this__16389.cached_hierarchy, this__16389.hierarchy)
  }
  var temp__3847__auto____16390 = cljs.core.deref.call(null, this__16389.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__3847__auto____16390)) {
    var target_fn__16391 = temp__3847__auto____16390;
    return target_fn__16391
  }else {
    var temp__3847__auto____16392 = cljs.core.find_and_cache_best_method(this__16389.name, dispatch_val, this__16389.hierarchy, this__16389.method_table, this__16389.prefer_table, this__16389.method_cache, this__16389.cached_hierarchy);
    if(cljs.core.truth_(temp__3847__auto____16392)) {
      var target_fn__16393 = temp__3847__auto____16392;
      return target_fn__16393
    }else {
      return cljs.core.deref.call(null, this__16389.method_table).call(null, this__16389.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method__3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__16394 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_(dispatch_val_x, dispatch_val_y, this__16394.prefer_table))) {
    throw new Error(cljs.core.str("Preference conflict in multimethod '", this__16394.name, "': ", dispatch_val_y, " is already preferred to ", dispatch_val_x));
  }else {
  }
  cljs.core.swap_BANG_.__2(this__16394.prefer_table, function(old) {
    return cljs.core.assoc.__3(old, dispatch_val_x, cljs.core.conj.__2(cljs.core.get.__3(old, dispatch_val_x, cljs.core.set([])), dispatch_val_y))
  });
  return cljs.core.reset_cache(this__16394.method_cache, this__16394.method_table, this__16394.cached_hierarchy, this__16394.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods__1 = function(mf) {
  var this__16395 = this;
  return cljs.core.deref.call(null, this__16395.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers__1 = function(mf) {
  var this__16396 = this;
  return cljs.core.deref.call(null, this__16396.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch__2 = function(mf, args) {
  var this__16397 = this;
  return cljs.core.do_dispatch(mf, this__16397.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__16402__delegate = function(_, args) {
    return cljs.core._dispatch(this, args)
  };
  var G__16402 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__16402__delegate.call(this, _, args)
  };
  G__16402.cljs$lang$maxFixedArity = 1;
  G__16402.cljs$lang$applyTo = function(arglist__16403) {
    var _ = cljs.core.first(arglist__16403);
    var args = cljs.core.rest(arglist__16403);
    return G__16402__delegate.call(this, _, args)
  };
  return G__16402
}();
cljs.core.MultiFn.prototype.apply = function(_, args) {
  return cljs.core._dispatch(this, args)
};
cljs.core.remove_all_methods = function remove_all_methods(multifn) {
  return cljs.core._reset(multifn)
};
cljs.core.remove_method = function remove_method(multifn, dispatch_val) {
  return cljs.core._remove_method(multifn, dispatch_val)
};
cljs.core.prefer_method = function prefer_method(multifn, dispatch_val_x, dispatch_val_y) {
  return cljs.core._prefer_method(multifn, dispatch_val_x, dispatch_val_y)
};
cljs.core.methods$ = function methods$(multifn) {
  return cljs.core._methods(multifn)
};
cljs.core.get_method = function get_method(multifn, dispatch_val) {
  return cljs.core._get_method(multifn, dispatch_val)
};
cljs.core.prefers = function prefers(multifn) {
  return cljs.core._prefers(multifn)
};
goog.provide("argh.utils");
goog.require("cljs.core");
argh.utils.add_attrs = function add_attrs(elem, attr_map) {
  var G__14404__14405 = cljs.core.seq.call(null, attr_map);
  if(cljs.core.truth_(G__14404__14405)) {
    var G__14407__14409 = cljs.core.first.call(null, G__14404__14405);
    var vec__14408__14410 = G__14407__14409;
    var attr__14411 = cljs.core.nth.call(null, vec__14408__14410, 0, null);
    var val__14412 = cljs.core.nth.call(null, vec__14408__14410, 1, null);
    var G__14404__14413 = G__14404__14405;
    var G__14407__14414 = G__14407__14409;
    var G__14404__14415 = G__14404__14413;
    while(true) {
      var vec__14416__14417 = G__14407__14414;
      var attr__14418 = cljs.core.nth.call(null, vec__14416__14417, 0, null);
      var val__14419 = cljs.core.nth.call(null, vec__14416__14417, 1, null);
      var G__14404__14420 = G__14404__14415;
      elem[cljs.core.name(attr__14418)] = val__14419;
      var temp__3850__auto____14421 = cljs.core.next.call(null, G__14404__14420);
      if(cljs.core.truth_(temp__3850__auto____14421)) {
        var G__14404__14422 = temp__3850__auto____14421;
        var G__14425 = cljs.core.first.call(null, G__14404__14422);
        var G__14426 = G__14404__14422;
        G__14407__14414 = G__14425;
        G__14404__14415 = G__14426;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return elem
};
argh.utils.set_fill = function set_fill(ctx, color) {
  return ctx.fillStyle = color
};
argh.utils.set_stroke = function set_stroke(ctx, stroke_style) {
  return ctx.strokeStyle = stroke_style
};
argh.utils.set_font = function set_font(ctx, font) {
  return ctx.font = font
};
goog.provide("argh.gen");
goog.require("cljs.core");
argh.gen.random = function random(min, range) {
  return min + cljs.core.rand_int(range)
};
argh.gen.rand_elt = function rand_elt(set) {
  return cljs.core.rand_nth(cljs.core.vec(set))
};
argh.gen.signum = function signum(x) {
  if(x === 0) {
    return x
  }else {
    if(x > 0) {
      return 1
    }else {
      return-1
    }
  }
};
argh.gen.intersects = function intersects(p__14222, p__14223) {
  var map__14224__14226 = p__14222;
  var map__14224__14227 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14224__14226)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14224__14226) : map__14224__14226;
  var x0__14228 = cljs.core.get.call(null, map__14224__14227, "\ufdd0'x");
  var y0__14229 = cljs.core.get.call(null, map__14224__14227, "\ufdd0'y");
  var w0__14230 = cljs.core.get.call(null, map__14224__14227, "\ufdd0'w");
  var h0__14231 = cljs.core.get.call(null, map__14224__14227, "\ufdd0'h");
  var map__14225__14232 = p__14223;
  var map__14225__14233 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14225__14232)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14225__14232) : map__14225__14232;
  var x1__14234 = cljs.core.get.call(null, map__14225__14233, "\ufdd0'x");
  var y1__14235 = cljs.core.get.call(null, map__14225__14233, "\ufdd0'y");
  var w1__14236 = cljs.core.get.call(null, map__14225__14233, "\ufdd0'w");
  var h1__14237 = cljs.core.get.call(null, map__14225__14233, "\ufdd0'h");
  var and__3698__auto____14241 = function() {
    var or__3700__auto____14239 = function() {
      var and__3698__auto____14238 = x0__14228 >= x1__14234;
      if(and__3698__auto____14238) {
        return x0__14228 <= x1__14234 + w1__14236
      }else {
        return and__3698__auto____14238
      }
    }();
    if(cljs.core.truth_(or__3700__auto____14239)) {
      return or__3700__auto____14239
    }else {
      var and__3698__auto____14240 = x1__14234 >= x0__14228;
      if(and__3698__auto____14240) {
        return x1__14234 <= x0__14228 + w0__14230
      }else {
        return and__3698__auto____14240
      }
    }
  }();
  if(cljs.core.truth_(and__3698__auto____14241)) {
    var or__3700__auto____14243 = function() {
      var and__3698__auto____14242 = y0__14229 >= y1__14235;
      if(and__3698__auto____14242) {
        return y0__14229 <= y1__14235 + h1__14237
      }else {
        return and__3698__auto____14242
      }
    }();
    if(cljs.core.truth_(or__3700__auto____14243)) {
      return or__3700__auto____14243
    }else {
      var and__3698__auto____14244 = y1__14235 >= y0__14229;
      if(and__3698__auto____14244) {
        return y1__14235 <= y0__14229 + h0__14231
      }else {
        return and__3698__auto____14244
      }
    }
  }else {
    return and__3698__auto____14241
  }
};
argh.gen.shuffle = function shuffle(v) {
  var G__14252__14253 = cljs.core.to_array(v);
  garray.shuffle.call(null, G__14252__14253);
  return G__14252__14253
};
argh.gen.empty_map = function empty_map(w, h) {
  return cljs.core.ObjMap.fromObject(["\ufdd0'width", "\ufdd0'height", "\ufdd0'rooms"], {"\ufdd0'width":w, "\ufdd0'height":h, "\ufdd0'rooms":cljs.core.set([])})
};
argh.gen.room = function room(p__14255) {
  var map__14256__14257 = p__14255;
  var map__14256__14258 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14256__14257)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14256__14257) : map__14256__14257;
  var height__14259 = cljs.core.get.call(null, map__14256__14258, "\ufdd0'height");
  var width__14260 = cljs.core.get.call(null, map__14256__14258, "\ufdd0'width");
  return cljs.core.ObjMap.fromObject(["\ufdd0'x", "\ufdd0'y", "\ufdd0'w", "\ufdd0'h"], {"\ufdd0'x":argh.gen.random(2, width__14260 - 14), "\ufdd0'y":argh.gen.random(2, height__14259 - 14), "\ufdd0'w":argh.gen.random(3, 10), "\ufdd0'h":argh.gen.random(3, 10)})
};
argh.gen.add_rooms = function() {
  var add_rooms = null;
  var add_rooms__1 = function(p__14261) {
    var level__14262 = p__14261;
    var level__14263 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, level__14262)) ? cljs.core.apply.call(null, cljs.core.hash_map, level__14262) : level__14262;
    var rooms__14264 = cljs.core.get.call(null, level__14263, "\ufdd0'rooms");
    var available_QMARK___14265 = function(r) {
      return cljs.core.not_any_QMARK_(function(p1__14254_SHARP_) {
        return argh.gen.intersects(r, p1__14254_SHARP_)
      }, rooms__14264)
    };
    var r__14266 = argh.gen.room(level__14263);
    var i__14267 = 0;
    while(true) {
      if(cljs.core.truth_(available_QMARK___14265.call(null, r__14266))) {
        return cljs.core.assoc.__3(level__14263, "\ufdd0'rooms", cljs.core.conj.__2(rooms__14264, r__14266))
      }else {
        if(i__14267 > 1E3) {
          return level__14263
        }else {
          if("\ufdd0'else") {
            var G__14271 = argh.gen.room(level__14263);
            var G__14272 = i__14267 + 1;
            r__14266 = G__14271;
            i__14267 = G__14272;
            continue
          }else {
            return null
          }
        }
      }
      break
    }
  };
  var add_rooms__2 = function(level, n) {
    return cljs.core.nth.__2(cljs.core.iterate(add_rooms, level), n)
  };
  add_rooms = function(level, n) {
    switch(arguments.length) {
      case 1:
        return add_rooms__1.call(this, level);
      case 2:
        return add_rooms__2.call(this, level, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  add_rooms.__1 = add_rooms__1;
  add_rooms.__2 = add_rooms__2;
  return add_rooms
}();
argh.gen.connect = function connect(p__14273, p__14274, p__14275) {
  var map__14276__14279 = p__14273;
  var map__14276__14280 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14276__14279)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14276__14279) : map__14276__14279;
  var height__14281 = cljs.core.get.call(null, map__14276__14280, "\ufdd0'height");
  var width__14282 = cljs.core.get.call(null, map__14276__14280, "\ufdd0'width");
  var map__14277__14283 = p__14274;
  var map__14277__14284 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14277__14283)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14277__14283) : map__14277__14283;
  var fx__14285 = cljs.core.get.call(null, map__14277__14284, "\ufdd0'x");
  var fy__14286 = cljs.core.get.call(null, map__14277__14284, "\ufdd0'y");
  var fw__14287 = cljs.core.get.call(null, map__14277__14284, "\ufdd0'w");
  var fh__14288 = cljs.core.get.call(null, map__14277__14284, "\ufdd0'h");
  var map__14278__14289 = p__14275;
  var map__14278__14290 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14278__14289)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14278__14289) : map__14278__14289;
  var tx__14291 = cljs.core.get.call(null, map__14278__14290, "\ufdd0'x");
  var ty__14292 = cljs.core.get.call(null, map__14278__14290, "\ufdd0'y");
  var tw__14293 = cljs.core.get.call(null, map__14278__14290, "\ufdd0'w");
  var th__14294 = cljs.core.get.call(null, map__14278__14290, "\ufdd0'h");
  var x0__14295 = argh.gen.random(fx__14285, fw__14287);
  var y0__14296 = argh.gen.random(fy__14286, fh__14288);
  var x1__14297 = argh.gen.random(tx__14291, tw__14293);
  var y1__14298 = argh.gen.random(ty__14292, th__14294);
  var dx__14299 = argh.gen.signum(x1__14297 - x0__14295);
  var dy__14300 = argh.gen.signum(y1__14298 - y0__14296);
  var x__14301 = x0__14295;
  var y__14302 = y0__14296;
  var points__14303 = cljs.core.set([]);
  var horizontal_QMARK___14304 = cljs.core.rand_int(2) > 0;
  while(true) {
    if(function() {
      var and__3698__auto____14305 = x__14301 === x1__14297;
      if(and__3698__auto____14305) {
        return y__14302 === y1__14298
      }else {
        return and__3698__auto____14305
      }
    }()) {
      return points__14303
    }else {
      var vec__14306__14309 = cljs.core.truth_(function() {
        var or__3700__auto____14307 = y__14302 === y1__14298;
        if(or__3700__auto____14307) {
          return or__3700__auto____14307
        }else {
          var and__3698__auto____14308 = horizontal_QMARK___14304;
          if(cljs.core.truth_(and__3698__auto____14308)) {
            return cljs.core.not(x__14301 === x1__14297)
          }else {
            return and__3698__auto____14308
          }
        }
      }()) ? cljs.core.PersistentVector.fromArray([x__14301 + dx__14299, y__14302]) : cljs.core.PersistentVector.fromArray([x__14301, y__14302 + dy__14300]);
      var x__14310 = cljs.core.nth.call(null, vec__14306__14309, 0, null);
      var y__14311 = cljs.core.nth.call(null, vec__14306__14309, 1, null);
      if(function() {
        var and__3698__auto____14312 = x__14310 > 0;
        if(and__3698__auto____14312) {
          var and__3698__auto____14313 = y__14311 > 0;
          if(and__3698__auto____14313) {
            var and__3698__auto____14314 = x__14310 < width__14282;
            if(and__3698__auto____14314) {
              return y__14311 < height__14281
            }else {
              return and__3698__auto____14314
            }
          }else {
            return and__3698__auto____14313
          }
        }else {
          return and__3698__auto____14312
        }
      }()) {
        var G__14323 = x__14310;
        var G__14324 = y__14311;
        var G__14325 = cljs.core.conj.__2(points__14303, cljs.core.PersistentVector.fromArray([x__14310, y__14311]));
        var G__14326 = cljs.core.rand_int(10) > 0;
        x__14301 = G__14323;
        y__14302 = G__14324;
        points__14303 = G__14325;
        horizontal_QMARK___14304 = G__14326;
        continue
      }else {
        return points__14303
      }
    }
    break
  }
};
argh.gen.connect_rooms = function connect_rooms(p__14328) {
  var level__14329 = p__14328;
  var level__14330 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, level__14329)) ? cljs.core.apply.call(null, cljs.core.hash_map, level__14329) : level__14329;
  var rooms__14331 = cljs.core.get.call(null, level__14330, "\ufdd0'rooms");
  var height__14332 = cljs.core.get.call(null, level__14330, "\ufdd0'height");
  var width__14333 = cljs.core.get.call(null, level__14330, "\ufdd0'width");
  var from__14334 = argh.gen.rand_elt(rooms__14331);
  var conn__14335 = cljs.core.set([from__14334]);
  var unconn__14336 = cljs.core.disj.__2(rooms__14331, from__14334);
  var paths__14337 = cljs.core.set([]);
  while(true) {
    if(cljs.core.truth_(cljs.core.empty_QMARK_(unconn__14336))) {
      return cljs.core.assoc.__3(level__14330, "\ufdd0'paths", paths__14337)
    }else {
      var to__14338 = argh.gen.rand_elt(unconn__14336);
      var unconn__14339 = cljs.core.disj.__2(unconn__14336, to__14338);
      var conn__14340 = cljs.core.conj.__2(conn__14335, to__14338);
      var G__14342 = argh.gen.rand_elt(conn__14340);
      var G__14343 = conn__14340;
      var G__14344 = unconn__14339;
      var G__14345 = cljs.core.conj.__2(paths__14337, argh.gen.connect(level__14330, from__14334, to__14338));
      from__14334 = G__14342;
      conn__14335 = G__14343;
      unconn__14336 = G__14344;
      paths__14337 = G__14345;
      continue
    }
    break
  }
};
argh.gen.pointify = function pointify(p__14346) {
  var map__14347__14348 = p__14346;
  var map__14347__14349 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14347__14348)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14347__14348) : map__14347__14348;
  var x__14350 = cljs.core.get.call(null, map__14347__14349, "\ufdd0'x");
  var y__14351 = cljs.core.get.call(null, map__14347__14349, "\ufdd0'y");
  var width__14352 = cljs.core.get.call(null, map__14347__14349, "\ufdd0'w");
  var height__14353 = cljs.core.get.call(null, map__14347__14349, "\ufdd0'h");
  return cljs.core.mapcat.__2(function(p__14354) {
    var vec__14355__14356 = p__14354;
    var row__14357 = cljs.core.nth.call(null, vec__14355__14356, 0, null);
    var y__14358 = cljs.core.nth.call(null, vec__14355__14356, 1, null);
    return cljs.core.map.__2(function(p1__14327_SHARP_) {
      return cljs.core.vector(p1__14327_SHARP_, y__14358)
    }, row__14357)
  }, cljs.core.partition.__2(2, cljs.core.interleave.__2(cljs.core.repeat.__2(height__14353, cljs.core.range.__2(x__14350, x__14350 + width__14352)), cljs.core.range.__2(y__14351, y__14351 + height__14353))))
};
argh.gen.Level = function(w, h, data, __meta, __extmap) {
  this.w = w;
  this.h = h;
  this.data = data;
  this.__meta = __meta;
  this.__extmap = __extmap;
  if(arguments.length > 3) {
    this.__meta = __meta;
    this.__extmap = __extmap
  }else {
    this.__meta = null;
    this.__extmap = null
  }
};
argh.gen.Level.prototype.cljs$core$IHash$ = true;
argh.gen.Level.prototype.cljs$core$IHash$_hash__1 = function(this__388__auto__) {
  var this__14362 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.gen.Level.prototype.cljs$core$ILookup$ = true;
argh.gen.Level.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__14363 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.gen.Level.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k14360, else__396__auto__) {
  var this__14364 = this;
  if(k14360 === "\ufdd0'w") {
    return this__14364.w
  }else {
    if(k14360 === "\ufdd0'h") {
      return this__14364.h
    }else {
      if(k14360 === "\ufdd0'data") {
        return this__14364.data
      }else {
        if("\ufdd0'else") {
          return cljs.core.get.call(null, this__14364.__extmap, k14360, else__396__auto__)
        }else {
          return null
        }
      }
    }
  }
};
argh.gen.Level.prototype.cljs$core$IAssociative$ = true;
argh.gen.Level.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__14359) {
  var this__14365 = this;
  var pred__14366__14369 = cljs.core.identical_QMARK_;
  var expr__14367__14370 = k__401__auto__;
  if(cljs.core.truth_(pred__14366__14369.call(null, "\ufdd0'w", expr__14367__14370))) {
    return new argh.gen.Level(G__14359, this__14365.h, this__14365.data, this__14365.__meta, this__14365.__extmap)
  }else {
    if(cljs.core.truth_(pred__14366__14369.call(null, "\ufdd0'h", expr__14367__14370))) {
      return new argh.gen.Level(this__14365.w, G__14359, this__14365.data, this__14365.__meta, this__14365.__extmap)
    }else {
      if(cljs.core.truth_(pred__14366__14369.call(null, "\ufdd0'data", expr__14367__14370))) {
        return new argh.gen.Level(this__14365.w, this__14365.h, G__14359, this__14365.__meta, this__14365.__extmap)
      }else {
        return new argh.gen.Level(this__14365.w, this__14365.h, this__14365.data, this__14365.__meta, cljs.core.assoc.call(null, this__14365.__extmap, k__401__auto__, G__14359))
      }
    }
  }
};
argh.gen.Level.prototype.cljs$core$IRecord$ = true;
argh.gen.Level.prototype.cljs$core$ICollection$ = true;
argh.gen.Level.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__14371 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.gen.Level.prototype.cljs$core$ISeqable$ = true;
argh.gen.Level.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__14372 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__14372.w), cljs.core.vector.call(null, "\ufdd0'h", this__14372.h), cljs.core.vector.call(null, "\ufdd0'data", this__14372.data)]), this__14372.__extmap))
};
argh.gen.Level.prototype.cljs$core$IPrintable$ = true;
argh.gen.Level.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__14373 = this;
  var pr_pair__409__auto____14374 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____14374, cljs.core.str.call(null, "#", "argh.gen.Level", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__14373.w), cljs.core.vector.call(null, "\ufdd0'h", this__14373.h), cljs.core.vector.call(null, "\ufdd0'data", this__14373.data)]), this__14373.__extmap))
};
argh.gen.Level.prototype.cljs$core$ICounted$ = true;
argh.gen.Level.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__14375 = this;
  return 3 + cljs.core.count.call(null, this__14375.__extmap)
};
argh.gen.Level.prototype.cljs$core$IEquiv$ = true;
argh.gen.Level.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__14376 = this;
  var and__3698__auto____14377 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____14377) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____14377
  }
};
argh.gen.Level.prototype.cljs$core$IWithMeta$ = true;
argh.gen.Level.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__14359) {
  var this__14378 = this;
  return new argh.gen.Level(this__14378.w, this__14378.h, this__14378.data, G__14359, this__14378.__extmap)
};
argh.gen.Level.prototype.cljs$core$IMeta$ = true;
argh.gen.Level.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__14379 = this;
  return this__14379.__meta
};
argh.gen.Level.prototype.cljs$core$IMap$ = true;
argh.gen.Level.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__14380 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__14380.__meta), k__403__auto__)
  }else {
    return new argh.gen.Level(this__14380.w, this__14380.h, this__14380.data, this__14380.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__14380.__extmap, k__403__auto__)))
  }
};
argh.gen.Level.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.gen.Level")
};
argh.gen.__GT_Level = function __GT_Level(w, h, data) {
  return new argh.gen.Level(w, h, data)
};
argh.gen.map__GT_Level = function map__GT_Level(G__14361) {
  return new argh.gen.Level("\ufdd0'w".call(null, G__14361), "\ufdd0'h".call(null, G__14361), "\ufdd0'data".call(null, G__14361), null, cljs.core.dissoc.call(null, G__14361, "\ufdd0'w", "\ufdd0'h", "\ufdd0'data"))
};
argh.gen.Level;
argh.gen.make_level = function make_level(data) {
  return new argh.gen.Level(cljs.core.count(cljs.core.nth.__2(data, 0)), cljs.core.count(data), data)
};
argh.gen.levelify_map = function levelify_map(p__14391) {
  var map__14392__14393 = p__14391;
  var map__14392__14394 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14392__14393)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14392__14393) : map__14392__14393;
  var paths__14395 = cljs.core.get.call(null, map__14392__14394, "\ufdd0'paths");
  var rooms__14396 = cljs.core.get.call(null, map__14392__14394, "\ufdd0'rooms");
  var height__14397 = cljs.core.get.call(null, map__14392__14394, "\ufdd0'height");
  var width__14398 = cljs.core.get.call(null, map__14392__14394, "\ufdd0'width");
  return argh.gen.make_level(cljs.core.reduce.__3(function(m, p__14399) {
    var vec__14400__14401 = p__14399;
    var x__14402 = cljs.core.nth.call(null, vec__14400__14401, 0, null);
    var y__14403 = cljs.core.nth.call(null, vec__14400__14401, 1, null);
    return cljs.core.assoc_in(m, cljs.core.PersistentVector.fromArray([y__14403, x__14402]), 1)
  }, cljs.core.vec(cljs.core.repeatedly.__2(height__14397, function() {
    return cljs.core.vec(cljs.core.repeat.__2(width__14398, 0))
  })), cljs.core.apply.__3(cljs.core.concat, cljs.core.mapcat.__2(argh.gen.pointify, rooms__14396), paths__14395)))
};
argh.gen.generate = function generate(w, h) {
  return argh.gen.levelify_map(argh.gen.connect_rooms(argh.gen.add_rooms.__2(argh.gen.empty_map(w, h), 10)))
};
goog.provide("clojure.string");
goog.require("cljs.core");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
clojure.string.seq_reverse = function seq_reverse(coll) {
  return cljs.core.reduce.__3(cljs.core.conj, cljs.core.List.EMPTY, coll)
};
clojure.string.reverse = function reverse(s) {
  return s.split("").reverse().join("")
};
clojure.string.replace = function replace(s, match, replacement) {
  if(cljs.core.truth_(cljs.core.string_QMARK_(match))) {
    return s.replace(new RegExp(goog.string.regExpEscape.call(null, match), "g"), replacement)
  }else {
    if(cljs.core.truth_(match.hasOwnProperty("source"))) {
      return s.replace(new RegExp(match.source, "g"), replacement)
    }else {
      if("\ufdd0'else") {
        throw cljs.core.str("Invalid match arg: ", match);
      }else {
        return null
      }
    }
  }
};
clojure.string.replace_first = function replace_first(s, match, replacement) {
  return s.replace(match, replacement)
};
clojure.string.join = function() {
  var join = null;
  var join__1 = function(coll) {
    return cljs.core.apply.__2(cljs.core.str, coll)
  };
  var join__2 = function(separator, coll) {
    return cljs.core.apply.__2(cljs.core.str, cljs.core.interpose(separator, coll))
  };
  join = function(separator, coll) {
    switch(arguments.length) {
      case 1:
        return join__1.call(this, separator);
      case 2:
        return join__2.call(this, separator, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  join.__1 = join__1;
  join.__2 = join__2;
  return join
}();
clojure.string.upper_case = function upper_case(s) {
  return s.toUpperCase()
};
clojure.string.lower_case = function lower_case(s) {
  return s.toLowerCase()
};
clojure.string.capitalize = function capitalize(s) {
  if(cljs.core.count(s) < 2) {
    return clojure.string.upper_case(s)
  }else {
    return cljs.core.str(clojure.string.upper_case(cljs.core.subs.__3(s, 0, 1)), clojure.string.lower_case(cljs.core.subs.__2(s, 1)))
  }
};
clojure.string.split = function() {
  var split = null;
  var split__2 = function(s, re) {
    return cljs.core.vec(cljs.core.str.__1(s).split(re))
  };
  var split__3 = function(s, re, limit) {
    if(limit < 1) {
      return cljs.core.vec(cljs.core.str.__1(s).split(re))
    }else {
      var s__16408 = s;
      var limit__16409 = limit;
      var parts__16410 = cljs.core.PersistentVector.fromArray([]);
      while(true) {
        if(cljs.core.truth_(cljs.core._EQ_(limit__16409, 1))) {
          return cljs.core.conj.__2(parts__16410, s__16408)
        }else {
          var temp__3847__auto____16411 = cljs.core.re_find(re, s__16408);
          if(cljs.core.truth_(temp__3847__auto____16411)) {
            var m__16412 = temp__3847__auto____16411;
            var index__16413 = s__16408.indexOf(m__16412);
            var G__16417 = s__16408.substring(index__16413 + cljs.core.count(m__16412));
            var G__16418 = limit__16409 - 1;
            var G__16419 = cljs.core.conj.__2(parts__16410, s__16408.substring(0, index__16413));
            s__16408 = G__16417;
            limit__16409 = G__16418;
            parts__16410 = G__16419;
            continue
          }else {
            return cljs.core.conj.__2(parts__16410, s__16408)
          }
        }
        break
      }
    }
  };
  split = function(s, re, limit) {
    switch(arguments.length) {
      case 2:
        return split__2.call(this, s, re);
      case 3:
        return split__3.call(this, s, re, limit)
    }
    throw"Invalid arity: " + arguments.length;
  };
  split.__2 = split__2;
  split.__3 = split__3;
  return split
}();
clojure.string.split_lines = function split_lines(s) {
  return clojure.string.split.__2(s, /\n|\r\n/)
};
clojure.string.trim = function trim(s) {
  return goog.string.trim.call(null, s)
};
clojure.string.triml = function triml(s) {
  return goog.string.trimLeft.call(null, s)
};
clojure.string.trimr = function trimr(s) {
  return goog.string.trimRight.call(null, s)
};
clojure.string.trim_newline = function trim_newline(s) {
  var index__16420 = s.length;
  while(true) {
    if(index__16420 === 0) {
      return""
    }else {
      var ch__16421 = cljs.core.get.__2(s, index__16420 - 1);
      if(cljs.core.truth_(function() {
        var or__3700__auto____16422 = cljs.core._EQ_(ch__16421, "\n");
        if(cljs.core.truth_(or__3700__auto____16422)) {
          return or__3700__auto____16422
        }else {
          return cljs.core._EQ_(ch__16421, "\r")
        }
      }())) {
        var G__16426 = index__16420 - 1;
        index__16420 = G__16426;
        continue
      }else {
        return s.substring(0, index__16420)
      }
    }
    break
  }
};
clojure.string.blank_QMARK_ = function blank_QMARK_(s) {
  var s__16427 = cljs.core.str.__1(s);
  if(cljs.core.truth_(function() {
    var or__3700__auto____16428 = cljs.core.not(s__16427);
    if(cljs.core.truth_(or__3700__auto____16428)) {
      return or__3700__auto____16428
    }else {
      var or__3700__auto____16429 = cljs.core._EQ_("", s__16427);
      if(cljs.core.truth_(or__3700__auto____16429)) {
        return or__3700__auto____16429
      }else {
        return cljs.core.re_matches(/\s+/, s__16427)
      }
    }
  }())) {
    return true
  }else {
    return false
  }
};
clojure.string.escape = function escape(s, cmap) {
  var buffer__16433 = new goog.string.StringBuffer;
  var length__16434 = s.length;
  var index__16435 = 0;
  while(true) {
    if(cljs.core.truth_(cljs.core._EQ_(length__16434, index__16435))) {
      return buffer__16433.toString()
    }else {
      var ch__16436 = s.charAt(index__16435);
      var temp__3847__auto____16437 = cljs.core.get.__2(cmap, ch__16436);
      if(cljs.core.truth_(temp__3847__auto____16437)) {
        var replacement__16438 = temp__3847__auto____16437;
        buffer__16433.append(cljs.core.str.__1(replacement__16438))
      }else {
        buffer__16433.append(ch__16436)
      }
      var G__16441 = index__16435 + 1;
      index__16435 = G__16441;
      continue
    }
    break
  }
};
goog.provide("argh.core");
goog.require("cljs.core");
goog.require("clojure.string");
argh.core.input = cljs.core.atom.__1(cljs.core.set([]));
argh.core.game = cljs.core.atom.__1(null);
argh.core.fill_style = function fill_style(ctx, color) {
  return ctx.fillStyle = color
};
argh.core.stroke_style = function stroke_style(ctx, color) {
  return ctx.strokeStyle = color
};
argh.core.line_width = function line_width(ctx, wid) {
  return ctx.lineWidth = wid
};
argh.core.fill_rect = function fill_rect(ctx, x, y, w, h) {
  return ctx.fillRect(x, y, w, h)
};
argh.core.clear_rect = function clear_rect(ctx, x, y, w, h) {
  return ctx.clearRect(x, y, w, h)
};
argh.core.move_to = function move_to(ctx, x, y) {
  return ctx.moveTo(x, y)
};
argh.core.line_to = function line_to(ctx, x, y) {
  return ctx.lineTo(x, y)
};
argh.core.stroke = function stroke(ctx) {
  return ctx.stroke()
};
argh.core.fill = function fill(ctx) {
  return ctx.fill()
};
argh.core.context = function context(cvs) {
  return cvs.getContext("2d")
};
argh.core.clear = function() {
  var clear = null;
  var clear__1 = function(cvs) {
    var G__13805__13806 = argh.core.context(cvs);
    argh.core.clear_rect(G__13805__13806, 0, 0, cvs.width, cvs.height);
    return G__13805__13806
  };
  var clear__2 = function(cvs, col) {
    var G__13803__13804 = argh.core.context(cvs);
    argh.core.fill_style(G__13803__13804, col);
    argh.core.fill_rect(G__13803__13804, 0, 0, cvs.width, cvs.height);
    return G__13803__13804
  };
  clear = function(cvs, col) {
    switch(arguments.length) {
      case 1:
        return clear__1.call(this, cvs);
      case 2:
        return clear__2.call(this, cvs, col)
    }
    throw"Invalid arity: " + arguments.length;
  };
  clear.__1 = clear__1;
  clear.__2 = clear__2;
  return clear
}();
argh.core.draw_poly = function draw_poly(ctx, pts) {
  var c__3246__auto____13807 = ctx;
  c__3246__auto____13807.beginPath();
  cljs.core.apply.__3(argh.core.move_to, ctx, cljs.core.first(pts));
  var G__13808__13809 = cljs.core.seq.call(null, cljs.core.rest(pts));
  if(cljs.core.truth_(G__13808__13809)) {
    var G__13811__13813 = cljs.core.first.call(null, G__13808__13809);
    var vec__13812__13814 = G__13811__13813;
    var x__13815 = cljs.core.nth.call(null, vec__13812__13814, 0, null);
    var y__13816 = cljs.core.nth.call(null, vec__13812__13814, 1, null);
    var G__13808__13817 = G__13808__13809;
    var G__13811__13818 = G__13811__13813;
    var G__13808__13819 = G__13808__13817;
    while(true) {
      var vec__13820__13821 = G__13811__13818;
      var x__13822 = cljs.core.nth.call(null, vec__13820__13821, 0, null);
      var y__13823 = cljs.core.nth.call(null, vec__13820__13821, 1, null);
      var G__13808__13824 = G__13808__13819;
      argh.core.line_to(ctx, x__13822, y__13823);
      var temp__3850__auto____13825 = cljs.core.next.call(null, G__13808__13824);
      if(cljs.core.truth_(temp__3850__auto____13825)) {
        var G__13808__13826 = temp__3850__auto____13825;
        var G__13829 = cljs.core.first.call(null, G__13808__13826);
        var G__13830 = G__13808__13826;
        G__13811__13818 = G__13829;
        G__13808__13819 = G__13830;
        continue
      }else {
      }
      break
    }
  }else {
  }
  c__3246__auto____13807.closePath();
  return argh.core.fill(ctx)
};
argh.core.draw_line = function draw_line(ctx, x0, y0, x1, y1) {
  var G__13831__13832 = ctx;
  argh.core.line_width(G__13831__13832, 0.5);
  var G__13833__13834 = G__13831__13832;
  G__13833__13834.beginPath();
  argh.core.move_to(G__13833__13834, x0, y0);
  argh.core.line_to(G__13833__13834, x1, y1);
  G__13833__13834.closePath();
  G__13833__13834;
  argh.core.stroke(G__13831__13832);
  return G__13831__13832
};
argh.core.pi = Math.PI;
argh.core.two_pi = argh.core.pi * 2;
argh.core.half_pi = argh.core.pi / 2;
argh.core.goal_fps = 60;
argh.core.screen_width = 720;
argh.core.screen_height = 480;
argh.core.hypot = function hypot(x, y) {
  return x * x + y * y
};
argh.core.ensure_circ = function ensure_circ(angle) {
  while(true) {
    if(function() {
      var or__3700__auto____13835 = angle === 0;
      if(or__3700__auto____13835) {
        return or__3700__auto____13835
      }else {
        return angle === argh.core.two_pi
      }
    }()) {
      return 0
    }else {
      if(function() {
        var and__3698__auto____13836 = argh.core.two_pi > angle;
        if(and__3698__auto____13836) {
          return angle > 0
        }else {
          return and__3698__auto____13836
        }
      }()) {
        return angle
      }else {
        if(angle > argh.core.two_pi) {
          var G__13842 = angle - argh.core.two_pi;
          angle = G__13842;
          continue
        }else {
          if(0 > angle) {
            var G__13844 = angle + argh.core.two_pi;
            angle = G__13844;
            continue
          }else {
            if("\ufdd0'else") {
              throw"huh?";
            }else {
              return null
            }
          }
        }
      }
    }
    break
  }
};
argh.core.up_right = function up_right(angle) {
  var a__13846 = argh.core.ensure_circ(angle);
  if(function() {
    var and__3698__auto____13847 = 0 <= a__13846;
    if(and__3698__auto____13847) {
      return a__13846 <= argh.core.half_pi
    }else {
      return and__3698__auto____13847
    }
  }()) {
    return cljs.core.PersistentVector.fromArray([true, true])
  }else {
    if(function() {
      var and__3698__auto____13848 = argh.core.half_pi <= a__13846;
      if(and__3698__auto____13848) {
        return a__13846 <= argh.core.pi
      }else {
        return and__3698__auto____13848
      }
    }()) {
      return cljs.core.PersistentVector.fromArray([true, false])
    }else {
      if(function() {
        var and__3698__auto____13849 = argh.core.pi <= a__13846;
        if(and__3698__auto____13849) {
          return a__13846 <= 3 * argh.core.half_pi
        }else {
          return and__3698__auto____13849
        }
      }()) {
        return cljs.core.PersistentVector.fromArray([false, false])
      }else {
        if("\ufdd0'else") {
          return cljs.core.PersistentVector.fromArray([false, true])
        }else {
          return null
        }
      }
    }
  }
};
argh.core.animate = function() {
  var or__3700__auto____13857 = window.requestAnimationFrame;
  if(cljs.core.truth_(or__3700__auto____13857)) {
    return or__3700__auto____13857
  }else {
    var or__3700__auto____13858 = window.webkitRequestAnimationFrame;
    if(cljs.core.truth_(or__3700__auto____13858)) {
      return or__3700__auto____13858
    }else {
      var or__3700__auto____13859 = window.mozRequestAnimationFrame;
      if(cljs.core.truth_(or__3700__auto____13859)) {
        return or__3700__auto____13859
      }else {
        var or__3700__auto____13860 = window.oRequestAnimationFrame;
        if(cljs.core.truth_(or__3700__auto____13860)) {
          return or__3700__auto____13860
        }else {
          var or__3700__auto____13861 = window.msRequestAnimationFrame;
          if(cljs.core.truth_(or__3700__auto____13861)) {
            return or__3700__auto____13861
          }else {
            return function(callback) {
              return setTimeout.call(null, callback, 17)
            }
          }
        }
      }
    }
  }
}();
argh.core.screen = document.getElementById("screen");
argh.core.fps_elem = document.getElementById("fps");
argh.core.map_canv = document.getElementById("map");
argh.core.ent_canv = document.getElementById("ent");
argh.core.show_fps = function show_fps(fps) {
  return argh.core.fps_elem.innerHTML = cljs.core.str(Math.floor.call(null, fps * 100) / 100, " fps")
};
argh.core.ray_width = 8;
argh.core.fov = 60 * (Math.PI / 180);
argh.core.rays = Math.ceil.call(null, argh.core.screen_width / argh.core.ray_width);
argh.core.view_dist = argh.core.screen_width / 2 / Math.tan.call(null, argh.core.fov / 2);
argh.core.bars = function() {
  var i__13867 = 0;
  var s__13868 = cljs.core.PersistentVector.fromArray([]);
  while(true) {
    if(i__13867 > argh.core.screen_width) {
      return s__13868
    }else {
      var d__13869 = document.createElement("div");
      var img__13870 = new Image;
      var G__13871__13872 = d__13869.style;
      G__13871__13872["position"] = "absolute";
      G__13871__13872["left"] = cljs.core.str(i__13867, "px");
      G__13871__13872["width"] = cljs.core.str(argh.core.ray_width + 1, "px");
      G__13871__13872["overflow"] = "hidden";
      G__13871__13872;
      var G__13873__13874 = img__13870.style;
      G__13873__13874["position"] = "absolute";
      G__13873__13874["left"] = "0px";
      G__13873__13874;
      img__13870.src = "res/wall3.png";
      d__13869.img = img__13870;
      d__13869.appendChild(img__13870);
      argh.core.screen.appendChild(d__13869);
      var G__13876 = i__13867 + argh.core.ray_width;
      var G__13877 = cljs.core.conj.__2(s__13868, d__13869);
      i__13867 = G__13876;
      s__13868 = G__13877;
      continue
    }
    break
  }
}();
argh.core.Player = function(x, y, rot, move_speed, rot_speed, __meta, __extmap) {
  this.x = x;
  this.y = y;
  this.rot = rot;
  this.move_speed = move_speed;
  this.rot_speed = rot_speed;
  this.__meta = __meta;
  this.__extmap = __extmap;
  if(arguments.length > 5) {
    this.__meta = __meta;
    this.__extmap = __extmap
  }else {
    this.__meta = null;
    this.__extmap = null
  }
};
argh.core.Player.prototype.cljs$core$IHash$ = true;
argh.core.Player.prototype.cljs$core$IHash$_hash__1 = function(this__388__auto__) {
  var this__13881 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Player.prototype.cljs$core$ILookup$ = true;
argh.core.Player.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__13882 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Player.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k13879, else__396__auto__) {
  var this__13883 = this;
  if(k13879 === "\ufdd0'x") {
    return this__13883.x
  }else {
    if(k13879 === "\ufdd0'y") {
      return this__13883.y
    }else {
      if(k13879 === "\ufdd0'rot") {
        return this__13883.rot
      }else {
        if(k13879 === "\ufdd0'move-speed") {
          return this__13883.move_speed
        }else {
          if(k13879 === "\ufdd0'rot-speed") {
            return this__13883.rot_speed
          }else {
            if("\ufdd0'else") {
              return cljs.core.get.call(null, this__13883.__extmap, k13879, else__396__auto__)
            }else {
              return null
            }
          }
        }
      }
    }
  }
};
argh.core.Player.prototype.cljs$core$IAssociative$ = true;
argh.core.Player.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__13878) {
  var this__13884 = this;
  var pred__13885__13888 = cljs.core.identical_QMARK_;
  var expr__13886__13889 = k__401__auto__;
  if(cljs.core.truth_(pred__13885__13888.call(null, "\ufdd0'x", expr__13886__13889))) {
    return new argh.core.Player(G__13878, this__13884.y, this__13884.rot, this__13884.move_speed, this__13884.rot_speed, this__13884.__meta, this__13884.__extmap)
  }else {
    if(cljs.core.truth_(pred__13885__13888.call(null, "\ufdd0'y", expr__13886__13889))) {
      return new argh.core.Player(this__13884.x, G__13878, this__13884.rot, this__13884.move_speed, this__13884.rot_speed, this__13884.__meta, this__13884.__extmap)
    }else {
      if(cljs.core.truth_(pred__13885__13888.call(null, "\ufdd0'rot", expr__13886__13889))) {
        return new argh.core.Player(this__13884.x, this__13884.y, G__13878, this__13884.move_speed, this__13884.rot_speed, this__13884.__meta, this__13884.__extmap)
      }else {
        if(cljs.core.truth_(pred__13885__13888.call(null, "\ufdd0'move-speed", expr__13886__13889))) {
          return new argh.core.Player(this__13884.x, this__13884.y, this__13884.rot, G__13878, this__13884.rot_speed, this__13884.__meta, this__13884.__extmap)
        }else {
          if(cljs.core.truth_(pred__13885__13888.call(null, "\ufdd0'rot-speed", expr__13886__13889))) {
            return new argh.core.Player(this__13884.x, this__13884.y, this__13884.rot, this__13884.move_speed, G__13878, this__13884.__meta, this__13884.__extmap)
          }else {
            return new argh.core.Player(this__13884.x, this__13884.y, this__13884.rot, this__13884.move_speed, this__13884.rot_speed, this__13884.__meta, cljs.core.assoc.call(null, this__13884.__extmap, k__401__auto__, G__13878))
          }
        }
      }
    }
  }
};
argh.core.Player.prototype.cljs$core$IRecord$ = true;
argh.core.Player.prototype.cljs$core$ICollection$ = true;
argh.core.Player.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__13890 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Player.prototype.cljs$core$ISeqable$ = true;
argh.core.Player.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__13891 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'x", this__13891.x), cljs.core.vector.call(null, "\ufdd0'y", this__13891.y), cljs.core.vector.call(null, "\ufdd0'rot", this__13891.rot), cljs.core.vector.call(null, "\ufdd0'move-speed", this__13891.move_speed), cljs.core.vector.call(null, "\ufdd0'rot-speed", this__13891.rot_speed)]), this__13891.__extmap))
};
argh.core.Player.prototype.cljs$core$IPrintable$ = true;
argh.core.Player.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__13892 = this;
  var pr_pair__409__auto____13893 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____13893, cljs.core.str.call(null, "#", "argh.core.Player", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'x", this__13892.x), cljs.core.vector.call(null, "\ufdd0'y", this__13892.y), cljs.core.vector.call(null, "\ufdd0'rot", this__13892.rot), cljs.core.vector.call(null, "\ufdd0'move-speed", this__13892.move_speed), cljs.core.vector.call(null, "\ufdd0'rot-speed", 
  this__13892.rot_speed)]), this__13892.__extmap))
};
argh.core.Player.prototype.cljs$core$ICounted$ = true;
argh.core.Player.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__13894 = this;
  return 5 + cljs.core.count.call(null, this__13894.__extmap)
};
argh.core.Player.prototype.cljs$core$IEquiv$ = true;
argh.core.Player.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__13895 = this;
  var and__3698__auto____13896 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____13896) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____13896
  }
};
argh.core.Player.prototype.cljs$core$IWithMeta$ = true;
argh.core.Player.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__13878) {
  var this__13897 = this;
  return new argh.core.Player(this__13897.x, this__13897.y, this__13897.rot, this__13897.move_speed, this__13897.rot_speed, G__13878, this__13897.__extmap)
};
argh.core.Player.prototype.cljs$core$IMeta$ = true;
argh.core.Player.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__13898 = this;
  return this__13898.__meta
};
argh.core.Player.prototype.cljs$core$IMap$ = true;
argh.core.Player.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__13899 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'y", "\ufdd0'x", "\ufdd0'rot", "\ufdd0'rot-speed", "\ufdd0'move-speed"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__13899.__meta), k__403__auto__)
  }else {
    return new argh.core.Player(this__13899.x, this__13899.y, this__13899.rot, this__13899.move_speed, this__13899.rot_speed, this__13899.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__13899.__extmap, k__403__auto__)))
  }
};
argh.core.Player.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Player")
};
argh.core.__GT_Player = function __GT_Player(x, y, rot, move_speed, rot_speed) {
  return new argh.core.Player(x, y, rot, move_speed, rot_speed)
};
argh.core.map__GT_Player = function map__GT_Player(G__13880) {
  return new argh.core.Player("\ufdd0'x".call(null, G__13880), "\ufdd0'y".call(null, G__13880), "\ufdd0'rot".call(null, G__13880), "\ufdd0'move-speed".call(null, G__13880), "\ufdd0'rot-speed".call(null, G__13880), null, cljs.core.dissoc.call(null, G__13880, "\ufdd0'x", "\ufdd0'y", "\ufdd0'rot", "\ufdd0'move-speed", "\ufdd0'rot-speed"))
};
argh.core.Player;
argh.core.create_player = function create_player(x, y) {
  return new argh.core.Player(x, y, cljs.core.rand.__0(), 0.08, 3 * (argh.core.pi / 180))
};
argh.core.spawn_player = function spawn_player(p__13914) {
  var map__13915__13916 = p__13914;
  var map__13915__13917 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__13915__13916)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__13915__13916) : map__13915__13916;
  var data__13918 = cljs.core.get.call(null, map__13915__13917, "\ufdd0'data");
  var h__13919 = cljs.core.get.call(null, map__13915__13917, "\ufdd0'h");
  var w__13920 = cljs.core.get.call(null, map__13915__13917, "\ufdd0'w");
  var x__13921 = cljs.core.rand_int(w__13920);
  var y__13922 = cljs.core.rand_int(h__13919);
  while(true) {
    if(0 === cljs.core.nth.__2(data__13918.call(null, y__13922), x__13921)) {
      return argh.core.create_player(x__13921, y__13922)
    }else {
      var G__13924 = cljs.core.rand_int(w__13920);
      var G__13925 = cljs.core.rand_int(h__13919);
      x__13921 = G__13924;
      y__13922 = G__13925;
      continue
    }
    break
  }
};
argh.core.Level = function(w, h, data, __meta, __extmap) {
  this.w = w;
  this.h = h;
  this.data = data;
  this.__meta = __meta;
  this.__extmap = __extmap;
  if(arguments.length > 3) {
    this.__meta = __meta;
    this.__extmap = __extmap
  }else {
    this.__meta = null;
    this.__extmap = null
  }
};
argh.core.Level.prototype.cljs$core$IHash$ = true;
argh.core.Level.prototype.cljs$core$IHash$_hash__1 = function(this__388__auto__) {
  var this__13929 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Level.prototype.cljs$core$ILookup$ = true;
argh.core.Level.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__13930 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Level.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k13927, else__396__auto__) {
  var this__13931 = this;
  if(k13927 === "\ufdd0'w") {
    return this__13931.w
  }else {
    if(k13927 === "\ufdd0'h") {
      return this__13931.h
    }else {
      if(k13927 === "\ufdd0'data") {
        return this__13931.data
      }else {
        if("\ufdd0'else") {
          return cljs.core.get.call(null, this__13931.__extmap, k13927, else__396__auto__)
        }else {
          return null
        }
      }
    }
  }
};
argh.core.Level.prototype.cljs$core$IAssociative$ = true;
argh.core.Level.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__13926) {
  var this__13932 = this;
  var pred__13933__13936 = cljs.core.identical_QMARK_;
  var expr__13934__13937 = k__401__auto__;
  if(cljs.core.truth_(pred__13933__13936.call(null, "\ufdd0'w", expr__13934__13937))) {
    return new argh.core.Level(G__13926, this__13932.h, this__13932.data, this__13932.__meta, this__13932.__extmap)
  }else {
    if(cljs.core.truth_(pred__13933__13936.call(null, "\ufdd0'h", expr__13934__13937))) {
      return new argh.core.Level(this__13932.w, G__13926, this__13932.data, this__13932.__meta, this__13932.__extmap)
    }else {
      if(cljs.core.truth_(pred__13933__13936.call(null, "\ufdd0'data", expr__13934__13937))) {
        return new argh.core.Level(this__13932.w, this__13932.h, G__13926, this__13932.__meta, this__13932.__extmap)
      }else {
        return new argh.core.Level(this__13932.w, this__13932.h, this__13932.data, this__13932.__meta, cljs.core.assoc.call(null, this__13932.__extmap, k__401__auto__, G__13926))
      }
    }
  }
};
argh.core.Level.prototype.cljs$core$IRecord$ = true;
argh.core.Level.prototype.cljs$core$ICollection$ = true;
argh.core.Level.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__13938 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Level.prototype.cljs$core$ISeqable$ = true;
argh.core.Level.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__13939 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__13939.w), cljs.core.vector.call(null, "\ufdd0'h", this__13939.h), cljs.core.vector.call(null, "\ufdd0'data", this__13939.data)]), this__13939.__extmap))
};
argh.core.Level.prototype.cljs$core$IPrintable$ = true;
argh.core.Level.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__13940 = this;
  var pr_pair__409__auto____13941 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____13941, cljs.core.str.call(null, "#", "argh.core.Level", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__13940.w), cljs.core.vector.call(null, "\ufdd0'h", this__13940.h), cljs.core.vector.call(null, "\ufdd0'data", this__13940.data)]), this__13940.__extmap))
};
argh.core.Level.prototype.cljs$core$ICounted$ = true;
argh.core.Level.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__13942 = this;
  return 3 + cljs.core.count.call(null, this__13942.__extmap)
};
argh.core.Level.prototype.cljs$core$IEquiv$ = true;
argh.core.Level.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__13943 = this;
  var and__3698__auto____13944 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____13944) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____13944
  }
};
argh.core.Level.prototype.cljs$core$IWithMeta$ = true;
argh.core.Level.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__13926) {
  var this__13945 = this;
  return new argh.core.Level(this__13945.w, this__13945.h, this__13945.data, G__13926, this__13945.__extmap)
};
argh.core.Level.prototype.cljs$core$IMeta$ = true;
argh.core.Level.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__13946 = this;
  return this__13946.__meta
};
argh.core.Level.prototype.cljs$core$IMap$ = true;
argh.core.Level.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__13947 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__13947.__meta), k__403__auto__)
  }else {
    return new argh.core.Level(this__13947.w, this__13947.h, this__13947.data, this__13947.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__13947.__extmap, k__403__auto__)))
  }
};
argh.core.Level.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Level")
};
argh.core.__GT_Level = function __GT_Level(w, h, data) {
  return new argh.core.Level(w, h, data)
};
argh.core.map__GT_Level = function map__GT_Level(G__13928) {
  return new argh.core.Level("\ufdd0'w".call(null, G__13928), "\ufdd0'h".call(null, G__13928), "\ufdd0'data".call(null, G__13928), null, cljs.core.dissoc.call(null, G__13928, "\ufdd0'w", "\ufdd0'h", "\ufdd0'data"))
};
argh.core.Level;
argh.core.rand_level = function rand_level(w, h, prob) {
  return new argh.core.Level(w, h, cljs.core.vec(cljs.core.repeatedly.__2(h, function() {
    return cljs.core.vec(cljs.core.repeatedly.__2(w, function() {
      if(cljs.core.rand.__0() < prob) {
        return 0
      }else {
        return 1
      }
    }))
  })))
};
argh.core.Game = function(player, level, __meta, __extmap) {
  this.player = player;
  this.level = level;
  this.__meta = __meta;
  this.__extmap = __extmap;
  if(arguments.length > 2) {
    this.__meta = __meta;
    this.__extmap = __extmap
  }else {
    this.__meta = null;
    this.__extmap = null
  }
};
argh.core.Game.prototype.cljs$core$IHash$ = true;
argh.core.Game.prototype.cljs$core$IHash$_hash__1 = function(this__388__auto__) {
  var this__13962 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Game.prototype.cljs$core$ILookup$ = true;
argh.core.Game.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__13963 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Game.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k13960, else__396__auto__) {
  var this__13964 = this;
  if(k13960 === "\ufdd0'player") {
    return this__13964.player
  }else {
    if(k13960 === "\ufdd0'level") {
      return this__13964.level
    }else {
      if("\ufdd0'else") {
        return cljs.core.get.call(null, this__13964.__extmap, k13960, else__396__auto__)
      }else {
        return null
      }
    }
  }
};
argh.core.Game.prototype.cljs$core$IAssociative$ = true;
argh.core.Game.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__13959) {
  var this__13965 = this;
  var pred__13966__13969 = cljs.core.identical_QMARK_;
  var expr__13967__13970 = k__401__auto__;
  if(cljs.core.truth_(pred__13966__13969.call(null, "\ufdd0'player", expr__13967__13970))) {
    return new argh.core.Game(G__13959, this__13965.level, this__13965.__meta, this__13965.__extmap)
  }else {
    if(cljs.core.truth_(pred__13966__13969.call(null, "\ufdd0'level", expr__13967__13970))) {
      return new argh.core.Game(this__13965.player, G__13959, this__13965.__meta, this__13965.__extmap)
    }else {
      return new argh.core.Game(this__13965.player, this__13965.level, this__13965.__meta, cljs.core.assoc.call(null, this__13965.__extmap, k__401__auto__, G__13959))
    }
  }
};
argh.core.Game.prototype.cljs$core$IRecord$ = true;
argh.core.Game.prototype.cljs$core$ICollection$ = true;
argh.core.Game.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__13971 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Game.prototype.cljs$core$ISeqable$ = true;
argh.core.Game.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__13972 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'player", this__13972.player), cljs.core.vector.call(null, "\ufdd0'level", this__13972.level)]), this__13972.__extmap))
};
argh.core.Game.prototype.cljs$core$IPrintable$ = true;
argh.core.Game.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__13973 = this;
  var pr_pair__409__auto____13974 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____13974, cljs.core.str.call(null, "#", "argh.core.Game", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'player", this__13973.player), cljs.core.vector.call(null, "\ufdd0'level", this__13973.level)]), this__13973.__extmap))
};
argh.core.Game.prototype.cljs$core$ICounted$ = true;
argh.core.Game.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__13975 = this;
  return 2 + cljs.core.count.call(null, this__13975.__extmap)
};
argh.core.Game.prototype.cljs$core$IEquiv$ = true;
argh.core.Game.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__13976 = this;
  var and__3698__auto____13977 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____13977) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____13977
  }
};
argh.core.Game.prototype.cljs$core$IWithMeta$ = true;
argh.core.Game.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__13959) {
  var this__13978 = this;
  return new argh.core.Game(this__13978.player, this__13978.level, G__13959, this__13978.__extmap)
};
argh.core.Game.prototype.cljs$core$IMeta$ = true;
argh.core.Game.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__13979 = this;
  return this__13979.__meta
};
argh.core.Game.prototype.cljs$core$IMap$ = true;
argh.core.Game.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__13980 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'player", "\ufdd0'level"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__13980.__meta), k__403__auto__)
  }else {
    return new argh.core.Game(this__13980.player, this__13980.level, this__13980.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__13980.__extmap, k__403__auto__)))
  }
};
argh.core.Game.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Game")
};
argh.core.__GT_Game = function __GT_Game(player, level) {
  return new argh.core.Game(player, level)
};
argh.core.map__GT_Game = function map__GT_Game(G__13961) {
  return new argh.core.Game("\ufdd0'player".call(null, G__13961), "\ufdd0'level".call(null, G__13961), null, cljs.core.dissoc.call(null, G__13961, "\ufdd0'player", "\ufdd0'level"))
};
argh.core.Game;
argh.core.check_cell = function check_cell(x, y, p__13989) {
  var map__13990__13991 = p__13989;
  var map__13990__13992 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__13990__13991)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__13990__13991) : map__13990__13991;
  var data__13993 = cljs.core.get.call(null, map__13990__13992, "\ufdd0'data");
  var h__13994 = cljs.core.get.call(null, map__13990__13992, "\ufdd0'h");
  var w__13995 = cljs.core.get.call(null, map__13990__13992, "\ufdd0'w");
  var and__3698__auto____13997 = function() {
    var and__3698__auto____13996 = -1 < x;
    if(and__3698__auto____13996) {
      return x < w__13995
    }else {
      return and__3698__auto____13996
    }
  }();
  if(cljs.core.truth_(and__3698__auto____13997)) {
    var and__3698__auto____13999 = function() {
      var and__3698__auto____13998 = -1 < y;
      if(and__3698__auto____13998) {
        return y < h__13994
      }else {
        return and__3698__auto____13998
      }
    }();
    if(cljs.core.truth_(and__3698__auto____13999)) {
      return cljs.core.nth.__2(cljs.core.nth.__2(data__13993, y), x) === 0
    }else {
      return and__3698__auto____13999
    }
  }else {
    return and__3698__auto____13997
  }
};
argh.core.check_neighbors = function check_neighbors(x, y, l) {
  return cljs.core.count(function() {
    var iter__531__auto____14016 = function iter__14004(s__14005) {
      return new cljs.core.LazySeq(null, false, function() {
        var s__14005__14008 = s__14005;
        while(true) {
          if(cljs.core.truth_(cljs.core.seq.call(null, s__14005__14008))) {
            var dx__14009 = cljs.core.first.call(null, s__14005__14008);
            var iterys__529__auto____14014 = function(s__14005__14008, dx__14009) {
              return function iter__14006(s__14007) {
                return new cljs.core.LazySeq(null, false, function(s__14005__14008, dx__14009) {
                  return function() {
                    var s__14007__14010 = s__14007;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__14007__14010))) {
                        var dy__14011 = cljs.core.first.call(null, s__14007__14010);
                        if(cljs.core.truth_(function() {
                          var and__3698__auto____14013 = cljs.core.not(function() {
                            var and__3698__auto____14012 = dx__14009 === dy__14011;
                            if(and__3698__auto____14012) {
                              return dy__14011 === 0
                            }else {
                              return and__3698__auto____14012
                            }
                          }());
                          if(cljs.core.truth_(and__3698__auto____14013)) {
                            return argh.core.check_cell(x + dx__14009, y + dy__14011, l)
                          }else {
                            return and__3698__auto____14013
                          }
                        }())) {
                          return cljs.core.cons.call(null, 1, iter__14006.call(null, cljs.core.rest.call(null, s__14007__14010)))
                        }else {
                          var G__14022 = cljs.core.rest.call(null, s__14007__14010);
                          s__14007__14010 = G__14022;
                          continue
                        }
                      }else {
                        return null
                      }
                      break
                    }
                  }
                }(s__14005__14008, dx__14009))
              }
            }(s__14005__14008, dx__14009);
            var fs__530__auto____14015 = cljs.core.seq.call(null, iterys__529__auto____14014.call(null, cljs.core.range.__2(-1, 2)));
            if(cljs.core.truth_(fs__530__auto____14015)) {
              return cljs.core.concat.call(null, fs__530__auto____14015, iter__14004.call(null, cljs.core.rest.call(null, s__14005__14008)))
            }else {
              var G__14024 = cljs.core.rest.call(null, s__14005__14008);
              s__14005__14008 = G__14024;
              continue
            }
          }else {
            return null
          }
          break
        }
      })
    };
    return iter__531__auto____14016.call(null, cljs.core.range.__2(-1, 2))
  }())
};
argh.core.level_generate = function level_generate(w, h, prob, op, n, its) {
  var i__14027 = 0;
  var l__14028 = argh.core.rand_level(w, h, prob);
  while(true) {
    if(i__14027 > its) {
      return l__14028
    }else {
      var x__14029 = cljs.core.rand_int(w);
      var y__14030 = cljs.core.rand_int(h);
      var G__14032 = i__14027 + 1;
      var G__14033 = cljs.core.assoc_in(l__14028, cljs.core.PersistentVector.fromArray(["\ufdd0'data", y__14030, x__14029]), cljs.core.truth_(cljs.core.not_EQ_.__2(op, argh.core.check_neighbors(x__14029, y__14030, l__14028) < n)) ? 0 : 1);
      i__14027 = G__14032;
      l__14028 = G__14033;
      continue
    }
    break
  }
};
argh.core.new_cave = function new_cave(w, h) {
  return cljs.core.update_in(argh.core.level_generate(w, h, 0.85, true, 6, 2E4), cljs.core.PersistentVector.fromArray(["\ufdd0'data"]), function(data) {
    return cljs.core.reduce.__3(function(v, p__14034) {
      var vec__14035__14036 = p__14034;
      var x__14037 = cljs.core.nth.call(null, vec__14035__14036, 0, null);
      var y__14038 = cljs.core.nth.call(null, vec__14035__14036, 1, null);
      return cljs.core.assoc_in(v, cljs.core.PersistentVector.fromArray([y__14038, x__14037]), 2)
    }, data, cljs.core.concat.__2(cljs.core.mapcat.__2(function(p1__14025_SHARP_) {
      return cljs.core.vector(cljs.core.PersistentVector.fromArray([0, p1__14025_SHARP_]), cljs.core.PersistentVector.fromArray([w - 1, p1__14025_SHARP_]))
    }, cljs.core.range.__1(h)), cljs.core.mapcat.__2(function(p1__14026_SHARP_) {
      return cljs.core.vector(cljs.core.PersistentVector.fromArray([p1__14026_SHARP_, 0]), cljs.core.PersistentVector.fromArray([p1__14026_SHARP_, h - 1]))
    }, cljs.core.range.__1(w))))
  })
};
argh.core.new_game = function new_game() {
  var lvl__14039 = argh.core.new_cave(60, 60);
  return new argh.core.Game(argh.core.spawn_player(lvl__14039), lvl__14039)
};
argh.core.free_QMARK_ = function free_QMARK_(p__14040, x, y) {
  var level__14041 = p__14040;
  var level__14042 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, level__14041)) ? cljs.core.apply.call(null, cljs.core.hash_map, level__14041) : level__14041;
  var data__14043 = cljs.core.get.call(null, level__14042, "\ufdd0'data");
  var h__14044 = cljs.core.get.call(null, level__14042, "\ufdd0'h");
  var w__14045 = cljs.core.get.call(null, level__14042, "\ufdd0'w");
  var and__3698__auto____14046 = cljs.core.not(x < 0);
  if(cljs.core.truth_(and__3698__auto____14046)) {
    var and__3698__auto____14047 = cljs.core.not(y < 0);
    if(cljs.core.truth_(and__3698__auto____14047)) {
      var and__3698__auto____14048 = h__14044 > y;
      if(and__3698__auto____14048) {
        var and__3698__auto____14049 = w__14045 > x;
        if(and__3698__auto____14049) {
          return cljs.core.nth.__2(cljs.core.nth.__2(data__14043, Math.floor.call(null, y)), Math.floor.call(null, x)) === 0
        }else {
          return and__3698__auto____14049
        }
      }else {
        return and__3698__auto____14048
      }
    }else {
      return and__3698__auto____14047
    }
  }else {
    return and__3698__auto____14046
  }
};
argh.core.move_STAR_ = function move_STAR_(p__14054, dx, dy) {
  var gs__14055 = p__14054;
  var gs__14056 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, gs__14055)) ? cljs.core.apply.call(null, cljs.core.hash_map, gs__14055) : gs__14055;
  var player__14057 = cljs.core.get.call(null, gs__14056, "\ufdd0'player");
  var player__14058 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__14057)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__14057) : player__14057;
  var y__14059 = cljs.core.get.call(null, player__14058, "\ufdd0'y");
  var x__14060 = cljs.core.get.call(null, player__14058, "\ufdd0'x");
  var l__14061 = cljs.core.get.call(null, gs__14056, "\ufdd0'level");
  if(cljs.core.truth_(argh.core.free_QMARK_(l__14061, dx + x__14060, dy + y__14059))) {
    return cljs.core.assoc_in(cljs.core.assoc_in(gs__14056, cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'x"]), dx + x__14060), cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'y"]), dy + y__14059)
  }else {
    return gs__14056
  }
};
argh.core.move_player = function move_player(p__14063, input) {
  var game_state__14064 = p__14063;
  var game_state__14065 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, game_state__14064)) ? cljs.core.apply.call(null, cljs.core.hash_map, game_state__14064) : game_state__14064;
  var player__14066 = cljs.core.get.call(null, game_state__14065, "\ufdd0'player");
  var player__14067 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__14066)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__14066) : player__14066;
  var rot__14068 = cljs.core.get.call(null, player__14067, "\ufdd0'rot");
  var rot_speed__14069 = cljs.core.get.call(null, player__14067, "\ufdd0'rot-speed");
  var move_speed__14070 = cljs.core.get.call(null, player__14067, "\ufdd0'move-speed");
  var y__14071 = cljs.core.get.call(null, player__14067, "\ufdd0'y");
  var x__14072 = cljs.core.get.call(null, player__14067, "\ufdd0'x");
  var speed__14073 = cljs.core.truth_(input.call(null, "\ufdd0'down")) ? -1 : cljs.core.truth_(input.call(null, "\ufdd0'up")) ? 1 : "\ufdd0'else" ? 0 : null;
  var dir__14074 = cljs.core.truth_(input.call(null, "\ufdd0'left")) ? -1 : cljs.core.truth_(input.call(null, "\ufdd0'right")) ? 1 : "\ufdd0'else" ? 0 : null;
  var move_step__14075 = speed__14073 * move_speed__14070;
  var rot__14076 = argh.core.ensure_circ(rot__14068 + dir__14074 * rot_speed__14069);
  return argh.core.move_STAR_(argh.core.move_STAR_(cljs.core.assoc_in(game_state__14065, cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'rot"]), rot__14076), move_step__14075 * Math.cos.call(null, rot__14076), 0), 0, move_step__14075 * Math.sin.call(null, rot__14076))
};
argh.core.decode = cljs.core.HashMap.fromArrays([27, 38, 40, 37, 39], ["\ufdd0'escape", "\ufdd0'up", "\ufdd0'down", "\ufdd0'left", "\ufdd0'right"]);
argh.core.cast_rays = function cast_rays(p__14077) {
  var game_state__14079 = p__14077;
  var game_state__14080 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, game_state__14079)) ? cljs.core.apply.call(null, cljs.core.hash_map, game_state__14079) : game_state__14079;
  var player__14081 = cljs.core.get.call(null, game_state__14080, "\ufdd0'player");
  var player__14082 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__14081)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__14081) : player__14081;
  var px__14083 = cljs.core.get.call(null, player__14082, "\ufdd0'x");
  var py__14084 = cljs.core.get.call(null, player__14082, "\ufdd0'y");
  var rot__14085 = cljs.core.get.call(null, player__14082, "\ufdd0'rot");
  var map__14078__14086 = cljs.core.get.call(null, game_state__14080, "\ufdd0'level");
  var map__14078__14087 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14078__14086)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14078__14086) : map__14078__14086;
  var data__14088 = cljs.core.get.call(null, map__14078__14087, "\ufdd0'data");
  var h__14089 = cljs.core.get.call(null, map__14078__14087, "\ufdd0'h");
  var w__14090 = cljs.core.get.call(null, map__14078__14087, "\ufdd0'w");
  var scale__14091 = argh.core.screen_width / w__14090 < argh.core.screen_height / h__14089 ? argh.core.screen_width / w__14090 : argh.core.screen_height / h__14089;
  var n__586__auto____14092 = argh.core.rays;
  var num__14093 = 0;
  while(true) {
    if(num__14093 < n__586__auto____14092) {
      var scrpos__14098 = argh.core.ray_width * (num__14093 + argh.core.rays / -2);
      var vdist__14099 = Math.sqrt.call(null, argh.core.hypot(scrpos__14098, argh.core.view_dist));
      var angle__14100 = rot__14085 + Math.asin.call(null, scrpos__14098 / vdist__14099);
      var scale__14101 = argh.core.screen_width / w__14090 < argh.core.screen_height / h__14089 ? argh.core.screen_width / w__14090 : argh.core.screen_height / h__14089;
      var cast_out__14109 = function(num__14093) {
        return function(x, y, dx, dy, dwx, dwy) {
          var x__14102 = x;
          var y__14103 = y;
          while(true) {
            if(cljs.core.truth_(cljs.core.not.call(null, function() {
              var and__3698__auto____14105 = function() {
                var and__3698__auto____14104 = 0 < x__14102;
                if(and__3698__auto____14104) {
                  return x__14102 < w__14090
                }else {
                  return and__3698__auto____14104
                }
              }();
              if(cljs.core.truth_(and__3698__auto____14105)) {
                var and__3698__auto____14106 = 0 < y__14103;
                if(and__3698__auto____14106) {
                  return y__14103 < h__14089
                }else {
                  return and__3698__auto____14106
                }
              }else {
                return and__3698__auto____14105
              }
            }()))) {
              return cljs.core.PersistentVector.fromArray([x__14102, y__14103, 0, 0])
            }else {
              var wx__14107 = Math.floor.call(null, dwx + x__14102);
              var wy__14108 = Math.floor.call(null, dwy + y__14103);
              if(cljs.core.nth.__2(cljs.core.nth.__2(data__14088, wy__14108), wx__14107) > 0) {
                return cljs.core.PersistentVector.fromArray([x__14102, y__14103, argh.core.hypot(x__14102 - px__14083, y__14103 - py__14084), cljs.core.nth.__2(cljs.core.nth.__2(data__14088, wy__14108), wx__14107), x__14102 % 1, y__14103 % 1])
              }else {
                var G__14154 = x__14102 + dx;
                var G__14155 = y__14103 + dy;
                x__14102 = G__14154;
                y__14103 = G__14155;
                continue
              }
            }
            break
          }
        }
      }(num__14093);
      var vec__14094__14110 = argh.core.up_right(angle__14100);
      var up_QMARK___14111 = cljs.core.nth.call(null, vec__14094__14110, 0, null);
      var right_QMARK___14112 = cljs.core.nth.call(null, vec__14094__14110, 1, null);
      var slope__14113 = Math.tan.call(null, angle__14100);
      var x__14114 = cljs.core.truth_(right_QMARK___14112) ? Math.ceil.call(null, px__14083) : Math.floor.call(null, px__14083);
      var vec__14095__14115 = cast_out__14109.call(null, x__14114, py__14084 + (x__14114 - px__14083) * slope__14113, cljs.core.truth_(right_QMARK___14112) ? 1 : -1, (cljs.core.truth_(right_QMARK___14112) ? 1 : -1) * slope__14113, cljs.core.truth_(right_QMARK___14112) ? 0 : -1, 0);
      var xhit1__14116 = cljs.core.nth.call(null, vec__14095__14115, 0, null);
      var yhit1__14117 = cljs.core.nth.call(null, vec__14095__14115, 1, null);
      var hitdist1__14118 = cljs.core.nth.call(null, vec__14095__14115, 2, null);
      var wall1__14119 = cljs.core.nth.call(null, vec__14095__14115, 3, null);
      var ___14120 = cljs.core.nth.call(null, vec__14095__14115, 4, null);
      var xtxt1__14121 = cljs.core.nth.call(null, vec__14095__14115, 5, null);
      var hit1__14122 = vec__14095__14115;
      var y__14123 = cljs.core.truth_(up_QMARK___14111) ? Math.ceil.call(null, py__14084) : Math.floor.call(null, py__14084);
      var vec__14096__14124 = cast_out__14109.call(null, px__14083 + (y__14123 - py__14084) / slope__14113, y__14123, (cljs.core.truth_(up_QMARK___14111) ? 1 : -1) / slope__14113, cljs.core.truth_(up_QMARK___14111) ? 1 : -1, 0, cljs.core.truth_(up_QMARK___14111) ? 0 : -1);
      var xhit2__14125 = cljs.core.nth.call(null, vec__14096__14124, 0, null);
      var yhit2__14126 = cljs.core.nth.call(null, vec__14096__14124, 1, null);
      var hitdist2__14127 = cljs.core.nth.call(null, vec__14096__14124, 2, null);
      var wall2__14128 = cljs.core.nth.call(null, vec__14096__14124, 3, null);
      var xtxt2__14129 = cljs.core.nth.call(null, vec__14096__14124, 4, null);
      var ___14130 = cljs.core.nth.call(null, vec__14096__14124, 5, null);
      var hit2__14131 = vec__14096__14124;
      var vert_QMARK___14134 = function() {
        var or__3700__auto____14132 = hitdist1__14118 === 0;
        if(or__3700__auto____14132) {
          return or__3700__auto____14132
        }else {
          var and__3698__auto____14133 = hitdist2__14127 > 0;
          if(and__3698__auto____14133) {
            return hitdist2__14127 < hitdist1__14118
          }else {
            return and__3698__auto____14133
          }
        }
      }();
      var xtxt__14135 = cljs.core.truth_(vert_QMARK___14134) ? xtxt2__14129 : xtxt1__14121;
      var vec__14097__14136 = cljs.core.truth_(vert_QMARK___14134) ? hit2__14131 : hit1__14122;
      var xhit__14137 = cljs.core.nth.call(null, vec__14097__14136, 0, null);
      var yhit__14138 = cljs.core.nth.call(null, vec__14097__14136, 1, null);
      var hitdist__14139 = cljs.core.nth.call(null, vec__14097__14136, 2, null);
      var wall__14140 = cljs.core.nth.call(null, vec__14097__14136, 3, null);
      if(hitdist__14139 === 0) {
      }else {
        var s__14141 = cljs.core.nth.__2(argh.core.bars, num__14093);
        var d__14142 = Math.cos.call(null, rot__14085 - angle__14100) * Math.sqrt.call(null, hitdist__14139);
        var ht__14143 = Math.round.call(null, argh.core.view_dist / d__14142);
        var wd__14144 = ht__14143 * argh.core.ray_width;
        var top__14145 = Math.round.call(null, (argh.core.screen_height - ht__14143) / 2);
        var tx__14146 = xtxt__14135 * wd__14144;
        var bar__14147 = cljs.core.nth.__2(argh.core.bars, num__14093);
        bar__14147.style.cssText = ["position: absolute; left: ", num__14093 * argh.core.ray_width, "px; height: ", ht__14143, "px; width:", argh.core.ray_width + 1, "px; top: ", top__14145, "px; overflow: hidden"].join("");
        bar__14147.img.style.cssText = ["position: absolute; height: ", ht__14143, "px; width: ", wd__14144 * 2, "px; left: ", -tx__14146, "px; top: 0px;"].join("")
      }
      var G__14159 = num__14093 + 1;
      num__14093 = G__14159;
      continue
    }else {
      return null
    }
    break
  }
};
argh.core.draw_minimap = function draw_minimap(p__14160, cvs) {
  var map__14161__14164 = p__14160;
  var map__14161__14165 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14161__14164)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14161__14164) : map__14161__14164;
  var map__14162__14166 = cljs.core.get.call(null, map__14161__14165, "\ufdd0'player");
  var map__14162__14167 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14162__14166)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14162__14166) : map__14162__14166;
  var px__14168 = cljs.core.get.call(null, map__14162__14167, "\ufdd0'x");
  var py__14169 = cljs.core.get.call(null, map__14162__14167, "\ufdd0'y");
  var r__14170 = cljs.core.get.call(null, map__14162__14167, "\ufdd0'rot");
  var map__14163__14171 = cljs.core.get.call(null, map__14161__14165, "\ufdd0'level");
  var map__14163__14172 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14163__14171)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14163__14171) : map__14163__14171;
  var data__14173 = cljs.core.get.call(null, map__14163__14172, "\ufdd0'data");
  var h__14174 = cljs.core.get.call(null, map__14163__14172, "\ufdd0'h");
  var w__14175 = cljs.core.get.call(null, map__14163__14172, "\ufdd0'w");
  var ctx__14176 = argh.core.context(cvs);
  var scale__14177 = cvs.width / w__14175 < cvs.height / h__14174 ? cvs.width / w__14175 : cvs.height / h__14174;
  argh.core.clear.__2(cvs, "white");
  var n__586__auto____14178 = h__14174;
  var j__14179 = 0;
  while(true) {
    if(j__14179 < n__586__auto____14178) {
      var row__14180 = cljs.core.nth.__2(data__14173, j__14179);
      var n__586__auto____14181 = w__14175;
      var i__14182 = 0;
      while(true) {
        if(i__14182 < n__586__auto____14181) {
          var G__14183__14184 = ctx__14176;
          argh.core.fill_style(G__14183__14184, cljs.core.PersistentVector.fromArray(["white", "gray", "black"]).call(null, row__14180.call(null, i__14182)));
          argh.core.fill_rect(G__14183__14184, i__14182 * scale__14177, j__14179 * scale__14177, scale__14177, scale__14177);
          G__14183__14184;
          var G__14187 = i__14182 + 1;
          i__14182 = G__14187;
          continue
        }else {
        }
        break
      }
      var G__14188 = j__14179 + 1;
      j__14179 = G__14188;
      continue
    }else {
      return null
    }
    break
  }
};
argh.core.draw_ents = function draw_ents(p__14189, cvs) {
  var map__14190__14193 = p__14189;
  var map__14190__14194 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14190__14193)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14190__14193) : map__14190__14193;
  var map__14191__14195 = cljs.core.get.call(null, map__14190__14194, "\ufdd0'player");
  var map__14191__14196 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14191__14195)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14191__14195) : map__14191__14195;
  var px__14197 = cljs.core.get.call(null, map__14191__14196, "\ufdd0'x");
  var py__14198 = cljs.core.get.call(null, map__14191__14196, "\ufdd0'y");
  var r__14199 = cljs.core.get.call(null, map__14191__14196, "\ufdd0'rot");
  var map__14192__14200 = cljs.core.get.call(null, map__14190__14194, "\ufdd0'level");
  var map__14192__14201 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__14192__14200)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__14192__14200) : map__14192__14200;
  var data__14202 = cljs.core.get.call(null, map__14192__14201, "\ufdd0'data");
  var h__14203 = cljs.core.get.call(null, map__14192__14201, "\ufdd0'h");
  var w__14204 = cljs.core.get.call(null, map__14192__14201, "\ufdd0'w");
  var scale__14205 = cvs.width / w__14204 < cvs.height / h__14203 ? cvs.width / w__14204 : cvs.height / h__14203;
  argh.core.clear.__1(cvs);
  var G__14206__14207 = argh.core.context(cvs);
  argh.core.fill_style(G__14206__14207, "black");
  argh.core.stroke_style(G__14206__14207, "black");
  argh.core.fill_rect(G__14206__14207, px__14197 * scale__14205 - 2, py__14198 * scale__14205 - 2, 4, 4);
  return G__14206__14207
};
argh.core.tick = function tick(game, input) {
  return argh.core.move_player(game, input)
};
argh.core.last_tick = cljs.core.atom.__1((new Date).getTime());
argh.core.game_loop = function game_loop() {
  if(cljs.core.truth_("\ufdd0'escape".call(null, cljs.core.deref.call(null, argh.core.input)))) {
    return null
  }else {
    var current_tick__14210 = (new Date).getTime();
    var fps__14211 = 1E3 / (current_tick__14210 - cljs.core.deref.call(null, argh.core.last_tick));
    var needed__14212 = argh.core.goal_fps / 1E3 * (current_tick__14210 - cljs.core.deref.call(null, argh.core.last_tick));
    argh.core.show_fps(fps__14211);
    cljs.core.swap_BANG_.__2(argh.core.game, function(p1__14208_SHARP_) {
      var n__14213 = needed__14212;
      var g__14214 = p1__14208_SHARP_;
      while(true) {
        if(0 < n__14213) {
          var G__14217 = n__14213 - 1;
          var G__14218 = argh.core.tick(g__14214, cljs.core.deref.call(null, argh.core.input));
          n__14213 = G__14217;
          g__14214 = G__14218;
          continue
        }else {
          return g__14214
        }
        break
      }
    });
    cljs.core.reset_BANG_(argh.core.last_tick, (new Date).getTime());
    argh.core.cast_rays(cljs.core.deref.call(null, argh.core.game), argh.core.screen);
    argh.core.draw_ents(cljs.core.deref.call(null, argh.core.game), argh.core.ent_canv);
    return argh.core.animate.call(null, game_loop)
  }
};
argh.core.start_listening = function start_listening() {
  var on_key__14219 = function(p1__14209_SHARP_) {
    return function(e) {
      cljs.core.swap_BANG_.__3(argh.core.input, p1__14209_SHARP_, argh.core.decode.call(null, e.keyCode));
      return e.preventDefault()
    }
  };
  document.onkeydown = on_key__14219.call(null, cljs.core.conj);
  return document.onkeyup = on_key__14219.call(null, cljs.core.disj)
};
argh.core.start_listening();
cljs.core.reset_BANG_(argh.core.game, argh.core.new_game());
argh.core.draw_minimap(cljs.core.deref.call(null, argh.core.game), argh.core.map_canv);
argh.core.animate.call(null, argh.core.game_loop);
