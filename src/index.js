import express from 'express';
import dotenv from 'dotenv';

import { db } from './database/surreal.js';
import { authenticateAccessToken } from './auth.js';
import { sendCollegeVerificationEmail, addUserToCollege } from './lambda_functions.js';

dotenv.config();

const app = express();
const port = 3000;

/**
 * @api {get} /api/get_minors
 * @apiName Get minors
 * @apiDescription Get a list of all minors for a college
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} college - the users college
 */

app.get('/api/get_minors', authenticateAccessToken, async (req, res) => {
    const college = req.headers['college'];

    try {
        await db.signin({ user: process.env.SURREALDB_USERNAME, pass: process.env.SURREALDB_PASSWORD });
        await db.use(process.env.SURREALDB_NAMESPACE, college);

        const minors = await db.query('SELECT id,name FROM minors');

        res.json(minors[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {get} /api/get_majors
 * @apiName Get majors
 * @apiDescription Get a list of all majors for a college
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} college - the users college
 */

app.get('/api/get_majors', authenticateAccessToken, async (req, res) => {
    const college = req.headers['college'];

    try {
        await db.signin({ user: process.env.SURREALDB_USERNAME, pass: process.env.SURREALDB_PASSWORD });
        await db.use(process.env.SURREALDB_NAMESPACE, college);

        const majors = await db.query('SELECT id,name FROM majors');

        res.json(majors[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


/**
 * @api {get} /api/verify_college_email
 * @apiName Verify College Email
 * @apiDescription Verify whether a user's email address is a valid college email address
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} email - The user's email
 */
app.get('/api/verify_college_email', authenticateAccessToken, async (req, res) => {
    const email = req.headers['email'];

    const email_extension = email.split('@')[1];

    try {
        await db.signin({ user: process.env.SURREALDB_USERNAME, pass: process.env.SURREALDB_PASSWORD }); // log into surreal db
        await db.use(process.env.SURREALDB_NAMESPACE, 'app'); // get college details

        const response = await db.query(`SELECT * FROM colleges WHERE email_extension='${email_extension}'`);

        const college = response[0].result;

        res.json(college);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});

app.get('/api/add_user_to_college', authenticateAccessToken, async (req, res) => {
    const userId = req.headers['username'];
    const college = req.headers['college'];

    try {
        const response = await addUserToCollege(userId, college); // send request to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

});


/**
 * @api {get} /api/send_college_verify_email
 * @apiName Send College Verification Email
 * @apiDescription Send a verification email to a user's college email address
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} `email - The user's email address
 * @apiHeader {String} code - The verification code
 */
app.get('/api/send_college_verify_email', authenticateAccessToken, async (req, res) => {
    const email = req.headers['email']; // get email from header
    const code = req.headers['code'];   // get code from header

    console.log(`request to send email to ${email} with code ${code}`);

    try {
        const response = await sendCollegeVerificationEmail(email, code); // send email to lambda function
        res.sendStatus(response.statusCode);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }
});


app.get('/api/health', (req, res) => res.sendStatus(200)); // ecs health check

app.listen(port);