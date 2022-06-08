import { IsNotEmpty, IsString } from 'class-validator';

export abstract class ICreateMediaDTO {
  mimeType: string;

  filePath: string;

  fileName:string

  fileSize: string
}
