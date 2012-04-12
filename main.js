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
  var or__3700__auto____19291 = p[goog.typeOf.call(null, x)];
  if(cljs.core.truth_(or__3700__auto____19291)) {
    return or__3700__auto____19291
  }else {
    var or__3700__auto____19292 = p["_"];
    if(cljs.core.truth_(or__3700__auto____19292)) {
      return or__3700__auto____19292
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
      var and__3698__auto____19295 = this$;
      if(and__3698__auto____19295) {
        return this$.cljs$core$IFn$_invoke__1
      }else {
        return and__3698__auto____19295
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__1(this$)
    }else {
      return function() {
        var or__3700__auto____19296 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19296) {
          return or__3700__auto____19296
        }else {
          var or__3700__auto____19297 = cljs.core._invoke["_"];
          if(or__3700__auto____19297) {
            return or__3700__auto____19297
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__3698__auto____19298 = this$;
      if(and__3698__auto____19298) {
        return this$.cljs$core$IFn$_invoke__2
      }else {
        return and__3698__auto____19298
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__2(this$, a)
    }else {
      return function() {
        var or__3700__auto____19299 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19299) {
          return or__3700__auto____19299
        }else {
          var or__3700__auto____19300 = cljs.core._invoke["_"];
          if(or__3700__auto____19300) {
            return or__3700__auto____19300
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__3698__auto____19301 = this$;
      if(and__3698__auto____19301) {
        return this$.cljs$core$IFn$_invoke__3
      }else {
        return and__3698__auto____19301
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__3(this$, a, b)
    }else {
      return function() {
        var or__3700__auto____19302 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19302) {
          return or__3700__auto____19302
        }else {
          var or__3700__auto____19303 = cljs.core._invoke["_"];
          if(or__3700__auto____19303) {
            return or__3700__auto____19303
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__3698__auto____19304 = this$;
      if(and__3698__auto____19304) {
        return this$.cljs$core$IFn$_invoke__4
      }else {
        return and__3698__auto____19304
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__4(this$, a, b, c)
    }else {
      return function() {
        var or__3700__auto____19305 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19305) {
          return or__3700__auto____19305
        }else {
          var or__3700__auto____19306 = cljs.core._invoke["_"];
          if(or__3700__auto____19306) {
            return or__3700__auto____19306
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__3698__auto____19307 = this$;
      if(and__3698__auto____19307) {
        return this$.cljs$core$IFn$_invoke__5
      }else {
        return and__3698__auto____19307
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__5(this$, a, b, c, d)
    }else {
      return function() {
        var or__3700__auto____19308 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19308) {
          return or__3700__auto____19308
        }else {
          var or__3700__auto____19309 = cljs.core._invoke["_"];
          if(or__3700__auto____19309) {
            return or__3700__auto____19309
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__3698__auto____19310 = this$;
      if(and__3698__auto____19310) {
        return this$.cljs$core$IFn$_invoke__6
      }else {
        return and__3698__auto____19310
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__6(this$, a, b, c, d, e)
    }else {
      return function() {
        var or__3700__auto____19311 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19311) {
          return or__3700__auto____19311
        }else {
          var or__3700__auto____19312 = cljs.core._invoke["_"];
          if(or__3700__auto____19312) {
            return or__3700__auto____19312
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__3698__auto____19313 = this$;
      if(and__3698__auto____19313) {
        return this$.cljs$core$IFn$_invoke__7
      }else {
        return and__3698__auto____19313
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__7(this$, a, b, c, d, e, f)
    }else {
      return function() {
        var or__3700__auto____19314 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19314) {
          return or__3700__auto____19314
        }else {
          var or__3700__auto____19315 = cljs.core._invoke["_"];
          if(or__3700__auto____19315) {
            return or__3700__auto____19315
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__3698__auto____19316 = this$;
      if(and__3698__auto____19316) {
        return this$.cljs$core$IFn$_invoke__8
      }else {
        return and__3698__auto____19316
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__8(this$, a, b, c, d, e, f, g)
    }else {
      return function() {
        var or__3700__auto____19317 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19317) {
          return or__3700__auto____19317
        }else {
          var or__3700__auto____19318 = cljs.core._invoke["_"];
          if(or__3700__auto____19318) {
            return or__3700__auto____19318
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__3698__auto____19319 = this$;
      if(and__3698__auto____19319) {
        return this$.cljs$core$IFn$_invoke__9
      }else {
        return and__3698__auto____19319
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__9(this$, a, b, c, d, e, f, g, h)
    }else {
      return function() {
        var or__3700__auto____19320 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19320) {
          return or__3700__auto____19320
        }else {
          var or__3700__auto____19321 = cljs.core._invoke["_"];
          if(or__3700__auto____19321) {
            return or__3700__auto____19321
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__3698__auto____19322 = this$;
      if(and__3698__auto____19322) {
        return this$.cljs$core$IFn$_invoke__10
      }else {
        return and__3698__auto____19322
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      return function() {
        var or__3700__auto____19323 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19323) {
          return or__3700__auto____19323
        }else {
          var or__3700__auto____19324 = cljs.core._invoke["_"];
          if(or__3700__auto____19324) {
            return or__3700__auto____19324
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__3698__auto____19325 = this$;
      if(and__3698__auto____19325) {
        return this$.cljs$core$IFn$_invoke__11
      }else {
        return and__3698__auto____19325
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      return function() {
        var or__3700__auto____19326 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19326) {
          return or__3700__auto____19326
        }else {
          var or__3700__auto____19327 = cljs.core._invoke["_"];
          if(or__3700__auto____19327) {
            return or__3700__auto____19327
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__3698__auto____19328 = this$;
      if(and__3698__auto____19328) {
        return this$.cljs$core$IFn$_invoke__12
      }else {
        return and__3698__auto____19328
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      return function() {
        var or__3700__auto____19329 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19329) {
          return or__3700__auto____19329
        }else {
          var or__3700__auto____19330 = cljs.core._invoke["_"];
          if(or__3700__auto____19330) {
            return or__3700__auto____19330
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__3698__auto____19331 = this$;
      if(and__3698__auto____19331) {
        return this$.cljs$core$IFn$_invoke__13
      }else {
        return and__3698__auto____19331
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      return function() {
        var or__3700__auto____19332 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19332) {
          return or__3700__auto____19332
        }else {
          var or__3700__auto____19333 = cljs.core._invoke["_"];
          if(or__3700__auto____19333) {
            return or__3700__auto____19333
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__3698__auto____19334 = this$;
      if(and__3698__auto____19334) {
        return this$.cljs$core$IFn$_invoke__14
      }else {
        return and__3698__auto____19334
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      return function() {
        var or__3700__auto____19335 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19335) {
          return or__3700__auto____19335
        }else {
          var or__3700__auto____19336 = cljs.core._invoke["_"];
          if(or__3700__auto____19336) {
            return or__3700__auto____19336
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__3698__auto____19337 = this$;
      if(and__3698__auto____19337) {
        return this$.cljs$core$IFn$_invoke__15
      }else {
        return and__3698__auto____19337
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      return function() {
        var or__3700__auto____19338 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19338) {
          return or__3700__auto____19338
        }else {
          var or__3700__auto____19339 = cljs.core._invoke["_"];
          if(or__3700__auto____19339) {
            return or__3700__auto____19339
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__3698__auto____19340 = this$;
      if(and__3698__auto____19340) {
        return this$.cljs$core$IFn$_invoke__16
      }else {
        return and__3698__auto____19340
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      return function() {
        var or__3700__auto____19341 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19341) {
          return or__3700__auto____19341
        }else {
          var or__3700__auto____19342 = cljs.core._invoke["_"];
          if(or__3700__auto____19342) {
            return or__3700__auto____19342
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__3698__auto____19343 = this$;
      if(and__3698__auto____19343) {
        return this$.cljs$core$IFn$_invoke__17
      }else {
        return and__3698__auto____19343
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      return function() {
        var or__3700__auto____19344 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19344) {
          return or__3700__auto____19344
        }else {
          var or__3700__auto____19345 = cljs.core._invoke["_"];
          if(or__3700__auto____19345) {
            return or__3700__auto____19345
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__3698__auto____19346 = this$;
      if(and__3698__auto____19346) {
        return this$.cljs$core$IFn$_invoke__18
      }else {
        return and__3698__auto____19346
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      return function() {
        var or__3700__auto____19347 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19347) {
          return or__3700__auto____19347
        }else {
          var or__3700__auto____19348 = cljs.core._invoke["_"];
          if(or__3700__auto____19348) {
            return or__3700__auto____19348
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__3698__auto____19349 = this$;
      if(and__3698__auto____19349) {
        return this$.cljs$core$IFn$_invoke__19
      }else {
        return and__3698__auto____19349
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      return function() {
        var or__3700__auto____19350 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19350) {
          return or__3700__auto____19350
        }else {
          var or__3700__auto____19351 = cljs.core._invoke["_"];
          if(or__3700__auto____19351) {
            return or__3700__auto____19351
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__3698__auto____19352 = this$;
      if(and__3698__auto____19352) {
        return this$.cljs$core$IFn$_invoke__20
      }else {
        return and__3698__auto____19352
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      return function() {
        var or__3700__auto____19353 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19353) {
          return or__3700__auto____19353
        }else {
          var or__3700__auto____19354 = cljs.core._invoke["_"];
          if(or__3700__auto____19354) {
            return or__3700__auto____19354
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__3698__auto____19355 = this$;
      if(and__3698__auto____19355) {
        return this$.cljs$core$IFn$_invoke__21
      }else {
        return and__3698__auto____19355
      }
    }()) {
      return this$.cljs$core$IFn$_invoke__21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      return function() {
        var or__3700__auto____19356 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__3700__auto____19356) {
          return or__3700__auto____19356
        }else {
          var or__3700__auto____19357 = cljs.core._invoke["_"];
          if(or__3700__auto____19357) {
            return or__3700__auto____19357
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
    var and__3698__auto____19442 = coll;
    if(and__3698__auto____19442) {
      return coll.cljs$core$ICounted$_count__1
    }else {
      return and__3698__auto____19442
    }
  }()) {
    return coll.cljs$core$ICounted$_count__1(coll)
  }else {
    return function() {
      var or__3700__auto____19443 = cljs.core._count[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19443) {
        return or__3700__auto____19443
      }else {
        var or__3700__auto____19444 = cljs.core._count["_"];
        if(or__3700__auto____19444) {
          return or__3700__auto____19444
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
    var and__3698__auto____19449 = coll;
    if(and__3698__auto____19449) {
      return coll.cljs$core$IEmptyableCollection$_empty__1
    }else {
      return and__3698__auto____19449
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty__1(coll)
  }else {
    return function() {
      var or__3700__auto____19450 = cljs.core._empty[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19450) {
        return or__3700__auto____19450
      }else {
        var or__3700__auto____19451 = cljs.core._empty["_"];
        if(or__3700__auto____19451) {
          return or__3700__auto____19451
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
    var and__3698__auto____19456 = coll;
    if(and__3698__auto____19456) {
      return coll.cljs$core$ICollection$_conj__2
    }else {
      return and__3698__auto____19456
    }
  }()) {
    return coll.cljs$core$ICollection$_conj__2(coll, o)
  }else {
    return function() {
      var or__3700__auto____19457 = cljs.core._conj[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19457) {
        return or__3700__auto____19457
      }else {
        var or__3700__auto____19458 = cljs.core._conj["_"];
        if(or__3700__auto____19458) {
          return or__3700__auto____19458
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
      var and__3698__auto____19463 = coll;
      if(and__3698__auto____19463) {
        return coll.cljs$core$IIndexed$_nth__2
      }else {
        return and__3698__auto____19463
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth__2(coll, n)
    }else {
      return function() {
        var or__3700__auto____19464 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__3700__auto____19464) {
          return or__3700__auto____19464
        }else {
          var or__3700__auto____19465 = cljs.core._nth["_"];
          if(or__3700__auto____19465) {
            return or__3700__auto____19465
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__3698__auto____19466 = coll;
      if(and__3698__auto____19466) {
        return coll.cljs$core$IIndexed$_nth__3
      }else {
        return and__3698__auto____19466
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth__3(coll, n, not_found)
    }else {
      return function() {
        var or__3700__auto____19467 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__3700__auto____19467) {
          return or__3700__auto____19467
        }else {
          var or__3700__auto____19468 = cljs.core._nth["_"];
          if(or__3700__auto____19468) {
            return or__3700__auto____19468
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
    var and__3698__auto____19477 = coll;
    if(and__3698__auto____19477) {
      return coll.cljs$core$ISeq$_first__1
    }else {
      return and__3698__auto____19477
    }
  }()) {
    return coll.cljs$core$ISeq$_first__1(coll)
  }else {
    return function() {
      var or__3700__auto____19478 = cljs.core._first[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19478) {
        return or__3700__auto____19478
      }else {
        var or__3700__auto____19479 = cljs.core._first["_"];
        if(or__3700__auto____19479) {
          return or__3700__auto____19479
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__3698__auto____19480 = coll;
    if(and__3698__auto____19480) {
      return coll.cljs$core$ISeq$_rest__1
    }else {
      return and__3698__auto____19480
    }
  }()) {
    return coll.cljs$core$ISeq$_rest__1(coll)
  }else {
    return function() {
      var or__3700__auto____19481 = cljs.core._rest[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19481) {
        return or__3700__auto____19481
      }else {
        var or__3700__auto____19482 = cljs.core._rest["_"];
        if(or__3700__auto____19482) {
          return or__3700__auto____19482
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
      var and__3698__auto____19491 = o;
      if(and__3698__auto____19491) {
        return o.cljs$core$ILookup$_lookup__2
      }else {
        return and__3698__auto____19491
      }
    }()) {
      return o.cljs$core$ILookup$_lookup__2(o, k)
    }else {
      return function() {
        var or__3700__auto____19492 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__3700__auto____19492) {
          return or__3700__auto____19492
        }else {
          var or__3700__auto____19493 = cljs.core._lookup["_"];
          if(or__3700__auto____19493) {
            return or__3700__auto____19493
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__3698__auto____19494 = o;
      if(and__3698__auto____19494) {
        return o.cljs$core$ILookup$_lookup__3
      }else {
        return and__3698__auto____19494
      }
    }()) {
      return o.cljs$core$ILookup$_lookup__3(o, k, not_found)
    }else {
      return function() {
        var or__3700__auto____19495 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__3700__auto____19495) {
          return or__3700__auto____19495
        }else {
          var or__3700__auto____19496 = cljs.core._lookup["_"];
          if(or__3700__auto____19496) {
            return or__3700__auto____19496
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
    var and__3698__auto____19505 = coll;
    if(and__3698__auto____19505) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK___2
    }else {
      return and__3698__auto____19505
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK___2(coll, k)
  }else {
    return function() {
      var or__3700__auto____19506 = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19506) {
        return or__3700__auto____19506
      }else {
        var or__3700__auto____19507 = cljs.core._contains_key_QMARK_["_"];
        if(or__3700__auto____19507) {
          return or__3700__auto____19507
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__3698__auto____19508 = coll;
    if(and__3698__auto____19508) {
      return coll.cljs$core$IAssociative$_assoc__3
    }else {
      return and__3698__auto____19508
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc__3(coll, k, v)
  }else {
    return function() {
      var or__3700__auto____19509 = cljs.core._assoc[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19509) {
        return or__3700__auto____19509
      }else {
        var or__3700__auto____19510 = cljs.core._assoc["_"];
        if(or__3700__auto____19510) {
          return or__3700__auto____19510
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
    var and__3698__auto____19519 = coll;
    if(and__3698__auto____19519) {
      return coll.cljs$core$IMap$_dissoc__2
    }else {
      return and__3698__auto____19519
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc__2(coll, k)
  }else {
    return function() {
      var or__3700__auto____19520 = cljs.core._dissoc[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19520) {
        return or__3700__auto____19520
      }else {
        var or__3700__auto____19521 = cljs.core._dissoc["_"];
        if(or__3700__auto____19521) {
          return or__3700__auto____19521
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
    var and__3698__auto____19526 = coll;
    if(and__3698__auto____19526) {
      return coll.cljs$core$ISet$_disjoin__2
    }else {
      return and__3698__auto____19526
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin__2(coll, v)
  }else {
    return function() {
      var or__3700__auto____19527 = cljs.core._disjoin[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19527) {
        return or__3700__auto____19527
      }else {
        var or__3700__auto____19528 = cljs.core._disjoin["_"];
        if(or__3700__auto____19528) {
          return or__3700__auto____19528
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
    var and__3698__auto____19533 = coll;
    if(and__3698__auto____19533) {
      return coll.cljs$core$IStack$_peek__1
    }else {
      return and__3698__auto____19533
    }
  }()) {
    return coll.cljs$core$IStack$_peek__1(coll)
  }else {
    return function() {
      var or__3700__auto____19534 = cljs.core._peek[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19534) {
        return or__3700__auto____19534
      }else {
        var or__3700__auto____19535 = cljs.core._peek["_"];
        if(or__3700__auto____19535) {
          return or__3700__auto____19535
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__3698__auto____19536 = coll;
    if(and__3698__auto____19536) {
      return coll.cljs$core$IStack$_pop__1
    }else {
      return and__3698__auto____19536
    }
  }()) {
    return coll.cljs$core$IStack$_pop__1(coll)
  }else {
    return function() {
      var or__3700__auto____19537 = cljs.core._pop[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19537) {
        return or__3700__auto____19537
      }else {
        var or__3700__auto____19538 = cljs.core._pop["_"];
        if(or__3700__auto____19538) {
          return or__3700__auto____19538
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
    var and__3698__auto____19547 = coll;
    if(and__3698__auto____19547) {
      return coll.cljs$core$IVector$_assoc_n__3
    }else {
      return and__3698__auto____19547
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n__3(coll, n, val)
  }else {
    return function() {
      var or__3700__auto____19548 = cljs.core._assoc_n[goog.typeOf.call(null, coll)];
      if(or__3700__auto____19548) {
        return or__3700__auto____19548
      }else {
        var or__3700__auto____19549 = cljs.core._assoc_n["_"];
        if(or__3700__auto____19549) {
          return or__3700__auto____19549
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
    var and__3698__auto____19554 = o;
    if(and__3698__auto____19554) {
      return o.cljs$core$IDeref$_deref__1
    }else {
      return and__3698__auto____19554
    }
  }()) {
    return o.cljs$core$IDeref$_deref__1(o)
  }else {
    return function() {
      var or__3700__auto____19555 = cljs.core._deref[goog.typeOf.call(null, o)];
      if(or__3700__auto____19555) {
        return or__3700__auto____19555
      }else {
        var or__3700__auto____19556 = cljs.core._deref["_"];
        if(or__3700__auto____19556) {
          return or__3700__auto____19556
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
    var and__3698__auto____19561 = o;
    if(and__3698__auto____19561) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout__3
    }else {
      return and__3698__auto____19561
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout__3(o, msec, timeout_val)
  }else {
    return function() {
      var or__3700__auto____19562 = cljs.core._deref_with_timeout[goog.typeOf.call(null, o)];
      if(or__3700__auto____19562) {
        return or__3700__auto____19562
      }else {
        var or__3700__auto____19563 = cljs.core._deref_with_timeout["_"];
        if(or__3700__auto____19563) {
          return or__3700__auto____19563
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
    var and__3698__auto____19568 = o;
    if(and__3698__auto____19568) {
      return o.cljs$core$IMeta$_meta__1
    }else {
      return and__3698__auto____19568
    }
  }()) {
    return o.cljs$core$IMeta$_meta__1(o)
  }else {
    return function() {
      var or__3700__auto____19569 = cljs.core._meta[goog.typeOf.call(null, o)];
      if(or__3700__auto____19569) {
        return or__3700__auto____19569
      }else {
        var or__3700__auto____19570 = cljs.core._meta["_"];
        if(or__3700__auto____19570) {
          return or__3700__auto____19570
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
    var and__3698__auto____19575 = o;
    if(and__3698__auto____19575) {
      return o.cljs$core$IWithMeta$_with_meta__2
    }else {
      return and__3698__auto____19575
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta__2(o, meta)
  }else {
    return function() {
      var or__3700__auto____19576 = cljs.core._with_meta[goog.typeOf.call(null, o)];
      if(or__3700__auto____19576) {
        return or__3700__auto____19576
      }else {
        var or__3700__auto____19577 = cljs.core._with_meta["_"];
        if(or__3700__auto____19577) {
          return or__3700__auto____19577
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
      var and__3698__auto____19582 = coll;
      if(and__3698__auto____19582) {
        return coll.cljs$core$IReduce$_reduce__2
      }else {
        return and__3698__auto____19582
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce__2(coll, f)
    }else {
      return function() {
        var or__3700__auto____19583 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__3700__auto____19583) {
          return or__3700__auto____19583
        }else {
          var or__3700__auto____19584 = cljs.core._reduce["_"];
          if(or__3700__auto____19584) {
            return or__3700__auto____19584
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__3698__auto____19585 = coll;
      if(and__3698__auto____19585) {
        return coll.cljs$core$IReduce$_reduce__3
      }else {
        return and__3698__auto____19585
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce__3(coll, f, start)
    }else {
      return function() {
        var or__3700__auto____19586 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__3700__auto____19586) {
          return or__3700__auto____19586
        }else {
          var or__3700__auto____19587 = cljs.core._reduce["_"];
          if(or__3700__auto____19587) {
            return or__3700__auto____19587
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
    var and__3698__auto____19596 = o;
    if(and__3698__auto____19596) {
      return o.cljs$core$IEquiv$_equiv__2
    }else {
      return and__3698__auto____19596
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv__2(o, other)
  }else {
    return function() {
      var or__3700__auto____19597 = cljs.core._equiv[goog.typeOf.call(null, o)];
      if(or__3700__auto____19597) {
        return or__3700__auto____19597
      }else {
        var or__3700__auto____19598 = cljs.core._equiv["_"];
        if(or__3700__auto____19598) {
          return or__3700__auto____19598
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
    var and__3698__auto____19603 = o;
    if(and__3698__auto____19603) {
      return o.cljs$core$IHash$_hash__1
    }else {
      return and__3698__auto____19603
    }
  }()) {
    return o.cljs$core$IHash$_hash__1(o)
  }else {
    return function() {
      var or__3700__auto____19604 = cljs.core._hash[goog.typeOf.call(null, o)];
      if(or__3700__auto____19604) {
        return or__3700__auto____19604
      }else {
        var or__3700__auto____19605 = cljs.core._hash["_"];
        if(or__3700__auto____19605) {
          return or__3700__auto____19605
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
    var and__3698__auto____19610 = o;
    if(and__3698__auto____19610) {
      return o.cljs$core$ISeqable$_seq__1
    }else {
      return and__3698__auto____19610
    }
  }()) {
    return o.cljs$core$ISeqable$_seq__1(o)
  }else {
    return function() {
      var or__3700__auto____19611 = cljs.core._seq[goog.typeOf.call(null, o)];
      if(or__3700__auto____19611) {
        return or__3700__auto____19611
      }else {
        var or__3700__auto____19612 = cljs.core._seq["_"];
        if(or__3700__auto____19612) {
          return or__3700__auto____19612
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
    var and__3698__auto____19617 = o;
    if(and__3698__auto____19617) {
      return o.cljs$core$IPrintable$_pr_seq__2
    }else {
      return and__3698__auto____19617
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq__2(o, opts)
  }else {
    return function() {
      var or__3700__auto____19618 = cljs.core._pr_seq[goog.typeOf.call(null, o)];
      if(or__3700__auto____19618) {
        return or__3700__auto____19618
      }else {
        var or__3700__auto____19619 = cljs.core._pr_seq["_"];
        if(or__3700__auto____19619) {
          return or__3700__auto____19619
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
    var and__3698__auto____19624 = d;
    if(and__3698__auto____19624) {
      return d.cljs$core$IPending$_realized_QMARK___1
    }else {
      return and__3698__auto____19624
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK___1(d)
  }else {
    return function() {
      var or__3700__auto____19625 = cljs.core._realized_QMARK_[goog.typeOf.call(null, d)];
      if(or__3700__auto____19625) {
        return or__3700__auto____19625
      }else {
        var or__3700__auto____19626 = cljs.core._realized_QMARK_["_"];
        if(or__3700__auto____19626) {
          return or__3700__auto____19626
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
    var and__3698__auto____19631 = this$;
    if(and__3698__auto____19631) {
      return this$.cljs$core$IWatchable$_notify_watches__3
    }else {
      return and__3698__auto____19631
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches__3(this$, oldval, newval)
  }else {
    return function() {
      var or__3700__auto____19632 = cljs.core._notify_watches[goog.typeOf.call(null, this$)];
      if(or__3700__auto____19632) {
        return or__3700__auto____19632
      }else {
        var or__3700__auto____19633 = cljs.core._notify_watches["_"];
        if(or__3700__auto____19633) {
          return or__3700__auto____19633
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__3698__auto____19634 = this$;
    if(and__3698__auto____19634) {
      return this$.cljs$core$IWatchable$_add_watch__3
    }else {
      return and__3698__auto____19634
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch__3(this$, key, f)
  }else {
    return function() {
      var or__3700__auto____19635 = cljs.core._add_watch[goog.typeOf.call(null, this$)];
      if(or__3700__auto____19635) {
        return or__3700__auto____19635
      }else {
        var or__3700__auto____19636 = cljs.core._add_watch["_"];
        if(or__3700__auto____19636) {
          return or__3700__auto____19636
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__3698__auto____19637 = this$;
    if(and__3698__auto____19637) {
      return this$.cljs$core$IWatchable$_remove_watch__2
    }else {
      return and__3698__auto____19637
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch__2(this$, key)
  }else {
    return function() {
      var or__3700__auto____19638 = cljs.core._remove_watch[goog.typeOf.call(null, this$)];
      if(or__3700__auto____19638) {
        return or__3700__auto____19638
      }else {
        var or__3700__auto____19639 = cljs.core._remove_watch["_"];
        if(or__3700__auto____19639) {
          return or__3700__auto____19639
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
  var G__19652 = null;
  var G__19652__2 = function(o, k) {
    return null
  };
  var G__19652__3 = function(o, k, not_found) {
    return not_found
  };
  G__19652 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19652__2.call(this, o, k);
      case 3:
        return G__19652__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19652
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
  var G__19653 = null;
  var G__19653__2 = function(_, f) {
    return f.call(null)
  };
  var G__19653__3 = function(_, f, start) {
    return start
  };
  G__19653 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__19653__2.call(this, _, f);
      case 3:
        return G__19653__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19653
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
  var G__19654 = null;
  var G__19654__2 = function(_, n) {
    return null
  };
  var G__19654__3 = function(_, n, not_found) {
    return not_found
  };
  G__19654 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19654__2.call(this, _, n);
      case 3:
        return G__19654__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19654
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
      var val__19655 = cljs.core._nth.__2(cicoll, 0);
      var n__19656 = 1;
      while(true) {
        if(n__19656 < cljs.core._count(cicoll)) {
          var G__19663 = f.call(null, val__19655, cljs.core._nth.__2(cicoll, n__19656));
          var G__19664 = n__19656 + 1;
          val__19655 = G__19663;
          n__19656 = G__19664;
          continue
        }else {
          return val__19655
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var val__19657 = val;
    var n__19658 = 0;
    while(true) {
      if(n__19658 < cljs.core._count(cicoll)) {
        var G__19666 = f.call(null, val__19657, cljs.core._nth.__2(cicoll, n__19658));
        var G__19667 = n__19658 + 1;
        val__19657 = G__19666;
        n__19658 = G__19667;
        continue
      }else {
        return val__19657
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var val__19659 = val;
    var n__19660 = idx;
    while(true) {
      if(n__19660 < cljs.core._count(cicoll)) {
        var G__19669 = f.call(null, val__19659, cljs.core._nth.__2(cicoll, n__19660));
        var G__19670 = n__19660 + 1;
        val__19659 = G__19669;
        n__19660 = G__19670;
        continue
      }else {
        return val__19659
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
  var this__19671 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce__2 = function(_, f) {
  var this__19672 = this;
  return cljs.core.ci_reduce.__4(this__19672.a, f, this__19672.a[this__19672.i], this__19672.i + 1)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce__3 = function(_, f, start) {
  var this__19673 = this;
  return cljs.core.ci_reduce.__4(this__19673.a, f, start, this__19673.i)
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__19674 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__19675 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__19676 = this;
  var i__19677 = n + this__19676.i;
  if(i__19677 < this__19676.a.length) {
    return this__19676.a[i__19677]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__19678 = this;
  var i__19679 = n + this__19678.i;
  if(i__19679 < this__19678.a.length) {
    return this__19678.a[i__19679]
  }else {
    return not_found
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count__1 = function(_) {
  var this__19680 = this;
  return this__19680.a.length - this__19680.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first__1 = function(_) {
  var this__19681 = this;
  return this__19681.a[this__19681.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest__1 = function(_) {
  var this__19682 = this;
  if(this__19682.i + 1 < this__19682.a.length) {
    return new cljs.core.IndexedSeq(this__19682.a, this__19682.i + 1)
  }else {
    return cljs.core.list()
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq__1 = function(this$) {
  var this__19683 = this;
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
  var G__19688 = null;
  var G__19688__2 = function(array, f) {
    return cljs.core.ci_reduce.__2(array, f)
  };
  var G__19688__3 = function(array, f, start) {
    return cljs.core.ci_reduce.__3(array, f, start)
  };
  G__19688 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__19688__2.call(this, array, f);
      case 3:
        return G__19688__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19688
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__19689 = null;
  var G__19689__2 = function(array, k) {
    return array[k]
  };
  var G__19689__3 = function(array, k, not_found) {
    return cljs.core._nth.__3(array, k, not_found)
  };
  G__19689 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19689__2.call(this, array, k);
      case 3:
        return G__19689__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19689
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__19690 = null;
  var G__19690__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__19690__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__19690 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19690__2.call(this, array, n);
      case 3:
        return G__19690__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19690
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
  var temp__3850__auto____19694 = cljs.core.seq(coll);
  if(cljs.core.truth_(temp__3850__auto____19694)) {
    var s__19695 = temp__3850__auto____19694;
    return cljs.core._first(s__19695)
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
      var G__19699 = cljs.core.next(s);
      s = G__19699;
      continue
    }else {
      return cljs.core.first(s)
    }
    break
  }
};
cljs.core.ICounted["_"] = true;
cljs.core._count["_"] = function(x) {
  var s__19700 = cljs.core.seq(x);
  var n__19701 = 0;
  while(true) {
    if(cljs.core.truth_(s__19700)) {
      var G__19703 = cljs.core.next(s__19700);
      var G__19704 = n__19701 + 1;
      s__19700 = G__19703;
      n__19701 = G__19704;
      continue
    }else {
      return n__19701
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
    var G__19706__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__19708 = conj.call(null, coll, x);
          var G__19709 = cljs.core.first(xs);
          var G__19710 = cljs.core.next(xs);
          coll = G__19708;
          x = G__19709;
          xs = G__19710;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__19706 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19706__delegate.call(this, coll, x, xs)
    };
    G__19706.cljs$lang$maxFixedArity = 2;
    G__19706.cljs$lang$applyTo = function(arglist__19711) {
      var coll = cljs.core.first(arglist__19711);
      var x = cljs.core.first(cljs.core.next(arglist__19711));
      var xs = cljs.core.rest(cljs.core.next(arglist__19711));
      return G__19706__delegate.call(this, coll, x, xs)
    };
    return G__19706
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
    var G__19713__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__19712 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__19715 = ret__19712;
          var G__19716 = cljs.core.first(kvs);
          var G__19717 = cljs.core.second(kvs);
          var G__19718 = cljs.core.nnext(kvs);
          coll = G__19715;
          k = G__19716;
          v = G__19717;
          kvs = G__19718;
          continue
        }else {
          return ret__19712
        }
        break
      }
    };
    var G__19713 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__19713__delegate.call(this, coll, k, v, kvs)
    };
    G__19713.cljs$lang$maxFixedArity = 3;
    G__19713.cljs$lang$applyTo = function(arglist__19719) {
      var coll = cljs.core.first(arglist__19719);
      var k = cljs.core.first(cljs.core.next(arglist__19719));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__19719)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__19719)));
      return G__19713__delegate.call(this, coll, k, v, kvs)
    };
    return G__19713
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
    var G__19721__delegate = function(coll, k, ks) {
      while(true) {
        var ret__19720 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__19723 = ret__19720;
          var G__19724 = cljs.core.first(ks);
          var G__19725 = cljs.core.next(ks);
          coll = G__19723;
          k = G__19724;
          ks = G__19725;
          continue
        }else {
          return ret__19720
        }
        break
      }
    };
    var G__19721 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19721__delegate.call(this, coll, k, ks)
    };
    G__19721.cljs$lang$maxFixedArity = 2;
    G__19721.cljs$lang$applyTo = function(arglist__19726) {
      var coll = cljs.core.first(arglist__19726);
      var k = cljs.core.first(cljs.core.next(arglist__19726));
      var ks = cljs.core.rest(cljs.core.next(arglist__19726));
      return G__19721__delegate.call(this, coll, k, ks)
    };
    return G__19721
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
    var x__457__auto____19727 = o;
    if(cljs.core.truth_(function() {
      var and__3698__auto____19728 = x__457__auto____19727;
      if(cljs.core.truth_(and__3698__auto____19728)) {
        var and__3698__auto____19729 = x__457__auto____19727.cljs$core$IMeta$;
        if(cljs.core.truth_(and__3698__auto____19729)) {
          return cljs.core.not.call(null, x__457__auto____19727.hasOwnProperty("cljs$core$IMeta$"))
        }else {
          return and__3698__auto____19729
        }
      }else {
        return and__3698__auto____19728
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__457__auto____19727)
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
    var G__19735__delegate = function(coll, k, ks) {
      while(true) {
        var ret__19734 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__19737 = ret__19734;
          var G__19738 = cljs.core.first(ks);
          var G__19739 = cljs.core.next(ks);
          coll = G__19737;
          k = G__19738;
          ks = G__19739;
          continue
        }else {
          return ret__19734
        }
        break
      }
    };
    var G__19735 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19735__delegate.call(this, coll, k, ks)
    };
    G__19735.cljs$lang$maxFixedArity = 2;
    G__19735.cljs$lang$applyTo = function(arglist__19740) {
      var coll = cljs.core.first(arglist__19740);
      var k = cljs.core.first(cljs.core.next(arglist__19740));
      var ks = cljs.core.rest(cljs.core.next(arglist__19740));
      return G__19735__delegate.call(this, coll, k, ks)
    };
    return G__19735
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
    var x__457__auto____19741 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____19742 = x__457__auto____19741;
      if(cljs.core.truth_(and__3698__auto____19742)) {
        var and__3698__auto____19743 = x__457__auto____19741.cljs$core$ICollection$;
        if(cljs.core.truth_(and__3698__auto____19743)) {
          return cljs.core.not.call(null, x__457__auto____19741.hasOwnProperty("cljs$core$ICollection$"))
        }else {
          return and__3698__auto____19743
        }
      }else {
        return and__3698__auto____19742
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, x__457__auto____19741)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x === null) {
    return false
  }else {
    var x__457__auto____19748 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____19749 = x__457__auto____19748;
      if(cljs.core.truth_(and__3698__auto____19749)) {
        var and__3698__auto____19750 = x__457__auto____19748.cljs$core$ISet$;
        if(cljs.core.truth_(and__3698__auto____19750)) {
          return cljs.core.not.call(null, x__457__auto____19748.hasOwnProperty("cljs$core$ISet$"))
        }else {
          return and__3698__auto____19750
        }
      }else {
        return and__3698__auto____19749
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, x__457__auto____19748)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var x__457__auto____19755 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____19756 = x__457__auto____19755;
    if(cljs.core.truth_(and__3698__auto____19756)) {
      var and__3698__auto____19757 = x__457__auto____19755.cljs$core$IAssociative$;
      if(cljs.core.truth_(and__3698__auto____19757)) {
        return cljs.core.not.call(null, x__457__auto____19755.hasOwnProperty("cljs$core$IAssociative$"))
      }else {
        return and__3698__auto____19757
      }
    }else {
      return and__3698__auto____19756
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, x__457__auto____19755)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var x__457__auto____19761 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____19762 = x__457__auto____19761;
    if(cljs.core.truth_(and__3698__auto____19762)) {
      var and__3698__auto____19763 = x__457__auto____19761.cljs$core$ISequential$;
      if(cljs.core.truth_(and__3698__auto____19763)) {
        return cljs.core.not.call(null, x__457__auto____19761.hasOwnProperty("cljs$core$ISequential$"))
      }else {
        return and__3698__auto____19763
      }
    }else {
      return and__3698__auto____19762
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, x__457__auto____19761)
  }
};
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var x__457__auto____19767 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____19768 = x__457__auto____19767;
    if(cljs.core.truth_(and__3698__auto____19768)) {
      var and__3698__auto____19769 = x__457__auto____19767.cljs$core$ICounted$;
      if(cljs.core.truth_(and__3698__auto____19769)) {
        return cljs.core.not.call(null, x__457__auto____19767.hasOwnProperty("cljs$core$ICounted$"))
      }else {
        return and__3698__auto____19769
      }
    }else {
      return and__3698__auto____19768
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, x__457__auto____19767)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x === null) {
    return false
  }else {
    var x__457__auto____19773 = x;
    if(cljs.core.truth_(function() {
      var and__3698__auto____19774 = x__457__auto____19773;
      if(cljs.core.truth_(and__3698__auto____19774)) {
        var and__3698__auto____19775 = x__457__auto____19773.cljs$core$IMap$;
        if(cljs.core.truth_(and__3698__auto____19775)) {
          return cljs.core.not.call(null, x__457__auto____19773.hasOwnProperty("cljs$core$IMap$"))
        }else {
          return and__3698__auto____19775
        }
      }else {
        return and__3698__auto____19774
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, x__457__auto____19773)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var x__457__auto____19780 = x;
  if(cljs.core.truth_(function() {
    var and__3698__auto____19781 = x__457__auto____19780;
    if(cljs.core.truth_(and__3698__auto____19781)) {
      var and__3698__auto____19782 = x__457__auto____19780.cljs$core$IVector$;
      if(cljs.core.truth_(and__3698__auto____19782)) {
        return cljs.core.not.call(null, x__457__auto____19780.hasOwnProperty("cljs$core$IVector$"))
      }else {
        return and__3698__auto____19782
      }
    }else {
      return and__3698__auto____19781
    }
  }())) {
    return true
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, x__457__auto____19780)
  }
};
cljs.core.js_obj = function js_obj() {
  return{}
};
cljs.core.js_keys = function js_keys(obj) {
  var keys__19786 = [];
  goog.object.forEach.call(null, obj, function(val, key, obj) {
    return keys__19786.push(key)
  });
  return keys__19786
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
    var x__457__auto____19787 = s;
    if(cljs.core.truth_(function() {
      var and__3698__auto____19788 = x__457__auto____19787;
      if(cljs.core.truth_(and__3698__auto____19788)) {
        var and__3698__auto____19789 = x__457__auto____19787.cljs$core$ISeq$;
        if(cljs.core.truth_(and__3698__auto____19789)) {
          return cljs.core.not.call(null, x__457__auto____19787.hasOwnProperty("cljs$core$ISeq$"))
        }else {
          return and__3698__auto____19789
        }
      }else {
        return and__3698__auto____19788
      }
    }())) {
      return true
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, x__457__auto____19787)
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
  var and__3698__auto____19795 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____19795)) {
    return cljs.core.not(function() {
      var or__3700__auto____19796 = cljs.core._EQ_(x.charAt(0), "\ufdd0");
      if(cljs.core.truth_(or__3700__auto____19796)) {
        return or__3700__auto____19796
      }else {
        return cljs.core._EQ_(x.charAt(0), "\ufdd1")
      }
    }())
  }else {
    return and__3698__auto____19795
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__3698__auto____19799 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____19799)) {
    return cljs.core._EQ_(x.charAt(0), "\ufdd0")
  }else {
    return and__3698__auto____19799
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__3698__auto____19801 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__3698__auto____19801)) {
    return cljs.core._EQ_(x.charAt(0), "\ufdd1")
  }else {
    return and__3698__auto____19801
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber.call(null, n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction.call(null, f)
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__3698__auto____19803 = cljs.core.number_QMARK_(n);
  if(cljs.core.truth_(and__3698__auto____19803)) {
    return n == n.toFixed()
  }else {
    return and__3698__auto____19803
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
    var and__3698__auto____19806 = coll;
    if(cljs.core.truth_(and__3698__auto____19806)) {
      var and__3698__auto____19807 = cljs.core.associative_QMARK_(coll);
      if(cljs.core.truth_(and__3698__auto____19807)) {
        return cljs.core.contains_QMARK_(coll, k)
      }else {
        return and__3698__auto____19807
      }
    }else {
      return and__3698__auto____19806
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
    var G__19815__delegate = function(x, y, more) {
      if(cljs.core.truth_(cljs.core.not(cljs.core._EQ_(x, y)))) {
        var s__19811 = cljs.core.set([y, x]);
        var xs__19812 = more;
        while(true) {
          var x__19813 = cljs.core.first(xs__19812);
          var etc__19814 = cljs.core.next(xs__19812);
          if(cljs.core.truth_(xs__19812)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_(s__19811, x__19813))) {
              return false
            }else {
              var G__19819 = cljs.core.conj.__2(s__19811, x__19813);
              var G__19820 = etc__19814;
              s__19811 = G__19819;
              xs__19812 = G__19820;
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
    var G__19815 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19815__delegate.call(this, x, y, more)
    };
    G__19815.cljs$lang$maxFixedArity = 2;
    G__19815.cljs$lang$applyTo = function(arglist__19821) {
      var x = cljs.core.first(arglist__19821);
      var y = cljs.core.first(cljs.core.next(arglist__19821));
      var more = cljs.core.rest(cljs.core.next(arglist__19821));
      return G__19815__delegate.call(this, x, y, more)
    };
    return G__19815
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
      var r__19822 = f.call(null, x, y);
      if(cljs.core.truth_(cljs.core.number_QMARK_(r__19822))) {
        return r__19822
      }else {
        if(cljs.core.truth_(r__19822)) {
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
      var a__19827 = cljs.core.to_array(coll);
      goog.array.stableSort.call(null, a__19827, cljs.core.fn__GT_comparator(comp));
      return cljs.core.seq(a__19827)
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
    var temp__3847__auto____19829 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3847__auto____19829)) {
      var s__19830 = temp__3847__auto____19829;
      return cljs.core.reduce.__3(f, cljs.core.first(s__19830), cljs.core.next(s__19830))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__19831 = val;
    var coll__19832 = cljs.core.seq(coll);
    while(true) {
      if(cljs.core.truth_(coll__19832)) {
        var G__19835 = f.call(null, val__19831, cljs.core.first(coll__19832));
        var G__19836 = cljs.core.next(coll__19832);
        val__19831 = G__19835;
        coll__19832 = G__19836;
        continue
      }else {
        return val__19831
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
  var G__19837 = null;
  var G__19837__2 = function(coll, f) {
    return cljs.core.seq_reduce.__2(f, coll)
  };
  var G__19837__3 = function(coll, f, start) {
    return cljs.core.seq_reduce.__3(f, start, coll)
  };
  G__19837 = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return G__19837__2.call(this, coll, f);
      case 3:
        return G__19837__3.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19837
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
    var G__19838__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_PLUS_, x + y, more)
    };
    var G__19838 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19838__delegate.call(this, x, y, more)
    };
    G__19838.cljs$lang$maxFixedArity = 2;
    G__19838.cljs$lang$applyTo = function(arglist__19839) {
      var x = cljs.core.first(arglist__19839);
      var y = cljs.core.first(cljs.core.next(arglist__19839));
      var more = cljs.core.rest(cljs.core.next(arglist__19839));
      return G__19838__delegate.call(this, x, y, more)
    };
    return G__19838
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
    var G__19840__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_, x - y, more)
    };
    var G__19840 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19840__delegate.call(this, x, y, more)
    };
    G__19840.cljs$lang$maxFixedArity = 2;
    G__19840.cljs$lang$applyTo = function(arglist__19841) {
      var x = cljs.core.first(arglist__19841);
      var y = cljs.core.first(cljs.core.next(arglist__19841));
      var more = cljs.core.rest(cljs.core.next(arglist__19841));
      return G__19840__delegate.call(this, x, y, more)
    };
    return G__19840
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
    var G__19842__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_STAR_, x * y, more)
    };
    var G__19842 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19842__delegate.call(this, x, y, more)
    };
    G__19842.cljs$lang$maxFixedArity = 2;
    G__19842.cljs$lang$applyTo = function(arglist__19843) {
      var x = cljs.core.first(arglist__19843);
      var y = cljs.core.first(cljs.core.next(arglist__19843));
      var more = cljs.core.rest(cljs.core.next(arglist__19843));
      return G__19842__delegate.call(this, x, y, more)
    };
    return G__19842
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
    var G__19844__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(_SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__19844 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19844__delegate.call(this, x, y, more)
    };
    G__19844.cljs$lang$maxFixedArity = 2;
    G__19844.cljs$lang$applyTo = function(arglist__19845) {
      var x = cljs.core.first(arglist__19845);
      var y = cljs.core.first(cljs.core.next(arglist__19845));
      var more = cljs.core.rest(cljs.core.next(arglist__19845));
      return G__19844__delegate.call(this, x, y, more)
    };
    return G__19844
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
    var G__19846__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__19849 = y;
            var G__19850 = cljs.core.first(more);
            var G__19851 = cljs.core.next(more);
            x = G__19849;
            y = G__19850;
            more = G__19851;
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
    var G__19846 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19846__delegate.call(this, x, y, more)
    };
    G__19846.cljs$lang$maxFixedArity = 2;
    G__19846.cljs$lang$applyTo = function(arglist__19852) {
      var x = cljs.core.first(arglist__19852);
      var y = cljs.core.first(cljs.core.next(arglist__19852));
      var more = cljs.core.rest(cljs.core.next(arglist__19852));
      return G__19846__delegate.call(this, x, y, more)
    };
    return G__19846
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
    var G__19853__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__19856 = y;
            var G__19857 = cljs.core.first(more);
            var G__19858 = cljs.core.next(more);
            x = G__19856;
            y = G__19857;
            more = G__19858;
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
    var G__19853 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19853__delegate.call(this, x, y, more)
    };
    G__19853.cljs$lang$maxFixedArity = 2;
    G__19853.cljs$lang$applyTo = function(arglist__19859) {
      var x = cljs.core.first(arglist__19859);
      var y = cljs.core.first(cljs.core.next(arglist__19859));
      var more = cljs.core.rest(cljs.core.next(arglist__19859));
      return G__19853__delegate.call(this, x, y, more)
    };
    return G__19853
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
    var G__19860__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__19863 = y;
            var G__19864 = cljs.core.first(more);
            var G__19865 = cljs.core.next(more);
            x = G__19863;
            y = G__19864;
            more = G__19865;
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
    var G__19860 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19860__delegate.call(this, x, y, more)
    };
    G__19860.cljs$lang$maxFixedArity = 2;
    G__19860.cljs$lang$applyTo = function(arglist__19866) {
      var x = cljs.core.first(arglist__19866);
      var y = cljs.core.first(cljs.core.next(arglist__19866));
      var more = cljs.core.rest(cljs.core.next(arglist__19866));
      return G__19860__delegate.call(this, x, y, more)
    };
    return G__19860
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
    var G__19867__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__19870 = y;
            var G__19871 = cljs.core.first(more);
            var G__19872 = cljs.core.next(more);
            x = G__19870;
            y = G__19871;
            more = G__19872;
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
    var G__19867 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19867__delegate.call(this, x, y, more)
    };
    G__19867.cljs$lang$maxFixedArity = 2;
    G__19867.cljs$lang$applyTo = function(arglist__19873) {
      var x = cljs.core.first(arglist__19873);
      var y = cljs.core.first(cljs.core.next(arglist__19873));
      var more = cljs.core.rest(cljs.core.next(arglist__19873));
      return G__19867__delegate.call(this, x, y, more)
    };
    return G__19867
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
    var G__19874__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(max, x > y ? x : y, more)
    };
    var G__19874 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19874__delegate.call(this, x, y, more)
    };
    G__19874.cljs$lang$maxFixedArity = 2;
    G__19874.cljs$lang$applyTo = function(arglist__19875) {
      var x = cljs.core.first(arglist__19875);
      var y = cljs.core.first(cljs.core.next(arglist__19875));
      var more = cljs.core.rest(cljs.core.next(arglist__19875));
      return G__19874__delegate.call(this, x, y, more)
    };
    return G__19874
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
    var G__19876__delegate = function(x, y, more) {
      return cljs.core.reduce.__3(min, x < y ? x : y, more)
    };
    var G__19876 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19876__delegate.call(this, x, y, more)
    };
    G__19876.cljs$lang$maxFixedArity = 2;
    G__19876.cljs$lang$applyTo = function(arglist__19877) {
      var x = cljs.core.first(arglist__19877);
      var y = cljs.core.first(cljs.core.next(arglist__19877));
      var more = cljs.core.rest(cljs.core.next(arglist__19877));
      return G__19876__delegate.call(this, x, y, more)
    };
    return G__19876
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
  var rem__19879 = n % d;
  return cljs.core.fix((n - rem__19879) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__19880 = cljs.core.quot(n, d);
  return n - d * q__19880
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
    var G__19881__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next(more))) {
            var G__19884 = y;
            var G__19885 = cljs.core.first(more);
            var G__19886 = cljs.core.next(more);
            x = G__19884;
            y = G__19885;
            more = G__19886;
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
    var G__19881 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__19881__delegate.call(this, x, y, more)
    };
    G__19881.cljs$lang$maxFixedArity = 2;
    G__19881.cljs$lang$applyTo = function(arglist__19887) {
      var x = cljs.core.first(arglist__19887);
      var y = cljs.core.first(cljs.core.next(arglist__19887));
      var more = cljs.core.rest(cljs.core.next(arglist__19887));
      return G__19881__delegate.call(this, x, y, more)
    };
    return G__19881
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
  var n__19888 = n;
  var xs__19889 = cljs.core.seq(coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____19890 = xs__19889;
      if(cljs.core.truth_(and__3698__auto____19890)) {
        return n__19888 > 0
      }else {
        return and__3698__auto____19890
      }
    }())) {
      var G__19893 = n__19888 - 1;
      var G__19894 = cljs.core.next(xs__19889);
      n__19888 = G__19893;
      xs__19889 = G__19894;
      continue
    }else {
      return xs__19889
    }
    break
  }
};
cljs.core.IIndexed["_"] = true;
cljs.core._nth["_"] = function() {
  var G__19899 = null;
  var G__19899__2 = function(coll, n) {
    var temp__3847__auto____19895 = cljs.core.nthnext(coll, n);
    if(cljs.core.truth_(temp__3847__auto____19895)) {
      var xs__19896 = temp__3847__auto____19895;
      return cljs.core.first(xs__19896)
    }else {
      throw new Error("Index out of bounds");
    }
  };
  var G__19899__3 = function(coll, n, not_found) {
    var temp__3847__auto____19897 = cljs.core.nthnext(coll, n);
    if(cljs.core.truth_(temp__3847__auto____19897)) {
      var xs__19898 = temp__3847__auto____19897;
      return cljs.core.first(xs__19898)
    }else {
      return not_found
    }
  };
  G__19899 = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19899__2.call(this, coll, n);
      case 3:
        return G__19899__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19899
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
    var G__19904__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__19906 = sb.append(str_STAR_.call(null, cljs.core.first(more)));
            var G__19907 = cljs.core.next(more);
            sb = G__19906;
            more = G__19907;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__19904 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19904__delegate.call(this, x, ys)
    };
    G__19904.cljs$lang$maxFixedArity = 1;
    G__19904.cljs$lang$applyTo = function(arglist__19908) {
      var x = cljs.core.first(arglist__19908);
      var ys = cljs.core.rest(arglist__19908);
      return G__19904__delegate.call(this, x, ys)
    };
    return G__19904
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
    var G__19913__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__19915 = sb.append(str.call(null, cljs.core.first(more)));
            var G__19916 = cljs.core.next(more);
            sb = G__19915;
            more = G__19916;
            continue
          }else {
            return cljs.core.str_STAR_.__1(sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__19913 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__19913__delegate.call(this, x, ys)
    };
    G__19913.cljs$lang$maxFixedArity = 1;
    G__19913.cljs$lang$applyTo = function(arglist__19917) {
      var x = cljs.core.first(arglist__19917);
      var ys = cljs.core.rest(arglist__19917);
      return G__19913__delegate.call(this, x, ys)
    };
    return G__19913
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
    var xs__19923 = cljs.core.seq(x);
    var ys__19924 = cljs.core.seq(y);
    while(true) {
      if(xs__19923 === null) {
        return ys__19924 === null
      }else {
        if(ys__19924 === null) {
          return false
        }else {
          if(cljs.core.truth_(cljs.core._EQ_(cljs.core.first(xs__19923), cljs.core.first(ys__19924)))) {
            var G__19928 = cljs.core.next(xs__19923);
            var G__19929 = cljs.core.next(ys__19924);
            xs__19923 = G__19928;
            ys__19924 = G__19929;
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
  return cljs.core.reduce.__3(function(p1__19931_SHARP_, p2__19932_SHARP_) {
    return cljs.core.hash_combine(p1__19931_SHARP_, cljs.core.hash(p2__19932_SHARP_))
  }, cljs.core.hash(cljs.core.first(coll)), cljs.core.next(coll))
};
void 0;
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__19933__19934 = cljs.core.seq.call(null, fn_map);
  if(cljs.core.truth_(G__19933__19934)) {
    var G__19936__19938 = cljs.core.first.call(null, G__19933__19934);
    var vec__19937__19939 = G__19936__19938;
    var key_name__19940 = cljs.core.nth.call(null, vec__19937__19939, 0, null);
    var f__19941 = cljs.core.nth.call(null, vec__19937__19939, 1, null);
    var G__19933__19942 = G__19933__19934;
    var G__19936__19943 = G__19936__19938;
    var G__19933__19944 = G__19933__19942;
    while(true) {
      var vec__19945__19946 = G__19936__19943;
      var key_name__19947 = cljs.core.nth.call(null, vec__19945__19946, 0, null);
      var f__19948 = cljs.core.nth.call(null, vec__19945__19946, 1, null);
      var G__19933__19949 = G__19933__19944;
      var str_name__19950 = cljs.core.name(key_name__19947);
      obj[str_name__19950] = f__19948;
      var temp__3850__auto____19951 = cljs.core.next.call(null, G__19933__19949);
      if(cljs.core.truth_(temp__3850__auto____19951)) {
        var G__19933__19952 = temp__3850__auto____19951;
        var G__19955 = cljs.core.first.call(null, G__19933__19952);
        var G__19956 = G__19933__19952;
        G__19936__19943 = G__19955;
        G__19933__19944 = G__19956;
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
  var this__19957 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__19958 = this;
  return new cljs.core.List(this__19958.meta, o, coll, this__19958.count + 1)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__19959 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__19960 = this;
  return this__19960.count
};
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__19961 = this;
  return this__19961.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__19962 = this;
  return cljs.core._rest(coll)
};
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__19963 = this;
  return this__19963.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__19964 = this;
  return this__19964.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__19965 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__19966 = this;
  return new cljs.core.List(meta, this__19966.first, this__19966.rest, this__19966.count)
};
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__19967 = this;
  return this__19967.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__19968 = this;
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
  var this__19969 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__19970 = this;
  return new cljs.core.List(this__19970.meta, o, null, 1)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__19971 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__19972 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__19973 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__19974 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__19975 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__19976 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__19977 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__19978 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__19979 = this;
  return this__19979.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__19980 = this;
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
  list.cljs$lang$applyTo = function(arglist__19981) {
    var items = cljs.core.seq(arglist__19981);
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
  var this__19982 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__19983 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__19984 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__19985 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__19985.meta)
};
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__19986 = this;
  return new cljs.core.Cons(null, o, coll)
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__19987 = this;
  return this__19987.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__19988 = this;
  if(this__19988.rest === null) {
    return cljs.core.List.EMPTY
  }else {
    return this__19988.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__19989 = this;
  return this__19989.meta
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__19990 = this;
  return new cljs.core.Cons(meta, this__19990.first, this__19990.rest)
};
cljs.core.Cons;
cljs.core.cons = function cons(x, seq) {
  return new cljs.core.Cons(null, x, seq)
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__19992 = null;
  var G__19992__2 = function(string, f) {
    return cljs.core.ci_reduce.__2(string, f)
  };
  var G__19992__3 = function(string, f, start) {
    return cljs.core.ci_reduce.__3(string, f, start)
  };
  G__19992 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__19992__2.call(this, string, f);
      case 3:
        return G__19992__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19992
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__19993 = null;
  var G__19993__2 = function(string, k) {
    return cljs.core._nth.__2(string, k)
  };
  var G__19993__3 = function(string, k, not_found) {
    return cljs.core._nth.__3(string, k, not_found)
  };
  G__19993 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19993__2.call(this, string, k);
      case 3:
        return G__19993__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19993
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__19994 = null;
  var G__19994__2 = function(string, n) {
    if(n < cljs.core._count(string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__19994__3 = function(string, n, not_found) {
    if(n < cljs.core._count(string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__19994 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__19994__2.call(this, string, n);
      case 3:
        return G__19994__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__19994
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
  var G__20003 = null;
  var G__20003__2 = function(tsym19997, coll) {
    var tsym19997__19999 = this;
    var this$__20000 = tsym19997__19999;
    return cljs.core.get.__2(coll, this$__20000.toString())
  };
  var G__20003__3 = function(tsym19998, coll, not_found) {
    var tsym19998__20001 = this;
    var this$__20002 = tsym19998__20001;
    return cljs.core.get.__3(coll, this$__20002.toString(), not_found)
  };
  G__20003 = function(tsym19998, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20003__2.call(this, tsym19998, coll);
      case 3:
        return G__20003__3.call(this, tsym19998, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20003
}();
String["prototype"]["apply"] = function(s, args) {
  if(cljs.core.count(args) < 2) {
    return cljs.core.get.__2(args[0], s)
  }else {
    return cljs.core.get.__3(args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__20005 = lazy_seq.x;
  if(cljs.core.truth_(lazy_seq.realized)) {
    return x__20005
  }else {
    lazy_seq.x = x__20005.call(null);
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
  var this__20007 = this;
  return cljs.core.seq(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__20008 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20009 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20010 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__20010.meta)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20011 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__20012 = this;
  return cljs.core.first(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__20013 = this;
  return cljs.core.rest(cljs.core.lazy_seq_value(coll))
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20014 = this;
  return this__20014.meta
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20015 = this;
  return new cljs.core.LazySeq(meta, this__20015.realized, this__20015.x)
};
cljs.core.LazySeq;
cljs.core.to_array = function to_array(s) {
  var ary__20016 = [];
  var s__20017 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.seq(s__20017))) {
      ary__20016.push(cljs.core.first(s__20017));
      var G__20019 = cljs.core.next(s__20017);
      s__20017 = G__20019;
      continue
    }else {
      return ary__20016
    }
    break
  }
};
cljs.core.bounded_count = function bounded_count(s, n) {
  var s__20020 = s;
  var i__20021 = n;
  var sum__20022 = 0;
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____20023 = i__20021 > 0;
      if(and__3698__auto____20023) {
        return cljs.core.seq(s__20020)
      }else {
        return and__3698__auto____20023
      }
    }())) {
      var G__20026 = cljs.core.next(s__20020);
      var G__20027 = i__20021 - 1;
      var G__20028 = sum__20022 + 1;
      s__20020 = G__20026;
      i__20021 = G__20027;
      sum__20022 = G__20028;
      continue
    }else {
      return sum__20022
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
      var s__20032 = cljs.core.seq(x);
      if(cljs.core.truth_(s__20032)) {
        return cljs.core.cons(cljs.core.first(s__20032), concat.call(null, cljs.core.rest(s__20032), y))
      }else {
        return y
      }
    })
  };
  var concat__3 = function() {
    var G__20036__delegate = function(x, y, zs) {
      var cat__20034 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__20033 = cljs.core.seq(xys);
          if(cljs.core.truth_(xys__20033)) {
            return cljs.core.cons(cljs.core.first(xys__20033), cat.call(null, cljs.core.rest(xys__20033), zs))
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first(zs), cljs.core.next(zs))
            }else {
              return null
            }
          }
        })
      };
      return cat__20034.call(null, concat.call(null, x, y), zs)
    };
    var G__20036 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__20036__delegate.call(this, x, y, zs)
    };
    G__20036.cljs$lang$maxFixedArity = 2;
    G__20036.cljs$lang$applyTo = function(arglist__20039) {
      var x = cljs.core.first(arglist__20039);
      var y = cljs.core.first(cljs.core.next(arglist__20039));
      var zs = cljs.core.rest(cljs.core.next(arglist__20039));
      return G__20036__delegate.call(this, x, y, zs)
    };
    return G__20036
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
    var G__20040__delegate = function(a, b, c, d, more) {
      return cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.spread(more)))))
    };
    var G__20040 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__20040__delegate.call(this, a, b, c, d, more)
    };
    G__20040.cljs$lang$maxFixedArity = 4;
    G__20040.cljs$lang$applyTo = function(arglist__20041) {
      var a = cljs.core.first(arglist__20041);
      var b = cljs.core.first(cljs.core.next(arglist__20041));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20041)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20041))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20041))));
      return G__20040__delegate.call(this, a, b, c, d, more)
    };
    return G__20040
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
    var fixed_arity__20042 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(args, fixed_arity__20042 + 1) <= fixed_arity__20042) {
        return f.apply(f, cljs.core.to_array(args))
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array(args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__20043 = cljs.core.list_STAR_.__2(x, args);
    var fixed_arity__20044 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__20043, fixed_arity__20044) <= fixed_arity__20044) {
        return f.apply(f, cljs.core.to_array(arglist__20043))
      }else {
        return f.cljs$lang$applyTo(arglist__20043)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__20043))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__20045 = cljs.core.list_STAR_.__3(x, y, args);
    var fixed_arity__20046 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__20045, fixed_arity__20046) <= fixed_arity__20046) {
        return f.apply(f, cljs.core.to_array(arglist__20045))
      }else {
        return f.cljs$lang$applyTo(arglist__20045)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__20045))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__20047 = cljs.core.list_STAR_.__4(x, y, z, args);
    var fixed_arity__20048 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      if(cljs.core.bounded_count(arglist__20047, fixed_arity__20048) <= fixed_arity__20048) {
        return f.apply(f, cljs.core.to_array(arglist__20047))
      }else {
        return f.cljs$lang$applyTo(arglist__20047)
      }
    }else {
      return f.apply(f, cljs.core.to_array(arglist__20047))
    }
  };
  var apply__6 = function() {
    var G__20059__delegate = function(f, a, b, c, d, args) {
      var arglist__20049 = cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.spread(args)))));
      var fixed_arity__20050 = f.cljs$lang$maxFixedArity;
      if(cljs.core.truth_(f.cljs$lang$applyTo)) {
        if(cljs.core.bounded_count(arglist__20049, fixed_arity__20050) <= fixed_arity__20050) {
          return f.apply(f, cljs.core.to_array(arglist__20049))
        }else {
          return f.cljs$lang$applyTo(arglist__20049)
        }
      }else {
        return f.apply(f, cljs.core.to_array(arglist__20049))
      }
    };
    var G__20059 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__20059__delegate.call(this, f, a, b, c, d, args)
    };
    G__20059.cljs$lang$maxFixedArity = 5;
    G__20059.cljs$lang$applyTo = function(arglist__20062) {
      var f = cljs.core.first(arglist__20062);
      var a = cljs.core.first(cljs.core.next(arglist__20062));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20062)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20062))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20062)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20062)))));
      return G__20059__delegate.call(this, f, a, b, c, d, args)
    };
    return G__20059
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
  vary_meta.cljs$lang$applyTo = function(arglist__20063) {
    var obj = cljs.core.first(arglist__20063);
    var f = cljs.core.first(cljs.core.next(arglist__20063));
    var args = cljs.core.rest(cljs.core.next(arglist__20063));
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
    var G__20064__delegate = function(x, y, more) {
      return cljs.core.not(cljs.core.apply.__4(cljs.core._EQ_, x, y, more))
    };
    var G__20064 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__20064__delegate.call(this, x, y, more)
    };
    G__20064.cljs$lang$maxFixedArity = 2;
    G__20064.cljs$lang$applyTo = function(arglist__20065) {
      var x = cljs.core.first(arglist__20065);
      var y = cljs.core.first(cljs.core.next(arglist__20065));
      var more = cljs.core.rest(cljs.core.next(arglist__20065));
      return G__20064__delegate.call(this, x, y, more)
    };
    return G__20064
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
        var G__20069 = pred;
        var G__20070 = cljs.core.next(coll);
        pred = G__20069;
        coll = G__20070;
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
      var or__3700__auto____20072 = pred.call(null, cljs.core.first(coll));
      if(cljs.core.truth_(or__3700__auto____20072)) {
        return or__3700__auto____20072
      }else {
        var G__20075 = pred;
        var G__20076 = cljs.core.next(coll);
        pred = G__20075;
        coll = G__20076;
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
    var G__20078 = null;
    var G__20078__0 = function() {
      return cljs.core.not(f.call(null))
    };
    var G__20078__1 = function(x) {
      return cljs.core.not(f.call(null, x))
    };
    var G__20078__2 = function(x, y) {
      return cljs.core.not(f.call(null, x, y))
    };
    var G__20078__3 = function() {
      var G__20079__delegate = function(x, y, zs) {
        return cljs.core.not(cljs.core.apply.__4(f, x, y, zs))
      };
      var G__20079 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__20079__delegate.call(this, x, y, zs)
      };
      G__20079.cljs$lang$maxFixedArity = 2;
      G__20079.cljs$lang$applyTo = function(arglist__20080) {
        var x = cljs.core.first(arglist__20080);
        var y = cljs.core.first(cljs.core.next(arglist__20080));
        var zs = cljs.core.rest(cljs.core.next(arglist__20080));
        return G__20079__delegate.call(this, x, y, zs)
      };
      return G__20079
    }();
    G__20078 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__20078__0.call(this);
        case 1:
          return G__20078__1.call(this, x);
        case 2:
          return G__20078__2.call(this, x, y);
        default:
          return G__20078__3.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__20078.cljs$lang$maxFixedArity = 2;
    G__20078.cljs$lang$applyTo = G__20078__3.cljs$lang$applyTo;
    return G__20078
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__20081__delegate = function(args) {
      return x
    };
    var G__20081 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__20081__delegate.call(this, args)
    };
    G__20081.cljs$lang$maxFixedArity = 0;
    G__20081.cljs$lang$applyTo = function(arglist__20082) {
      var args = cljs.core.seq(arglist__20082);
      return G__20081__delegate.call(this, args)
    };
    return G__20081
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
      var G__20086 = null;
      var G__20086__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__20086__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__20086__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__20086__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__20086__4 = function() {
        var G__20087__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.__5(g, x, y, z, args))
        };
        var G__20087 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20087__delegate.call(this, x, y, z, args)
        };
        G__20087.cljs$lang$maxFixedArity = 3;
        G__20087.cljs$lang$applyTo = function(arglist__20088) {
          var x = cljs.core.first(arglist__20088);
          var y = cljs.core.first(cljs.core.next(arglist__20088));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20088)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20088)));
          return G__20087__delegate.call(this, x, y, z, args)
        };
        return G__20087
      }();
      G__20086 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__20086__0.call(this);
          case 1:
            return G__20086__1.call(this, x);
          case 2:
            return G__20086__2.call(this, x, y);
          case 3:
            return G__20086__3.call(this, x, y, z);
          default:
            return G__20086__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20086.cljs$lang$maxFixedArity = 3;
      G__20086.cljs$lang$applyTo = G__20086__4.cljs$lang$applyTo;
      return G__20086
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__20089 = null;
      var G__20089__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__20089__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__20089__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__20089__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__20089__4 = function() {
        var G__20090__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.__5(h, x, y, z, args)))
        };
        var G__20090 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20090__delegate.call(this, x, y, z, args)
        };
        G__20090.cljs$lang$maxFixedArity = 3;
        G__20090.cljs$lang$applyTo = function(arglist__20091) {
          var x = cljs.core.first(arglist__20091);
          var y = cljs.core.first(cljs.core.next(arglist__20091));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20091)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20091)));
          return G__20090__delegate.call(this, x, y, z, args)
        };
        return G__20090
      }();
      G__20089 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__20089__0.call(this);
          case 1:
            return G__20089__1.call(this, x);
          case 2:
            return G__20089__2.call(this, x, y);
          case 3:
            return G__20089__3.call(this, x, y, z);
          default:
            return G__20089__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20089.cljs$lang$maxFixedArity = 3;
      G__20089.cljs$lang$applyTo = G__20089__4.cljs$lang$applyTo;
      return G__20089
    }()
  };
  var comp__4 = function() {
    var G__20092__delegate = function(f1, f2, f3, fs) {
      var fs__20083 = cljs.core.reverse(cljs.core.list_STAR_.__4(f1, f2, f3, fs));
      return function() {
        var G__20093__delegate = function(args) {
          var ret__20084 = cljs.core.apply.__2(cljs.core.first(fs__20083), args);
          var fs__20085 = cljs.core.next(fs__20083);
          while(true) {
            if(cljs.core.truth_(fs__20085)) {
              var G__20095 = cljs.core.first(fs__20085).call(null, ret__20084);
              var G__20096 = cljs.core.next(fs__20085);
              ret__20084 = G__20095;
              fs__20085 = G__20096;
              continue
            }else {
              return ret__20084
            }
            break
          }
        };
        var G__20093 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__20093__delegate.call(this, args)
        };
        G__20093.cljs$lang$maxFixedArity = 0;
        G__20093.cljs$lang$applyTo = function(arglist__20097) {
          var args = cljs.core.seq(arglist__20097);
          return G__20093__delegate.call(this, args)
        };
        return G__20093
      }()
    };
    var G__20092 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20092__delegate.call(this, f1, f2, f3, fs)
    };
    G__20092.cljs$lang$maxFixedArity = 3;
    G__20092.cljs$lang$applyTo = function(arglist__20098) {
      var f1 = cljs.core.first(arglist__20098);
      var f2 = cljs.core.first(cljs.core.next(arglist__20098));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20098)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20098)));
      return G__20092__delegate.call(this, f1, f2, f3, fs)
    };
    return G__20092
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
      var G__20099__delegate = function(args) {
        return cljs.core.apply.__3(f, arg1, args)
      };
      var G__20099 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__20099__delegate.call(this, args)
      };
      G__20099.cljs$lang$maxFixedArity = 0;
      G__20099.cljs$lang$applyTo = function(arglist__20100) {
        var args = cljs.core.seq(arglist__20100);
        return G__20099__delegate.call(this, args)
      };
      return G__20099
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__20101__delegate = function(args) {
        return cljs.core.apply.__4(f, arg1, arg2, args)
      };
      var G__20101 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__20101__delegate.call(this, args)
      };
      G__20101.cljs$lang$maxFixedArity = 0;
      G__20101.cljs$lang$applyTo = function(arglist__20102) {
        var args = cljs.core.seq(arglist__20102);
        return G__20101__delegate.call(this, args)
      };
      return G__20101
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__20103__delegate = function(args) {
        return cljs.core.apply.__5(f, arg1, arg2, arg3, args)
      };
      var G__20103 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__20103__delegate.call(this, args)
      };
      G__20103.cljs$lang$maxFixedArity = 0;
      G__20103.cljs$lang$applyTo = function(arglist__20104) {
        var args = cljs.core.seq(arglist__20104);
        return G__20103__delegate.call(this, args)
      };
      return G__20103
    }()
  };
  var partial__5 = function() {
    var G__20105__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__20106__delegate = function(args) {
          return cljs.core.apply.__5(f, arg1, arg2, arg3, cljs.core.concat.__2(more, args))
        };
        var G__20106 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__20106__delegate.call(this, args)
        };
        G__20106.cljs$lang$maxFixedArity = 0;
        G__20106.cljs$lang$applyTo = function(arglist__20107) {
          var args = cljs.core.seq(arglist__20107);
          return G__20106__delegate.call(this, args)
        };
        return G__20106
      }()
    };
    var G__20105 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__20105__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__20105.cljs$lang$maxFixedArity = 4;
    G__20105.cljs$lang$applyTo = function(arglist__20108) {
      var f = cljs.core.first(arglist__20108);
      var arg1 = cljs.core.first(cljs.core.next(arglist__20108));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20108)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20108))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20108))));
      return G__20105__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    return G__20105
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
      var G__20109 = null;
      var G__20109__1 = function(a) {
        return f.call(null, a === null ? x : a)
      };
      var G__20109__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b)
      };
      var G__20109__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b, c)
      };
      var G__20109__4 = function() {
        var G__20110__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b, c, ds)
        };
        var G__20110 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20110__delegate.call(this, a, b, c, ds)
        };
        G__20110.cljs$lang$maxFixedArity = 3;
        G__20110.cljs$lang$applyTo = function(arglist__20111) {
          var a = cljs.core.first(arglist__20111);
          var b = cljs.core.first(cljs.core.next(arglist__20111));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20111)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20111)));
          return G__20110__delegate.call(this, a, b, c, ds)
        };
        return G__20110
      }();
      G__20109 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__20109__1.call(this, a);
          case 2:
            return G__20109__2.call(this, a, b);
          case 3:
            return G__20109__3.call(this, a, b, c);
          default:
            return G__20109__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20109.cljs$lang$maxFixedArity = 3;
      G__20109.cljs$lang$applyTo = G__20109__4.cljs$lang$applyTo;
      return G__20109
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__20112 = null;
      var G__20112__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b === null ? y : b)
      };
      var G__20112__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b === null ? y : b, c)
      };
      var G__20112__4 = function() {
        var G__20113__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b === null ? y : b, c, ds)
        };
        var G__20113 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20113__delegate.call(this, a, b, c, ds)
        };
        G__20113.cljs$lang$maxFixedArity = 3;
        G__20113.cljs$lang$applyTo = function(arglist__20114) {
          var a = cljs.core.first(arglist__20114);
          var b = cljs.core.first(cljs.core.next(arglist__20114));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20114)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20114)));
          return G__20113__delegate.call(this, a, b, c, ds)
        };
        return G__20113
      }();
      G__20112 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__20112__2.call(this, a, b);
          case 3:
            return G__20112__3.call(this, a, b, c);
          default:
            return G__20112__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20112.cljs$lang$maxFixedArity = 3;
      G__20112.cljs$lang$applyTo = G__20112__4.cljs$lang$applyTo;
      return G__20112
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__20115 = null;
      var G__20115__2 = function(a, b) {
        return f.call(null, a === null ? x : a, b === null ? y : b)
      };
      var G__20115__3 = function(a, b, c) {
        return f.call(null, a === null ? x : a, b === null ? y : b, c === null ? z : c)
      };
      var G__20115__4 = function() {
        var G__20116__delegate = function(a, b, c, ds) {
          return cljs.core.apply.__5(f, a === null ? x : a, b === null ? y : b, c === null ? z : c, ds)
        };
        var G__20116 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20116__delegate.call(this, a, b, c, ds)
        };
        G__20116.cljs$lang$maxFixedArity = 3;
        G__20116.cljs$lang$applyTo = function(arglist__20117) {
          var a = cljs.core.first(arglist__20117);
          var b = cljs.core.first(cljs.core.next(arglist__20117));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20117)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20117)));
          return G__20116__delegate.call(this, a, b, c, ds)
        };
        return G__20116
      }();
      G__20115 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__20115__2.call(this, a, b);
          case 3:
            return G__20115__3.call(this, a, b, c);
          default:
            return G__20115__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20115.cljs$lang$maxFixedArity = 3;
      G__20115.cljs$lang$applyTo = G__20115__4.cljs$lang$applyTo;
      return G__20115
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
  var mapi__20120 = function mpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____20118 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20118)) {
        var s__20119 = temp__3850__auto____20118;
        return cljs.core.cons(f.call(null, idx, cljs.core.first(s__20119)), mpi.call(null, idx + 1, cljs.core.rest(s__20119)))
      }else {
        return null
      }
    })
  };
  return mapi__20120.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____20122 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20122)) {
      var s__20123 = temp__3850__auto____20122;
      var x__20124 = f.call(null, cljs.core.first(s__20123));
      if(x__20124 === null) {
        return keep.call(null, f, cljs.core.rest(s__20123))
      }else {
        return cljs.core.cons(x__20124, keep.call(null, f, cljs.core.rest(s__20123)))
      }
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__20136 = function kpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____20133 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20133)) {
        var s__20134 = temp__3850__auto____20133;
        var x__20135 = f.call(null, idx, cljs.core.first(s__20134));
        if(x__20135 === null) {
          return kpi.call(null, idx + 1, cljs.core.rest(s__20134))
        }else {
          return cljs.core.cons(x__20135, kpi.call(null, idx + 1, cljs.core.rest(s__20134)))
        }
      }else {
        return null
      }
    })
  };
  return keepi__20136.call(null, 0, coll)
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
          var and__3698__auto____20145 = p.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20145)) {
            return p.call(null, y)
          }else {
            return and__3698__auto____20145
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____20146 = p.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20146)) {
            var and__3698__auto____20147 = p.call(null, y);
            if(cljs.core.truth_(and__3698__auto____20147)) {
              return p.call(null, z)
            }else {
              return and__3698__auto____20147
            }
          }else {
            return and__3698__auto____20146
          }
        }())
      };
      var ep1__4 = function() {
        var G__20186__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____20148 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____20148)) {
              return cljs.core.every_QMARK_(p, args)
            }else {
              return and__3698__auto____20148
            }
          }())
        };
        var G__20186 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20186__delegate.call(this, x, y, z, args)
        };
        G__20186.cljs$lang$maxFixedArity = 3;
        G__20186.cljs$lang$applyTo = function(arglist__20188) {
          var x = cljs.core.first(arglist__20188);
          var y = cljs.core.first(cljs.core.next(arglist__20188));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20188)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20188)));
          return G__20186__delegate.call(this, x, y, z, args)
        };
        return G__20186
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
          var and__3698__auto____20149 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20149)) {
            return p2.call(null, x)
          }else {
            return and__3698__auto____20149
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____20150 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20150)) {
            var and__3698__auto____20151 = p1.call(null, y);
            if(cljs.core.truth_(and__3698__auto____20151)) {
              var and__3698__auto____20152 = p2.call(null, x);
              if(cljs.core.truth_(and__3698__auto____20152)) {
                return p2.call(null, y)
              }else {
                return and__3698__auto____20152
              }
            }else {
              return and__3698__auto____20151
            }
          }else {
            return and__3698__auto____20150
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____20153 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20153)) {
            var and__3698__auto____20154 = p1.call(null, y);
            if(cljs.core.truth_(and__3698__auto____20154)) {
              var and__3698__auto____20155 = p1.call(null, z);
              if(cljs.core.truth_(and__3698__auto____20155)) {
                var and__3698__auto____20156 = p2.call(null, x);
                if(cljs.core.truth_(and__3698__auto____20156)) {
                  var and__3698__auto____20157 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____20157)) {
                    return p2.call(null, z)
                  }else {
                    return and__3698__auto____20157
                  }
                }else {
                  return and__3698__auto____20156
                }
              }else {
                return and__3698__auto____20155
              }
            }else {
              return and__3698__auto____20154
            }
          }else {
            return and__3698__auto____20153
          }
        }())
      };
      var ep2__4 = function() {
        var G__20198__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____20158 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____20158)) {
              return cljs.core.every_QMARK_(function(p1__20127_SHARP_) {
                var and__3698__auto____20159 = p1.call(null, p1__20127_SHARP_);
                if(cljs.core.truth_(and__3698__auto____20159)) {
                  return p2.call(null, p1__20127_SHARP_)
                }else {
                  return and__3698__auto____20159
                }
              }, args)
            }else {
              return and__3698__auto____20158
            }
          }())
        };
        var G__20198 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20198__delegate.call(this, x, y, z, args)
        };
        G__20198.cljs$lang$maxFixedArity = 3;
        G__20198.cljs$lang$applyTo = function(arglist__20201) {
          var x = cljs.core.first(arglist__20201);
          var y = cljs.core.first(cljs.core.next(arglist__20201));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20201)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20201)));
          return G__20198__delegate.call(this, x, y, z, args)
        };
        return G__20198
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
          var and__3698__auto____20160 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20160)) {
            var and__3698__auto____20161 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____20161)) {
              return p3.call(null, x)
            }else {
              return and__3698__auto____20161
            }
          }else {
            return and__3698__auto____20160
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____20162 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20162)) {
            var and__3698__auto____20163 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____20163)) {
              var and__3698__auto____20164 = p3.call(null, x);
              if(cljs.core.truth_(and__3698__auto____20164)) {
                var and__3698__auto____20165 = p1.call(null, y);
                if(cljs.core.truth_(and__3698__auto____20165)) {
                  var and__3698__auto____20166 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____20166)) {
                    return p3.call(null, y)
                  }else {
                    return and__3698__auto____20166
                  }
                }else {
                  return and__3698__auto____20165
                }
              }else {
                return and__3698__auto____20164
              }
            }else {
              return and__3698__auto____20163
            }
          }else {
            return and__3698__auto____20162
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$(function() {
          var and__3698__auto____20167 = p1.call(null, x);
          if(cljs.core.truth_(and__3698__auto____20167)) {
            var and__3698__auto____20168 = p2.call(null, x);
            if(cljs.core.truth_(and__3698__auto____20168)) {
              var and__3698__auto____20169 = p3.call(null, x);
              if(cljs.core.truth_(and__3698__auto____20169)) {
                var and__3698__auto____20170 = p1.call(null, y);
                if(cljs.core.truth_(and__3698__auto____20170)) {
                  var and__3698__auto____20171 = p2.call(null, y);
                  if(cljs.core.truth_(and__3698__auto____20171)) {
                    var and__3698__auto____20172 = p3.call(null, y);
                    if(cljs.core.truth_(and__3698__auto____20172)) {
                      var and__3698__auto____20173 = p1.call(null, z);
                      if(cljs.core.truth_(and__3698__auto____20173)) {
                        var and__3698__auto____20174 = p2.call(null, z);
                        if(cljs.core.truth_(and__3698__auto____20174)) {
                          return p3.call(null, z)
                        }else {
                          return and__3698__auto____20174
                        }
                      }else {
                        return and__3698__auto____20173
                      }
                    }else {
                      return and__3698__auto____20172
                    }
                  }else {
                    return and__3698__auto____20171
                  }
                }else {
                  return and__3698__auto____20170
                }
              }else {
                return and__3698__auto____20169
              }
            }else {
              return and__3698__auto____20168
            }
          }else {
            return and__3698__auto____20167
          }
        }())
      };
      var ep3__4 = function() {
        var G__20217__delegate = function(x, y, z, args) {
          return cljs.core.boolean$(function() {
            var and__3698__auto____20175 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__3698__auto____20175)) {
              return cljs.core.every_QMARK_(function(p1__20128_SHARP_) {
                var and__3698__auto____20176 = p1.call(null, p1__20128_SHARP_);
                if(cljs.core.truth_(and__3698__auto____20176)) {
                  var and__3698__auto____20177 = p2.call(null, p1__20128_SHARP_);
                  if(cljs.core.truth_(and__3698__auto____20177)) {
                    return p3.call(null, p1__20128_SHARP_)
                  }else {
                    return and__3698__auto____20177
                  }
                }else {
                  return and__3698__auto____20176
                }
              }, args)
            }else {
              return and__3698__auto____20175
            }
          }())
        };
        var G__20217 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20217__delegate.call(this, x, y, z, args)
        };
        G__20217.cljs$lang$maxFixedArity = 3;
        G__20217.cljs$lang$applyTo = function(arglist__20221) {
          var x = cljs.core.first(arglist__20221);
          var y = cljs.core.first(cljs.core.next(arglist__20221));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20221)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20221)));
          return G__20217__delegate.call(this, x, y, z, args)
        };
        return G__20217
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
    var G__20222__delegate = function(p1, p2, p3, ps) {
      var ps__20178 = cljs.core.list_STAR_.__4(p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_(function(p1__20129_SHARP_) {
            return p1__20129_SHARP_.call(null, x)
          }, ps__20178)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_(function(p1__20130_SHARP_) {
            var and__3698__auto____20179 = p1__20130_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3698__auto____20179)) {
              return p1__20130_SHARP_.call(null, y)
            }else {
              return and__3698__auto____20179
            }
          }, ps__20178)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_(function(p1__20131_SHARP_) {
            var and__3698__auto____20180 = p1__20131_SHARP_.call(null, x);
            if(cljs.core.truth_(and__3698__auto____20180)) {
              var and__3698__auto____20181 = p1__20131_SHARP_.call(null, y);
              if(cljs.core.truth_(and__3698__auto____20181)) {
                return p1__20131_SHARP_.call(null, z)
              }else {
                return and__3698__auto____20181
              }
            }else {
              return and__3698__auto____20180
            }
          }, ps__20178)
        };
        var epn__4 = function() {
          var G__20226__delegate = function(x, y, z, args) {
            return cljs.core.boolean$(function() {
              var and__3698__auto____20182 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__3698__auto____20182)) {
                return cljs.core.every_QMARK_(function(p1__20132_SHARP_) {
                  return cljs.core.every_QMARK_(p1__20132_SHARP_, args)
                }, ps__20178)
              }else {
                return and__3698__auto____20182
              }
            }())
          };
          var G__20226 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__20226__delegate.call(this, x, y, z, args)
          };
          G__20226.cljs$lang$maxFixedArity = 3;
          G__20226.cljs$lang$applyTo = function(arglist__20228) {
            var x = cljs.core.first(arglist__20228);
            var y = cljs.core.first(cljs.core.next(arglist__20228));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20228)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20228)));
            return G__20226__delegate.call(this, x, y, z, args)
          };
          return G__20226
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
    var G__20222 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20222__delegate.call(this, p1, p2, p3, ps)
    };
    G__20222.cljs$lang$maxFixedArity = 3;
    G__20222.cljs$lang$applyTo = function(arglist__20229) {
      var p1 = cljs.core.first(arglist__20229);
      var p2 = cljs.core.first(cljs.core.next(arglist__20229));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20229)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20229)));
      return G__20222__delegate.call(this, p1, p2, p3, ps)
    };
    return G__20222
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
        var or__3700__auto____20231 = p.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20231)) {
          return or__3700__auto____20231
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__3700__auto____20232 = p.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20232)) {
          return or__3700__auto____20232
        }else {
          var or__3700__auto____20233 = p.call(null, y);
          if(cljs.core.truth_(or__3700__auto____20233)) {
            return or__3700__auto____20233
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__20272__delegate = function(x, y, z, args) {
          var or__3700__auto____20234 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____20234)) {
            return or__3700__auto____20234
          }else {
            return cljs.core.some(p, args)
          }
        };
        var G__20272 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20272__delegate.call(this, x, y, z, args)
        };
        G__20272.cljs$lang$maxFixedArity = 3;
        G__20272.cljs$lang$applyTo = function(arglist__20274) {
          var x = cljs.core.first(arglist__20274);
          var y = cljs.core.first(cljs.core.next(arglist__20274));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20274)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20274)));
          return G__20272__delegate.call(this, x, y, z, args)
        };
        return G__20272
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
        var or__3700__auto____20235 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20235)) {
          return or__3700__auto____20235
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__3700__auto____20236 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20236)) {
          return or__3700__auto____20236
        }else {
          var or__3700__auto____20237 = p1.call(null, y);
          if(cljs.core.truth_(or__3700__auto____20237)) {
            return or__3700__auto____20237
          }else {
            var or__3700__auto____20238 = p2.call(null, x);
            if(cljs.core.truth_(or__3700__auto____20238)) {
              return or__3700__auto____20238
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__3700__auto____20239 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20239)) {
          return or__3700__auto____20239
        }else {
          var or__3700__auto____20240 = p1.call(null, y);
          if(cljs.core.truth_(or__3700__auto____20240)) {
            return or__3700__auto____20240
          }else {
            var or__3700__auto____20241 = p1.call(null, z);
            if(cljs.core.truth_(or__3700__auto____20241)) {
              return or__3700__auto____20241
            }else {
              var or__3700__auto____20242 = p2.call(null, x);
              if(cljs.core.truth_(or__3700__auto____20242)) {
                return or__3700__auto____20242
              }else {
                var or__3700__auto____20243 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____20243)) {
                  return or__3700__auto____20243
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__20284__delegate = function(x, y, z, args) {
          var or__3700__auto____20244 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____20244)) {
            return or__3700__auto____20244
          }else {
            return cljs.core.some(function(p1__20139_SHARP_) {
              var or__3700__auto____20245 = p1.call(null, p1__20139_SHARP_);
              if(cljs.core.truth_(or__3700__auto____20245)) {
                return or__3700__auto____20245
              }else {
                return p2.call(null, p1__20139_SHARP_)
              }
            }, args)
          }
        };
        var G__20284 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20284__delegate.call(this, x, y, z, args)
        };
        G__20284.cljs$lang$maxFixedArity = 3;
        G__20284.cljs$lang$applyTo = function(arglist__20287) {
          var x = cljs.core.first(arglist__20287);
          var y = cljs.core.first(cljs.core.next(arglist__20287));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20287)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20287)));
          return G__20284__delegate.call(this, x, y, z, args)
        };
        return G__20284
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
        var or__3700__auto____20246 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20246)) {
          return or__3700__auto____20246
        }else {
          var or__3700__auto____20247 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____20247)) {
            return or__3700__auto____20247
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__3700__auto____20248 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20248)) {
          return or__3700__auto____20248
        }else {
          var or__3700__auto____20249 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____20249)) {
            return or__3700__auto____20249
          }else {
            var or__3700__auto____20250 = p3.call(null, x);
            if(cljs.core.truth_(or__3700__auto____20250)) {
              return or__3700__auto____20250
            }else {
              var or__3700__auto____20251 = p1.call(null, y);
              if(cljs.core.truth_(or__3700__auto____20251)) {
                return or__3700__auto____20251
              }else {
                var or__3700__auto____20252 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____20252)) {
                  return or__3700__auto____20252
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__3700__auto____20253 = p1.call(null, x);
        if(cljs.core.truth_(or__3700__auto____20253)) {
          return or__3700__auto____20253
        }else {
          var or__3700__auto____20254 = p2.call(null, x);
          if(cljs.core.truth_(or__3700__auto____20254)) {
            return or__3700__auto____20254
          }else {
            var or__3700__auto____20255 = p3.call(null, x);
            if(cljs.core.truth_(or__3700__auto____20255)) {
              return or__3700__auto____20255
            }else {
              var or__3700__auto____20256 = p1.call(null, y);
              if(cljs.core.truth_(or__3700__auto____20256)) {
                return or__3700__auto____20256
              }else {
                var or__3700__auto____20257 = p2.call(null, y);
                if(cljs.core.truth_(or__3700__auto____20257)) {
                  return or__3700__auto____20257
                }else {
                  var or__3700__auto____20258 = p3.call(null, y);
                  if(cljs.core.truth_(or__3700__auto____20258)) {
                    return or__3700__auto____20258
                  }else {
                    var or__3700__auto____20259 = p1.call(null, z);
                    if(cljs.core.truth_(or__3700__auto____20259)) {
                      return or__3700__auto____20259
                    }else {
                      var or__3700__auto____20260 = p2.call(null, z);
                      if(cljs.core.truth_(or__3700__auto____20260)) {
                        return or__3700__auto____20260
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
        var G__20303__delegate = function(x, y, z, args) {
          var or__3700__auto____20261 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__3700__auto____20261)) {
            return or__3700__auto____20261
          }else {
            return cljs.core.some(function(p1__20140_SHARP_) {
              var or__3700__auto____20262 = p1.call(null, p1__20140_SHARP_);
              if(cljs.core.truth_(or__3700__auto____20262)) {
                return or__3700__auto____20262
              }else {
                var or__3700__auto____20263 = p2.call(null, p1__20140_SHARP_);
                if(cljs.core.truth_(or__3700__auto____20263)) {
                  return or__3700__auto____20263
                }else {
                  return p3.call(null, p1__20140_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__20303 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20303__delegate.call(this, x, y, z, args)
        };
        G__20303.cljs$lang$maxFixedArity = 3;
        G__20303.cljs$lang$applyTo = function(arglist__20307) {
          var x = cljs.core.first(arglist__20307);
          var y = cljs.core.first(cljs.core.next(arglist__20307));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20307)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20307)));
          return G__20303__delegate.call(this, x, y, z, args)
        };
        return G__20303
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
    var G__20308__delegate = function(p1, p2, p3, ps) {
      var ps__20264 = cljs.core.list_STAR_.__4(p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some(function(p1__20141_SHARP_) {
            return p1__20141_SHARP_.call(null, x)
          }, ps__20264)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some(function(p1__20142_SHARP_) {
            var or__3700__auto____20265 = p1__20142_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3700__auto____20265)) {
              return or__3700__auto____20265
            }else {
              return p1__20142_SHARP_.call(null, y)
            }
          }, ps__20264)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some(function(p1__20143_SHARP_) {
            var or__3700__auto____20266 = p1__20143_SHARP_.call(null, x);
            if(cljs.core.truth_(or__3700__auto____20266)) {
              return or__3700__auto____20266
            }else {
              var or__3700__auto____20267 = p1__20143_SHARP_.call(null, y);
              if(cljs.core.truth_(or__3700__auto____20267)) {
                return or__3700__auto____20267
              }else {
                return p1__20143_SHARP_.call(null, z)
              }
            }
          }, ps__20264)
        };
        var spn__4 = function() {
          var G__20312__delegate = function(x, y, z, args) {
            var or__3700__auto____20268 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__3700__auto____20268)) {
              return or__3700__auto____20268
            }else {
              return cljs.core.some(function(p1__20144_SHARP_) {
                return cljs.core.some(p1__20144_SHARP_, args)
              }, ps__20264)
            }
          };
          var G__20312 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__20312__delegate.call(this, x, y, z, args)
          };
          G__20312.cljs$lang$maxFixedArity = 3;
          G__20312.cljs$lang$applyTo = function(arglist__20314) {
            var x = cljs.core.first(arglist__20314);
            var y = cljs.core.first(cljs.core.next(arglist__20314));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20314)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20314)));
            return G__20312__delegate.call(this, x, y, z, args)
          };
          return G__20312
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
    var G__20308 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20308__delegate.call(this, p1, p2, p3, ps)
    };
    G__20308.cljs$lang$maxFixedArity = 3;
    G__20308.cljs$lang$applyTo = function(arglist__20315) {
      var p1 = cljs.core.first(arglist__20315);
      var p2 = cljs.core.first(cljs.core.next(arglist__20315));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20315)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20315)));
      return G__20308__delegate.call(this, p1, p2, p3, ps)
    };
    return G__20308
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
      var temp__3850__auto____20316 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20316)) {
        var s__20317 = temp__3850__auto____20316;
        return cljs.core.cons(f.call(null, cljs.core.first(s__20317)), map.call(null, f, cljs.core.rest(s__20317)))
      }else {
        return null
      }
    })
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__20318 = cljs.core.seq(c1);
      var s2__20319 = cljs.core.seq(c2);
      if(cljs.core.truth_(function() {
        var and__3698__auto____20320 = s1__20318;
        if(cljs.core.truth_(and__3698__auto____20320)) {
          return s2__20319
        }else {
          return and__3698__auto____20320
        }
      }())) {
        return cljs.core.cons(f.call(null, cljs.core.first(s1__20318), cljs.core.first(s2__20319)), map.call(null, f, cljs.core.rest(s1__20318), cljs.core.rest(s2__20319)))
      }else {
        return null
      }
    })
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__20321 = cljs.core.seq(c1);
      var s2__20322 = cljs.core.seq(c2);
      var s3__20323 = cljs.core.seq(c3);
      if(cljs.core.truth_(function() {
        var and__3698__auto____20324 = s1__20321;
        if(cljs.core.truth_(and__3698__auto____20324)) {
          var and__3698__auto____20325 = s2__20322;
          if(cljs.core.truth_(and__3698__auto____20325)) {
            return s3__20323
          }else {
            return and__3698__auto____20325
          }
        }else {
          return and__3698__auto____20324
        }
      }())) {
        return cljs.core.cons(f.call(null, cljs.core.first(s1__20321), cljs.core.first(s2__20322), cljs.core.first(s3__20323)), map.call(null, f, cljs.core.rest(s1__20321), cljs.core.rest(s2__20322), cljs.core.rest(s3__20323)))
      }else {
        return null
      }
    })
  };
  var map__5 = function() {
    var G__20334__delegate = function(f, c1, c2, c3, colls) {
      var step__20327 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__20326 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.truth_(cljs.core.every_QMARK_(cljs.core.identity, ss__20326))) {
            return cljs.core.cons(map.call(null, cljs.core.first, ss__20326), step.call(null, map.call(null, cljs.core.rest, ss__20326)))
          }else {
            return null
          }
        })
      };
      return map.call(null, function(p1__20230_SHARP_) {
        return cljs.core.apply.__2(f, p1__20230_SHARP_)
      }, step__20327.call(null, cljs.core.conj(colls, c3, c2, c1)))
    };
    var G__20334 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__20334__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__20334.cljs$lang$maxFixedArity = 4;
    G__20334.cljs$lang$applyTo = function(arglist__20336) {
      var f = cljs.core.first(arglist__20336);
      var c1 = cljs.core.first(cljs.core.next(arglist__20336));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20336)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20336))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__20336))));
      return G__20334__delegate.call(this, f, c1, c2, c3, colls)
    };
    return G__20334
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
      var temp__3850__auto____20337 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20337)) {
        var s__20338 = temp__3850__auto____20337;
        return cljs.core.cons(cljs.core.first(s__20338), take.call(null, n - 1, cljs.core.rest(s__20338)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.drop = function drop(n, coll) {
  var step__20343 = function(n, coll) {
    while(true) {
      var s__20341 = cljs.core.seq(coll);
      if(cljs.core.truth_(function() {
        var and__3698__auto____20342 = n > 0;
        if(and__3698__auto____20342) {
          return s__20341
        }else {
          return and__3698__auto____20342
        }
      }())) {
        var G__20346 = n - 1;
        var G__20347 = cljs.core.rest(s__20341);
        n = G__20346;
        coll = G__20347;
        continue
      }else {
        return s__20341
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__20343.call(null, n, coll)
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
  var s__20348 = cljs.core.seq(coll);
  var lead__20349 = cljs.core.seq(cljs.core.drop(n, coll));
  while(true) {
    if(cljs.core.truth_(lead__20349)) {
      var G__20351 = cljs.core.next(s__20348);
      var G__20352 = cljs.core.next(lead__20349);
      s__20348 = G__20351;
      lead__20349 = G__20352;
      continue
    }else {
      return s__20348
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__20355 = function(pred, coll) {
    while(true) {
      var s__20353 = cljs.core.seq(coll);
      if(cljs.core.truth_(function() {
        var and__3698__auto____20354 = s__20353;
        if(cljs.core.truth_(and__3698__auto____20354)) {
          return pred.call(null, cljs.core.first(s__20353))
        }else {
          return and__3698__auto____20354
        }
      }())) {
        var G__20358 = pred;
        var G__20359 = cljs.core.rest(s__20353);
        pred = G__20358;
        coll = G__20359;
        continue
      }else {
        return s__20353
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__20355.call(null, pred, coll)
  })
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__3850__auto____20360 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20360)) {
      var s__20361 = temp__3850__auto____20360;
      return cljs.core.concat.__2(s__20361, cycle.call(null, s__20361))
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
      var s1__20363 = cljs.core.seq(c1);
      var s2__20364 = cljs.core.seq(c2);
      if(cljs.core.truth_(function() {
        var and__3698__auto____20365 = s1__20363;
        if(cljs.core.truth_(and__3698__auto____20365)) {
          return s2__20364
        }else {
          return and__3698__auto____20365
        }
      }())) {
        return cljs.core.cons(cljs.core.first(s1__20363), cljs.core.cons(cljs.core.first(s2__20364), interleave.call(null, cljs.core.rest(s1__20363), cljs.core.rest(s2__20364))))
      }else {
        return null
      }
    })
  };
  var interleave__3 = function() {
    var G__20369__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__20366 = cljs.core.map.__2(cljs.core.seq, cljs.core.conj(colls, c2, c1));
        if(cljs.core.truth_(cljs.core.every_QMARK_(cljs.core.identity, ss__20366))) {
          return cljs.core.concat.__2(cljs.core.map.__2(cljs.core.first, ss__20366), cljs.core.apply.__2(interleave, cljs.core.map.__2(cljs.core.rest, ss__20366)))
        }else {
          return null
        }
      })
    };
    var G__20369 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__20369__delegate.call(this, c1, c2, colls)
    };
    G__20369.cljs$lang$maxFixedArity = 2;
    G__20369.cljs$lang$applyTo = function(arglist__20371) {
      var c1 = cljs.core.first(arglist__20371);
      var c2 = cljs.core.first(cljs.core.next(arglist__20371));
      var colls = cljs.core.rest(cljs.core.next(arglist__20371));
      return G__20369__delegate.call(this, c1, c2, colls)
    };
    return G__20369
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
  var cat__20374 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__3847__auto____20372 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3847__auto____20372)) {
        var coll__20373 = temp__3847__auto____20372;
        return cljs.core.cons(cljs.core.first(coll__20373), cat.call(null, cljs.core.rest(coll__20373), colls))
      }else {
        if(cljs.core.truth_(cljs.core.seq(colls))) {
          return cat.call(null, cljs.core.first(colls), cljs.core.rest(colls))
        }else {
          return null
        }
      }
    })
  };
  return cat__20374.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1(cljs.core.map.__2(f, coll))
  };
  var mapcat__3 = function() {
    var G__20377__delegate = function(f, coll, colls) {
      return cljs.core.flatten1(cljs.core.apply.__4(cljs.core.map, f, coll, colls))
    };
    var G__20377 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__20377__delegate.call(this, f, coll, colls)
    };
    G__20377.cljs$lang$maxFixedArity = 2;
    G__20377.cljs$lang$applyTo = function(arglist__20378) {
      var f = cljs.core.first(arglist__20378);
      var coll = cljs.core.first(cljs.core.next(arglist__20378));
      var colls = cljs.core.rest(cljs.core.next(arglist__20378));
      return G__20377__delegate.call(this, f, coll, colls)
    };
    return G__20377
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
    var temp__3850__auto____20379 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20379)) {
      var s__20380 = temp__3850__auto____20379;
      var f__20381 = cljs.core.first(s__20380);
      var r__20382 = cljs.core.rest(s__20380);
      if(cljs.core.truth_(pred.call(null, f__20381))) {
        return cljs.core.cons(f__20381, filter.call(null, pred, r__20382))
      }else {
        return filter.call(null, pred, r__20382)
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
  var walk__20386 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.__2(walk, children.call(null, node)) : null)
    })
  };
  return walk__20386.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter(function(p1__20385_SHARP_) {
    return cljs.core.not(cljs.core.sequential_QMARK_(p1__20385_SHARP_))
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
      var temp__3850__auto____20387 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20387)) {
        var s__20388 = temp__3850__auto____20387;
        var p__20389 = cljs.core.take(n, s__20388);
        if(cljs.core.truth_(cljs.core._EQ_(n, cljs.core.count(p__20389)))) {
          return cljs.core.cons(p__20389, partition.call(null, n, step, cljs.core.drop(step, s__20388)))
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
      var temp__3850__auto____20390 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20390)) {
        var s__20391 = temp__3850__auto____20390;
        var p__20392 = cljs.core.take(n, s__20391);
        if(cljs.core.truth_(cljs.core._EQ_(n, cljs.core.count(p__20392)))) {
          return cljs.core.cons(p__20392, partition.call(null, n, step, pad, cljs.core.drop(step, s__20391)))
        }else {
          return cljs.core.list(cljs.core.take(n, cljs.core.concat.__2(p__20392, pad)))
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
    var sentinel__20397 = cljs.core.lookup_sentinel;
    var m__20398 = m;
    var ks__20399 = cljs.core.seq(ks);
    while(true) {
      if(cljs.core.truth_(ks__20399)) {
        var m__20400 = cljs.core.get.__3(m__20398, cljs.core.first(ks__20399), sentinel__20397);
        if(sentinel__20397 === m__20400) {
          return not_found
        }else {
          var G__20403 = sentinel__20397;
          var G__20404 = m__20400;
          var G__20405 = cljs.core.next(ks__20399);
          sentinel__20397 = G__20403;
          m__20398 = G__20404;
          ks__20399 = G__20405;
          continue
        }
      }else {
        return m__20398
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
cljs.core.assoc_in = function assoc_in(m, p__20406, v) {
  var vec__20407__20408 = p__20406;
  var k__20409 = cljs.core.nth.call(null, vec__20407__20408, 0, null);
  var ks__20410 = cljs.core.nthnext.call(null, vec__20407__20408, 1);
  if(cljs.core.truth_(ks__20410)) {
    return cljs.core.assoc.__3(m, k__20409, assoc_in.call(null, cljs.core.get.__2(m, k__20409), ks__20410, v))
  }else {
    return cljs.core.assoc.__3(m, k__20409, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__20412, f, args) {
    var vec__20413__20414 = p__20412;
    var k__20415 = cljs.core.nth.call(null, vec__20413__20414, 0, null);
    var ks__20416 = cljs.core.nthnext.call(null, vec__20413__20414, 1);
    if(cljs.core.truth_(ks__20416)) {
      return cljs.core.assoc.__3(m, k__20415, cljs.core.apply.__5(update_in, cljs.core.get.__2(m, k__20415), ks__20416, f, args))
    }else {
      return cljs.core.assoc.__3(m, k__20415, cljs.core.apply.__3(f, cljs.core.get.__2(m, k__20415), args))
    }
  };
  var update_in = function(m, p__20412, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__20412, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__20418) {
    var m = cljs.core.first(arglist__20418);
    var p__20412 = cljs.core.first(cljs.core.next(arglist__20418));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20418)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20418)));
    return update_in__delegate.call(this, m, p__20412, f, args)
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
  var this__20419 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__20420 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__20421 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__20422 = this;
  var new_array__20423 = cljs.core.aclone(this__20422.array);
  new_array__20423[k] = v;
  return new cljs.core.Vector(this__20422.meta, new_array__20423)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = function() {
  var G__20452 = null;
  var G__20452__2 = function(tsym20424, k) {
    var this__20426 = this;
    var tsym20424__20427 = this;
    var coll__20428 = tsym20424__20427;
    return cljs.core._lookup.__2(coll__20428, k)
  };
  var G__20452__3 = function(tsym20425, k, not_found) {
    var this__20429 = this;
    var tsym20425__20430 = this;
    var coll__20431 = tsym20425__20430;
    return cljs.core._lookup.__3(coll__20431, k, not_found)
  };
  G__20452 = function(tsym20425, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20452__2.call(this, tsym20425, k);
      case 3:
        return G__20452__3.call(this, tsym20425, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20452
}();
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20432 = this;
  var new_array__20433 = cljs.core.aclone(this__20432.array);
  new_array__20433.push(o);
  return new cljs.core.Vector(this__20432.meta, new_array__20433)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce__2 = function(v, f) {
  var this__20434 = this;
  return cljs.core.ci_reduce.__2(this__20434.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce__3 = function(v, f, start) {
  var this__20435 = this;
  return cljs.core.ci_reduce.__3(this__20435.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20436 = this;
  if(this__20436.array.length > 0) {
    var vector_seq__20437 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__20436.array.length) {
          return cljs.core.cons(this__20436.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__20437.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20438 = this;
  return this__20438.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__20439 = this;
  var count__20440 = this__20439.array.length;
  if(count__20440 > 0) {
    return this__20439.array[count__20440 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__20441 = this;
  if(this__20441.array.length > 0) {
    var new_array__20442 = cljs.core.aclone(this__20441.array);
    new_array__20442.pop();
    return new cljs.core.Vector(this__20441.meta, new_array__20442)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n__3 = function(coll, n, val) {
  var this__20443 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20444 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20445 = this;
  return new cljs.core.Vector(meta, this__20445.array)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20446 = this;
  return this__20446.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__20447 = this;
  if(function() {
    var and__3698__auto____20448 = 0 <= n;
    if(and__3698__auto____20448) {
      return n < this__20447.array.length
    }else {
      return and__3698__auto____20448
    }
  }()) {
    return this__20447.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__20450 = this;
  if(function() {
    var and__3698__auto____20451 = 0 <= n;
    if(and__3698__auto____20451) {
      return n < this__20450.array.length
    }else {
      return and__3698__auto____20451
    }
  }()) {
    return this__20450.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20449 = this;
  return cljs.core.with_meta(cljs.core.Vector.EMPTY, this__20449.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, []);
cljs.core.Vector.fromArray = function(xs) {
  return new cljs.core.Vector(null, xs)
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt__20461 = pv.cnt;
  if(cnt__20461 < 32) {
    return 0
  }else {
    return cnt__20461 - 1 >> 5 << 5
  }
};
cljs.core.new_path = function new_path(level, node) {
  var ll__20463 = level;
  var ret__20464 = node;
  while(true) {
    if(cljs.core.truth_(cljs.core._EQ_(0, ll__20463))) {
      return ret__20464
    }else {
      var embed__20465 = ret__20464;
      var r__20466 = cljs.core.aclone(cljs.core.PersistentVector.EMPTY_NODE);
      var ___20467 = r__20466[0] = embed__20465;
      var G__20469 = ll__20463 - 5;
      var G__20470 = r__20466;
      ll__20463 = G__20469;
      ret__20464 = G__20470;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__20471 = cljs.core.aclone(parent);
  var subidx__20472 = pv.cnt - 1 >> level & 31;
  if(cljs.core.truth_(cljs.core._EQ_(5, level))) {
    ret__20471[subidx__20472] = tailnode;
    return ret__20471
  }else {
    var temp__3847__auto____20473 = parent[subidx__20472];
    if(cljs.core.truth_(temp__3847__auto____20473)) {
      var child__20474 = temp__3847__auto____20473;
      var node_to_insert__20475 = push_tail.call(null, pv, level - 5, child__20474, tailnode);
      var ___20476 = ret__20471[subidx__20472] = node_to_insert__20475;
      return ret__20471
    }else {
      var node_to_insert__20477 = cljs.core.new_path(level - 5, tailnode);
      var ___20478 = ret__20471[subidx__20472] = node_to_insert__20477;
      return ret__20471
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__3698__auto____20481 = 0 <= i;
    if(and__3698__auto____20481) {
      return i < pv.cnt
    }else {
      return and__3698__auto____20481
    }
  }()) {
    if(i >= cljs.core.tail_off(pv)) {
      return pv.tail
    }else {
      var node__20482 = pv.root;
      var level__20483 = pv.shift;
      while(true) {
        if(level__20483 > 0) {
          var G__20488 = node__20482[i >> level__20483 & 31];
          var G__20489 = level__20483 - 5;
          node__20482 = G__20488;
          level__20483 = G__20489;
          continue
        }else {
          return node__20482
        }
        break
      }
    }
  }else {
    throw new Error(cljs.core.str("No item ", i, " in vector of length ", pv.cnt));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__20490 = cljs.core.aclone(node);
  if(level === 0) {
    ret__20490[i & 31] = val;
    return ret__20490
  }else {
    var subidx__20491 = i >> level & 31;
    var ___20492 = ret__20490[subidx__20491] = do_assoc.call(null, pv, level - 5, node[subidx__20491], i, val);
    return ret__20490
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__20494 = pv.cnt - 2 >> level & 31;
  if(level > 5) {
    var new_child__20495 = pop_tail.call(null, pv, level - 5, node[subidx__20494]);
    if(function() {
      var and__3698__auto____20496 = new_child__20495 === null;
      if(and__3698__auto____20496) {
        return subidx__20494 === 0
      }else {
        return and__3698__auto____20496
      }
    }()) {
      return null
    }else {
      var ret__20497 = cljs.core.aclone(node);
      var ___20498 = ret__20497[subidx__20494] = new_child__20495;
      return ret__20497
    }
  }else {
    if(subidx__20494 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__20499 = cljs.core.aclone(node);
        var ___20500 = ret__20499[subidx__20494] = null;
        return ret__20499
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
  var this__20506 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__20507 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__20508 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__20509 = this;
  if(function() {
    var and__3698__auto____20510 = 0 <= k;
    if(and__3698__auto____20510) {
      return k < this__20509.cnt
    }else {
      return and__3698__auto____20510
    }
  }()) {
    if(cljs.core.tail_off(coll) <= k) {
      var new_tail__20511 = cljs.core.aclone(this__20509.tail);
      new_tail__20511[k & 31] = v;
      return new cljs.core.PersistentVector(this__20509.meta, this__20509.cnt, this__20509.shift, this__20509.root, new_tail__20511)
    }else {
      return new cljs.core.PersistentVector(this__20509.meta, this__20509.cnt, this__20509.shift, cljs.core.do_assoc(coll, this__20509.shift, this__20509.root, k, v), this__20509.tail)
    }
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(k, this__20509.cnt))) {
      return cljs.core._conj(coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error(cljs.core.str("Index ", k, " out of bounds  [0,", this__20509.cnt, "]"));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = function() {
  var G__20551 = null;
  var G__20551__2 = function(tsym20512, k) {
    var this__20514 = this;
    var tsym20512__20515 = this;
    var coll__20516 = tsym20512__20515;
    return cljs.core._lookup.__2(coll__20516, k)
  };
  var G__20551__3 = function(tsym20513, k, not_found) {
    var this__20517 = this;
    var tsym20513__20518 = this;
    var coll__20519 = tsym20513__20518;
    return cljs.core._lookup.__3(coll__20519, k, not_found)
  };
  G__20551 = function(tsym20513, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20551__2.call(this, tsym20513, k);
      case 3:
        return G__20551__3.call(this, tsym20513, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20551
}();
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20520 = this;
  if(this__20520.cnt - cljs.core.tail_off(coll) < 32) {
    var new_tail__20521 = cljs.core.aclone(this__20520.tail);
    new_tail__20521.push(o);
    return new cljs.core.PersistentVector(this__20520.meta, this__20520.cnt + 1, this__20520.shift, this__20520.root, new_tail__20521)
  }else {
    var root_overflow_QMARK___20522 = this__20520.cnt >> 5 > 1 << this__20520.shift;
    var new_shift__20523 = root_overflow_QMARK___20522 ? this__20520.shift + 5 : this__20520.shift;
    var new_root__20525 = root_overflow_QMARK___20522 ? function() {
      var n_r__20524 = cljs.core.aclone(cljs.core.PersistentVector.EMPTY_NODE);
      n_r__20524[0] = this__20520.root;
      n_r__20524[1] = cljs.core.new_path(this__20520.shift, this__20520.tail);
      return n_r__20524
    }() : cljs.core.push_tail(coll, this__20520.shift, this__20520.root, this__20520.tail);
    return new cljs.core.PersistentVector(this__20520.meta, this__20520.cnt + 1, new_shift__20523, new_root__20525, [o])
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce__2 = function(v, f) {
  var this__20526 = this;
  return cljs.core.ci_reduce.__2(v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce__3 = function(v, f, start) {
  var this__20527 = this;
  return cljs.core.ci_reduce.__3(v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20528 = this;
  if(this__20528.cnt > 0) {
    var vector_seq__20529 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__20528.cnt) {
          return cljs.core.cons(cljs.core._nth.__2(coll, i), vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__20529.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20530 = this;
  return this__20530.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__20531 = this;
  if(this__20531.cnt > 0) {
    return cljs.core._nth.__2(coll, this__20531.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__20532 = this;
  if(this__20532.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(1, this__20532.cnt))) {
      return cljs.core._with_meta(cljs.core.PersistentVector.EMPTY, this__20532.meta)
    }else {
      if(1 < this__20532.cnt - cljs.core.tail_off(coll)) {
        return new cljs.core.PersistentVector(this__20532.meta, this__20532.cnt - 1, this__20532.shift, this__20532.root, cljs.core.aclone(this__20532.tail))
      }else {
        if("\ufdd0'else") {
          var new_tail__20533 = cljs.core.array_for(coll, this__20532.cnt - 2);
          var nr__20534 = cljs.core.pop_tail(this__20532.shift, this__20532.root);
          var new_root__20535 = nr__20534 === null ? cljs.core.PersistentVector.EMPTY_NODE : nr__20534;
          var cnt_1__20536 = this__20532.cnt - 1;
          if(function() {
            var and__3698__auto____20537 = 5 < this__20532.shift;
            if(and__3698__auto____20537) {
              return new_root__20535[1] === null
            }else {
              return and__3698__auto____20537
            }
          }()) {
            return new cljs.core.PersistentVector(this__20532.meta, cnt_1__20536, this__20532.shift - 5, new_root__20535[0], new_tail__20533)
          }else {
            return new cljs.core.PersistentVector(this__20532.meta, cnt_1__20536, this__20532.shift, new_root__20535, new_tail__20533)
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
  var this__20538 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20539 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20540 = this;
  return new cljs.core.PersistentVector(meta, this__20540.cnt, this__20540.shift, this__20540.root, this__20540.tail)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20541 = this;
  return this__20541.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__20542 = this;
  return cljs.core.array_for(coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__20544 = this;
  if(function() {
    var and__3698__auto____20545 = 0 <= n;
    if(and__3698__auto____20545) {
      return n < this__20544.cnt
    }else {
      return and__3698__auto____20545
    }
  }()) {
    return cljs.core._nth.__2(coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20543 = this;
  return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY, this__20543.meta)
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
  vector.cljs$lang$applyTo = function(arglist__20564) {
    var args = cljs.core.seq(arglist__20564);
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
  var this__20565 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__20566 = this;
  return cljs.core._nth.__3(coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__20567 = this;
  return cljs.core._nth.__3(coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, key, val) {
  var this__20568 = this;
  var v_pos__20569 = this__20568.start + key;
  return new cljs.core.Subvec(this__20568.meta, cljs.core._assoc(this__20568.v, v_pos__20569, val), this__20568.start, this__20568.end > v_pos__20569 + 1 ? this__20568.end : v_pos__20569 + 1)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = function() {
  var G__20593 = null;
  var G__20593__2 = function(tsym20570, k) {
    var this__20572 = this;
    var tsym20570__20573 = this;
    var coll__20574 = tsym20570__20573;
    return cljs.core._lookup.__2(coll__20574, k)
  };
  var G__20593__3 = function(tsym20571, k, not_found) {
    var this__20575 = this;
    var tsym20571__20576 = this;
    var coll__20577 = tsym20571__20576;
    return cljs.core._lookup.__3(coll__20577, k, not_found)
  };
  G__20593 = function(tsym20571, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20593__2.call(this, tsym20571, k);
      case 3:
        return G__20593__3.call(this, tsym20571, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20593
}();
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20578 = this;
  return new cljs.core.Subvec(this__20578.meta, cljs.core._assoc_n(this__20578.v, this__20578.end, o), this__20578.start, this__20578.end + 1)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce__2 = function(coll, f) {
  var this__20579 = this;
  return cljs.core.ci_reduce.__2(coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce__3 = function(coll, f, start) {
  var this__20580 = this;
  return cljs.core.ci_reduce.__3(coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20581 = this;
  var subvec_seq__20582 = function subvec_seq(i) {
    if(cljs.core.truth_(cljs.core._EQ_(i, this__20581.end))) {
      return null
    }else {
      return cljs.core.cons(cljs.core._nth.__2(this__20581.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }))
    }
  };
  return subvec_seq__20582.call(null, this__20581.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20583 = this;
  return this__20583.end - this__20583.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__20584 = this;
  return cljs.core._nth.__2(this__20584.v, this__20584.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__20585 = this;
  if(cljs.core.truth_(cljs.core._EQ_(this__20585.start, this__20585.end))) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__20585.meta, this__20585.v, this__20585.start, this__20585.end - 1)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n__3 = function(coll, n, val) {
  var this__20586 = this;
  return cljs.core._assoc(coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20587 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20588 = this;
  return new cljs.core.Subvec(meta, this__20588.v, this__20588.start, this__20588.end)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20589 = this;
  return this__20589.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth__2 = function(coll, n) {
  var this__20590 = this;
  return cljs.core._nth.__2(this__20590.v, this__20590.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth__3 = function(coll, n, not_found) {
  var this__20592 = this;
  return cljs.core._nth.__3(this__20592.v, this__20592.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20591 = this;
  return cljs.core.with_meta(cljs.core.Vector.EMPTY, this__20591.meta)
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
  var this__20596 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash__1 = function(coll) {
  var this__20597 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20598 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20599 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__20599.meta)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20600 = this;
  return cljs.core.cons(o, coll)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__20601 = this;
  return cljs.core._first(this__20601.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__20602 = this;
  var temp__3847__auto____20603 = cljs.core.next(this__20602.front);
  if(cljs.core.truth_(temp__3847__auto____20603)) {
    var f1__20604 = temp__3847__auto____20603;
    return new cljs.core.PersistentQueueSeq(this__20602.meta, f1__20604, this__20602.rear)
  }else {
    if(this__20602.rear === null) {
      return cljs.core._empty(coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__20602.meta, this__20602.rear, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20605 = this;
  return this__20605.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20606 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__20606.front, this__20606.rear)
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
  var this__20609 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20610 = this;
  if(cljs.core.truth_(this__20610.front)) {
    return new cljs.core.PersistentQueue(this__20610.meta, this__20610.count + 1, this__20610.front, cljs.core.conj.__2(function() {
      var or__3700__auto____20611 = this__20610.rear;
      if(cljs.core.truth_(or__3700__auto____20611)) {
        return or__3700__auto____20611
      }else {
        return cljs.core.PersistentVector.fromArray([])
      }
    }(), o))
  }else {
    return new cljs.core.PersistentQueue(this__20610.meta, this__20610.count + 1, cljs.core.conj.__2(this__20610.front, o), cljs.core.PersistentVector.fromArray([]))
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20612 = this;
  var rear__20613 = cljs.core.seq(this__20612.rear);
  if(cljs.core.truth_(function() {
    var or__3700__auto____20614 = this__20612.front;
    if(cljs.core.truth_(or__3700__auto____20614)) {
      return or__3700__auto____20614
    }else {
      return rear__20613
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__20612.front, cljs.core.seq(rear__20613))
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20615 = this;
  return this__20615.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek__1 = function(coll) {
  var this__20616 = this;
  return cljs.core._first(this__20616.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop__1 = function(coll) {
  var this__20617 = this;
  if(cljs.core.truth_(this__20617.front)) {
    var temp__3847__auto____20618 = cljs.core.next(this__20617.front);
    if(cljs.core.truth_(temp__3847__auto____20618)) {
      var f1__20619 = temp__3847__auto____20618;
      return new cljs.core.PersistentQueue(this__20617.meta, this__20617.count - 1, f1__20619, this__20617.rear)
    }else {
      return new cljs.core.PersistentQueue(this__20617.meta, this__20617.count - 1, cljs.core.seq(this__20617.rear), cljs.core.PersistentVector.fromArray([]))
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first__1 = function(coll) {
  var this__20620 = this;
  return cljs.core.first(this__20620.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest__1 = function(coll) {
  var this__20621 = this;
  return cljs.core.rest(cljs.core.seq(coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20622 = this;
  return cljs.core.equiv_sequential(coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20623 = this;
  return new cljs.core.PersistentQueue(meta, this__20623.count, this__20623.front, this__20623.rear)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20624 = this;
  return this__20624.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20625 = this;
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
  var this__20632 = this;
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
  var len__20633 = array.length;
  var i__20634 = 0;
  while(true) {
    if(i__20634 < len__20633) {
      if(cljs.core.truth_(cljs.core._EQ_(k, array[i__20634]))) {
        return i__20634
      }else {
        var G__20637 = i__20634 + incr;
        i__20634 = G__20637;
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
      var and__3698__auto____20638 = goog.isString.call(null, k);
      if(cljs.core.truth_(and__3698__auto____20638)) {
        return strobj.hasOwnProperty(k)
      }else {
        return and__3698__auto____20638
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
  var a__20642 = cljs.core.hash(a);
  var b__20643 = cljs.core.hash(b);
  if(a__20642 < b__20643) {
    return-1
  }else {
    if(a__20642 > b__20643) {
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
  var this__20647 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__20648 = this;
  return cljs.core._lookup.__3(coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__20649 = this;
  return cljs.core.obj_map_contains_key_QMARK_.__4(k, this__20649.strobj, this__20649.strobj[k], not_found)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__20650 = this;
  if(cljs.core.truth_(goog.isString.call(null, k))) {
    var new_strobj__20651 = goog.object.clone.call(null, this__20650.strobj);
    var overwrite_QMARK___20652 = new_strobj__20651.hasOwnProperty(k);
    new_strobj__20651[k] = v;
    if(cljs.core.truth_(overwrite_QMARK___20652)) {
      return new cljs.core.ObjMap(this__20650.meta, this__20650.keys, new_strobj__20651)
    }else {
      var new_keys__20653 = cljs.core.aclone(this__20650.keys);
      new_keys__20653.push(k);
      return new cljs.core.ObjMap(this__20650.meta, new_keys__20653, new_strobj__20651)
    }
  }else {
    return cljs.core.with_meta(cljs.core.into(cljs.core.hash_map(k, v), cljs.core.seq(coll)), this__20650.meta)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK___2 = function(coll, k) {
  var this__20654 = this;
  return cljs.core.obj_map_contains_key_QMARK_.__2(k, this__20654.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = function() {
  var G__20676 = null;
  var G__20676__2 = function(tsym20655, k) {
    var this__20657 = this;
    var tsym20655__20658 = this;
    var coll__20659 = tsym20655__20658;
    return cljs.core._lookup.__2(coll__20659, k)
  };
  var G__20676__3 = function(tsym20656, k, not_found) {
    var this__20660 = this;
    var tsym20656__20661 = this;
    var coll__20662 = tsym20656__20661;
    return cljs.core._lookup.__3(coll__20662, k, not_found)
  };
  G__20676 = function(tsym20656, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20676__2.call(this, tsym20656, k);
      case 3:
        return G__20676__3.call(this, tsym20656, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20676
}();
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj__2 = function(coll, entry) {
  var this__20663 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_(entry))) {
    return cljs.core._assoc(coll, cljs.core._nth.__2(entry, 0), cljs.core._nth.__2(entry, 1))
  }else {
    return cljs.core.reduce.__3(cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20664 = this;
  if(this__20664.keys.length > 0) {
    return cljs.core.map.__2(function(p1__20641_SHARP_) {
      return cljs.core.vector(p1__20641_SHARP_, this__20664.strobj[p1__20641_SHARP_])
    }, this__20664.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20665 = this;
  return this__20665.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20666 = this;
  return cljs.core.equiv_map(coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20667 = this;
  return new cljs.core.ObjMap(meta, this__20667.keys, this__20667.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20668 = this;
  return this__20668.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20669 = this;
  return cljs.core.with_meta(cljs.core.ObjMap.EMPTY, this__20669.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc__2 = function(coll, k) {
  var this__20670 = this;
  if(cljs.core.truth_(function() {
    var and__3698__auto____20671 = goog.isString.call(null, k);
    if(cljs.core.truth_(and__3698__auto____20671)) {
      return this__20670.strobj.hasOwnProperty(k)
    }else {
      return and__3698__auto____20671
    }
  }())) {
    var new_keys__20672 = cljs.core.aclone(this__20670.keys);
    var new_strobj__20673 = goog.object.clone.call(null, this__20670.strobj);
    new_keys__20672.splice(cljs.core.scan_array(1, k, new_keys__20672), 1);
    cljs.core.js_delete(new_strobj__20673, k);
    return new cljs.core.ObjMap(this__20670.meta, new_keys__20672, new_strobj__20673)
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
  var this__20682 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup__2 = function(coll, k) {
  var this__20683 = this;
  return cljs.core._lookup.__3(coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup__3 = function(coll, k, not_found) {
  var this__20684 = this;
  var bucket__20685 = this__20684.hashobj[cljs.core.hash(k)];
  var i__20686 = cljs.core.truth_(bucket__20685) ? cljs.core.scan_array(2, k, bucket__20685) : null;
  if(cljs.core.truth_(i__20686)) {
    return bucket__20685[i__20686 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc__3 = function(coll, k, v) {
  var this__20687 = this;
  var h__20688 = cljs.core.hash(k);
  var bucket__20689 = this__20687.hashobj[h__20688];
  if(cljs.core.truth_(bucket__20689)) {
    var new_bucket__20690 = cljs.core.aclone(bucket__20689);
    var new_hashobj__20691 = goog.object.clone.call(null, this__20687.hashobj);
    new_hashobj__20691[h__20688] = new_bucket__20690;
    var temp__3847__auto____20692 = cljs.core.scan_array(2, k, new_bucket__20690);
    if(cljs.core.truth_(temp__3847__auto____20692)) {
      var i__20693 = temp__3847__auto____20692;
      new_bucket__20690[i__20693 + 1] = v;
      return new cljs.core.HashMap(this__20687.meta, this__20687.count, new_hashobj__20691)
    }else {
      new_bucket__20690.push(k, v);
      return new cljs.core.HashMap(this__20687.meta, this__20687.count + 1, new_hashobj__20691)
    }
  }else {
    var new_hashobj__20694 = goog.object.clone.call(null, this__20687.hashobj);
    new_hashobj__20694[h__20688] = [k, v];
    return new cljs.core.HashMap(this__20687.meta, this__20687.count + 1, new_hashobj__20694)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK___2 = function(coll, k) {
  var this__20695 = this;
  var bucket__20696 = this__20695.hashobj[cljs.core.hash(k)];
  var i__20697 = cljs.core.truth_(bucket__20696) ? cljs.core.scan_array(2, k, bucket__20696) : null;
  if(cljs.core.truth_(i__20697)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = function() {
  var G__20724 = null;
  var G__20724__2 = function(tsym20698, k) {
    var this__20700 = this;
    var tsym20698__20701 = this;
    var coll__20702 = tsym20698__20701;
    return cljs.core._lookup.__2(coll__20702, k)
  };
  var G__20724__3 = function(tsym20699, k, not_found) {
    var this__20703 = this;
    var tsym20699__20704 = this;
    var coll__20705 = tsym20699__20704;
    return cljs.core._lookup.__3(coll__20705, k, not_found)
  };
  G__20724 = function(tsym20699, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20724__2.call(this, tsym20699, k);
      case 3:
        return G__20724__3.call(this, tsym20699, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20724
}();
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj__2 = function(coll, entry) {
  var this__20706 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_(entry))) {
    return cljs.core._assoc(coll, cljs.core._nth.__2(entry, 0), cljs.core._nth.__2(entry, 1))
  }else {
    return cljs.core.reduce.__3(cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20707 = this;
  if(this__20707.count > 0) {
    var hashes__20708 = cljs.core.js_keys(this__20707.hashobj).sort();
    return cljs.core.mapcat.__2(function(p1__20681_SHARP_) {
      return cljs.core.map.__2(cljs.core.vec, cljs.core.partition.__2(2, this__20707.hashobj[p1__20681_SHARP_]))
    }, hashes__20708)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20709 = this;
  return this__20709.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20710 = this;
  return cljs.core.equiv_map(coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20711 = this;
  return new cljs.core.HashMap(meta, this__20711.count, this__20711.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20712 = this;
  return this__20712.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20713 = this;
  return cljs.core.with_meta(cljs.core.HashMap.EMPTY, this__20713.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc__2 = function(coll, k) {
  var this__20714 = this;
  var h__20715 = cljs.core.hash(k);
  var bucket__20716 = this__20714.hashobj[h__20715];
  var i__20717 = cljs.core.truth_(bucket__20716) ? cljs.core.scan_array(2, k, bucket__20716) : null;
  if(cljs.core.truth_(cljs.core.not(i__20717))) {
    return coll
  }else {
    var new_hashobj__20718 = goog.object.clone.call(null, this__20714.hashobj);
    if(3 > bucket__20716.length) {
      cljs.core.js_delete(new_hashobj__20718, h__20715)
    }else {
      var new_bucket__20719 = cljs.core.aclone(bucket__20716);
      new_bucket__20719.splice(i__20717, 2);
      new_hashobj__20718[h__20715] = new_bucket__20719
    }
    return new cljs.core.HashMap(this__20714.meta, this__20714.count - 1, new_hashobj__20718)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj());
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__20729 = ks.length;
  var i__20730 = 0;
  var out__20731 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__20730 < len__20729) {
      var G__20733 = i__20730 + 1;
      var G__20734 = cljs.core.assoc.__3(out__20731, ks[i__20730], vs[i__20730]);
      i__20730 = G__20733;
      out__20731 = G__20734;
      continue
    }else {
      return out__20731
    }
    break
  }
};
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$__20735 = cljs.core.seq(keyvals);
    var out__20736 = cljs.core.HashMap.EMPTY;
    while(true) {
      if(cljs.core.truth_(in$__20735)) {
        var G__20738 = cljs.core.nnext(in$__20735);
        var G__20739 = cljs.core.assoc.__3(out__20736, cljs.core.first(in$__20735), cljs.core.second(in$__20735));
        in$__20735 = G__20738;
        out__20736 = G__20739;
        continue
      }else {
        return out__20736
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
  hash_map.cljs$lang$applyTo = function(arglist__20740) {
    var keyvals = cljs.core.seq(arglist__20740);
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
      return cljs.core.reduce.__2(function(p1__20741_SHARP_, p2__20742_SHARP_) {
        return cljs.core.conj.__2(function() {
          var or__3700__auto____20743 = p1__20741_SHARP_;
          if(cljs.core.truth_(or__3700__auto____20743)) {
            return or__3700__auto____20743
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), p2__20742_SHARP_)
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
  merge.cljs$lang$applyTo = function(arglist__20746) {
    var maps = cljs.core.seq(arglist__20746);
    return merge__delegate.call(this, maps)
  };
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some(cljs.core.identity, maps))) {
      var merge_entry__20749 = function(m, e) {
        var k__20747 = cljs.core.first(e);
        var v__20748 = cljs.core.second(e);
        if(cljs.core.truth_(cljs.core.contains_QMARK_(m, k__20747))) {
          return cljs.core.assoc.__3(m, k__20747, f.call(null, cljs.core.get.__2(m, k__20747), v__20748))
        }else {
          return cljs.core.assoc.__3(m, k__20747, v__20748)
        }
      };
      var merge2__20751 = function(m1, m2) {
        return cljs.core.reduce.__3(merge_entry__20749, function() {
          var or__3700__auto____20750 = m1;
          if(cljs.core.truth_(or__3700__auto____20750)) {
            return or__3700__auto____20750
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), cljs.core.seq(m2))
      };
      return cljs.core.reduce.__2(merge2__20751, maps)
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
  merge_with.cljs$lang$applyTo = function(arglist__20755) {
    var f = cljs.core.first(arglist__20755);
    var maps = cljs.core.rest(arglist__20755);
    return merge_with__delegate.call(this, f, maps)
  };
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__20757 = cljs.core.ObjMap.fromObject([], {});
  var keys__20758 = cljs.core.seq(keyseq);
  while(true) {
    if(cljs.core.truth_(keys__20758)) {
      var key__20759 = cljs.core.first(keys__20758);
      var entry__20760 = cljs.core.get.__3(map, key__20759, "\ufdd0'user/not-found");
      var G__20762 = cljs.core.truth_(cljs.core.not_EQ_.__2(entry__20760, "\ufdd0'user/not-found")) ? cljs.core.assoc.__3(ret__20757, key__20759, entry__20760) : ret__20757;
      var G__20763 = cljs.core.next(keys__20758);
      ret__20757 = G__20762;
      keys__20758 = G__20763;
      continue
    }else {
      return ret__20757
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
  var this__20764 = this;
  return cljs.core.hash_coll(coll)
};
cljs.core.Set.prototype.cljs$core$ILookup$ = true;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup__2 = function(coll, v) {
  var this__20765 = this;
  return cljs.core._lookup.__3(coll, v, null)
};
cljs.core.Set.prototype.cljs$core$ILookup$_lookup__3 = function(coll, v, not_found) {
  var this__20766 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_(this__20766.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.Set.prototype.cljs$core$IFn$ = true;
cljs.core.Set.prototype.call = function() {
  var G__20786 = null;
  var G__20786__2 = function(tsym20767, k) {
    var this__20769 = this;
    var tsym20767__20770 = this;
    var coll__20771 = tsym20767__20770;
    return cljs.core._lookup.__2(coll__20771, k)
  };
  var G__20786__3 = function(tsym20768, k, not_found) {
    var this__20772 = this;
    var tsym20768__20773 = this;
    var coll__20774 = tsym20768__20773;
    return cljs.core._lookup.__3(coll__20774, k, not_found)
  };
  G__20786 = function(tsym20768, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__20786__2.call(this, tsym20768, k);
      case 3:
        return G__20786__3.call(this, tsym20768, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__20786
}();
cljs.core.Set.prototype.cljs$core$ICollection$ = true;
cljs.core.Set.prototype.cljs$core$ICollection$_conj__2 = function(coll, o) {
  var this__20775 = this;
  return new cljs.core.Set(this__20775.meta, cljs.core.assoc.__3(this__20775.hash_map, o, null))
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = true;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq__1 = function(coll) {
  var this__20776 = this;
  return cljs.core.keys(this__20776.hash_map)
};
cljs.core.Set.prototype.cljs$core$ISet$ = true;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin__2 = function(coll, v) {
  var this__20777 = this;
  return new cljs.core.Set(this__20777.meta, cljs.core.dissoc.__2(this__20777.hash_map, v))
};
cljs.core.Set.prototype.cljs$core$ICounted$ = true;
cljs.core.Set.prototype.cljs$core$ICounted$_count__1 = function(coll) {
  var this__20778 = this;
  return cljs.core.count(cljs.core.seq(coll))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = true;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv__2 = function(coll, other) {
  var this__20779 = this;
  var and__3698__auto____20780 = cljs.core.set_QMARK_(other);
  if(cljs.core.truth_(and__3698__auto____20780)) {
    var and__3698__auto____20781 = cljs.core._EQ_(cljs.core.count(coll), cljs.core.count(other));
    if(cljs.core.truth_(and__3698__auto____20781)) {
      return cljs.core.every_QMARK_(function(p1__20756_SHARP_) {
        return cljs.core.contains_QMARK_(coll, p1__20756_SHARP_)
      }, other)
    }else {
      return and__3698__auto____20781
    }
  }else {
    return and__3698__auto____20780
  }
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta__2 = function(coll, meta) {
  var this__20782 = this;
  return new cljs.core.Set(meta, this__20782.hash_map)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = true;
cljs.core.Set.prototype.cljs$core$IMeta$_meta__1 = function(coll) {
  var this__20783 = this;
  return this__20783.meta
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(coll) {
  var this__20784 = this;
  return cljs.core.with_meta(cljs.core.Set.EMPTY, this__20784.meta)
};
cljs.core.Set;
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map());
cljs.core.set = function set(coll) {
  var in$__20790 = cljs.core.seq(coll);
  var out__20791 = cljs.core.Set.EMPTY;
  while(true) {
    if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_(in$__20790)))) {
      var G__20793 = cljs.core.rest(in$__20790);
      var G__20794 = cljs.core.conj.__2(out__20791, cljs.core.first(in$__20790));
      in$__20790 = G__20793;
      out__20791 = G__20794;
      continue
    }else {
      return out__20791
    }
    break
  }
};
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.truth_(cljs.core.vector_QMARK_(coll))) {
    var n__20795 = cljs.core.count(coll);
    return cljs.core.reduce.__3(function(v, i) {
      var temp__3847__auto____20796 = cljs.core.find(smap, cljs.core.nth.__2(v, i));
      if(cljs.core.truth_(temp__3847__auto____20796)) {
        var e__20797 = temp__3847__auto____20796;
        return cljs.core.assoc.__3(v, i, cljs.core.second(e__20797))
      }else {
        return v
      }
    }, coll, cljs.core.take(n__20795, cljs.core.iterate(cljs.core.inc, 0)))
  }else {
    return cljs.core.map.__2(function(p1__20789_SHARP_) {
      var temp__3847__auto____20798 = cljs.core.find(smap, p1__20789_SHARP_);
      if(cljs.core.truth_(temp__3847__auto____20798)) {
        var e__20799 = temp__3847__auto____20798;
        return cljs.core.second(e__20799)
      }else {
        return p1__20789_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__20810 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__20803, seen) {
        while(true) {
          var vec__20804__20805 = p__20803;
          var f__20806 = cljs.core.nth.call(null, vec__20804__20805, 0, null);
          var xs__20807 = vec__20804__20805;
          var temp__3850__auto____20808 = cljs.core.seq(xs__20807);
          if(cljs.core.truth_(temp__3850__auto____20808)) {
            var s__20809 = temp__3850__auto____20808;
            if(cljs.core.truth_(cljs.core.contains_QMARK_(seen, f__20806))) {
              var G__20813 = cljs.core.rest(s__20809);
              var G__20814 = seen;
              p__20803 = G__20813;
              seen = G__20814;
              continue
            }else {
              return cljs.core.cons(f__20806, step.call(null, cljs.core.rest(s__20809), cljs.core.conj.__2(seen, f__20806)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    })
  };
  return step__20810.call(null, coll, cljs.core.set([]))
};
cljs.core.butlast = function butlast(s) {
  var ret__20815 = cljs.core.PersistentVector.fromArray([]);
  var s__20816 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.next(s__20816))) {
      var G__20818 = cljs.core.conj.__2(ret__20815, cljs.core.first(s__20816));
      var G__20819 = cljs.core.next(s__20816);
      ret__20815 = G__20818;
      s__20816 = G__20819;
      continue
    }else {
      return cljs.core.seq(ret__20815)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.truth_(cljs.core.string_QMARK_(x))) {
    return x
  }else {
    if(cljs.core.truth_(function() {
      var or__3700__auto____20820 = cljs.core.keyword_QMARK_(x);
      if(cljs.core.truth_(or__3700__auto____20820)) {
        return or__3700__auto____20820
      }else {
        return cljs.core.symbol_QMARK_(x)
      }
    }())) {
      var i__20821 = x.lastIndexOf("/");
      if(i__20821 < 0) {
        return cljs.core.subs.__2(x, 2)
      }else {
        return cljs.core.subs.__2(x, i__20821 + 1)
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
    var or__3700__auto____20827 = cljs.core.keyword_QMARK_(x);
    if(cljs.core.truth_(or__3700__auto____20827)) {
      return or__3700__auto____20827
    }else {
      return cljs.core.symbol_QMARK_(x)
    }
  }())) {
    var i__20828 = x.lastIndexOf("/");
    if(i__20828 > -1) {
      return cljs.core.subs.__3(x, 2, i__20828)
    }else {
      return null
    }
  }else {
    throw new Error(cljs.core.str("Doesn't support namespace: ", x));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__20834 = cljs.core.ObjMap.fromObject([], {});
  var ks__20835 = cljs.core.seq(keys);
  var vs__20836 = cljs.core.seq(vals);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__3698__auto____20837 = ks__20835;
      if(cljs.core.truth_(and__3698__auto____20837)) {
        return vs__20836
      }else {
        return and__3698__auto____20837
      }
    }())) {
      var G__20840 = cljs.core.assoc.__3(map__20834, cljs.core.first(ks__20835), cljs.core.first(vs__20836));
      var G__20841 = cljs.core.next(ks__20835);
      var G__20842 = cljs.core.next(vs__20836);
      map__20834 = G__20840;
      ks__20835 = G__20841;
      vs__20836 = G__20842;
      continue
    }else {
      return map__20834
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
    var G__20846__delegate = function(k, x, y, more) {
      return cljs.core.reduce.__3(function(p1__20832_SHARP_, p2__20833_SHARP_) {
        return max_key.call(null, k, p1__20832_SHARP_, p2__20833_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__20846 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20846__delegate.call(this, k, x, y, more)
    };
    G__20846.cljs$lang$maxFixedArity = 3;
    G__20846.cljs$lang$applyTo = function(arglist__20847) {
      var k = cljs.core.first(arglist__20847);
      var x = cljs.core.first(cljs.core.next(arglist__20847));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20847)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20847)));
      return G__20846__delegate.call(this, k, x, y, more)
    };
    return G__20846
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
    var G__20849__delegate = function(k, x, y, more) {
      return cljs.core.reduce.__3(function(p1__20843_SHARP_, p2__20844_SHARP_) {
        return min_key.call(null, k, p1__20843_SHARP_, p2__20844_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__20849 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20849__delegate.call(this, k, x, y, more)
    };
    G__20849.cljs$lang$maxFixedArity = 3;
    G__20849.cljs$lang$applyTo = function(arglist__20850) {
      var k = cljs.core.first(arglist__20850);
      var x = cljs.core.first(cljs.core.next(arglist__20850));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20850)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20850)));
      return G__20849__delegate.call(this, k, x, y, more)
    };
    return G__20849
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
      var temp__3850__auto____20851 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20851)) {
        var s__20852 = temp__3850__auto____20851;
        return cljs.core.cons(cljs.core.take(n, s__20852), partition_all.call(null, n, step, cljs.core.drop(step, s__20852)))
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
    var temp__3850__auto____20854 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20854)) {
      var s__20855 = temp__3850__auto____20854;
      if(cljs.core.truth_(pred.call(null, cljs.core.first(s__20855)))) {
        return cljs.core.cons(cljs.core.first(s__20855), take_while.call(null, pred, cljs.core.rest(s__20855)))
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
  var this__20858 = this;
  return cljs.core.hash_coll(rng)
};
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj__2 = function(rng, o) {
  var this__20859 = this;
  return cljs.core.cons(o, rng)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce__2 = function(rng, f) {
  var this__20860 = this;
  return cljs.core.ci_reduce.__2(rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce__3 = function(rng, f, s) {
  var this__20861 = this;
  return cljs.core.ci_reduce.__3(rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq__1 = function(rng) {
  var this__20862 = this;
  var comp__20863 = this__20862.step > 0 ? cljs.core._LT_ : cljs.core._GT_;
  if(cljs.core.truth_(comp__20863.call(null, this__20862.start, this__20862.end))) {
    return rng
  }else {
    return null
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count__1 = function(rng) {
  var this__20864 = this;
  if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._seq(rng)))) {
    return 0
  }else {
    return Math["ceil"].call(null, (this__20864.end - this__20864.start) / this__20864.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first__1 = function(rng) {
  var this__20865 = this;
  return this__20865.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest__1 = function(rng) {
  var this__20866 = this;
  if(cljs.core.truth_(cljs.core._seq(rng))) {
    return new cljs.core.Range(this__20866.meta, this__20866.start + this__20866.step, this__20866.end, this__20866.step)
  }else {
    return cljs.core.list()
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv__2 = function(rng, other) {
  var this__20867 = this;
  return cljs.core.equiv_sequential(rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta__2 = function(rng, meta) {
  var this__20868 = this;
  return new cljs.core.Range(meta, this__20868.start, this__20868.end, this__20868.step)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta__1 = function(rng) {
  var this__20869 = this;
  return this__20869.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth__2 = function(rng, n) {
  var this__20870 = this;
  if(n < cljs.core._count(rng)) {
    return this__20870.start + n * this__20870.step
  }else {
    if(cljs.core.truth_(function() {
      var and__3698__auto____20871 = this__20870.start > this__20870.end;
      if(and__3698__auto____20871) {
        return cljs.core._EQ_(this__20870.step, 0)
      }else {
        return and__3698__auto____20871
      }
    }())) {
      return this__20870.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth__3 = function(rng, n, not_found) {
  var this__20872 = this;
  if(n < cljs.core._count(rng)) {
    return this__20872.start + n * this__20872.step
  }else {
    if(cljs.core.truth_(function() {
      var and__3698__auto____20873 = this__20872.start > this__20872.end;
      if(and__3698__auto____20873) {
        return cljs.core._EQ_(this__20872.step, 0)
      }else {
        return and__3698__auto____20873
      }
    }())) {
      return this__20872.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty__1 = function(rng) {
  var this__20874 = this;
  return cljs.core.with_meta(cljs.core.List.EMPTY, this__20874.meta)
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
    var temp__3850__auto____20884 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20884)) {
      var s__20885 = temp__3850__auto____20884;
      return cljs.core.cons(cljs.core.first(s__20885), take_nth.call(null, n, cljs.core.drop(n, s__20885)))
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
    var temp__3850__auto____20888 = cljs.core.seq(coll);
    if(cljs.core.truth_(temp__3850__auto____20888)) {
      var s__20889 = temp__3850__auto____20888;
      var fst__20890 = cljs.core.first(s__20889);
      var fv__20891 = f.call(null, fst__20890);
      var run__20892 = cljs.core.cons(fst__20890, cljs.core.take_while(function(p1__20887_SHARP_) {
        return cljs.core._EQ_(fv__20891, f.call(null, p1__20887_SHARP_))
      }, cljs.core.next(s__20889)));
      return cljs.core.cons(run__20892, partition_by.call(null, f, cljs.core.seq(cljs.core.drop(cljs.core.count(run__20892), s__20889))))
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
      var temp__3847__auto____20904 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3847__auto____20904)) {
        var s__20905 = temp__3847__auto____20904;
        return reductions.call(null, f, cljs.core.first(s__20905), cljs.core.rest(s__20905))
      }else {
        return cljs.core.list(f.call(null))
      }
    })
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons(init, new cljs.core.LazySeq(null, false, function() {
      var temp__3850__auto____20906 = cljs.core.seq(coll);
      if(cljs.core.truth_(temp__3850__auto____20906)) {
        var s__20907 = temp__3850__auto____20906;
        return reductions.call(null, f, f.call(null, init, cljs.core.first(s__20907)), cljs.core.rest(s__20907))
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
      var G__20911 = null;
      var G__20911__0 = function() {
        return cljs.core.vector(f.call(null))
      };
      var G__20911__1 = function(x) {
        return cljs.core.vector(f.call(null, x))
      };
      var G__20911__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y))
      };
      var G__20911__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z))
      };
      var G__20911__4 = function() {
        var G__20912__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args))
        };
        var G__20912 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20912__delegate.call(this, x, y, z, args)
        };
        G__20912.cljs$lang$maxFixedArity = 3;
        G__20912.cljs$lang$applyTo = function(arglist__20913) {
          var x = cljs.core.first(arglist__20913);
          var y = cljs.core.first(cljs.core.next(arglist__20913));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20913)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20913)));
          return G__20912__delegate.call(this, x, y, z, args)
        };
        return G__20912
      }();
      G__20911 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__20911__0.call(this);
          case 1:
            return G__20911__1.call(this, x);
          case 2:
            return G__20911__2.call(this, x, y);
          case 3:
            return G__20911__3.call(this, x, y, z);
          default:
            return G__20911__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20911.cljs$lang$maxFixedArity = 3;
      G__20911.cljs$lang$applyTo = G__20911__4.cljs$lang$applyTo;
      return G__20911
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__20914 = null;
      var G__20914__0 = function() {
        return cljs.core.vector(f.call(null), g.call(null))
      };
      var G__20914__1 = function(x) {
        return cljs.core.vector(f.call(null, x), g.call(null, x))
      };
      var G__20914__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y), g.call(null, x, y))
      };
      var G__20914__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__20914__4 = function() {
        var G__20915__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args), cljs.core.apply.__5(g, x, y, z, args))
        };
        var G__20915 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20915__delegate.call(this, x, y, z, args)
        };
        G__20915.cljs$lang$maxFixedArity = 3;
        G__20915.cljs$lang$applyTo = function(arglist__20916) {
          var x = cljs.core.first(arglist__20916);
          var y = cljs.core.first(cljs.core.next(arglist__20916));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20916)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20916)));
          return G__20915__delegate.call(this, x, y, z, args)
        };
        return G__20915
      }();
      G__20914 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__20914__0.call(this);
          case 1:
            return G__20914__1.call(this, x);
          case 2:
            return G__20914__2.call(this, x, y);
          case 3:
            return G__20914__3.call(this, x, y, z);
          default:
            return G__20914__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20914.cljs$lang$maxFixedArity = 3;
      G__20914.cljs$lang$applyTo = G__20914__4.cljs$lang$applyTo;
      return G__20914
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__20917 = null;
      var G__20917__0 = function() {
        return cljs.core.vector(f.call(null), g.call(null), h.call(null))
      };
      var G__20917__1 = function(x) {
        return cljs.core.vector(f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__20917__2 = function(x, y) {
        return cljs.core.vector(f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__20917__3 = function(x, y, z) {
        return cljs.core.vector(f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__20917__4 = function() {
        var G__20918__delegate = function(x, y, z, args) {
          return cljs.core.vector(cljs.core.apply.__5(f, x, y, z, args), cljs.core.apply.__5(g, x, y, z, args), cljs.core.apply.__5(h, x, y, z, args))
        };
        var G__20918 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__20918__delegate.call(this, x, y, z, args)
        };
        G__20918.cljs$lang$maxFixedArity = 3;
        G__20918.cljs$lang$applyTo = function(arglist__20919) {
          var x = cljs.core.first(arglist__20919);
          var y = cljs.core.first(cljs.core.next(arglist__20919));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20919)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20919)));
          return G__20918__delegate.call(this, x, y, z, args)
        };
        return G__20918
      }();
      G__20917 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__20917__0.call(this);
          case 1:
            return G__20917__1.call(this, x);
          case 2:
            return G__20917__2.call(this, x, y);
          case 3:
            return G__20917__3.call(this, x, y, z);
          default:
            return G__20917__4.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__20917.cljs$lang$maxFixedArity = 3;
      G__20917.cljs$lang$applyTo = G__20917__4.cljs$lang$applyTo;
      return G__20917
    }()
  };
  var juxt__4 = function() {
    var G__20920__delegate = function(f, g, h, fs) {
      var fs__20910 = cljs.core.list_STAR_.__4(f, g, h, fs);
      return function() {
        var G__20921 = null;
        var G__20921__0 = function() {
          return cljs.core.reduce.__3(function(p1__20894_SHARP_, p2__20895_SHARP_) {
            return cljs.core.conj.__2(p1__20894_SHARP_, p2__20895_SHARP_.call(null))
          }, cljs.core.PersistentVector.fromArray([]), fs__20910)
        };
        var G__20921__1 = function(x) {
          return cljs.core.reduce.__3(function(p1__20896_SHARP_, p2__20897_SHARP_) {
            return cljs.core.conj.__2(p1__20896_SHARP_, p2__20897_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.fromArray([]), fs__20910)
        };
        var G__20921__2 = function(x, y) {
          return cljs.core.reduce.__3(function(p1__20898_SHARP_, p2__20899_SHARP_) {
            return cljs.core.conj.__2(p1__20898_SHARP_, p2__20899_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.fromArray([]), fs__20910)
        };
        var G__20921__3 = function(x, y, z) {
          return cljs.core.reduce.__3(function(p1__20900_SHARP_, p2__20901_SHARP_) {
            return cljs.core.conj.__2(p1__20900_SHARP_, p2__20901_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.fromArray([]), fs__20910)
        };
        var G__20921__4 = function() {
          var G__20922__delegate = function(x, y, z, args) {
            return cljs.core.reduce.__3(function(p1__20902_SHARP_, p2__20903_SHARP_) {
              return cljs.core.conj.__2(p1__20902_SHARP_, cljs.core.apply.__5(p2__20903_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.fromArray([]), fs__20910)
          };
          var G__20922 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__20922__delegate.call(this, x, y, z, args)
          };
          G__20922.cljs$lang$maxFixedArity = 3;
          G__20922.cljs$lang$applyTo = function(arglist__20923) {
            var x = cljs.core.first(arglist__20923);
            var y = cljs.core.first(cljs.core.next(arglist__20923));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20923)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20923)));
            return G__20922__delegate.call(this, x, y, z, args)
          };
          return G__20922
        }();
        G__20921 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__20921__0.call(this);
            case 1:
              return G__20921__1.call(this, x);
            case 2:
              return G__20921__2.call(this, x, y);
            case 3:
              return G__20921__3.call(this, x, y, z);
            default:
              return G__20921__4.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__20921.cljs$lang$maxFixedArity = 3;
        G__20921.cljs$lang$applyTo = G__20921__4.cljs$lang$applyTo;
        return G__20921
      }()
    };
    var G__20920 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__20920__delegate.call(this, f, g, h, fs)
    };
    G__20920.cljs$lang$maxFixedArity = 3;
    G__20920.cljs$lang$applyTo = function(arglist__20924) {
      var f = cljs.core.first(arglist__20924);
      var g = cljs.core.first(cljs.core.next(arglist__20924));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__20924)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__20924)));
      return G__20920__delegate.call(this, f, g, h, fs)
    };
    return G__20920
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
        var G__20927 = cljs.core.next(coll);
        coll = G__20927;
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
        var and__3698__auto____20925 = cljs.core.seq(coll);
        if(cljs.core.truth_(and__3698__auto____20925)) {
          return n > 0
        }else {
          return and__3698__auto____20925
        }
      }())) {
        var G__20930 = n - 1;
        var G__20931 = cljs.core.next(coll);
        n = G__20930;
        coll = G__20931;
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
  var matches__20932 = re.exec(s);
  if(cljs.core.truth_(cljs.core._EQ_(cljs.core.first(matches__20932), s))) {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.count(matches__20932), 1))) {
      return cljs.core.first(matches__20932)
    }else {
      return cljs.core.vec(matches__20932)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__20935 = re.exec(s);
  if(matches__20935 === null) {
    return null
  }else {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.count(matches__20935), 1))) {
      return cljs.core.first(matches__20935)
    }else {
      return cljs.core.vec(matches__20935)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__20938 = cljs.core.re_find(re, s);
  var match_idx__20939 = s.search(re);
  var match_str__20940 = cljs.core.truth_(cljs.core.coll_QMARK_(match_data__20938)) ? cljs.core.first(match_data__20938) : match_data__20938;
  var post_match__20941 = cljs.core.subs.__2(s, match_idx__20939 + cljs.core.count(match_str__20940));
  if(cljs.core.truth_(match_data__20938)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons(match_data__20938, re_seq.call(null, re, post_match__20941))
    })
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__20944__20945 = cljs.core.re_find(/^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___20946 = cljs.core.nth.call(null, vec__20944__20945, 0, null);
  var flags__20947 = cljs.core.nth.call(null, vec__20944__20945, 1, null);
  var pattern__20948 = cljs.core.nth.call(null, vec__20944__20945, 2, null);
  return new RegExp(pattern__20948, flags__20947)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat(cljs.core.PersistentVector.fromArray([begin]), cljs.core.flatten1(cljs.core.interpose(cljs.core.PersistentVector.fromArray([sep]), cljs.core.map.__2(function(p1__20943_SHARP_) {
    return print_one.call(null, p1__20943_SHARP_, opts)
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
          var and__3698__auto____20949 = cljs.core.get.__2(opts, "\ufdd0'meta");
          if(cljs.core.truth_(and__3698__auto____20949)) {
            var and__3698__auto____20953 = function() {
              var x__457__auto____20950 = obj;
              if(cljs.core.truth_(function() {
                var and__3698__auto____20951 = x__457__auto____20950;
                if(cljs.core.truth_(and__3698__auto____20951)) {
                  var and__3698__auto____20952 = x__457__auto____20950.cljs$core$IMeta$;
                  if(cljs.core.truth_(and__3698__auto____20952)) {
                    return cljs.core.not.call(null, x__457__auto____20950.hasOwnProperty("cljs$core$IMeta$"))
                  }else {
                    return and__3698__auto____20952
                  }
                }else {
                  return and__3698__auto____20951
                }
              }())) {
                return true
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, x__457__auto____20950)
              }
            }();
            if(cljs.core.truth_(and__3698__auto____20953)) {
              return cljs.core.meta(obj)
            }else {
              return and__3698__auto____20953
            }
          }else {
            return and__3698__auto____20949
          }
        }()) ? cljs.core.concat(cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta(obj), opts), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
          var x__457__auto____20954 = obj;
          if(cljs.core.truth_(function() {
            var and__3698__auto____20955 = x__457__auto____20954;
            if(cljs.core.truth_(and__3698__auto____20955)) {
              var and__3698__auto____20956 = x__457__auto____20954.cljs$core$IPrintable$;
              if(cljs.core.truth_(and__3698__auto____20956)) {
                return cljs.core.not.call(null, x__457__auto____20954.hasOwnProperty("cljs$core$IPrintable$"))
              }else {
                return and__3698__auto____20956
              }
            }else {
              return and__3698__auto____20955
            }
          }())) {
            return true
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, x__457__auto____20954)
          }
        }()) ? cljs.core._pr_seq(obj, opts) : cljs.core.list("#<", cljs.core.str.__1(obj), ">"))
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb = function pr_sb(objs, opts) {
  var first_obj__20968 = cljs.core.first(objs);
  var sb__20969 = new goog.string.StringBuffer;
  var G__20970__20971 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__20970__20971)) {
    var obj__20972 = cljs.core.first.call(null, G__20970__20971);
    var G__20970__20973 = G__20970__20971;
    while(true) {
      if(obj__20972 === first_obj__20968) {
      }else {
        sb__20969.append(" ")
      }
      var G__20974__20975 = cljs.core.seq.call(null, cljs.core.pr_seq(obj__20972, opts));
      if(cljs.core.truth_(G__20974__20975)) {
        var string__20976 = cljs.core.first.call(null, G__20974__20975);
        var G__20974__20977 = G__20974__20975;
        while(true) {
          sb__20969.append(string__20976);
          var temp__3850__auto____20978 = cljs.core.next.call(null, G__20974__20977);
          if(cljs.core.truth_(temp__3850__auto____20978)) {
            var G__20974__20979 = temp__3850__auto____20978;
            var G__20986 = cljs.core.first.call(null, G__20974__20979);
            var G__20987 = G__20974__20979;
            string__20976 = G__20986;
            G__20974__20977 = G__20987;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3850__auto____20980 = cljs.core.next.call(null, G__20970__20973);
      if(cljs.core.truth_(temp__3850__auto____20980)) {
        var G__20970__20981 = temp__3850__auto____20980;
        var G__20989 = cljs.core.first.call(null, G__20970__20981);
        var G__20990 = G__20970__20981;
        obj__20972 = G__20989;
        G__20970__20973 = G__20990;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return sb__20969
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  return cljs.core.str.__1(cljs.core.pr_sb(objs, opts))
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  var sb__20991 = cljs.core.pr_sb(objs, opts);
  sb__20991.append("\n");
  return cljs.core.str.__1(sb__20991)
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  var first_obj__20992 = cljs.core.first(objs);
  var G__20993__20994 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__20993__20994)) {
    var obj__20995 = cljs.core.first.call(null, G__20993__20994);
    var G__20993__20996 = G__20993__20994;
    while(true) {
      if(obj__20995 === first_obj__20992) {
      }else {
        cljs.core.string_print(" ")
      }
      var G__20997__20998 = cljs.core.seq.call(null, cljs.core.pr_seq(obj__20995, opts));
      if(cljs.core.truth_(G__20997__20998)) {
        var string__20999 = cljs.core.first.call(null, G__20997__20998);
        var G__20997__21000 = G__20997__20998;
        while(true) {
          cljs.core.string_print(string__20999);
          var temp__3850__auto____21001 = cljs.core.next.call(null, G__20997__21000);
          if(cljs.core.truth_(temp__3850__auto____21001)) {
            var G__20997__21002 = temp__3850__auto____21001;
            var G__21009 = cljs.core.first.call(null, G__20997__21002);
            var G__21010 = G__20997__21002;
            string__20999 = G__21009;
            G__20997__21000 = G__21010;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__3850__auto____21003 = cljs.core.next.call(null, G__20993__20996);
      if(cljs.core.truth_(temp__3850__auto____21003)) {
        var G__20993__21004 = temp__3850__auto____21003;
        var G__21012 = cljs.core.first.call(null, G__20993__21004);
        var G__21013 = G__20993__21004;
        obj__20995 = G__21012;
        G__20993__20996 = G__21013;
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
  pr_str.cljs$lang$applyTo = function(arglist__21015) {
    var objs = cljs.core.seq(arglist__21015);
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
  prn_str.cljs$lang$applyTo = function(arglist__21016) {
    var objs = cljs.core.seq(arglist__21016);
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
  pr.cljs$lang$applyTo = function(arglist__21017) {
    var objs = cljs.core.seq(arglist__21017);
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
  cljs_core_print.cljs$lang$applyTo = function(arglist__21018) {
    var objs = cljs.core.seq(arglist__21018);
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
  print_str.cljs$lang$applyTo = function(arglist__21019) {
    var objs = cljs.core.seq(arglist__21019);
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
  println.cljs$lang$applyTo = function(arglist__21020) {
    var objs = cljs.core.seq(arglist__21020);
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
  println_str.cljs$lang$applyTo = function(arglist__21021) {
    var objs = cljs.core.seq(arglist__21021);
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
  prn.cljs$lang$applyTo = function(arglist__21022) {
    var objs = cljs.core.seq(arglist__21022);
    return prn__delegate.call(this, objs)
  };
  return prn
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq__2 = function(coll, opts) {
  var pr_pair__21023 = function(keyval) {
    return cljs.core.pr_sequential(cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential(pr_pair__21023, "{", ", ", "}", opts, coll)
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
      var temp__3850__auto____21024 = cljs.core.namespace(obj);
      if(cljs.core.truth_(temp__3850__auto____21024)) {
        var nspc__21025 = temp__3850__auto____21024;
        return cljs.core.str(nspc__21025, "/")
      }else {
        return null
      }
    }(), cljs.core.name(obj)))
  }else {
    if(cljs.core.truth_(cljs.core.symbol_QMARK_(obj))) {
      return cljs.core.list(cljs.core.str(function() {
        var temp__3850__auto____21026 = cljs.core.namespace(obj);
        if(cljs.core.truth_(temp__3850__auto____21026)) {
          var nspc__21027 = temp__3850__auto____21026;
          return cljs.core.str(nspc__21027, "/")
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
  var pr_pair__21028 = function(keyval) {
    return cljs.core.pr_sequential(cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential(pr_pair__21028, "{", ", ", "}", opts, coll)
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
  var this__21034 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches__3 = function(this$, oldval, newval) {
  var this__21035 = this;
  var G__21036__21037 = cljs.core.seq.call(null, this__21035.watches);
  if(cljs.core.truth_(G__21036__21037)) {
    var G__21039__21041 = cljs.core.first.call(null, G__21036__21037);
    var vec__21040__21042 = G__21039__21041;
    var key__21043 = cljs.core.nth.call(null, vec__21040__21042, 0, null);
    var f__21044 = cljs.core.nth.call(null, vec__21040__21042, 1, null);
    var G__21036__21045 = G__21036__21037;
    var G__21039__21046 = G__21039__21041;
    var G__21036__21047 = G__21036__21045;
    while(true) {
      var vec__21048__21049 = G__21039__21046;
      var key__21050 = cljs.core.nth.call(null, vec__21048__21049, 0, null);
      var f__21051 = cljs.core.nth.call(null, vec__21048__21049, 1, null);
      var G__21036__21052 = G__21036__21047;
      f__21051.call(null, key__21050, this$, oldval, newval);
      var temp__3850__auto____21053 = cljs.core.next.call(null, G__21036__21052);
      if(cljs.core.truth_(temp__3850__auto____21053)) {
        var G__21036__21054 = temp__3850__auto____21053;
        var G__21063 = cljs.core.first.call(null, G__21036__21054);
        var G__21064 = G__21036__21054;
        G__21039__21046 = G__21063;
        G__21036__21047 = G__21064;
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
  var this__21055 = this;
  return this$.watches = cljs.core.assoc.__3(this__21055.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch__2 = function(this$, key) {
  var this__21056 = this;
  return this$.watches = cljs.core.dissoc.__2(this__21056.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq__2 = function(a, opts) {
  var this__21057 = this;
  return cljs.core.concat(cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq(this__21057.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta__1 = function(_) {
  var this__21058 = this;
  return this__21058.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref__1 = function(_) {
  var this__21059 = this;
  return this__21059.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv__2 = function(o, other) {
  var this__21060 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__21071__delegate = function(x, p__21065) {
      var map__21066__21067 = p__21065;
      var map__21066__21068 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__21066__21067)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__21066__21067) : map__21066__21067;
      var validator__21069 = cljs.core.get.call(null, map__21066__21068, "\ufdd0'validator");
      var meta__21070 = cljs.core.get.call(null, map__21066__21068, "\ufdd0'meta");
      return new cljs.core.Atom(x, meta__21070, validator__21069, null)
    };
    var G__21071 = function(x, var_args) {
      var p__21065 = null;
      if(goog.isDef(var_args)) {
        p__21065 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__21071__delegate.call(this, x, p__21065)
    };
    G__21071.cljs$lang$maxFixedArity = 1;
    G__21071.cljs$lang$applyTo = function(arglist__21072) {
      var x = cljs.core.first(arglist__21072);
      var p__21065 = cljs.core.rest(arglist__21072);
      return G__21071__delegate.call(this, x, p__21065)
    };
    return G__21071
  }();
  atom = function(x, var_args) {
    var p__21065 = var_args;
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
  var temp__3850__auto____21073 = a.validator;
  if(cljs.core.truth_(temp__3850__auto____21073)) {
    var validate__21074 = temp__3850__auto____21073;
    if(cljs.core.truth_(validate__21074.call(null, new_value))) {
    }else {
      throw new Error(cljs.core.str.call(null, "Assert failed: ", "Validator rejected reference state", "\n", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 3282)))));
    }
  }else {
  }
  var old_value__21075 = a.state;
  a.state = new_value;
  cljs.core._notify_watches(a, old_value__21075, new_value);
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
    var G__21078__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_(a, cljs.core.apply(f, a.state, x, y, z, more))
    };
    var G__21078 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__21078__delegate.call(this, a, f, x, y, z, more)
    };
    G__21078.cljs$lang$maxFixedArity = 5;
    G__21078.cljs$lang$applyTo = function(arglist__21079) {
      var a = cljs.core.first(arglist__21079);
      var f = cljs.core.first(cljs.core.next(arglist__21079));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__21079)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__21079))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__21079)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__21079)))));
      return G__21078__delegate.call(this, a, f, x, y, z, more)
    };
    return G__21078
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
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__21081) {
    var iref = cljs.core.first(arglist__21081);
    var f = cljs.core.first(cljs.core.next(arglist__21081));
    var args = cljs.core.rest(cljs.core.next(arglist__21081));
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
  var this__21083 = this;
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this__21083.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref__1 = function(_) {
  var this__21084 = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.__2(this__21084.state, function(p__21085) {
    var curr_state__21086 = p__21085;
    var curr_state__21087 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, curr_state__21086)) ? cljs.core.apply.call(null, cljs.core.hash_map, curr_state__21086) : curr_state__21086;
    var done__21088 = cljs.core.get.call(null, curr_state__21087, "\ufdd0'done");
    if(cljs.core.truth_(done__21088)) {
      return curr_state__21087
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__21084.f.call(null)})
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
    var map__21091__21092 = options;
    var map__21091__21093 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__21091__21092)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__21091__21092) : map__21091__21092;
    var keywordize_keys__21094 = cljs.core.get.call(null, map__21091__21093, "\ufdd0'keywordize-keys");
    var keyfn__21095 = cljs.core.truth_(keywordize_keys__21094) ? cljs.core.keyword : cljs.core.str;
    var f__21101 = function thisfn(x) {
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
                var iter__531__auto____21100 = function iter__21096(s__21097) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__21097__21098 = s__21097;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__21097__21098))) {
                        var k__21099 = cljs.core.first.call(null, s__21097__21098);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__21095.call(null, k__21099), thisfn.call(null, x[k__21099])]), iter__21096.call(null, cljs.core.rest.call(null, s__21097__21098)))
                      }else {
                        return null
                      }
                      break
                    }
                  })
                };
                return iter__531__auto____21100.call(null, cljs.core.js_keys(x))
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
    return f__21101.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__21108) {
    var x = cljs.core.first(arglist__21108);
    var options = cljs.core.rest(arglist__21108);
    return js__GT_clj__delegate.call(this, x, options)
  };
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__21109 = cljs.core.atom.__1(cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var G__21113__delegate = function(args) {
      var temp__3847__auto____21110 = cljs.core.get.__2(cljs.core.deref.call(null, mem__21109), args);
      if(cljs.core.truth_(temp__3847__auto____21110)) {
        var v__21111 = temp__3847__auto____21110;
        return v__21111
      }else {
        var ret__21112 = cljs.core.apply.__2(f, args);
        cljs.core.swap_BANG_.__4(mem__21109, cljs.core.assoc, args, ret__21112);
        return ret__21112
      }
    };
    var G__21113 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__21113__delegate.call(this, args)
    };
    G__21113.cljs$lang$maxFixedArity = 0;
    G__21113.cljs$lang$applyTo = function(arglist__21115) {
      var args = cljs.core.seq(arglist__21115);
      return G__21113__delegate.call(this, args)
    };
    return G__21113
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__21116 = f.call(null);
      if(cljs.core.truth_(cljs.core.fn_QMARK_(ret__21116))) {
        var G__21118 = ret__21116;
        f = G__21118;
        continue
      }else {
        return ret__21116
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__21119__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.__2(f, args)
      })
    };
    var G__21119 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__21119__delegate.call(this, f, args)
    };
    G__21119.cljs$lang$maxFixedArity = 1;
    G__21119.cljs$lang$applyTo = function(arglist__21120) {
      var f = cljs.core.first(arglist__21120);
      var args = cljs.core.rest(arglist__21120);
      return G__21119__delegate.call(this, f, args)
    };
    return G__21119
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
    var k__21121 = f.call(null, x);
    return cljs.core.assoc.__3(ret, k__21121, cljs.core.conj.__2(cljs.core.get.__3(ret, k__21121, cljs.core.PersistentVector.fromArray([])), x))
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
    var or__3700__auto____21122 = cljs.core._EQ_(child, parent);
    if(cljs.core.truth_(or__3700__auto____21122)) {
      return or__3700__auto____21122
    }else {
      var or__3700__auto____21123 = cljs.core.contains_QMARK_("\ufdd0'ancestors".call(null, h).call(null, child), parent);
      if(cljs.core.truth_(or__3700__auto____21123)) {
        return or__3700__auto____21123
      }else {
        var and__3698__auto____21124 = cljs.core.vector_QMARK_(parent);
        if(cljs.core.truth_(and__3698__auto____21124)) {
          var and__3698__auto____21125 = cljs.core.vector_QMARK_(child);
          if(cljs.core.truth_(and__3698__auto____21125)) {
            var and__3698__auto____21126 = cljs.core._EQ_(cljs.core.count(parent), cljs.core.count(child));
            if(cljs.core.truth_(and__3698__auto____21126)) {
              var ret__21127 = true;
              var i__21128 = 0;
              while(true) {
                if(cljs.core.truth_(function() {
                  var or__3700__auto____21129 = cljs.core.not(ret__21127);
                  if(cljs.core.truth_(or__3700__auto____21129)) {
                    return or__3700__auto____21129
                  }else {
                    return cljs.core._EQ_(i__21128, cljs.core.count(parent))
                  }
                }())) {
                  return ret__21127
                }else {
                  var G__21137 = isa_QMARK_.call(null, h, child.call(null, i__21128), parent.call(null, i__21128));
                  var G__21138 = i__21128 + 1;
                  ret__21127 = G__21137;
                  i__21128 = G__21138;
                  continue
                }
                break
              }
            }else {
              return and__3698__auto____21126
            }
          }else {
            return and__3698__auto____21125
          }
        }else {
          return and__3698__auto____21124
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
    var tp__21142 = "\ufdd0'parents".call(null, h);
    var td__21143 = "\ufdd0'descendants".call(null, h);
    var ta__21144 = "\ufdd0'ancestors".call(null, h);
    var tf__21145 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.__3(function(ret, k) {
        return cljs.core.assoc.__3(ret, k, cljs.core.reduce.__3(cljs.core.conj, cljs.core.get.__3(targets, k, cljs.core.set([])), cljs.core.cons(target, targets.call(null, target))))
      }, m, cljs.core.cons(source, sources.call(null, source)))
    };
    var or__3700__auto____21146 = cljs.core.truth_(cljs.core.contains_QMARK_(tp__21142.call(null, tag), parent)) ? null : function() {
      if(cljs.core.truth_(cljs.core.contains_QMARK_(ta__21144.call(null, tag), parent))) {
        throw new Error(cljs.core.str(tag, "already has", parent, "as ancestor"));
      }else {
      }
      if(cljs.core.truth_(cljs.core.contains_QMARK_(ta__21144.call(null, parent), tag))) {
        throw new Error(cljs.core.str("Cyclic derivation:", parent, "has", tag, "as ancestor"));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.__3("\ufdd0'parents".call(null, h), tag, cljs.core.conj.__2(cljs.core.get.__3(tp__21142, tag, cljs.core.set([])), parent)), "\ufdd0'ancestors":tf__21145.call(null, "\ufdd0'ancestors".call(null, h), tag, td__21143, parent, ta__21144), "\ufdd0'descendants":tf__21145.call(null, "\ufdd0'descendants".call(null, h), parent, ta__21144, tag, td__21143)})
    }();
    if(cljs.core.truth_(or__3700__auto____21146)) {
      return or__3700__auto____21146
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
    var parentMap__21152 = "\ufdd0'parents".call(null, h);
    var childsParents__21153 = cljs.core.truth_(parentMap__21152.call(null, tag)) ? cljs.core.disj.__2(parentMap__21152.call(null, tag), parent) : cljs.core.set([]);
    var newParents__21154 = cljs.core.truth_(cljs.core.not_empty(childsParents__21153)) ? cljs.core.assoc.__3(parentMap__21152, tag, childsParents__21153) : cljs.core.dissoc.__2(parentMap__21152, tag);
    var deriv_seq__21155 = cljs.core.flatten(cljs.core.map.__2(function(p1__21139_SHARP_) {
      return cljs.core.cons(cljs.core.first(p1__21139_SHARP_), cljs.core.interpose(cljs.core.first(p1__21139_SHARP_), cljs.core.second(p1__21139_SHARP_)))
    }, cljs.core.seq(newParents__21154)));
    if(cljs.core.truth_(cljs.core.contains_QMARK_(parentMap__21152.call(null, tag), parent))) {
      return cljs.core.reduce.__3(function(p1__21140_SHARP_, p2__21141_SHARP_) {
        return cljs.core.apply.__3(cljs.core.derive, p1__21140_SHARP_, p2__21141_SHARP_)
      }, cljs.core.make_hierarchy(), cljs.core.partition.__2(2, deriv_seq__21155))
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
  var xprefs__21157 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3700__auto____21159 = cljs.core.truth_(function() {
    var and__3698__auto____21158 = xprefs__21157;
    if(cljs.core.truth_(and__3698__auto____21158)) {
      return xprefs__21157.call(null, y)
    }else {
      return and__3698__auto____21158
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__3700__auto____21159)) {
    return or__3700__auto____21159
  }else {
    var or__3700__auto____21161 = function() {
      var ps__21160 = cljs.core.parents.__1(y);
      while(true) {
        if(cljs.core.count(ps__21160) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first(ps__21160), prefer_table))) {
          }else {
          }
          var G__21168 = cljs.core.rest(ps__21160);
          ps__21160 = G__21168;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__3700__auto____21161)) {
      return or__3700__auto____21161
    }else {
      var or__3700__auto____21163 = function() {
        var ps__21162 = cljs.core.parents.__1(x);
        while(true) {
          if(cljs.core.count(ps__21162) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first(ps__21162), y, prefer_table))) {
            }else {
            }
            var G__21172 = cljs.core.rest(ps__21162);
            ps__21162 = G__21172;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__3700__auto____21163)) {
        return or__3700__auto____21163
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3700__auto____21174 = cljs.core.prefers_STAR_(x, y, prefer_table);
  if(cljs.core.truth_(or__3700__auto____21174)) {
    return or__3700__auto____21174
  }else {
    return cljs.core.isa_QMARK_.__2(x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__21184 = cljs.core.reduce.__3(function(be, p__21176) {
    var vec__21177__21178 = p__21176;
    var k__21179 = cljs.core.nth.call(null, vec__21177__21178, 0, null);
    var ___21180 = cljs.core.nth.call(null, vec__21177__21178, 1, null);
    var e__21181 = vec__21177__21178;
    if(cljs.core.truth_(cljs.core.isa_QMARK_.__2(dispatch_val, k__21179))) {
      var be2__21183 = cljs.core.truth_(function() {
        var or__3700__auto____21182 = be === null;
        if(or__3700__auto____21182) {
          return or__3700__auto____21182
        }else {
          return cljs.core.dominates(k__21179, cljs.core.first(be), prefer_table)
        }
      }()) ? e__21181 : be;
      if(cljs.core.truth_(cljs.core.dominates(cljs.core.first(be2__21183), k__21179, prefer_table))) {
      }else {
        throw new Error(cljs.core.str("Multiple methods in multimethod '", name, "' match dispatch value: ", dispatch_val, " -> ", k__21179, " and ", cljs.core.first(be2__21183), ", and neither is preferred"));
      }
      return be2__21183
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__21184)) {
    if(cljs.core.truth_(cljs.core._EQ_(cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy)))) {
      cljs.core.swap_BANG_.__4(method_cache, cljs.core.assoc, dispatch_val, cljs.core.second(best_entry__21184));
      return cljs.core.second(best_entry__21184)
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
    var and__3698__auto____21190 = mf;
    if(and__3698__auto____21190) {
      return mf.cljs$core$IMultiFn$_reset__1
    }else {
      return and__3698__auto____21190
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset__1(mf)
  }else {
    return function() {
      var or__3700__auto____21191 = cljs.core._reset[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21191) {
        return or__3700__auto____21191
      }else {
        var or__3700__auto____21192 = cljs.core._reset["_"];
        if(or__3700__auto____21192) {
          return or__3700__auto____21192
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__3698__auto____21193 = mf;
    if(and__3698__auto____21193) {
      return mf.cljs$core$IMultiFn$_add_method__3
    }else {
      return and__3698__auto____21193
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method__3(mf, dispatch_val, method)
  }else {
    return function() {
      var or__3700__auto____21194 = cljs.core._add_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21194) {
        return or__3700__auto____21194
      }else {
        var or__3700__auto____21195 = cljs.core._add_method["_"];
        if(or__3700__auto____21195) {
          return or__3700__auto____21195
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__3698__auto____21196 = mf;
    if(and__3698__auto____21196) {
      return mf.cljs$core$IMultiFn$_remove_method__2
    }else {
      return and__3698__auto____21196
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method__2(mf, dispatch_val)
  }else {
    return function() {
      var or__3700__auto____21197 = cljs.core._remove_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21197) {
        return or__3700__auto____21197
      }else {
        var or__3700__auto____21198 = cljs.core._remove_method["_"];
        if(or__3700__auto____21198) {
          return or__3700__auto____21198
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__3698__auto____21199 = mf;
    if(and__3698__auto____21199) {
      return mf.cljs$core$IMultiFn$_prefer_method__3
    }else {
      return and__3698__auto____21199
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method__3(mf, dispatch_val, dispatch_val_y)
  }else {
    return function() {
      var or__3700__auto____21200 = cljs.core._prefer_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21200) {
        return or__3700__auto____21200
      }else {
        var or__3700__auto____21201 = cljs.core._prefer_method["_"];
        if(or__3700__auto____21201) {
          return or__3700__auto____21201
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__3698__auto____21202 = mf;
    if(and__3698__auto____21202) {
      return mf.cljs$core$IMultiFn$_get_method__2
    }else {
      return and__3698__auto____21202
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method__2(mf, dispatch_val)
  }else {
    return function() {
      var or__3700__auto____21203 = cljs.core._get_method[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21203) {
        return or__3700__auto____21203
      }else {
        var or__3700__auto____21204 = cljs.core._get_method["_"];
        if(or__3700__auto____21204) {
          return or__3700__auto____21204
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__3698__auto____21205 = mf;
    if(and__3698__auto____21205) {
      return mf.cljs$core$IMultiFn$_methods__1
    }else {
      return and__3698__auto____21205
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods__1(mf)
  }else {
    return function() {
      var or__3700__auto____21206 = cljs.core._methods[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21206) {
        return or__3700__auto____21206
      }else {
        var or__3700__auto____21207 = cljs.core._methods["_"];
        if(or__3700__auto____21207) {
          return or__3700__auto____21207
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__3698__auto____21208 = mf;
    if(and__3698__auto____21208) {
      return mf.cljs$core$IMultiFn$_prefers__1
    }else {
      return and__3698__auto____21208
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers__1(mf)
  }else {
    return function() {
      var or__3700__auto____21209 = cljs.core._prefers[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21209) {
        return or__3700__auto____21209
      }else {
        var or__3700__auto____21210 = cljs.core._prefers["_"];
        if(or__3700__auto____21210) {
          return or__3700__auto____21210
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__3698__auto____21211 = mf;
    if(and__3698__auto____21211) {
      return mf.cljs$core$IMultiFn$_dispatch__2
    }else {
      return and__3698__auto____21211
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch__2(mf, args)
  }else {
    return function() {
      var or__3700__auto____21212 = cljs.core._dispatch[goog.typeOf.call(null, mf)];
      if(or__3700__auto____21212) {
        return or__3700__auto____21212
      }else {
        var or__3700__auto____21213 = cljs.core._dispatch["_"];
        if(or__3700__auto____21213) {
          return or__3700__auto____21213
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
void 0;
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__21246 = cljs.core.apply.__2(dispatch_fn, args);
  var target_fn__21247 = cljs.core._get_method(mf, dispatch_val__21246);
  if(cljs.core.truth_(target_fn__21247)) {
  }else {
    throw new Error(cljs.core.str("No method in multimethod '", cljs.core.name, "' for dispatch value: ", dispatch_val__21246));
  }
  return cljs.core.apply.__2(target_fn__21247, args)
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
  var this__21249 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset__1 = function(mf) {
  var this__21250 = this;
  cljs.core.swap_BANG_.__2(this__21250.method_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__21250.method_cache, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__21250.prefer_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.__2(this__21250.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method__3 = function(mf, dispatch_val, method) {
  var this__21251 = this;
  cljs.core.swap_BANG_.__4(this__21251.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache(this__21251.method_cache, this__21251.method_table, this__21251.cached_hierarchy, this__21251.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method__2 = function(mf, dispatch_val) {
  var this__21252 = this;
  cljs.core.swap_BANG_.__3(this__21252.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache(this__21252.method_cache, this__21252.method_table, this__21252.cached_hierarchy, this__21252.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method__2 = function(mf, dispatch_val) {
  var this__21253 = this;
  if(cljs.core.truth_(cljs.core._EQ_(cljs.core.deref.call(null, this__21253.cached_hierarchy), cljs.core.deref.call(null, this__21253.hierarchy)))) {
  }else {
    cljs.core.reset_cache(this__21253.method_cache, this__21253.method_table, this__21253.cached_hierarchy, this__21253.hierarchy)
  }
  var temp__3847__auto____21254 = cljs.core.deref.call(null, this__21253.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__3847__auto____21254)) {
    var target_fn__21255 = temp__3847__auto____21254;
    return target_fn__21255
  }else {
    var temp__3847__auto____21256 = cljs.core.find_and_cache_best_method(this__21253.name, dispatch_val, this__21253.hierarchy, this__21253.method_table, this__21253.prefer_table, this__21253.method_cache, this__21253.cached_hierarchy);
    if(cljs.core.truth_(temp__3847__auto____21256)) {
      var target_fn__21257 = temp__3847__auto____21256;
      return target_fn__21257
    }else {
      return cljs.core.deref.call(null, this__21253.method_table).call(null, this__21253.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method__3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__21258 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_(dispatch_val_x, dispatch_val_y, this__21258.prefer_table))) {
    throw new Error(cljs.core.str("Preference conflict in multimethod '", this__21258.name, "': ", dispatch_val_y, " is already preferred to ", dispatch_val_x));
  }else {
  }
  cljs.core.swap_BANG_.__2(this__21258.prefer_table, function(old) {
    return cljs.core.assoc.__3(old, dispatch_val_x, cljs.core.conj.__2(cljs.core.get.__3(old, dispatch_val_x, cljs.core.set([])), dispatch_val_y))
  });
  return cljs.core.reset_cache(this__21258.method_cache, this__21258.method_table, this__21258.cached_hierarchy, this__21258.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods__1 = function(mf) {
  var this__21259 = this;
  return cljs.core.deref.call(null, this__21259.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers__1 = function(mf) {
  var this__21260 = this;
  return cljs.core.deref.call(null, this__21260.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch__2 = function(mf, args) {
  var this__21261 = this;
  return cljs.core.do_dispatch(mf, this__21261.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__21266__delegate = function(_, args) {
    return cljs.core._dispatch(this, args)
  };
  var G__21266 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__21266__delegate.call(this, _, args)
  };
  G__21266.cljs$lang$maxFixedArity = 1;
  G__21266.cljs$lang$applyTo = function(arglist__21267) {
    var _ = cljs.core.first(arglist__21267);
    var args = cljs.core.rest(arglist__21267);
    return G__21266__delegate.call(this, _, args)
  };
  return G__21266
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
      var s__21272 = s;
      var limit__21273 = limit;
      var parts__21274 = cljs.core.PersistentVector.fromArray([]);
      while(true) {
        if(cljs.core.truth_(cljs.core._EQ_(limit__21273, 1))) {
          return cljs.core.conj.__2(parts__21274, s__21272)
        }else {
          var temp__3847__auto____21275 = cljs.core.re_find(re, s__21272);
          if(cljs.core.truth_(temp__3847__auto____21275)) {
            var m__21276 = temp__3847__auto____21275;
            var index__21277 = s__21272.indexOf(m__21276);
            var G__21281 = s__21272.substring(index__21277 + cljs.core.count(m__21276));
            var G__21282 = limit__21273 - 1;
            var G__21283 = cljs.core.conj.__2(parts__21274, s__21272.substring(0, index__21277));
            s__21272 = G__21281;
            limit__21273 = G__21282;
            parts__21274 = G__21283;
            continue
          }else {
            return cljs.core.conj.__2(parts__21274, s__21272)
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
  var index__21284 = s.length;
  while(true) {
    if(index__21284 === 0) {
      return""
    }else {
      var ch__21285 = cljs.core.get.__2(s, index__21284 - 1);
      if(cljs.core.truth_(function() {
        var or__3700__auto____21286 = cljs.core._EQ_(ch__21285, "\n");
        if(cljs.core.truth_(or__3700__auto____21286)) {
          return or__3700__auto____21286
        }else {
          return cljs.core._EQ_(ch__21285, "\r")
        }
      }())) {
        var G__21290 = index__21284 - 1;
        index__21284 = G__21290;
        continue
      }else {
        return s.substring(0, index__21284)
      }
    }
    break
  }
};
clojure.string.blank_QMARK_ = function blank_QMARK_(s) {
  var s__21291 = cljs.core.str.__1(s);
  if(cljs.core.truth_(function() {
    var or__3700__auto____21292 = cljs.core.not(s__21291);
    if(cljs.core.truth_(or__3700__auto____21292)) {
      return or__3700__auto____21292
    }else {
      var or__3700__auto____21293 = cljs.core._EQ_("", s__21291);
      if(cljs.core.truth_(or__3700__auto____21293)) {
        return or__3700__auto____21293
      }else {
        return cljs.core.re_matches(/\s+/, s__21291)
      }
    }
  }())) {
    return true
  }else {
    return false
  }
};
clojure.string.escape = function escape(s, cmap) {
  var buffer__21297 = new goog.string.StringBuffer;
  var length__21298 = s.length;
  var index__21299 = 0;
  while(true) {
    if(cljs.core.truth_(cljs.core._EQ_(length__21298, index__21299))) {
      return buffer__21297.toString()
    }else {
      var ch__21300 = s.charAt(index__21299);
      var temp__3847__auto____21301 = cljs.core.get.__2(cmap, ch__21300);
      if(cljs.core.truth_(temp__3847__auto____21301)) {
        var replacement__21302 = temp__3847__auto____21301;
        buffer__21297.append(cljs.core.str.__1(replacement__21302))
      }else {
        buffer__21297.append(ch__21300)
      }
      var G__21305 = index__21299 + 1;
      index__21299 = G__21305;
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
    var G__18876__18877 = argh.core.context(cvs);
    argh.core.clear_rect(G__18876__18877, 0, 0, cvs.width, cvs.height);
    return G__18876__18877
  };
  var clear__2 = function(cvs, col) {
    var G__18874__18875 = argh.core.context(cvs);
    argh.core.fill_style(G__18874__18875, col);
    argh.core.fill_rect(G__18874__18875, 0, 0, cvs.width, cvs.height);
    return G__18874__18875
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
  var c__3246__auto____18878 = ctx;
  c__3246__auto____18878.beginPath();
  cljs.core.apply.__3(argh.core.move_to, ctx, cljs.core.first(pts));
  var G__18879__18880 = cljs.core.seq.call(null, cljs.core.rest(pts));
  if(cljs.core.truth_(G__18879__18880)) {
    var G__18882__18884 = cljs.core.first.call(null, G__18879__18880);
    var vec__18883__18885 = G__18882__18884;
    var x__18886 = cljs.core.nth.call(null, vec__18883__18885, 0, null);
    var y__18887 = cljs.core.nth.call(null, vec__18883__18885, 1, null);
    var G__18879__18888 = G__18879__18880;
    var G__18882__18889 = G__18882__18884;
    var G__18879__18890 = G__18879__18888;
    while(true) {
      var vec__18891__18892 = G__18882__18889;
      var x__18893 = cljs.core.nth.call(null, vec__18891__18892, 0, null);
      var y__18894 = cljs.core.nth.call(null, vec__18891__18892, 1, null);
      var G__18879__18895 = G__18879__18890;
      argh.core.line_to(ctx, x__18893, y__18894);
      var temp__3850__auto____18896 = cljs.core.next.call(null, G__18879__18895);
      if(cljs.core.truth_(temp__3850__auto____18896)) {
        var G__18879__18897 = temp__3850__auto____18896;
        var G__18900 = cljs.core.first.call(null, G__18879__18897);
        var G__18901 = G__18879__18897;
        G__18882__18889 = G__18900;
        G__18879__18890 = G__18901;
        continue
      }else {
      }
      break
    }
  }else {
  }
  c__3246__auto____18878.closePath();
  return argh.core.fill(ctx)
};
argh.core.draw_line = function draw_line(ctx, x0, y0, x1, y1) {
  var G__18902__18903 = ctx;
  argh.core.line_width(G__18902__18903, 0.5);
  var G__18904__18905 = G__18902__18903;
  G__18904__18905.beginPath();
  argh.core.move_to(G__18904__18905, x0, y0);
  argh.core.line_to(G__18904__18905, x1, y1);
  G__18904__18905.closePath();
  G__18904__18905;
  argh.core.stroke(G__18902__18903);
  return G__18902__18903
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
      var or__3700__auto____18906 = angle === 0;
      if(or__3700__auto____18906) {
        return or__3700__auto____18906
      }else {
        return angle === argh.core.two_pi
      }
    }()) {
      return 0
    }else {
      if(function() {
        var and__3698__auto____18907 = argh.core.two_pi > angle;
        if(and__3698__auto____18907) {
          return angle > 0
        }else {
          return and__3698__auto____18907
        }
      }()) {
        return angle
      }else {
        if(angle > argh.core.two_pi) {
          var G__18913 = angle - argh.core.two_pi;
          angle = G__18913;
          continue
        }else {
          if(0 > angle) {
            var G__18915 = angle + argh.core.two_pi;
            angle = G__18915;
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
  var a__18917 = argh.core.ensure_circ(angle);
  if(function() {
    var and__3698__auto____18918 = 0 <= a__18917;
    if(and__3698__auto____18918) {
      return a__18917 <= argh.core.half_pi
    }else {
      return and__3698__auto____18918
    }
  }()) {
    return cljs.core.PersistentVector.fromArray([true, true])
  }else {
    if(function() {
      var and__3698__auto____18919 = argh.core.half_pi <= a__18917;
      if(and__3698__auto____18919) {
        return a__18917 <= argh.core.pi
      }else {
        return and__3698__auto____18919
      }
    }()) {
      return cljs.core.PersistentVector.fromArray([true, false])
    }else {
      if(function() {
        var and__3698__auto____18920 = argh.core.pi <= a__18917;
        if(and__3698__auto____18920) {
          return a__18917 <= 3 * argh.core.half_pi
        }else {
          return and__3698__auto____18920
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
  var or__3700__auto____18928 = window.requestAnimationFrame;
  if(cljs.core.truth_(or__3700__auto____18928)) {
    return or__3700__auto____18928
  }else {
    var or__3700__auto____18929 = window.webkitRequestAnimationFrame;
    if(cljs.core.truth_(or__3700__auto____18929)) {
      return or__3700__auto____18929
    }else {
      var or__3700__auto____18930 = window.mozRequestAnimationFrame;
      if(cljs.core.truth_(or__3700__auto____18930)) {
        return or__3700__auto____18930
      }else {
        var or__3700__auto____18931 = window.oRequestAnimationFrame;
        if(cljs.core.truth_(or__3700__auto____18931)) {
          return or__3700__auto____18931
        }else {
          var or__3700__auto____18932 = window.msRequestAnimationFrame;
          if(cljs.core.truth_(or__3700__auto____18932)) {
            return or__3700__auto____18932
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
argh.core.ray_width = 10;
argh.core.fov = 60 * (Math.PI / 180);
argh.core.rays = Math.ceil.call(null, argh.core.screen_width / argh.core.ray_width);
argh.core.view_dist = argh.core.screen_width / 2 / Math.tan.call(null, argh.core.fov / 2);
argh.core.bars = function() {
  var i__18938 = 0;
  var s__18939 = cljs.core.PersistentVector.fromArray([]);
  while(true) {
    if(i__18938 > argh.core.screen_width) {
      return s__18939
    }else {
      var d__18940 = document.createElement("div");
      var img__18941 = new Image;
      var G__18942__18943 = d__18940.style;
      G__18942__18943["position"] = "absolute";
      G__18942__18943["left"] = cljs.core.str(i__18938, "px");
      G__18942__18943["width"] = cljs.core.str(argh.core.ray_width + 1, "px");
      G__18942__18943["overflow"] = "hidden";
      G__18942__18943;
      var G__18944__18945 = img__18941.style;
      G__18944__18945["position"] = "absolute";
      G__18944__18945["left"] = "0px";
      G__18944__18945;
      img__18941.src = "res/wall3.png";
      d__18940.img = img__18941;
      d__18940.appendChild(img__18941);
      argh.core.screen.appendChild(d__18940);
      var G__18947 = i__18938 + argh.core.ray_width;
      var G__18948 = cljs.core.conj.__2(s__18939, d__18940);
      i__18938 = G__18947;
      s__18939 = G__18948;
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
  var this__18952 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Player.prototype.cljs$core$ILookup$ = true;
argh.core.Player.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__18953 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Player.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k18950, else__396__auto__) {
  var this__18954 = this;
  if(k18950 === "\ufdd0'x") {
    return this__18954.x
  }else {
    if(k18950 === "\ufdd0'y") {
      return this__18954.y
    }else {
      if(k18950 === "\ufdd0'rot") {
        return this__18954.rot
      }else {
        if(k18950 === "\ufdd0'move-speed") {
          return this__18954.move_speed
        }else {
          if(k18950 === "\ufdd0'rot-speed") {
            return this__18954.rot_speed
          }else {
            if("\ufdd0'else") {
              return cljs.core.get.call(null, this__18954.__extmap, k18950, else__396__auto__)
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
argh.core.Player.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__18949) {
  var this__18955 = this;
  var pred__18956__18959 = cljs.core.identical_QMARK_;
  var expr__18957__18960 = k__401__auto__;
  if(cljs.core.truth_(pred__18956__18959.call(null, "\ufdd0'x", expr__18957__18960))) {
    return new argh.core.Player(G__18949, this__18955.y, this__18955.rot, this__18955.move_speed, this__18955.rot_speed, this__18955.__meta, this__18955.__extmap)
  }else {
    if(cljs.core.truth_(pred__18956__18959.call(null, "\ufdd0'y", expr__18957__18960))) {
      return new argh.core.Player(this__18955.x, G__18949, this__18955.rot, this__18955.move_speed, this__18955.rot_speed, this__18955.__meta, this__18955.__extmap)
    }else {
      if(cljs.core.truth_(pred__18956__18959.call(null, "\ufdd0'rot", expr__18957__18960))) {
        return new argh.core.Player(this__18955.x, this__18955.y, G__18949, this__18955.move_speed, this__18955.rot_speed, this__18955.__meta, this__18955.__extmap)
      }else {
        if(cljs.core.truth_(pred__18956__18959.call(null, "\ufdd0'move-speed", expr__18957__18960))) {
          return new argh.core.Player(this__18955.x, this__18955.y, this__18955.rot, G__18949, this__18955.rot_speed, this__18955.__meta, this__18955.__extmap)
        }else {
          if(cljs.core.truth_(pred__18956__18959.call(null, "\ufdd0'rot-speed", expr__18957__18960))) {
            return new argh.core.Player(this__18955.x, this__18955.y, this__18955.rot, this__18955.move_speed, G__18949, this__18955.__meta, this__18955.__extmap)
          }else {
            return new argh.core.Player(this__18955.x, this__18955.y, this__18955.rot, this__18955.move_speed, this__18955.rot_speed, this__18955.__meta, cljs.core.assoc.call(null, this__18955.__extmap, k__401__auto__, G__18949))
          }
        }
      }
    }
  }
};
argh.core.Player.prototype.cljs$core$IRecord$ = true;
argh.core.Player.prototype.cljs$core$ICollection$ = true;
argh.core.Player.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__18961 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Player.prototype.cljs$core$ISeqable$ = true;
argh.core.Player.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__18962 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'x", this__18962.x), cljs.core.vector.call(null, "\ufdd0'y", this__18962.y), cljs.core.vector.call(null, "\ufdd0'rot", this__18962.rot), cljs.core.vector.call(null, "\ufdd0'move-speed", this__18962.move_speed), cljs.core.vector.call(null, "\ufdd0'rot-speed", this__18962.rot_speed)]), this__18962.__extmap))
};
argh.core.Player.prototype.cljs$core$IPrintable$ = true;
argh.core.Player.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__18963 = this;
  var pr_pair__409__auto____18964 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____18964, cljs.core.str.call(null, "#", "argh.core.Player", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'x", this__18963.x), cljs.core.vector.call(null, "\ufdd0'y", this__18963.y), cljs.core.vector.call(null, "\ufdd0'rot", this__18963.rot), cljs.core.vector.call(null, "\ufdd0'move-speed", this__18963.move_speed), cljs.core.vector.call(null, "\ufdd0'rot-speed", 
  this__18963.rot_speed)]), this__18963.__extmap))
};
argh.core.Player.prototype.cljs$core$ICounted$ = true;
argh.core.Player.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__18965 = this;
  return 5 + cljs.core.count.call(null, this__18965.__extmap)
};
argh.core.Player.prototype.cljs$core$IEquiv$ = true;
argh.core.Player.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__18966 = this;
  var and__3698__auto____18967 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____18967) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____18967
  }
};
argh.core.Player.prototype.cljs$core$IWithMeta$ = true;
argh.core.Player.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__18949) {
  var this__18968 = this;
  return new argh.core.Player(this__18968.x, this__18968.y, this__18968.rot, this__18968.move_speed, this__18968.rot_speed, G__18949, this__18968.__extmap)
};
argh.core.Player.prototype.cljs$core$IMeta$ = true;
argh.core.Player.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__18969 = this;
  return this__18969.__meta
};
argh.core.Player.prototype.cljs$core$IMap$ = true;
argh.core.Player.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__18970 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'y", "\ufdd0'x", "\ufdd0'rot", "\ufdd0'rot-speed", "\ufdd0'move-speed"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__18970.__meta), k__403__auto__)
  }else {
    return new argh.core.Player(this__18970.x, this__18970.y, this__18970.rot, this__18970.move_speed, this__18970.rot_speed, this__18970.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__18970.__extmap, k__403__auto__)))
  }
};
argh.core.Player.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Player")
};
argh.core.__GT_Player = function __GT_Player(x, y, rot, move_speed, rot_speed) {
  return new argh.core.Player(x, y, rot, move_speed, rot_speed)
};
argh.core.map__GT_Player = function map__GT_Player(G__18951) {
  return new argh.core.Player("\ufdd0'x".call(null, G__18951), "\ufdd0'y".call(null, G__18951), "\ufdd0'rot".call(null, G__18951), "\ufdd0'move-speed".call(null, G__18951), "\ufdd0'rot-speed".call(null, G__18951), null, cljs.core.dissoc.call(null, G__18951, "\ufdd0'x", "\ufdd0'y", "\ufdd0'rot", "\ufdd0'move-speed", "\ufdd0'rot-speed"))
};
argh.core.Player;
argh.core.create_player = function create_player(x, y) {
  return new argh.core.Player(x, y, cljs.core.rand.__0(), 0.08, 3 * (argh.core.pi / 180))
};
argh.core.spawn_player = function spawn_player(p__18985) {
  var map__18986__18987 = p__18985;
  var map__18986__18988 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__18986__18987)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__18986__18987) : map__18986__18987;
  var data__18989 = cljs.core.get.call(null, map__18986__18988, "\ufdd0'data");
  var h__18990 = cljs.core.get.call(null, map__18986__18988, "\ufdd0'h");
  var w__18991 = cljs.core.get.call(null, map__18986__18988, "\ufdd0'w");
  var x__18992 = cljs.core.rand_int(w__18991);
  var y__18993 = cljs.core.rand_int(h__18990);
  while(true) {
    if(0 === cljs.core.nth.__2(data__18989.call(null, y__18993), x__18992)) {
      return argh.core.create_player(x__18992, y__18993)
    }else {
      var G__18995 = cljs.core.rand_int(w__18991);
      var G__18996 = cljs.core.rand_int(h__18990);
      x__18992 = G__18995;
      y__18993 = G__18996;
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
  var this__19000 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Level.prototype.cljs$core$ILookup$ = true;
argh.core.Level.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__19001 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Level.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k18998, else__396__auto__) {
  var this__19002 = this;
  if(k18998 === "\ufdd0'w") {
    return this__19002.w
  }else {
    if(k18998 === "\ufdd0'h") {
      return this__19002.h
    }else {
      if(k18998 === "\ufdd0'data") {
        return this__19002.data
      }else {
        if("\ufdd0'else") {
          return cljs.core.get.call(null, this__19002.__extmap, k18998, else__396__auto__)
        }else {
          return null
        }
      }
    }
  }
};
argh.core.Level.prototype.cljs$core$IAssociative$ = true;
argh.core.Level.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__18997) {
  var this__19003 = this;
  var pred__19004__19007 = cljs.core.identical_QMARK_;
  var expr__19005__19008 = k__401__auto__;
  if(cljs.core.truth_(pred__19004__19007.call(null, "\ufdd0'w", expr__19005__19008))) {
    return new argh.core.Level(G__18997, this__19003.h, this__19003.data, this__19003.__meta, this__19003.__extmap)
  }else {
    if(cljs.core.truth_(pred__19004__19007.call(null, "\ufdd0'h", expr__19005__19008))) {
      return new argh.core.Level(this__19003.w, G__18997, this__19003.data, this__19003.__meta, this__19003.__extmap)
    }else {
      if(cljs.core.truth_(pred__19004__19007.call(null, "\ufdd0'data", expr__19005__19008))) {
        return new argh.core.Level(this__19003.w, this__19003.h, G__18997, this__19003.__meta, this__19003.__extmap)
      }else {
        return new argh.core.Level(this__19003.w, this__19003.h, this__19003.data, this__19003.__meta, cljs.core.assoc.call(null, this__19003.__extmap, k__401__auto__, G__18997))
      }
    }
  }
};
argh.core.Level.prototype.cljs$core$IRecord$ = true;
argh.core.Level.prototype.cljs$core$ICollection$ = true;
argh.core.Level.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__19009 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Level.prototype.cljs$core$ISeqable$ = true;
argh.core.Level.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__19010 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__19010.w), cljs.core.vector.call(null, "\ufdd0'h", this__19010.h), cljs.core.vector.call(null, "\ufdd0'data", this__19010.data)]), this__19010.__extmap))
};
argh.core.Level.prototype.cljs$core$IPrintable$ = true;
argh.core.Level.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__19011 = this;
  var pr_pair__409__auto____19012 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____19012, cljs.core.str.call(null, "#", "argh.core.Level", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'w", this__19011.w), cljs.core.vector.call(null, "\ufdd0'h", this__19011.h), cljs.core.vector.call(null, "\ufdd0'data", this__19011.data)]), this__19011.__extmap))
};
argh.core.Level.prototype.cljs$core$ICounted$ = true;
argh.core.Level.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__19013 = this;
  return 3 + cljs.core.count.call(null, this__19013.__extmap)
};
argh.core.Level.prototype.cljs$core$IEquiv$ = true;
argh.core.Level.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__19014 = this;
  var and__3698__auto____19015 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____19015) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____19015
  }
};
argh.core.Level.prototype.cljs$core$IWithMeta$ = true;
argh.core.Level.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__18997) {
  var this__19016 = this;
  return new argh.core.Level(this__19016.w, this__19016.h, this__19016.data, G__18997, this__19016.__extmap)
};
argh.core.Level.prototype.cljs$core$IMeta$ = true;
argh.core.Level.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__19017 = this;
  return this__19017.__meta
};
argh.core.Level.prototype.cljs$core$IMap$ = true;
argh.core.Level.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__19018 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'data", "\ufdd0'h", "\ufdd0'w"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__19018.__meta), k__403__auto__)
  }else {
    return new argh.core.Level(this__19018.w, this__19018.h, this__19018.data, this__19018.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__19018.__extmap, k__403__auto__)))
  }
};
argh.core.Level.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Level")
};
argh.core.__GT_Level = function __GT_Level(w, h, data) {
  return new argh.core.Level(w, h, data)
};
argh.core.map__GT_Level = function map__GT_Level(G__18999) {
  return new argh.core.Level("\ufdd0'w".call(null, G__18999), "\ufdd0'h".call(null, G__18999), "\ufdd0'data".call(null, G__18999), null, cljs.core.dissoc.call(null, G__18999, "\ufdd0'w", "\ufdd0'h", "\ufdd0'data"))
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
  var this__19033 = this;
  return cljs.core.hash_coll.call(null, this__388__auto__)
};
argh.core.Game.prototype.cljs$core$ILookup$ = true;
argh.core.Game.prototype.cljs$core$ILookup$_lookup__2 = function(this__393__auto__, k__394__auto__) {
  var this__19034 = this;
  return cljs.core._lookup.call(null, this__393__auto__, k__394__auto__, null)
};
argh.core.Game.prototype.cljs$core$ILookup$_lookup__3 = function(this__395__auto__, k19031, else__396__auto__) {
  var this__19035 = this;
  if(k19031 === "\ufdd0'player") {
    return this__19035.player
  }else {
    if(k19031 === "\ufdd0'level") {
      return this__19035.level
    }else {
      if("\ufdd0'else") {
        return cljs.core.get.call(null, this__19035.__extmap, k19031, else__396__auto__)
      }else {
        return null
      }
    }
  }
};
argh.core.Game.prototype.cljs$core$IAssociative$ = true;
argh.core.Game.prototype.cljs$core$IAssociative$_assoc__3 = function(this__400__auto__, k__401__auto__, G__19030) {
  var this__19036 = this;
  var pred__19037__19040 = cljs.core.identical_QMARK_;
  var expr__19038__19041 = k__401__auto__;
  if(cljs.core.truth_(pred__19037__19040.call(null, "\ufdd0'player", expr__19038__19041))) {
    return new argh.core.Game(G__19030, this__19036.level, this__19036.__meta, this__19036.__extmap)
  }else {
    if(cljs.core.truth_(pred__19037__19040.call(null, "\ufdd0'level", expr__19038__19041))) {
      return new argh.core.Game(this__19036.player, G__19030, this__19036.__meta, this__19036.__extmap)
    }else {
      return new argh.core.Game(this__19036.player, this__19036.level, this__19036.__meta, cljs.core.assoc.call(null, this__19036.__extmap, k__401__auto__, G__19030))
    }
  }
};
argh.core.Game.prototype.cljs$core$IRecord$ = true;
argh.core.Game.prototype.cljs$core$ICollection$ = true;
argh.core.Game.prototype.cljs$core$ICollection$_conj__2 = function(this__398__auto__, entry__399__auto__) {
  var this__19042 = this;
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, entry__399__auto__))) {
    return cljs.core._assoc.call(null, this__398__auto__, cljs.core._nth.call(null, entry__399__auto__, 0), cljs.core._nth.call(null, entry__399__auto__, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, this__398__auto__, entry__399__auto__)
  }
};
argh.core.Game.prototype.cljs$core$ISeqable$ = true;
argh.core.Game.prototype.cljs$core$ISeqable$_seq__1 = function(this__405__auto__) {
  var this__19043 = this;
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'player", this__19043.player), cljs.core.vector.call(null, "\ufdd0'level", this__19043.level)]), this__19043.__extmap))
};
argh.core.Game.prototype.cljs$core$IPrintable$ = true;
argh.core.Game.prototype.cljs$core$IPrintable$_pr_seq__2 = function(this__407__auto__, opts__408__auto__) {
  var this__19044 = this;
  var pr_pair__409__auto____19045 = function(keyval__410__auto__) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts__408__auto__, keyval__410__auto__)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__409__auto____19045, cljs.core.str.call(null, "#", "argh.core.Game", "{"), ", ", "}", opts__408__auto__, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, "\ufdd0'player", this__19044.player), cljs.core.vector.call(null, "\ufdd0'level", this__19044.level)]), this__19044.__extmap))
};
argh.core.Game.prototype.cljs$core$ICounted$ = true;
argh.core.Game.prototype.cljs$core$ICounted$_count__1 = function(this__397__auto__) {
  var this__19046 = this;
  return 2 + cljs.core.count.call(null, this__19046.__extmap)
};
argh.core.Game.prototype.cljs$core$IEquiv$ = true;
argh.core.Game.prototype.cljs$core$IEquiv$_equiv__2 = function(this__389__auto__, other__390__auto__) {
  var this__19047 = this;
  var and__3698__auto____19048 = this__389__auto__.constructor === other__390__auto__.constructor;
  if(and__3698__auto____19048) {
    return cljs.core.equiv_map.call(null, this__389__auto__, other__390__auto__)
  }else {
    return and__3698__auto____19048
  }
};
argh.core.Game.prototype.cljs$core$IWithMeta$ = true;
argh.core.Game.prototype.cljs$core$IWithMeta$_with_meta__2 = function(this__392__auto__, G__19030) {
  var this__19049 = this;
  return new argh.core.Game(this__19049.player, this__19049.level, G__19030, this__19049.__extmap)
};
argh.core.Game.prototype.cljs$core$IMeta$ = true;
argh.core.Game.prototype.cljs$core$IMeta$_meta__1 = function(this__391__auto__) {
  var this__19050 = this;
  return this__19050.__meta
};
argh.core.Game.prototype.cljs$core$IMap$ = true;
argh.core.Game.prototype.cljs$core$IMap$_dissoc__2 = function(this__402__auto__, k__403__auto__) {
  var this__19051 = this;
  if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, cljs.core.set(["\ufdd0'player", "\ufdd0'level"]), k__403__auto__))) {
    return cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), this__402__auto__), this__19051.__meta), k__403__auto__)
  }else {
    return new argh.core.Game(this__19051.player, this__19051.level, this__19051.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this__19051.__extmap, k__403__auto__)))
  }
};
argh.core.Game.cljs$core$IPrintable$_pr_seq = function(this__434__auto__) {
  return cljs.core.list.call(null, "argh.core.Game")
};
argh.core.__GT_Game = function __GT_Game(player, level) {
  return new argh.core.Game(player, level)
};
argh.core.map__GT_Game = function map__GT_Game(G__19032) {
  return new argh.core.Game("\ufdd0'player".call(null, G__19032), "\ufdd0'level".call(null, G__19032), null, cljs.core.dissoc.call(null, G__19032, "\ufdd0'player", "\ufdd0'level"))
};
argh.core.Game;
argh.core.check_cell = function check_cell(x, y, p__19060) {
  var map__19061__19062 = p__19060;
  var map__19061__19063 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19061__19062)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19061__19062) : map__19061__19062;
  var data__19064 = cljs.core.get.call(null, map__19061__19063, "\ufdd0'data");
  var h__19065 = cljs.core.get.call(null, map__19061__19063, "\ufdd0'h");
  var w__19066 = cljs.core.get.call(null, map__19061__19063, "\ufdd0'w");
  var and__3698__auto____19068 = function() {
    var and__3698__auto____19067 = -1 < x;
    if(and__3698__auto____19067) {
      return x < w__19066
    }else {
      return and__3698__auto____19067
    }
  }();
  if(cljs.core.truth_(and__3698__auto____19068)) {
    var and__3698__auto____19070 = function() {
      var and__3698__auto____19069 = -1 < y;
      if(and__3698__auto____19069) {
        return y < h__19065
      }else {
        return and__3698__auto____19069
      }
    }();
    if(cljs.core.truth_(and__3698__auto____19070)) {
      return cljs.core.nth.__2(cljs.core.nth.__2(data__19064, y), x) === 0
    }else {
      return and__3698__auto____19070
    }
  }else {
    return and__3698__auto____19068
  }
};
argh.core.check_neighbors = function check_neighbors(x, y, l) {
  return cljs.core.count(function() {
    var iter__531__auto____19087 = function iter__19075(s__19076) {
      return new cljs.core.LazySeq(null, false, function() {
        var s__19076__19079 = s__19076;
        while(true) {
          if(cljs.core.truth_(cljs.core.seq.call(null, s__19076__19079))) {
            var dx__19080 = cljs.core.first.call(null, s__19076__19079);
            var iterys__529__auto____19085 = function(s__19076__19079, dx__19080) {
              return function iter__19077(s__19078) {
                return new cljs.core.LazySeq(null, false, function(s__19076__19079, dx__19080) {
                  return function() {
                    var s__19078__19081 = s__19078;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__19078__19081))) {
                        var dy__19082 = cljs.core.first.call(null, s__19078__19081);
                        if(cljs.core.truth_(function() {
                          var and__3698__auto____19084 = cljs.core.not(function() {
                            var and__3698__auto____19083 = dx__19080 === dy__19082;
                            if(and__3698__auto____19083) {
                              return dy__19082 === 0
                            }else {
                              return and__3698__auto____19083
                            }
                          }());
                          if(cljs.core.truth_(and__3698__auto____19084)) {
                            return argh.core.check_cell(x + dx__19080, y + dy__19082, l)
                          }else {
                            return and__3698__auto____19084
                          }
                        }())) {
                          return cljs.core.cons.call(null, 1, iter__19077.call(null, cljs.core.rest.call(null, s__19078__19081)))
                        }else {
                          var G__19093 = cljs.core.rest.call(null, s__19078__19081);
                          s__19078__19081 = G__19093;
                          continue
                        }
                      }else {
                        return null
                      }
                      break
                    }
                  }
                }(s__19076__19079, dx__19080))
              }
            }(s__19076__19079, dx__19080);
            var fs__530__auto____19086 = cljs.core.seq.call(null, iterys__529__auto____19085.call(null, cljs.core.range.__2(-1, 2)));
            if(cljs.core.truth_(fs__530__auto____19086)) {
              return cljs.core.concat.call(null, fs__530__auto____19086, iter__19075.call(null, cljs.core.rest.call(null, s__19076__19079)))
            }else {
              var G__19095 = cljs.core.rest.call(null, s__19076__19079);
              s__19076__19079 = G__19095;
              continue
            }
          }else {
            return null
          }
          break
        }
      })
    };
    return iter__531__auto____19087.call(null, cljs.core.range.__2(-1, 2))
  }())
};
argh.core.level_generate = function level_generate(w, h, prob, op, n, its) {
  var i__19098 = 0;
  var l__19099 = argh.core.rand_level(w, h, prob);
  while(true) {
    if(i__19098 > its) {
      return l__19099
    }else {
      var x__19100 = cljs.core.rand_int(w);
      var y__19101 = cljs.core.rand_int(h);
      var G__19103 = i__19098 + 1;
      var G__19104 = cljs.core.assoc_in(l__19099, cljs.core.PersistentVector.fromArray(["\ufdd0'data", y__19101, x__19100]), cljs.core.truth_(cljs.core.not_EQ_.__2(op, argh.core.check_neighbors(x__19100, y__19101, l__19099) < n)) ? 0 : 1);
      i__19098 = G__19103;
      l__19099 = G__19104;
      continue
    }
    break
  }
};
argh.core.new_cave = function new_cave(w, h) {
  return cljs.core.update_in(argh.core.level_generate(w, h, 0.85, true, 6, 2E4), cljs.core.PersistentVector.fromArray(["\ufdd0'data"]), function(data) {
    return cljs.core.reduce.__3(function(v, p__19105) {
      var vec__19106__19107 = p__19105;
      var x__19108 = cljs.core.nth.call(null, vec__19106__19107, 0, null);
      var y__19109 = cljs.core.nth.call(null, vec__19106__19107, 1, null);
      return cljs.core.assoc_in(v, cljs.core.PersistentVector.fromArray([y__19109, x__19108]), 2)
    }, data, cljs.core.concat.__2(cljs.core.mapcat.__2(function(p1__19096_SHARP_) {
      return cljs.core.vector(cljs.core.PersistentVector.fromArray([0, p1__19096_SHARP_]), cljs.core.PersistentVector.fromArray([w - 1, p1__19096_SHARP_]))
    }, cljs.core.range.__1(h)), cljs.core.mapcat.__2(function(p1__19097_SHARP_) {
      return cljs.core.vector(cljs.core.PersistentVector.fromArray([p1__19097_SHARP_, 0]), cljs.core.PersistentVector.fromArray([p1__19097_SHARP_, h - 1]))
    }, cljs.core.range.__1(w))))
  })
};
argh.core.new_game = function new_game() {
  var lvl__19110 = argh.core.new_cave(60, 60);
  return new argh.core.Game(argh.core.spawn_player(lvl__19110), lvl__19110)
};
argh.core.free_QMARK_ = function free_QMARK_(p__19111, x, y) {
  var level__19112 = p__19111;
  var level__19113 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, level__19112)) ? cljs.core.apply.call(null, cljs.core.hash_map, level__19112) : level__19112;
  var data__19114 = cljs.core.get.call(null, level__19113, "\ufdd0'data");
  var h__19115 = cljs.core.get.call(null, level__19113, "\ufdd0'h");
  var w__19116 = cljs.core.get.call(null, level__19113, "\ufdd0'w");
  var and__3698__auto____19117 = cljs.core.not(x < 0);
  if(cljs.core.truth_(and__3698__auto____19117)) {
    var and__3698__auto____19118 = cljs.core.not(y < 0);
    if(cljs.core.truth_(and__3698__auto____19118)) {
      var and__3698__auto____19119 = h__19115 > y;
      if(and__3698__auto____19119) {
        var and__3698__auto____19120 = w__19116 > x;
        if(and__3698__auto____19120) {
          return cljs.core.nth.__2(cljs.core.nth.__2(data__19114, Math.floor.call(null, y)), Math.floor.call(null, x)) === 0
        }else {
          return and__3698__auto____19120
        }
      }else {
        return and__3698__auto____19119
      }
    }else {
      return and__3698__auto____19118
    }
  }else {
    return and__3698__auto____19117
  }
};
argh.core.move_STAR_ = function move_STAR_(p__19125, dx, dy) {
  var gs__19126 = p__19125;
  var gs__19127 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, gs__19126)) ? cljs.core.apply.call(null, cljs.core.hash_map, gs__19126) : gs__19126;
  var player__19128 = cljs.core.get.call(null, gs__19127, "\ufdd0'player");
  var player__19129 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__19128)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__19128) : player__19128;
  var y__19130 = cljs.core.get.call(null, player__19129, "\ufdd0'y");
  var x__19131 = cljs.core.get.call(null, player__19129, "\ufdd0'x");
  var l__19132 = cljs.core.get.call(null, gs__19127, "\ufdd0'level");
  if(cljs.core.truth_(argh.core.free_QMARK_(l__19132, dx + x__19131, dy + y__19130))) {
    return cljs.core.assoc_in(cljs.core.assoc_in(gs__19127, cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'x"]), dx + x__19131), cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'y"]), dy + y__19130)
  }else {
    return gs__19127
  }
};
argh.core.move_player = function move_player(p__19134, input) {
  var game_state__19135 = p__19134;
  var game_state__19136 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, game_state__19135)) ? cljs.core.apply.call(null, cljs.core.hash_map, game_state__19135) : game_state__19135;
  var player__19137 = cljs.core.get.call(null, game_state__19136, "\ufdd0'player");
  var player__19138 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__19137)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__19137) : player__19137;
  var rot__19139 = cljs.core.get.call(null, player__19138, "\ufdd0'rot");
  var rot_speed__19140 = cljs.core.get.call(null, player__19138, "\ufdd0'rot-speed");
  var move_speed__19141 = cljs.core.get.call(null, player__19138, "\ufdd0'move-speed");
  var y__19142 = cljs.core.get.call(null, player__19138, "\ufdd0'y");
  var x__19143 = cljs.core.get.call(null, player__19138, "\ufdd0'x");
  var speed__19144 = cljs.core.truth_(input.call(null, "\ufdd0'down")) ? -1 : cljs.core.truth_(input.call(null, "\ufdd0'up")) ? 1 : "\ufdd0'else" ? 0 : null;
  var dir__19145 = cljs.core.truth_(input.call(null, "\ufdd0'left")) ? -1 : cljs.core.truth_(input.call(null, "\ufdd0'right")) ? 1 : "\ufdd0'else" ? 0 : null;
  var move_step__19146 = speed__19144 * move_speed__19141;
  var rot__19147 = argh.core.ensure_circ(rot__19139 + dir__19145 * rot_speed__19140);
  return argh.core.move_STAR_(argh.core.move_STAR_(cljs.core.assoc_in(game_state__19136, cljs.core.PersistentVector.fromArray(["\ufdd0'player", "\ufdd0'rot"]), rot__19147), move_step__19146 * Math.cos.call(null, rot__19147), 0), 0, move_step__19146 * Math.sin.call(null, rot__19147))
};
argh.core.decode = cljs.core.HashMap.fromArrays([27, 38, 40, 37, 39], ["\ufdd0'escape", "\ufdd0'up", "\ufdd0'down", "\ufdd0'left", "\ufdd0'right"]);
argh.core.render = function render(p__19148) {
  var game_state__19150 = p__19148;
  var game_state__19151 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, game_state__19150)) ? cljs.core.apply.call(null, cljs.core.hash_map, game_state__19150) : game_state__19150;
  var player__19152 = cljs.core.get.call(null, game_state__19151, "\ufdd0'player");
  var player__19153 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, player__19152)) ? cljs.core.apply.call(null, cljs.core.hash_map, player__19152) : player__19152;
  var px__19154 = cljs.core.get.call(null, player__19153, "\ufdd0'x");
  var py__19155 = cljs.core.get.call(null, player__19153, "\ufdd0'y");
  var rot__19156 = cljs.core.get.call(null, player__19153, "\ufdd0'rot");
  var map__19149__19157 = cljs.core.get.call(null, game_state__19151, "\ufdd0'level");
  var map__19149__19158 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19149__19157)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19149__19157) : map__19149__19157;
  var data__19159 = cljs.core.get.call(null, map__19149__19158, "\ufdd0'data");
  var h__19160 = cljs.core.get.call(null, map__19149__19158, "\ufdd0'h");
  var w__19161 = cljs.core.get.call(null, map__19149__19158, "\ufdd0'w");
  var scale__19162 = argh.core.screen_width / w__19161 < argh.core.screen_height / h__19160 ? argh.core.screen_width / w__19161 : argh.core.screen_height / h__19160;
  var n__586__auto____19163 = argh.core.rays;
  var num__19164 = 0;
  while(true) {
    if(num__19164 < n__586__auto____19163) {
      var scrpos__19169 = argh.core.ray_width * (num__19164 + argh.core.rays / -2);
      var vdist__19170 = Math.sqrt.call(null, argh.core.hypot(scrpos__19169, argh.core.view_dist));
      var angle__19171 = rot__19156 + Math.asin.call(null, scrpos__19169 / vdist__19170);
      var scale__19172 = argh.core.screen_width / w__19161 < argh.core.screen_height / h__19160 ? argh.core.screen_width / w__19161 : argh.core.screen_height / h__19160;
      var cast_out__19180 = function(num__19164) {
        return function(x, y, dx, dy, dwx, dwy) {
          var x__19173 = x;
          var y__19174 = y;
          while(true) {
            if(cljs.core.truth_(cljs.core.not.call(null, function() {
              var and__3698__auto____19176 = function() {
                var and__3698__auto____19175 = 0 < x__19173;
                if(and__3698__auto____19175) {
                  return x__19173 < w__19161
                }else {
                  return and__3698__auto____19175
                }
              }();
              if(cljs.core.truth_(and__3698__auto____19176)) {
                var and__3698__auto____19177 = 0 < y__19174;
                if(and__3698__auto____19177) {
                  return y__19174 < h__19160
                }else {
                  return and__3698__auto____19177
                }
              }else {
                return and__3698__auto____19176
              }
            }()))) {
              return cljs.core.PersistentVector.fromArray([x__19173, y__19174, 0, 0])
            }else {
              var wx__19178 = Math.floor.call(null, dwx + x__19173);
              var wy__19179 = Math.floor.call(null, dwy + y__19174);
              if(cljs.core.nth.__2(cljs.core.nth.__2(data__19159, wy__19179), wx__19178) > 0) {
                return cljs.core.PersistentVector.fromArray([x__19173, y__19174, argh.core.hypot(x__19173 - px__19154, y__19174 - py__19155), cljs.core.nth.__2(cljs.core.nth.__2(data__19159, wy__19179), wx__19178), x__19173 % 1, y__19174 % 1])
              }else {
                var G__19225 = x__19173 + dx;
                var G__19226 = y__19174 + dy;
                x__19173 = G__19225;
                y__19174 = G__19226;
                continue
              }
            }
            break
          }
        }
      }(num__19164);
      var vec__19165__19181 = argh.core.up_right(angle__19171);
      var up_QMARK___19182 = cljs.core.nth.call(null, vec__19165__19181, 0, null);
      var right_QMARK___19183 = cljs.core.nth.call(null, vec__19165__19181, 1, null);
      var slope__19184 = Math.tan.call(null, angle__19171);
      var x__19185 = cljs.core.truth_(right_QMARK___19183) ? Math.ceil.call(null, px__19154) : Math.floor.call(null, px__19154);
      var vec__19166__19186 = cast_out__19180.call(null, x__19185, py__19155 + (x__19185 - px__19154) * slope__19184, cljs.core.truth_(right_QMARK___19183) ? 1 : -1, (cljs.core.truth_(right_QMARK___19183) ? 1 : -1) * slope__19184, cljs.core.truth_(right_QMARK___19183) ? 0 : -1, 0);
      var xhit1__19187 = cljs.core.nth.call(null, vec__19166__19186, 0, null);
      var yhit1__19188 = cljs.core.nth.call(null, vec__19166__19186, 1, null);
      var hitdist1__19189 = cljs.core.nth.call(null, vec__19166__19186, 2, null);
      var wall1__19190 = cljs.core.nth.call(null, vec__19166__19186, 3, null);
      var ___19191 = cljs.core.nth.call(null, vec__19166__19186, 4, null);
      var xtxt1__19192 = cljs.core.nth.call(null, vec__19166__19186, 5, null);
      var hit1__19193 = vec__19166__19186;
      var y__19194 = cljs.core.truth_(up_QMARK___19182) ? Math.ceil.call(null, py__19155) : Math.floor.call(null, py__19155);
      var vec__19167__19195 = cast_out__19180.call(null, px__19154 + (y__19194 - py__19155) / slope__19184, y__19194, (cljs.core.truth_(up_QMARK___19182) ? 1 : -1) / slope__19184, cljs.core.truth_(up_QMARK___19182) ? 1 : -1, 0, cljs.core.truth_(up_QMARK___19182) ? 0 : -1);
      var xhit2__19196 = cljs.core.nth.call(null, vec__19167__19195, 0, null);
      var yhit2__19197 = cljs.core.nth.call(null, vec__19167__19195, 1, null);
      var hitdist2__19198 = cljs.core.nth.call(null, vec__19167__19195, 2, null);
      var wall2__19199 = cljs.core.nth.call(null, vec__19167__19195, 3, null);
      var xtxt2__19200 = cljs.core.nth.call(null, vec__19167__19195, 4, null);
      var ___19201 = cljs.core.nth.call(null, vec__19167__19195, 5, null);
      var hit2__19202 = vec__19167__19195;
      var vert_QMARK___19205 = function() {
        var or__3700__auto____19203 = hitdist1__19189 === 0;
        if(or__3700__auto____19203) {
          return or__3700__auto____19203
        }else {
          var and__3698__auto____19204 = hitdist2__19198 > 0;
          if(and__3698__auto____19204) {
            return hitdist2__19198 < hitdist1__19189
          }else {
            return and__3698__auto____19204
          }
        }
      }();
      var xtxt__19206 = cljs.core.truth_(vert_QMARK___19205) ? xtxt2__19200 : xtxt1__19192;
      var vec__19168__19207 = cljs.core.truth_(vert_QMARK___19205) ? hit2__19202 : hit1__19193;
      var xhit__19208 = cljs.core.nth.call(null, vec__19168__19207, 0, null);
      var yhit__19209 = cljs.core.nth.call(null, vec__19168__19207, 1, null);
      var hitdist__19210 = cljs.core.nth.call(null, vec__19168__19207, 2, null);
      var wall__19211 = cljs.core.nth.call(null, vec__19168__19207, 3, null);
      if(hitdist__19210 === 0) {
      }else {
        var s__19212 = cljs.core.nth.__2(argh.core.bars, num__19164);
        var d__19213 = Math.cos.call(null, rot__19156 - angle__19171) * Math.sqrt.call(null, hitdist__19210);
        var ht__19214 = Math.round.call(null, argh.core.view_dist / d__19213);
        var wd__19215 = ht__19214 * argh.core.ray_width;
        var top__19216 = Math.round.call(null, (argh.core.screen_height - ht__19214) / 2);
        var tx__19217 = xtxt__19206 * wd__19215;
        var bar__19218 = cljs.core.nth.__2(argh.core.bars, num__19164);
        bar__19218.style.cssText = ["position: absolute; left: ", num__19164 * argh.core.ray_width, "px; height: ", ht__19214, "px; width:", argh.core.ray_width + 1, "px; top: ", top__19216, "px; overflow: hidden"].join("");
        bar__19218.img.style.cssText = ["position: absolute; height: ", ht__19214, "px; width: ", wd__19215 * 2, "px; left: ", -tx__19217, "px; top: 0px;"].join("")
      }
      var G__19230 = num__19164 + 1;
      num__19164 = G__19230;
      continue
    }else {
      return null
    }
    break
  }
};
argh.core.draw_minimap = function draw_minimap(p__19231, cvs) {
  var map__19232__19235 = p__19231;
  var map__19232__19236 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19232__19235)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19232__19235) : map__19232__19235;
  var map__19233__19237 = cljs.core.get.call(null, map__19232__19236, "\ufdd0'player");
  var map__19233__19238 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19233__19237)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19233__19237) : map__19233__19237;
  var px__19239 = cljs.core.get.call(null, map__19233__19238, "\ufdd0'x");
  var py__19240 = cljs.core.get.call(null, map__19233__19238, "\ufdd0'y");
  var r__19241 = cljs.core.get.call(null, map__19233__19238, "\ufdd0'rot");
  var map__19234__19242 = cljs.core.get.call(null, map__19232__19236, "\ufdd0'level");
  var map__19234__19243 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19234__19242)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19234__19242) : map__19234__19242;
  var data__19244 = cljs.core.get.call(null, map__19234__19243, "\ufdd0'data");
  var h__19245 = cljs.core.get.call(null, map__19234__19243, "\ufdd0'h");
  var w__19246 = cljs.core.get.call(null, map__19234__19243, "\ufdd0'w");
  var ctx__19247 = argh.core.context(cvs);
  var scale__19248 = cvs.width / w__19246 < cvs.height / h__19245 ? cvs.width / w__19246 : cvs.height / h__19245;
  argh.core.clear.__2(cvs, "white");
  var n__586__auto____19249 = h__19245;
  var j__19250 = 0;
  while(true) {
    if(j__19250 < n__586__auto____19249) {
      var row__19251 = cljs.core.nth.__2(data__19244, j__19250);
      var n__586__auto____19252 = w__19246;
      var i__19253 = 0;
      while(true) {
        if(i__19253 < n__586__auto____19252) {
          var G__19254__19255 = ctx__19247;
          argh.core.fill_style(G__19254__19255, cljs.core.PersistentVector.fromArray(["white", "gray", "black"]).call(null, row__19251.call(null, i__19253)));
          argh.core.fill_rect(G__19254__19255, i__19253 * scale__19248, j__19250 * scale__19248, scale__19248, scale__19248);
          G__19254__19255;
          var G__19258 = i__19253 + 1;
          i__19253 = G__19258;
          continue
        }else {
        }
        break
      }
      var G__19259 = j__19250 + 1;
      j__19250 = G__19259;
      continue
    }else {
      return null
    }
    break
  }
};
argh.core.draw_ents = function draw_ents(p__19260, cvs) {
  var map__19261__19264 = p__19260;
  var map__19261__19265 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19261__19264)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19261__19264) : map__19261__19264;
  var map__19262__19266 = cljs.core.get.call(null, map__19261__19265, "\ufdd0'player");
  var map__19262__19267 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19262__19266)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19262__19266) : map__19262__19266;
  var px__19268 = cljs.core.get.call(null, map__19262__19267, "\ufdd0'x");
  var py__19269 = cljs.core.get.call(null, map__19262__19267, "\ufdd0'y");
  var r__19270 = cljs.core.get.call(null, map__19262__19267, "\ufdd0'rot");
  var map__19263__19271 = cljs.core.get.call(null, map__19261__19265, "\ufdd0'level");
  var map__19263__19272 = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, map__19263__19271)) ? cljs.core.apply.call(null, cljs.core.hash_map, map__19263__19271) : map__19263__19271;
  var data__19273 = cljs.core.get.call(null, map__19263__19272, "\ufdd0'data");
  var h__19274 = cljs.core.get.call(null, map__19263__19272, "\ufdd0'h");
  var w__19275 = cljs.core.get.call(null, map__19263__19272, "\ufdd0'w");
  var scale__19276 = cvs.width / w__19275 < cvs.height / h__19274 ? cvs.width / w__19275 : cvs.height / h__19274;
  argh.core.clear.__1(cvs);
  var G__19277__19278 = argh.core.context(cvs);
  argh.core.fill_style(G__19277__19278, "black");
  argh.core.stroke_style(G__19277__19278, "black");
  argh.core.fill_rect(G__19277__19278, px__19268 * scale__19276 - 2, py__19269 * scale__19276 - 2, 4, 4);
  return G__19277__19278
};
argh.core.tick = function tick(game, input) {
  return argh.core.move_player(game, input)
};
argh.core.last_tick = cljs.core.atom.__1((new Date).getTime());
argh.core.game_loop = function game_loop() {
  if(cljs.core.truth_("\ufdd0'escape".call(null, cljs.core.deref.call(null, argh.core.input)))) {
    return null
  }else {
    var current_tick__19281 = (new Date).getTime();
    var fps__19282 = 1E3 / (current_tick__19281 - cljs.core.deref.call(null, argh.core.last_tick));
    var needed__19283 = argh.core.goal_fps / 1E3 * (current_tick__19281 - cljs.core.deref.call(null, argh.core.last_tick));
    argh.core.show_fps(fps__19282);
    cljs.core.swap_BANG_.__2(argh.core.game, function(p1__19279_SHARP_) {
      var n__19284 = needed__19283;
      var g__19285 = p1__19279_SHARP_;
      while(true) {
        if(0 < n__19284) {
          var G__19288 = n__19284 - 1;
          var G__19289 = argh.core.tick(g__19285, cljs.core.deref.call(null, argh.core.input));
          n__19284 = G__19288;
          g__19285 = G__19289;
          continue
        }else {
          return g__19285
        }
        break
      }
    });
    cljs.core.reset_BANG_(argh.core.last_tick, (new Date).getTime());
    argh.core.render(cljs.core.deref.call(null, argh.core.game), argh.core.screen);
    argh.core.draw_ents(cljs.core.deref.call(null, argh.core.game), argh.core.ent_canv);
    return argh.core.animate.call(null, game_loop)
  }
};
argh.core.start_listening = function start_listening() {
  var on_key__19290 = function(p1__19280_SHARP_) {
    return function(e) {
      cljs.core.swap_BANG_.__3(argh.core.input, p1__19280_SHARP_, argh.core.decode.call(null, e.keyCode));
      return e.preventDefault()
    }
  };
  document.onkeydown = on_key__19290.call(null, cljs.core.conj);
  return document.onkeyup = on_key__19290.call(null, cljs.core.disj)
};
argh.core.start_listening();
cljs.core.reset_BANG_(argh.core.game, argh.core.new_game());
argh.core.draw_minimap(cljs.core.deref.call(null, argh.core.game), argh.core.map_canv);
argh.core.animate.call(null, argh.core.game_loop);
