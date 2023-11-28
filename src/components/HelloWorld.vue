<template>
  <div class="container">
    <div>
      <input type="file" ref="fileInput" @change="handleFileChange" accept=".xls,.xlsx" />
    <button @click="processExcel">处理Excel文件</button>
    </div>
    <button class="btn" type="button" @click="startLottery" >随机点名</button>
    <div class="grid">
      <div v-for="(item, index) in list" :key="index" class="grid-item"  :style="{ backgroundColor: item.bgcolor}" >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as XLSX from 'xlsx';
const list = ref([])
const state = reactive({
  lotteryCount: 0,
})

onMounted(() => {
  // for (let i = 0; i < 45; i++) {
  //   list.value.push({ name: "学生" + i, bgcolor: 'white' })
  // }
})

const selectedFile = ref(null);
const workbook = ref(null);

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const processExcel = () => {
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      workbook.value = XLSX.read(data, { type: 'array' });
      // 在这里对 Excel 文件进行处理
      const sheetName = workbook.value.SheetNames[0]; // 获取第一个工作表名称
      const worksheet = workbook.value.Sheets[sheetName];   //获取表数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const nameColumnIndex = jsonData[0].findIndex((col) => col === '姓名'); // 找到姓名列的索引
      const names = jsonData.slice(1).map((row) => row[nameColumnIndex]); // 获取姓名列的数据
      names.forEach(item=>{
        list.value.push({ name: item, bgcolor: 'white' })
      })
    };
    reader.readAsArrayBuffer(selectedFile.value);
  }
};
//随机颜色
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

// 抽奖
const startLottery = () => {
  console.log(12);
    state.lotteryCount = 0
    const randomUser = setInterval(() => {
      const activeIndex = Math.floor(Math.random() * list.value.length)
      const randomColor = colors[Math.floor(Math.random() * colors.length)];// 随机生成颜色
      list.value[activeIndex].bgcolor = randomColor
      list.value.forEach((item, index) => {
        if (activeIndex != index) {
          item.bgcolor = "white"
      }
      })

      state.lotteryCount++
      if (state.lotteryCount >= 10) {
        clearInterval(randomUser)
      }
    }, 150) // 每秒运行一次抽奖
  }
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.grid {
  margin-top: 20px;
  width: 60%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  border: 1px solid #000;
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid #000;
  background-color: white;
}
.btn{
  border: none;
  padding: 0px 20px;
  height: 40px;
  border-radius: 5%;
  background-color:#409eff;
  color: #ffffff;
}
</style>
