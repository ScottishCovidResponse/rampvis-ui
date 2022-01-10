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
  vis: IOntoVis;
  data: IOntoData[];
  title?: string;
  propagatedLinks?: ILink[];
  parentLink?: ILink;
  childrenLinks?: ILink[];
  neighborLinks?: ILink[];
}
