<template>
  <div class="modal save-as">
    <button type="button" class="close-button button small danger" @click.prevent="closeHandler">X</button>

    <div class="choose-columns">
      <h3>Choose columns for exporting</h3>

      <label v-for="column in columnsArray" :key="column"><input type="checkbox" v-model="selectedColumns" :value="column"> {{ column }}</label>

    </div>
    <label>Format
      <select v-model="exportFormat">
        <option :value="exportTypes.CSV">{{ exportTypes.CSV.extension }}</option>
        <option :value="exportTypes.TSV">{{ exportTypes.TSV.extension }}</option>
      </select>
    </label>

    <div class="bb">
      <label>Blackboard column ID <input type="text" v-model="blackboardInfo.columnId"></label>
      <label>Blackboard column name <input type="text" v-model="blackboardInfo.columnName"></label>
    </div>
    <button type="button" class="button big success" :disabled="studentFileArray.length <= 0" @click.prevent="downloadResults">Download</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import store from "../store";
import { StudentFileData, FileType, FILE_TYPES, COLUMNS } from "../data/File";
import { EXPORT_TYPES, convertToSeparatedValueFormat } from "../utils/prepareFile";

@Component({})
export default class FileTable extends Vue {
  @Prop({ required: true, default: () => [] })
  data!: StudentFileData[];

  get studentFileArray() {
    return this.data;
  }

  selectedColumns: any = [COLUMNS.id, COLUMNS.mark];
  blackboardInfo: { [key: string]: string } = {
    columnId: "",
    columnName: ""
  };
  exportFormat: any = EXPORT_TYPES.CSV;

  closeHandler() {
    this.$emit("close");
  }

  get exportTypes() {
    return EXPORT_TYPES;
  }

  downloadResults() {
    const result = convertToSeparatedValueFormat(this.selectedColumns, this.studentFileArray, this.exportFormat.delimiter, this.blackboardInfo);

    const content = "data:" + this.exportFormat.mimeType + ";charset=utf-8," + encodeURI(result);

    var link = document.createElement("a");
    link.setAttribute("href", content);
    link.setAttribute("download", "marks." + this.exportFormat.extension);
    document.body.appendChild(link);
    link.click();
  }
  get columnsArray(): any[] {
    return (Object.keys(COLUMNS) as any).map((k: string) => COLUMNS[k]);
  }
}
</script>
<style scoped src="../assets/style.css"></style>
<style scoped>
.modal.save-as {
  position: absolute;
  top: 20vh;
  margin: auto;
  background: rgba(255, 255, 255, 0.95);
  border: 0.1em solid rgba(1, 0, 0, 0.2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.modal.save-as > * {
  margin: 1rem;
}


button.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 0.5rem;
}

.choose-columns {
  display: flex;
  flex-direction: column;
}

.minimal {
  font-weight: 100;
  font-size: 0.8em;
}
</style>