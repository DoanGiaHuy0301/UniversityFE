<template>
  <Home>
    <div class="container-fluid mb-4 mt-4" style="min-height: 80vh">
      <div v-if="semesters.length > 0">
        <h2 class="title_content">{{ $t("message.score-information") }}</h2>
        <div class="container">
          <div
            v-for="(semester, semesterIndex) in semesters"
            :key="semesterIndex"
          >
            <div class="semester">
              {{ `${semester.name}-${semester.schoolYear}` }}
            </div>
            <div class="table-container">
              <table class="table table-striped table-bordered text-center">
                <thead>
                  <tr class="table-title">
                    <th style="width: 5%">STT</th>
                    <th style="width: 30%">
                      {{ $t("message.name-of-subject") }}
                    </th>
                    <th style="width: 10%">{{ $t("message.credit") }}</th>
                    <th style="width: 15%">{{ $t("message.process") }}</th>
                    <th style="width: 10%">{{ $t("message.mid-term") }}</th>
                    <th style="width: 10%">{{ $t("message.final-term") }}</th>
                    <th style="width: 10%">TK</th>
                    <th style="width: 10%">{{ $t("message.status") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(score, scoreIndex) in scoreLists[semesterIndex]"
                    :key="scoreIndex"
                  >
                    <td>{{ scoreIndex + 1 }}</td>
                    <td class="text-start">{{ score.subjectName }}</td>
                    <td>{{ score.credit }}</td>
                    <td>
                      <span v-if="score.scoreDto">
                        <span>
                          {{ getScoreValue(score.scoreDto, "Quá trình") }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span v-if="score.scoreDto">
                        <span>
                          {{ getScoreValue(score.scoreDto, "Giữa kì") }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span v-if="score.scoreDto">
                        <span>
                          {{ getScoreValue(score.scoreDto, "Cuối kì") }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span v-if="score.scoreDto">
                        <span>
                          {{ getScoreValue(score.scoreDto, "Điểm TK") }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span v-if="score.scoreDto">
                        <span v-if="score.status">
                          <i class="fa-solid fa-check" style="color: green"></i>
                        </span>
                        <span v-else
                          ><i class="fa-solid fa-xmark" style="color: red"></i
                        ></span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="padding: 20px">
        <span style="font-size: 25px">{{ $t("message.no-score") }}</span>
      </div>
    </div>
  </Home>
</template>

<script>
import { ref, onMounted } from "vue";
import Apis, { authApi, endpoints } from "@/configs/Apis";
import Home from "../../../layouts/home.vue";
import TheHeader from "../../../components/TheHeader.vue";
import TheFooter from "../../../components/TheFooter.vue";

export default {
  components: {
    Home,
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      semesters: [],
      scoreLists: [],
      err: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const studentId = this.$route.params.id;
        const semesterResponse = await Apis.get(
          endpoints["semester-student"] + `?studentId=${studentId}`
        );
        
        this.semesters = semesterResponse.data.sort((a, b) => {
          return a.id < b.id;
        });

        this.semesters.reverse();

        const scoreListsValue = [];

        for (const semester of semesterResponse.data) {
          const semesterId = semester.id;

          const scoreEndpoint =
            endpoints["score-list"] +
            `?studentId=${studentId}&semesterId=${semesterId}`;
          const scoreResponse = await Apis.get(scoreEndpoint);

          scoreListsValue.push(scoreResponse.data);
        }
        this.scoreLists = scoreListsValue;
      } catch (err) {
        err.value = true;
      }
    },
    getScoreValue(scoreDto, columnName) {
      const score = scoreDto.find(
        (item) => item.scoreColumnName === columnName
      );
      return score ? score.scoreValue : "";
    },
  },
  setup() {},
};
</script>

<style scoped>
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

.table-title th {
  background: #070758;
  color: #fff;
}

@media (max-width: 767px) {
  .title_content {
    font-size: 20px !important;
    margin-bottom: 15px !important;
  }
}
</style>
