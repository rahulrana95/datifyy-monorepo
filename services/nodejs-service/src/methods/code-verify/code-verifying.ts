import { emailCodeCache } from "../../utils/tests/global";

export function getCodeForVerifyingEmail({ to }: { to: { email: string } }) {
    // generate a random 6 digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // if the global object doesn't have a map for storing the email and code, create one

    let uniqueCode = verificationCode;
    // make sure the code is unique
    while (emailCodeCache.has(uniqueCode)) {
        uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // store the email and code in the map
    emailCodeCache.set(uniqueCode, { email: to.email, code: uniqueCode });

    return uniqueCode;
}


export function verifyCodeForEmail({ email, code }: { email: string; code: string }) {
    // if the global object doesn't have a map for storing the email and code, return false
    console.log('entering')
    if (!emailCodeCache) {
        return false;
    }
    
    console.log(...emailCodeCache.values());
    console.log
    // if the code is correct, return true
    if (emailCodeCache.get(code)?.email?.[0].email === email) {
        emailCodeCache.delete(code);
        return true;
    }

    return false;
}