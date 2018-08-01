<template>
    <div class="root">
        <div class="header">
            <div class="module">
                <router-link id="logo" :to="{ name:'home'}">QuickMark</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
});
</script>

<style scoped src="./assets/style.css"></style>
<style>
.root {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 0.15rem;
  color: white;
  background-color: #51247a;
  font-weight: 100;
  position: sticky;
  top: 0;
}

.header > * {
  margin: 0.2rem;
}

#logo {
  font-size: 2em;
  font-weight: 100;
}

.module.nav {
  display: flex;
  align-items: center;
}
</style>