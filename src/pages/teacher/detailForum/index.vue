<template>
  <div class="container-fluid" style="padding: 0 0 100px 0">
    <div class="row">
      <div
        className="container"
        style="border: 1px solid #dee2e6; border-radius: 10px; padding: 10px"
      >
        <div class="row" style="padding: 20px 10px">
          <div class="col-8">
            <p class="postDetail">
              <strong>{{ $t('message.title') }}: {{ post.title }}</strong>
            </p>
            <p style="font-size: 18px">{{ $t('message.content') }}: {{ post.content }}</p>
          </div>
          <div class="col-4" style="display: flex; justify-content: center">
            <p class="userDetail">
              <span style="font-size: 15px; display: block">
                {{ $t('message.post-by') }}: {{ usernameHost }}
              </span>
              <span style="font-size: 15px; display: block">
                {{ $t('message.time') }}: {{ formatDate(post.postTime) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="post-container" style="margin-top: 30px">
        <label for="comment">{{ $t('message.comment') }}:</label>
        <textarea
          class="form-control"
          rows="5"
          id="comment"
          name="text"
          :placeholder="$t('message.comment')"
          v-model="content"
        ></textarea>
        <Button
          class="btn-title btn btn-primary btn-submit-comment"
          @click="addComment"
          >{{ $t('message.send') }}</Button
        >
      </div>
    </div>
    <hr />
    <h4>{{ $t('message.comment') }}</h4>
    <div v-if="!comment || comment.length === 0">
      <p>{{ $t('message.no-comment') }}</p>
    </div>
    <div v-else>
      <div v-for="p in comment" :key="p.id" class="post-container-detail">
        <div class="post-row">
          <p class="postDetail">
            <strong
              >{{ p.userId.username }} - {{ formatDate(p.dateCreated) }}</strong
            >
          </p>
          <p>{{ $t('message.content') }}: {{ p.content }}</p>
          <div
            v-if="
              isEditMode &&
              editedPost &&
              editedPost.id === p.id &&
              getUser.id === p.userId.id
            "
          >
            <textarea
              class="form-control"
              rows="2"
              id="comment"
              name="text"
              :placeholder="p.content"
              v-model="content_comment"
            ></textarea>
            <div class="post-update-and-delete">
              <ul>
                <li @click="updateComment(p.id)" class="mr-3">{{ $t('message.save') }}</li>
                <li @click="exitHandleEdit">{{ $t('message.exit') }}</li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div
              class="post-update-and-delete"
              v-if="getUser.id === p.userId.id"
            >
              <ul>
                <li @click="handleEdit(p)">{{ $t('message.edit') }}</li>
                <li @click="confirmDelete(p.id)">{{ $t('message.delete') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Apis, { authApi, endpoints } from "@/configs/Apis";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isAuth", "getUser"]),
  },
  data() {
    return {
      user: null,
      usernameHost: null,
      postId: null,
      post: "",
      comment: null,
      content: "",
      content_comment: "",
      isEditMode: false,
      editedPost: null,
    };
  },
  created() {
    this.loadUser();
  },
  mounted() {
    this.postId = this.$route.params.id;

    this.loadProduct();
    this.loadComment();
  },
  methods: {
    handleEdit(post) {
      if (!this.isEditMode) {
        this.isEditMode = true;
        this.content_comment = post.content;
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
    async loadProduct() {
      const { data } = await authApi().get(endpoints.details(this.postId));
      this.post = data;
      this.loadUser();
    },
    async loadUser() {
      if (this.post && this.post.userId && this.post.userId.id) {
        const userInfo = await authApi().get(
          endpoints["user-id"].replace("{id}", this.post.userId.id)
        );
        this.usernameHost = userInfo.data.username;
      }
    },
    async loadComment() {
      const { data } = await authApi().get(
        endpoints.comments.replace("{id}", this.postId)
      );
      this.comment = data;
    },
    async addComment() {
      const { data } = await authApi().post(endpoints["add-comment"], {
        content: this.content,
        postId: this.post,
      });
      this.comment.push(data);
      this.content = "";
    },
    async updateComment(commentId) {
      try {
        const response = await authApi().put(
          endpoints["update-comment"].replace("{commentId}", commentId),
          {
            content: this.content_comment,
          }
        );

        this.content = "";
        this.isEditMode = false;
        this.loadComment();
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    async deleteComment(commentId) {
      try {
        const response = await authApi().delete(
          endpoints["delete-comment"].replace("{commentId}", commentId)
        );

        this.isEditMode = false;
        this.loadComment();
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    async confirmDelete(commentId) {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa bình luận này không?"
      );
      if (confirmDelete) {
        await this.deleteComment(commentId);
      }
    },
    formatDate(date) {
      if (!date) return "";

      const formattedDate = new Date(date);

      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1;
      const year = formattedDate.getFullYear();

      return `${day}/${month}/${year}`;
    },
  },
};
</script>



