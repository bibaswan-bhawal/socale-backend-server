import Surreal from 'surrealdb.js';

/**
 * @api {get} /api/general/languages
 * @apiName GetLanguages
 * @apiDescription Get a list of all languages
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Object[]} languages List of languages.
 * @apiSuccess {[string]} languages.name Language name.
 */
export async function getLanguages(req, res) {
    console.time('API - getLanguages');

    try {
        await Surreal.Instance.use(process.env.SURREALDB_NAMESPACE, process.env.SURREALDB_MAIN_DB);

        const response = await Surreal.Instance.query('SELECT * FROM languages');

        res.json(response[0]['result']);
    } catch (e) {
        console.error('ERROR', e);
        res.sendStatus(500);
    }

    console.timeEnd('API - getLanguages');
}