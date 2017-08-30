<template>
<div>
  <el-button @click="addBookButton" el-button type="info">添加</el-button>
  <el-table :data="books" style="width: 100%" :default-sort="{prop: 'id', order: 'descending'}">
    <el-table-column prop="id" label="ID" sortable width="180"></el-table-column>
    <el-table-column prop="author" label="作者"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="price" label="价格" sortable></el-table-column>
    <el-table-column prop="date" label="出版时间" sortable></el-table-column>
    <el-table-column label="操作" width="180">
      <template scope="scope">
             <el-button @click="delBook(scope.$index,scope.row)" el-button type="danger">删除</el-button>
         </template>
    </el-table-column>
  </el-table>

  <!-- 添加数据 -->
  <div id="addBook" style="display: none">
    <table>
      <tr>
        <td>作者</td>
        <td>
          <el-input v-model="book.author" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td>姓名</td>
        <td>
          <el-input v-model="book.name" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td>价格</td>
        <td>
          <el-input v-model="book.price" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td>出版时间</td>
        <td>
          <el-date-picker v-model="book.date" type="date" format="yy-MM-dd" placeholder="选择日期"></el-date-picker>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <el-button @click="submitData" el-button type="info">提交</el-button>
        </td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      url: './static/book.json',
      books: [],
      book: {}
    }
  },
  created() { //初始化数据
    this.getData();
  },
  methods: {
    getData: function() { //获取数据
      const self = this;
      self.$axios.get(self.url).then(function(resp) {
        console.info(resp);
        self.books = resp.data
        console.info(self.books);
      }).catch(function(err) {
        console.info(err);
      });
    },
    addBookButton: function() { //添加
      document.getElementById('addBook').style.display = 'block';
    },
    submitData: function() { //提交表单
      const self = this;
      self.book.id = self.books.length + 1;
      self.books.push(self.book);
      self.book = {};
      document.getElementById('addBook').style.display = 'none';
      self.$message({
        message: '信息添加成功',
        type: 'success'
      });
    },
    delBook: function(index, row) { //删除数据
      const self = this;
      console.info(index);
      console.info(row);
      self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //如果没有排序可以直接使用
        //删除
        //books.splice(index, 1);
        //如果有排序
        var index2 = self.books.indexOf(row);
        console.info(index2);
        self.books.splice(index2, 1);
        //提示信息
        self.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>
