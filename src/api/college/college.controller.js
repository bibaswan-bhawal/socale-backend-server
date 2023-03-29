import Surreal from 'surrealdb.js';

/**
 * @api {get} /api/colleges/college/byEmail
 * @apiName College by Email
 * @apiDescription Get the college information for the provided email address
 * @apiVersion 1.0.0
 * 
 * @apiQuery {String} email - The user's email address
 */
export async function getCollegeDataByEmail(req, res) {
    console.time('API - getCollegeByEmail');

    const { email } = req.query; // get email from query

    if (!email) return res.sendStatus(406); // no email provided in query string (406: Not Acceptable)
    if (!email.split('@')[0].length) return res.sendStatus(412); //  malformed email: no email extension (412: Precondition Failed)
    if (email.split('@')[0].length <= 0) return res.sendStatus(412); //  malformed email: no email username (412: Precondition Failed)

    const email_extension = `@${email.split('@')[1]}`; // get email extension (e.g. 'gmail.com')

    try {
        await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, process.env.SURREALDB_MAIN_DB);

        const response = await Surreal.Instance.query(`SELECT * FROM colleges WHERE email_extension="${email_extension}"`);

        /**
         * If the response is not empty, but the length is not 1, then somehow there are
         * multiple colleges in the database with the same email extension. This should
         * never happen, so we return a 412: Precondition Failed error.
         */

        if (response[0]['result'].length > 1) return res.sendStatus(412); // 412: Precondition Failed
        if (response[0]['result'].length == 0) return res.sendStatus(404); // 404: Not Found

        const college = {
            id: response[0]['result'][0]['id'],
            name: response[0]['result'][0]['name'],
            profile_url: response[0]['result'][0]['profile_url'],
            short_name: response[0]['result'][0]['short_name'],
            community_name: response[0]['result'][0]['community_name'],
            email_extension: response[0]['result'][0]['email_extension'],
            fun_fact: response[0]['result'][0]['fun_facts'][Math.floor(Math.random() * response[0]['result'][0]['fun_facts'].length)]
        }

        res.json(college);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - getCollegeByEmail');
}

/**
 * @api {get} /api/:collegeId/minors
 * @apiName Get Minors
 * @apiGroup College
 * @apiDescription Get a list of all minors for a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} collegeId - The college's id
 */

export async function getMinors(req, res) {
    console.time('API - getMinors');

    const { collegeId } = req.params; // get college id from url

    const dbId = collegeId.split(':')[1]; // get college id from url
    // TODO: Should probably parse college id first

    try {
        await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, dbId);

        const response = await Surreal.Instance.query('SELECT * FROM minors');

        res.json(response[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - getMinors');
}

/**
 * @api {get} /api/:collegeId/majors
 * @apiName Get Majors
 * @apiGroup College
 * @apiDescription Get a list of all majors for a college
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} collegeId - The college's id
 */

export async function getMajors(req, res) {
    console.time('API - getMajors');

    const { collegeId } = req.params; // get college id from url

    const db = collegeId.split(':')[1]; // get college id from url


    try {
        await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, db);

        const response = await Surreal.Instance.query('SELECT * FROM majors');

        res.json(response[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - getMajors');
}
