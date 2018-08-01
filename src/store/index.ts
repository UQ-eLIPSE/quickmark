import Vue from "vue";
import Vuex from "vuex";
import { StudentFileData, FileType } from "../data/File";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        studentFileDataArray: <StudentFileData[]>[]
    },
    mutations: {
        addFiles(state, arr) {
            state.studentFileDataArray = state.studentFileDataArray.concat(arr);
        },
        removeSingleFile(state, studentFile) {
            state.studentFileDataArray = state.studentFileDataArray.filter((sf) => sf !== studentFile);
        },
        removeFiles(state, filesToBeRemoved) {
            state.studentFileDataArray = state.studentFileDataArray.filter((sf) => filesToBeRemoved.indexOf(sf) === -1);
        },
        removeAllFiles(state) {
            state.studentFileDataArray = [];
        },
        setStudentFileDataArray(state, arr) {
            state.studentFileDataArray = [...arr]
        },
        increaseMarks(state, studentIndex) {
            state.studentFileDataArray[studentIndex].satisfactory = true;
        },
        decreaseMarks(state, studentIndex) {
            state.studentFileDataArray[studentIndex].satisfactory = false;
        },
        resetMarks(state, studentIndex) {
            state.studentFileDataArray[studentIndex].satisfactory = undefined;
        }
    },
    actions: {

    },
    getters: {
        
    }
})