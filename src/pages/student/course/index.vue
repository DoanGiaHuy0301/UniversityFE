<template>
  <section>
    <div v-if="isLoading"><Loading /></div>
    <div class="d-lg-flex d-md-flex d-sm-block">
      <div class="form-group-item" style="width: 30%; margin-bottom: 20px">
        <div
          class="form-group"
          :class="{ 'has-error': !selectSemester }"
          style="margin-right: 10px"
        >
          <label for="selectSemester">{{ $t("message.semester") }}</label>
          <select
            class="form-control"
            id="selectSemester"
            :v-model="selectSemester"
            disabled
          >
            <option :key="index" :value="semesters.id">
              {{ semesters.name }} - {{ $t("message.school-year") }}:
              {{ semesters.schoolYear }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group-item" style="width: 30%; margin-bottom: 20px">
        <div
          class="form-group"
          :class="{ 'has-error': !selecetMajor }"
          style="margin-right: 10px"
        >
          <label for="selecetFacuties">{{
            $t("message.register-for-subject")
          }}</label>
          <select
            class="form-control"
            id="selecetFacuties"
            v-model="selecetMajor"
            @change="getSubject"
          >
            <option value="">-- {{ $t("message.choose-deparment") }} --</option>
            <option
              v-for="(major, index) in majors"
              :key="index"
              :value="major.id"
            >
              {{ major.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group-item" style="width: 30%; margin-bottom: 20px">
        <div class="form-group" style="margin-right: 10px">
          <label>{{ $t("message.choose-subject") }}</label>
          <multiselect
            v-model="selectedCourseOption"
            :options="formattedCourses"
            :searchable="true"
            :close-on-select="true"
            :show-labels="true"
            placeholder="Search to Select"
            label="label"
            track-by="value"
            width="100%"
          ></multiselect>
        </div>
      </div>
      <!-- <div class="form-group-item search-course">
        <div class="form-group d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            v-model="searchKeyword"
          />
          <button
            class="btn btn-primary"
            style="width: 150px"
            @click="handleSearch"
          >
            {{ $t("message.search") }}
          </button>
        </div>
      </div> -->
    </div>
    <div v-if="courses.length > 0">
      <p>{{ $t("message.list-courses") }}:</p>
      <div class="table-container">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
              <th>{{ $t("message.number") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowData, index) in courses" :key="index">
              <td style="position: relative; width: 40px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'check' + index"
                  :disabled="rowData.isSelected"
                  :checked="rowData.isSelected"
                  @change="toggleCourse($event, rowData)"
                  style="
                    position: absolute;
                    top: 43%;
                    left: 100%;
                    transform: translate(-50%, -50%);
                  "
                />
              </td>
              <td>{{ rowData.id }}</td>
              <td>{{ rowData.name }}</td>
              <td style="text-align: center">{{ rowData.credit }}</td>
              <td style="text-align: center">{{ this.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="courses === null">
      <p>{{ $t("message.list-courses") }}:</p>
      <div class="table-container">
        <table class="table table-hover table-bordered table-container">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
              <th>{{ $t("message.number") }}</th>
            </tr>
          </thead>
        </table>
      </div>
      <p style="text-align: center">
        <strong>{{ $t("message.content-no-course") }}</strong>
      </p>
    </div>
    <div v-else>
      <p>{{ $t("message.list-courses") }}:</p>
      <div class="table-container">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
              <th>{{ $t("message.number") }}</th>
            </tr>
          </thead>
        </table>
      </div>
      <p style="text-align: center">
        <strong>{{ $t("message.content-no-course") }}</strong>
      </p>
    </div>
    <div>
      <p>{{ $t("message.list-selected-courses") }}:</p>
      <div class="table-container">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(selectedCourse, index) in selectedCourses" :key="index">
              <td style="position: relative; width: 40px">
                <button
                  class="btn btn-danger"
                  @click="removeCourse(index, selectedCourse.id)"
                >
                  {{ $t("message.delete") }}
                </button>
              </td>
              <td>{{ selectedCourse.subjectId.id }}</td>
              <td>{{ selectedCourse.subjectId.name }}</td>
              <td>{{ selectedCourse.subjectId.credit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>{{ $t("message.list-coursed") }}:</p>
      <div class="table-container">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th style="width: 5%"></th>
              <th style="text-align: center">STT</th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in ListCourses" :key="index">
              <td style="position: relative; width: 40px">
                <button
                  class="btn btn-danger"
                  @click="removeCoursed(index, course.id)"
                >
                  {{ $t("message.delete") }}
                </button>
              </td>
              <td style="text-align: center">{{ index + 1 }}</td>
              <td>{{ course.subjectId.id }}</td>
              <td>{{ course.subjectId.name }}</td>
              <td>{{ course.subjectId.credit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-container d-none" style="display: none">
        <table id="table-course" class="table table-hover table-bordered">
          <thead>
            <tr>
              <th style="text-align: center">STT</th>
              <th>{{ $t("message.code-of-subject") }}</th>
              <th>{{ $t("message.name-of-subject") }}</th>
              <th>{{ $t("message.credit") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in ListCourses" :key="index">
              <td style="text-align: center">{{ index + 1 }}</td>
              <td>{{ course.subjectId.id }}</td>
              <td>{{ course.subjectId.name }}</td>
              <td>{{ course.subjectId.credit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="submitCourses()">
          {{ $t("message.register") }}
        </button>
        <button
          class="btn btn-danger btnExportPDF"
          @click="exportToPDF"
          style="margin-left: 10px"
        >
          {{ $t("message.export") }} PDF
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import Apis, { authApi, endpoints } from "@/configs/Apis";
import { mapGetters } from "vuex";
import Loading from "../../../components/Loading.vue";
import html2pdf from "html2pdf.js";
import Multiselect from "vue-multiselect";

export default {
  computed: {
    ...mapGetters(["isAuth", "getUser"]),
    formattedCourses() {
      return this.coursesOption.map((course) => ({
        value: course.id,
        label: course.name,
      }));
    },
  },
  components: {
    Loading,
    Multiselect,
  },
  data() {
    return {
      courses: [],
      majors: [],
      semesters: {},
      selecetMajor: "",
      selectSemester: "",
      selectedCourses: [],
      ListCourses: [],
      selectedTemporaryCourses: [],
      maxQuantity: 0,
      quantity: 80,
      isSuccess: false,
      isLoadSubjects: false,
      isSaveCourses: false,
      isLoading: false,
      selectedCourseOption: null,
      coursesOption: [],
      userInfo: null,
      formattedBirthday: "",
    };
  },
  watch: {
    selectedTemporaryCourses: {
      async handler(newValue, oldValue) {
        if (!this.isSaveCourses) {
          await this.saveTemporaryCourse();
        }
        await this.getSubjectTemoratyCourse();
      },
      deep: true, // Đảm bảo theo dõi sâu vào các phần tử của mảng
    },
    courses: {
      async handler(newCourse, oldCourse) {
        this.checkedSubjectedCourse();
      },
      deep: true,
    },
    isSuccess: {
      async handler(newSuccess, oldSuccess) {
        this.selectedCourses = [];
        await this.getSubjectCourse();
        this.isSuccess = false;
      },
      deep: true,
    },
    selectedCourseOption(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.courses = [];
        this.getSubjectById();
      }
    },
  },
  methods: {
    checkedSubjectedCourse() {
      try {
        if (this.courses && this.selectedCourses) {
          this.courses.forEach((course) => {
            const matchingCourse = this.selectedCourses.find(
              (selectedCourse) => selectedCourse.subjectId.id === course.id
            );
            if (matchingCourse) {
              // Cập nhật lại giá trị "Còn lại" cho môn học mở đăng ký tương ứng
              course.isSelected = true;
            }
          });
        }
        if (this.courses && this.ListCourses) {
          this.courses.forEach((course) => {
            const matchingCourse = this.ListCourses.find(
              (coursed) => coursed.subjectId.id === course.id
            );
            if (matchingCourse) {
              // Cập nhật lại giá trị "Còn lại" cho môn học mở đăng ký tương ứng
              course.isSelected = true;
            }
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    toggleCourse(event, rowData, index) {
      if (!rowData.isSelected) {
        rowData.isSelected = true;
        this.selectedTemporaryCourses.push(rowData);
        this.remaining -= 1;
        this.isSaveCourses = false;
      }
    },
    async removeCourse(index, studentSubjectId) {
      const removedCourse = this.selectedCourses.splice(index, 1)[0];

      this.selectedTemporaryCourses = this.selectedTemporaryCourses.filter(
        (course) => course.id !== removedCourse.subjectId.id
      );

      // // Tìm môn học mở đăng ký tương ứng dựa trên mã và nhóm
      const matchingCourse = this.courses.find(
        (course) =>
          course.id === removedCourse.subjectId.id &&
          course.group === removedCourse.group
      );
      // // Cập nhật lại giá trị "Còn lại" cho môn học mở đăng ký tương ứng
      if (matchingCourse) {
        matchingCourse.isSelected = false;
        matchingCourse.remaining += 1;
      }
      await this.deleteCourse(studentSubjectId);
    },
    async removeCoursed(index, studentSubjectId) {
      const removedCourse = this.ListCourses.splice(index, 1)[0];

      // // Tìm môn học mở đăng ký tương ứng dựa trên mã và nhóm
      const matchingCourse = this.courses.find(
        (course) =>
          course.id === removedCourse.subjectId.id &&
          course.group === removedCourse.group
      );

      // // Cập nhật lại giá trị "Còn lại" cho môn học mở đăng ký tương ứng
      if (matchingCourse) {
        matchingCourse.isSelected = false;
        matchingCourse.remaining += 1;
      }

      await this.deleteCourse(studentSubjectId);
    },
    async deleteCourse(studentSubjectId) {
      try {
        const response = await authApi().delete(
          endpoints["delete-course"].replace(
            "{studentSubjectId}",
            studentSubjectId
          )
        );
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    async getSubjectById() {
      try {
        const subjectId = this.selectedCourseOption.value;
        const res = await authApi().get(
          endpoints["get-subject-by-id"] + `?subjectId=${subjectId}`
        );
        this.courses.push(res.data);
      } catch (e) {
        console.log(e.error);
      }
    },
    async getAllSubject() {
      try {
        const res = await authApi().get(endpoints["subjects"]);
        this.coursesOption = res.data;
      } catch (e) {
        console.log(e.error);
      }
    },
    async getSubject() {
      try {
        if (this.selecetMajor) {
          const majorId = this.selecetMajor;
          const semesterId = this.semesters.id;
          // const studentId = this.getUser.username;

          const response = await authApi().get(
            endpoints["get-education-program"] +
              `?semesterId=${semesterId}&majorId=${majorId}`
          );
          this.courses = response.data;
          this.isLoadSubjects = true;
        } else {
          console.error("Please select a faculty before fetching subjects.");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.courses = [];
        } else {
          console.error("Error fetching subjects:", error);
        }
      }
    },
    async getMajor() {
      try {
        const response = await Apis.get(endpoints["majors"]);
        this.majors = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLatestSemester() {
      try {
        const res = await authApi().get(endpoints["get-latest-semester"]);
        this.semesters = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async submitCourses() {
      try {
        const username = this.getUser.username;
        const resStudentId = await authApi().get(
          endpoints["get-student-by-username"].replace("{username}", username)
        );
        const studentId = resStudentId.data.id;

        try {
          const promises = this.selectedCourses.map(async (subject) => {
            const subjectId = subject.subjectId.id;
            const semesterId = this.semesters.id;
            const requestData = [
              {
                studentId: studentId,
                subjectId: subjectId,
                semesterId: semesterId,
              },
            ];
            const response = await authApi().post(
              endpoints["course-register"],
              requestData,
              {
                headers: {
                  "Content-Type": "application/json", // Đặt Content-Type là application/json
                },
              }
            );
            if (response.status !== 201) {
              console.error(`Đăng ký của sinh viên thất bại!!!`);
            }
          });
          await Promise.all(promises);

          alert("Đăng ký môn học thành công!");
          this.isSuccess = true;
          this.isSaveCourses = true;
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveTemporaryCourse() {
      try {
        const username = this.getUser.username;
        const resStudentId = await authApi().get(
          endpoints["get-student-by-username"].replace("{username}", username)
        );
        const studentId = resStudentId.data.id;

        try {
          const promises = this.selectedTemporaryCourses.map(
            async (subject, index, array) => {
              const subjectId = subject.id;
              const semesterId = this.semesters.id;
              if (index === array.length - 1) {
                const requestData = [
                  {
                    studentId: studentId,
                    subjectId: subjectId,
                    semesterId: semesterId,
                  },
                ];
                const response = await authApi().post(
                  endpoints["temporary-course-register"],
                  requestData,
                  {
                    headers: {
                      "Content-Type": "application/json", // Đặt Content-Type là application/json
                    },
                  }
                );
                if (response.status !== 201) {
                  console.error(`Lưu tạm thất bại!!!`);
                }
              }
            }
          );
          await Promise.all(promises);
        } catch (error) {
          console.log(error);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getSubjectTemoratyCourse() {
      try {
        const username = this.getUser.username;
        const resStudentId = await authApi().get(
          endpoints["get-student-by-username"].replace("{username}", username)
        );
        const studentId = resStudentId.data.id;
        const semesterId = this.semesters.id;
        const res = await authApi().get(
          endpoints["get-temporary-courses"] +
            `?studentId=${studentId}&semesterId=${semesterId}`
        );

        const temporatyCourseData = res.data;
        this.selectedCourses = temporatyCourseData;
      } catch (error) {
        console.log(error);
      }
    },
    async getSubjectCourse() {
      try {
        const username = this.getUser.username;
        const resStudentId = await authApi().get(
          endpoints["get-student-by-username"].replace("{username}", username)
        );
        const studentId = resStudentId.data.id;
        const semesterId = this.semesters.id;
        const res = await authApi().get(
          endpoints["get-already-course"] +
            `?studentId=${studentId}&semesterId=${semesterId}`
        );

        const CourseData = res.data;
        this.ListCourses = CourseData;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUserInfo() {
      let endpoint = "";
      const userRole = this.getUser.role;
      if (userRole === "ROLE_SINHVIEN") {
        endpoint = endpoints["get-student-by-username"];
      } else if (userRole === "ROLE_GIANGVIEN") {
        endpoint = endpoints["get-lecturer-by-username"];
      }

      const response = await authApi().get(
        endpoint.replace("{username}", this.getUser.username)
      );
      this.userInfo = response.data;
      if (response.data.birthday) {
        const birthdayTimestamp = response.data.birthday;
        const birthdayDate = new Date(birthdayTimestamp);

        const formattedBirthday = `${birthdayDate.getDate()}/${
          birthdayDate.getMonth() + 1
        }/${birthdayDate.getFullYear()}`;
        this.formattedBirthday = formattedBirthday;
      }
    },
    async exportToPDF() {
      const element = document.getElementById("table-course");
      const header = `<h3 style="text-align: center;">Danh sách môn học đã đăng ký</h3>
        <ul>
          <li>MSSV: ${this.getUser.username}</li>
          <li>Tên sinh viên: ${this.userInfo.name}</li>
          <li>Lớp: ${this.userInfo.classesId.id}</li>
          <li>Chuyên ngành: ${this.userInfo.facultyId.name}</li>
        </ul>`;

      // Thêm margin để làm cho header không chồng lên nội dung
      const options = {
        margin: [10, 5], // Độ dày margin top và bottom là 20
        filename: `${this.getUser.username}` + ".pdf",
        html2canvas: {
          scale: 2, // Tăng tỉ lệ để có chất lượng tốt hơn
          useCORS: true, // Sử dụng CORS để tránh lỗi trong trường hợp có các yêu cầu từ nguồn khác
        },
        jsPDF: {
          format: "a4", // Định dạng trang
        },
      };

      const container = document.createElement("div");
      container.innerHTML = header;
      container.appendChild(element.cloneNode(true));

      // Thêm header vào HTML trước khi xuất PDF
      html2pdf().set(options).from(container).save();
    },
  },
  async created() {
    this.isLoading = true;
    this.fetchUserInfo();
    this.getAllSubject();
    this.getLatestSemester();
    this.getMajor();
    this.getSubject();
    if (this.semesters) {
      await this.getSubjectTemoratyCourse();
    }
    await this.getSubjectCourse();
    if (this.majors.length > 0) {
      this.getSubject();
      this.maxQuantity = this.courses.reduce(
        (max, course) => (course.quantity > max ? course.quantity : max),
        0
      );
    }
    this.getSubjectById();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.search-course {
  margin: 30px 0 0 100px;
}

@media (max-width: 767px) {
  .form-group-item {
    width: 100% !important;
  }
  .search-course {
    margin: 0;
  }
}
</style>
