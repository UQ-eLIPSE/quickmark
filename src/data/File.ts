export interface StudentFileData {
  _id: string,
  studentId: string,
  file: File,
  satisfactory: boolean | undefined,
  objectUrl: string
}

export interface FileType {
  mimeType: string,
  label: string
}


export const FILE_TYPES = [
  {
    mimeType: "application/pdf",
    label: ".PDF"
  },
  {
    mimeType: "image/jpeg",
    label: ".JPEG"
  },
  {
    mimeType: "image/png",
    label: ".PNG"
  },
  {
    mimeType: "image/bmp",
    label: ".BMP (image file)"
  },
];

export const COLUMNS: { [key: string]: string } = {
  id: "Username",
  fileName: "File name",
  mark: "Mark",
  // fileType: "File type",
  // fileSize: "File size"
}