<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
            <el-breadcrumb-item>基础表格</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="searchCondition.name" placeholder="筛选书名关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
        <el-button type="primary" @click="editBook()">添加</el-button>
    </div>

    <el-table :data="books" style="width: 100%" :default-sort="{prop: 'id', order: 'descending'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="180"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="name" label="书名"></el-table-column>
        <el-table-column prop="price" label="价格" sortable></el-table-column>
        <el-table-column prop="date" label="出版时间" :formatter="dateFormat" sortable></el-table-column>
        <el-table-column label="操作" width="180">
            <template scope="scope">
                    <el-button @click="delBook(scope.$index,scope.row)" el-button type="danger">删除</el-button>
                    <el-button @click="editBook(scope.$index,scope.row)" el-button type="primary">修改</el-button>
                </template>
        </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :current-page="4" :page-size="100" :total="400">
    </el-pagination>

    <!-- 添加数据 -->
    <el-dialog title="信息" :visible.sync="dialogFormVisible">
        <el-form :model="book">
            <el-form-item label="作者" :label-width="formLabelWidth">
                <el-input v-model="book.author" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="书名" :label-width="formLabelWidth">
                <el-input v-model="book.name" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="价格" :label-width="formLabelWidth">
                <el-input v-model="book.price" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="出版时间" :label-width="formLabelWidth">
                <el-date-picker v-model="book.date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: '120px',
            url: './static/data/book.json', //表单数据url
            books: [], //列表数据
            book: this.clearBook(), //表单数据
            dialogFormVisible: false, //是否显示表单
            multipleSelection: [], //选种的
            searchCondition: {
                name: ''
            }, //搜索条件
            page: this.getPage() //分页数据
        }
    },
    created() { //初始化页面
        //获取数据
        const self = this;
        self.getData();
    },
    methods: {
        dateFormat: function(row, column) { //格式化时间
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return this.moment(date).format("YYYY-MM-DD");
        },
        getData: function() { //获取数据
            const self = this;
            self.$axios.get(self.url).then(function(resp) {
                self.books = resp.data;
            }).catch(function(err) {
                console.info(err);
            });
        },
        getPage: function() {
            var page = {
                total: 400,
                pageSize: 100,
                currentPage: 4
            }
            return page;
        },
        submitData: function() { //提交表单
            const self = this;
            var message = '信息添加成功';
            var id = self.book.id;
            if (id == '') {
                id = self.books.length + 1;
            } else {
                //查询数据的索引位置
                var index = self.books.findIndex((item, index) => {
                    return item.id == id;
                });
                if (index != -1) {
                    self.books.splice(index, 1);
                    message = '信息修改成功';
                }
            }
            self.book.id = id;
            self.books.push(self.book);
            self.dialogFormVisible = false;
            self.$message({
                message: message,
                type: 'success'
            });
        },
        editBook: function(index, row) {
            const self = this;
            self.book = self.clearBook();
            if (row) {
                //self.book = Object.assign({}, row);
                self.book = row;
            }
            self.dialogFormVisible = true;
        },
        delBook: function(index, row) { //删除数据
            const self = this;
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
        },
        delAll: function() {
            const self = this;
            var multipleSelection = self.multipleSelection;
            if (multipleSelection.length > 0) {
                multipleSelection.forEach((value, key) => {
                    var index = self.books.indexOf(value);
                    self.books.splice(index, 1);
                });
                //提示信息
                self.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }
        },
        search: function() {
            const self = this;
            if (self.searchCondition.name) {
                var books = self.books.filter(function(item) {
                    return item.name === self.searchCondition.name;
                });
                self.books = books;
            } else {
                self.getData();
            }
        },
        handleSelectionChange: function(val) {
            const self = this;
            self.multipleSelection = val;
        },
        clearBook: function() { //清除模板
            var book = {
                id: '',
                author: '',
                name: '',
                price: '',
                date: new Date()
            };
            return book;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
</style>
