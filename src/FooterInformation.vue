<script setup>
import { onBeforeMount, ref } from 'vue';
import { versionInfo } from './log.json';
  
  onBeforeMount(() => {
    versionInfo.reverse();
    versionInfo.forEach((item) => {
      item.log = item.log.map((logItem) => 
        logItem.replace(/(修复|优化|添加|移除)/, "<b>$1</b>")
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
  const isAboutDisplaying = ref(false);
  function displayAbout(){
    const container = document.getElementById("about-container");
    isAboutDisplaying.value = !isAboutDisplaying.value;
    if(isAboutDisplaying.value){
      container.style.maxHeight = "100dvh";
      document.body.style.overflow = "hidden";
    } else if(!isAboutDisplaying.value){
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

      <a id="about" @click="displayAbout()">
        关于本站
      </a>
      <span class="vertical-bar">|</span>
      <a href="https://keshu.space/">
        薄露轩
      </a>
      <span class="vertical-bar">|</span>
      <a href="https://github.com/Wolceorght/CardmonyOS">
        GitHub
      </a>
      <span class="vertical-bar">|</span>
      <a href="https://qun.qq.com/universal-share/share?ac=1&authKey=mestg42%2FaLEfITqBGiOhiSql8V3UePQHyT9%2Fp%2FmNt%2BzRAUUafC4SXmVGr4OB842V&busi_data=eyJncm91cENvZGUiOiIxMDk3MTU1MTk1IiwidG9rZW4iOiIwM05EcG9wZU13LzlTN1orbFFvTW1Oby9RK3hFOXhWZlFHbSt0RWU1ZWhDdGpyVVJlZTZQRnZscnc3THZwWCt2IiwidWluIjoiMzE1NzM5NDc2In0%3D&data=3c_UxdQVs-45Dyw8H-DDK5336WpMFpgmr7Yi5Tzzv-xVruVuJqK7951XNbMOBvKi0d_wVpMMklneZTxriaN_Hg&svctype=4&tempid=h5_group_info">
        反馈群
      </a>
    </div>
  </div>

  <div id="about-container">
    <div id="about-box">
      <div id="about-frame">
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
      <div id="about-title">
        关于本站
      </div>
      <div id="about-text">
        一、本站是一个卡牌制作工具，仅提供技术工具和模板功能。本站不参与用户创作，不对用户上传、制作、导出的内容进行事前审查，也不对用户作品的合法性、真实性、准确性、原创性、适当性作出保证。本站为非官方性质，与《炉石传说》官方无隶属、合作或授权关系；用户不得利用本站冒充官方、发布虚假公告、制作足以误导他人的“官方卡牌”及类似内容。
<br><br>
二、为尽量还原卡牌效果，本站可能使用或模拟部分游戏内字体、UI元素及图片素材，以上素材均来自于公开渠道。本站使用相关字体或素材的唯一目的是还原游戏内卡牌的视觉呈现，属于《中华人民共和国著作权法》第二十四条所规定的“为个人学习、研究或者欣赏”的合理使用情形，未将字体或素材用于任何商业性用途。
<br><br>
三、用户对通过本站上传、制作、导出的卡牌内容承担全部责任。因用户制作、发布、传播内容引发的纠纷、投诉、索赔、处罚或其他后果，由用户自行承担。
<br><br>
四、用户不得利用本站制作、上传、复制、发布或传播含有下列内容的信息：
<br>
1. 违反宪法、法律法规或公序良俗的内容；<br>
2. 危害国家安全、泄露国家秘密、破坏民族团结、宣扬邪教或封建迷信的内容；<br>
3. 煽动暴力、恐怖、仇恨、歧视、骚扰、霸凌的内容；<br>
4. 色情、低俗、赌博、诈骗、传销、违法广告等内容；<br>
5. 侵犯他人著作权、商标权、肖像权、名誉权、隐私权或其他合法权益的内容；<br>
6. 伪造身份证、护照、驾驶证、工作证、公章、公文、货币、票券、官方文件等用于冒充或欺骗的内容；<br>
7. 冒充官方、误导公众、虚构权威机构或虚假认证的内容；<br>
8. 其他本站认为不适宜或可能带来法律风险的内容。<br>
<br>
五、本站生成内容仅供个人学习、测试、娱乐或非商业展示使用，且不得违反法律法规和第三方权利。未经合法授权，不得将生成内容用于商业销售、付费下载、广告投放、品牌宣传、印刷出版、众筹回报、客户交付等商业用途。用户不得以本站名义发布内容，也不得声称本站或生成内容获得任何官方认可。
<br><br>
六、本站尊重著作权人的合法权益，如您认为本站内容或用户生成内容侵犯了您的合法权益，请联系 wolceorght@gmail.com，本站将及时删除或替换。
<br><br>
七、本站可能不时更新该声明。更新后将在本页面公布，公布后即视为生效。继续使用本站则视为接受更新后的声明。
      </div>
      
    </div>
    <div id="about-back-button" @click="displayAbout()">
      返回
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

  #ver-container, #about-container{
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

  #ver-box, #about-box{
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

  
  #ver-frame, #about-frame{
    width: inherit;
    height: inherit;
    position: absolute;
    pointer-events: none;
    transform: translate(-2em, -2em);
  }

  #ver-title, #about-title{
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

  #back-button, #about-back-button{
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
  #back-button:active, #about-back-button:active{
    background-color: var(--hover-color);
    color: var(--shape-color);
  }

  #back-button, #about-back-button{
    border-bottom: 1.5px solid var(--border-color);
    transition: all .2s ease;
  }
  #back-button:active, #about-back-button:active{
    border-bottom: 1.5px solid var(--harmony-blue);
  }

  #about-text{
    font-size: 1.25em;
    font-weight: 300;
    line-height: 1.5;
  }

  @media (max-width: 1200px) {
    #info-box{
      margin-top: 0;
      width: 100%;
      max-width: 750px;
      text-align: center;
      padding: 0;
    }

    #back-button, #about-back-button{
      width: calc(100% - 2em);
      margin: 0 1em;
    }

    #ver-box, #about-box{
      width: 100%;
      margin: 4em auto;
      max-width: 750px;
    }

    #ver-frame, #about-frame{
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

    #back-button:hover, #about-back-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    #ver-button:hover .cardmony-os::after{
      background-color: var(--harmony-blue);
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

    #about:hover{
      cursor: pointer;
    }
  }

</style>