<template>
  <div v-if="isLoading"><Loading /></div>
  <div class="container-fluid" style="padding-bottom: 50px">
    <div class="row">
      <div class="col-12 d-flex justify-content-end">
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            :placeholder="$t('message.search')"
            v-model="searchKeyword"
          />
          <button
            class="btn btn-primary"
            style="width: 150px"
            @click="handleSearch"
          >
            {{ $t("message.search") }}
          </button>
        </form>
      </div>

      <div class="post-container" v-if="isEditMode">
        <label for="comment">{{ $t('message.title') }}:</label>
        <textarea
          class="form-control mb-3"
          rows="1"
          id="comment"
          name="text"
          :placeholder="$t('message.input-title')"
          v-model="title"
        ></textarea>
        <div v-if="isBadWordsTitle" style="font-size: 16px; color: red;">Có từ bị cấm trong tiêu đề</div>
        <div v-else></div>
        <label for="comment">{{ $t('message.content') }}:</label>
        <textarea
          class="form-control mb-3"
          rows="5"
          id="comment"
          name="text"
          :placeholder="$t('message.input-content')"
          v-model="content"
        ></textarea>
        <div v-if="isBadWordsContent" style="font-size: 16px; color: red;">Có từ bị cấm trong nội dung</div>
        <div v-else></div>
        <div style="display: flex">
          <button
            style="display: inline-block"
            class="btn-title btn btn-primary"
            @click="handlePostSubmit"
          >
          {{ $t('message.post') }}
          </button>
          <button
            style="display: inline-block"
            class="btn-title btn btn-primary"
            @click="exitHandleEdit"
          >
          {{ $t('message.exit') }}
          </button>
        </div>
      </div>
      <div class="col-12 post-container d-flex" v-else>
        <Button class="btn-title btn btn-primary" @click="handleEdit"
          >{{ $t('message.post') }}</Button
        >
        <Button class="btn-title btn btn-primary"
          ><router-link
            class="post-link"
            to="/teacher/posted/"
            style="color: #fff"
            >{{ $t('message.posted') }}</router-link
          ></Button
        >
      </div>

      <div class="foroum table-container">
        <table class="table table-responsive-xl" v-if="post.length > 0">
          <thead>
            <tr>
              <th>{{ $t('message.name-post') }}</th>
              <th>{{ $t('message.person-post') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in currentPosts" :key="p.id">
              <td style="width: 60%">
                <router-link
                  :to="'/teacher/detailForum/' + p.id"
                  class="post-link"
                >
                  {{ p.title }}
                </router-link>
              </td>
              <td class="d-flex align-items-center">
                <div
                  class="img"
                  :style="{
                    'background-image': `url('${p.userId.avatar}')`,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                  }"
                ></div>

                <div class="email">
                  <span>
                    {{ p.userId.username }}
                  </span>
                  <span>{{ $t('message.time') }}: {{ formatDate(p.postTime) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="pagination">
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            @click="previousPage"
            :disabled="currentPage === 1"
            >Previous</a
          >
        </li>
        <li
          class="page-item"
          v-for="pageNumber in pageNumbers"
          :key="pageNumber"
        >
          <a
            class="page-link"
            href="#"
            @click="setCurrentPage(pageNumber)"
            :class="{ active: currentPage === pageNumber }"
            >{{ pageNumber }}</a
          >
        </li>
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            @click="nextPage"
            :disabled="currentPage === pageNumbers.length"
            >Next</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Apis, { authApi, endpoints } from "@/configs/Apis.js";
import { useMenu } from "../../../stores/use-menu.js";
import { mapGetters } from "vuex";
import Loading from "../../../components/Loading.vue";
import Filter from "bad-words";
export default {
  setup() {
    useMenu().onSelectedKeys(["teacher-forum"]);
  },
  computed: {
    ...mapGetters(["isAuth", "getUser"]),
  },
  components: {
    Loading,
  },
  data() {
    return {
      isEditMode: false,
      post: [],
      title: "",
      content: "",
      currentPage: 1,
      postsPerPage: 4,
      searchKeyword: "",
      isLoading: false,
      isBadWordsTitle: false,
      isBadWordsContent: false,
    };
  },
  computed: {
    indexOfLastPost() {
      return this.currentPage * this.postsPerPage;
    },
    indexOfFirstPost() {
      return this.indexOfLastPost - this.postsPerPage;
    },
    currentPosts() {
      return this.post
        .filter(
          (p) =>
            p.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            p.content.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
        .slice(this.indexOfFirstPost, this.indexOfLastPost);
    },
    pageNumbers() {
      const pageNumbers = [];
      for (
        let i = 1;
        i <= Math.ceil(this.post.length / this.postsPerPage);
        i++
      ) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    },
  },
  created() {
    this.isLoading = true;
    this.loadPost().then(() => {
      this.isLoading = false;
    });
  },
  methods: {
    handleEdit() {
      this.isEditMode = true;
    },
    exitHandleEdit() {
      this.isEditMode = false;
    },
    async loadPost() {
      try {
        const response = await authApi().get(endpoints["posts"], {
          params: { kw: this.searchKeyword },
        });
        this.post = response.data;
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    },
    handleSearch() {
      this.loadPost();
    },
    async handlePostSubmit() {
      try {
        const badWordsList = "Rấttệ";
        const filter = new Filter({
          list: [...badWordsList],
          exclude: [], 
          splitRegex: /\b/,
          placeHolder: "*",
          regex: /[^a-zA-Z0-9|\$|\@]|\^/g,
          replaceRegex: /\w/g,
        });
        if (filter.isProfane(this.title)) {
          this.isBadWordsTitle = true;
          // console.log("this.isBadWordsContent",  this.isBadWordsTitle)
          // alert("Your comment contains inappropriate language.");
          return;
        } else if(filter.isProfane(this.content)) {
          this.isBadWordsTitle = false;
          this.isBadWordsContent = true;
          // console.log("this.isBadWordsContent",  this.isBadWordsTitle)
          // console.log("this.isBadWordsContent", this.isBadWordsContent)
          return;
        } else {
          this.isBadWordsTitle = false;
          this.isBadWordsContent = false;
          const response = await authApi().post(endpoints["add-post"], {
            title: this.title,
            content: this.content,
          });
          this.post.unshift(response.data);
          this.title = "";
          this.content = "";
        }
        
        this.isEditMode = false;
      } catch (error) {
        console.error("Error submitting post:", error);
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
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageNumbers.length) {
        this.currentPage++;
      }
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
  },
  watch: {
    searchKeyword: "loadPost",
  },
};
</script>
