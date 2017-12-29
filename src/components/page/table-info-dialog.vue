<template>
<!-- 添加数据 -->

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
        <el-date-picker v-model="date" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
    </el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitData">确 定</el-button>
</div>
</template>
