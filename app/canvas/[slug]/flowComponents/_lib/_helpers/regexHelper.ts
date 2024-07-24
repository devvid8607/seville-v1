const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
export const isValidUrl = (url: string) => urlRegex.test(url);
