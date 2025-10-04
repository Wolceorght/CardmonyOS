<script setup>
import { onBeforeMount, ref } from 'vue';

  const versionInfo = [{
      generation: "Beta",
      name: "0.9",
      log: [
        "小范围测试"
      ]
    },{
      generation: "Beta",
      name: "0.9.1",
      log: [
        "修复了桌面端无法调整插画尺寸的问题",
        "优化了移动端调整插画尺寸的体验",
        "优化了移动端的表单布局"
      ]
    },{
      generation: "CardmonyOS",
      name: "1.0",
      log: [
        "CardmonyOS：没有限制、无须等待、完全免费的《炉石传说》卡牌制作工具",
        "添加了版本日志",
      ]
    },{
      generation: "CardmonyOS",
      name: "1.0.1",
      log: [
        "添加了「穿越时间流」水印"
      ]
    }
  ]
  
  onBeforeMount(() => {
    versionInfo.reverse();
    versionInfo.forEach((item) => {
      item.log = item.log.map((logItem) => 
        logItem.replace(/^(修复|优化|添加|移除)/, "<b>$1</b>")
      )
    })
  })

  function camelToKebab(str) {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // 在小写字母或数字后面接大写字母时插入 -
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 处理连续大写字母的情况
      .toLowerCase(); // 转为小写
  }

  const isVersionLogDisplaying = ref(false);
  function displayVersionLog(){
    const container = document.getElementById("ver-container");
    isVersionLogDisplaying.value = !isVersionLogDisplaying.value;
    if(isVersionLogDisplaying.value){
      container.style.maxHeight = "100dvh";
      document.body.style.overflow = "hidden";
    } else if(!isVersionLogDisplaying.value){
      container.style.maxHeight = "0";
      document.body.style.overflow = "auto";
    }
  }
</script>

<template>
  <div id="footer-container">
    <div id="info-box">
      <span id="ver-button" @click="displayVersionLog()">
        <span :class="camelToKebab(versionInfo[0].generation.replace(/\s+/g, ''))">{{ versionInfo[0].generation }}</span>
        <span class="space"></span>
        <span id="version">{{ versionInfo[0].name }}</span>
      </span>

      <br>

      <a href="https://keshu.space/">
        薄露轩
      </a>
      <span class="vertical-bar">|</span>
      <a href="https://github.com/Wolceorght/CardmonyOS">
        GitHub
      </a>
    </div>
  </div>

  <div id="ver-container">
    <div id="ver-box">
      <div id="ver-frame">
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
      <div id="ver-title">
        版本日志
      </div>
      <ul id="ver-list">
        <li class="ver-object" v-for="(item, index) in versionInfo">
          <div class="ver-left">
            <div class="ver-generation" 
                 :class="camelToKebab(item.generation.replace(/\s+/g, ''))"
                 v-if="versionInfo[index - 1] ? item.generation !== versionInfo[index - 1].generation : true">
              {{ item.generation }}
            </div>
          </div>
          <div class="ver-right">
            <div class="ver-name">
              {{ item.name }}
            </div>
            <div class="ver-log">
              <ul class="ver-log-list">
                <li class="ver-log-object" v-for="log in item.log" v-html="log">
                </li>
              </ul>
            </div>
          </div>
          <div class="split-line" 
               v-if="versionInfo[index + 1] ? item.generation !== versionInfo[index + 1].generation : false">
          </div>
        </li>
      </ul>
    </div>
    <div id="back-button" @click="displayVersionLog()">
      返回
    </div>
  </div>
</template>

<style scoped>

  #footer-container{
    width: 100%;
    overflow: hidden;
  }

  #info-box{
    width: 1200px;
    margin: .5em auto 1em auto;
    padding-right: 2em;
    box-sizing: border-box;
    font-weight: 300;
    text-align: right;
    line-height: 1.75;
    letter-spacing: -.025em;
    color: var(--disabled-color);
    user-select: none;
  }
  #info-box #ver-button{
    cursor: pointer;
    font-weight: 500;
    color: var(--disabled-color);
    transition: color .2s ease;
  }
  #info-box #ver-button:active{
    color: var(--shape-color);
  }
  #info-box #ver-button .space{
    margin: 0 .5em;
  }
  
  #info-box .vertical-bar{
    margin: 0 .25em;
  }

  #info-box a{
    color: var(--disabled-color);
    text-decoration: none;
    font-size: 1em;
    transition: color .2s ease;
  }
  #info-box a:active{
    color: var(--shape-color);
  }

  #ver-container{
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

  #ver-box{
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

  #ver-box::-webkit-scrollbar{
    width: 4px;
  }
  #ver-box::-webkit-scrollbar-thumb{
    background-color: #858585;
    border-radius: 2px;
  }
  #ver-box::-webkit-scrollbar-track{
    background-color: var(--background-color);
    border-radius: 2px;
  }
  #ver-box::-webkit-scrollbar-button{
    height: 4px;
    background-color: transparent;
  }
  
  #ver-frame{
    width: inherit;
    height: inherit;
    position: absolute;
    pointer-events: none;
    transform: translate(-2em, -2em);
  }

  #ver-title{
    width: fit-content;
    margin-bottom: 2em;
    font-size: 3em;
    font-weight: 500;
  }

  #ver-list{
    list-style: none;
    padding: 0;
  }
  .ver-object{
    margin-bottom: 4em;
    display: flex;
    flex-wrap: wrap;
  }
  .ver-left{
    width: 50%;
    height: fit-content;
    padding: 0 1em;
    box-sizing: border-box;
    font-size: 2em;
    letter-spacing: -.025em;
    white-space: nowrap;
  }
  .ver-generation{
    margin-bottom: 1em;
  }
  .ver-right{
    width: 50%;
    height: fit-content;
    padding: 0 2em;
    box-sizing: border-box;

  }
  .ver-name{
    font-size: 2em;
    letter-spacing: -.025em;
    margin-bottom: .5em;
  }
  .ver-log-list{
    font-size: 1.25em;
    font-weight: 300;
    line-height: 1.5;
    list-style: "○　";
    padding-left: 1.8em;
  }
  .ver-log-object{
    margin-bottom: .5em;
  }
  .ver-log-object::marker{
    color: var(--disabled-color);
  }

  /****************************/
  #ver-button .cardmony-os::after{
    background-color: var(--disabled-color);
    transition: background-color .2s ease;
  }
  #ver-button:active .cardmony-os::after{
    background-color: var(--harmony-blue);
  }
  /****************************/

  .split-line{
    display: block;
    width: 100%;
    height: 1px;
    background-color: var(--border-color);
    margin: 4em auto 0 auto;
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

  @media (max-width: 1200px) {
    #info-box{
      width: 100%;
      max-width: 750px;
      text-align: center;
      padding: 0;
    }

    #back-button{
      width: calc(100% - 2em);
      margin: 0 1em;
    }

    #ver-box{
      width: 100%;
      margin: 4em auto;
      max-width: 750px;
    }

    #ver-frame{
      display: none;
    }

    .ver-left{
      width: 100%;
    }

    .ver-right{
      width: 100%;
    }
  }

  @media (hover: hover) {
    #info-box a:hover{
      color: var(--shape-color);
    }

    #info-box #ver-button:hover{
      color: var(--shape-color);
    }

    #back-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    #ver-button:hover .cardmony-os::after{
      background-color: var(--harmony-blue);
    }
  }

</style>