// 定义一个头部 的新组件
var Header = {
  //注入刷新界面代码的依赖
  inject: ['reload'],
  data: function () {
    return {
      // upload he
      showHeader: ''
    }
  },
  mounted(){
      if (this.$route.name !== 'upload' && this.$route.name !== 'log') {
          this.showHeader = true
      } else {
          this.showHeader = false
      }
  },
  methods: {
    goHome: function () {
      this.$router.push({
        path: '/'
      })
    },
    logout: function () {
      delCookie('zbww-token')
      delCookie('zbww-username')
      delCookie('zbww-user')
      delCookie('zbww-id')
      delCookie('zbww-userAvatar')
      window.localStorage.removeItem('zbww-imageUrl')
      //调用reload无缝刷新代码
      this.reload()
      // 跳转到登录页
      this.$router.push('/log')

    },
  },
  // 检讨$route变化实现调用reload刷新作用
  watch: {
    '$route': "reload"
  },
  computed: {
    userCookie: { // 初始化用户Cookie,刷新不丢失
      name: getCookie('zbww-username'),
      id: getCookie('zbww-id'),
      imageUrl: window.localStorage.getItem('zbww-imageUrl')
    },
    getUserCookieName: function () {
      return unescape(getCookie('zbww-username'))
    },

  },

  template: `
  <div v-if="showHeader" class="up shadow">
  <h1 class="user" @click="goHome">
    <img class="img" src="../images/logo1.png" alt="" style="width: 4.87rem;">
</h1>
  <div class="login-regist">
  <ul v-if="getUserCookieName && getUserCookieName !== 'null'">
      <router-link to="/container" tag="li">
        <el-tooltip :hide-after="1500" effect="dark" :content="getUserCookieName" placement="left">
          <nobr>{{getUserCookieName}}</nobr>
        </el-tooltip>
      </router-link>
      <li><span> | </span></li>
      <li><a @click="logout">退出登录</a></li>
      <li><span> | </span></li>
      <router-link to="/upload" tag="li"><nobr>授权</nobr></router-link>
      <li><span> | </span></li>
      <router-link to="/container" tag="li">返回首页</router-link>
     
     
    </ul>
    <ul v-else>
      <router-link to="/log" tag="li"><nobr>登录</nobr></router-link>
      <li><span> | </span></li>
      <router-link to="/upload" tag="li"><nobr>授权</nobr></router-link>
      <li><span> | </span></li>
     <router-link to="/container" tag="li">返回首页</router-link>
    </ul>
  </div>
</div>
    `
}