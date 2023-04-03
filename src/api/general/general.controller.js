import Surreal from 'surrealdb.js';

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