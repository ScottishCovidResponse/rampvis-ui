import { ILink } from "./ILink";
import { IOntoData } from "./IOntoData";
import { IOntoVis } from "./IOntoVis";
import { PAGE_TYPE } from "./PageType.enum";

export interface IOntoPageTemplate {
  id: string;
  pageType: PAGE_TYPE;
  date: Date;
  visId: string;
  dataIds: string[];
  pageIds?: string[];
  ontoData: IOntoData[];
  ontoVis: IOntoVis;
  title: string;
  links?: ILink[];
}
