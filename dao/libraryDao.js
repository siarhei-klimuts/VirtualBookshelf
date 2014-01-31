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

exports.saveLibrarySections = function(sections, done) {
    console.log('saveLibrarySections', sections);
    var rollback = function(client, done) {
        client.query('ROLLBACK', function(err) {
            return done(err);
        });
    };

    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('BEGIN', function(err) {
            if(err) return rollback(client, pgDone);
            process.nextTick(function() {
                var query = 'UPDATE sections SET (pos_x, pos_y, pos_z) = ($1, $2, $3) WHERE id = $4';
                for(key in sections) {

                }
                client.query(query, [100, 1], function(err) {
                    if(err) return rollback(client, pgDone);
                    client.query(query, [-100, 2], function(err) {
                        if(err) return rollback(client, pgDone);
                        client.query('COMMIT', pgDone);
                    });
                });
            });
        });
        client.query('UPDATE sections SET (pos_x, pos_y, pos_z) = ($1, $2, $3) WHERE id = $4', [section.position.x, section.position.y, section.position.z, section.id], function(err, result) {
            pgDone();
            done(err, null);
        });
    });
}

exports.getSectionShelves = function(sectionId, done) {
    pg.connect(connectionString, function(err, client, pgDone) {
        client.query('SELECT id, pos_x, pos_y, pos_z FROM shelves WHERE section_id = $1', [sectionId], function(err, result) {
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