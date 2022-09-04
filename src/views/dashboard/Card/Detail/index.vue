<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg t="1662167372316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8335" width="15" height="15"><path d="M512 148.48c201.728 0 366.08 164.352 366.08 366.08S713.728 880.64 512 880.64 145.92 716.8 145.92 514.56 310.272 148.48 512 148.48M512 89.6c-234.496 0-424.96 190.464-424.96 424.96 0 234.496 189.952 424.96 424.96 424.96 234.496 0 424.96-190.464 424.96-424.96C936.96 280.064 746.496 89.6 512 89.6L512 89.6z" p-id="8336" /><path d="M512 762.88c-16.384 0-29.184-13.312-29.184-29.184L482.816 470.016c0-16.384 13.312-29.184 29.184-29.184s29.184 13.312 29.184 29.184l0 263.68C541.184 749.568 528.384 762.88 512 762.88z" p-id="8337" /><path d="M512 396.8c-16.384 0-29.184-13.312-29.184-29.184L482.816 308.736c0-16.384 13.312-29.184 29.184-29.184s29.184 13.312 29.184 29.184l0 58.368C541.184 383.488 528.384 396.8 512 396.8z" p-id="8338" /></svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>

  </div>
</template>

<script>
export default {
  name: '',
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header{
  display:flex;
  justify-content: space-between;
  color:#d9d9d9;
}
.card-content{
  font-size: 30px;
  padding:10px 0px;
}
.el-charts{
  height:50px;
}
.card-footer{
  border-top:1px solid #eee;
  margin-top:5px;
  padding-top:10px;
}
</style>
