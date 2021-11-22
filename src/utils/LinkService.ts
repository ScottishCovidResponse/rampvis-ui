import { apiService } from "src/utils/apiService";

const api: string = `${process.env.NEXT_PUBLIC_API_JS}/template/link`;

export async function getLinks(dataId: string) {
  try {
    const pageIds = await apiService.get(`${api}/${dataId}`);
    const links = pageIds?.map((id: string) => {
      return `page?id=${id}`;
    });
    return links;
  } catch (error) {
    console.error(`LinkService:getLinks: error = ${error}`);
  }
}
