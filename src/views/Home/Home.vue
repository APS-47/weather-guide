<template>
  <div class="home" :style="{ backgroundImage: 'url(' + coverImgUrl + ')' }">
    <div class="weather-box">
      <el-cascader
        size="medium"
        separator=">"
        :options="options"
        placeholder="请选择 / 搜索城市"
        v-model="selectedOptions"
        :props="{ expandTrigger: 'hover' }"
        filterable
        @change="selectCity"
      />
      <div class="now-cond" v-if="Object.keys(weathData).length">
        <p class="address">
          <i class="el-icon-place" />{{ weathData.basic.city }}
        </p>
        <p class="upTime">{{ weathData.basic.update.loc }}</p>
        <i class="condTxt">{{ weathData.now.cond.txt }}</i>
        <p class="wind">{{ weathData.now.wind.dir }}</p>
        <p class="tmp">
          {{ weathData.daily_forecast[0].tmp.min }}℃~{{
            weathData.daily_forecast[0].tmp.max
          }}℃
        </p>
        <h1>未来3日天气预报</h1>
        <el-table
          :data="weathData.daily_forecast"
          border
          style="width: 100%"
          stripe
        >
          <el-table-column label="日期" width="180">
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
      <div class="tip" v-else>
        <h1>选择城市开始查询吧 !</h1>
      </div>
    </div>
  </div>
</template>

<script>
//城市选择
import { regionData, CodeToText } from "element-china-area-data";

export default {
  name: "Home",
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      addressAll: [],
      address: "",
      weathData: {},
      coverImgUrl: require("@/assets/img/background.jpg"),
    };
  },
  methods: {
    //选择地区
    selectCity() {
      this.addressAll = [];
      this.selectedOptions.forEach((city) => {
        this.addressAll.push(CodeToText[city]);
      });
      this.inquireWeather();
    },
    // 点击天气查询
    async inquireWeather() {
      if (this.addressAll[2] == "市辖区" || this.addressAll.length == 2) {
        this.address = this.addressAll[1]; //如果选市辖区就定位到二级地址
      } else {
        this.address = this.addressAll[2]; //区域码所对应的属性值即中文地址
      }
      // 开始请求接口
      const res1 = await this.$api.getCityWeather(this.address);
      if (res1.status === "ok") {
        //请求数据成功
        this.$notify({
          title: "查询成功",
          type: "success",
        });
        this.weathData = res1;
        this.weathData.daily_forecast.shift();
        this.weathData.daily_forecast.splice(3, 3);
        //无法找到该地
      } else if (res1.status === "unknown location") {
        // 1.只是无法获取到三级地址信息
        // 重新请求上一级地址
        this.address = this.addressAll[1];
        const res2 = await this.$api.getCityWeather(this.address);
        if (res2.status === "ok") {
          this.$notify({
            title: "查询成功",
            type: "success",
          });
          this.weathData = res2;
          this.weathData.daily_forecast.shift();
          this.weathData.daily_forecast.splice(3, 3);
        } else {
          // 重新请求上一级地址
          this.address = this.addressAll[0];
          const res3 = await this.$api.getCityWeather(this.address);
          if (res3.status === "ok") {
            this.$notify({
              title: "查询成功",
              type: "success",
            });
            this.weathData = res3;
            this.weathData.daily_forecast.shift();
            this.weathData.daily_forecast.splice(3, 3);
          } else {
            // 2.彻底无法找到该地
            this.$message({
              message: "抱歉，无法获取该地相关信息",
              type: "error",
            });
          }
        }
      }
      // 背景图片切换
      this.bgChange();
    },
    // 背景图片切换
    bgChange() {
      const weather = this.weathData.now.cond.txt;
      this.coverImgUrl = require(`@/assets/img/${weather}.jpg`);
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  @mixin xy($top: auto, $right: auto, $bottom: auto, $left: auto) {
    top: $top;
    right: $right;
    bottom: $bottom;
    left: $left;
  }
  @mixin wh($wid, $hei) {
    width: $wid;
    height: $hei;
  }
  @mixin font($size, $fw: bold, $color: #fff) {
    font-size: $size;
    font-weight: $fw;
    color: $color;
  }
  position: relative;
  min-height: 100vh;
  // background: url("~");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .weather-box {
    position: absolute;
    text-align: center;
    z-index: 999;
    @include xy(5%, "", "", 50%);
    transform: translateX(-50%);
    .now-cond {
      h1 {
        @include font(20px);
      }
      .address,
      .upTime {
        @include font(20px);
        text-shadow: 5px 5px 5px #000;
      }
      .condTxt {
        @include font(80px, bolder);
        text-shadow: 5px 5px 5px #ccc;
      }
      .wind,
      .tmp {
        @include font(20px, bolder, #fff);
        text-shadow: 2px 2px 5px rgb(144, 149, 216);
      }
    }
    .tip {
      h1 {
        @include font(50px, bolder);
        text-shadow: 2px 2px 5px rgb(144, 149, 216);
      }
    }
  }
}
</style>
