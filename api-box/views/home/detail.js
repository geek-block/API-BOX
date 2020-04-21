// 接口测试页
// 定义一个主体页
var Detail = {
  data: function() {
    return {
      detail: {
        errorType: {}
      },
      tooltip: true,
      activeName: 'first',
      test: "<h1>H1</h1>"
    }
  },
  mounted () {
    this.getApiDetail()
  },
  methods: {
    enter (ref) {
      const dom = this.$refs[ref][0]
      if (dom.scrollWidth > dom.offsetWidth) { // 当内容宽度 > 容器宽度时
        this.tooltip = false
      }
    },
    leave (ref) {
      this.tooltip = true
    },
    // 接口详情请求
    getApiDetail() {
      const data = this.$route.params
      this.detail = data
    },
    // 切换标签页
    handleClick(tab, event) {
    }
  },
  template: `
    <div class="detail">
      <div class="downLeft">
        <div class="content">
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="API文档" name="first">
                <p><strong>接口名称：</strong><span>{{detail.name}}</span></p>
                <p><strong>API名称：</strong><span>{{detail.apiName}}</span></p>
                <p><strong>接口地址：</strong><span>{{detail.url}}</span></p>
                <p><strong>返回格式：</strong><span>{{detail.pattern}}</span></p>
                <p><strong>请求方式：</strong><span>{{detail.requestMethod}}</span></p>
                <div>
                    <strong style="float: left;">请求示例：</strong>
                    <p style="float: left;">
                     {{detail.requestUrl}}<br>
                      <span v-if="detail.requestParamSample" style="border-radius: 4px;background-color: #f5f5f5;display: block;border: 1px solid #ccc;padding: 1em;width: 100%">{{detail.requestParamSample}}</span>
                    </p>
                </div>
              <p style="clear: both;"><strong>接口备注：</strong><span>{{detail.remark}}</span></p>
              <h4>请求参数说明</h4>
              <div class="th">
              <div class="col-req col-req-name"><nobr>名称</nobr></div>
              <div class="col-req col-req-type"><nobr>类型</nobr></div>
              <div class="col-req col-req-required"><nobr>必填</nobr></div>
              <div class="col-req col-req-sample"><nobr>示例</nobr></div>
                <div class="col-req col-req-remark"><nobr>描述</nobr></div>
              </div>
              <div class="tr" v-for="req in detail.requestParas" :key="req.id">
                <div class="col-req col-req-name">
                  <el-tooltip :disabled="tooltip" effect="light" :content="req.name" placement="top">
                    <nobr>{{req.name}}</nobr>
                  </el-tooltip>
                </div>
                <div class="col-req col-req-type"><nobr>{{req.type}}</nobr></div>
                <div class="col-req col-req-required" v-if="req.required === 1"><nobr>是</nobr></div>
                <div class="col-req col-req-required" v-else><nobr>否</nobr></div>
                <div class="col-req col-req-sample" @mouseenter="enter(req.id)" @mouseleave="leave(req.id)" :ref="req.id">
                  <el-tooltip :disabled="tooltip" effect="light" :content="req.sample" placement="left">
                    <nobr>{{req.sample}}</nobr>
                  </el-tooltip>
                </div>
                <div class="col-req col-req-remark" @mouseenter="enter(req.name)" @mouseleave="leave(req.name)" :ref="req.name">
                  <el-tooltip :disabled="tooltip" effect="light" :content="req.remark" placement="left">
                    <nobr>{{req.remark}}</nobr>
                  </el-tooltip>
                </div>
              </div>
              <h4>返回参数说明</h4>
              <div class="th">
                <div class="col-req col-req-name"><nobr>名称</nobr></div>
                <div class="col-req col-req-type"><nobr>类型</nobr></div>
                <div class="col-req col-req-sample-2"><nobr>示例</nobr></div>
                <div class="col-req col-req-remark-2"><nobr>描述</nobr></div>
              </div>
              <div class="tr" v-for="trn in detail.rtnParas" :key="trn.id">
                <div class="col-req col-req-name"><nobr>{{trn.name}}</nobr></div>
                <div class="col-req col-req-type"><nobr>{{trn.type}}</nobr></div>
                <div class="col-req col-req-sample-2" @mouseenter="enter(trn.id)" @mouseleave="leave(trn.id)" :ref="trn.id">
                  <el-tooltip :disabled="tooltip" effect="light" :content="trn.sample" placement="left">
                    <nobr>{{trn.sample}}</nobr>
                  </el-tooltip>
                </div>
                <div class="col-req col-req-remark-2" @mouseenter="enter(trn.name)" @mouseleave="leave(trn.name)" :ref="trn.name">
                  <el-tooltip :disabled="tooltip" effect="light" :content="trn.remark" placement="left">
                    <nobr>{{trn.remark}}</nobr>
                  </el-tooltip>
                </div>
              </div>
              </el-tab-pane>
              <el-tab-pane label="错误码参照" name="second">
                   <h4>错误码参照</h4>
                  <div class="th">
                   <div class="col-1"><nobr>错误码</nobr></div>
                   <div class="col-4"><nobr>说明</nobr></div>
                  </div>
                  <div class="tr" v-for="errorType in detail.errorType.errorCodes" :key="errorType.errorCode">
                    <div class="col-1"><nobr>{{errorType.errorCode}}</nobr></div>
                    <div class="col-4"><nobr>{{errorType.errorMsg}}</nobr></div>
                  </div>
                </el-tab-pane>
              <el-tab-pane label="示例代码" name="third">
                    <p v-for="(example, index) in detail.interfaceExamples" :key="index">
                        <pre class="pre-code">{{ example.code }}</pre>
                    </p>
               </el-tab-pane>
        </el-tabs>
        </div>
      </div>
    </div>
    `
}