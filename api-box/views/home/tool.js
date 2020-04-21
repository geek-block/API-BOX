function encrypt (word, keyStr) {
  if (!keyStr) {
    keyStr = 'abcdefgabcdefg12'
  }
  var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
}
function encryptInterfaceTest (word) {
    var key  = CryptoJS.enc.Latin1.parse('SPxA9kAdss5yyeEH');
    var iv   = CryptoJS.enc.Latin1.parse('LXQqqeslloZL11vx');
    var encrypted = CryptoJS.AES.encrypt(word, key, {iv:iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
    return encrypted.toString()
}
// decrypt
function decryptInterfaceTest (word) {
    var key  = CryptoJS.enc.Latin1.parse('SPxA9kAdss5yyeEH');
    var iv   = CryptoJS.enc.Latin1.parse('LXQqqeslloZL11vx');
    let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
// 获取cookie
function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return (arr[2])
  } else {
    return null
  }
}

// 设置cookie,增加到vue实例方便全局调用
function setCookie (cName, value, expiredays) {
  var date = new Date()
  date.setTime(date.getTime() + expiredays)
  document.cookie = cName + '=' + escape(value) + ';expires=' + date.toGMTString()
}

// 删除cookie
function delCookie (name) {
  var date = new Date()
  date.setTime(date.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + date.toGMTString()
  }
}