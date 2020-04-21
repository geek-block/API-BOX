# API BOX使用手册

## 介绍

### 如何使用

### 
API BOX官方使用手册。

# 加密模式
您可以在配置文件中选择是否启用加密模式。
在加密模式下用户可以根据secret参数选择是否对请求参数进行加密，具体查看[使用手册](使用手册.md)。
### 第1步：编辑配置文件
```
$ vim conf/http.conf
```
### 第2步：添加配置
```
enableSecret = true
aesKey = SPxA9kAdss5yyeEH
ivKey = LXQqqeslloZL11vx
```
注：当enableSecret的值为true时，aesKey和ivKey必须是长度为16位的随机字符串。
### 第3步：重启服务
在Linux / Unix / Mac平台上，运行以下命令以重启服务状态：
```
$ sh box_server.sh restart
```
在Windows平台上，您可以关闭窗口并重新打开以重启服务状态。

# 启用HTTPS
您可以在配置文件中选择是否启用HTTPS服务器。
### 第1步：编辑配置文件
```
$ vim conf/http.conf
```
### 第2步：添加配置
```
enableHTTPS = true
enableHttpTLS = true
hTTPSPort = 18443
hTTPSCertFile = "conf/server.crt"
hTTPSKeyFile = "conf/server.key"
```
 - hTTPSPort为HTTPS服务器的端口，默认使用18443端口。
 - hTTPSCertFile和hTTPSKeyFile分别为证书文件和私钥，具体查看[使用手册](使用手册.md)。

### 第3步：重启服务
在Linux / Unix / Mac平台上，运行以下命令以重启服务状态：
```
$ sh box_server.sh restart
```
在Windows平台上，您可以关闭窗口并重新打开以重启服务状态。

