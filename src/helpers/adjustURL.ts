export const  adjustImageUrl = (imageUrlBd: string) => {
    const match = imageUrlBd.match(/https?:\/\/[^"]+/);
    const imageUrl = match ? match[0] : "";
    return imageUrl;
  }