<template>
  <TheHeader />
  <slot></slot>
  <ScrollToTop/>
  <TheFooter />
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import TheFooter from "../components/TheFooter.vue";
import TheMenuHome from "../components/TheMenuHome.vue";
import ScrollToTop from "../components/ScrollToTop.vue";

export default {
  components: {
    TheHeader,
    TheFooter,
    TheMenuHome,
    ScrollToTop,
  },
};
</script>

