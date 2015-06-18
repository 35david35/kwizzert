module.exports = {
    development: {
        debug: true,
        db: 'mongodb://localhost/kwizzert',
        port: 3000
    }, test: {
        debug: false,
        db: 'mongodb://localhost/kwizzert',
        port: 1300
    }, production: {

    }
};