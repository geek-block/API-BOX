//列表页
// 定义一个主体页
var My = {
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
    return {
      test: {
          version: '',
          create_time: '',
          end_time: '',
          license: {
              power: '',
              start_time: ''
          }
      },
      isNewVersion: true,
      instance: null,
      timer: null,
      token: '',
      APKPort: ''
    }
  },
    computed: {
    // 计算天数
    time: function () {
      //把开始时间转换成秒数
      let sDate1 = Date.parse(this.test.license.start_time);
      //把结束时间转换成秒数
      let sDate2 = Date.parse(this.test.license.end_time);
      let dateSpan = sDate2 - sDate1;
      //计算结果取绝对值
      let dateSpans = Math.abs(dateSpan);
      //把计算出来的秒数转换成天数
      let iDays = Math.floor(dateSpans / (24 * 3600 * 1000));
      return iDays;
    },
      getUserCookieName: function () {
          return unescape(getCookie('zbww-username'))
      },
      getUser: function () {
          return JSON.parse(unescape(getCookie('zbww-user')))
      },
  },
    watch: {},
    mounted() {
    axios.get('/get', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // 'Authorization': token
      },
      params: {}
    }).then((res) => {
      if (res.data.code === 200) {
        this.test = res.data.data.box
        this.sDate1 = this.test.license.start_time;
        this.sDate2 = this.test.license.end_time;
      } else {
        this.$message({
          message: res.data.msg,
          type: "error"
        })
      }
    }).catch((e) => {
        console.log(e)
    }).finally(() => {
    })
    this.token = getCookie('zbww-token')
    this.guide()
    this.checkVersion()
    this.getPort()
  },
  destroyed() {
    this.close()
  },
  methods: {
     // 获取端口号
     getPort() {
         axios.get("/update/port")
             .then(res => {
                 let self = this
                 self.APKPort = res.data.data
                 console.log(self.APKPort);
             })
             .catch(err => {
                 console.log(err)
             })
     },
     // 发起安装请求
     update() {
         this.close()
         const h = this.$createElement;
         this.instance = this.$notify.info({
             title: '提示',
             message: h('p', null, [
                 h('span', null, '安装中，请稍等'),
                 h('i', {
                     class: 'el-icon-loading'
                 })
             ]),
             showClose: false,
             duration: 0,
             offset: 100
         });
         axios.defaults.baseURL = 'http://localhost:'+ this.APKPort;
         axios.get("/update")
             .then(res => {
                 this.close()
                 console.log(res)
                 this.$notify({
                     title: '提示',
                     message: '安装成功',
                     type: 'success',
                     offset: 100
                 });
             })
             .catch(err => {
                 console.log(err)
                 this.close()
                 this.$notify.error({
                     title: '提示',
                     message: `安装失败`,
                     offset: 100
                 });
             })
     },
     //guide
     guide(){
      axios.get("/guide")
      .then(res => {
        let self = this
        if(res.data.data.user >= 1) {
           //已同意法律声明
        } else {
          introJs().start().onbeforeexit(function () {
            self.user()
            return
          });
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
     //user
     user(){
      axios.get("/guide/user")
      .then(res => {
        if(res.data.code === 200) {
           //已同意法律声明
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
        // 自动检查版本。
        checkVersion(){
         if (this.instance) {
             this.close()
         }
          axios.defaults.headers.common['Authorization'] = this.token
          axios.get("/update/check")
          .then(res => {
            let self = this
            //如果是最新版本 提示更新。
            if(res.data.data.new_version === res.data.data.now_version) {
              this.isNewVersion = true
            } else {
              // 不是最新版
              if(res.data.data.exists === 1) {
              // 如果有下载了安装包，但是没安装 开始安装
                this.startVersionHaveAPK()
              } else {
                 // 如果没有下载安装包， 开始下载
                this.open()
              }
              this.isNewVersion = false
            }
          })
          .catch(err => {
            console.log(err)
          }).finally(() => {
           //
          })
        },
            // 下载更新包
        updateVersion(){
          const h = this.$createElement;
          this.instance = this.$notify.info({
            title: '提示',
            message: h('p', null, [
              h('span', null, '下载中，请稍等'),
              h('i', {
                class: 'el-icon-loading'
              })
            ]),
            showClose: false,
            duration: 0,
            offset: 100
          });
          axios.defaults.headers.common['Authorization'] = this.token
          axios.get("/apiStore/update")
          .then(res => {
            let self = this
            if(res.data.code === 200) {
              this.close()
              this.instance = this.$notify({
                title: '提示',
                message: h('p', null, [
                  h('span', null, '最新安装包已准备好，请点击安装 '),
                  h('button',{
                    class: 'primary',
                    on:{
                        click:this.update
                    }
                }, "安装")
                ]),
                duration: 0,
                type: 'warning',
                offset: 100
              });
            } else {
              this.close()
              this.instance = this.$notify({
                title: '提示',
                message: `下载失败，可能是网络状态差或未登录`,
                type: 'error',
                // showClose: false,
                duration: 0,
                offset: 100
              });
            }
          })
          .catch(err => {
            console.log(err)
          })
        },
        // 已有安装包，开始安装
        startVersionHaveAPK(){
          const h = this.$createElement;
          this.instance = this.$notify({
            title: '提示',
            message: h('p', null, [
              h('span', null, '最新安装包已准备好，请点击安装 '),
              h('button',{
                class: 'primary',
                on:{
                    click:this.update
                }
            }, "安装")
            ]),
            duration: 0,
            type: 'warning',
            offset: 100
          });
        },
        //提示安装
        open(){
          const h = this.$createElement;
          this.instance = this.$notify.info({
            title: '提示',
            message: h('p', null, [
              h('span', null, '有最新版本可用，是否下载 '),
              h('button',{
                  class: 'primary',
                  on:{
                      click:this.updateVersion
                  }
              }, "下载")
            ]),
            // showClose: false,
            offset: 100
          });
        },
        close() {
          this.instance.close()
        }
  },
  template: `
    <div class="info">
    <div class="tab-header">
        <span class="active">个人中心</span>
        <router-link style="line-height: 0.5rem;" class="second" to="/container/interface">
           <span style="padding-left: 0.28rem" class="second">我的数据接口</span>
        </router-link>
    </div>
    <div class="info_l" data-step="1" data-intro="您可以在这里查看API Box的授权信息">
      <h1>API Box信息</h1>
      <div v-if="!test.version">API Box未授权</div>
      <div v-if="test.version">版本号：{{this.test.version}}</div>
      <div v-if="test.create_time">生产时间：{{this.test.create_time}}</div>
      <div v-if="test.license.power">授权版本：{{this.test.license.power}}</div>
      <div v-if="test.version">使用有效期：{{this.sDate1|formatDate}}-{{this.sDate2|formatDate}}</div>
      <div v-if="test.version">剩余使用时间：{{time}}天</div>
    </div>
    <div class="message" data-step="2" data-intro="您可以在这里查看登录后API Store的用户信息">
    <h1>用户信息</h1>
    <div style="font-size: 0.18rem;" v-if="!this.getUser">API Box未登录</div>
    <p v-if="this.getUser && this.getUser.email">邮箱：{{ getUser.email }}</p>
    <p v-if="this.getUser && this.getUser.nickname">昵称：{{ getUser.nickname }}</p>
    <p v-if="this.getUser && this.getUser.phone">手机号码：{{ getUser.phone }}</p>
    <p v-if="this.getUser && this.getUser.username">用户名：{{ getUser.username }}</p>
    </div>
  </div>
    `
}