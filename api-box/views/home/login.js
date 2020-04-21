//登录页
// 定义一个主体页
var Login = {
  data: function () {
   
    return {
      height: window.innerHeight,
      formData: { // 登录提交
        uid: '',
        password: '',
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
    
      },

     //切换密码的参数,假设密码状态为true
     pswChangeInfo: true
    }
  },
  mounted() {
    delCookie('zbww-token')
    delCookie('zbww-username')
    delCookie('zbww-id')
},
  methods: {
   
    loginSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.formData.verifyId = this.getVerifyCode.verifyId
          let psw = encrypt(this.formData.password)
          let params = {
            uid: this.formData.uid,
            password: psw,
            mode: 'common'
          }
          // 发送登录请求
          const self = this
          axios.post('/loginApistore', params, {
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
              const res = JSON.parse(response.data)
              if (res.code === 200) {
                // 存入token，username，id
                // let expireDays = 50 * 60 * 1000 // 50分钟
                setCookie('zbww-token', res.data.token, expireDays) // 设置Session
                setCookie('zbww-username', res.data.user.nickname, expireDays) // 设置用户
                setCookie('zbww-id', res.data.user.id, expireDays) // 设置用户编号
                self.$router.push('/container')
              } else {
                // ELEMENT.Message({
                //   showClose: true,
                //   message: res.msg,
                //   duration: 3000,
                //   type: 'error'
                // })
               
              }
            })
            .catch(function (error) {
            })
        } else {}
      })
    },
    //改变密码状态显示或隐藏
    pswChange() {
      if (this.pswChangeInfo) {
        this.$refs.input.type ="password" 
        this.pswChangeInfo=false
  
      } else {
        this.$refs.input.type = "text"
        this.pswChangeInfo=true
          
      }
    }
  },
  template: `
  <div class="bgImg">
  <div class="loginInput">
      <div class="center">
        <h1>鼎甲智能灾备管理平台</h1>
        <el-form :model="formData" status-icon :rules="Rules" ref="loginForm" class="login-form">
          <el-form-item prop="uid">
            <el-input type="text" v-model.number="formData.uid" auto-complete="off" placeholder="请输入用户名" prefix-icon="al-icon-mine"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" plain v-model="formData.password" auto-complete="off" placeholder="请输入密码" prefix-icon="al-icon-mima" ref="input">
            </el-input>
         <span class="el-icon-view" @click="pswChange"></span>
          </el-form-item>
     
          <el-form-item class="submit">
            <el-button  type="primary" @click="loginSubmit('loginForm')" class="submitButton">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="bottomTip">
          <p class="left">系统可授权3630天
          <i><router-link to="/upload">重新授权？</router-link></i>
          </p>
          <p class="left-u"><router-link to="/upload">点击上传</router-link></p>
         
        </div>
   
      </div>
    </div>
    <div class="foot">v1.0.0 Beta</div>
  </div>
  
    `
}