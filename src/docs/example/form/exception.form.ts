export const exceptionForm = (
  domain: string,
  status: number,
  message: string | object,
) => {
  const customMessage =
    typeof message === 'object' && message !== null && 'message' in message
      ? (message as any).message
      : [message];

  return {
    status,
    timestamp: new Date(),
    url: domain,
    message: customMessage,
  };
};
