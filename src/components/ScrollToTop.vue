<template>
    <div class="btn-scroll">
      <div
        class="scrollup"
        style="--color: skyblue"
        v-if="showScrollTopButton"
        @click="scrollToTop"
      >
        <div class="chevrons">
          <div class="chevrondown"></div>
          <div class="chevrondown"></div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        showScrollTopButton: false,
      };
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
      handleScroll() {
        this.showScrollTopButton = window.pageYOffset > 100;
      },
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .btn-scroll {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99;
  }
  
  .scrollup {
    --color: white;
    --sizeX: 30px;
    --sizeY: 50px;
    position: relative;
    width: var(--sizeX);
    height: var(--sizeY);
    margin-left: var(--sizeX / 2);
    border: calc(var(--sizeX) / 10) solid var(--color);
    border-radius: 50px;
    box-sizing: border-box;
    margin-bottom: 16px;
    cursor: pointer;
  }
  
  .scrollup::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 50%;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    background-color: var(--color);
    border-radius: 100%;
    animation: scrollup-anim 2s infinite;
    box-sizing: border-box;
    box-shadow: 0px 5px 3px 1px #2a547066;
  }
  
  @keyframes scrollup-anim {
    0% {
      opacity: 0;
      height: 6px;
    }
  
    40% {
      opacity: 1;
      height: 10px;
    }
  
    80% {
      transform: translate(0, -20px); /* Thay đổi dấu trừ ở đây */
      height: 10px;
      opacity: 0;
    }
  
    100% {
      height: 3px;
      opacity: 0;
    }
  }
  
  .chevrons {
    padding: 6px 0 0 0;
    margin-left: -3px;
    margin-top: -20px;
    width: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .chevrondown {
    margin-top: -6px;
    position: relative;
    border: solid var(--color);
    border-width: 0 3px 3px 0;
    display: inline-block;
    width: 10px;
    height: 10px;
    transform: rotate(225deg); /* Thay đổi góc quay thành 45 độ */
  }
  
  .chevrondown:nth-child(even) {
    animation: pulse54012 500ms ease infinite alternate;
  }
  
  .chevrondown:nth-child(odd) {
    animation: pulse54012 500ms ease infinite alternate 250ms;
  }
  
  @keyframes pulse54012 {
    from {
      opacity: 0;
    }
  
    to {
      opacity: 0.5;
    }
  }
  </style>
  