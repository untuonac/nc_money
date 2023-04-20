<template>
  <router-view
    v-if="sidebarVisible"
    name="sidebar"
    class="min-w-[400px]"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    computed: {
      sidebarVisible() {
        return this.$route.meta?.showSidebar;
      }
    }
  });
</script>
