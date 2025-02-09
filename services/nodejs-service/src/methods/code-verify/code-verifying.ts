import { emailCodeCache } from "../../utils/tests/global";

export function getCodeForVerifyingEmail(toEmail: string) {
  // generate a random 6 digit code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  // if the global object doesn't have a map for storing the email and code, create one

  let uniqueCode = verificationCode;
  // make sure the code is unique
  while (emailCodeCache.has(uniqueCode)) {
    uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();
  }

  // store the email and code in the map
  emailCodeCache.set(uniqueCode, { email: toEmail, code: uniqueCode });

  // delete code after 5 minutes
  setTimeout(() => {
    emailCodeCache.delete(uniqueCode);
  }, 1000 * 60 * 5);
  return uniqueCode;
}

export function verifyCodeForEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  // if the global object doesn't have a map for storing the email and code, return false
  if (!emailCodeCache) {
    return false;
  }

  const value = emailCodeCache.get(code);
  const emailVal = value?.email;

  // if the code is correct, return true
  if (emailVal === email) {
    emailCodeCache.delete(code);
    return true;
  }

  return false;
}
