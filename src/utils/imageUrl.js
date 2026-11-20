
const API_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

export default getImageUrl;
