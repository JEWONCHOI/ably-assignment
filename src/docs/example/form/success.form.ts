export const successForm = (
  domain: string,
  status: number,
  data: object | string,
) => {
  return {
    status,
    timestamp: new Date(),
    url: domain,
    data,
  };
};
