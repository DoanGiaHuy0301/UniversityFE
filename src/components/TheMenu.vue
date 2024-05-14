<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    style="min-height: 81vh;"
  >
    <a-menu-item key="teacher-studentScore" @click="hideMenu">
      <router-link
        :to="{ name: 'teacher-studentScore' }"
        class="router-link-hover"
      >
        <i class="fa-solid fa-pen"></i>
        <span class="sider"> {{ $t('message.input-score') }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="teacher-student" @click="hideMenu">
      <router-link :to="{ name: 'teacher-student' }" class="router-link-hover">
        <i class="fa-solid fa-users"></i>
        <span class="sider"> {{ $t('message.student') }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="teacher-forum" @click="hideMenu">
      <router-link :to="{ name: 'teacher-forum' }" class="router-link-hover">
        <i class="fa-solid fa-book"></i>
        <span class="sider"> {{ $t('message.forum') }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="teacher-chat" @click="hideMenu">
      <router-link :to="{ name: 'teacher-chat' }" class="router-link-hover">
        <i class="fa-brands fa-rocketchat"></i>
        <span class="sider"> {{ $t('message.chat') }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="teacher-classStudent" @click="hideMenu">
      <router-link
        :to="{ name: 'teacher-classStudent' }"
        class="router-link-hover"
      >
        <i class="fa-solid fa-landmark"></i>
        <span class="sider"> {{ $t('message.homeroom-teacher') }} </span>
      </router-link>
    </a-menu-item>
    <a-menu-item>
      <div class="menu_profile">
        <router-link to="/profile" class="router-link-hover">
          <i class="fa-solid fa-user"></i>
          <span  class="sider" style="font-size: 16px"> {{ $t('message.profile') }} </span>
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
