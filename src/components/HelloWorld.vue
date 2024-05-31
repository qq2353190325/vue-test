<template>
  <div class="container">
    
    <div>
      <input type="file" ref="fileInput" @change="handleFileChange" accept=".xls,.xlsx" />
      <button @click="processExcel">处理Excel文件</button>
    </div>
    <button class="btn" type="button" @click="startLottery">随机点名</button>
    <div class="grid">
      <div v-for="(item, index) in list" :key="index" class="grid-item" :style="{ backgroundColor: item.bgcolor }">
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

})
const isStatus=1
const  noStatus=-1

const selectedFile = ref(null);
const workbook = ref(null);
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};
//查询姓名字段是否存在
const isName = (jsonData) => {
  let nameColumnIndex = -1;
  let nameRowIndex = -1;
  // 遍历表格，寻找包含"姓名"关键词的单元格
  for (let r = 0; r < jsonData.length; r++) {
    const row = jsonData[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '姓名') {
        nameColumnIndex = c;
        nameRowIndex = r;
        console.log("找到");
        break;
      }
    }
    if (nameColumnIndex !== -1) {
      break; // 找到后跳出循环
    }
  }
  const data={}
  if (nameColumnIndex !== -1 && nameRowIndex !== -1) {
     data.msg = 1,
     data.colIndex=nameColumnIndex,
     data.rowIndex=nameRowIndex
  } else {
    data.msg=-1
  }
  return data
}
//读取excel文件，查找姓名列输入
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
      const res =isName(jsonData)
      console.log(res);
      if (res.msg ==isStatus) {
        const names = jsonData.slice(res.rowIndex + 1).map((row) => row[res.colIndex]); // 从姓名所在行之后获取姓名列的数据
        names.forEach(item => {
        list.value.push({ name: item, bgcolor: 'white' })
      })
      } else if(res.msg ==noStatus){
        alert("找不到姓名，曼莉姐，检查一下表格") 
      }else{
        alert("报错了，请联系我")
      }
    };
    reader.readAsArrayBuffer(selectedFile.value);
  }
};
//随机颜色
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

// 抽奖
const startLottery = () => {
  state.lotteryCount = 0
  const randomUser = setInterval(() => {
    //  随机抽取一个学生
    const activeIndex = Math.floor(Math.random() * list.value.length)
    const randomColor = colors[Math.floor(Math.random() * colors.length)];// 随机生成颜色
    list.value[activeIndex].bgcolor = randomColor
    list.value.forEach((item, index) => {
      console.log(item.name)
      if (activeIndex != index) {
        item.bgcolor = "white"
      }
    })

    state.lotteryCount++
    if (state.lotteryCount >= 10) {
      clearInterval(randomUser)
    }
  }, 200) // 每0.15秒运行一次抽奖
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

.btn {
  border: none;
  padding: 0px 20px;
  height: 40px;
  border-radius: 5%;
  background-color: #409eff;
  color: #ffffff;
}
</style>
