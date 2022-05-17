<template>
  <div class="wrap">
    <el-table
      :data="weathData.daily_forecast"
      border
      style="width: 100%"
      stripe
    >
      <el-table-column :data="data" label="日期" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cond.txt_d" label="天气" />
      <el-table-column prop="tmp.min" label="最低温度(℃)" width="120" />
      <el-table-column prop="tmp.max" label="最高温度(℃)" width="120" />
      <el-table-column prop="wind.dir" label="风向" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
</style>
