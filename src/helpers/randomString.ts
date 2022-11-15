//create a random string secret Token

export const randomString = (length = 20) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = length; i > 0; --i)
    randomString += chars[Math.floor(Math.random() * chars.length)];
  return randomString;
};
