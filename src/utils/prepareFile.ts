import { COLUMNS } from "../data/File";

export const EXPORT_TYPES = {
    CSV: {
        extension: "csv",
        delimiter: ",",
        mimeType: "text/csv"
    },
    TSV: {
        extension: "tsv",
        delimiter: "\t",
        mimeType: "text/tab-separated-values"
    }
}




function getSatisfactoryString(sat: boolean) {
    if(sat === undefined) return '';
    if(sat === true) return '1';
    if(sat === false) return '0';
}

function getPropFromColumnName(sf: any, columnName: string) {
    switch(columnName) {
        case COLUMNS.id: return sf.studentId;
        case COLUMNS.fileName: return sf.file.name;
        case COLUMNS.fileType: return sf.file.type;
        case COLUMNS.fileSize: return sf.file.size;
        case COLUMNS.mark: return getSatisfactoryString(sf.satisfactory);
    }
}

export function convertToSeparatedValueFormat(columns: any[], data: any[], delimiter: string, blackboardInfo: any) {
    let fileString = "";

    columns.forEach((c, i) => {
        const delim = (i<columns.length - 1)?delimiter:'';
        if(c === COLUMNS.mark && blackboardInfo.columnName) {
            fileString += blackboardInfo.columnName + '|' +blackboardInfo.columnId + delim; 
        } else {
            fileString += c + delim; 
        }
        
    });

    fileString += '\r\n';

    
    
    data.forEach((studentFile: any, j: number) => {
        // for every student file
        columns.forEach((col: any, i: number) => {
            const delim = (i<columns.length - 1)?delimiter:'';
            fileString += getPropFromColumnName(studentFile, col) + delim;
        });
        fileString += (j<data.length-1)?'\r\n':'';    
    });
    return fileString;
}