//接口测试页
// 定义一个主体页
var Test = {
    components: {},
    data: function () {
        return {
            form: {
                request: {
                    params: [],
                    paramsTemp: [],
                    bodyParams: '',
                    paramsKeys: []
                },
                requestMethod: [{
                    value: 'POST'
                }, {
                    value: 'GET'
                }, {
                    value: 'PUT'
                }, {
                    value: 'DELETE'
                }, {
                    value: 'HEAD'
                },
                    {
                        value: 'OPTIONS'
                    },
                    {
                        value: 'PATCH'
                    }
                ],
                selectMethod: '',
                url: '/user/invoke'
                // url: ''

            },
            interfaceTestInfo: {},
            interfaceTestResponse: {
            },
            timeConsuming: '',
            loading: false,
            advancedParamsFlag: false,
            secret: false,
            sync: true,
            showTestAsyncButton: false,
            advancedParams: [],
            normalParams: [],
            asyncResult: false,
            /*弹框的*/
            dialog: {
                form: {
                    request: {
                        params:  [{
                            displayType: "text",
                            id: "",
                            name: "request_id",
                            orders: 6,
                            remark: "请求 ID",
                            required: "是",
                            sample: "",
                            type: "String",
                            modeDescription: "普通参数",
                            advanced: false
                        }],
                        paramsTemp: [],
                        bodyParams: '',
                        paramsKeys: [
                            "name",
                            "remark",
                            "modeDescription",
                            "required",
                            "sample",
                            "type"
                        ]
                    },
                    requestMethod: [{
                        value: 'POST'
                    }, {
                        value: 'GET'
                    }, {
                        value: 'PUT'
                    }, {
                        value: 'DELETE'
                    }, {
                        value: 'HEAD'
                    },
                        {
                            value: 'OPTIONS'
                        },
                        {
                            value: 'PATCH'
                        }
                    ],
                    selectMethod: 'GET',
                    url: '/user/invoke'
                    // url: ''

                },
                interfaceTestInfo: {},
                interfaceTestResponse: {
                },
                timeConsuming: '',
                asyncLoading: false,
                advancedParamsFlag: false,
                secret: false,
                sync: false,
                advancedParams: [],
                normalParams: []
            }
        }
    },
    watch: {
        advancedParamsFlag: {
            handler: function (newVal, oldVal) {
                if (newVal) {
                    // this.form.request.paramsTemp = {}
                    this.form.request.params = this.form.request.paramsTemp
                } else {
                    this.form.request.params = this.normalParams
                }
            }
        },
        immediate: true,
        sync: function (newVal, oldVal) {
            if (newVal) {
                this.showTestAsyncButton = false
            } else {
                // this.showTestAsyncButton = false
            }
        }
    },
    mounted() {
        this.init()
        this.initAsync()
        // this.test()
        this.getApiDetail()
    },
    methods: {
        init() {
            this.interfaceTestInfo = this.$route.params
            for (var key in this.interfaceTestInfo.requestParas[0]) {
                if (key !== 'id' && key !== 'orders') {
                    this.form.request.paramsKeys.push(key)
                }
            }
            this.form.request.paramsKeys.shift()
            this.form.request.paramsKeys.splice(3,0,'modeDescription')
            // 获取请求参数列表
            for (let i = 0; i < this.interfaceTestInfo.requestParas.length; i++) {
                if (this.interfaceTestInfo.requestParas[i].required === 1) {
                    this.interfaceTestInfo.requestParas[i].required = '是'
                } else {
                    this.interfaceTestInfo.requestParas[i].required = '否'
                }
                if (this.interfaceTestInfo.requestParas[i].mode === 'senior') {
                    this.interfaceTestInfo.requestParas[i].modeDescription = '高级参数'
                    this.advancedParams.push(this.interfaceTestInfo.requestParas[i])
                    this.interfaceTestInfo.requestParas[i].advanced = true
                } else {
                    this.interfaceTestInfo.requestParas[i].modeDescription = '普通参数'
                    this.normalParams.push(this.interfaceTestInfo.requestParas[i])
                    // this.normalParams.push(this.form.request.params[i])
                    this.interfaceTestInfo.requestParas[i].advanced = false
                }
            }
            this.form.request.params = this.normalParams
            this.form.request.paramsTemp = this.interfaceTestInfo.requestParas
            this.form.request.bodyParams = this.interfaceTestInfo.bodyParams
            this.form.selectMethod = this.interfaceTestInfo.requestMethod
            if (this.interfaceTestInfo.type === 'script') {
                this.form.url = window.location.href.split(":")[0] + "://"+ window.location.host + `/script/scriptToAPI/${this.interfaceTestInfo.apiName}`
            } else if (this.interfaceTestInfo.type === 'web'){ // web
                this.form.url = window.location.href.split(":")[0] + "://"+ window.location.host + `/web/api/${this.interfaceTestInfo.apiName}`
            }else if (this.interfaceTestInfo.type === 'tools') { // snmp
                this.form.url = window.location.href.split(":")[0] + "://"+ window.location.host + `/tools/api/${this.interfaceTestInfo.apiName}`
            } else{
                this.form.url = 'unSupport type'
            }
        },
        initAsync() {
            this.dialog.form.url = window.location.href.split(":")[0] + "://"+ window.location.host + `/script/result`
        },
        getApiDetail() {
            const data = this.$route.params
        },
        // table的row
        tableRowClassName({
                              row,
                              rowIndex
                          }) {
            if (row.advanced) {
                return 'fadeInDown animated';
            }
            return '';
        },
        //格式化功能
        beautify() {
            var options = {
                dom: '#containers' // 对应容器的css选择器
            }
            var jf = new JsonFormater(options) // 创建对象
            jf.doFormat(this.interfaceTestResponse) // 格式化json
        },
        exchangeZN(value) {
            switch (value) {
                // case 'mode':
                //     return '参数类型'
                case 'modeDescription':
                    return '参数类型'
                case 'name':
                    return '名称'
                case 'type':
                    return '类型'
                case 'required':
                    return '必填'
                case 'remark':
                    return '备注'
                case 'sample':
                    return '示例'
                default:
                    return ''
            }
        },
        test() {
            const temp = {}
            const data = {}
            this.form.request.paramsTemp.forEach((element) => {
                data[element.name] = element.sample
            })
            temp.requestMethod = this.form.selectMethod
            temp.url =  this.form.url
            temp.data = data
            this.InterfaceTest(temp)
        },
        testAsync() {
            const temp = {}
            temp.requestMethod = this.dialog.form.selectMethod
            temp.url =  this.dialog.form.url
            temp.data = { request_id: this.dialog.form.request.params[0].sample }
            this.asyncInterfaceTest(temp)
        },
        /*测试异步*/
        asyncInterfaceTest(params) {
            this.dialog.asyncLoading = true
            let startTime = new Date()
            const {
                url,
                requestMethod,
                data
            } = params
            var temp1 = null
            if (requestMethod === 'get' || requestMethod === 'GET') {
                axios.get(`${url}?request_id=${data.request_id}` , {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }).then(res => {
                    this.dialog.asyncLoading = false
                    let endTime = parseFloat(new Date() - startTime) + '毫秒'
                    this.dialog.interfaceTestResponse = res.data
                    this.dialog.timeConsuming = endTime
                    this.$nextTick(() => {
                        var options = {
                            dom: '#dialogContainers' // 对应容器的css选择器
                        }
                        var jf = new JsonFormater(options) // 创建对象
                        jf.doFormat(this.dialog.interfaceTestResponse) // 格式化json
                    })
                }).catch(err => {
                    this.dialog.asyncLoading = false
                })
            }
        },
        // 判断是否含有大写字母
        hasCapital(str) {
            var result = str.match(/^.*[A-Z]+.*$/);
            if (result == null) return false;
            return true;
        },
        InterfaceTest(params) {
            this.loading = true
            let startTime = new Date()
            const {
                url,
                requestMethod,
                data
            } = params
            var temp1 = null
            if (this.secret) {
                temp1 = JSON.parse(JSON.stringify(data))
                let keys = Object.keys(data)
                for (let i=0;i<keys.length;i++){
                    temp1[keys[i]] = encryptInterfaceTest(temp1[keys[i]])
                }
                temp1.secret = 1
            } else {
                temp1 = JSON.parse(JSON.stringify(data))
                temp1.secret = 0
            }
            if (this.sync)  {
                temp1.sync = 1
            } else {
                temp1.sync = 0
            }
            if (requestMethod === 'post' || requestMethod === 'POST') {
                axios.post(url,temp1 , {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    transformRequest: [function (data) {
                        var test = Qs.stringify(data)
                        return test
                    }]
                }).then(res => {
                    this.loading = false
                    let endTime = parseFloat(new Date() - startTime) + '毫秒'
                    this.interfaceTestResponse = res.data
                    this.dialog.form.request.params[0].sample = res.data.request_id
                    if (Boolean(res.data.request_id)) {
                        this.showTestAsyncButton = true
                    }
                    this.timeConsuming = endTime
                    this.$nextTick(() => {
                        this.beautify()
                    })
                }).catch(err => {
                    this.loading = false
                })
            }
        },
        // 返回上一页
        back(){
            this.$router.back(-1)
        },
        linkTo() {
            // this.$router.back(-1)
        }
    },
    beforeDestroy() {
        this.showTestAsyncButton = false
    },
    template: `
        <div>
        <!--main-->
        <div 
v-loading="loading"
element-loading-spinner="el-icon-loading"
element-loading-text="接口测试中，请稍后..."
class="interface-test" style="height: 100%;width: 98%;padding: 20px">
  <h3 style="position: relative;font-size: 14px;"><span>{{interfaceTestInfo.name}}</span><i class="back" @click="back"></i></h3>
  <h4 
  style="border-bottom: 1px dotted #ebeef5;padding-bottom: 10px;
  padding-top: 5px;font-weight: normal;color: #e5e5e5;margin-bottom: 15px;">
    <span>{{interfaceTestInfo.apiName}}</span>
  </h4>
  <el-row>
    <el-row :gutter="20">
      <el-col :span="2">
        <el-input
          v-model="form.selectMethod"
          :disabled="true">
        </el-input>
      </el-col>
      <el-col :span="20">
        <el-input v-model="form.url" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button style="float: right;" type="success" @click="test">发送</el-button>
      </el-col>
    </el-row>
  </el-row>
  <el-row>
    <el-row>
      <el-card class="" style="margin-top: 15px;">
        <div slot="header" style="display:flex;align-items: center;">
          <span style="color: #05b91d;font-size: 16px;padding-right: 10px;">请求参数</span>
          <span style="color:#E6A23C;font-size: 16px; padding-right: 10px;" class="test__advanced">是否开启高级参数</span>
          <el-switch v-model="advancedParamsFlag"></el-switch>
           <span style="color:#E6A23C;font-size: 16px; padding-left: 10px;padding-right: 10px" class="test__advanced">是否加密</span>
          <el-switch v-model="secret"></el-switch>  
          <span v-if="interfaceTestInfo.type === 'script'" style="color:#E6A23C;font-size: 16px; padding-left: 10px;padding-right: 10px" class="test__advanced">是否同步</span>
          <el-switch v-if="interfaceTestInfo.type === 'script'" v-model="sync"></el-switch>
           <el-button v-if="showTestAsyncButton" @click="asyncResult=true" size="small" type="primary" style="margin-left: 10px;">异步结果查询</el-button>
        </div>
        <div>
          <el-table
            :data="form.request.params"
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column :label=exchangeZN(item) v-for="(item, index) in form.request.paramsKeys" :key="item.key">
              <template slot-scope="scope">
                <el-tooltip :disabled="item !== 'remark' && item !== 'sample'" :hide-after="1500" effect="dark" :content="scope.row[item]" placement="top">
                  <div class="form-data" >
                    <el-input :disabled="item !== 'sample'" v-model="scope.row[item]" :type="(item === 'sample' && scope.row['displayType'] === 'password') ? 'password' : 'text'"></el-input>
                  </div>
                </el-tooltip >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-input
          disabled
          type="textarea" v-if="this.interfaceTestInfo.enc_type === 'raw' && this.form.selectMethod === 'post'"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="暂无参数"
          v-model="getBodyParams" style="margin-top: 10px">
        </el-input>
      </el-card>
    </el-row>
  </el-row>
  <el-row>
    <el-card class="">
      <div slot="header" class="clearfix">
        <!--<el-button type="primary" @click="beautify">格式化</el-button>-->
        <span style="margin-left: 15px; cursor: pointer;">返回结果</span>
        <span style="margin-left: 20px;color:#409EFF;" v-show="this.timeConsuming"> 响应时间： {{this.timeConsuming}}</span>
      </div>
      <div class="response-data" style="margin-top: 15px;min-height: 300px;">
        <img v-if="this.interfaceTestResponseType === 'image'" :src="this.interfaceTestResponse.imageURL" alt="">
        <p  v-else id="containers" v-show="this.interfaceTestResponse.code" v-html="this.interfaceTestResponse"></p>
      </div>
    </el-card>
  </el-row>
</div>

        <!--弹框-->
        <!--异步结果查询-->
            <el-dialog
            class="interface-api-list"
            title="异步结果查询"
            :visible.sync="asyncResult"
            width="65%">
          <div 
        v-loading="dialog.loading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="接口测试中，请稍后..."
        class="interface-test" style="height: 100%;width: 98%;padding: 20px">
          <el-row>
            <el-row :gutter="20">
              <el-col :span="2">
                <el-input
                  v-model="form.selectMethod"
                  :disabled="true">
                </el-input>
              </el-col>
              <el-col :span="20">
                <el-input v-model="dialog.form.url" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button style="float: right;" type="success" @click="testAsync">发送</el-button>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-row>
              <el-card class="" style="margin-top: 15px;">
                <div slot="header" style="display:flex;align-items: center;">
                  <span style="color: #05b91d;font-size: 16px;padding-right: 10px;">请求参数</span>
                </div>
                <div>
                  <el-table
                    :data="dialog.form.request.params"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column :label=exchangeZN(item) v-for="(item, index) in dialog.form.request.paramsKeys" :key="item.key">
                      <template slot-scope="scope">
                        <el-tooltip :disabled="item !== 'remark' && item !== 'sample'" :hide-after="1500" effect="dark" :content="scope.row[item]" placement="top">
                          <div class="form-data" >
                            <el-input :disabled="item !== 'sample'" v-model="scope.row[item]" :type="(item === 'sample' && scope.row['displayType'] === 'password') ? 'password' : 'text'"></el-input>
                          </div>
                        </el-tooltip >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-input
                  disabled
                  type="textarea" v-if="this.dialog.interfaceTestInfo.enc_type === 'raw' && this.dialog.form.selectMethod === 'post'"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="暂无参数"
                  v-model="getBodyParams" style="margin-top: 10px">
                </el-input>
              </el-card>
            </el-row>
          </el-row>
          <el-row>
            <el-card class="">
              <div slot="header" class="clearfix">
                <!--<el-button type="primary" @click="beautify">格式化</el-button>-->
                <span style="margin-left: 15px; cursor: pointer;">返回结果</span>
                <span style="margin-left: 20px;color:#409EFF;" v-show="this.dialog.timeConsuming"> 响应时间： {{this.dialog.timeConsuming}}</span>
              </div>
              <div class="response-data" style="margin-top: 15px;min-height: 150px;">
                <img v-if="this.dialog.interfaceTestResponseType === 'image'" :src="this.dialog.interfaceTestResponse.imageURL" alt="">
                <p  v-else id="dialogContainers" v-show="this.dialog.interfaceTestResponse.code" v-html="this.dialog.interfaceTestResponse"></p>
              </div>
            </el-card>
          </el-row>
        </div>
        </div>
    `
}