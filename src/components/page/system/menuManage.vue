<template slot-scope="scope">
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单表格</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="searchCondition.title" placeholder="筛选菜单关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
        <el-button type="primary" @click="editMenu()">添加</el-button>
    </div>

    <el-table :data="menus" max-height="320" style="width: 100%" :default-sort="{prop: 'id', order: 'descending'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="menucode" fixed label="菜单CODE" width="160"></el-table-column>
        <el-table-column prop="title" fixed label="菜单名" sortable width="160"></el-table-column>
        <el-table-column prop="href" label="路径" width="300"></el-table-column>
        <el-table-column prop="validindName" label="状态" width="80">
            <template slot-scope="scope">
                <el-tag :type="scope.row.validind ? 'primary' : 'danger'" close-transition>{{scope.row.validindName}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="spread" label="是否展开" width="70">
            <template slot-scope="scope">
                <el-tag :type="scope.row.spread ? 'primary' : 'success'" close-transition>{{scope.row.spreadName}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="displayno" label="排序值" width="80"></el-table-column>
        <el-table-column prop="vicon" label="图标"></el-table-column>
        <el-table-column prop="pid" label="PID"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
                <el-button @click="delMenu(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
                <el-button @click="editMenu(scope.$index,scope.row)" size="mini" type="primary">修改</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total">
    </el-pagination>

    <!-- 添加数据 -->
    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible">
        <el-form :model="menu">
            <el-form-item label="父级菜单" :label-width="formLabelWidth">
                <el-select v-model="menu.pid" placeholder="请选择">
                    <el-option v-for="item in pidMenu" :key="item.id" :label="item.title" :value="item.id">
                        <span style="float: left">{{ item.title }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.menucode }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单CODE" :label-width="formLabelWidth">
                <el-input v-model="menu.menucode" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单名" :label-width="formLabelWidth">
                <el-input v-model="menu.title" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标" :label-width="formLabelWidth">
                <el-input v-model="menu.vicon" placeholder="请输入内容" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否展开" :label-width="formLabelWidth">
                <el-switch v-model="menu.spread" active-color="#13ce66" inactive-color="#ff4949" active-text="展开" inactive-text="折叠">
                </el-switch>
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
                <el-switch v-model="menu.validind" active-color="#13ce66" inactive-color="#ff4949" active-text="有效" inactive-text="无效">
                </el-switch>
            </el-form-item>
            <el-form-item label="排序值" :label-width="formLabelWidth">
                <el-input-number v-model="menu.displayno" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="是否展开" :label-width="formLabelWidth">
                <el-date-picker v-model="menu.date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script slot-scope="scope">
import urlUtil from '@/utils/urlUtil';

export default {
    data() {
        return {
            formLabelWidth: '120px',
            url: './static/data/book.json', //表单数据url
            menus: [], //列表数据
            pidMenu: [], //父级菜单下拉
            menu: this.clearMenu(), //表单数据
            dialogFormVisible: false, //是否显示表单
            multipleSelection: [], //选种的
            searchCondition: {
                title: ''
            }, //搜索条件
            page: {
                total: 0, //总条数
                pageSize: 10, //页面大小
                currentPage: 1 //当前页面号
            } //分页数据
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
            var url = urlUtil.SERVER.MENU_MANAGE;
            //添加分页数据
            url += "?pageSize=" + self.page.pageSize + "&pageNo=" + self.page.currentPage;
            //添加查询条件
            var condition = self.getSearchCondition();
            console.info(condition);
            self.$axios.post(url,condition).then(function(resp) {
                console.info(resp.data.list);
                self.menus = resp.data.list;
                self.page = self.getPage(resp.data);
            }).catch(function(err) {
                console.info(err);
            });
        },
        //获取分页数据
        getPage: function(data) {
            var page;
            if (data) {
                page = {
                    total: data.total,
                    pageSize: data.pageSize,
                    currentPage: data.pageNum
                }
            } else {
                this.page = page;
            }
            return page;
        },
        //获取查询条件
        getSearchCondition: function(){
            var condition = {};

            var title = this.searchCondition.title;
            if(title && title != ''){
                condition.title = title;
            }
            return condition;
        },
        handleSizeChange(val) { //页面大小切换
            console.log(`每页 ${val} 条`);
            this.page.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) { //上下页
            console.log(`当前页: ${val}`);
            this.page.currentPage = val;
            this.getData();
        },
        submitData: function() { //提交表单
            console.info(this.menu);
            const self = this;
            var message = '菜单添加成功';
            var id = self.menu.id;
            if (id == '') {
                id = self.menus.length + 1;
            } else {
                //查询数据的索引位置
                var index = self.menus.findIndex((item, index) => {
                    return item.id == id;
                });
                if (index != -1) {
                    self.menus.splice(index, 1);
                    message = '信息修改成功';
                }
            }
            self.menu.validind ? self.menu.validindName = '有效' : self.menu.validindName = '无效';
            self.menu.spread ? self.menu.spreadName = '展开' : self.menu.spreadName = '折叠';
            self.menu.id = id;
            self.menus.push(self.menu);
            self.dialogFormVisible = false;
            self.$message({
                message: message,
                type: 'success'
            });
        },
        editMenu: function(index, row) {
            const self = this;
            self.menu = self.clearMenu();
            var url = urlUtil.SERVER.MENU_EDIT;
            self.$axios.get(url).then(function(resp) {
                console.info(resp.data);
                self.pidMenu = resp.data.data.pidMenu;
            }).catch(function(err) {
                console.info(err);
            });
            if (row) {
                //self.menu = Object.assign({}, row);
                self.menu = row;
            }
            self.dialogFormVisible = true;
        },
        delMenu: function(index, row) { //删除数据
            const self = this;
            self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //如果没有排序可以直接使用
                //删除
                //menus.splice(index, 1);
                //如果有排序
                var index2 = self.menus.indexOf(row);
                console.info(index2);
                self.menus.splice(index2, 1);
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
                    var index = self.menus.indexOf(value);
                    self.menus.splice(index, 1);
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
            self.getData();
            // if (self.searchCondition.name) {
            //     var menus = self.menus.filter(function(item) {
            //         return item.name === self.searchCondition.name;
            //     });
            //     self.menus = menus;
            // } else {
            //     self.getData();
            // }
        },
        handleSelectionChange: function(val) { //复选框
            const self = this;
            self.multipleSelection = val;
        },
        clearMenu: function() { //清除模板
            var menu = {
                id: '',
                pid: 0,
                title: '',
                vicon: '',
                spread: false,
                spreadName: "展开",
                href: '',
                pid: '',
                validind: true,
                validindName: '有效',
                displayno: 1,
                menucode: ''
            };
            return menu;
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
