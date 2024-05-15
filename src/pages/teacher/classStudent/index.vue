<template>
  <div v-if="isLoading"><Loading /></div>
  <div>
    <strong style="font-size: 20px; padding: 10px"
      >{{ $t('message.class') }}: {{ extractedId }}
    </strong>
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
            <tr v-for="student in studentList" :key="student.id">
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
      </template>
      <template v-else>
        <div class="text-hr-teacher">{{ $t('message.no-homeroom-teacher') }}</div>
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
      return "N/A";
    },
  },
  data() {
    return {
      studentList: [],
      isLoading: false,
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
    async getStudent() {
      try {
        console.log(this.getUser.username);
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
        console.log("listStudent.data", listStudent.data);
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
