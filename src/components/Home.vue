<template>
  <div class="home">
    <div class="content" :class="windowClasses">
      <h1>Welcome to QuickMark</h1>
      <aside>Please upload files</aside>
      <div class="control-panel">
        <div class="operations">
          <form id="file-form" ref="file-form">
            <input tabindex="1" type="file" class="hidden" :accept="acceptedFileTypeString" id="files-add" name="files" ref="files-add" @change="fileUploadHandler" multiple>
            <label for="files-add" class="button big">+ Add files</label>
          </form>

          <div class="filters">
            <div class="file-type-check">
              <p>Accept </p>
              <label v-for="t in fileTypes" :key="t.mimeType">{{ t.label }}<input type="checkbox" v-model="selectedFileTypes" :value="t" /></label>
            </div>
          </div>

        </div>
        <div>
          <button type="button" class="button big danger" :disabled="studentFileArray.length <= 0" @click.prevent="removeAllFiles">Clear all files</button>
        </div>
      </div>
      <div class="no-files-message" v-if="studentFileArray.length <= 0">
        <span>
          <em>No files have been added yet. Click on "+ Add files"</em>
        </span>
      </div>
      <div v-else class="table-wrapper">
        <FileTable :data="studentFileArray"></FileTable>
      </div>

      <div class="bottom-controls">
        <button type="button" class="button big primary" :disabled="studentFileArray.length <= 0" @click.prevent="goToViewer">1. Start/Continue Marking</button>

        <button type="button" class="button big success" :disabled="studentFileArray.length <= 0" @click.prevent="openExportModal">2. Download Grades</button>
      </div>

    </div>

    <DownloadModal v-show="saveModalOpen" @close="closeExportModal" :data="studentFileArray"></DownloadModal>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store from "../store";
import { StudentFileData, FileType, FILE_TYPES, COLUMNS } from "../data/File";
import uuid from "../utils/uuid";

import FileTable from "./FileTable.vue";
import DownloadModal from "./DownloadModal.vue";

@Component({
  components: {
    FileTable,
    DownloadModal
  }
})
export default class Home extends Vue {
  selectedFileTypes: FileType[] = this.fileTypes;
  saveModalOpen: boolean = false;

  openExportModal() {
    this.saveModalOpen = true;
  }

  closeExportModal() {
    this.saveModalOpen = false;
  }

  get windowClasses() {
    return {
      dim: this.saveModalOpen
    };
  }

  get studentFileArray() {
    return store.state.studentFileDataArray;
  }

  fileUploadHandler(e: any) {
    const files = e.target.files || e.dataTransfer.files;
    const filesArray = [];

    // Need this step to convert FileList to File[]
    for (let file of files) {
      if (this.checkIfFileHasCompatibleType(file)) {
        filesArray.push(file);
      }
    }
    this.addToFileArray(filesArray);

    // Clear form to accommodate file addition (instead of file replacement)
    (this.$refs["file-form"] as HTMLFormElement).reset();
  }

  checkIfFileHasCompatibleType(file: File) {
    return this.selectedFileTypes.some(ft => ft.mimeType === file.type);
  }

  getStudentIdFromFileName(file: File): string {
    // Based on custom file nomenclature suggested by stakeholders
    const fileName = file.name;
    const regExp = /(\_s.{7}\_)/;
    const arr = regExp.exec(fileName)!;
    return arr[0]
      .split("")
      .filter(l => l !== "_")
      .join("");
  }

  get acceptedFileTypeString() {
    return this.selectedFileTypes.map(f => f.mimeType).join(",");
  }

  getUnique(newStudentFileDataArray: StudentFileData[]): StudentFileData[] {
    let uniqueFiles: StudentFileData[] = [];

    for (let i = 0; i < newStudentFileDataArray.length; i++) {
      let found = false;
      const newFile = newStudentFileDataArray[i];
      for (let j = 0; j < this.studentFileArray.length; j++) {
        const oldFile = this.studentFileArray[j];

        if (oldFile.studentId === newFile.studentId && oldFile.file.name === newFile.file.name && oldFile.file.size === newFile.file.size) {
          found = true;
        }
      }
      if (found === false) uniqueFiles.push(newFile);
    }

    return uniqueFiles;
  }

  addToFileArray(files: File[]) {
    const studentFileDataArray = files.map(f => ({
      _id: uuid(),
      studentId: this.getStudentIdFromFileName(f),
      file: f,
      satisfactory: undefined,
      objectUrl: URL.createObjectURL(f)
    }));
    const uniqueStudentFileDataArray = this.getUnique(studentFileDataArray);
    store.commit("addFiles", uniqueStudentFileDataArray);
  }

  goToViewer() {
    this.$router.push({ name: "viewer" });
  }

  get fileTypes() {
    return FILE_TYPES;
  }

  removeAllFiles() {
    const remove = confirm("This will clear all files and lose record of all marks (which have not been downloaded). Continue?");
    if (remove === true) {
      store.commit("removeAllFiles");
    }
  }

  created() {
    window.onbeforeunload = (e) => {
      if(this.studentFileArray && this.studentFileArray.length > 0) {
        const text = "Are you sure you want to leave this page? Any file(s) / marks that were not exported will be lost.";
        e.returnValue = text;
        return text;
      }
    }
  }
}
</script>
<style scoped src="../assets/style.css"></style>
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  height: 100vh;
}

.home > * {
  margin: 0.5rem;
}

.table-wrapper {
  max-height: 60vh;
  overflow: auto;
  position: relative;
  width: 100%;
}

.bottom-controls {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.bottom-controls > * {
  margin-left: 0.5rem;
  margin-top: 1rem;
}

.control-panel {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 1rem 0;
}

.operations {
  display: flex;
  align-items: center;
}

.hidden {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

#files-add + label {
  display: inline-block;
}

.file-type-check {
  align-self: flex-end;
  display: flex;
  background: rgba(100, 100, 100, 0.1);
  padding: 0.5rem;
  align-items: center;
  border-radius: 6px;
}

.file-type-check > * {
  margin: 0.25rem;
}

.marked {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.dim {
  opacity: 0.3;
}


.no-files-message {
  padding: 1rem;
  width: 100%;
  text-align: center;
  color: grey;
  background-color: rgb(230, 230, 230);
}
</style>