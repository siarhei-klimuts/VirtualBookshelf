var pg = require('pg'); 
var connectionString = process.env.DATABASE_URL;

exports.getLibraryByUser = function(userId, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id FROM libraries WHERE user_id = $1', [userId], function(err, result) {
            pgDone();
            done(err, (result && result.rows[0]) || null);
        });
    });
}

exports.getLibrarySections = function(libraryId, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id, pos_x, pos_y, pos_z FROM sections WHERE library_id = $1', [libraryId], function(err, result) {
            pgDone();
            done(err, (result && result.rows) || null);
        });
    });
}

exports.getSectionShelves = function(sectionId, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id FROM shelves WHERE section_id = $1', [sectionId], function(err, result) {
            pgDone();
            done(err, (result && result.rows) || null);
        });
    });
}

exports.getShelfBooks = function(shelfId, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id FROM books WHERE shelf_id = $1', [shelfId], function(err, result) {
            pgDone();
            done(err, (result && result.rows) || null);
        });
    });
}