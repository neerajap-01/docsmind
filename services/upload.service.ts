
import { ADMINPANELBFF, SERVER_BFF } from "@/contants/bffEndpoints.contants";
import { fetchData } from "@/utils/fetchData";

//POST
export const uploadMultipleFiles = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('docs', file);
    });
    formData.append('namespace', 'testing-ui-files')
    const response = await fetchData(
      SERVER_BFF,
      ADMINPANELBFF.uploadMultipleFilesBFF(),
      'post',
      formData,
      {},
      {},
      true,
      true
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    return response;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error uploading files");
  }
}
