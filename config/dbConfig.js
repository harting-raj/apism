export default {
    HOST: 'localhost',
    USER: 'mr-rsr',
    PASSWORD: 'Mrrsr@01',
    DB: 'smartbox',
    dialect: 'mysql',
    port: 3306,
    connectionLimit: 10,

    pool: {
        max: 5, // maximum number of connection in pool
        min: 0, // minimum number of connection in pool
        acquire: 60000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
    }
}