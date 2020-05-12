// 定义一个主体页
var Pagination = {
  props: {
    currentPage: { // 当前页码
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: { // 当前总数
      type: Number,
      default: 1
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.$emit('pageChange', val)
    },
    handleSizeChange (val) {
      this.$emit('sizeChange', val)
    }
  },
  template: `
    <div class="pagination" style="padding-top: 10px;float: right;width: 100%;padding-right:10px;background: #fff">
      <el-pagination
        background
        style="float: right;height: 50px;background: #fff;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    `
}