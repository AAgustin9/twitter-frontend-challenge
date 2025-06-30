import axios from "axios";

export const S3Service = {

  upload: async (file: File, url: string) => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  },
};
