import https from 'https';

/**
 * Sends a verification email to the user's college email address
 * with a verification code.
 * 
 * @param {*} email 
 * @param {*} code 
 * @returns response from the lambda function
 */
export function verifyCollegeEmailLambda(email, code) {
    return new Promise((resolve, _) => {

        const options = {
            hostname: process.env.VERIFY_EMAIL_LAMBDA_URL,
            headers: {
                'email': email,
                'code': code,
            }
        }

        https.get(options, (res) => {
            resolve(res);
        });
    });
}