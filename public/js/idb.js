// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'track-my-budget' amd set it to version 1
const request = indexedDB.open('track-my-budget', 1);
// this event will emit if the database version changes(nonexsitant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction', {autoIncrement: true });
};