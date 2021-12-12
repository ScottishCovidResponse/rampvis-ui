import { ILink } from "./ILink";

export interface IOntoData {
  id: string;
  urlCode: string;
  endpoint: string;
  description: string;
  date: Date;
  keywords: string[];
  links?: ILink[];
  values: any;
}
