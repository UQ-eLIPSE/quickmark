<template>
  <div class="main-viewer">
    <div class="split-footer">

      <button class="arrow-container black button" :disabled="currentStudentIndex <= 0" @click="previousFile">
        <div class="arrow-left"></div>
        <span>Previous</span>
      </button>

      <label>Jump To ... <input type="number" class="page-input" v-model="currentStudentIndexFormatted"> {{ '(/' + files.length + ')' }}</label>
      <button class="arrow-container black" :disabled="currentStudentIndex >=files.length-1" @click="nextFile">
        <div class="arrow-right"></div>
        <span>Next</span>
      </button>
    </div>
    <div class="student-panel" v-show="currentStudentIndex === i" v-for="(studentData, i) in files" :key="studentData._id">
      <div class="row">
        <embed v-once :src="studentData.objectUrl" :type="studentData.file.type" v-if="!isFileAnImageFile(studentData)" width="55%">
        <ImageViewer v-else :imageSource="studentData.objectUrl"></ImageViewer>

        <div class="column student-side">

          <div class="student-information">
            <h3>Student ID</h3>
            <p>{{ studentData.studentId }}</p>
          </div>
          <h2>Mark</h2>
          <aside>This marking system works with keyboard as well as mouse controls.</aside>
          <aside>Use the "up" and "down" arrow keys for marking</aside>
          <aside>Use "left" and "right" arrow keys for navigating to the previous/next file.</aside>
          <div class="mark" :class="markClasses">

            <span class="mark-text">Satisfactory</span>
            <button :class="upArrowClasses" class="arrow-container black" @click.prevent="increaseMarks">
              <div class="arrow-up"></div>
            </button>
            <p class="current-mark">{{ currentStudentMark }}</p>

            <button :class="downArrowClasses" class="arrow-container black"  @click.prevent="decreaseMarks">
              <div class="arrow-down"></div>
            </button>
            <span class="mark-text">Unsatisfactory</span>

            <button class="button danger reset-button" :disabled="currentStudent.satisfactory === undefined" @click="resetCurrentMark">Reset mark</button>
          </div>
          <div class="bottom-controls">
            <router-link :to="{name: 'home'}" class="button big success"> Finished marking? Return to Home</router-link>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store from "../store";
import { StudentFileData, FileType, FILE_TYPES } from "../data/File";
import ImageViewer from "./ImageViewer.vue";

@Component({
  components: {
    ImageViewer
  }
})
export default class Viewer extends Vue {
  currentStudentIndex: number = 0;

  get currentStudentIndexFormatted() {
    return this.currentStudentIndex + 1 + "";
  }

  get numberOfMarkedFiles() {
    return this.files.filter(sf => sf.satisfactory !== undefined).length;
  }

  set currentStudentIndexFormatted(indexString: string) {
    const index = parseInt(indexString);
    if(!index) this.currentStudentIndex = 0;
    if (index <= 0 || index > this.files.length - 1) return;
    this.currentStudentIndex = parseInt(indexString) - 1;
  }

  resetCurrentMark() {
    store.commit("resetMarks", this.currentStudentIndex);
  }

  get files() {
    return store.state.studentFileDataArray;
  }

  get currentStudent() {
    return this.files[this.currentStudentIndex];
  }
  get currentStudentMark() {
    if (this.currentStudent.satisfactory === undefined) return "Unmarked";
    return this.currentStudent.satisfactory === true ? "Satisfactory" : "Unsatisfactory";
  }

  get markClasses() {
    return {
      unmarked: this.currentStudent.satisfactory === undefined,
      satisfactory: this.currentStudent.satisfactory === true,
      unsatisfactory: this.currentStudent.satisfactory === false
    };
  }

  get upArrowClasses() {
    return {
      "up-highlighted": this.currentStudent.satisfactory === true
    };
  }

  get downArrowClasses() {
    return {
      "down-highlighted": this.currentStudent.satisfactory === false
    };
  }

  isFilePdf(file: File) {
    return file.type === "application/pdf";
  }

  previousFile() {
    if (this.currentStudentIndex <= 0) return;
    this.currentStudentIndex -= 1;
  }

  nextFile() {
    if (this.currentStudentIndex >= this.files.length - 1) return;
    this.currentStudentIndex += 1;
  }

  increaseMarks() {
    store.commit("increaseMarks", this.currentStudentIndex);
  }

  decreaseMarks() {
    store.commit("decreaseMarks", this.currentStudentIndex);
  }

  handleKeyDown(e: KeyboardEvent) {
    e = e || window.event;

    switch (e.keyCode) {
      case 38: {
        // up arrow
        this.increaseMarks();
        e.preventDefault();
        break;
      }
      case 40: {
        // down arrow
        this.decreaseMarks();
        e.preventDefault();
        break;
      }

      case 37: {
        // left arrow
        this.previousFile();
        e.preventDefault();
        break;
      }

      case 39: {
        // right arrow
        this.nextFile();
        e.preventDefault();
        break;
      }
    }
  }

  get fileTypes() {
    return FILE_TYPES;
  }

  isFileAnImageFile(studentData: StudentFileData) {
    return studentData.file.type.split("/")[0] === "image";
  }

  created() {
    if (this.files.length === 0) this.$router.push({ name: "home" });
    document.onkeydown = this.handleKeyDown;

    // Check if file index present in route params
    if (this.$route.params.fileIndex !== undefined) {
      this.currentStudentIndex = parseInt(this.$route.params.fileIndex);
    }
  }
}
</script>
<style scoped src="../assets/style.css"></style>
<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  height: 86vh;
}

.column {
  display: flex;
  flex-direction: column;
}

.file-display {
  max-width: 50%;
  max-height: 85vh;
}

.student-side {
  width: 40%;
  background: rgba(1, 0, 0, 0.1);
  padding: 1rem;
}

.student-information {
  font-size: 1.2em;
  border-radius: 6px;
  border-bottom: 0.1em solid rgba(1, 0, 0, 0.05);
}

.mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 6px;
}

.mark > p {
  font-size: 1.5em;
}

.student-side {
  margin: 0.5rem;
  justify-content: space-evenly;
}

.mark > * {
  margin: 0.25rem;
}
.mark button.up-highlighted {
  background-color: #155724;
}

.mark button.down-highlighted {
  background-color: #721c24;
}

.split-footer {
  display: flex;
  justify-content: space-between;
  border-bottom: 0.1em solid rgba(1, 0, 0, 0.05);
  align-items: center;
  padding: 0 0.5rem;
}

.page-input {
  font-size: 1.5em;
  padding: 0.5rem;
}

.reset-button {
  align-self: flex-end;
}

.bottom-controls {
  display: flex;
  margin: 1rem 0;
  padding: 1rem 0;
  justify-content: center;
}

.mark-text {
  font-size: 0.8em;
}

.current-mark {
  font-size: 2em;
}
</style>