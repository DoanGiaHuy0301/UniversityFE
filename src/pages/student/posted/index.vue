<template>
  <div style="padding-bottom: 50px">
    <div v-if="isLoading"><Loading /></div>
    <div v-else>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="table-title">
              <th>{{ $t("message.name-post") }}</th>
              <th>{{ $t("message.content") }}</th>
              <th>{{ $t("message.time-post") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in listPost" :key="p.id">
              <td>
                <router-link
                  :to="'/student/detailForum/' + p.id"
                  class="post-link"
                >
                  {{ p.title }}
                </router-link>
                <div
                  v-if="isEditMode && editedPost && editedPost.id === p.id"
                  style="margin: 10px"
                >
                  <textarea
                    class="form-control"
                    rows="2"
                    id="comment"
                    name="text"
                    :placeholder="p.content"
                    v-model="content"
                  ></textarea>
                  <div class="post-update-and-delete">
                    <ul>
                      <li @click="updatePosted(p.id)" class="mr-3">
                        {{ $t("message.save") }}
                      </li>
                      <li @click="exitHandleEdit">{{ $t("message.exit") }}</li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <div class="post-update-and-delete">
                    <ul>
                      <li @click="handleEdit(p)" class="mr-3">
                        {{ $t("message.edit") }}
                      </li>
                      <li @click="confirmDelete(p.id)">
                        {{ $t("message.delete") }}
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
              <td>{{ p.content }}</td>
              <td>{{ formatDate(p.postTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { authApi, endpoints } from "@/configs/Apis";
import { mapGetters } from "vuex";
import Loading from "../../../components/Loading.vue";

export default {
  computed: {
    ...mapGetters(["isAuth", "getUser"]),
  },
  components: {
    Loading,
  },
  data() {
    return {
      listPost: [],
      isEditMode: false,
      content: "",
      editedPost: null,
      isLoading: false,
    };
  },
  created() {
    this.isLoading = true;
    this.getListPostByUser().then(() => (this.isLoading = false));
    this.deletePost();
  },

  methods: {
    handleEdit(post) {
      if (!this.isEditMode) {
        this.isEditMode = true;
        this.content = post.content;
        this.editedPost = post;
      } else {
        this.isEditMode = false;
        this.editedPost = null;
      }
    },
    exitHandleEdit() {
      this.isEditMode = false;
      this.editedPost = null;
    },
    async getListPostByUser() {
      try {
        this.isLoading = true;
        const userId = this.getUser.id;
        const response = await authApi().get(
          endpoints["get-list-post-by-userId"].replace("{userId}", userId)
        );
        this.listPost = response.data;
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.listPost = [];
        this.isLoading = false;
      }
    },

    async updatePosted(postId) {
      try {
        const response = await authApi().put(
          endpoints["update-post"].replace("{postId}", postId),
          {
            content: this.content,
          }
        );
        const updatedPostIndex = this.listPost.findIndex(
          (post) => post.id === postId
        );

        // Nếu tìm thấy bài viết, cập nhật nội dung của nó
        if (updatedPostIndex !== -1) {
          this.listPost[updatedPostIndex].content = response.data.content;
        }
        this.content = "";
        this.isEditMode = false;
        this.getListPostByUser();
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    async deletePost(postId) {
      try {
        const response = await authApi().delete(
          endpoints["delete-post"].replace("{postId}", postId)
        );

        this.getListPostByUser();
        this.isEditMode = false;
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    async confirmDelete(postId) {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa bài đăng này không?"
      );
      if (confirmDelete) {
        await this.deletePost(postId);
      }
    },

    formatDate(date) {
      if (!date) return ""; // Tránh xử lý ngày null hoặc undefined

      // Chuyển đối đối tượng ngày sang ngày
      const formattedDate = new Date(date);

      // Lấy thông tin về ngày, tháng và năm
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
      const year = formattedDate.getFullYear();

      // Định dạng thành chuỗi "ngày/tháng/năm"
      return `${day}/${month}/${year}`;
    },
  },
};
</script>

<style scoped>
.table-title th {
  background: #070758;
  color: #fff;
}
</style>
