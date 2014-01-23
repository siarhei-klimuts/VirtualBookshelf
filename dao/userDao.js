var pg = require('pg'); 
var connectionString = process.env.DATABASE_URL;

exports.findOrCreate = function(profile, done) {
    var email = profile && profile.emails[0] && profile.emails[0].value;

    if(email) {
        getByEmail(email, function(err, user) {
            if(!user) {
                insert({email: email}, function(err, user) {
                    done(err, user || null);
                });
            } else {
                done(err, user || null);
            }
        });
    }
}

exports.getByEmail = getByEmail;
function getByEmail(email, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id FROM users WHERE email = $1', [email], function(err, result) {
            pgDone();
            done(err, result.rows[0] || null);
        });
    });
}

exports.getById = function(id, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id, email FROM users WHERE id = $1', [id], function(err, result) {
            pgDone();
            done(err, result.rows[0] || null);
        });
    });
}

exports.insert = insert;
function insert(user, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('INSERT INTO users(email) VALUES($1) RETURNING id', [user.email], function(err, result) {
            pgDone();
            user.id = result.rows[0] ? result.rows[0].id : null;
            done(err, user);
        });
    });    
}