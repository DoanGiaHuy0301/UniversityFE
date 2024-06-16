<template>
  <Home>
    <section>
      <div class="container container-fluid mb-4 mt-4">
        <h2 class="title_content">{{ $t("message.student-fee") }}</h2>
        <select
          class="form-control form-width"
          id="selectSemester"
          v-model="selectSemester"
          style="width: 40%"
        >
          <option value="">{{ $t("message.total-tuition-fee") }}</option>
          <option
            v-for="(semester, index) in semesters"
            :key="index"
            :value="semester.id"
          >
            {{ semester.name }} - {{ $t("message.school-year") }}:
            {{ semester.schoolYear }}
          </option>
        </select>
        <div v-if="isTuitionFeeSuccess">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr class="table-title">
                  <th scope="col" class="text-center" style="width: 5%">STT</th>
                  <th scope="col" class="text-center" style="width: 25%">
                    {{ $t("message.semester-year") }}
                  </th>
                  <th scope="col" class="text-center" style="width: 20%">
                    {{ $t("message.tuition-fees-receivable") }}
                  </th>
                  <th scope="col" class="text-center" style="width: 20%">
                    {{ $t("message.collected-tuition-fees") }}
                  </th>
                  <th scope="col" class="text-center" style="width: 15%">
                    {{ $t('message.still-in-debt') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="table-title-item">
                  <th colspan="6">{{ $t("message.collect-tuition-fees") }}</th>
                </tr>
                <tr v-for="(tuitionFee, index) in listTuitionFee" :key="index">
                  <th
                    scope="row"
                    style="
                      width: 5%;
                      text-align: center;
                      vertical-align: middle;
                    "
                  >
                    {{ index + 1 }}
                  </th>
                  <td
                    style="width: 25%; vertical-align: middle"
                    class="text-center"
                  >
                    {{ tuitionFee.semesterId.name }} -
                    {{ $t("message.school-year") }}
                    {{ tuitionFee.semesterId.schoolYear }}
                  </td>
                  <td
                    style="width: 20%; vertical-align: middle"
                    class="text-end"
                  >
                    <div v-if="!tuitionFee.done">
                      {{ formattedCurrency(tuitionFee.tuitionFee) }}
                    </div>
                    <div v-else>{{ formattedCurrency(0) }}</div>
                  </td>
                  <td
                    style="width: 20%; vertical-align: middle"
                    class="text-end"
                  >
                    <div v-if="tuitionFee.done">
                      {{ formattedCurrency(tuitionFee.tuitionFee) }}
                    </div>
                    <div v-else>{{ formattedCurrency(0) }}</div>
                  </td>
                  <td
                    style="width: 15%; vertical-align: middle"
                    class="text-end"
                  >
                    {{ formattedCurrency(0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="isSubjectTuitionFeeSuccess">
          <table class="table">
            <thead>
              <tr class="table-title">
                <th scope="col" class="text-center" style="width: 5%">STT</th>
                <th scope="col" class="text-center" style="width: 25%">
                  {{ $t("message.code-of-subject") }}
                </th>
                <th scope="col" class="text-center" style="width: 20%">
                  {{ $t("message.name-of-subject") }}
                </th>
                <th scope="col" class="text-center" style="width: 20%">
                  {{ $t("message.credit") }}
                </th>
                <th scope="col" class="text-center" style="width: 15%">
                  {{ $t("message.fee") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(subjectTuitionFee, index) in listSubjectTuitionFee"
                :key="index"
              >
                <th
                  scope="row"
                  style="width: 5%; text-align: center; vertical-align: middle"
                >
                  {{ index + 1 }}
                </th>
                <td
                  style="width: 25%; vertical-align: middle"
                  class="text-center"
                >
                  {{ subjectTuitionFee.subjectId.id }}
                </td>
                <td style="width: 20%; vertical-align: middle" class="text-end">
                  {{ subjectTuitionFee.subjectId.name }}
                </td>
                <td style="width: 20%; vertical-align: middle" class="text-end">
                  {{ subjectTuitionFee.subjectId.credit }}
                </td>
                <td style="width: 15%; vertical-align: middle" class="text-end">
                  {{ subjectTuitionFee.price }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </Home>
</template>

<script>
import Apis, { endpoints } from "@/configs/Apis";
import Home from "../../../layouts/home.vue";
export default {
  components: {
    Home,
  },
  data() {
    return {
      isTuitionFeeSuccess: false,
      isSubjectTuitionFeeSuccess: false,
      selectSemester: "",
      listTuitionFee: [],
      listSubjectTuitionFee: [],
      semesters: [],
    };
  },
  watch: {
    selectSemester: async function (newSemester, oldSemester) {
      if (newSemester !== oldSemester) {
        if (newSemester === "") {
          await this.getTuitionFee();
          this.isSubjectTuitionFeeSuccess = false;
        } else {
          await this.getSubjectTuitionFee();
          this.isTuitionFeeSuccess = false;
        }
      }
    },
  },
  methods: {
    formatYear(year) {
      return new Date(year).getFullYear();
    },
    formattedCurrency(amount) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
    async getTuitionFee() {
      try {
        const studentId = this.$route.params.id;
        const res = await Apis.get(
          endpoints["get-tuition-fee"] + `?studentId=${studentId}`
        );
        this.listTuitionFee = res.data;
        this.isTuitionFeeSuccess = true;
      } catch (e) {
        console.log(e.error);
      }
    },
    async getListSemester() {
      try {
        const studentId = this.$route.params.id;
        const res = await Apis.get(
          endpoints["get-semesters"] + `?studentId=${studentId}`
        );
        this.semesters = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getSubjectTuitionFee() {
      try {
        const studentId = this.$route.params.id;
        const semesterId = this.selectSemester;
        const res = await Apis.get(
          endpoints["get-subjects-tuition-fee"] +
            `?studentId=${studentId}&semesterId=${semesterId}`
        );
        this.listSubjectTuitionFee = res.data;
        this.isSubjectTuitionFeeSuccess = true;
      } catch (error) {
        this.listSubjectTuitionFee = [];
      }
    },
  },
  created() {
    this.getListSemester();
    this.getTuitionFee();
  },
};
</script>

<style>
.table-title th {
  background: #070758;
  color: #fff;
}

.table-title-item th {
  background: rgba(7, 7, 88, 0.6);
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

  .form-width {
    width: 100% !important;
  }
}
</style>
