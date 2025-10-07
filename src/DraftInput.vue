<script setup>
  import { ref } from 'vue';
  import { typeArray, classArray, campArray, rarityArray, keyWordArray } from './array.js';

  const name = defineModel("name", {type: String}),
        cost = defineModel("cost", {type: String}),
        attack = defineModel("attack", {type: String}),
        health = defineModel("health", {type: String}),
        rune = defineModel("rune", {type: Object}),
        text = defineModel("text", {type: String}),
        race = defineModel("race", {type: String}),
        secondRace = defineModel("secondRace", {type: String}),

        isEnabled = defineModel("isEnabled", {type: Object}),
        chosen = defineModel("chosen", {type: Object});

  const displayingExpl = ref("");

  let nameTemp = "",
      costTemp = "",
      attackTemp = "",
      healthTemp = "",
      runeTemp = {
        blood: "",
        frost: "",
        unholy: ""
      },
      textTemp = "",
      raceTemp = "",
      secondRaceTemp = "",

      isEnabledTemp = {
        secondClass: false,
        multiClass: false,
        dragon: false,
        secondRace: false,
        mini: false
      },
      chosenTemp = {
        type: "minion",
        class: "neutral",
        secondClass: "dk",
        multiClass: "goons",
        rarity: "free",
        banner: "none",
        emblem: "none"
      }

  const statRegex = /^\d+(\/\d+){0,2}$/,
        raceRegex = /^\*/,
        runeRegex = /^[红蓝绿]+$/,
        CRTRegex = /^~/;

  //创建匹配 Array 中的所有 name 的正则表达式
  const classRegex = new RegExp(`(${classArray.map((obj) => obj.name).join("|")})`, "g"), 
        rarityRegex = new RegExp(`(${rarityArray.map((obj) => obj.name).join("|")})`, "g"),
        typeRegex = new RegExp(`(${typeArray.map((obj) => obj.name).join("|")})`, "g"),
        campRegex = new RegExp(`(${campArray.map((obj) => obj.name).join("|")})`, "g");

  const draft = ref("");

  function getValByName(name, arr){
    return arr.find(item => item.name === name).value;
  }

  /*
  function strLength(str){ //中文2字符，西文1字符
    let len = 0;
    let str1 = str.replace(/<b>/g, "").replace(/<\/b>/g, "").replace(/<i>/g, "").replace(/<\/i>/g, "");
    for (let i = 0; i < str1.length; i++) {
      if (str1.charCodeAt(i) > 127) {
        len += 2;
      } else {
        len++;
      }
    }

    return len;
  }
  */

  function sliceDraft(str){
    const tildeIndex = str.indexOf("~"),
          newLineIndex = str.indexOf("\n");
    //如果 tilde 的索引小于 newline，说明卡牌名称被省略了
    //如果第二行不合法，errorAnalysis 会报错
    if(newLineIndex === -1){ //白板且省略卡牌名称
      if(tildeIndex === -1){ //错误
        return ["", ""];
      }
      return [str, ""];
    } else if(tildeIndex < newLineIndex){ 
      return [
        str
          .slice(0, newLineIndex + 1)
          .trim(),
        str.slice(newLineIndex + 1)
      ]
    } else if(tildeIndex > newLineIndex){
      const secondIndex = str.indexOf("\n", newLineIndex + 1);
      if(secondIndex === -1){ //白板
        return [str, ""];
      }
      return [
        str
          .slice(0, secondIndex + 1)
          .trim(),
        str.slice(secondIndex + 1)
      ]
    } 
    /*
    let count = 0, index = -1;
    for(let i = 0; i < str.length; i++){
      if(str[i] === "\n"){
        count++;
        if(count === 2){
          index = i;
          break;
        }
      }
    }
    if(count < 2){
      return [
        str
          .trim()
          .replace("\n", " "), 
        ""
      ];
    } else{
      return [
        str
          .slice(0, index + 1)
          .trim()
          .replace("\n", " "), 
        str.slice(index + 1)
      ];
    }
    */
  }

  function dataInit(){
    nameTemp = "",
    costTemp = attackTemp = healthTemp = "",
    runeTemp.blood = runeTemp.frost = runeTemp.unholy = "",
    textTemp = "",
    raceTemp = "",
    secondRaceTemp = "",

    isEnabledTemp.secondClass =
    isEnabledTemp.multiClass = 
    isEnabledTemp.dragon = 
    isEnabledTemp.secondRace =
    isEnabledTemp.mini = false,

    chosenTemp.type = "minion",
    chosenTemp.class  = "neutral",
    chosenTemp.secondClass = "dk",
    chosenTemp.multiClass = "goons",
    chosenTemp.rarity = "free",
    chosenTemp.banner = "none",
    chosenTemp.emblem = "none";
  }

  function errorAnalysis(st, ru, na, crt, ra){
    if(na.length > 12) throw "卡牌名称过长";
    if(st.length > 3) throw "属性值赘余";

    if(ru.blood + ru.frost + ru.unholy > 3) throw "符文赘余";

    if(!crt.type) throw "缺少卡牌类型";
    if(crt.class) if(crt.class.length > 2) throw "职业赘余";
    if(crt.rarity) if(crt.rarity.length > 1) throw "稀有度赘余";
    if(crt.camp) if(crt.camp.length > 1) throw "多职业赘余";

    if(crt.camp && crt.class) if(crt.class.length > 1) throw "职业赘余";

    switch(crt.type[0]){
      case "minion":
        if(st.length > 0 && st.length < 3) throw "缺少属性值";
        if(ra.length > 2) throw "随从类型赘余";
        break;
      case "spell":
        if(st.length > 1) throw "属性值赘余";
        if(ra.length > 1) throw "法术派系赘余";
        break;
      case "weapon":
        if(st.length > 0 && st.length < 3) throw "缺少属性值";
        if(ra.length !== 0) throw "随从类型赘余";
        break;
      case "location":
      case "hero":
        if(st.length > 2) throw "属性值赘余";
        if(ra.length !== 0) throw "随从类型赘余";
        break;
      case "power":
        if(st.length > 1) throw "属性值赘余";
        if(ra.length !== 0) throw "随从类型赘余";

        if(crt.class) throw "职业赘余";
        if(crt.rarity) throw "稀有度赘余";
        if(crt.camp) throw "多职业赘余";
    }
  };

  function parseFrontMatter(fm){
    let statData = [],
        runeData = {
          blood: 0,
          frost: 0,
          unholy: 0
        },
        nameData = "",
        CRTData = {
          class: "",
          secondClass: "",
          camp: "",
          rarity: "",
          type: ""
        },
        raceData = [];

    const newLineIndex = fm.indexOf("\n");
    let elseData = "";
    if(newLineIndex !== -1){
      nameData = fm.slice(0, newLineIndex + 1).trim();
      console.log("name:", nameData);
      elseData = fm.slice(newLineIndex + 1).split(" ");
    } else{
      elseData = fm.split(" ");
    }

    for(let item of elseData){
      switch(true){
        case statRegex.test(item): 

          console.log("stat:", item); 
          statData = item.split("/");

          break;
        
        case raceRegex.test(item):

          console.log("race:", item); 
          raceData = item.replace("*", "").split("/");
          
          break;
        case runeRegex.test(item):

          console.log("rune:", item); 
          runeData.blood = item.match(/红/g) ? item.match(/红/g).length : 0;
          runeData.frost = item.match(/蓝/g) ? item.match(/蓝/g).length : 0;
          runeData.unholy = item.match(/绿/g) ? item.match(/绿/g).length : 0;
      
          break;
        case CRTRegex.test(item): {

          console.log("crt:", item); 

          const className = item.match(classRegex),
                rarityName = item.match(rarityRegex),
                typeName = item.match(typeRegex),
                campName = item.match(campRegex);
          
          CRTData.camp = campName ? Array.from(campName, (i) => getValByName(i, campArray)) : null;
          CRTData.class = className ? Array.from(className, (i) => getValByName(i, classArray)) : null;
          CRTData.rarity = rarityName ? Array.from(rarityName, (i) => getValByName(i, rarityArray)) : null;
          CRTData.type = typeName ? Array.from(typeName, (i) => getValByName(i, typeArray)) : null;
          
          break;
        }
        default:
          throw "未知参数赘余";
      }
    }
    
    errorAnalysis(statData, runeData, nameData, CRTData, raceData);

    costTemp = statData[0] || "";
    switch(statData.length){
      case 2: 
        healthTemp = statData[1];
        break;
      case 3:
        attackTemp = statData[1];
        healthTemp = statData[2];
        break;
    }

    runeTemp.blood = (runeData.blood !== 0) ? (runeData.blood + "") : "";
    runeTemp.frost = (runeData.frost !== 0) ? (runeData.frost + "") : "";
    runeTemp.unholy = (runeData.unholy) !== 0 ? (runeData.unholy + "") : "";

    raceTemp = raceData[0] || "";
    if(raceData.length === 2){
      isEnabledTemp.secondRace = true;
      secondRaceTemp = raceData[1];
    }

    nameTemp = nameData;

    if(CRTData.camp){
      isEnabledTemp.multiClass = true;
      chosenTemp.multiClass = CRTData.camp[0];
      chosenTemp.class = CRTData.class ? CRTData.class[0] : "neutral";
    } else{
      if(CRTData.class){
        chosenTemp.class = CRTData.class[0];
        if(CRTData.class[1]){
          isEnabledTemp.secondClass = true;
          chosenTemp.secondClass = CRTData.class[1];
        }
      }
    }
    if(CRTData.rarity){
      chosenTemp.rarity = CRTData.rarity[0];
    }
    chosenTemp.type= CRTData.type[0];

    console.log("end");
  }

  function parseCardText(str){

    /*
    const len = strLength(str);
    let maxLength;
    switch(chosenTemp.type){
      case "minion": 
        maxLength = 118; break;
      case "spell":
      case "weapon": 
        maxLength = 114; break;
      case "location":
        maxLength = 108; break;
      case "hero":
        maxLength = 92; break;
      case "power":
        maxLength = 84;
    }
    if(len > maxLength) throw "TextError";
    */

    for(let i of keyWordArray){
      const keyWordRegex = new RegExp(`(${i})`, "g");
      str = str.replace(keyWordRegex, "<b>$1</b>");
    }
    // 匹配一对括号及其内容，内容不能全为数字（法力值消耗），且后面不能跟着冒号（注能、法力渴求）
    const remarkRegex = /(（(?!\d+）)[^）]*?）(?!：))/g;
    str = str.replace(remarkRegex, "<i>$1</i>");

    //console.log(str);
    textTemp = str;
  }

  function emitResult(){
    name.value = nameTemp,
    cost.value = costTemp,
    attack.value = attackTemp,
    health.value = healthTemp,
    rune.value.blood = runeTemp.blood,
    rune.value.frost = runeTemp.frost,
    rune.value.unholy = runeTemp.unholy,
    text.value = textTemp,
    race.value = raceTemp,
    secondRace.value = secondRaceTemp,

    isEnabled.value.secondClass = isEnabledTemp.secondClass,
    isEnabled.value.multiClass = isEnabledTemp.multiClass,
    isEnabled.value.dragon = isEnabledTemp.dragon,
    isEnabled.value.secondRace = isEnabledTemp.secondRace,
    isEnabled.value.mini = isEnabledTemp.mini,

    chosen.value.type = chosenTemp.type,
    chosen.value.class  = chosenTemp.class,
    chosen.value.secondClass = chosenTemp.secondClass,
    chosen.value.multiClass = chosenTemp.multiClass,
    chosen.value.rarity = chosenTemp.rarity,
    chosen.value.banner = chosenTemp.banner,
    chosen.value.emblem = chosenTemp.emblem;
  }

  function parseDraft(str){

    dataInit();

    try{
      const [frontMatter, cardText] = sliceDraft(str);
      if(frontMatter || cardText){
        parseFrontMatter(frontMatter);
        parseCardText(cardText);
      } else{
        throw "缺少卡牌类型";
      }
    } catch(err){
      dataInit();
      console.error(err);
      const error = document.querySelector("div.subtitle-box h2 span:last-child");
      error.textContent = err;
      error.classList.add("visible");
      setTimeout(() => {
        error.classList.remove("visible");
        error.textContent = "";
      }, 1200);
    }

    emitResult();
  }

  const isHelpDisplaying = ref(false);
  function displayHelp(){
    const help = document.getElementById("help");
    isHelpDisplaying.value = !isHelpDisplaying.value;
    if(isHelpDisplaying.value){
      help.style.maxHeight = "100dvh";
      document.body.style.overflow = "hidden";
    } else if(!isHelpDisplaying.value){
      help.style.maxHeight = "0";
      document.body.style.overflow = "auto";
    }
  }

