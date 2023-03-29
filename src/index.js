
import app from './config/express.js';

import { connectSurrealDB } from './database/surreal.js';


const port = 3000;

try {
    await connectSurrealDB();
} catch (e) {
    console.error(e);
    process.exit(1);
}

app.listen(port, () => console.log(`server started on port ${port}`));