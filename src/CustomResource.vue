<script setup>
import { ref, onMounted } from 'vue';

const emblemName = ref("");

const emblemImageName = ref("选择图片..."),
      classImageName = ref("选择图片...");

const isCustomDisplaying = ref(false);
const firstDisplay = ref(true);

// 使用 ref 引用 DOM 元素
const customContainer = ref(null);
const emblemImageInput = ref(null);
const emblemLabel = ref(null);
const seriesNameSubtitle = ref(null);
const materialSubtitle = ref(null);

// 缓存样式值
let rootComputed = null;

onMounted(() => {
  // 初始化时获取样式
  const root = document.documentElement;
  rootComputed = getComputedStyle(root);
});

function displayCustom(){
  isCustomDisplaying.value = !isCustomDisplaying.value;
  if(isCustomDisplaying.value){
    customContainer.value.style.maxHeight = "100dvh";
    document.body.style.overflow = "hidden";
  } else {
    customContainer.value.style.maxHeight = "0";
    document.body.style.overflow = "auto";
  }
  if(firstDisplay.value){
    openDB();
    firstDisplay.value = false;
  }
}

const emblemImgUrl = ref("");
function uploadEmblem(){
  // 清理之前的 URL
  if (emblemImgUrl.value) {
    URL.revokeObjectURL(emblemImgUrl.value);
    emblemImgUrl.value = "";
  }
  
  const file = emblemImageInput.value?.files[0];
  
  if(file && file.type.startsWith("image/png")){
    const img = new Image();
    img.onload = function() {
      if (img.width > 165 || img.height > 165) {
        emblemImageName.value = "图片无效...";
        if (emblemLabel.value) {
          emblemLabel.value.style.color = rootComputed.getPropertyValue("--disabled-color");
        }
      } else {
        emblemImgUrl.value = URL.createObjectURL(file);
        emblemImageName.value = file.name;
        if (emblemLabel.value) {
          emblemLabel.value.style.color = rootComputed.getPropertyValue("--shape-color");
        }
      }
    };
    img.onerror = function() {
      emblemImageName.value = "图片无效...";
      if (emblemLabel.value) {
        emblemLabel.value.style.color = rootComputed.getPropertyValue("--disabled-color");
      }
    };
    img.src = URL.createObjectURL(file);
  } else{
    emblemImageName.value = "图片无效...";
    if (emblemLabel.value) {
      emblemLabel.value.style.color = rootComputed.getPropertyValue("--disabled-color");
    }
  }
}

function saveEmblem(){
  try{
    if(emblemImgUrl.value === ""){
      throw "缺少素材";
    }
    if(emblemName.value === ""){
      throw "缺少系列名称";
    }

    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = 540;
    c.height = 670;
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 278 - img.width / 2, 526.5 - img.height / 2, img.width, img.height);
      c.toBlob((blob) => {
        addEmblemToDB(emblemName.value, blob);
      })
    };
    img.onerror = () => {
      console.error("图片加载失败");
      alert("图片加载失败，请重试");
    };
    img.src = emblemImgUrl.value;
  }
  catch(err){
    console.error(err);
    if(err === "缺少素材"){
      if (materialSubtitle.value) {
        materialSubtitle.value.classList.add("error");
        setTimeout(() => {
          materialSubtitle.value.classList.remove("error");
        }, 1200);
      }
    } else if(err === "缺少系列名称"){
      if (seriesNameSubtitle.value) {
        seriesNameSubtitle.value.classList.add("error");
        setTimeout(() => {
          seriesNameSubtitle.value.classList.remove("error");
        }, 1200);
      }
    }
  }
}

