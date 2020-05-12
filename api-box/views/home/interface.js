//列表页
// 定义一个主体页
var Interface = {
    components: {
        Pagination
    },
    data: function () {
        return {
            token: null,
            listParams: {
                keyWord: '',
                page: 1,
                pageSize: 10,
                // sort: 'desc'
            },
            apiList: {
                PageNo: 1,
                Total: 1,
                Items: []
            },
            loading: false,
            dialogVisible: false,
            fileList: [],
            uploadFiles: [],
            syncLoading: false,
            sameApiName: false,
            openApiNameDialog: false,
            checkedSameApiName: false,
            isShow: false,
            //同步列表参数
            syncParams: {
                page: 1,
                pageSize: 5
            },
            //同步列表
            syncList: [],
            syncData: {},
            //接口的下载数
            syncDownload: false,
            multipleSelection: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            licenseData: {},
            asyncResult: false,

            /*-----------*/
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
            sync: true,
            advancedParams: [],
            normalParams: []
        }
    },
    watch: {
        dialogVisible: function(newQuestion, oldQuestion) {
            if (!newQuestion) {
                this.fileList = []
            }
        },
        multipleSelection: function (newVal, oldVal) {
        }
    },
    computed: {
        // 计算天数
        validLicense: function () {
            //把开始时间转换成秒数
            let sDate1 = Date.parse(this.licenseData.start_time);
            //把结束时间转换成秒数
            let sDate2 = Date.parse(this.licenseData.end_time);
            return sDate2 - sDate1 > 0
        },
        getUserName() {
            return unescape(getCookie('zbww-username'))
        }
    },
    mounted() {
        this.token = getCookie('zbww-token')
        this.init()
        this.license()
        this.guide()

        /*--------*/
        this.initAsync()
        this.getApiDetail()
    },
    methods: {
        init(param) { // 初始化，获取列表
            this.loading = true
            var url = ''
            if (param) {
                url = '/interface/list?page=' + this.listParams.page + "&pageSize=" + this.listParams.pageSize + "&param=" + param
            } else {
                url = '/interface/list?page=' + this.listParams.page + "&pageSize=" + this.listParams.pageSize
            }
            axios.get(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                transformRequest: [function (data) {
                    var test = Qs.stringify(data)
                    return test
                }]
            }).then(response => {
                if (response.data.code === 200) {
                    this.apiList = response.data.data
                } else {
                    ELEMENT.Message({
                        showClose: true,
                        message: response.data.msg+ '1',
                        duration: 3000,
                        type: 'error'
                    })
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },
        //guide
        guide(){
            axios.get("/guide")
                .then(res => {
                    let self = this
                    if(res.data.data.interfaces >= 1) {
                        //已同意法律声明
                    } else {
                        introJs().start().onbeforeexit(function () {
                            self.interfaces()
                            return
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //user
        interfaces(){
            axios.get("/guide/interfaces")
                .then(res => {
                    if(res.data.code === 200) {
                        //已同意法律声明
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        license(){
            axios.get('/license/parse', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                params: {}
            }).then((response) => {
                if (response.data.code === 200) {
                    this.licenseData = response.data.data
                } else {
                }
            }).catch(() => {
                this.licenseData = {}
            })
        },
        nameQuery(param) { // 查询
            this.init(param)
        },
        pageChange(value) { // 换页
            this.listParams.page = value
            this.init(this.listParams.keyWord)
        },
        sizeChange(value) {
            this.listParams.pageSize = value
            this.init()
        },
        pageChangeApi(value){
            this.syncParams.page = value
            this.getSync(this.syncParams)
        },
        sizeChangeApi(value){
            this.syncParams.pageSize = value
            this.getSync(this.syncParams)
        },
        detail(data) { // 查看详情
            this.$router.push({
                name: 'detail',
                params: data
            })
        },
        interfaceTest(data) { // 测试
            this.$router.push({
                name: 'test',
                params: data
            })
        },
        apiDelete(id) { // 删除
            this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true
                axios.post('/interface/delete', {
                    interfaceId: id
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    transformRequest: [function (data) {
                        // 对 data 进行任意转换处理
                        var test = Qs.stringify(data)
                        return test
                    }]
                }).then(response => {
                    if (response.data.code === 200) {
                        // 渲染data
                        this.init()
                    } else {
                        ELEMENT.Message({
                            showClose: true,
                            message: response.data.msg,
                            duration: 3000,
                            type: 'error'
                        })
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            })
        },

        // 添加API
        add() {
            this.dialogVisible = true
        },
        /* 异步结果查询*/
        asyncResultChecked() {
            this.asyncResult = true
        },
        //同步
        synchro() {
            this.isShow = true
            if (this.validLicense) {
                this.getSync(this.syncParams)
            }
        },
        //选中多个api
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        checkboxT(row, rowIndex){
            if(row.exists_status === 1){
                return false;//禁用
            }else{
                return true;//不禁用
            }
        },
        // 获取同步的list
        getSync(param) {
            axios.defaults.headers.common['Authorization'] = this.token
            axios.get('/apiStore/interfaces?page='+param.page+"&"+"pageSize="+param.pageSize, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                transformRequest: [function (data) {
                    var test = Qs.stringify(data)
                    return test
                }]
            }).then(response => {
                if (response.data.code === 200) {
                    var syncListTotal = 0
                    for (let i = 0;i<response.data.data.list.length;i++) {
                        if (response.data.data.list[i].update_status === 0) {
                            response.data.data.list[i].update_text = 'latest'
                        } else {
                            response.data.data.list[i].update_text = 'update'
                        }
                        response.data.data.list[i].index = i
                        if (response.data.data.list[i].exists_status === 1) {
                            syncListTotal++
                            response.data.data.list[i].loading = 2
                        } else {
                            response.data.data.list[i].loading = 0
                        }
                    }
                    if (syncListTotal === response.data.data.list.length && syncListTotal !== 0) {
                        this.syncDownload = true
                    }
                    this.syncData = response.data.data
                    this.syncList = response.data.data.list
                } else {
                    this.syncDownload = false
                    ELEMENT.Message({
                        showClose: true,
                        message: '账号未登陆！',
                        duration: 3000,
                        type: 'error'
                    })
                }
            }).catch(error => {
            })
        },
        /*同步单个*/
        syncInterfaceSign(interfaceId, index) {
            var self = this
            this.syncList[index].loading = 1
            axios.get('/interface/download?interfaceId=' + interfaceId ).then(function (res) {
                if (res.data.code === 200) {
                    self.syncList[index].loading = 2
                    self.syncList[index].update_status = 0
                    self.init()
                } else if (res.data.code.toString().length === 6 ) {
                    self.syncList[index].loading = 0
                    self.$message.error('添加接口失败! ' + res.data.msg)
                }
            })

        },
        syncInterface(interfaceId){
            return axios.get('/interface/download?interfaceId=' + interfaceId )

        },
        //同步接口
        syncInterfaces(){
            var syncArr = []

            var multipleSelection = this.multipleSelection
            for (let i = 0;i< multipleSelection.length;i++) {
                let interfaceId = this.multipleSelection[i].id
                let index = this.multipleSelection[i].index
                this.syncList[index].loading = 1
                syncArr.push(this.syncInterface(interfaceId))
            }
            var self = this
            axios.all(syncArr).then(function (res) {
                var arr = []
                for (let y=0;y<multipleSelection.length;y++) {
                    for (let i=0;i<res.length;i++) {//list
                        let response = res[i]
                        let flag = response.data.code.toString().length === 6
                        if (flag) { //error
                            if (response.data.data === multipleSelection[y].id) { // 找到multipleSelection的index
                                let index = multipleSelection[y].index
                                arr.push(index)
                            } else {
                                let index = multipleSelection[y].index
                                self.syncList[index].loading = 2
                            }
                        }else {
                            self.syncList[multipleSelection[y].index].loading = 2
                        }
                    }
                }
                for (let i = 0;i<arr.length;i++) {
                    self.syncList[arr[i]].loading = 0
                    self.$message.error( self.syncList[arr[i]].name + '添加失败! ' + res[i].data.msg)
                }
                self.init()
            })
        },
        getData() {
            this.isShow = false
        },
        submitUpload() {
            this.$refs.add.submit()
        },
        // 添加接口
        handleAvatarSuccess(res, file) {
            if (res.code === 200) {
                this.$message.success('添加接口成功!')
                this.dialogVisible = false
                this.fileList = []
                this.init()
            } else if (res.code.toString().length === 6 ) {
                this.$message.error('添加接口失败! ' + res.msg)
                this.fileList = []
            }
            this.openApiNameDialog = false
        },
        changeFile(file, fileList){
            if (fileList.length === 1) {
                this.uploadFiles = fileList
            } else {
                fileList.shift()
                this.checkAPiName(file.name)
                this.uploadFiles = fileList
            }
            if (!this.openApiNameDialog && this.dialogVisible) { //
                this.checkAPiName(file.name)
            }
        },
        progressFile(event, file, fileList){
        },
        // sameApiName 控制dialog，当确定的时候sameApiName = true, 打开框，当关闭框不需要检查检查名
        checkAPiName(apiName){
            let self = this
            axios.get('/interface/checkApiName?apiName=' + apiName ).then(function (res) {
                if (res.data.data === true) {
                    self.sameApiName = true
                    // self.$message.error('api已存在，是否要覆盖？')
                } else{
                    self.sameApiName = false
                }
            })
        },
        //选取文件
        beforeAvatarUpload(file) {
            const type = file.name.lastIndexOf(".zb")
            if (type == -1 || file.name.length != type + 3) {
                this.$message.error('文件类型不匹配!')
                return false
            }
            return true
        },
        checkApi(){
            //选择覆盖 不会提示
            this.sameApiName = false
            this.openApiNameDialog = true
        },
        unSelected(){
            // 取消
            this.sameApiName = false
            this.uploadFiles = []
            this.fileList = []
            this.openApiNameDialog = false
        },
        beforeClose(){
            this.dialogVisible = false
            this.openApiNameDialog = false
        },

        /*------------------------------------------------*/
        /*异步结果测试*/
        initAsync() {
            this.form.url = window.location.href.split(":")[0] + "://"+ window.location.host + `/script/result`
            return
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
            temp.data = { request_id: this.form.request.params[0].sample }
            this.InterfaceTest(temp)
        },
        // 判断是否含有大写字母
        hasCapital(str) {
            var result = str.match(/^.*[A-Z]+.*$/);
            if (result == null) return false;
            return true;
        },
        InterfaceTest(params) {
            this.asyncLoading = true
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
                    this.asyncLoading = false
                    let endTime = parseFloat(new Date() - startTime) + '毫秒'
                    this.interfaceTestResponse = res.data
                    this.timeConsuming = endTime
                    this.$nextTick(() => {
                        this.beautify()
                    })
                }).catch(err => {
                    this.asyncLoading = false
                })
            }
        },
        // 返回上一页
        back(){
            this.$router.back(-1)
        }
    },
    template: `
  <div class="interface"
  v-loading="syncLoading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="同步中请稍后！">
    <div class="tab-header">
        <router-link class="second" style="line-height: 0.5rem;" to="/container/mycenter">
        <span style="text-align: center;width: 1.63rem;display: inline-block;">个人中心</span>
        </router-link>
        <span class="active">我的数据接口</span>
    </div>
    <el-form :inline="true" class="demo-form-inline" size="mini" @submit.native.prevent>
      <el-form-item label="接口名称">
        <el-input v-model="listParams.keyWord" placeholder="接口名称或关键字" @keyup.enter.native="nameQuery(listParams.keyWord)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="nameQuery(listParams.keyWord)">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button data-step="1" data-intro="您可以在这里上传.zb包以添加API到本地" style="background: #00BFA5;color: #fff;border: none;" @click="add">添加</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button data-step="2" data-intro="您可以在这里从Api Store服务器拉取API到本地，但前提是您已经登录了系统" style="background: #00B9D5;color: #fff;border: none;" @click="synchro" >下载</el-button>
        <el-button type="primary" @click="asyncResultChecked">异步结果查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="apiList.Items"
      v-loading="loading"
      border
      stripe
      data-step="3" data-intro="您可以在这里查看到本地的API列表"
      size="mini">
      <el-table-column
        prop="name"
        label="接口名称"
        min-width="25%"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="apiName"
        min-width="20%"
        align="center"
        label="接口调用名">
      </el-table-column>
      <el-table-column
        prop="requestMethod"
        min-width="10%"
        align="center"
        label="请求方式">
      </el-table-column>
      <el-table-column
        prop="add_time"
        min-width="15%"
        align="center"
        label="添加时间">
      </el-table-column>
      <el-table-column
        prop="publicDate"
        min-width="15%"
        align="center"
        label="发布时间">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="15%">
        <template slot-scope="scope">
          <el-button
            style="margin-left: 0; padding: 5px"
            size="mini"
            type="primary"
            @click="detail(scope.row)">查看详情</el-button>
          <el-button
            style="margin-left: 0; padding: 5px;"
            size="mini"
            type="success"
            @click="interfaceTest(scope.row)">测试</el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-left: 0; padding: 5px;"
            @click="apiDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog
    class="same-api-name"
  title="提示"
  :visible.sync="sameApiName"
  width="20%">
  <span>api已存在，是否要覆盖？</span>
  <span slot="footer" class="dialog-footer" style="font-size: 12px;">
    <el-button size="small" @click="unSelected">取 消</el-button>
    <el-button size="small" type="primary" @click="checkApi">确 定</el-button>
  </span>
</el-dialog>


 <el-dialog
      title="API添加"
      :visible.sync="dialogVisible"
      :before-close="beforeClose"
      width="35%">
      <el-upload
        style="padding-bottom: 10px"
        class="upload-demo"
        ref="add"
        name="file"
        accept=".zb"
        action="/interface/add"
        :file-list="fileList"
        :multiple="false"
        :on-change="changeFile"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false">
        <div slot="tip" class="el-upload__tip">只能上传zb类型的文件！</div>
        <el-button slot="trigger" size="small" style="background: #00BFA5;color: #fff;border: none;">选取文件</el-button>
        <el-button  v-show="uploadFiles.length > 0" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">添加到BOX</el-button>
      </el-upload>
    </el-dialog>

<!--同步的静态-->
    <el-dialog
    class="interface-api-list"
    title="API列表"
    :visible.sync="isShow"
    width="65%">
  <el-table
    ref="multipleTable"
    :data="syncList"
    tooltip-effect="dark"
    style="margin-bottom: 20px;"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      :selectable='checkboxT'
      width="55">
    </el-table-column>
    <el-table-column
      label="名称">
      <!--已下载的才提示：and1是最新的用绿色，and2待更新的用红色-->
      <template slot-scope="scope">
       <el-badge is-dot v-if="scope.row.update_status === 0&&scope.row.loading === 2" class="item item-badge">
         <span>{{ scope.row.name }}</span>
       </el-badge>
       <el-badge is-dot v-if="scope.row.update_status === 1&&scope.row.loading === 2" class="item item-badge item-badge-old">
         <span>{{ scope.row.name }}</span>
       </el-badge>
       <el-badge v-if="(scope.row.loading === 1&&scope.row.loading !== 2)||(scope.row.loading === 0&&scope.row.loading !== 2)" class="item">
         <span>{{ scope.row.name }}</span>
       </el-badge>
      </template>
    </el-table-column>
    <el-table-column
      prop="apiName"
      label="apiName">
    </el-table-column>
     <el-table-column
      prop="publicDate"
      width="160"
      label="发布时间">
    </el-table-column>
    <el-table-column
      prop="fileUpdateTime"
      width="160"
      label="最新修改时间">
    </el-table-column>
     <el-table-column
        label="状态"
        width="60">
        <template slot-scope="scope">
            <i @click="syncInterfaceSign(scope.row.id, scope.$index)" style="color:#409EFF;font-size: 16px;cursor: pointer;" v-if="scope.row.loading === 0" class="el-icon-download"></i>
            <i style="color:#F56C6C;font-size: 16px;" v-if="scope.row.loading === 1" class="el-icon-loading"></i>
            <i style="color:#67C23A;font-size: 16px;" v-if="scope.row.loading === 2&&scope.row.update_status === 0" class="el-icon-check"></i>
            <img class="api-icon-refresh" @click="syncInterfaceSign(scope.row.id, scope.$index)" v-if="scope.row.loading === 2&&scope.row.update_status === 1" src="../images/api-icon-refresh.png" alt="">
        </template>
      </el-table-column>
  </el-table>
  <Pagination :currentPage="apiList.pageNum" :pageSize="5" @pageChange="pageChangeApi" @sizeChange="sizeChangeApi" :total="syncData.total"></Pagination>
  <div class="buttons">
   <el-button disabled v-if="syncDownload" type="success">已同步所有API</el-button>
    <el-button v-else :disabled="this.multipleSelection.length === 0" style="background: #00B9D5;color: #fff;border-color:#00B9D5;" @click="syncInterfaces">下载</el-button>
    <el-button @click="getData">取消</el-button>
</div>
</el-dialog>

<!--异步结果查询-->
    <el-dialog
    class="interface-api-list"
    title="异步结果查询"
    :visible.sync="asyncResult"
    width="65%">
    <div>
            
            <div 
v-loading="loading"
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
      <div class="response-data" style="margin-top: 15px;min-height: 150px;">
        <img v-if="this.interfaceTestResponseType === 'image'" :src="this.interfaceTestResponse.imageURL" alt="">
        <p  v-else id="containers" v-show="this.interfaceTestResponse.code" v-html="this.interfaceTestResponse"></p>
      </div>
    </el-card>
  </el-row>
</div>

    </div>
</el-dialog>

<!--页码的静态-->
    <Pagination :currentPage="apiList.PageNo" :pageSize="10" @pageChange="pageChange" @sizeChange="sizeChange" :total="apiList.Total"></Pagination>
</div>
    `
}