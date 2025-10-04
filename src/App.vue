<script setup>
  import { onMounted, ref, watch } from 'vue';
  import CardGenerate from './CardGenerate.vue';
  import AdvancedFeature from './AdvancedFeature.vue';

  const result = ref();

  const name = ref(""),
        cost = ref(""),
        attack = ref(""),
        health = ref(""),
        rune = ref({
          blood: "",
          frost: "",
          unholy: ""
        }),
        text = ref(""),
        race = ref(""),
        secondRace = ref(""),
        imgUrl =ref("");

  const attackTitle = ref("攻击力"),
        healthTitle = ref("生命值"),
        raceTitle = ref("随从类型"),
        imageName = ref("选择图片..."),
        miniTitle = ref("迷你系列");

  const isOpened = ref({
          class: false,
          optionalClass: false,
          rarity: false,
          type: false,
          banner: false,
          emblem: false
        }),
        isEnabled = ref({
          secondClass: false,
          multiClass: false,
          dragon: false,
          secondRace: false,
          mini: false
        })

  const chosen = ref({
          type: "minion",
          class: "neutral",
          secondClass: "dk",
          multiClass: "goons",
          rarity: "free",
          banner: "none",
          emblem: "none"
        })

  const typeArray = ref([
    {
      value: "minion",
      name: "随从"
    },{
      value: "spell",
      name: "法术"
    },{
      value: "weapon",
      name: "武器"
    },{
      value: "location",
      name: "地标"
    },{
      value: "hero",
      name: "英雄"
    },{
      value: "power",
      name: "英雄技能"
    }
  ]),
  classArray = ref([
    {
      value: "neutral",
      name: "中立"
    },{
      value: "dk",
      name: "死亡骑士"
    },{
      value: "dh",
      name: "恶魔猎手"
    },{
      value: "druid",
      name: "德鲁伊"
    },{
      value: "hunter",
      name: "猎人"
    },{
      value: "mage",
      name: "法师"
    },{
      value: "paladin",
      name: "圣骑士"
    },{
      value: "priest",
      name: "牧师"
    },{
      value: "rogue",
      name: "潜行者"
    },{
      value: "shaman",
      name: "萨满祭司"
    },{
      value: "warlock",
      name: "术士"
    },{
      value: "warrior",
      name: "战士"
    }
  ]),
  campArray = ref([
    {
      value: "goons",
      name: "污手党"
    },{
      value: "kabal",
      name: "暗金教"
    },{
      value: "lotus",
      name: "玉莲帮"
    },{
      value: "protoss",
      name: "星灵"
    },{
      value: "terran",
      name: "人类"
    },{
      value: "zerg",
      name: "异虫"
    }
  ]),
  rarityArray = ref([
    {
      value: "free",
      name: "免费"
    },{
      value: "common",
      name: "普通"
    },{
      value: "rare",
      name: "稀有"
    },{
      value: "epic",
      name: "史诗"
    },{
      value: "legendary",
      name: "传说"
    }
  ]),
  bannerArray = ref([
    {
      value: "none",
      name: "无"
    },{
      value: "tradeable",
      name: "可交易"
    },{
      value: "forge",
      name: "锻造"
    }
  ]),
  emblemArray = ref([
    {
      value: "none",
      name: "无"
    },{
      value: "classic",
      name: "经典"
    },{
      value: "legacy",
      name: "怀旧"
    },{
      value: "cc",
      name: "经典模式"
    },{
      value: "event",
      name: "活动"
    },{
      value: "dhi",
      name: "恶魔猎手新兵"
    },{
      value: "poa",
      name: "阿尔萨斯之路"
    },{
      value: "cot",
      name: "时光之穴"
    },{
      value: "cs2021",
      name: "狮鹫年核心系列"
    },{
      value: "cs2022",
      name: "多头蛇年核心系列"
    },{
      value: "cs2023",
      name: "独狼年核心系列"
    },{
      value: "cs2024",
      name: "天马年核心系列"
    },{
      value: "cs2025",
      name: "迅猛龙年核心系列"
    },{
      value: "naxx",
      name: "纳克萨玛斯的诅咒"
    },{
      value: "gvg",
      name: "地精大战侏儒"
    },{
      value: "brm",
      name: "黑石山的火焰"
    },{
      value: "tgt",
      name: "冠军的试炼"
    },{
      value: "loe",
      name: "探险者协会"
    },{
      value: "og",
      name: "上古之神的低语"
    },{
      value: "kara",
      name: "卡拉赞之夜"
    },{
      value: "msg",
      name: "龙争虎斗加基森"
    },{
      value: "ung",
      name: "勇闯安戈洛"
    },{
      value: "kft",
      name: "冰封王座的骑士"
    },{
      value: "k&c",
      name: "狗头人与地下世界"
    },{
      value: "tww",
      name: "女巫森林"
    },{
      value: "bp",
      name: "砰砰计划"
    },{
      value: "rr",
      name: "拉斯塔哈的大乱斗"
    },{
      value: "ros",
      name: "暗影崛起"
    },{
      value: "sou",
      name: "奥丹姆奇兵"
    },{
      value: "dod",
      name: "巨龙降临"
    },{
      value: "aoo",
      name: "外域的灰烬"
    },{
      value: "sa",
      name: "通灵学园"
    },{
      value: "dmf",
      name: "疯狂的暗月马戏团"
    },{
      value: "fitb",
      name: "贫瘠之地的锤炼"
    },{
      value: "uis",
      name: "暴风城下的集结"
    },{
      value: "fav",
      name: "奥特兰克的决裂"
    },{
      value: "vsc",
      name: "探寻沉没之城"
    },{
      value: "mcn",
      name: "纳斯利亚堡的悬案"
    },{
      value: "mlk",
      name: "巫妖王的进军"
    },{
      value: "fol",
      name: "传奇音乐节"
    },{
      value: "ttn",
      name: "泰坦诸神"
    },{
      value: "sitb",
      name: "决战荒芜之地"
    },{
      value: "ww",
      name: "威兹班的工坊"
    },{
      value: "pip",
      name: "胜地历险记"
    },{
      value: "gdb",
      name: "深暗领域"
    },{
      value: "ted",
      name: "漫游翡翠梦境"
    },{
      value: "tlc",
      name: "安戈洛龟途"
    },{
      value: "att",
      name: "穿越时间流"
    }
  ]),
  miniEmblemArray = ref([
    {
      value: "dod",
      name: "巨龙降临"
    },{
      value: "dmf",
      name: "疯狂的暗月马戏团"
    },{
      value: "fitb",
      name: "贫瘠之地的锤炼"
    },{
      value: "uis",
      name: "暴风城下的集结"
    },{
      value: "fav",
      name: "奥特兰克的决裂"
    },{
      value: "vsc",
      name: "探寻沉没之城"
    },{
      value: "mcn",
      name: "纳斯利亚堡的悬案"
    },{
      value: "mlk",
      name: "巫妖王的进军"
    },{
      value: "fol",
      name: "传奇音乐节"
    },{
      value: "ttn",
      name: "泰坦诸神"
    },{
      value: "sitb",
      name: "决战荒芜之地"
    },{
      value: "ww",
      name: "威兹班的工坊"
    },{
      value: "pip",
      name: "胜地历险记"
    },{
      value: "gdb",
      name: "深暗领域"
    },{
      value: "ted",
      name: "漫游翡翠梦境"
    },{
      value: "tlc",
      name: "安戈洛龟途"
    }
  ])

  const isMobile = ref(false),
        isPreviewed = ref(false);

  onMounted(() => {
    if(window.innerWidth < 1200){
      isMobile.value = true;
    }
  })

  window.addEventListener("resize", () => {
    if(window.innerWidth < 1200){
      isMobile.value = true;
    } else{
      isMobile.value = false;
    }
  })

  function previewCard(){
    if(isMobile.value){
      isPreviewed.value = !isPreviewed.value;
      if(isPreviewed.value){
        document.body.style.setProperty("overflow", "hidden"); // 禁用滚动
      } else{
        document.body.style.setProperty("overflow", "auto");
      }
    }
  }

  let sec = false, mul = false;
  watch(
    isEnabled, newVal => {
      for(let i in isOpened.value){//isEnabled 改变时收起所有下拉选择框
        isOpened.value[i] = false;
      }
      if(newVal.secondClass && !newVal.multiClass){ //使 secondClass 和 multiClass 不能同时为真
        sec = true, mul = false;
      }
      else if(!newVal.secondClass && newVal.multiClass){
        sec = false, mul = true;
      }
      else if(newVal.secondClass && newVal.multiClass){
        newVal.secondClass = sec = !sec,
        newVal.multiClass = mul = !mul;
      }

      if(newVal.multiClass){
        chosen.value.class = "neutral";
      }
      if(!newVal.secondRace){ //第二种族关闭时将其清空
        secondRace.value = "";
      }

      if(newVal.secondRace){
        miniTitle.value = "迷";
      } else{
        miniTitle.value = "迷你系列";
      }
    },
    { deep: true }
  )

  watch(
    chosen, newVal => {
      switch(newVal.type){ 
        case "minion":
          //attackTitle = "攻击力",
          healthTitle.value = "生命值"; 
          raceTitle.value = "随从类型"; break;

        case "spell":
          raceTitle.value = "法术派系"; break;
        case "weapon":
        case "location":
          //attackTitle = "攻击力",
          healthTitle.value = "耐久度"; break;
        case "hero":
          healthTitle.value = "护甲值"; break;
      }

      if(newVal.type !== "minion"){
        isEnabled.value.secondRace = false;
      }

      if(newVal.type === "power"){
        isEnabled.value.secondClass =
        isEnabled.value.multiClass =
        isEnabled.value.dragon = 
        isEnabled.value.mini = false;

        chosen.value.rarity = "free";
        chosen.value.banner = "none";
        chosen.value.emblem = "none";
      }

      if(newVal.rarity === "legendary"){ 
        isEnabled.value.dragon = true;
      } else{
        isEnabled.value.dragon = false;
      }

      //防止加载不存在的迷你系列水印
      if(!miniEmblemArray.value.map(obj => obj.value).includes(newVal.emblem)){
        isEnabled.value.mini = false; 
      }
    },
    { deep: true }
  )

  watch(
    text, newVal => {
      if(newVal.includes("<b>可交易</b>\n")){
        chosen.value.banner = "tradeable";
      } else if(newVal.includes("<b>锻造：</b>")){
        chosen.value.banner = "forge";
      } else{
        chosen.value.banner = "none";
      }
    }
  )

  function getNameById(val, arr){
    return arr.find(item => item.value === val).name;
  }

  //改变下拉选择框展开、收起状态
  function dropOption(val){
    isOpened.value[val] = !isOpened.value[val];
    for(let i in isOpened.value){
      if(i !== val){
        isOpened.value[i] = false;
      }
    }
  }

  //限制符文数不得超过3个
  function runeLimit(val){ 
    let count = 0;
    for(let i in rune.value){
      count += (isNaN(parseInt(rune.value[i])) ? 0 : parseInt(rune.value[i])); //如果是空，计数器 += 0
    }
    if(count > 3){
      count -= parseInt(rune.value[val]);
      rune.value[val] = (3 - count) + "";
    }
  }

  //在选中文本两端添加 bold/italic 标签
  function fontStyle(t){
    let textArea = document.getElementsByName("text")[0];
    if(typeof(textArea.selectionStart) != "undefined"){
      let p1 = textArea.value.substr(0, textArea.selectionStart);
      let p2 = textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
      let p3 = textArea.value.substr(textArea.selectionEnd);
      textArea.value = `${p1}<${t}>${p2}</${t}>${p3}`;
      text.value = textArea.value;
    }
  }

  //如果选中的系列有迷你系列，则显示
  function miniAccess(){
    for(let ele of miniEmblemArray.value){
      if(ele.value === chosen.value.emblem){
        return true; 
      }
    }
    return false;
  }

  function uploadImage(){
    URL.revokeObjectURL(imgUrl.value);
    
    const file = document.getElementsByName("image")[0].files[0];
    const imgLbl = document.getElementById("imgLbl");

    const root = document.documentElement;
    let rootComputed = getComputedStyle(root);

    if(file !== "" && file.type.startsWith("image/")){
      imgUrl.value = URL.createObjectURL(file);
      imageName.value = file.name;
      imgLbl.style.color = rootComputed.getPropertyValue("--shape-color");
    } else{
      imageName.value = "图片无效...";
      imgLbl.style.color = rootComputed.getPropertyValue("--disabled-color");
    }
  }

  function saveCard(){
    if(result.value){
      result.value.saveResult();
    }
  }
