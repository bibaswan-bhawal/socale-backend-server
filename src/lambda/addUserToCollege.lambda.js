import https from 'https';

/**
 * Add a user to the cognito college group
 * 
 * @param {*} userId 
 * @param {*} college 
 * @returns response from the lambda function
 */
export function addUserToCollegeLambda(userId, college) {
    return new Promise((resolve, _) => {
        const options = {
            hostname: process.env.ADD_USER_TO_COLLEGE_LAMBDA_URL,
            headers: {
                'username': userId,
                'college': college,
            }
        }

        https.get(options, (res) => {
            resolve(res);
        });
    });
}