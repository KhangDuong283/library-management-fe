<template>
  <div>
    <div class="max-h-20">
      <Header> </Header>
    </div>
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "HomePage",
  components: {
    Header,
  },
};
</script>
