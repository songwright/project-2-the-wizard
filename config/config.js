exports.configure = function(env) {
  return configs[env];
}

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  let configs = {
    "development": {
      "username": "root",
      "password": `${process.env.DB_PASSWORD}`,
      "database": "project_db",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
  //,
  // "test": {
  //   "username": "root",
  //   "password": null,
  //   "database": "database_test",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // },
  // "production": {
  //   "use_env_variable":"JAWSDB_URL"
  // }
}
