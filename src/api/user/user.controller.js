import { verifyCollegeEmailLambda } from '../../lambda/verifyCollegeEmail.lambda.js';
import { addUserToCollegeLambda } from '../../lambda/addUserToCollege.lambda.js';

/**
 * @api {get} /api/send_college_verify_email
 * @apiName Send College Verification Email
 * @apiDescription Send a verification email to a user's college email address
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} email - The user's email address
 * @apiHeader {String} code - The verification code
 */

export async function sendCollegeVerificationEmail(req, res) {
    console.time('API - sendCollegeVerificationEmail');

    const email = req.query.email; // get email and code from headers
    const code = req.query.code;

    try {
        const response = await verifyCollegeEmailLambda(email, code); // send email to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - sendCollegeVerificationEmail');
}

/**
 * @api {post} /api/user/{userId}/add/college/{collegeId}
 * @apiName Add User to College
 * @apiDescription Add a user to a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} userId - The user's id
 * @apiParam {String} collegeId - The college's id
 */

export async function addUserToCollege(req, res) {
    console.time('API - addUserToCollege');
    const { userId, collegeId } = req.params; // get user id and college id from url

    try {
        const response = await addUserToCollegeLambda(userId, collegeId); // send request to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - addUserToCollege');
}

export async function generateNewUsername(req, res) {
    // Generate a random username using adjective and animal names
}

export async function generateNewAvatar(req, res) {
    // Generate a random avatar using the avatar generator API
}

export async function createNewUser(req, res) {
    // Create a new user in the database
}