function deleteEmblem(){
  try{
    if(emblemName.value === ""){
      throw "缺少系列名称";
    }
    
    if (!dbInstance.value) {
      alert("数据库未初始化");
      return;
    }
    
    const transaction = dbInstance.value.transaction("emblems", "readwrite");
    const emblemStore = transaction.objectStore("emblems");
    const nameIndex = emblemStore.index("name");
    const getRequest = nameIndex.get(emblemName.value);
    
    getRequest.onsuccess = (event) => {
      const emblem = event.target.result;
      if (emblem) {
        const deleteRequest = emblemStore.delete(emblem.id);
        deleteRequest.onsuccess = () => {
          alert("已删除");
          // 重置表单
          resetForm();
        };
        deleteRequest.onerror = () => {
          alert("删除失败");
        };
      } else {
        if (seriesNameSubtitle.value) {
          seriesNameSubtitle.value.classList.add("error");
          seriesNameSubtitle.value.textContent = "系列名称不存在";
          setTimeout(() => {
            seriesNameSubtitle.value.classList.remove("error");
            seriesNameSubtitle.value.textContent = "系列名称";
          }, 1200);
        }
      }
    };
    getRequest.onerror = () => {
      alert("查询失败");
    };

  } catch(err){
    console.error(err);
    if(err === "缺少系列名称"){
      if (seriesNameSubtitle.value) {
        seriesNameSubtitle.value.classList.add("error");
        setTimeout(() => {
          seriesNameSubtitle.value.classList.remove("error");
        }, 1200);
      }
    }
  }
}

// 重置表单函数
function resetForm() {
  emblemName.value = "";
  if (emblemImgUrl.value) {
    URL.revokeObjectURL(emblemImgUrl.value);
    emblemImgUrl.value = "";
  }
  emblemImageName.value = "选择图片...";
  classImageName.value = "选择图片...";
  if (emblemLabel.value) {
    emblemLabel.value.style.color = rootComputed.getPropertyValue("--disabled-color");
  }
}

const dbInstance = ref(null);

function openDB(){
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("customResource", 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if(!db.objectStoreNames.contains("emblems")){
        const emblemStore = db.createObjectStore("emblems", {
          keyPath: "id",
          autoIncrement: true,
        });
        emblemStore.createIndex("name", "name", {unique: true});
      }
    }

    request.onsuccess = (event) => {
      const db = event.target.result;
      dbInstance.value = db;
      resolve(db);
    }
    request.onerror = (event) => {
      reject(event.target.error);
      alert("浏览器不支持自定义功能，或尝试退出无痕模式");
    }
  })
}

function addEmblemToDB(name, imgBlob){
  const transaction = dbInstance.value.transaction("emblems", "readwrite");
  const emblemStore = transaction.objectStore("emblems");
  const record = {
    name: name,
    imgBlob: imgBlob
  }
  const request = emblemStore.add(record);
  request.onsuccess = () => {
    alert("已保存");
    // 使用resetForm函数重置表单
    resetForm();
  }
  request.onerror = (event) => {
    console.error(event.target.error);
  }
}


</script>

