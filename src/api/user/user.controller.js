import Surreal from 'surrealdb.js';

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

export async function generateProfile(req, res) {
    console.time('API - generateProfile');
    const { collegeId } = req.query; // get college id from url

    try {
        const username = await generateUsername(); // generate username
        const avatar = await generateAvatar(collegeId); // generate avatar

        res.json({ username, avatar }); // send username and avatar to client
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - generateProfile');
}


async function generateUsername() {
    await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, process.env.SURREALDB_MAIN_DB);

    const response = await Surreal.Instance.query("SELECT * FROM configs:usernames");

    const adjectives = response[0]['result'][0]['adjectives'];
    const nouns = response[0]['result'][0]['nouns'];

    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];

    adjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
    noun = noun.charAt(0).toUpperCase() + noun.slice(1);

    return `${adjective} ${noun}`;
}

async function generateAvatar(collegeId) {

    await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, process.env.SURREALDB_MAIN_DB);

    const response = await Surreal.Instance.query(`SELECT avatars FROM ${collegeId}`);

    const avatar = response[0]['result'][0]['avatars'][Math.floor(Math.random() * response[0]['result'][0]['avatars'].length)];

    return avatar;
}

export async function createNewUser(_, res) {
    res.sendStatus(200);
}