<template>
  <TheHeader />
  <ScrollToTop/>
  <div id="parent">
    <div class="container">
      <h2 class="title_content">{{ $t('message.parent') }}</h2>
      <form
        class="formParent"
        method="get"
        @submit.prevent="getStudentByParent"
      >
        <div class="row">
          <div class="col-lg col-sm-block mb-3">
            <label>{{ $t('message.student-id') }}</label>
            <input
              v-model="student.studentId"
              type="text"
              class="form-control"
              :placeholder="$t('message.student-id')"
              required
            />
          </div>
          <div class="col-lg col-sm-block mb-3">
            <label>{{ $t('message.fullname') }}</label>
            <input
              v-model="student.studentName"
              type="text"
              class="form-control"
              :placeholder="$t('message.fullname')"
              required
            />
          </div>
          <div class="col-lg col-sm-block mb-3">
            <label>{{ $t('message.date-of-birth') }}</label>
            <input
              v-model="student.studentBirthday"
              type="date"
              class="form-control"
              :placeholder="$t('message.date-of-birth')"
              required
            />
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-lg col-sm-block mb-3">
            <label>{{ $t('message.class-code') }}</label>
            <input
              v-model="student.classId"
              type="text"
              class="form-control"
              :placeholder="$t('message.class-code')"
              required
            />
          </div>
          <div class="col-lg col-sm-block mb-3">
            <label>{{ $t('message.CCCD') }}</label>
            <input
              v-model="student.studentIdentification"
              type="text"
              class="form-control"
              :placeholder="$t('message.CCCD')"
              required
            />
          </div>
          <div class="col col-sm-block mb-3">
            <!-- <input type="text" class="form-control" placeholder="Last name" /> -->
          </div>
        </div>
        <div class="btn-search">
          <input
            type="submit"
            :value="$t('message.find')"
            class="btn btn-block btn-primary"
            :disabled="loading"
            style="max-width: 100px"
          />
        </div>
      </form>
      <table class="table" v-if="isSearch">
        <thead>
          <tr>
            <th scope="col">MSSV</th>
            <th scope="col">{{ $t('message.fullname') }}</th>
            <th scope="col">{{ $t('message.date-of-birth') }}</th>
            <th scope="col">{{ $t('message.CCCD') }}</th>
            <th scope="col">{{ $t('message.score') }}</th>
            <th scope="col">{{ $t('message.tuition-fee') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ studentList.id }}</td>
            <td>{{ studentList.name }}</td>
            <td>{{ studentList.birthday }}</td>
            <td>{{ studentList.identification }}</td>
            <td>
              <router-link :to="`/parent/scoreStudent/${studentList.id}`"
                >{{ $t('message.score') }}</router-link
              >
            </td>
            <td>
              <router-link :to="`/parent/payment/${studentList.id}`"
                >{{ $t('message.tuition-fee') }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="errorMessage && !isSearch">{{ errorMessage }}</p>
    </div>
  </div>
  <TheFooter />
</template>
<script>
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";
import Apis, { endpoints } from "@/configs/Apis";
import ScrollToTop from "../components/ScrollToTop.vue";
import student from "@/routers/student";

export default {
  components: {
    TheFooter,
    TheHeader,
    ScrollToTop,
  },
  data() {
    return {
      student: {
        studentId: "",
        studentName: "",
        studentBirthday: "",
        classId: "",
        studentIdentification: "",
      },
      studentList: [],
      errorMessage: "",
      isSearch: false,
    };
  },
  created() {},
  methods: {
    async getStudentByParent() {
      try {
        const response = await Apis.get(
          endpoints["get-student-by-parents"] +
            `?studentId=${this.student.studentId}&studentName=${this.student.studentName}&studentBirthday=${this.student.studentBirthday}&classId=${this.student.classId}&studentIdentification=${this.student.studentIdentification}`
        );
        this.studentList = response.data;
        this.isSearch = true;
      } catch (e) {
        this.errorMessage = "Không tìm thấy sinh viên";
        this.isSearch = false;
      }
    },
    // handleSubmitSearch() {
    //   this.getStudentBuParent();
    // },
  },
};
</script>
<style scoped>
#parent {
  position: relative;
  width: 100%;
  min-height: 60.7vh;
  margin-top: 50px;
  margin-bottom: 50px;
  box-sizing: border-box !important;
}

.container {
  /* position: relative; */
  width: 1200px;
  min-height: 400px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: -1px -1px 20px 4px rgba(234, 234, 234, 1);
  -webkit-box-shadow: -1px -1px 20px 4px rgba(234, 234, 234, 1);
  -moz-box-shadow: -1px -1px 20px 4px rgba(234, 234, 234, 1);
}

.btn-search {
  max-width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.title_content {
  margin-bottom: 30px;
  text-align: center;
  font-size: 32px;
  color: #dfb36f;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 10px;
}

.title_content::after {
  content: "";
  width: 190px;
  height: 1px;
  background: #dfb36f;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

@media (max-width: 767px) {
  .title_content {
    font-size: 20px !important;
    margin-bottom: 15px !important;
  }

  .container {
    width: 100%;
  }
}
</style>
