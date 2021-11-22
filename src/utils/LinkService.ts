import { apiService } from "src/utils/ApiService";

const api: string = `${process.env.NEXT_PUBLIC_API_JS}/template/link`;

export async function getLinks(dataId: string) {
  try {
    const pageIds = await apiService.get(`${api}/${dataId}`);
    // console.log("getLinks: dataId =  ", dataId, ", pageId = ", pageIds);
    const links = pageIds?.map((id: string) => {
      return `${window.location.href.split("?")[0]}/?id=${id}`;
    });
    return links;
  } catch (error) {
    console.error(`LinkService:getLinks: error = ${error}`);
  }
}
