<template>
  <routerView></routerView>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      language: "vi",
      mouseX: 0,
      mouseY: 0,
      timeOut: 60 * 60 * 1000,
      isCheck: true,
      timeoutId: null,
    };
  },
  methods: {
    ...mapActions(["checkToken", "logout"]),
    handleMouseMove(event) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    },
    setCheckTokenTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // clear the previous timeout
      }
      this.timeoutId = setTimeout(() => {
        this.checkToken();
        this.$store.dispatch("logout");
        this.$router.push("/login");
        localStorage.clear();
        localStorage.setItem("selectedLanguage", this.language);
      }, this.timeOut);
    },
    checkToken() {
      this.setCheckTokenTimeout();
    },
  },
  created() {
    // Set initial token check timeout
    if (this.isCheck) {
      this.setCheckTokenTimeout();
    }
    document.addEventListener("mousemove", this.handleMouseMove);
  },
  watch: {
    mouseX(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isCheck = false;
        this.setCheckTokenTimeout(); 
      }
    },
    mouseY(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isCheck = false;
        this.setCheckTokenTimeout(); 
      }
    },
  },
};
</script>
