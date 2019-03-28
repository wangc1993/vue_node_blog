<template>
  <div class="content">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-table
          :data="tableList"
          style="width: 100%"
          :default-sort = "{prop: 'date', order: 'descending'}"
          height="530"
          tooltip-effect="dark"
          >
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in headList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.prop === 'views' || item.prop === 'categoryName' || item.prop === 'author'? true : false"
            :fixed="item.prop === '_id' ? true : false"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="updateRow(scope.$index, tableList)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="openConfirm(scope.$index, tableList)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float: right;"
          @size-change="changeSizeChange"
          @current-change="changeCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15]"
          :pageSize='pageSize'
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getContentList, getContentAllCount, deleteContent } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: '',
  data() {
    return {
      totalCount: 0,//总数
      pageSize: 5,//每页数量
      currentPage: 1,//当前页
      tableList: [],
      headList: [
        {prop: '_id', label: 'id', width: '220'},
        {prop: 'author', label: '作者', width: '100'},
        {prop: 'title', label: '标题', width: '200'},
        {prop: 'description', label: '描述', width: '200'},
        {prop: 'addTime', label: '创建时间', width: '200'},
        {prop: 'views', label: '阅读量', width: '200'},
        {prop: 'categoryName', label: '分类名', width: '100'}
      ]
    }
  },
  methods: {
    openConfirm(index, rows) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteRow(index, rows);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /*删除对应分类*/
    deleteRow(index, rows) {
      deleteContent({
        id: rows[index]._id
      }).then(res => {
        if(res.data.code === 1){
          util.setMessage(this, res.data.message, 'success');
          rows.splice(index, 1);
          /*重新刷新*/
          this.getContentAllCount();
          this.getContentList(this.currentPage, this.pageSize);
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    updateRow(index, rows) {
      this.$router.push({ name: 'admin-content-edit', params: {
        contentId: rows[index]._id,
        title: rows[index].title,
        description: rows[index].description,
        content: rows[index].content,
        category: rows[index].category
      }});
    },
    changeSizeChange(val) {
      this.pageSize = val;
      this.getContentList(this.currentPage, val);
    },
    changeCurrentChange(val) {
      this.currentPage = val;
      this.getContentList(val, this.pageSize);
    },
    /*获取对应页码的分类列表*/
    getContentList(currentPage, pageSize) {
      getContentList({
        currentPage,
        pageSize,
        categoryId: ''
      }).then(res => {
        if(res.data.code === 1){
          res.data.contentList.forEach(item => {
            item.categoryName = item.category.categoryName;
            item.author = item.author.username;
          })
          this.tableList = res.data.contentList;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    getContentAllCount() {
      getContentAllCount({categoryId: ''}).then(res => {
        if(res.data.code === 1){
          this.totalCount = res.data.totalCount;
          /*第一次获取第一页,默认每页5条*/
          this.getContentList(this.currentPage, this.pageSize);
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      });
    }
  },
  created() {
    this.getContentAllCount();
  }
}
</script>
<style scoped lang="scss">
  .content {
    min-width: 1366px;
    .el-row {
      margin-top: 30px;
    }
  }
</style>
