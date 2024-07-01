<template>
  <routerView></routerView>
</template>
<!-- <script>
import { mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      language: "vi",
      mouseX: 0,
      mouseY: 0,
      timeOut: 60 * 60 * 60 * 60,
      isCheck: true,
    };
  },
  methods: {
    ...mapActions(["checkToken"]),
    handleMouseMove(event) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    },
    checkToken() {
      setInterval(() => {
        this.checkToken();
        this.$router.push("/login");
        localStorage.clear();
        localStorage.setItem("selectedLanguage", this.language);
      }, this.timeOut);
    },
  },
  created() {
    // Kiểm tra token hết hạn mỗi phút
    if (this.isCheck) {
      this.checkToken();
    }
    document.addEventListener("mousemove", this.handleMouseMove);
  },
  watch: {
    mouseX(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isCheck = false;
        console.log("mouseX", this.mouseX);
      }
    },
    mouseY(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isCheck = false;
        console.log("mouseY", this.mouseY);
      }
    },
  },
};
</script> -->