<template>
  <div id="custom-button-container">
    <div id="custom-button-box">
      <span id="custom-button" @click=displayCustom()>
        自定义
      </span>
    </div>
  </div>

  <div id="custom-container" ref="customContainer">
    <div id="custom-box">
      <div id="custom-frame">
        <svg width="32" height="32" style="position: absolute; top: -16px; left: -16px" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="32" y2="0" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="0" y1="0" x2="0" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </svg>
        <svg width="32" height="32" style="position: absolute; top: -16px; right: -16px" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="32" y2="0" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="32" y1="0" x2="32" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </svg>
        <svg width="32" height="32" style="position: absolute; bottom: -16px; left: -16px" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="0" y2="32" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="0" y1="32" x2="32" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </svg>
        <svg width="32" height="32" style="position: absolute; bottom: -16px; right: -16px" xmlns="http://www.w3.org/2000/svg">
          <line x1="32" y1="0" x2="32" y2="32" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="0" y1="32" x2="32" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </svg>
      </div>
      <div id="custom-content">
        <div id="custom-emblem">
          <div class="custom-midtitle"><h1>自定义系列水印</h1></div>
          
          <div class="custom-input">
            <div class="custom-subtitle"><h2 ref="seriesNameSubtitle">系列名称</h2></div>
            <div class="input-box">
              <div>
                <input type="text" 
                      name="emblem-name"
                      v-model="emblemName"
                      placeholder="系列名称">
              </div>
            </div>
            <div class="custom-subtitle"><h2 ref="materialSubtitle">水印素材</h2></div>
            <div class="image-box">
              <label id="emblem-label" ref="emblemLabel">
                {{ emblemImageName }}
                <input type="file" 
                      ref="emblemImageInput"
                      name="emblem-image"
                      accept="image/png"
                      @change="uploadEmblem()">
              </label>
            </div>
            <div class="instruction">
              请上传不大于 <b>165 x 165 px</b> 的<b>透明背景</b>、<b>PNG </b>格式图片，具体样式参见下图。
            </div>
            <div class="example-box">
              <div style="margin-top: 2em; text-align: center;">
                <h2>示例</h2>
                <img src="@/assets/img/custom-emblem-example.png">
              </div>
              
              <div v-if="emblemImgUrl" style="margin-top: 2em; text-align: center;">
                <h2>预览</h2>
                <img :src="emblemImgUrl" style="max-width: 165px; max-height: 165px; object-fit: contain;">
              </div>
              
              <div class="br"></div>

              <div class="button-container">
              <div class="submit-button" @click="deleteEmblem()">删除</div>
                <div class="submit-button" @click="saveEmblem()">保存<span style="transform: translate(.15em, 0) rotate(15deg);">!</span></div>
              </div>
            </div>
          </div>
        </div>
        <div id="custom-class">
          <div class="custom-midtitle"><h1>自定义职业</h1></div>
          <div>
            <h1 style="margin-top: 4em; text-align: center; color: var(--disabled-color);">敬请期待</h1>
          </div>
        </div>
      </div>
    </div>
    <div id="back-button" @click="displayCustom()">
      返回
    </div>
  </div>
</template>

