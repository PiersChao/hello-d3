
<template>
  <div class="home">
    <div id="svgcontainer" ref="svgcontainer" />
  </div>
</template>

<script>
import Data from './data.json'
import { D3TreeForce } from './d3Graph'
const svgTree = new D3TreeForce()
export default {
  name: 'Home',
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.svgcontainer.appendChild(svgTree.drawTree(Data))
    })
  },
  methods: {

  }
}
</script>
<style lang="scss" >
.node {
  cursor: pointer;
  stroke: #3182bd;
  stroke-width: 1.5px;
}

.link {
  fill: none;
  stroke: #9ecae1;
  stroke-width: 1.5px;
}
</style>
