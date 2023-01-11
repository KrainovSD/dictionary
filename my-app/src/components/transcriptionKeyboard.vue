<template>
  <div class="keyboard" @mousedown="enterTranscription">
    <div>
      <div class="keyboard__key">ɑ</div>
      <div class="keyboard__key">ʌ</div>
      <div class="keyboard__key">ə</div>
      <div class="keyboard__key">ε</div>
      <div class="keyboard__key">æ</div>
      <div class="keyboard__key">ɜ</div>
      <div class="keyboard__key">ʒ</div>
      <div class="keyboard__key">ı</div>
      <div class="keyboard__key">ɪ</div>
      <div class="keyboard__key">ŋ</div>
      <div class="keyboard__key">ɔ</div>
      <div class="keyboard__key">ɒ</div>
      <div class="keyboard__key">ʃ</div>
      <div class="keyboard__key">ð</div>
      <div class="keyboard__key">θ</div>
      <div class="keyboard__key">ʤ</div>
    </div>
    <div>
      <div class="keyboard__key">ʊ</div>
      <div class="keyboard__key">b</div>
      <div class="keyboard__key">d</div>
      <div class="keyboard__key">e</div>
      <div class="keyboard__key">f</div>
      <div class="keyboard__key">g</div>
      <div class="keyboard__key">h</div>
      <div class="keyboard__key">i</div>
      <div class="keyboard__key">j</div>
      <div class="keyboard__key">k</div>
      <div class="keyboard__key">l</div>
      <div class="keyboard__key">m</div>
      <div class="keyboard__key">n</div>
      <div class="keyboard__key">p</div>
      <div class="keyboard__key">r</div>
      <div class="keyboard__key">ʧ</div>
    </div>
    <div>
      <div class="keyboard__key">s</div>
      <div class="keyboard__key">t</div>
      <div class="keyboard__key">u</div>
      <div class="keyboard__key">v</div>
      <div class="keyboard__key">w</div>
      <div class="keyboard__key">z</div>
      <div class="keyboard__key">[</div>
      <div class="keyboard__key space">_</div>
      <div class="keyboard__key">]</div>
      <div class="keyboard__key">ˌ</div>
      <div class="keyboard__key">ˈ</div>
      <div class="keyboard__key">:</div>
      <div class="keyboard__key">ː</div>
      <div class="keyboard__key space">←</div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["enterKey"],
  methods: {
    enterTranscription(event) {
      event.preventDefault();
      if (!event.target.classList.contains("keyboard__key")) return;
      let symbol = event.target.textContent;
      this.$emit("enterKey", symbol);
    },
  },
};
</script>

<style>
.keyboard {
  position: absolute;
  z-index: 2;
  top: 100%;
  left: -60%;
  background-color: #e7fcf5;
  margin: 20px auto auto auto;
  background: rgba(112, 110, 110, 0.452);
  display: flex;
  flex-direction: column;
  padding: 10px 10px 5px 15px;
}

.keyboard div {
  display: flex;
  margin-bottom: 5px;
}
.keyboard__key {
  background-color: white;
  width: 50px;
  height: 50px;
  margin-right: 5px;
  border-radius: 10px;
  font-size: 22px;
  cursor: pointer;
  align-items: center;
  border: 1px solid #034981;
  justify-content: center;
}
.keyboard__key:hover {
  border-color: #1b8ce9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 174, 233, 0.836);
}
.keyboard__key.space {
  width: 105px;
}
</style>
