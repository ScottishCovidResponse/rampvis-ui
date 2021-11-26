import { ILink } from "src/models/ILink";
import { apiService } from "src/utils/ApiService";

const api: string = `${process.env.NEXT_PUBLIC_API_JS}/template/link`;

export async function getLinks(dataId: string): Promise<ILink[]> {
  try {
    let links: ILink[] = await apiService.get(`${api}/${dataId}`);
    links = links?.map((d: ILink) => {
      return {
        visFunction: d.visFunction,
        url: `${window.location.href.split("?")[0]}/?id=${d.pageId}`,
      };
    });

    console.log("getLinks: dataId =  ", dataId, ", links = ", links);
    return links;
  } catch (error) {
    console.error(`LinkService:getLinks: error = ${error}`);
  }
}
