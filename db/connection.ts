import { connect } from 'mongoose';

async function setDBConnection(){
    var DB_CONN_STRING: string = process.env.DB_CONN_STRING || '';
    await connect(DB_CONN_STRING);
}

export { setDBConnection }