<script setup>
  import { onMounted, ref, computed, watch } from 'vue';
  import { snapdom } from '@zumer/snapdom';

  const props = defineProps({
    name: String,
    cost: String,
    attack: String,
    health: String,
    rune: Object,
    text: String,
    race: String,
    secondRace: String,

    isEnabled: Object,
    chosen: Object,

    imgUrl: String
  })

  const loaded = ref(false);

  const f = ref(null),
        t = ref(null),
        i = ref(null),
        fctx = ref(null),
        tctx = ref(null),
        ictx = ref(null),
        width = ref(''),
        height = ref('');
  
  onMounted(() => {
    /*
    //强制加载 canvas 使用的字体
    const nameFont = new FontFace("AR LisuGB Medium", "url(/font/ARLisuGB-Medium.woff2)", {display: "block"});
    const textFont = new FontFace("BlizzardGlobal", "url(/font/BlizzardGlobal.woff2)", {display: "block"});
    document.fonts.add(nameFont);
    document.fonts.add(textFont);
    nameFont.load();
    textFont.load();
    
    document.fonts.ready.then(() => {
      fontLoaded.value = true;
    })
    */
    
    f.value = document.getElementById("card"),
    t.value = document.getElementById("text"),
    i.value = document.getElementById("illustration");
    fctx.value = f.value.getContext("2d"), 
    tctx.value = t.value.getContext("2d"),
    ictx.value = i.value.getContext("2d");
    width.value = f.value.width;
    height.value = f.value.height;

    //完全加载后再开始绘制 Canvas
    if(document.readyState === "complete"){
      loaded.value = true;
    } else{
      window.addEventListener("load", () => {
        loaded.value = true;
      })
    }

    //禁用插画图层右键
    i.value.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  })
  })

  watch(
    [props, loaded], () => {
    if(loaded.value && fctx.value !== null && tctx.value !== null){
      drawFrame(props.attack, 
                props.health, 
                props.rune, 
                props.race,
                props.secondRace, 
                props.isEnabled, 
                props.chosen);
      drawTexts(props.name, 
                props.cost, 
                props.attack, 
                props.health,
                props.text,
                props.race,
                props.secondRace,
                props.chosen);
    }
  },
  {
    deep: true
  }
);

  const illustrating = computed(() => {
    if(loaded.value && props.imgUrl !== ""){
      adjustIllustration(props.imgUrl, props.chosen);
    }
    return "";
  })

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

  function sortRunes(ru){  //将符文对象输出为数组
    let count = 0, r = {};
    for(let i in ru){
      if(!isNaN(parseInt(ru[i]))){
        count += parseInt(ru[i]);
        r[i] = parseInt(ru[i]);
      } else{
        r[i] = 0;
      }
    }
    let result = Object.keys(r).sort().map(key => ({
      key: key,
      value: r[key]
    }))
    result.push(count);
    return result;
  }

  /*
  for(let path in imgModule){
    let imgName = path.match(/([^/]*?)\.[^/.]+$/)[1]; //提取文件名以便后续引用
    let imgElement = new Image();
    imgElement.src = imgModule[path].default;

    img.value.push({
      name: imgName,
      element: imgElement
    })
  }
    */
  //导入图片
  const imgModule = import.meta.glob("@/assets/img/*.png");
  const img = ref([]);

  async function getImg(val){
    const loadedImg = img.value.find((obj) => obj.name === val);
    if(loadedImg){
      return loadedImg.element;
    }

    for(let path in imgModule){
      let imgName = path.match(/([^/]*?)\.[^/.]+$/)[1];
      if(imgName === val){
        let imgElement = new Image();
        const module = await imgModule[path]();
        const imgUrl = module.default;

        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
          imgElement.src = imgUrl;
        });

        img.value.push({
          name: imgName,
          element: imgElement
        })
        return imgElement;
      }
    }
    //return img.value.find(item => item.name === val).element;
  }

  async function drawEmblem(ra, ena, cho){
    const c1 = document.createElement("canvas"),
          c2 = document.createElement("canvas");
    const w = c1.width = c2.width = 540, h = c1.height = c2.height = 670;
    const ctx1 = c1.getContext("2d"),
          ctx2 = c2.getContext("2d");

    let y = (ra !== "" && (cho.type === "minion" || cho.type === "spell")) ? -10 : 0;
    let dx, dy, scale;

    const emblem = ena.mini ? await getImg(`emblem-${cho.emblem}-mini`) : await getImg(`emblem-${cho.emblem}`);

    switch(cho.type){
      case "minion":
        ctx1.fillStyle = "#d9d9d9";
        ctx1.fillRect(0, 0, w, h);
        ctx1.globalCompositeOperation = "destination-in";
        ctx1.drawImage(emblem, 0, y);
        fctx.value.globalAlpha = .95;  
        fctx.value.globalCompositeOperation = "color-burn";
        fctx.value.drawImage(c1, 0, 0);
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, 0, y);
        fctx.value.globalAlpha = 1;

        ctx2.fillStyle = "#585858";
        ctx2.fillRect(0, 0, w, h);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(emblem, 0, y);
        fctx.value.globalAlpha = .68;  
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, 0, y);
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c2, 0, 0);
        fctx.value.globalCompositeOperation = "source-over";
        fctx.value.globalAlpha = 1;
        break;

      case "spell":
        scale = .9;
        dx = -5 + w * (1 - scale) / 2, dy = 19 + h * (1 - scale) / 2, 

        ctx1.fillStyle = "#e9e9e9";
        ctx1.fillRect(0, 0, w, h);
        ctx1.globalCompositeOperation = "destination-in";
        ctx1.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .95;  
        fctx.value.globalCompositeOperation = "color-burn";
        fctx.value.drawImage(c1, 0, 0);
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = 1;

        ctx2.fillStyle = "#505050";
        ctx2.fillRect(0, 0, w, h);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .68;  
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c2, 0, 0);
        fctx.value.globalCompositeOperation = "source-over";
        fctx.value.globalAlpha = 1;
        break;

      case "weapon":
        scale = .96;
        dx = -4 + w * (1 - scale) / 2, dy = h * (1 - scale) / 2, 

        ctx1.fillStyle = "#484848";
        ctx1.fillRect(0, 0, w, h);
        ctx1.globalCompositeOperation = "destination-in";
        ctx1.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .95;  
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c1, 0, 0);
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = 1;

        ctx2.fillStyle = "#272727";
        ctx2.fillRect(0, 0, w, h);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .68;  
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c2, 0, 0);
        fctx.value.globalCompositeOperation = "source-over";
        fctx.value.globalAlpha = 1;
        break;

      case "location":
        scale = .78;
        dx = -2 + w * (1 - scale) / 2, dy = 46 + h * (1 - scale) / 2, 

        ctx1.fillStyle = "#e9e9e9";
        ctx1.fillRect(0, 0, w, h);
        ctx1.globalCompositeOperation = "destination-in";
        ctx1.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .95;  
        fctx.value.globalCompositeOperation = "color-burn";
        fctx.value.drawImage(c1, 0, 0);
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = 1;

        ctx2.fillStyle = "#505050";
        ctx2.fillRect(0, 0, w, h);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .68;  
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c2, 0, 0);
        fctx.value.globalCompositeOperation = "source-over";
        fctx.value.globalAlpha = 1;
        break;

      case "hero":
        scale = .78;
        dx = -6 + w * (1 - scale) / 2, dy = 35 + h * (1 - scale) / 2, 

        ctx1.fillStyle = "#e9e9e9";
        ctx1.fillRect(0, 0, w, h);
        ctx1.globalCompositeOperation = "destination-in";
        ctx1.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .95;  
        fctx.value.globalCompositeOperation = "color-burn";
        fctx.value.drawImage(c1, 0, 0);
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = 1;

        ctx2.fillStyle = "#505050";
        ctx2.fillRect(0, 0, w, h);
        ctx2.globalCompositeOperation = "destination-in";
        ctx2.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalAlpha = .68;  
        fctx.value.globalCompositeOperation = "multiply";
        fctx.value.drawImage(emblem, dx, y + dy, w * scale, h * scale);
        fctx.value.globalCompositeOperation = "color-dodge";
        fctx.value.drawImage(c2, 0, 0);
        fctx.value.globalCompositeOperation = "source-over";
        fctx.value.globalAlpha = 1;
        break;
    }
  }

  async function drawFrame(atk, hp, ru, ra, secRa, ena, cho){

    fctx.value.clearRect(0, 0, width.value, height.value);

    if(cho.type !== "power"){
      
      if(ena.secondClass){
        fctx.value.drawImage(await getImg(`${cho.type}-left-${cho.class}`), 0, 0);
        fctx.value.drawImage(await getImg(`${cho.type}-right-${cho.secondClass}`), 0, 0);
      } else{
        fctx.value.drawImage(await getImg(`${cho.type}-${cho.class}`), 0, 0);
      }

      if(cho.type === "location"){
        fctx.value.drawImage(await getImg("location-border"), 0, 0);
      }
      
      if(ena.dragon){
        fctx.value.drawImage(await getImg(`${cho.type}-dragon`), 0, 0);
      }

      if(ena.multiClass){
        fctx.value.drawImage(await getImg("multi-class"), 0, 0);
        fctx.value.drawImage(await getImg(`camp-${cho.multiClass}`), 0, 0);
      }

      fctx.value.drawImage(await getImg(`${cho.type}-text`), 0, 0);

      if(cho.type === "minion" || cho.type === "spell"){
        if(ra !== "" && secRa !== ""){
          fctx.value.drawImage(await getImg(`minion-second-race`), 0, 0);
        } else if(ra !== "" || secRa !== ""){
          fctx.value.drawImage(await getImg(`${cho.type}-race`), 0, 0);
        }
      }
      
      if(cho.rarity !== "free"){
        fctx.value.drawImage(await getImg(`${cho.type}-ra-base`), 0, 0);
        fctx.value.drawImage(await getImg(`${cho.type}-ra-${cho.rarity}`), 0, 0);
      }

      if(cho.emblem !== "none"){
        drawEmblem(ra, ena, cho);
      }
      
      fctx.value.drawImage(await getImg(`${cho.type}-name`), 0, 0);
      
      if(cho.banner !== "none"){
        fctx.value.drawImage(await getImg(`ba-${cho.banner}`), 0, 0)
      }

      
      let runes = sortRunes(ru), completed = 0;
      if(runes[3] > 0 && runes[3] <= 3){
        fctx.value.drawImage(await getImg("ru-base"),0, 0);
        for(let obj of runes){
          for(let i = 0; i < obj.value; i++){
            switch(runes[3]){
              case 1:
              case 2:
                fctx.value.drawImage(await getImg(`ru-${obj.key}-${completed + i + 1}`), 0, 0);
                break;
              case 3:
                fctx.value.drawImage(await getImg(`ru-${obj.key}-${completed + i + 1}-3`), 0, 0);
                break;
            }
          }
          completed += obj.value;
        }
      }
      
      if(cho.type === "location"){
        fctx.value.shadowBlur = 6;
        fctx.value.shadowColor = "rgba(0, 0, 0, 0.3";
        fctx.value.shadowOffsetX = 6;
        fctx.value.shadowOffsetY = 6;
        fctx.value.drawImage(await getImg("cost"), 0, 8);
        
        fctx.value.shadowColor = "transparent";
      } else{
        fctx.value.drawImage(await getImg("cost"), 0, 0);
      }

      if(atk !== '' && (cho.type === "minion" || cho.type === "weapon")){
        fctx.value.drawImage(await getImg(`${cho.type}-atk`), 0, 0);
      }
      if(hp !== ''){
        switch(cho.type){
          case "minion":
            fctx.value.drawImage(await getImg(`minion-hp`), 0, 0); break;
          case "weapon":
          case "location":
            fctx.value.drawImage(await getImg(`weapon-hp`), 0, 0); break;
          case "hero":
            fctx.value.drawImage(await getImg(`hero-hp`), 0, 0);
        }
      }
    } else if(cho.type === "power"){
      fctx.value.drawImage(await getImg("power-base"), 0, 0);
      fctx.value.drawImage(await getImg("power-cost"), 0, 0);
    }
  }

  function drawStrokedNumber(str, size, x, y){
    tctx.value.font = `${size}px 'AR LisuGB Medium'`;
    tctx.value.textAlign = "center";
    tctx.value.textBaseline = "middle";
    tctx.value.fillStyle = "#111";
    tctx.value.shadowColor = "#111";
    tctx.value.shadowBlur = props.chosen.type === "power" ? 2.4 : 3;
    for(let i = 0; i < 64; i++){
      tctx.value.fillText(str, x, y);
    }
    tctx.value.fillStyle = "#fff";
    tctx.value.shadowColor = "transparent";
    tctx.value.fillText(str, x, y);
    
    tctx.value.strokeStyle = "#111";
    tctx.value.lineWidth = .2;
    tctx.value.strokeText(str, x, y);

    /*
    const c1 = document.createElement("canvas"),
          c2 = document.createElement("canvas");
    const w = c1.width = c2.width = 540, h = c1.height = c2.height = 670;
    const ctx1 = c1.getContext("2d"),
          ctx2 = c2.getContext("2d");

    ctx1.font = "114px 'AR LisuGB Medium'";
    ctx1.textAlign = "center";
    ctx1.textBaseline = "middle";
    ctx1.fillStyle = "#111";
    ctx1.shadowColor = "#111";
    ctx1.shadowBlur = 2.7;
    ctx1.fillText(str, x, y);
    const cData = ctx1.getImageData(0, 0, w, h);
    for(let i = 0; i < cData.data.length; i += 4){
      if(cData.data[i + 3] !== 0){
        cData.data[i + 3] = 255;
      }
    }
    tctx.value.putImageData(cData, 0, 0);
    tctx.value.font = "114px 'AR LisuGB Medium'";
    tctx.value.textAlign = "center";
    tctx.value.textBaseline = "middle";
    tctx.value.fillStyle = "#fff";
    tctx.value.fillText(str, x, y);
    */
  }

  async function drawStrokedName(str, type){
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    const svgPath = document.createElementNS(ns, "path");
    const svgText = document.createElementNS(ns, "text");
    const svgTextPath = document.createElementNS(ns, "textPath");
    const svgTextNode = document.createTextNode(str);

    const nameBox = document.createElement("div");
    const transformBox = document.createElement("div");
    
    let size = 36, x, y, w, h, dy1, dy2;
    let nameLength = strLength(str);
    
    svgPath.setAttribute("id", "path");
    svgPath.setAttribute("visibility", "hidden");

    switch(type){
      case "minion":{
        x = 108.57, y = 349.56;
        w = 320, h = 70;
        dy1 = .75, dy2 = .25;

        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(3deg) rotateY(-1deg)");
        
        const userAgent = navigator.userAgent;
        if(userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1 && userAgent.indexOf("Edge") === -1){
          transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(3deg) rotateY(-1deg) skewX(5deg)");
          nameBox.setAttribute("style", "transform: perspective(100px)");
        }

        svgPath.setAttribute("d", "M-165.0601 14.4342c0 0 27.869 12.5645 96.9358-5.684 61.5273-16.1543 118.6117-20.1929 140.2876-20.1929 21.5413 0 63.0082 3.1411 87.7807 20.1929");

        svgText.setAttribute("letter-spacing", ".01em");
        svgText.setAttribute("dy", "6.67");
        svgText.setAttribute("transform", "scale(1, 0.9) skewX(-2)");
        svgText.setAttribute("stroke-width", "5");
        break;
      }
      case "spell":
        x = 83, y = 347.9;
        w = 380, h = 61;
        dy1 = .9, dy2 = .3;

        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(1deg);");

        svgPath.setAttribute("d", "M -190 29.485 c 0 0 94.9096 -30.9256 189.9525 -30.9256 c 94.9096 0 189.9525 31.992 189.9525 31.992");
        
        svgText.setAttribute("transform", "scale(1, 0.95)");
        svgText.setAttribute("stroke-width", "5.5");
        break;

      case "weapon":
        x = 108.9, y = 352.98;
        w = 324, h = 49;
        dy1 = .9, dy2 = .3;
        size = 36;
        
        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(-.5deg);");
        
        svgPath.setAttribute("d", "M-165.5119 6.1462H165.1574");

        svgText.setAttribute("letter-spacing", ".005em");
        svgText.setAttribute("stroke-width", "5.5");
        break;

      case "location":
        x = 106, y = 356.4;
        w = 342, h = 51;
        dy1 = .75, dy2 = .25;

        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(1.5deg);");

        svgPath.setAttribute("d", "M-171-4.6605c0 0 69.9825 21.8345 170.8906 22.1145 2.666 0 5.4653 0 8.1313 0 29.7259-.2799 56.7858-1.2597 80.2466-4.6188 40.3899-5.7386 65.7169-12.4569 82.1128-17.4956");

        svgText.setAttribute("transform", "scale(1, 0.95)");
        svgText.setAttribute("stroke-width", "5.5");
        break;

      case "hero":
        x = 100.05, y = 345.02;
        w = 339, h = 83;
        dy1 = .9, dy2 = .3;
        size = 38.5;

        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px) rotateX(-1deg);");

        svgPath.setAttribute("d", "M-177.5551 40.7461c0 0 169.6376-107.8397 355.5111-.2666");

        svgText.setAttribute("letter-spacing", "-.02em");
        svgText.setAttribute("transform", "scale(0.95, 1)");
        svgText.setAttribute("stroke-width", "5.5");
        break;
      
      case "power":
        x = 125, y = 340;
        w = 292 , h = 38;
        dy1 = .9, dy2 = .3;
        size = 31.82;
        
        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("viewBox", `${-w / 2} ${-h / 2}, ${w}, ${h}`);
        transformBox.setAttribute("style", "transform-style: preserve-3d; transform: perspective(100px);");

        svgPath.setAttribute("d", "M-146 11.9256h291.927");
        
        svgText.setAttribute("stroke-width", "5.5");
    }

    for(let i = 0; i < nameLength; i++){
      if(i < 18) continue;
      else if(i < 22){
        size *= .935;
        y -= dy1;
      } else{
        size *= .98;
        y -= dy2;
      }
    }

    svgText.setAttribute("text-anchor", "middle");
    svgText.setAttribute("font-family", "AR LisuGB Medium");
    svgText.setAttribute("font-size", size + "");
    svgText.setAttribute("fill", "#fff");
    svgText.setAttribute("stroke", "#000");
    
    svgText.setAttribute("stroke-linejoin", "round");
    svgText.setAttribute("paint-order", "stroke");
    
    svgTextPath.setAttribute("href", "#path");
    svgTextPath.setAttribute("startOffset", "50%");

    svgTextPath.appendChild(svgTextNode);
    svgText.appendChild(svgTextPath);
    svg.appendChild(svgPath);
    svg.appendChild(svgText);
    transformBox.appendChild(svg);
    nameBox.appendChild(transformBox);

    const hidden = document.getElementById("hidden");
    hidden.appendChild(nameBox);

    const nameCanvas = await snapdom.toCanvas(nameBox, {
      width: w,
      height: h,
      dpr: 1,
      embedFonts: true,
      excludeFonts: {
        families: ["Inter", "BlizzardGlobal"]
      }
    });
    tctx.value.drawImage(nameCanvas, x, y);
    hidden.removeChild(nameBox);

    /*
    const c1 = document.createElement("canvas"),
          c2 = document.createElement("canvas");
    const ctx1 = c1.getContext("2d"),
          ctx2 = c2.getContext("2d");
    c1.width = c2.width = w, c1.height = c2.height = h;
    
    const svgStr1 = new XMLSerializer().serializeToString(svg);
    const v1 = await Canvg.from(ctx1, svgStr1);
    await v1.render();

    svgText.setAttribute("stroke-width", "0");

    const svgStr2 = new XMLSerializer().serializeToString(svg);
    const v2 = await Canvg.from(ctx2, svgStr2);
    await v2.render();
    
    ctx1.drawImage(c2, 0, 0);

    c1.style.setProperty("transform", "perspective(100px) rotateX(3deg) rotateY(-1deg)");
    const c1Box = document.createElement("div");
    const hidden = document.getElementById("hidden");
    c1Box.appendChild(c1);
    hidden.appendChild(c1Box); 

    const nameCanvas = await snapdom.toCanvas(c1Box, {
      width: w,
      height: h,
      dpr: 1
    });
    tctx.value.drawImage(nameCanvas, x, y);
    
    hidden.removeChild(c1Box);
    */

    /* // html2canvas solution
    const box = document.getElementById("box"); 
    box.style.setProperty("zoom", "1"); 

    html2canvas(c1, {
      backgroundColor: null,
      width: w,
      height: h,
      x: 0,
      y: 0,
      scale: 1
    }).then((nameCanvas) => {
      tctx.value.drawImage(nameCanvas, x, y);
    })

    box.style.setProperty("zoom", ".75");
    */
    
    /* // XMLSerializer solution
    const svgStr = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
    const svgURL = URL.createObjectURL(svgBlob);

    const svgImg = new Image();
    svgImg.onload = () => {
      test.appendChild(svgImg);
      tctx.value.drawImage(svgImg, x, y);
      URL.revokeObjectURL(svgURL);
    }
    svgImg.src = svgURL;
    */
  }

  async function drawText(te, type){

    //const ns = "http://www.w3.org/2000/svg";
    const leftShape = document.createElement("div");
    const rightShape = document.createElement("div");
    let size, color, x, y, w, h;

    const len = strLength(te);

    const textBox = document.createElement("div");
    const textContent = document.createElement("p");
    textContent.innerHTML = te;

    const boldText = textContent.querySelectorAll("b");
    if(type === "weapon"){
      color = "#ddd";
    } else{
      color = "#1e1710";
    }
    boldText.forEach(element => {
      element.style.fontWeight = "400";
      let strokeWidth = ".05em";
      const userAgent = navigator.userAgent;
      if(userAgent.indexOf("Firefox") !== -1){
        strokeWidth = ".02em";
      }
      element.style.textShadow = `0 0 ${strokeWidth} ${color},
                                  0 0 ${strokeWidth} ${color}`;
    })
    
    textBox.style.overflow = "hidden";
    textBox.style.textAlign = "center";
    textContent.style.fontFamily = "BlizzardGlobal";
    textContent.style.letterSpacing = ".01em";
    textContent.style.lineBreak = "strict";

    //const svg = document.createElementNS(ns, "svg");
    //const svgText = document.createElementNS(ns, "foreignObject");

    const sizeSet = [
      {
        type: "minion",
        set: [
          {
            len: 50, size: 30.5
          },{
            len: 70, size: 27.5
          },{
            len: 90, size: 24
          },{
            len: 118, size: 22.5
          }
        ]
      },{
        type: "spell",
        set: [
          {
            len: 44, size: 30.5
          },{
            len: 68, size: 26.5
          },{
            len: 74, size: 24
          },{
            len: 82, size: 22.5
          },{
            len: 114, size: 21.5
          }
        ]
      },{
        type: "weapon",
        set: [
          {
            len: 44, size: 30.5
          },{
            len: 68, size: 26.5
          },{
            len: 74, size: 24
          },{
            len: 82, size: 22.5
          },{
            len: 114, size: 21.5
          }
        ]
      },{
        type: "location",
        set: [
          {
            len: 44, size: 30.5
          },{
            len: 48, size: 27.5
          },{
            len: 62, size: 26.5
          },{
            len: 70, size: 24
          },{
            len: 78, size: 22.5
          },{
            len: 108, size: 21
          }
        ]
      },{
        type: "hero",
        set: [
          {
            len: 44, size: 30.5
          },{
            len: 64, size: 27.5
          },{
            len: 76, size: 24
          },{
            len: 92, size: 22.5
          }
        ]
      },{
        type: "power",
        set: [
          {
            len: 44, size: 29.5
          },{
            len: 60, size: 26.5
          },{
            len: 72, size: 23
          },{
            len: 84, size: 21
          }
        ]
      }
    ];

    const chosenSize = sizeSet.find((item) => item.type === type).set;

    let nextIndex = null, isMin = false;
    for(let i = 0; i < chosenSize.length; i++){
      if(len <= chosenSize[i].len){
        size = chosenSize[i].size;
        if(chosenSize[i + 1]){
          nextIndex = i + 1; //存储小一号尺寸用于适应换行
        } else{
          isMin = true;
          nextIndex = i;
        }
        break;
      }
    }
    if(!nextIndex){ //不在范围内，nextIndex 没有被赋值
      return;
    }

    switch(type){
      case "minion":
        x = 121, y = 454, w = 300, h = 128;

        textBox.style.width = "300px";
        textBox.style.height = "128px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";

        leftShape.style.width = "128px";
        leftShape.style.height = "128px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "circle(50px at 0px 135px)"
        leftShape.style.shapeOutside = "circle(50px at 0px 135px)";

        rightShape.style.width = "128px";
        rightShape.style.height = "128px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "circle(50px at 128px 135px)"
        rightShape.style.shapeOutside = "circle(50px at 128px 135px)";
        
        break;

      case "spell":
        x = 135.5, y = 460, w = 262, h = 128;

        textBox.style.width = "262px";
        textBox.style.height = "128px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";

        leftShape.style.width = "128px";
        leftShape.style.height = "128px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "ellipse(38px 32px at 0 0)";
        leftShape.style.shapeOutside = "ellipse(38px 32px at 0 0)";
        
        rightShape.style.width = "128px";
        rightShape.style.height = "128px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "ellipse(38px 32px at 128px 0)";
        rightShape.style.shapeOutside = "ellipse(38px 32px at 128px 0)";

        if(len > 90){
          //leftShape.style.clipPath = "ellipse(36px 34px at 0 -10px)";
          //rightShape.style.clipPath = "ellipse(36px 34px at 128px -10px)";
          leftShape.style.shapeOutside = "ellipse(36px 34px at 0 -10px)";
          rightShape.style.shapeOutside = "ellipse(36px 34px at 128px -10px)";
        }

        break;

      case "weapon":
        x = 142, y = 454, w = 254, h = 134;

        textBox.style.width = "254px";
        textBox.style.height = "134px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";

        leftShape.style.width = "100px";
        leftShape.style.height = "134px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "inset(80px 66px 0 0)"
        leftShape.style.shapeOutside = "inset(80px 66px 0 0)";

        rightShape.style.width = "100px";
        rightShape.style.height = "134px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "inset(80px 0 0 66px)"
        rightShape.style.shapeOutside = "inset(80px 0 0 66px)";
        
        if(len <= 44){
          //leftShape.style.clipPath = "inset(86px 66px 0 0)"
          //rightShape.style.clipPath = "inset(86px 0 0 66px)"
          leftShape.style.shapeOutside = "inset(86px 66px 0 0)";
          rightShape.style.shapeOutside = "inset(86px 0 0 66px)"; 
        } else if(len > 60){
          //leftShape.style.clipPath = "inset(80px 70px 0 0)"
          //rightShape.style.clipPath = "inset(80px 0 0 70px)"
          leftShape.style.shapeOutside = "inset(80px 70px 0 0)";
          rightShape.style.shapeOutside = "inset(80px 0 0 70px)";
        }

        break;
      
      case "location":
        x = 138, y = 464, w = 260, h = 122;

        textBox.style.width = "260px";
        textBox.style.height = "122px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";
        
        leftShape.style.width = "122px";
        leftShape.style.height = "122px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "ellipse(42px 56px at 0 122px)";
        leftShape.style.shapeOutside = "ellipse(42px 56px at 0 122px)";
        
        rightShape.style.width = "122px";
        rightShape.style.height = "122px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "ellipse(42px 56px at 122px 122px)";
        rightShape.style.shapeOutside = "ellipse(42px 56px at 122px 122px)";

        if(len > 78){
          //leftShape.style.clipPath = "inset(84px 94px 0 0)"
          //rightShape.style.clipPath = "inset(84px 0 0 94px)"
          leftShape.style.shapeOutside = "inset(84px 94px 0 0)"
          rightShape.style.shapeOutside = "inset(84px 0 0 94px)"  
        }

        break;

      case "hero":
        x = 142, y = 450, w = 254, h = 128;
        
        textBox.style.width = "254px";
        textBox.style.height = "128px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";
        
        leftShape.style.width = "100px";
        leftShape.style.height = "128px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "inset(74px 72px 0 0)";
        leftShape.style.shapeOutside = "inset(74px 72px 0 0)";
        
        rightShape.style.width = "100px";
        rightShape.style.height = "128px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "inset(74px 0 0 72px)";
        rightShape.style.shapeOutside = "inset(74px 0 0 72px)";

        if(len <= 50 || len > 64){
          //leftShape.style.clipPath = "inset(91px 72px 0 0)";
          //rightShape.style.clipPath = "inset(91px 0 0 72px)";
          leftShape.style.shapeOutside = "inset(91px 72px 0 0)";
          rightShape.style.shapeOutside = "inset(91px 0 0 72px)";
        }

        break;

      case "power":
        x = 137, y = 434, w = 256, h = 128;
        color = "#000";

        textBox.style.width = "256px";
        textBox.style.height = "128px";
        textContent.style.fontSize = size + "px";
        textContent.style.color = color;
        textContent.style.lineHeight = "1.13";
        textContent.style.whiteSpace = "pre-wrap";

        leftShape.style.width = "100px";
        leftShape.style.height = "128px";
        leftShape.style.float = "left";
        //leftShape.style.backgroundColor = "#000";
        //leftShape.style.clipPath = "ellipse(64px 64px at 0 135px)";
        leftShape.style.shapeOutside = "ellipse(64px 64px at 0 135px)";
        
        rightShape.style.width = "100px";
        rightShape.style.height = "128px";
        rightShape.style.float = "right";
        //rightShape.style.backgroundColor = "#000";
        //rightShape.style.clipPath = "ellipse(64px 64px at 100px 135px)";
        rightShape.style.shapeOutside = "ellipse(64px 64px at 100px 135px)";

        if(len > 72){
          //leftShape.style.clipPath = "inset(80px 70px 0 0)";
          //rightShape.style.clipPath = "inset(80px 0 0 70px)";
          leftShape.style.shapeOutside = "inset(80px 70px 0 0)";
          rightShape.style.shapeOutside = "inset(80px 0 0 70px)";
        }

        //svg.setAttribute("width", "256");
        //svg.setAttribute("height", "128");
        //svg.setAttribute("viewBox", "0 0 256 128");
        //svgText.setAttribute("width", "256");
        //svgText.setAttribute("height", "128");
    }

    const hidden = document.getElementById("hidden");
    textBox.appendChild(leftShape);
    textBox.appendChild(rightShape);
    textBox.appendChild(textContent);
    
    hidden.appendChild(textBox);

    const oldHeight = textContent.offsetHeight;
    const marginHeight = (h - oldHeight) / 2; 
    textContent.style.marginTop = marginHeight + "px";
    let newHeight = textContent.offsetHeight;

    while(newHeight > h){ //避免换行导致的溢出
      if(isMin){ //如果已经是最小字号——换言之无法避免即将到来的溢出，停止绘制
        return;
      }
      size = chosenSize[nextIndex].size;
      nextIndex++;
      textContent.style.fontSize = size + "px";
      newHeight = textContent.offsetHeight;
    }

    if(oldHeight > newHeight){
      textContent.style.transform = `translateY(${(oldHeight - newHeight) / 2}px)`;
    } else if(oldHeight < newHeight){
      textContent.style.transform = `translateY(-${(newHeight - oldHeight) / 2}px)`;
    }
    
    const textCanvas = await snapdom.toCanvas(textBox, {
      width: w,
      height: h,
      dpr: 1,
      embedFonts: true,
      excludeFonts: {
        families: ["Inter", "AR LisuGB Medium"]
      }
    })
    tctx.value.drawImage(textCanvas, x, y);

    hidden.removeChild(textBox);
    

    /* // html2canvas solution
    const box = document.getElementById("box"); 
    box.style.setProperty("zoom", "1"); 
    //html2canvas 在父元素被 zoom 或 transform: scale() 的情况下，会出现文字重叠问题。所以暂且复原，画完再缩放回去

    html2canvas(textBox, {
      backgroundColor: null, 
      width: w, 
      height: h, 
      x: 0, 
      y: 0, 
      scale: 1
    }).then((textCanvas) => {
      tctx.value.drawImage(textCanvas, x, y);
    });

    box.style.setProperty("zoom", ".75");
    hidden.removeChild(textBox);
    */

    /* // XMLSerializer solution
    const svgStr = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
    const svgURL = URL.createObjectURL(svgBlob);

    const svgImg = new Image();
    svgImg.onload = () => {
      tctx.value.drawImage(svgImg, x, y, w, h);
      URL.revokeObjectURL(svgURL);
      hidden.removeChild(svg);
    }
    svgImg.src = svgURL;
    */
  }

  function drawRace(ra, secRa, type){
    tctx.value.textAlign = "center";
    tctx.value.textBaseline = "middle";
    tctx.value.fillStyle = "#fff";
    tctx.value.strokeStyle = "#111";
    tctx.value.lineWidth = 4.5;

      if(ra !== "" && secRa !== ""){
        tctx.value.lineWidth = 3.2;
        tctx.value.font = `26px 'AR LisuGB Medium'`;
        tctx.value.strokeText(ra, 276.9, 600.3);
        tctx.value.fillText(ra, 276.9, 600.3);
        tctx.value.lineWidth = .2;
        tctx.value.strokeText(ra, 276.9, 600.3);
        
        tctx.value.lineWidth = 3.2;
        tctx.value.strokeText(secRa, 276.9, 623.3);
        tctx.value.fillText(secRa, 276.9, 623.3);
        tctx.value.lineWidth = .2;
        tctx.value.strokeText(secRa, 276.9, 623.3);
      } else if(ra !== ""){
        if(type === "minion"){
          tctx.value.font = `34.07px 'AR LisuGB Medium'`;
          tctx.value.strokeText(ra, 271.3, 603.1);
          tctx.value.fillText(ra, 271.3, 603.1);
          tctx.value.lineWidth = .2;
          tctx.value.strokeText(ra, 271.3, 603.1);
        } else if(type === "spell"){
          tctx.value.font = `34.24px 'AR LisuGB Medium'`;
          tctx.value.strokeText(ra, 270.2, 605.4);
          tctx.value.fillText(ra, 270.2, 605.4);
          tctx.value.lineWidth = .2;
          tctx.value.strokeText(ra, 270.2, 605.4);
        }
      } else if(secRa !== ""){
        if(type === "minion"){
          tctx.value.font = `34.07px 'AR LisuGB Medium'`;
          tctx.value.strokeText(secRa, 271.3, 603.1);
          tctx.value.fillText(secRa, 271.3, 603.1);
          tctx.value.lineWidth = .2;
          tctx.value.strokeText(secRa, 271.3, 603.1);
        } else if(type === "spell"){
          tctx.value.font = `34.24px 'AR LisuGB Medium'`;
          tctx.value.strokeText(secRa, 270.2, 605.4);
          tctx.value.fillText(secRa, 270.2, 605.4);
          tctx.value.lineWidth = .2;
          tctx.value.strokeText(secRa, 270.2, 605.4);
        }
      }
  }

  function drawTexts(na, co, atk, hp, te, ra, secRa, cho){
    
    tctx.value.clearRect(0, 0, width.value, height.value);

    
    if(co !== ""){
      if(cho.type !== "power"){
        drawStrokedNumber(co, 114, 112, 123);
      } else{
        drawStrokedNumber(co, 92.8, 268, 109);
      }
    }

    switch(cho.type){
      case "minion":
      case "weapon":
        if(atk !== ""){
          drawStrokedNumber(atk, 106.7, 118, 592);
        }
        if(hp !== ""){
          drawStrokedNumber(hp, 106.7, 432, 594);
        }
        drawRace(ra, secRa, cho.type); break;
      case "spell":
        drawRace(ra, secRa, cho.type); break;
      case "location":
      case "hero":
        if(hp !== ""){
          drawStrokedNumber(hp, 106.7, 432, 594);
        }
    }
    if(na !== ""){
      drawStrokedName(na, cho.type);
    }
    if(te !== "" && strLength(te)){
      drawText(te, cho.type);
    }
  }

  function adjustIllustration(url, cho){

    let isDragging = false,
        lastPosition = {x: 0, y: 0},
        offset = {x: 0, y: 0},
        scale = 1;

    if(loaded.value){
      ictx.value.clearRect(0, 0, width.value, height.value);
    }

    const illu = new Image();
    illu.onload = () => {
        offset = {x: (width.value - illu.width) / 2,
                  y: (height.value - illu.height) / 2
        }
        scale = 1;
        drawIllustration(cho);
    }
    illu.src = url;

    i.value.style.cursor = "move";
    
    i.value.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastPosition = {x: e.clientX, y: e.clientY};
    })

    i.value.addEventListener("mousemove", (e) => {
      if(isDragging){
        const dx = e.clientX - lastPosition.x,
              dy = e.clientY - lastPosition.y;
        offset.x += dx;
        offset.y += dy;
        lastPosition = {x: e.clientX, y: e.clientY};

        drawIllustration(cho);
      }
    })

    i.value.addEventListener("mouseup", () => {
      isDragging = false;
    })

    i.value.addEventListener("mouseleave", () => {
      isDragging = false;
    })

    i.value.addEventListener("wheel", (e) => {
      e.preventDefault();
      const mx = e.clientX - i.value.getBoundingClientRect().left,
            my = e.clientY - i.value.getBoundingClientRect().top;

      const newScale = e.deltaY < 0 ? scale * 1.1 : scale / 1.1;
      if(newScale < 0.1 || newScale > 5) return;

      const factor = newScale / scale;
      offset.x = mx - factor * (mx - offset.x);
      offset.y = my - factor * (my - offset.y);
      scale = newScale;

      drawIllustration(cho);
    })

    function drawIllustration(cho){
      const c1 = document.createElement("canvas"),
            c2 = document.createElement("canvas");
      const w = c1.width = c2.width = 540, h = c1.height = c2.height = 670;
      const ctx1 = c1.getContext("2d"), 
            ctx2 = c2.getContext("2d");
      let path;

      ictx.value.clearRect(0, 0, width.value, height.value);
      
      ctx1.beginPath();
      switch(cho.type){
        case "minion":
          ctx1.ellipse(271, 243, 163, 117, Math.PI / 2, 0, Math.PI * 2);
          break;
        case "spell":
          path = new Path2D("M121.9695 159.0269c0 0 64.3839-32.3919 149.0294-31.992S419.895 161.9595 419.895 161.9595v178.8886c0 0-39.1902 35.991-150.8956 35.991-100.1083 0-149.9625-33.0584-149.9625-33.0584V159.96L121.9695 159.0269z");
          break;
        case "weapon":
          ctx1.arc(271.5, 244, 132, 0, Math.PI * 2);
          break;
        case "location":
          path = new Path2D("M123.969 129.0344c0 0-20.5282 11.7304-18.9286 41.0564 0 0 23.1942 52.9201 18.9286 73.0484-4.2656 20.1283-18.9286 21.9945-18.9286 21.9945s-2.666 35.5911 3.999 46.9216c0 0 13.5966 39.8567 53.0534 55.986l223.944-1.0664c0 0 36.2576-23.5941 47.988-63.984 0 0 1.0664-1.7329 1.0664-9.9975 0-8.2646 0-26.9266 0-26.9266s-12.1303-6.1318-17.0624-14.9296c-4.7988-8.7978-6.5317-30.5257 11.997-69.9825l5.0654-11.0639c0 0 2.7993-29.1927-19.995-39.99 0 0-31.5921 13.1967-47.988-17.0624 0 0-19.8617-13.33-73.0484-14.9296 0 0-21.8612-34.2581-45.9885-1.0664 0 0-47.988 3.1992-73.9815 15.996C173.9565 113.0384 155.2945 145.1637 123.969 129.0344z");
          break;
        case "hero":
          path = new Path2D("M158.8936 354.8446l-1.0664-117.9705c0 0-3.1992-67.1832 45.9885-107.973s93.1767-34.2581 134.8996 1.0664 42.9226 97.9755 42.9226 97.9755v126.9016H158.8936z");
          break;
        case "power":
          path = new Path2D("M291.927 161.0264c0 0 5.4653-5.4653 9.1977-10.3974 32.1253 12.2636 54.7863 43.4558 54.7863 79.8467 0 47.1882-38.2571 85.4453-85.4453 85.4453s-85.4453-38.2571-85.4453-85.4453c0-35.7244 21.9945-66.3834 53.1867-79.1802 5.4653 3.7324 9.7309 9.7309 9.7309 9.7309H291.927z");
      }
      ctx1.fillStyle = "#fff";
      (cho.type === "minion" || cho.type === "weapon") ? 
        ctx1.fill() : 
        ctx1.fill(path);

      ictx.value.drawImage(c1, 0, 0);
      ictx.value.globalCompositeOperation = "source-in";

      ictx.value.save();
      ictx.value.translate(offset.x, offset.y);
      ictx.value.scale(scale, scale);
      ictx.value.drawImage(illu, 0, 0);
      ictx.value.restore();

      ctx2.fillStyle = "#000";
      ctx2.fillRect(0, 0, w, h);
      ctx2.globalCompositeOperation = "destination-out";
      ctx2.drawImage(c1, 0, 0);
      ctx2.globalCompositeOperation = "source-over";
      ctx2.shadowColor = "#000";
      ctx2.shadowBlur = 16;
      ctx2.drawImage(c2, 0, 0);
      
      ictx.value.globalCompositeOperation = "source-atop";
      ictx.value.drawImage(c2, 0, 0);
      ictx.value.globalCompositeOperation = "source-over";
    }
  }


  const saveResult = () => {
    const r = document.createElement("canvas");
    r.width = 540, r.height = 670;
    const rctx= r.getContext("2d");

    rctx.drawImage(i.value, 0, 0);
    rctx.drawImage(f.value, 0, 0);
    rctx.drawImage(t.value, 0, 0);

    r.toBlob((blob) => {
      const resultUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.style.display = "none";
      document.body.appendChild(link);
      link.href = resultUrl;
      link.download = props.name;
      link.click();
      document.body.removeChild(link);
    })
  }
  defineExpose({saveResult});

</script>

<template>
  <div id="box">
    <canvas id="illustration" width="540" height="670"></canvas>
    <canvas id="card" width="540" height="670"></canvas>
    <canvas id="text" width="540" height="670"></canvas>
    <div>{{ illustrating }}</div>
    <div id="test"></div>
    <div id="card-background"></div>
  </div>
  <div id="hidden"></div>
</template>

<style scoped>

  #box{
    zoom: .75;
    position: absolute;
  }
  #illustration{
    position: absolute;
    z-index: 2;
  }
  #card{
    position: absolute;
    pointer-events: none;
    z-index: 3;
  }
  #text{
    position: absolute;
    pointer-events: none;
    z-index: 4;
  }
  #card-background{
    background-color: var(--background-color);
    width: 540px;
    height: 670px;
    position: absolute;
    z-index: 1;
  }
  #hidden{
    position: absolute;
    z-index: -1;
    /*
    top: -1000px;
    left: -1000px;
    */
  }

</style>