</script>





<!------------------------------->





<template>

  <div class="data">
    
    <div class="class" :class="{'disabled': chosen.type === 'power'}">
      <div class="subtitle-box">
        <h2>职业</h2>
        <div class="checkbox">
          <label>
            双
            <input type="checkbox" 
                    name="optionalClass" 
                    v-model="isEnabled.secondClass">
          </label>
        </div>
        <div class="checkbox">
          <label>
            多
            <input type="checkbox"
                    name="optionalClass" 
                    v-model="isEnabled.multiClass">
          </label>
        </div>
      </div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.class}">
          <div class="toggle-box" @click="dropOption('class')">
            <div class="toggle">{{ getNameById(chosen.class, classArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in classArray">
              <label>
                {{ item.name }}
                <input type="radio"
                        name="class" 
                        :value="item.value" 
                        v-model="chosen.class" 
                        @click="dropOption('class')">
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="optional-class" v-show="isEnabled.secondClass">
      <div class="subtitle-box"><h2>第二职业</h2></div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.optionalClass}">
          <div class="toggle-box" @click="dropOption('optionalClass')">
            <div class="toggle">{{ getNameById(chosen.secondClass, classArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in classArray">
              <label>
                {{ item.name }}
                <input type="radio"
                        name="secondClass" 
                        :value="item.value" 
                        v-model="chosen.secondClass" 
                        @click="dropOption('optionalClass')">
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="optional-class" v-show="isEnabled.multiClass">
      <div class="subtitle-box"><h2>多职业阵营</h2></div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.optionalClass}">
          <div class="toggle-box" @click="dropOption('optionalClass')">
            <div class="toggle">{{ getNameById(chosen.multiClass, campArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in campArray">
              <label>
                {{ item.name }}
                <input type="radio"
                        name="multiClass" 
                        :value="item.value" 
                        v-model="chosen.multiClass" 
                        @click="dropOption('optionalClass')">
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="rarity" :class="{'disabled': chosen.type === 'power'}">
      <div class="subtitle-box">
        <h2>稀有度</h2>
        <div class="checkbox">
          <label>
            龙
            <input type="checkbox" 
                    name="dragon" 
                    v-model="isEnabled.dragon">
          </label>
        </div>
      </div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.rarity}">
          <div class="toggle-box" @click="dropOption('rarity')">
            <div class="toggle">{{ getNameById(chosen.rarity, rarityArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in rarityArray">
              <label>
                {{ item.name }}
                <input type="radio"
                        name="rarity" 
                        :value="item.value" 
                        v-model="chosen.rarity" 
                        @click="dropOption('rarity')">
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="type" :class="{'folded': isEnabled.secondClass || isEnabled.multiClass}">
      <div class="subtitle-box"><h2>卡牌类型</h2></div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.type}">
          <div class="toggle-box" @click="dropOption('type')">
            <div class="toggle">{{ getNameById(chosen.type, typeArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in typeArray">
              <label>
                {{ item.name }}
                <input type="radio" 
                        name="type" 
                        :value="item.value" 
                        v-model="chosen.type" 
                        @click="dropOption('type')" >
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="name" :class="{'folded': isEnabled.secondClass || isEnabled.multiClass}">
      <div class="subtitle-box"><h2>卡牌名称</h2></div>
      <div class="input-box">
        <div>
          <input type="text"
                  name="name"
                  placeholder="收集者沙库尔"
                  autocomplete="off"
                  maxlength="12"
                  v-model="name">
        </div>
      </div>
      
    </div>

    <div class="banner" :class="{'disabled': chosen.type === 'power'}">
      <div class="subtitle-box"><h2>主动旗帜</h2></div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.banner}">
          <div class="toggle-box" @click="dropOption('banner')">
            <div class="toggle">{{ getNameById(chosen.banner, bannerArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in bannerArray">
              <label>
                {{ item.name }}
                <input type="radio" 
                        name="banner" 
                        :value="item.value" 
                        v-model="chosen.banner" 
                        @click="dropOption('banner')" >
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text">
      <div class="subtitle-box">
        <h2>卡牌描述</h2>
        <button @click="fontStyle('b')">𝐁</button>
        <button @click="fontStyle('i')">𝐼</button>
      </div>
      <div class="text-box">
        <textarea name="text"
                  placeholder="<b>潜行</b>。每当本随从攻击时，随机将一张<i>（你对手职业的）</i>牌置入你的手牌。"
                  autocomplete="off"
                  v-model="text">
        </textarea>
      </div>
    </div>

    <div class="stat">
      <div class="cost">
        <div class="subtitle-box"><h2>消耗</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="cost"
                    placeholder="3"
                    autocomplete="off"
                    :style="{width: `clamp(60%, calc(${cost.length}ch + .5em), 100%`}"
                    v-model="cost">
          </div>
        </div>
        
      </div>
      
      <div class="attack" :class="{'disabled': chosen.type !== 'minion' && chosen.type !== 'weapon'}">
        <div class="subtitle-box"><h2>{{ attackTitle }}</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="attack"
                    placeholder="2"
                    autocomplete="off"
                    :style="{width: `clamp(60%, calc(${attack.length}ch + .5em), 100%`}"
                    v-model="attack">
          </div>
        </div>
      </div>
      
      <div class="slash" :class="{'disabled': chosen.type !== 'minion' && chosen.type !== 'weapon'}">/</div>

      <div class="health" :class="{'disabled': chosen.type !== 'minion' && chosen.type !== 'weapon' && chosen.type !== 'location' && chosen.type !== 'hero'}">
        <div class="subtitle-box"><h2>{{ healthTitle }}</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="health"
                    placeholder="4"
                    autocomplete="off"
                    :style="{width: `clamp(60%, calc(${health.length}ch + .5em), 100%`}"
                    v-model="health">
          </div>
        </div>
        
      </div>
    </div>

    <div class="rune" :class="{'disabled': chosen.type === 'power'}">
      <div class="rune-blood">
        <div class="subtitle-box"><h2>鲜血</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="runeBlood"
                    autocomplete="off"
                    @change="runeLimit('blood')"
                    v-model="rune.blood">
          </div>
        </div>
        
      </div>
      
      <div class="rune-frost">
        <div class="subtitle-box"><h2>冰霜</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="runeFrost"
                    autocomplete="off"
                    @change="runeLimit('frost')"
                    v-model="rune.frost">
          </div>
        </div>
        
      </div>

      <div class="rune-unholy">
        <div class="subtitle-box"><h2>邪恶</h2></div>
        <div class="input-box">
          <div>
            <input type="text"
                    name="runeUnholy"
                    autocomplete="off"
                    @change="runeLimit('unholy')"
                    v-model="rune.unholy">
          </div>
        </div>
        
      </div>
    </div>
    
    <div class="race" v-show="chosen.type === 'minion' || chosen.type === 'spell'">
      <div class="subtitle-box">
        <h2>{{ raceTitle }}</h2>
        <div class="checkbox" v-show="chosen.type === 'minion'">
          <label>
            双
            <input type="checkbox" 
                    name="secondRace"
                    v-model="isEnabled.secondRace">
          </label>
        </div>
      </div>
      <div class="input-box">
        <div>
          <input type="text"
                  name="race"
                  placeholder="无"
                  autocomplete="off"
                  v-model="race">
        </div>
      </div>
    </div>

    <div class="second-race"  v-show="isEnabled.secondRace && chosen.type === 'minion'">
      <div class="subtitle-box"><h2>第二类型</h2></div>
      <div class="input-box">
        <div>
          <input type="text"
                  name="secondRace"
                  placeholder="无"
                  autocomplete="off"
                  v-model="secondRace">
        </div>
      </div>
    </div>

    <div class="emblem" :class="{'folded': isEnabled.secondRace && (chosen.type === 'minion' || chosen.type === 'spell'),  'disabled': chosen.type === 'power'}">
      <div class="subtitle-box">
        <h2>系列水印</h2>
        <div class="checkbox" v-show="miniAccess()">
          <label>
            {{ miniTitle }}
            <input type="checkbox" 
                    name="mini"
                    v-model="isEnabled.mini">
          </label>
        </div>
      </div>
      <div class="select">
        <div class="option" :class="{'open': isOpened.emblem}">
          <div class="toggle-box" @click="dropOption('emblem')">
            <div class="toggle">{{ getNameById(chosen.emblem, emblemArray) }}</div>
            <div><svg style="vertical-align: middle" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#222222" d="M512 657.723077c-7.876923 0-15.753846-3.938462-19.692308-7.876923l-240.246154-232.369231c-11.815385-11.815385-11.815385-31.507692 0-43.323077 11.815385-11.815385 31.507692-11.815385 43.323077 0l220.553847 212.676923 220.553846-212.676923c11.815385-11.815385 31.507692-11.815385 43.323077 0 11.815385 11.815385 11.815385 31.507692 0 43.323077l-240.246154 232.369231c-11.815385 3.938462-19.692308 7.876923-27.569231 7.876923z"  /></svg></div>
          </div>
          <ul>
            <li v-for="item in emblemArray">
              <label>
                {{ item.name }}
                <input type="radio"
                        name="emblem" 
                        :value="item.value" 
                        v-model="chosen.emblem" 
                        @click="dropOption('emblem')">
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="image">
      <div class="subtitle-box"><h2>插画</h2></div>
      <div class="image-box">
        <label id="imgLbl">
          {{ imageName }}
          <input type="file" 
                  name="image"
                  accept="image/*"
                  @change="uploadImage()">
        </label>
      </div>
    </div>

    <div class="preview" v-if="isMobile">
      <div class="command-button" @click="previewCard()">
        预览
      </div>
    </div>

    <div class="save">
      <div class="command-button" @click="saveCard()">
        保存<span style="transform: translate(.15em, 0) rotate(15deg);">!</span>
      </div>
    </div>
  </div>

  <div class="right">
    <div class="advanced">
      <AdvancedFeature></AdvancedFeature>
    </div>
    <div class="card" :class="{previewed: isPreviewed}">
      <svg class="frame" v-if="!isMobile" width="405" height="502.5" xmlns="http://www.w3.org/2000/svg">
        <g>
          <line x1="0" y1="0" x2="32" y2="0" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="0" y1="0" x2="0" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </g>
        <g>
          <line x1="405" y1="0" x2="373" y2="0" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="405" y1="0" x2="405" y2="32" stroke="#1a69fc" stroke-width="16"></line>
        </g>
        <g>
          <line x1="0" y1="502" x2="32" y2="502" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="0" y1="502" x2="0" y2="470" stroke="#1a69fc" stroke-width="16"></line>
        </g>
        <g>
          <line x1="405" y1="502" x2="373" y2="502" stroke="#1a69fc" stroke-width="16"></line>
          <line x1="405" y1="502" x2="405" y2="470" stroke="#1a69fc" stroke-width="16"></line>
        </g>
      </svg>
      <CardGenerate :name="name" 
                    :cost="cost" 
                    :attack="attack"
                    :health="health"
                    :rune="rune"
                    :text="text"
                    :race="race"
                    :second-race="secondRace"
                    :is-enabled="isEnabled"
                    :chosen="chosen"
                    :img-url="imgUrl"
                    :is-previewed="isPreviewed"
                    @preview-card-request="previewCard()"
                    ref="result">
      </CardGenerate>
    </div>
  </div>





<!------------------------------->





</template>

<style scoped>

  h2{
    font: 500 1.25em var(--font-family);
    line-height: 1;
    margin: 0 0 .4em 0;
    
    flex: 1;
  }

  .data{
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(6, 6em);
    gap: 1em;
    grid-template-areas: 'c1 c1 c1 ra ra ty ty ty'
                         'c2 c2 c2 na na na na na'
                         'te te te st st st ba ba'
                         'te te te ru ru ru r1 r1'
                         'em em em em em em r2 r2'
                         'im im im im im im sa sa';
  }

  .type{
    grid-area: ty;
  }
  .class{
    grid-area: c1;
  }
  .optional-class{
    grid-area: c2;
  }
  .rarity{
    grid-area: ra;
  }
  .name{
    grid-column: c2-start / na-end;
    grid-row: na-start / na-end;
  }
  .name.folded{
    grid-area: na;
  }
  .banner{
    grid-area: ba;
  }
  .stat{
    grid-area: st;
    display: flex;
    gap: .5em;
  }
  .rune{
    grid-area: ru;
    display: flex;
    gap: .5em;
  }
  .text{
    grid-area: te;
    display: flex;
    flex-direction: column;
  }
  .race{
    grid-area: r1;
  }
  .second-race{
    grid-area: r2;
  }
  .emblem{
    grid-column: em-start / r2-end;
    grid-row: em-start / em-end;
  }
  .emblem.folded{
    grid-area: em;
  }
  .image{
    grid-area: im;
  }
  .save{
    grid-area: sa;
  }


  /*小标题盒子 */
  .subtitle-box{
    margin: 0 .5em .25em .5em;
    display: flex;
    gap: .75em;
    align-items: center;
    justify-content: space-between;
  }
  .stat .subtitle-box h2, .rune .subtitle-box h2{
    text-align: center;
  }
  
  .subtitle-box .checkbox{
    transform: translateY(-.25em);
    padding: .25em;
    box-sizing: border-box;
    border-radius: 4px;
    outline: .125em solid var(--background-color);
    background-color: var(--background-color);
    transition: all .2s ease;
  }
  .subtitle-box .checkbox:active{
    outline-color: var(--hover-color);
    background-color: var(--hover-color);
    transition: all .2s ease;
  }
  .subtitle-box label{
    font: 500 1.25em var(--font-family);
    line-height: 1;
    color: var(--disabled-color);
    transition: color .2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .subtitle-box label:has(input:checked){
    color: var(--shape-color);
  }
  .subtitle-box label::after{
    /*content: "○";*/
    content: "";
    margin-left: .4em;
    box-sizing: border-box;
    height: .8em; width: .8em;
    border: 2px solid var(--disabled-color);
    border-radius: 50%;
    background-color: var(--background-color);
    transition: border .2s ease; 
  }
  .subtitle-box label:has(input:checked)::after{
    /*content: "●";*/
    content: "";
    border: .4em solid var(--shape-color);
  }
  .subtitle-box input{
    display: none;
  }

  .subtitle-box button{
    transform: translateY(-.2em);
    padding: .15em .2em .25em .2em;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    outline: .1em solid var(--background-color);
    background-color: var(--background-color);
    transition: outline-color .2s ease, background-color .2s ease;

    width: 1.4em;

    font-size: 1.25em;
    line-height: 1;
    color: var(--disabled-color);
  }
  .subtitle-box button:active{
    outline-color: var(--hover-color);
    background-color: var(--hover-color);
    color: var(--shape-color);
  }

  .race .subtitle-box, .text .subtitle-box{
    padding-right: .125em;
  }


  /* 下拉选择框 */
  .option{
    position: relative;
    width: inherit;
  }
  .option .toggle-box{
    display: flex;
    justify-content: space-between;
    padding: 0 .25em;
    font: var(--value-font);
    line-height: 1.75;
    cursor: pointer;

    border-radius: 8px;
    outline: 1px solid var(--background-color);
    transition: background-color .2s ease, border-radius 0s .4s;
  }
  .option.open .toggle-box{
    border-radius: 8px 8px 0 0;
    background-color: var(--hover-color);

    outline-color: var(--hover-color);
  }
  .option .toggle-box:active{
    background-color: var(--hover-color);
    outline-color: var(--hover-color);
  }

  .option .toggle-box svg path{
      fill: var(--shape-color);
    }

  .option ul{
    max-height: 0;
    border: 0px solid var(--background-color);
    transition: max-height .4s ease, border 0s .4s;
    overflow: overlay;
    padding: 0;
    margin: 0;
    z-index: 9999;
    width: 100%;
    position: absolute;
    left: -1px;
    border-radius: 0 0 8px 8px;
    display: flex;
    flex-direction: column;

    background-color: var(--background-color);
  }

  .option ul::-webkit-scrollbar{
    width: 4px;
  }
  .option ul::-webkit-scrollbar-thumb{
    background-color: #858585;
    border-radius: 2px;
  }
  .option ul::-webkit-scrollbar-track{
    background-color: var(--background-color);
    border-radius: 2px;
  }
  .option ul::-webkit-scrollbar-button{
    height: 4px;
    background-color: transparent;
  }

  /* 下拉选择框堆叠 */
  .optional-class .option ul{
    z-index: 9998 !important;
  }

  .option.open ul{
    transition: max-height .4s ease;
    border: 1px solid var(--border-color);
  }
  .class .option.open ul,
  .optional-class .option.open ul,
  .type .option.open ul{
    max-height: 18em;
  }
  .rarity .option.open ul,
  .emblem .option.open ul{
    max-height: 15em;
  }
  .banner .option.open ul{
    max-height: 9em;
  }

  .option li{
    list-style: none;
    font: var(--value-font);
    line-height: 1.5;
    height: 1.5em;
    width: 100%;
    background-color: var(--background-color);
    transition: background-color .2s ease;

  }
  .option li:active{
    background-color: var(--hover-color);
  }
  .option label{
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0 .25em;
    cursor: pointer;
  }
  .option li:has(input:checked){
    background-color: var(--hover-color);
  }
  .option input{
    display: none;
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

  .stat .input-box input{
    text-align: center;
    letter-spacing: -.05em;
    text-indent: -.05em;
  }
  .rune .input-box input{
    width: 60%;
    text-align: center;
  }
  .cost .input-box div, .rune .input-box div{
    position: relative;
    display: flex;
    align-items: center;
  }
  .cost .input-box div::before{
    content: "(";
    font: var(--value-font);
    position: absolute;
    left: 0;
  }
  .cost .input-box div::after{
    content: ")";
    font: var(--value-font);
    position: absolute;
    right: 0;
  }
  .slash{
    font: var(--value-font);
    margin: 0 -.5ch;
    line-height: 1.75;
    align-self: end;
    transform: translateY(-.25em);
  }
  
  
  .text-box{
    height: 10.5em;
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
  .text-box textarea::placeholder{
    color: var(--disabled-color);
  }
  .text-box textarea:active, .text-box textarea:focus{
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
  
  .command-button{
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

  .command-button:active{
    background-color: var(--hover-color);
    color: var(--shape-color);
  }

  .disabled{
    color: var(--disabled-color) !important;
    pointer-events: none !important;
  }

  .disabled input{
    color: var(--disabled-color) !important;
  }


  .right{
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }
  .advanced{
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card{
    /*
    position: relative;
    transform: translate(1.75em, 2.25em);
    */
    width: 405px;
    height: 502.5px;
    position: relative;
  }
  .frame{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    pointer-events: none;
  }

  @media (max-width: 1200px) {

    .data{
      width: 100%;
      grid-template-columns: repeat(9, 1fr);
      grid-template-rows: repeat(11, 6em);
      grid-template-areas: 'c1 c1 c1 c1 c1 ra ra ra ra'
                           'c2 c2 c2 c2 c2 ty ty ty ty'
                           'na na na na na na na na na'
                           'st st st st st st st st st'
                           'ru ru ru ru ru ru ru ru ru'
                           'te te te te te te te te te'
                           'te te te te te te te te te'
                           'ba ba ba ba ba r1 r1 r1 r1'
                           'em em em em em r2 r2 r2 r2'
                           'im im im im im im pr pr pr'
                           'sa sa sa sa sa sa sa sa sa';
    }
    .preview{
      grid-area: pr;
    }
    .type{
      grid-column: c2-start / ty-end;
      grid-row: ty-start / ty-end;
    }
    .type.folded{
      grid-area: ty;
    }

    h2{
      white-space: nowrap;
    }
    .toggle{
      width: calc(100% - 1em);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .option label{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card{
      position: fixed;
      width: 100dvw;
      height: 100dvh;
      max-height: 0;
      bottom: 0;
      left: 0;
      z-index: 9999;
      transition: max-height .5s ease;
      overflow: hidden;
    }
    .card.previewed{
      max-height: 100dvh;
    }
  }

  @media (hover: hover) {
    .subtitle-box .checkbox:hover{
      outline-color: var(--hover-color);
      background-color: var(--hover-color);
      transition: all .2s ease;
    }

    .subtitle-box button:hover{
      outline-color: var(--hover-color);
      background-color: var(--hover-color);
    }

    .option .toggle-box:hover{
      background-color: var(--hover-color);
      outline-color: var(--hover-color);
    }

    .option li:hover{
      background-color: var(--hover-color);
    }

    .input-box input:hover{
      background-color: var(--hover-color);
    }
    .text-box textarea:hover{
      background-color: var(--hover-color);
    }

    .image-box label:hover{
      background-color: var(--hover-color);
    }

    .command-button:hover{
      background-color: var(--hover-color);
      color: var(--shape-color);
    }
  }

  @media (prefers-color-scheme: dark) {
    
  }
</style>
