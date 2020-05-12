//登录页
// 定义一个主体页
var Log = {
  data: function () {
    var validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.toLowerCase() !== this.getVerifyCode.code.toLowerCase()) {
        callback(new Error('验证码输入错误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      height: window.innerHeight,
      formData: { // 登录提交
        uid: '',
        password: '',
        verifyCode: '',
        mode: 'common'
      },
      Rules: {
        uid: [{
          required: true,
          message: '请输入正确的用户名',

        }],
        password: [{
          required: true,
          message: '密码不能小于5位',

        }],
        verifyCode: [{
          validator: validateVerifyCode,
          trigger: 'blur'
        }]
      },
      getVerifyCode: {},
    }
  },
  mounted() {
    delCookie('zbww-token')
    delCookie('zbww-username')
    delCookie('zbww-id')
    this.getVerifyCodeAsyn()
  },
  methods: {
    getVerifyCodeAsyn() {
      axios.get("/apiStore/getVerifyCode")
        .then(res => {
          this.getVerifyCode = res.data.data
        })
        .catch(err => {
        })
    },

    updateVerifyCode() {
      this.getVerifyCodeAsyn()
    },
    loginSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.verifyId = this.getVerifyCode.verifyId
          let psw = encrypt(this.formData.password)
          let params = {
            uid: this.formData.uid,
            password: psw,
            verifyCode: this.formData.verifyCode,
            verifyId: this.getVerifyCode.verifyId,
            mode: 'common'
          }
          // 发送登录请求
          const self = this
          axios.post('/apiStore/login', params, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                var test = Qs.stringify(data)
                return test
              }]
            })
            .then(function (response) {
              const res = response.data

              if (res.code === 200) {
                // 存入token，username，id
                let expireDays = 50 * 60 * 1000 // 50分钟
                setCookie('zbww-token', res.data.token, expireDays) // 设置Session
                setCookie('zbww-username', res.data.user.nickname, expireDays) // 设置用户名称
                setCookie('zbww-user', JSON.stringify(res.data.user), expireDays) // 设置用户
                setCookie('zbww-id', res.data.user.id, expireDays) // 设置用户编号
                setCookie('zbww-userAvatar', res.images_host + "/"+ res.data.user.imageUrl, expireDays) // 设置用户头像

                self.$router.push('/container')

              } else {
                ELEMENT.Message({
                  showClose: true,
                  message: res.msg,
                  duration: 3000,
                  type: 'error'
                })
                self.getVerifyCodeAsyn()
              }
            })
            .catch(function (error) {
              self.getVerifyCodeAsyn()
            })

        } else {}
      })
    }
  },
  template: `
  <div class="bgImg log" :style="{height: height + 'px'}">
      <div class="loginInputt">
        <div class="logo-content">
          <router-link to="/container" style="cursor: pointer;">
           <img class="logo-content-img" src="../images/logo1.png" alt="">
          </router-link>f
        </div>
      <div class="cent">
         <div class="logo-content">
          <router-link to="/container" style="cursor: pointer;">
             <img class="logo-content-img" src="../images/logo1.png" alt="">
          </router-link>
         </div>
         <div class="headerr">
          <div >
              <i></i>
              <span>登录</span>
              <i></i>
          </div>
          <div class="xf">
          <span class="login-icon">
          </span>
          </div>
      </div>
        <el-form :model="formData" status-icon :rules="Rules" ref="loginForm" class="login-formt" style="width:4.9rem;margin: 0 auto;position: relative;top: 2.3rem;">
          <el-form-item prop="uid">            <el-input type="text" v-model.number="formData.uid" auto-complete="off" placeholder="请输入用户名、手机号或邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formData.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" style="0.6rem">
            <el-col :span="12">
              <el-input class="verifyCode" @keyup.enter.native="loginSubmit('loginForm')" type="text" v-model="formData.verifyCode" auto-complete="off" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10">
              <img :src="getVerifyCode.image" alt="" class="validateImg" @click="updateVerifyCode">
            </el-col>
          </el-form-item>
          <el-form-item class="submitt">
            <el-button round type="primary" @click="loginSubmit('loginForm')" class="submitButtont">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="bottomTipt">
          <!--<p class="left"><nobr><router-link to="/">忘记密码</router-link></nobr></p>-->
          <!--<p class="right"><nobr><router-link to="/">注册新账号</router-link></nobr></p>-->
          <!--<p class="right"><nobr><router-link to="/manage/regist">点击这里，</router-link><span>注册新帐号</span></nobr></p>-->
        </div>
      </div>
    </div>
  </div>
  
    `
}