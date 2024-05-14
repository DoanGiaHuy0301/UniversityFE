<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    style="min-height: 81vh"
  >
    <a-menu-item key="student-score" @click="hideMenu">
      <router-link :to="{ name: 'student-score' }" class="router-link-hover">
        <i class="fa-solid fa-paintbrush"></i>
        <span class="sider"> {{ $t("message.score") }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="student-forum" @click="hideMenu">
      <router-link :to="{ name: 'student-forum' }" class="router-link-hover">
        <i class="fa-solid fa-book"></i>
        <span class="sider"> {{ $t("message.forum") }} </span>
      </router-link>
    </a-menu-item>

    <a-menu-item key="student-chat" @click="hideMenu">
      <router-link :to="{ name: 'student-chat' }" class="router-link-hover">
        <i class="fa-brands fa-rocketchat"></i>
        <span class="sider"> {{ $t("message.chat") }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="student-course" @click="hideMenu">
      <router-link :to="{ name: 'student-course' }" class="router-link-hover">
        <i class="fa-solid fa-book-open-reader"></i>
        <span class="sider">{{ $t("message.register-for-subject") }}</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="student-payment" @click="hideMenu">
      <router-link :to="{ name: 'student-payment' }" class="router-link-hover">
        <i class="fa-solid fa-book-open-reader"></i>
        <span class="sider"> {{ $t('message.tuition-fee') }} </span>
      </router-link> </a-menu-item
    ><a-menu-item>
      <div class="menu_profile">
        <router-link to="/profile" class="router-link-hover">
          <i class="fa-solid fa-user"></i>
          <span class="sider" style="font-size: 16px"> {{ $t('message.profile') }} </span>
        </router-link>
      </div>
    </a-menu-item>
  </a-menu>
</template>

<script>
import { storeToRefs } from "pinia";
import { useMenu } from "../stores/use-menu.js";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    const store = useMenu();
    return {
      ...storeToRefs(store),
    };
  },
  props: {
    isChecked: Boolean,
  },
  methods: {
    hideMenu() {
      this.$emit("update:isChecked", false);
    },
  },
});
</script>
