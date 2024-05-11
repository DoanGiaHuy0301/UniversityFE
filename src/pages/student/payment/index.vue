<template>
  <section>
    <div class="container">
      <div class="container-spinner" v-if="isLoading">
        <div class="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <select
        class="form-control form-width"
        id="selectSemester"
        v-model="selectSemester"
        style="width: 40%"
      >
        <option value="">Tổng hợp học phí tất cả học kỳ</option>
        <option
          v-for="(semester, index) in listTuitionFee"
          :key="index"
          :value="semester.semesterId.id"
        >
          {{ semester.semesterId.name }} - Năm học:
          {{ semester.semesterId.schoolYear }}
        </option>
      </select>
      <div v-if="isTuitionFeeSuccess" class="table-container">
        <table class="table" style="width: 100%">
          <thead>
            <tr class="table-title">
              <th scope="col" class="text-center" style="width: 5%">STT</th>
              <th scope="col" class="text-center" style="width: 25%">
                Niên học học kỳ
              </th>
              <th scope="col" class="text-center" style="width: 20%">
                Học phí phải thu
              </th>
              <th scope="col" class="text-center" style="width: 20%">
                Học phí đã thu
              </th>
              <th scope="col" class="text-center" style="width: 15%">Còn nợ</th>
              <th style="width: 15%"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-title-item">
              <th colspan="6">Thu học phí</th>
            </tr>
            <tr v-for="(tuitionFee, index) in listTuitionFee" :key="index">
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
                {{ tuitionFee.semesterId.name }} - Năm học
                {{ tuitionFee.semesterId.schoolYear }}
              </td>
              <td style="width: 20%; vertical-align: middle" class="text-end">
                <div v-if="!tuitionFee.done">
                  {{ formattedCurrency(tuitionFee.tuitionFee) }}
                </div>
                <div v-else>{{ formattedCurrency(0) }}</div>
              </td>
              <td style="width: 20%; vertical-align: middle" class="text-end">
                <div v-if="tuitionFee.done">
                  {{ formattedCurrency(tuitionFee.tuitionFee) }}
                </div>
                <div v-else>{{ formattedCurrency(0) }}</div>
              </td>
              <td style="width: 15%; vertical-align: middle" class="text-end">
                {{ formattedCurrency(0) }}
              </td>
              <td style="width: 15%">
                <button
                  class="button"
                  v-if="!tuitionFee.done"
                  @click="submitTuitionFee(tuitionFee.id)"
                >
                  <p>Thanh toán</p>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="isSubjectTuitionFeeSuccess">
        <table class="table">
          <thead>
            <tr class="table-title">
              <th scope="col" class="text-center" style="width: 5%">STT</th>
              <th scope="col" class="text-center" style="width: 25%">
                Mã môn học
              </th>
              <th scope="col" class="text-center" style="width: 20%">
                Tên môn học
              </th>
              <th scope="col" class="text-center" style="width: 20%">
                Số tín chỉ
              </th>
              <th scope="col" class="text-center" style="width: 15%">
                Số tiền
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
                {{ subjectTuitionFee.subjectId }}
              </td>
              <td style="width: 20%; vertical-align: middle" class="text-end">
                {{ subjectTuitionFee.name }}
              </td>
              <td style="width: 20%; vertical-align: middle" class="text-end">
                {{ subjectTuitionFee.credit }}
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
      isTuitionFeeSuccess: false,
      isSubjectTuitionFeeSuccess: false,
      selectSemester: "",
      listTuitionFee: [],
      listSubjectTuitionFee: [],
      semesters: [],
      errorMessage: "",
      isLoading: false,
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
        const studentId = this.getUser.username;
        console.log(studentId);
        const res = await authApi().get(
          endpoints["get-tuition-fee"] + `?studentId=${studentId}`
        );
        console.log("tuition fee:", res.data);
        this.listTuitionFee = res.data;
        this.isTuitionFeeSuccess = true;
      } catch (e) {
        console.log(e.error);
      }
    },
    async submitTuitionFee(tuitionFeeId) {
      try {
        this.isLoading = true;
        const res = await Apis.post(
          endpoints["payment"] + `?tuitionFeeId=${tuitionFeeId}`
        );

        if (res.data) {
          // Lấy token từ phản hồi
          const paymentToken = res.data;

          // Chuyển hướng người dùng đến trang PayPal
          window.location.href = paymentToken;
        } else {
          console.error("Invalid payment token received.");
        }
        this.isLoading = false;
      } catch (e) {
        (this.errorMessage = "lỗi server"), console.log(e.error);
      }
    },
    async getListSemester() {
      try {
        const studentId = this.getUser.username;
        const res = await Apis.get(
          endpoints["get-semesters"] + `?studentId=${studentId}`
        );
        this.semesters = res.data;
        console.log("semesters: ", this.semesters);
      } catch (error) {
        console.log(error);
      }
    },
    async getSubjectTuitionFee() {
      try {
        const studentId = this.getUser.username;
        const semesterId = this.selectSemester;
        const res = await authApi().get(
          endpoints["get-subjects-tuition-fee"] +
            `?studentId=${studentId}&semesterId=${semesterId}`
        );
        this.listSubjectTuitionFee = res.data;
        this.isSubjectTuitionFeeSuccess = true;
        console.log("getSubjectTuitionFee: ", res.status);
      } catch (error) {
        this.listSubjectTuitionFee = [];
      }
    },
  },
  async created() {
    await this.getListSemester();
    await this.getTuitionFee();
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

.button {
  all: unset;
  display: flex;
  align-items: center;
  position: relative;
  padding: 4px 20px;
  border: #070758 solid 0.15em;
  border-radius: 0.25em;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: border 300ms, color 300ms;
  user-select: none;
  margin: auto;
}

.button p {
  z-index: 1;
  margin: 0;
  padding: 0;
}

.button:hover {
  color: #fff;
}

.button:active {
  border-color: #070758;
}

.button::after,
.button::before {
  content: "";
  position: absolute;
  width: 9em;
  aspect-ratio: 1;
  background: #070758;
  opacity: 50%;
  border-radius: 50%;
  transition: transform 500ms, background 300ms;
}

.button::before {
  left: 0;
  transform: translateX(-8em);
}

.button::after {
  right: 0;
  transform: translateX(8em);
}

.button:hover:before {
  transform: translateX(-1em);
}

.button:hover:after {
  transform: translateX(1em);
}

.button:active:before,
.button:active:after {
  background: teal;
}

.container-spinner {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.spinner {
  width: 70.4px;
  height: 70.4px;
  --clr: rgb(7, 7, 88);
  --clr-alpha: rgb(7, 7, 88, 0.1);
  animation: spinner 1.6s infinite ease;
  transform-style: preserve-3d;
}

.spinner > div {
  background-color: var(--clr-alpha);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 3.5px solid var(--clr);
}

.spinner div:nth-of-type(1) {
  transform: translateZ(-35.2px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
  transform: translateZ(35.2px);
}

@keyframes spinner {
  0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
  }

  50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
  }

  100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
  }
}

@media (max-width: 768px) {
  .form-width {
    width: 100% !important;
  }
}
</style>