您可以访问地址(https://localhost:18443)开始使用API BOX。

# 一、API BOX授权申请
首次使用API BOX需要进行授权。授权信息绑定机器码，如更换机器请重新申请。
### 1.1、获取申请码
点击获取申请码，将授权码发送到我们的邮箱(support@geek-block.com)，请耐心等待我们的回复。  
获取申请码：
![获取申请码](doc/获取申请码.png "获取申请码")

### 1.2、提交授权码
将回复邮件中的授权码复制到输入框中，并点击提交授权码。提交成功后，您可以在页面看到授权的信息。
![提交授权码](doc/提交授权码.png "提交授权码")

# 二、获取API
您有以下两种途径获取API。

## 2.1、在线获取
如果您的API BOX处于在线状态，您可以使用下载功能以获取API。  
使用下载功能前，您必须登录到API STORE。您可以点击登录按钮进行登录页面，在此页面请输入您的API STORE账号信息。  
登录页面：
![登录](doc/登录页面1.png "登录")
个人中心：
![个人中心](doc/个人中心.png "个人中心")
登录成功后，您可以在个人中心查看用户信息。
### 2.1.1、下载API
点击下载按钮以进入下载页面，您可以在本页面下载您购买过的线下API。  
下载页面：
![下载](doc/下载页面.png "下载")
### 2.1.2、更新API
当下载页面的列表提示“update”时，您可以点击更新按钮以获取最新版的API。
![更新](doc/更新API.png "更新")

## 2.2、离线获取
如果您的API BOX处于离线状态（无法连接到[官方网站](https://www.geek-block.com)），您可以从[官方网站](https://www.geek-block.com)下载获取API，从官方网站下载后缀名为“.zb”的API离线包。  
API STORE下载API：
![下载zb](doc/下载zb.png "下载zb")

### 2.2.1、添加API
点击添加按钮以进入添加页面，您可以在本页面添加您获取的API离线包。
添加API：
![添加API](doc/添加API.png "添加API")
添加成功：
![添加成功](doc/添加成功.png "添加成功")
添加成功后，您可以在列表查看刚添加的API。
# 三、API使用示例
API BOX以Restful API的形式对外提供服务，您可以使用HTTP或HTTPS协议来调用服务。  
阅读前请先启动API BOX Server，下面以鼎甲作业列表-示例API作为例子说明。

## 3.1、API详情
您可以从[API BOX首页](http://localhost:18008)进行我的数据接口页面，点击查看详情按钮以查看API的详情介绍。  
我的数据接口：
![查看详情](doc/查看详情.png "查看详情")
详情页面：
![详情页面](doc/详情页面.png "详情页面")
在此页面您可以查看API调用的请求参数说明。   

## 3.2、调用API
您可以通过发起HTTP或HTTPS请求来调用API服务。  
使用命令发起请求：
```
$ curl -i -X POST -H 'Content-type':'application/x-www-form-urlencoded' -d "host=1.1.1.1&port=80&username=username&password=password&sort=start_time&order=desc&pageNum=1&pageSize=5&protocol=http&hostState=all" http://localhost:18008/web/api/dbbackup_jobs_example
```
您也可以使用代码发起请求，下面是JAVA版和Golang版的调用示例。  
### 3.2.1、JAVA版：
#### 第一步：修改请求地址和请求方式
```
// 这里请修改为接口的调用地址
public static final String REQUEST_URL = "http://localhost:18008/web/api/dbbackup_jobs_example";
// 这里请修改为接口的请求方式
public static final String REQUEST_METHOD = "POST";
```

#### 第二步：修改参数
根据文档修改请求参数：
```
Map<String, Object> params = new HashMap<String, Object>();
// 以下参数为示例API所用，请根据实际情况填写正确的参数
params.put("host", "1.1.1.1");
params.put("port", "80");
params.put("username", "username");
params.put("password", "password");
params.put("sort", "start_time");
params.put("order", "desc");
params.put("pageNum", "1");
params.put("pageSize", "5");
params.put("protocol", "http");
params.put("hostState", "all");
```

#### 第三步：调用服务

**发送请求：**
```
// 调用
String result = call(params);
System.out.println(result);
```

**调用方法：**
```
public static String call(Map<String, Object> params) throws Exception {
    HttpURLConnection conn = null;
    String result = null;
    try {
        String strUrl = REQUEST_URL;
        URL url = new URL(strUrl);
        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(REQUEST_METHOD);
        conn.setRequestProperty("User-agent", userAgent);
        conn.setUseCaches(false);
        conn.setConnectTimeout(DEF_CONN_TIMEOUT);
        conn.setReadTimeout(DEF_READ_TIMEOUT);
        conn.setInstanceFollowRedirects(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.connect();
        OutputStream out = conn.getOutputStream();
        out.write(urlEncode(params).getBytes());
        out.flush();
        result = stream2String(conn.getInputStream());
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (conn != null) {
            conn.disconnect();
        }
    }
    return result;
}
```

**完整代码：**
```
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * JAVA示例代码
 * @author 北京智博万维科技有限公司
 */
public class JavaExamplePost {

    public static final String DEF_CHARSET = "utf-8";
    public static final int DEF_CONN_TIMEOUT = 30000;
    public static final int DEF_READ_TIMEOUT = 30000;
    public static final String userAgent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36";
    
    // 这里请修改为接口的调用地址
    public static final String REQUEST_URL = "http://localhost:18008/web/api/dbbackup_jobs_example";

    public static final String REQUEST_METHOD = "POST";

    public static void main(String[] args) {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            // 以下参数为示例API所用，请根据实际情况填写正确的参数
            params.put("host", "1.1.1.1");
            params.put("port", "80");
            params.put("username", "username");
            params.put("password", "password");
            params.put("sort", "start_time");
            params.put("order", "desc");
            params.put("pageNum", "1");
            params.put("pageSize", "5");
            params.put("protocol", "http");
            params.put("hostState", "all");

            // 调用
            String result = call(params);
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 调用API
     *
     * @param strUrl 请求地址
     * @param params 请求参数
     * @param method 请求方法
     * @return 请求返回值
     * @throws Exception
     */
     public static String call(Map<String, Object> params) throws Exception {
        HttpURLConnection conn = null;
        String result = null;
        try {
            String strUrl = REQUEST_URL;
            URL url = new URL(strUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod(REQUEST_METHOD);
            conn.setRequestProperty("User-agent", userAgent);
            conn.setUseCaches(false);
            conn.setConnectTimeout(DEF_CONN_TIMEOUT);
            conn.setReadTimeout(DEF_READ_TIMEOUT);
            conn.setInstanceFollowRedirects(false);
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.connect();
            OutputStream out = conn.getOutputStream();
            out.write(urlEncode(params).getBytes());
            out.flush();
            result = stream2String(conn.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        return result;
    }

    /**
     * 将返回结果为字符串型的API的返回结果数据流转为字符串
     *
     * @param in 调用API获得的返回结果数据流
     * @return 返回结果字符串
     */
     public static String stream2String(InputStream in) {
        String ret = null;
        try {
            StringBuffer sb = new StringBuffer();
            BufferedReader reader = new BufferedReader(new InputStreamReader(in, DEF_CHARSET));
            String strRead = null;
            while ((strRead = reader.readLine()) != null) {
                sb.append(strRead);
            }
            ret = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    /**
     * 将Map型转为请求参数型
     *
     * @param data 参数Map
     * @return
     * @throws UnsupportedEncodingException
     */
    public static String urlEncode(Map<String, Object> data) throws UnsupportedEncodingException {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, Object> i : data.entrySet()) {
            sb.append("&").append(i.getKey()).append("=").append(URLEncoder.encode(i.getValue() + "", "utf-8"));
        }
        sb.delete(0, 1);
        return sb.toString();
    }
}
```
### 3.2.2、Golang版：
#### 第一步：修改请求地址
```
// 这里请修改为接口的调用地址
url := "http://localhost:18008/web/api/dbbackup_jobs_example"
```

#### 第二步：修改参数
根据文档修改请求参数：
```
// 请求参数
values := url.Values{
    "host":      {"1.1.1.1"},
    "port":      {"80"},
    "username":  {"username"},
    "password":  {"password"},
    "sort":      {"start_time"},
    "order":     {"desc"},
    "pageNum":   {"1"},
    "pageSize":  {"5"},
    "protocol":  {"http"},
    "hostState": {"all"},
}
```

#### 第三步：调用服务

**发送请求：**
```
// 调用服务
resp, err := http.PostForm(postUrl, values)
```

**完整代码：**
```
package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "strings"
)

/**
 * Golang示例代码
 * @author 北京智博万维科技有限公司
 */
func main() {

    // 请求地址
    url := "http://localhost:18008/web/api/dbbackup_jobs_example"

    // 请求参数
    values := url.Values{
        "host":      {"1.1.1.1"},
        "port":      {"80"},
        "username":  {"username"},
        "password":  {"password"},
        "sort":      {"start_time"},
        "order":     {"desc"},
        "pageNum":   {"1"},
        "pageSize":  {"5"},
        "protocol":  {"http"},
        "hostState": {"all"},
    }

    // 调用服务
    resp, err := http.PostForm(postUrl, values)
    if nil != resp {
        defer resp.Body.Close()
    }
    if nil != err {
        fmt.Println(err)
    } else {
        // 读取响应体
        resBody, _ := ioutil.ReadAll(resp.Body)
        // 输出
        fmt.Println(string(resBody))
    }
}
```

## 3.3、加密模式
加密模式下用户需要传递secret参数以使用加密模式，您可以在配置文件中选择是否启用加密模式，具体配置请查看[README.md](README.md)。  
 secret参数作为标志位，默认secret=0。当secret=0时表示不使用加密模式；当secret<>0时表示使用加密模式。加密模式下其他参数都必须是密文，加密方法请查看下文。

**加密模式下使用JAVA调用服务（secret=1）：**  
加密模式下，在上文JAVA版调用示例的第二步修改参数时，需要添加secret参数，其他步骤不变。
```
Map<String, Object> params = new HashMap<String, Object>();
// 以下参数为示例API所用，请根据实际情况填写正确的参数
params.put("host", "N3l0Ro7CMO4Tf4bkREeWUA==");
params.put("port", "h7yfQpEWNiJsADDAj4s74A==");
params.put("username", "xioA5W8AkY6PUtJaBsbQWw==");
params.put("password", "DfVESPOGsvVRAg23l5hMOQ==");
params.put("sort", "MjG/cwy05Pv5Yqt0SzwSNA==");
params.put("order", "91tAoMyy1X9z3rqFGNafjQ==");
params.put("pageNum", "201UKIeGeTKN0bphmrXq7w==");
params.put("pageSize", "qdzE1VnZJuimRNxPXZkulw==");
params.put("protocol", "dtmDA0PYZD7MR+l95n/M2A==");
params.put("hostState", "aayq4JhjhSHErdfbp232iw==");
// 加密模式下添加的参数
params.put("secret", "1");
```
**加密模式下使用Golang调用服务（secret=1）：**  
加密模式下，在上文Golang版调用示例的第二步修改参数时，需要添加secret参数，其他步骤不变。
```
// 请求参数
values := url.Values{
    "host":      {"N3l0Ro7CMO4Tf4bkREeWUA=="},
    "port":      {"h7yfQpEWNiJsADDAj4s74A=="},
    "username":  {"xioA5W8AkY6PUtJaBsbQWw=="},
    "password":  {"DfVESPOGsvVRAg23l5hMOQ=="},
    "sort":      {"MjG/cwy05Pv5Yqt0SzwSNA=="},
    "order":     {"91tAoMyy1X9z3rqFGNafjQ=="},
    "pageNum":   {"201UKIeGeTKN0bphmrXq7w=="},
    "pageSize":  {"qdzE1VnZJuimRNxPXZkulw=="},
    "protocol":  {"dtmDA0PYZD7MR+l95n/M2A=="},
    "hostState": {"aayq4JhjhSHErdfbp232iw=="},
    // 加密模式下添加的参数
    "secret":    {"1"},
}
```

## 3.4、参数加密
加密算法使用AES算法，加密模式是CBC，填充方式是PKCS5Padding，密钥长度为16位，向量长度为16位，密文使用Base64进行编码。您可以在配置文件里修改密钥和向量，具体配置请查看[README.md](README.md)。
### 3.4.1、加密示例
您可以在本章节查看JAVA、Golang和Javascript版的加解密示例代码。  
**JAVA示例代码：**
```
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

/**
 * AES-CBC-128 PKCS5Padding
 * @author 北京智博万维科技有限公司
 */
public class AESExample {
    // 密钥
    private static final String KEY = "SPxA9kAdss5yyeEH";
    // 向量
    private static final String ivKEY = "LXQqqeslloZL11vx";
    // 算法
    private static final String ALGOR = "AES";
    // 模式
    private static final String ALGORITHMSTR = "AES/CBC/PKCS5Padding";
    // 编码格式
    private static final String CHARSET = "utf-8";

    /**
     * 加密
     * 
     * @param sSrc
     * @param sKey
     * @return
     * @throws Exception
     */
    public static String Encrypt(String src) throws Exception {
        if (KEY == null) {
            System.out.println("key不能为空");
            return null;
        }
        // 判断key是否为16位
        if (KEY.length() != 16) {
            System.out.println("key长度不等于16位");
            return null;
        }
        byte[] raw = KEY.getBytes(CHARSET);
        SecretKeySpec skeySpec = new SecretKeySpec(raw, ALGOR);
        // 算法/模式/补码方式
        Cipher cipher = Cipher.getInstance(ALGORITHMSTR);
        // 使用CBC模式，需要一个向量iv，可增加加密算法的强度
        IvParameterSpec iv = new IvParameterSpec(ivKEY.getBytes());
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
        byte[] encrypted = cipher.doFinal(src.getBytes());
        // 使用BASE64做编码
        return new Base64().encodeToString(encrypted);
    }

    /**
     * 解密
     * 
     * @param sSrc
     * @param sKey
     * @return
     * @throws Exception
     */
    public static String Decrypt(String src) throws Exception {
        try {
            // 判断key是否正确
            if (KEY == null) {
                System.out.println("key不能为空");
                return null;
            }
            // 判断Key是否为16位
            if (KEY.length() != 16) {
                System.out.println("key长度不等于16位");
                return null;
            }
            byte[] raw = KEY.getBytes(CHARSET);
            SecretKeySpec skeySpec = new SecretKeySpec(raw, ALGOR);
            Cipher cipher = Cipher.getInstance(ALGORITHMSTR);
            IvParameterSpec iv = new IvParameterSpec(ivKEY.getBytes());
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            byte[] encrypted1 = new Base64().decode(src);// 先用base64解密
            try {
                byte[] original = cipher.doFinal(encrypted1);
                String originalString = new String(original);
                return originalString;
            } catch (Exception e) {
                System.out.println(e.toString());
                return null;
            }
        } catch (Exception ex) {
            System.out.println(ex.toString());
            return null;
        }
    }

    public static void main(String[] args) throws Exception {
        // 此处是需要加密的内容
        String content = "1.1.1.1";
        System.out.println("加密前：" + content);
        System.out.println("密钥：" + KEY);
        System.out.println("向量：" + ivKEY);
        String encrypt = Encrypt(content);
        System.out.println("加密后：" + encrypt);
        String decrypt = Decrypt(encrypt);
        System.out.println("解密后：" + decrypt);
    }
}

```

**Golang示例代码：**
```
package main

import (
    "bytes"
    "crypto/aes"
    "crypto/cipher"
    "encoding/base64"
    "fmt"
)

/**
 * AES加密
 * 算法模式及填充方式：AES-CBC-128 PKCS5Padding
 * 编码： UTF-8
 * 作者：北京智博万维科技有限公司
 */

/**
 * AES加密
 */
func Encrypt(src, key, iv []byte) []byte {
    aesCipher, err := aes.NewCipher(key)
    if err != nil {
        fmt.Errorf("encrypt error, msg:%s", err)
        return nil
    }
    content := paddingPKCS5(src, aesCipher.BlockSize())
    encrypted := make([]byte, len(content))
    encrypter := cipher.NewCBCEncrypter(aesCipher, iv)
    encrypter.CryptBlocks(encrypted, content)
    return encrypted
}

/**
 * AES解密
 */
func Decrypt(src, key, iv []byte) []byte {
    decrypted := make([]byte, len(src))
    aesBlockDecrypter, err := aes.NewCipher(key)
    if err != nil {
        fmt.Errorf("decrypt error, msg:%s", err)
        return nil
    }
    decrypter := cipher.NewCBCDecrypter(aesBlockDecrypter, iv)
    decrypter.CryptBlocks(decrypted, src)
    return unPaddingPKCS5(decrypted)
}

/**
 * PKCS5包装
 */
func paddingPKCS5(cipherText []byte, blockSize int) []byte {
    padding := blockSize - len(cipherText)%blockSize
    padText := bytes.Repeat([]byte{byte(padding)}, padding)
    return append(cipherText, padText...)
}

/**
 * PKCS5解包装
 */
func unPaddingPKCS5(encrypt []byte) []byte {
    padding := encrypt[len(encrypt)-1]
    return encrypt[:len(encrypt)-int(padding)]
}

func main() {
    // 密钥
    key := "SPxA9kAdss5yyeEH"
    // 向量
    iv := "LXQqqeslloZL11vx"
    // 此处是需要加密的内容
    content := "1.1.1.1"
    fmt.Printf("加密前：%s\n", content)
    fmt.Printf("密钥：%s\n", key)
    fmt.Printf("向量：%s\n", iv)
    encrypt := Encrypt([]byte(content), []byte(key), []byte(iv))
    encryptStr := base64.StdEncoding.EncodeToString(encrypt)
    fmt.Printf("加密后：%s\n", encryptStr)
    decrypt, _ := base64.StdEncoding.DecodeString(encryptStr)
    decryptStr := string(Decrypt(decrypt, []byte(key), []byte(iv)))
    fmt.Printf("解密后：%s\n", decryptStr)
}
```

**Javascript示例代码：**  
Javascript进行AES加密需要依赖cryptojs，您可以从[cryptojs官网](http://cryptojs.altervista.org/)获取。
```
// 加密
function Encrypt (word, sKey, sIV) {
    var key  = CryptoJS.enc.Latin1.parse(sKey);
    var iv   = CryptoJS.enc.Latin1.parse(sIV);
    var encrypted = CryptoJS.AES.encrypt(word, key, {iv:iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
}
// 解密
function Decrypt (word, sKey, sIV) {
    var key  = CryptoJS.enc.Latin1.parse(sKey);
    var iv   = CryptoJS.enc.Latin1.parse(sIV);
    let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
// 密钥
var key = "SPxA9kAdss5yyeEH";
// 向量
var iv = "LXQqqeslloZL11vx";
// 此处是需要加密的内容
var content = "1.1.1.1";
console.log("加密前：" + content);
console.log("密钥：" + key);
console.log("向量：" + iv);
var encrypt = Encrypt(content, key, iv);
console.log("加密后：" + encrypt);
var decrypt = Decrypt(encrypt, key, iv);
console.log("解密后：" + decrypt);
```

# 四、获取HTTPS证书
您可以从以下途径获取HTTPS证书：
 - 1、向CA机构申请证书
 - 2、使用OpenSSL生成自签名证书
 
 ## 4.1、使用OpenSSL生成证书
 请先安装OpenSSL，您可以从[官方网站](https://www.openssl.org/)获取OpenSSL。

 ### 4.1.1、生成key和crt
 ```
$ openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
 ```
 得到server.key和server.crt文件分别对应HTTPS配置的hTTPSKeyFile和hTTPSCertFile属性，具体配置请查看[README.md](README.md)。