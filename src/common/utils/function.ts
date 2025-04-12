export function generateRandomEmail(): string {
  return `${generateRandomString()}@email.com`;
}

export function generateRandomString(): string {
  return String(Math.floor(+new Date() / 10));
}
