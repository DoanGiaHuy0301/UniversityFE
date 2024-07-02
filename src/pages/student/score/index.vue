<template>
  <div style="height: 100%">
    <div v-if="isLoading"><Loading /></div>
    <div v-else>
      <div v-if="semesterData.length > 0">
        <h2 class="score">{{ $t("message.score-information") }}</h2>
        <div
          v-for="(semester, semesterIndex) in semesterData"
          :key="semesterIndex"
        >
          <div class="semester">
            {{
              `${semester.semesterInfo.name} - Năm học ${semester.semesterInfo.schoolYear}`
            }}
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
                  v-for="(score, scoreIndex) in semester.score"
                  :key="scoreIndex"
                >
                  <td scope="row">{{ scoreIndex + 1 }}</td>
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
                      <span v-else><i class="fa-solid fa-xmark" style="color: red"></i></span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <p>
              {{ $t("message.accumulate-score-of-semester") }}:
              {{ semester.accumulates.scoreValue }}
            </p>
          </div>
        </div>
      </div>
      <div v-else style="padding: 20px">
        <span style="font-size: 25px">{{ $t("message.no-score") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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
      semesterData: [],
      err: "",
      isLoading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true;
        const studentUsername = this.getUser.username;
        const response = await authApi().get(
          endpoints["get-student-by-username"].replace(
            "{username}",
            studentUsername
          )
        );
        const studentId = response.data.id;
        const semesterResponse = await authApi().get(
          endpoints["semester-student"] + `?studentId=${studentId}`
        );

        this.semesters = semesterResponse.data.sort((a, b) => {
          return a.id < b.id;
        });

        this.semesters.reverse();

        const semesterDataValue = [];

        for (const semester of semesterResponse.data) {
          const semesterId = semester.id;

          const scoreEndpoint =
            endpoints["score-list"] +
            `?studentId=${studentId}&semesterId=${semesterId}`;
          const scoreResponse = await authApi().get(scoreEndpoint);

          const scoreAccumulateEndpoint =
            endpoints["get-scores-accumulate"] +
            `?studentId=${studentId}&semesterId=${semesterId}`;
          const scoreAccumulateResponse = await authApi().get(
            scoreAccumulateEndpoint
          );

          const semesterDataItem = {
            semesterInfo: semester,
            score: scoreResponse.data,
            accumulates: scoreAccumulateResponse.data,
          };

          semesterDataValue.push(semesterDataItem);
        }

        this.semesterData = semesterDataValue;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
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
};
</script>

<style>
.loader {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.5s linear;
}

.ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  animation: bounce6135 1s alternate infinite;
  transition: 0.5s linear;
}

.ball {
  background: #000;
}

.ball:nth-child(2) {
  animation-delay: 0.25s;
}

.ball:nth-child(3) {
  animation-delay: 0.5s;
}

.table-title th {
  background: #070758;
  color: #fff;
}

@keyframes bounce6135 {
  from {
    transform: scale(2);
  }

  to {
    transform: scale(1);
  }
}
</style>
