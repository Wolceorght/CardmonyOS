<script setup>
import { ref } from 'vue';

  const draft = ref("");
</script>

<template>
  <div class="subtitle-box">
    <h2>文字稿<span>Beta</span></h2>
    <button>?</button>
  </div>
  <div class="text-box">
    <textarea name="draft"
              autocomplete="off"
              v-model="draft">
    </textarea>
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
    color: var(--harmony-blue);
  }

  .subtitle-box button{
    transform: translateY(-.2em);
    padding: .15em .2em .25em .2em;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    outline: .1em solid var(--background-color);
    background-color: var(--background-color);
    transition: all .2s ease;

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

  @media (max-width: 1200px) {
    h2{
      white-space: nowrap;
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
  }
</style>