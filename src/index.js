import express from 'express';
import dotenv from 'dotenv';

import { db } from './database/surreal.js';
import { authenticateAccessToken } from './auth.js';
import { sendCollegeVerificationEmail, addUserToCollege } from './lambda_functions.js';

dotenv.config();

const app = express();
const port = 3000;

/**
 * TODO: For testing having all api endpoints in one file is fine, but need to 
 * split them up into separate files for production. Refer to this repo:
 * https://github.com/kunalkapadia/express-mongoose-es6-rest-api
 * for an example of how this can be done.
 *  
 */


/**
 * @api {get} /api/send_college_verify_email
 * @apiName Send College Verification Email
 * @apiDescription Send a verification email to a user's college email address
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} email - The user's email address
 * @apiHeader {String} code - The verification code
 */

app.post('/api/verify/student', async (req, res) => {
    const email = req.query.email; // get email and code from headers
    const code = req.query.code;

    try {
        const response = await sendCollegeVerificationEmail(email, code); // send email to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {post} /api/user/{userId}/add/college/{collegeId}
 * @apiName Add User to College
 * @apiDescription Add a user to a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} userId - The user's id
 * @apiParam {String} collegeId - The college's id
 */

app.post('/api/user/:userId/add/college/:collegeId', async (req, res) => {
    const { userId, collegeId } = req.params; // get user id and college id from url

    try {
        const response = await addUserToCollege(userId, collegeId); // send request to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {get} /api/colleges/college/byEmail
 * @apiName College by Email
 * @apiDescription Get the college information for the provided email address
 * @apiVersion 1.0.0
 * 
 * @apiQuery {String} email - The user's email address
 */

app.get('/api/colleges/college/byEmail', authenticateAccessToken, async (req, res) => {
    const { email } = req.query; // get email from query

    if (!email) return res.sendStatus(406); // no email provided in query string (406: Not Acceptable)
    if (!email.split('@')[0].length) return res.sendStatus(412); //  malformed email: no email extension (412: Precondition Failed)
    if (email.split('@')[0].length <= 0) return res.sendStatus(412); //  malformed email: no email username (412: Precondition Failed)

    const email_extension = `@${email.split('@')[1]}`; // get email extension (e.g. 'gmail.com')

    try {
        await db.use(process.env.SURREALDB_NAMESPACE, process.env.SURREALDB_MAIN_DB);

        const response = await db.query(`SELECT * FROM colleges WHERE email_extension="${email_extension}"`);

        /**
         * If the response is not empty, but the length is not 1, then somehow there are
         * multiple colleges in the database with the same email extension. This should
         * never happen, so we return a 412: Precondition Failed error.
         */

        if (response[0]['result'].length > 1) return res.sendStatus(412); // 412: Precondition Failed

        const college = response[0]['result'][0];

        res.json(college);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {get} /api/:collegeId/minors
 * @apiName Get Minors
 * @apiGroup College
 * @apiDescription Get a list of all minors for a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} collegeId - The college's id
 */

app.get('/api/colleges/:collegeId/minors', authenticateAccessToken, async (req, res) => {
    const { collegeId } = req.params; // get college id from url

    const dbId = collegeId.split(':')[1]; // get college id from url
    // TODO: Should probably parse college id first

    try {
        await db.use(process.env.SURREALDB_NAMESPACE, dbId);

        const response = await db.query('SELECT * FROM minors');

        res.json(response[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {get} /api/:collegeId/majors
 * @apiName Get Majors
 * @apiGroup College
 * @apiDescription Get a list of all majors for a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} collegeId - The college's id
 */

app.get('/api/colleges/:collegeId/majors', authenticateAccessToken, async (req, res) => {
    const { collegeId } = req.params; // get college id from url

    const dbId = collegeId.split(':')[1]; // get college id from url

    // TODO: Should probably parse college id first

    try {
        await db.use(process.env.SURREALDB_NAMESPACE, dbId);

        const response = await db.query('SELECT * FROM majors');

        res.json(response[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});

app.all('/api/health', (req, res) => res.sendStatus(200)); // ecs health check

app.listen(port);