<template>
  <div v-if="isLoading"><Loading /></div>
  <div class="row">
    <div class="col-6">
      <strong style="font-size: 20px; padding: 10px 10px 0"
        >{{ $t("message.class") }}: {{ extractedId }}
      </strong>
    </div>
    <div class="col-6 d-flex justify-content-end">
      <form class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          :placeholder="$t('message.search')"
          v-model="searchKeyword"
        />
      </form>
    </div>
  </div>
  <div class="table col-12">
    <div class="table-container">
      <template v-if="studentList.length > 0">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr class="table-title">
              <th class="text-center">{{ $t("message.student-id") }}</th>
              <th class="text-center">{{ $t("message.fullname") }}</th>
              <th class="text-center">{{ $t("message.date-of-birth") }}</th>
              <th class="text-center">{{ $t("message.sex") }}</th>
              <th class="text-center">{{ $t("message.phone") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in currentStudentList" :key="student.id">
              <td style="text-align: center">{{ student.id }}</td>
              <td style="text-align: center">{{ student.name }}</td>
              <td style="text-align: center">
                {{ formatDate(student.birthday) }}
              </td>
              <td style="text-align: center">
                {{ student.gender === 1 ? "Nam" : "Nữ" }}
              </td>
              <td style="text-align: center">{{ student.phone }}</td>
            </tr>
          </tbody>
        </table>
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
      </template>
      <template v-else>
        <div class="text-hr-teacher">
          {{ $t("message.no-homeroom-teacher") }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { authApi, endpoints } from "@/configs/Apis.js";
import { mapGetters } from "vuex";
import { useMenu } from "@/stores/use-menu";
import Loading from "../../../components/Loading.vue";

export default {
  computed: {
    ...mapGetters(["isAuth", "getUser"]),
    extractedId() {
      if (this.studentList.length > 0 && this.studentList[0].classesId) {
        return this.studentList[0].classesId.id || "N/A";
      }
      return "...";
    },

    indexOfLastPost() {
      return this.currentPage * this.studentsPerPage;
    },
    indexOfFirstPost() {
      return this.indexOfLastPost - this.studentsPerPage;
    },
    currentStudentList() {
      return this.studentList
        .filter(
          (p) =>
            p.id.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            p.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
        .slice(this.indexOfFirstPost, this.indexOfLastPost);
    },
    pageNumbers() {
      const pageNumbers = [];
      for (
        let i = 1;
        i <= Math.ceil(this.studentList.length / this.studentsPerPage);
        i++
      ) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    },
  },
  data() {
    return {
      studentList: [],
      isLoading: false,
      currentPage: 1,
      studentsPerPage: 10,
      searchKeyword: "",
    };
  },
  components: {
    Loading,
  },
  created() {
    this.isLoading = true;
    this.getStudent().then(() => (this.isLoading = false));
  },
  methods: {
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
    async getStudent() {
      try {
        const lecturerUsername = this.getUser.username;
        const response = await authApi().get(
          endpoints["get-lecturer-by-username"].replace(
            "{username}",
            lecturerUsername
          )
        );

        const lecturerId = response.data.id;
        const listStudent = await authApi().get(
          endpoints["student-home-room-teacher"].replace(
            "{lecturerId}",
            lecturerId
          )
        );
        if (listStudent.data) {
          this.studentList = listStudent.data;
        }
      } catch (e) {
        console.log(e.error);
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

  setup() {
    useMenu().onSelectedKeys(["teacher-classStudent"]);
  },
};
</script>

<style scoped>
.table-title th {
  background: #070758;
  color: #fff;
}
</style>
