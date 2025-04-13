export function generateRandomEmail(): string {
  return `${generateRandomString()}@email.com`;
}

export function generateRandomString(): string {
  return Math.random().toString(36).substring(2, 10);
}