</script>

<template>
  
  <div class="subtitle-box">
    <h2>文字稿<span>Beta</span><span></span></h2>
    <button @click="displayHelp()">?</button>
    <button id="submit" @click="parseDraft(draft)">提交</button>
  </div>
  <div class="text-box">
    <textarea name="draft"
              placeholder="点击右上处「?」了解该功能"
              autocomplete="off"
              v-model="draft">
    </textarea>
  </div>

  <div id="help">
    <div id="help-box">
      <div id="help-frame">
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
      <div id="help-docs">
        <div id="help-title">
          文字稿
        </div>
        <p>「文字稿」功能是专为批量、快速制作卡牌而设计的全新功能。只需输入满足一定格式的文字稿，即可一键自动填写左侧表单，省却逐一选择的烦恼。</p>
        <p>文字稿由以下部分组成：</p>
        <div id="manual">
          <div class="row">
            <b>第一行</b><br>
            <label>
              <span class="brackets">[</span>
              卡牌名称
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="name" v-model="displayingExpl">
            </label>
          </div>
          <div class="explanation" :class="{expanded: displayingExpl === 'name'}">
            <ul>
              <li>不能超过 <b>12</b> 个字符</li>
              <li>不能包含特殊符号</li>
              <li>可以省略</li>
            </ul>
          </div>
          <div class="split-line"></div>
          <div class="row">
            <b>第二行</b><br>
            <label>
              <span class="brackets">[</span>
              消耗、属性值
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="stat" v-model="displayingExpl">
            </label>&nbsp;&nbsp;
            <label>
              <span class="brackets">[</span>
              ~职业、稀有度、类型
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="crt" v-model="displayingExpl">
            </label>&nbsp;&nbsp;
            <label>
              <span class="brackets">[</span>
              *随从类型、法术派系
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="race" v-model="displayingExpl">
            </label>&nbsp;&nbsp;
            <label>
              <span class="brackets">[</span>
              符文
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="rune" v-model="displayingExpl">
            </label>
          </div>
          <div class="explanation" :class="{expanded: displayingExpl === 'stat'}">
            <ul>
              <li>形如 <b>a/b/c</b>（随从、武器）、<b>a/c</b>（地标、英雄）或 <b>a</b>（法术、英雄技能）</li>
              <li>各项数字间以<b>斜杠 (/) </b>分隔</li>
              <li>可以完全省略，但不能省略其中某项</li>
            </ul>
          </div>
          <div class="explanation" id="crt" :class="{expanded: displayingExpl === 'crt'}">
            <ul>
              <li>以<b>浪纹 (~) </b>开头</li>
              <li>双职业间以<b>斜杠 (/) </b>分隔</li>
              <li>职业和稀有度可以省略，卡牌类型<b>不能</b>省略</li>
              <li>以上三项可以调换位置，之间不须分隔</li>
            </ul>
          </div>
          <div class="explanation" :class="{expanded: displayingExpl === 'race'}">
            <ul>
              <li>以<b>星号 (*) </b>开头</li>
              <li>双随从类型间以<b>斜杠 (/) </b>分隔</li>
              <li>可以省略</li>
            </ul>
          </div>
          <div class="explanation" :class="{expanded: displayingExpl === 'rune'}">
            <ul>
              <li>由「红」「蓝」「绿」组成，之间不须分隔</li>
              <li>可以省略</li>
            </ul>
          </div>
          <p>第二行的各部分可以调换位置，之间以<b>空格</b>分隔。</p>
          <div class="split-line"></div>
          <div class="row">
            <b>剩余行</b><br>
            <label>
              <span class="brackets">[</span>
              卡牌描述
              <span class="brackets">]</span>
              <input type="radio" name="expl" value="text" v-model="displayingExpl">
            </label>
          </div>
          <div class="explanation" :class="{expanded: displayingExpl === 'text'}">
            <ul>
              <li>关键词（如「<b>战吼</b>」）和带括弧的注释（如「<i>（还剩3杯！）</i>」）会自动变为粗体、斜体</li>
              <li>可以换行，也可以完全省略</li>
            </ul>
          </div>
        </div>
        <div id="example">
          <p><b>e.g.</b></p>
          <div id="example-box">
            <p>
              <span :class="{chosen: displayingExpl === 'name'}">尖塔缚魂</span>
              <span class="s">↵</span>
            </p>
            <p>
              <span :class="{chosen: displayingExpl === 'stat'}">3/2/2</span>
              <span class="s">•</span>
              <span :class="{chosen: displayingExpl === 'crt'}">~死亡骑士/术士普通随从</span>
              <span class="s">•</span>
              <span :class="{chosen: displayingExpl === 'race'}">*亡灵</span>
              <span class="s">•</span>
              <span :class="{chosen: displayingExpl === 'rune'}">蓝绿</span>
              <span class="s">↵</span>
            </p>
            <p>
              <span :class="{chosen: displayingExpl === 'text'}">亡语：召唤一个法力值消耗等同于本随从攻击力的随从（最高不超过10点）。</span>
              <span class="s">↵</span></p>
            <p>
              <span :class="{chosen: displayingExpl === 'text'}">星舰组件</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
    <div id="back-button" @click="displayHelp()">
      返回
    </div>
  </div>
</template>

<style scoped>

  h2{
    font: 500 1.25em var(--font-family);
    line-height: 1;
    margin: 0 0 .4em 0;
    
    flex: 1;
  }
  .subtitle-box{
    margin: 0 .5em .25em .5em;
    display: flex;
    gap: .75em;
    align-items: center;
    justify-content: space-between;
  }
  .subtitle-box h2 span{
    margin-left: .5em;
    font-size: .8em;
  }
  .subtitle-box h2 span:first-child{
    color: var(--harmony-blue);
  }
  .subtitle-box h2 span:last-child{
    opacity: 0;
    color: var(--error-color);
    transition: opacity .2s ease;
  }
  .subtitle-box h2 span.visible{
    opacity: 1;
  }

  .subtitle-box button{
    transform: translateY(-.2em);
    padding: .2em;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    outline: .1em solid var(--background-color);
    background-color: var(--background-color);
    transition: all .2s ease;

    width: 1.4em;

    font: 500 1.25em var(--font-family);
    line-height: 1;
    color: var(--disabled-color);

    cursor: pointer;
  }
  .subtitle-box button:active{
    outline-color: var(--hover-color);
    background-color: var(--hover-color);
    color: var(--shape-color);
  }
  .subtitle-box button#submit{
    padding: .2em;
    width: auto;
  }

  /*
  .subtitle-box #submit.error{
    color: var(--error-color);
    outline-color: #ffe5e9;
    background-color: #ffe5e9;
  }
  */

  .text-box{
    flex: 1;
  }
  .text-box textarea{
    width: 100%;
    height: 100%;
    resize: none;
    border: 0;
    border-radius: 8px;
    outline: none;
    box-sizing: border-box;
    padding: .25em;
    margin: 0;
    font: 300 1.25em var(--font-family);
    line-height: 1.5;
    color: var(--shape-color);
    background-color: var(--background-color);
    transition: background-color .2s ease;
  }
  .text-box textarea:active, .text-box textarea:focus{
    background-color: var(--hover-color);
  }

  #help{
    width: 100%;
    height: 100dvh;
    max-height: 0;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10000;
    background-color: var(--background-color);
    transition: max-height .5s ease;
  }

  #help-box{
    width: 1200px;
    height: 70%;
    margin: 6.75em auto 4em auto;
    padding: 2em;
    border: 1px 0 solid var(--border-color);
    box-sizing: border-box;
    user-select: none;
    overflow-x: hidden;
    overflow-y: auto;
    
    color: var(--shape-color);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #help-frame{
    width: inherit;
    height: inherit;
    position: absolute;
    pointer-events: none;
    transform: translateY(-2em);
  }

  #help-title{
    width: fit-content;
    margin-bottom: 1.6em;
    font-size: 2.4em;
    font-weight: 500;
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

  #help-docs{
    font: 300 1.25em var(--font-family);
  }
  #help-docs > p{
    margin-top: 0;
    margin-bottom: 2em;
  }

  #manual{
    font-weight: 500;
    color: var(--shape-color);
  }

  #manual p{
    font-weight: 300;
  }

  #manual b{
    white-space: nowrap;
  }

  #example{
    margin-top: 1.5em;
  }
  #example p{
    margin: 0;
  }
  #example > p{
    margin-bottom: 1em;
  }
  #example-box{
    padding: .8em 1.3em .8em 1.8em;
    box-sizing: border-box;
    position: relative;
    background-color: var(--hover-color);
    border-radius: 0 8px 8px 0;
    touch-action: auto;
    white-space: nowrap; 
    overflow: auto;
  }
  #example-box::before{
    content: "";
    position: absolute;
    left: 0;
    transform: translateY(-.8em);
    width: .5em;
    height: 100%;
    background-color: var(--disabled-color);
  }
  #example-box > *{
    touch-action: inherit;
  }
  #example-box .s{
    color: #bbb;
  }
  #example-box span{
    position: relative;
  }
  #example-box span::after{
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: var(--harmony-blue);
    opacity: .5;
    transition: height .2s ease;
  }
  #example-box span.chosen::after{
    height: .4em;
  }

  b{
    font-weight: 500;
  }

  .split-line{
    display: block;
    height: 0;
    margin: 1.6em auto;
  }

  label{
    cursor: pointer;
    white-space: nowrap;
    font-size: 1.4em;
    color: var(--disabled-color);

    outline: .125em solid var(--background-color);
    border-radius: 4px;
    background-color: var(--background-color);
    transition: all .2s ease;
  }
  label input{
    display: none;
  }
  label:has(input:checked), label:active{
    color: var(--shape-color);
  }
  label:active{
    background-color: var(--hover-color);
    outline-color: var(--hover-color);
  }

  label .brackets{
    color: var(--disabled-color);
    transition: color .2s ease;
  }
  label:has(input:checked) .brackets, label:active .brackets{
    color: var(--harmony-blue);
  }
  
  .explanation{
    font-weight: 300;
    height: 0;
    overflow: hidden;
    transition: height .4s ease;
    display: flex;
  }
  .explanation ul{
    margin: auto 1px;
    list-style: "○　";
    padding-left: 1.8em;
  }
  .explanation li{
    margin-bottom: .5em;
  }
  .explanation li::marker{
    color: var(--disabled-color);
  }
  .explanation.expanded{
    height: 9.6em;
  }
  #crt.explanation.expanded{
    height: 12em !important;
  }

  @media (max-width: 1200px) {
    .subtitle-box h2{
      white-space: nowrap;
    }



    #help-box{
      width: 100%;
      margin: 4em auto;
      max-width: 750px;
    }

    #help-frame{
      display: none;
    }

    #example div{
      max-width: calc(100vw - 3.2em);
    }
  }

  @media (hover: hover) {
    .subtitle-box button:hover{
      outline-color: var(--hover-color);
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    .text-box textarea:hover{
      background-color: var(--hover-color);
    }

    #back-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }

    label:hover .brackets{
      color: var(--harmony-blue);
    }
    label:hover{
      color: var(--shape-color);
      background-color: var(--hover-color);
      outline-color: var(--hover-color);
    }


    #help-box::-webkit-scrollbar{
      width: 4px;
    }
    #help-box::-webkit-scrollbar-thumb{
      background-color: #858585;
      border-radius: 2px;
    }
    #help-box::-webkit-scrollbar-track{
      background-color: var(--background-color);
      border-radius: 2px;
    }
    #help-box::-webkit-scrollbar-button{
      height: 4px;
      background-color: transparent;
    }
  }

  @media (prefers-color-scheme: dark){
    #example .s{
      color: #666;
    }
  }
</style>