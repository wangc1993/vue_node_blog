<template>
  <div class="userList">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-table
          :data="tableList"
          style="width: 100%"
          :default-sort = "{prop: 'date', order: 'descending'}"
          height="530"
          >
          <el-table-column
            v-for="(item, index) in headList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.prop === '_id' || item.prop === 'isAdmin' ? true : false"
            :fixed="item.prop === '_id' ? true : false"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
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
          :page-sizes="[8, 15, 30, 50]"
          :pageSize="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getUserList, getUserAllCount, deleteUser } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: '',
  data() {
    return {
      totalCount: 0,//总数
      pageSize: 8,//每页数量
      currentPage: 1,//当前页
      tableList: [],
      headList: [
        {prop: '_id', label: 'id', width: '220'},
        {prop: 'username', label: '用户名', width: '120'},
        {prop: 'password', label: '密码', width: '250'},
        {prop: 'isAdmin', label: '管理员', width: '120'}
      ]
    }
  },
  methods: {
    openConfirm(index, rows) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
    deleteRow(index, rows) {
      deleteUser({
        id: rows[index]._id
      }).then(res => {
        if(res.data.code === 1){
          util.setMessage(this, res.data.message, 'success');
          rows.splice(index, 1);
          /*重新刷新*/
          this.getUserAllCount();
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    changeSizeChange(val) {
      this.pageSize = val;
      this.getUserList(this.currentPage, val);
    },
    changeCurrentChange(val) {
      this.currentPage = val;
      this.getUserList(val, this.pageSize);
    },
    /*获取对应页码的用户列表*/
    getUserList(currentPage, pageSize) {
      getUserList({
        currentPage,
        pageSize
      }).then(res => {
        if(res.data.code === 1){
          this.tableList = res.data.userList;
          this.tableList.forEach((user, index) => {
            if(user.isAdmin){
              user.isAdmin = '是';
            }else{
              user.isAdmin = '否';
            }
          });
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    getUserAllCount() {
      getUserAllCount().then(res => {
        if(res.data.code === 1){
          this.totalCount = res.data.totalCount;
          this.getUserList(this.currentPage, this.pageSize);
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      });
    }
  },
  created() {
    this.getUserAllCount();
  }
}
</script>
<style scoped lang="scss">
  .userList {
    min-width: 1366px;
    .el-row {
      margin-top: 30px;
    }
  }
</style>
