export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function obj2Formdata(obj: { [key: string]: string }): FormData {
  let formData = new FormData();
  try {
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item]);
    });
  } catch (err) {
    console.error(err);
  }
  return formData;
}
