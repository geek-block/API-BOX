
// 定义一个主体页
var Container = {
 
  data: function () {
    return {
      mainHeight: 520, // 右边主体块高度
      token: '',
      isCollapse: false
    }
  },
  watch: {
  },
  computed: {
    getUserName() {
      return unescape(getCookie('zbww-username'))
    },
    getUserAvatar: function () {
        return unescape(getCookie('zbww-userAvatar'))

    },
    //面包屑
    routeInfo: function () {
      const matched = this.$route.matched;
      const arr = matched.map(v => {
        return v.meta
      });
      return arr;
    }
  },
  mounted() {
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
    let height = document.documentElement.clientHeight
    this.mainHeight = height - 79,
    this.token = getCookie('zbww-token')
  },
  methods: {
  
  // menu open
    menuOpen(key, keyPath) {
    },
    // menu close
    menuClose(key, keyPath) {
    },
    toSetting() {
      // this.$router.push('options')
    }
  },
  template: `
  <el-container class="container" id="container">
    <el-main :style="{ height: mainHeight + 'px' }">
      <div class="box">
        <div class="box-container">
           <el-row class="menu" id="menu">
           <el-col :span="24">
           <el-menu default-active="1-5-1" class="el-menu-vertical-demo" @open="menuOpen" @close="menuClose" :collapse="isCollapse">
           <div class="userImg">
           <div class="avatar" @click="toSetting" >
            <img v-if="this.getUserAvatar !=='null'" style="width: 100%;" :src="getUserAvatar" alt=""/>
            <img v-else ="" style="width: 100%;" src="../images/userDefault.png" alt=""/>
           </div>
           <div class="nickName">
           <p>
           <el-tooltip  effect="dark" content="" placement="right">
               <span v-if="token"><nobr>欢迎回来，{{getUserName}}</nobr></span>
             </el-tooltip>
           </p>
         </div>
           </div>
           <el-menu-item index="1" data-step="1">
           <router-link to="/container/mycenter">
           <i class="el-icon-info"></i><span>个人中心</span>
           <span slot="title"></span>
           </router-link>
             </el-menu-item>
           <el-menu-item index="2">
           <router-link to="/container/interface">
           <i class="el-icon-menu"></i><span>我的数据接口</span>
           <span slot="title"></span>
           </router-link>
           </el-menu-item>
           <el-menu-item index="3">
              <a target="_blank" referrerpolicy="no-referrer" style="padding-left: 0;color:#686D74!important;display:block;" href="https://www.geek-block.com/#/home/index">
                <img class="icon-home" src="../images/home.png" alt="">
                <span><a target="_blank"  referrerpolicy="no-referrer" style="padding-left: 0;color:#686D74!important;" href="https://www.geek-block.com/#/home/mark">进入API Store</a></span>
                <span slot="title"></span>
              </a>
           </el-menu-item>
           </el-menu-item>
           </el-menu>
           </el-col>
        </el-row>
            <div id="content">
          <router-view></router-view>
        </div>
        </div>
      </div>
    </el-main>
    </div>
  </el-container>
    `
}