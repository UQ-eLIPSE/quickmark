<template>

  <div class="file-table">
    <table>
      <tr>
        <th>#</th>
        <th v-html="getColumnHeaderHtml(columns.id)"></th>
        <th v-html="getColumnHeaderHtml(columns.mark)"></th>
        <th v-html="getColumnHeaderHtml(columns.fileName)"></th>
        <th>Operation</th>
      </tr>
      
      <tr v-for="(sf, i) in studentFileArray" :key="sf._id">
        <td>{{ i+1 }}</td>
        <td>{{sf.studentId}}</td>
        <td :class="markedClasses(sf)">{{getStudentMarkString(sf)}}</td>
        <td>{{sf.file.name}}</td>

        <td>
          <button type="button" class="button small danger" @click.prevent="removeFile(sf)">Remove </button>
          <button type="button" class="button small secondary" @click.prevent="goToMarkQuestion(i)">View</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
// import Vue from "vue";
// import Component from "vue-class-component";
import store from "../store";
import { StudentFileData, FileType, FILE_TYPES, COLUMNS } from "../data/File";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({})
export default class FileTable extends Vue {
  @Prop({ required: true, default: () => [] })
  data!: StudentFileData[];

  get studentFileArray() {
    return this.data;
  }

  get columns() {
    return COLUMNS;
  }

  getColumnHeaderHtml(column: string) {
    if (column === COLUMNS.mark) {
      // Display number of marked files
      return column + "\t" + "<p>(" + this.numberOfMarkedFiles + "/" + this.studentFileArray.length + ") marked</p>";
    }

    return column;
  }

  get numberOfMarkedFiles() {
    return this.studentFileArray.filter(sf => sf.satisfactory !== undefined).length;
  }

  removeFile(studentFileData: StudentFileData) {
    const remove = confirm("This will remove the file and any marks assigned will be lost (if not exported previously). Continue?");
    if (remove === true) store.commit("removeSingleFile", studentFileData);
  }

  goToMarkQuestion(studentFileIndex: number) {
    this.$router.push({
      name: "viewer",
      params: { fileIndex: studentFileIndex.toString() }
    });
  }

  getStudentMarkString(studentFile: StudentFileData) {
    switch (studentFile.satisfactory) {
      case undefined:
        return "-- (unmarked)";
      case true:
        return "Satisfactory";
      case false:
        return "Unsatisfactory";
    }
  }

  markedClasses(sf: StudentFileData) {
    const marked = this.isStudentMarked(sf);
    return {
      satisfactory: sf.satisfactory === true,
      unsatisfactory: sf.satisfactory === false,
      unmarked: sf.satisfactory === undefined
    };
  }

  isStudentMarked(studentFile: StudentFileData) {
    return studentFile.satisfactory !== undefined;
  }
}
</script>
<style scoped src="../assets/style.css"></style>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

table,
th,
td {
  border: 0.01em solid #aaa;
  padding: 1rem;
}

th {
  background-color: #eee;
}
</style>