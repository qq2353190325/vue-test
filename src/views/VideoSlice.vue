<template>
    <div class="container">

        <div>
            <input type="file" ref="fileInput" @change="handleFileChange" :accept="'video/*'" />
            <!-- <input type="file" ref="fileInput" @change="loadFile"  /> -->
            <button @click="openWorker">确定</button>
        </div>

    </div>
</template>
  
<script setup>
import { ref, reactive, onMounted } from 'vue'
import {cutFile} from '../tools/cutFile'
const Timestamp = ref()
const file = ref()
// 获取CPU线程数
const THREAD_COUNT = navigator.hardwareConcurrency || 4
//  生成文件标识符
const generateFileIdentifier = (file) => {
    return `${file.name}-${Timestamp.value}`;
};
const openWorker = () => {
}
// 文件分片上传
const handleFileChange = async (event) => {
    file.value = event.target.files[0];
    Timestamp.value = Date.now();
    let identifier = generateFileIdentifier(file.value)
    console.time("分片")
    const result = await cutFile(file.value,identifier)
    console.timeEnd("分片")
    console.log(result)
    await uploadChunk(result) //上传完成
    //  断点续传
    const uploadedChunks = await checkUploadedChunks(identifier);// 请求上传成功的分片索引
    for (const { i, chunk, fileIdentifier } of result) {
        if (uploadedChunks.includes(i)) {
            // 跳过已上传的分片
            continue;
        }
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('index', i);
        formData.append('identifier', fileIdentifier);
        const response = await fetch('http://127.0.0.1:3000/admin/upload', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            console.log("继传成功")
        }
    }
    //上传完成通知后端合并文件
    const mergeSuccess = await mergeChunks(identifier, file.value.name);
    if (mergeSuccess) {
        console.log('文件上传成功');
    } else {
        console.log('文件合并失败');
    }
};
//上传分片
const uploadChunk = async (result) => {
    let uploadedSize = 0;
    let uploadProgress = {};
    let start = false
    const fileindex = result[0].fileIdentifier
    //  上传
    for (const { i, chunk, fileIdentifier } of result) {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('index', i);
        formData.append('identifier', fileIdentifier);
        const response = await fetch('http://127.0.0.1:3000/admin/upload', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            uploadedSize += chunk.size;
            uploadProgress[fileIdentifier] = ((uploadedSize / file.value.size) * 100).toFixed(2);
            // 更新进度显示
            console.log(`上传进度：${uploadProgress[fileIdentifier]}%`);
        } else {
            // 上传失败处理
            console.log("上传失败")
        }
    }
    // console.log(uploadProgress[generateFileIdentifier(file.value)])
}
//  请求上传成功的分片索引
const checkUploadedChunks = async (identifier) => {
    const response = await fetch('http://127.0.0.1:3000/admin/check-uploaded', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data.uploadedChunks;
    }
    return [];
};
//通知后端合并分片
const mergeChunks = async (identifier, fileName) => {
    const response = await fetch('http://127.0.0.1:3000/admin/mergeChunks', {
        method: 'POST',
        body: JSON.stringify({
            identifier, fileName
        }),
    });
    return response.ok
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
  