<style scoped>
  #custom-button-container{
    width: 100%;
    overflow: hidden;
  }
  #custom-button-box{
    margin: .5em auto 1em auto;
    padding-left: 2.5em;
    box-sizing: border-box;
    font-weight: 500;
    text-align: left;
    line-height: 1.75;
    letter-spacing: -.025em;
    color: var(--disabled-color);
    user-select: none;
  }
  #custom-button{
    cursor: pointer;
    transition: all .2s ease;
  }
  #custom-button::after{
    content: " New";
    color: var(--harmony-blue);
  }

  #custom-container{
    width: 100%;
    height: 100dvh;
    max-height: 0;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: var(--background-color);
    transition: max-height .5s ease;
  }

  #custom-box{
    width: 1200px;
    height: 70%;
    margin: 6.75em auto 4em auto;
    padding: 2em;
    border: 1px 0 solid var(--border-color);
    box-sizing: border-box;
    user-select: none;
    overflow: auto;
    
    color: var(--shape-color);
  }

  #custom-frame{
    width: inherit;
    height: inherit;
    position: absolute;
    pointer-events: none;
    transform: translate(-2em, -2em);
  }

  #custom-content{
    display: flex;
    gap: 2em;
  }

  #custom-emblem, #custom-class{
    width: 50%;
  }

  .custom-subtitle{
    margin: 0 .5em .25em .5em;
    display: flex;
    gap: .75em;
    align-items: center;
    justify-content: space-between;
  }

  .error{
    color: var(--error-color);
  }

  h1{
    font: 500 2em var(--font-family);
    line-height: 1;
    margin: 0 0 1.5em 0;
    text-align: center;
    flex: 1;
  }

  h2{
    font: 500 1.25em var(--font-family);
    line-height: 1;
    margin: 0 0 .4em 0;
    
    flex: 1;
    transition: color .2s ease;
  }

  .custom-input{
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .custom-input .input-box, .custom-input .image-box{
    margin-bottom: 1.5em;
    width: 100%;
  }

  .input-box div{
    display: flex;
  }
  .input-box input{
    margin: 0 auto;
    border: 0;
    border-radius: 8px;
    outline: none;
    padding: 0 .25em;
    font: var(--value-font);
    color: var(--shape-color);
    line-height: 1.75;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--background-color);
    transition: background-color .2s ease;
  }
  .input-box input::placeholder{
    color: var(--disabled-color);
  }
  .input-box input:active, .input-box input:focus{
    background-color: var(--hover-color);
  }

  .image-box{
    width: 100%;
  }
  .image-box label{
    display: block;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 0 .25em;
    overflow: hidden;

    font: var(--value-font);
    line-height: 1.75;
    color: var(--disabled-color);
    text-overflow: ellipsis;
    white-space: nowrap;

    background-color: var(--background-color);
    transition: background-color .2s ease;
    cursor: pointer;
  }
  .image-box label:active{
    background-color: var(--hover-color);
  }
  .image-box input{
    display: none;
  }

  .instruction{
    font-size: 1.25em;
    font-weight: 300;
    line-height: 1.5;
    margin-left: .4em;
  }

  .example-box{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .br{
    width: 100%;
    display: none;
  }

  .button-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 2em;
    gap: 0;
  }

  .submit-button{
    width: 5em;
    height: 1.75em;
    display: flex;
    margin-top: 1em;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    font: 500 2em var(--font-family);
    line-height: 1.75em;
    background-color: var(--background-color);
    color: var(--disabled-color);
    transition: all .2s ease;
    cursor: pointer;
  }
  .submit-button:active{
    background-color: var(--hover-color);
    color: var(--shape-color);
  }

  #back-button{
    width: 5em;
    margin: 0 auto;
    display: flex;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    font: 500 2em var(--font-family);
    line-height: 1.75em;
    background-color: var(--background-color);
    color: var(--disabled-color);
    transition: all .2s ease;
    cursor: pointer;
    user-select: none;
  }  
  #back-button:active{
    background-color: var(--hover-color);
    color: var(--shape-color);
  }

  .input-box input, .image-box label, .submit-button{
    border-bottom: 1.5px solid var(--border-color);
    transition: all .2s ease;
  }
  .input-box input:focus, .image-box label:active, .submit-button:active{
    border-bottom: 1.5px solid var(--harmony-blue);
  }

  #back-button{
    border-bottom: 1.5px solid var(--border-color);
    transition: all .2s ease;
  }
  #back-button:active{
    border-bottom: 1.5px solid var(--harmony-blue);
  }

  @media (max-width: 1200px) {
    #custom-button-box{
      margin-bottom: 0;
      width: 100%;
      max-width: 750px;
      padding: 0;
    }

    #back-button{
      width: calc(100% - 2em);
      margin: 0 1em;
    }

    #custom-box{
      width: 100%;
      margin: 4em auto;
      max-width: 750px;
    }

    #custom-frame{
      display: none;
    }
    
    #custom-emblem{
      width: 100%;
    }
    .example-box{
      flex-wrap: wrap;
      justify-content: center;
    }
    .br{
      display: block;
    }
    .button-container{
      padding-top: 0;
      flex-direction: row;
      gap: 2em;
    }
    .submit-button{
      margin-top: .5em;
    }

    #custom-class{
      display: none;
    }
  }

  @media (hover: hover) {
    #back-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    .input-box input:hover, .image-box label:hover{
      background-color: var(--hover-color);
    }

    #custom-button-box #custom-button:hover{
      color: var(--shape-color);
    }

    .submit-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    #back-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    #custom-button-box::-webkit-scrollbar{
      width: 4px;
    }
    #custom-button-box::-webkit-scrollbar-thumb{
      background-color: #858585;
      border-radius: 2px;
    }
    #custom-button-box::-webkit-scrollbar-track{
      background-color: var(--background-color);
      border-radius: 2px;
    }
    #custom-button-box::-webkit-scrollbar-button{
      height: 4px;
      background-color: transparent;
    }
  }
</style>
