// 上传授权码页
// 定义一个主体页
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
var Upload = {
  //过滤器
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '/' + MM + '/' + d;
    }
  },
  data: function () {
      const validateResponse = (rule, value, callback) => {
          if (this.$refs.upload.uploadFiles.length !== 1) {
              return callback(new Error('请上传授权码'))
          } else {
              callback()
          }
      }
    return {
      height: window.innerHeight,
      //申请码
      send: null,
      authorData: {},
      isShow: true,
      ruleForm: {
        fileList: []
      },
      dialogVisible: false,
      rules: {
        fileList: [{
          required: false,
          trigger: 'blur',
          validator: validateResponse
        }]
      },
      versionData: '',
      imageHeader: {},
      imageData: {},
      fileList: [],
      choose: false  
    }
  },
  mounted() {
    axios.get('/license/parse', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      params: {}
    }).then((response) => {
      if (response.data.code === 200) {
        this.authorData = response.data.data
        this.sDate1 = this.authorData.start_time;
        this.sDate2 = this.authorData.end_time;
      } else {}
    })
    this.version()
    this.guideAgreement()
  },
  methods: {

    //获取申请码
    requestcode() {
        // 直接下载，用户体验好
        var $form = $('<form method="GET"></form>');
        $form.attr('action', '/license/request');
        $form.appendTo($('body'));
        $form.submit();
        this.send = 'request.license'
    },
     //guide
     guide(){
      axios.get("/guide")
      .then(res => {
        let self = this
        if(res.data.data.license >= 1) {
           //已同意法律声明
        } else {
          introJs().start().onbeforeexit(function () {
            self.license()
            return
          });
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    //授权引导页
    agreement(){
      axios.get("/guide/agreement")
      .then(res => {
        if(res.data.code === 200) {
            this.dialogVisible = false
            this.guide()
        }
        //todo
      })
      .catch(err => {
        console.log(err)
      })
    },
    //guide 同意协议。
    guideAgreement(){
      axios.get("/guide")
      .then(res => {
        if(res.data.data.agreement >= 1) { //已同意法律声明
            this.dialogVisible = false            
        } else { // 
          this.dialogVisible = true
        }
        //todo
      })
      .catch(err => {
        console.log(err)
      })
    },
     //license
     license(){
      axios.get("/guide/license")
      .then(res => {
        if(res.data.code === 200) {
           //已同意法律声明
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    //提交授权码
    loginSubmit(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
        if (valid) {
            this.$refs.upload.submit();
        } else {
          return false;
        }
      });



    },
      version(){
        axios.get('/version', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            params: {}
        }).then((response) => {
            if (response.data.code === 200) {
                this.versionData = response.data.data
            } else {
                this.$message({
                    message: response.msg,
                    type: "error"
                })
            }

        })
    },
      handleRemove(file, fileList) {
          if (fileList.length === 0) {
              this.choose = false
          } else if (fileList.length === 1) {
              this.choose = true
          }
      },
      handleChange(file,fileList){
          if (fileList.length === 0) {
              this.choose = false
          } else if (fileList.length === 1) {
              this.choose = true
          }
      },
      handleSuccess(response, file, fileList){
            this.authorData = response.data
          if (response.code === 200) {
              this.$message({
                  type: 'success',
                  message: '授权成功!'
              });
              this.$router.push('/')
          }
      },
      handlePreview(file) {
          console.log(file);
      },
    handleClose(){}
  },
  computed: {
    // 计算天数
    time: function () {
      //把开始时间转换成秒数
      let sDate1 = Date.parse(this.authorData.start_time);
      //把结束时间转换成秒数
      let sDate2 = Date.parse(this.authorData.end_time);
      let dateSpan = sDate2 - sDate1;
      //计算结果取绝对值
      let dateSpans = Math.abs(dateSpan);
      //把计算出来的秒数转换成天数
      let iDays = Math.floor(dateSpans / (24 * 3600 * 1000));
      return iDays;
    },
    selectedResponseCode: function () {
        this.$nextTick(() => {
            return this.$refs.upload.uploadFiles.length === 1
        })
    }
  },
  template: `
  <div class="bgImg" >
  <div class="cent">
   <div class="logo-content" data-step="5" data-intro="您可以点击这里以返回主页">
    <router-link to="/container" style="cursor: pointer;">
       <img class="logo-content-img" src="../images/logo1.png" alt="">
    </router-link>
    </div>
   <div class="headerr">
    <div >
        <i class="headerr-back" @click="window.history.go(-1)" > </i>
        <span>上传授权码</span>
        <i></i>
    </div>
    <div class="xf">
    <span class="certificate-icon">
    </span>
    </div>
  </div>
<div class="footer">
<el-form  :model="ruleForm" :rules="rules" ref="ruleForm" class="login-form form">
          <el-form-item class="item">
            <div class="hq" data-step="1" data-intro="首次使用请单击此处以获取申请码，并将申请码发送至我们的邮箱">
              <i class="hq-icon1"></i>
              <el-input type="text"  v-model=send  placeholder="获取申请码" ></el-input>
              <el-button @click="requestcode" class="huoqu"  >获取申请码</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="fileList" class="response">
            <span v-show="!choose" style="color: #ffffff;position:absolute;left: 0;">请将下载的授权码上传</span>
            <el-upload
                class="upload-demo"
                ref="upload"
                name="file"
                accept=".license"
                action="/license/upload"
                limit="1"
                :multiple="false"
                :headers="imageHeader"
                :data="imageData"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-change="handleChange"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" class="huoqu">选取授权码</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item class="submit">
            <el-button data-step="3" data-intro="并点击此处提交"  @click="loginSubmit('ruleForm')"  class="btn" >提交授权码</el-button>
          </el-form-item style=align-items: flex-end;justify-content: flex-start;>
           <el-form-item class="backIndex">
            <a href="/">进入首页</a>
           </el-form-item>
        </el-form>
</div> 
<div class="infoot" v-if = "isShow" data-step="4" data-intro="如果授权码通过校验，将会在此处显示授权信息">
<p v-if="this.authorData.power">{{this.authorData.power}}</p>
<p v-if="this.authorData.start_time">有效期:{{this.authorData.start_time|formatDate}}-{{this.authorData.end_time|formatDate}}</p>
<p v-if="time">剩余时间:{{time}}天</p>
</div>
</div>
<div v-if="authorData" class="foot">{{ versionData }}</div>
  <el-dialog
  title="用户协议"
  :visible.sync="dialogVisible"
  width="33%"
  ref="dialog"
  :before-close="handleClose">
  <div class="container">
  <h1 class="code-line" data-line-start=1 data-line-end=2 ><a id="_1"></a>法律声明</h1>
  <p class="has-line-data" data-line-start="2" data-line-end="6">公司名称：北京智博万维科技有限公司（下称本公司）<br>
  官网名称：智博万维（下称官网）<br>
  网站域名：<a href="https://www.geek-block.com/">https://www.geek-block.com/</a><br>
  联系邮件：support@geek-block.com</p>
  <h3 class="code-line" data-line-start=7 data-line-end=8 ><a id="_7"></a>一、特别提示</h3>
  <p class="has-line-data" data-line-start="8" data-line-end="9">在使用本公司官网各项服务以及本公司的各种软件（下称软件，仅指本公司开发的各种软件）前，请您务必仔细阅读并全面理解本声明。您一旦使用本公司官网各项服务和软件，您的使用行为将被视为对本声明全部内容的认可。</p>
  <h3 class="code-line" data-line-start=9 data-line-end=10 ><a id="_9"></a>二、用户使用须知</h3>
  <p class="has-line-data" data-line-start="10" data-line-end="23">1、用户使用官网的各项服务，必须遵守包括《中华人民共和国刑法》、《中华人民共和国计算机信息网络国际联网管理暂行规定》、《互联网信息服务管理办法》等在内的现有互联网法律法规。用户或其发布的相关文章、图片、评论、广告、宣传、活动及其他各项信息均由其依法承担全部责任。<br>
  2、用户应在遵守法律法规及《软件使用许可协议书》（下载安装软件前会提示，点击同意视为认可协议书内容）的前提下使用软件。用户无权实施包括但不限于下列行为：<br>
  2.1、删除软件及其他副本上所有关于版权的信息、内容；<br>
  2.2、对软件进行反向工程、反向编译或反向汇编，以及改动编译程序文件内部的任何资源；<br>
  2.3、未经本公司书面同意，使用、复制、修改、链接、转载、汇编、发表、出版软件相关信息等，建立镜像站点、擅自借助软件发展与之有关的衍生产品、作品、服务、插件、外挂、兼容、互联等；<br>
  2.4、进行危害计算机网络安全的行为，包括但不限于：使用未经许可的数据或进入未经许可的服务器；未经许可对计算机信息网络功能进行删除、修改或者增加；未经允许对计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；未经许可企图探查、扫描、测试本软件系统或网络的弱点或其它实施破坏计算机信息网络安全的行为；企图干涉、破坏本软件系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；<br>
  2.5、将软件提供的服务用于核设施运行、生命维持或其他会使人类及其财产处于危险之中的重大设备。用户明白本软件提供的服务并非为以上目的而设计，如果因为软件和服务的原因导致以上操作失败而带来的人员伤亡、严重的财产损失和环境破坏，本公司将不承担任何责任；<br>
  2.6、在未经本公司书面明确授权前提下，出售、出租、出借、散布、转移或转授权软件和服务或相关的链接或从使用软件和服务或软件和服务的条款中获利，无论以上使用是否为直接经济或金钱收益；<br>
  2.7、其他以任何不合法的方式、为任何不合法的目的、或以任何与本协议不一致的方式使用软件提供的服务。<br>
  2.8、软件的替换、修改和升级：本公司保留在任何时候通过为您提供本软件替换、修改、升级版本的权利以及为替换、修改或升级收取费用的权利。本公司保留因业务发展需要，单方面对软件的部分功能效果进行改变或进行限制，用户需承担此风险。<br>
  2.9、非经本公司或本公司授权开发并正式发布的其它任何由软件衍生的软件均属非法，下载、安装、使用此类软件，将可能导致不可预知的风险，建议用户不要轻易下载、安装、使用，由此产生的一切法律责任与纠纷一概与本公司无关。<br>
  2.10、对于从非本公司指定站点下载的软件产品以及从非本公司发行的介质上获得的软件产品，本公司无法保证该软件是否感染计算机病毒、是否隐藏有伪装的木马程序或者黑客软件，使用此类软件，将可能导致不可预测的风险，建议用户不要轻易下载、安装、使用，本公司不承担任何由此产生的一切法律责任。<br>
  2.11、使用软件必须遵守国家有关法律和政策等，维护国家利益，保护国家安全，并遵守本协议，对于用户违法或违反本协议的使用而引起的一切责任，由用户负全部责任，一概与本公司及合作单位无关，导致本公司及合作单位损失的，本公司及合作单位有权要求用户赔偿，并有权立即停止向其提供服务。</p>
  <h3 class="code-line" data-line-start=23 data-line-end=24 ><a id="_23"></a>三、软件知识产权特别声明</h3>
  <p class="has-line-data" data-line-start="24" data-line-end="28">1、官网的软件由本公司开发。软件的一切版权等知识产权，以及与软件相关的所有信息内容，包括但不限于：文字表述及其组合、图标、图饰、图表、色彩、界面设计、版面框架、有关数据、印刷材料、或电子文档等均受著作权法和国际著作权条约以及其他知识产权法律法规的保护。<br>
  2、未经本公司书面同意，用户不得为任何营利性或非营利性的目的自行实施、利用、转让或许可任何第三方实施、利用、转让上述知识产权，本公司保留追究上述未经许可行为的权利。<br>
  3、用户可以为非商业目的在单一终端设备上安装、使用、显示、运行我们的软件。用户不得为商业运营目的安装、使用、运行软件，不可以对该软件或者该软件运行过程中释放到任何计算机终端内存中的数据及该软件运行过程中客户端与服务器端的交互数据进行复制、更改、修改、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经授权的第三方工具/服务接入软件和相关系统。<br>
  4、保留权利：未明示授权的其他一切权利仍归本公司所有，用户使用其他权利时须另外取得本公司的书面同意。</p>
  <h3 class="code-line" data-line-start=28 data-line-end=29 ><a id="_28"></a>四、关于隐私权保护</h3>
  <p class="has-line-data" data-line-start="29" data-line-end="46">1、为了进一步完善您在使用官网服务和软件过程中的用户体验，向您提供更好的服务，我们会在为您提供服务的过程中收集必要的数据信息，并通过分析这些数据，为您提供更升级、贴心的服务。例如，帮助我们了解用户使用软件和服务时遇到的问题，以改善软件和服务的质量、性能和安全性。<br>
  2、本公司高度重视用户信息保护。<br>
  3、用户同意，在以下（包括但不限于）几种情况下，本公司有权使用用户的信息资源：<br>
  3.1、执行软件验证或升级服务；<br>
  3.2、提高用户的使用安全性并提供客户支持；<br>
  3.3、改善或提高软件的技术和服务，例如，帮助我们了解用户使用软件和服务时遇到的问题，帮助我们改善软件和服务的质量、性能和安全性；<br>
  3.4、为用户发送通知、软件及网站提供的服务信息；<br>
  3.5、本公司可能会与第三方合作向用户提供相关的网络服务所必须，且该第三方同意承担与本公司同等的保护用户隐私的责任；<br>
  3.6、在不透露单个用户隐私资料的前提下，本公司可能对用户数据库进行分析并生成统计数据；<br>
  3.7、其他有利于用户利益和实现本软件功能的使用行为。<br>
  4、本公司将会采取合理的措施保护用户信息，不向第三方公开、透露用户信息，除以下情形之外：<br>
  4.1、基于法律或法律赋予权限的政府部门要求；<br>
  4.2、在紧急情况下，为维护用户及公众的权益；<br>
  4.3、为维护本公司的商标权、专利权及其他任何合法权益；<br>
  4.4、用户同意公开用户信息的。<br>
  5、因用户使用第三方服务或者设备，可能导致用户信息通过其他方式透露给第三方，用户需自行了解第三方对用户信息保护的相关条款，本公司不承担由此产生的风险。<br>
  6、用户可以选择不向本公司提供用户信息，或者根据产品设置取消软件收集某些信息。因用户未向本公司提供信息导致相关服务功能无法实现，本公司不为此承担责任。</p>
  <h3 class="code-line" data-line-start=46 data-line-end=47 ><a id="_46"></a>五、法律责任与免责</h3>
  <p class="has-line-data" data-line-start="47" data-line-end="54">1、用户认可本公司官网各项服务以及软件将会尽一切合理努力以保护用户的计算机资源及计算机通讯的隐私性和完整性，但是用户承认和同意本公司不能就此事提供任何承诺或保证。<br>
  2、本公司特别提请用户注意，为了保障官网各项服务以及软件发展和调整的自主权，本公司拥有随时自行修改或中断软件授权而不需通知用户的权利，如有必要，修改或中断会以通告形式公布于官网重要页面上。<br>
  3、用户违反本声明或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户同意赔偿本公司与合作公司、关联公司，并使之免受损害。对此，本公司有权视用户的行为性质，采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。<br>
  4、官网的各项服务与软件经过详细的测试，但不能保证与所有的软硬件系统完全兼容，不能保证官网各项服务与软件完全没有错误。如果出现不兼容及错误的情况，用户可将情况报告本公司，获得技术支持。如果无法解决兼容性问题，用户可以删除本软件。<br>
  5、在适用法律允许的最大范围内，对因使用或不能使用官网服务、软件所产生的损害及风险，包括但不限于直接或间接的个人损害、商业赢利的丧失、贸易中断、商业信息的丢失或任何其它经济损失，本公司不承担任何责任。<br>
  6、对于因不能控制的原因（含系统升级和维护、电信系统或互联网网络故障、计算机故障、计算机系统问题）或其它任何不可抗力原因而造成的网络服务中断、数据丢失或其他缺陷，本公司不承担任何责任。<br>
  7、用户违反本声明以及使用官网服务、软件的协议规定，对本公司造成损害的，本公司有权采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。</p>
  <h3 class="code-line" data-line-start=54 data-line-end=55 ><a id="_54"></a>六、其他条款</h3>
  <p class="has-line-data" data-line-start="55" data-line-end="57">1、本协议所定的任何条款的部分或全部无效者，不影响其它条款的效力。<br>
  2、本协议的解释、效力及纠纷的解决，适用于中华人民共和国法律。若用户和本公司之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户在此完全同意将纠纷或争议提交本公司所在地的人民法院管辖。</p>
  <span slot="footer" class="dialog-footer xieyi-footer">
    <el-button type="success" @click="agreement()">同 意</el-button>
  </span>
  </div>
  <div slot="footer"></div>
</el-dialog>

  </div>
    `
}