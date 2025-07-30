import pg from "pg";
import env from "dotenv"
import express from "express";
  env.config();


const db=new pg.Pool({
connectionString:process.env.CONECTION_STRING,
ssl:{
  rejectUnauthorized: false,
  require: false
},
max:40,
idleTimeoutMillis:3000,
connectionTimeoutMillis: 190000

})
db.on('error', (err, client) => {
  console.error('Unexpected error on an idle client in the pool:', err);
});


export default db;
