import { resolve } from "path"

export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

// whenever we run this function, we establish a connection to the db.
// remember ".onupgradeneeded" event only runs if the browser notices that the version number in the ".open" method has changed since last time
// or if the browser has never connected to the database before and "1" is the new version
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop shop` with the version fo 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed(or if this is the first time using the database), run this method and create three object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the '_id' of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', {keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    request.onsuccess = function(e) {
      // save reference of the database to the 'db' variable
      db = request.result;
      // open a transaction do whatever we pass into the 'storeName' (must match one of the object store names)
      tx = db.transaction(storeName, 'readwrite');
      // save a reference to that object store
      store = tx.objectStore(storeName);

      // if there's any errors, let us know
      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break
        case 'delete':
          store.delete(object._id);
          break
        default:
          console.log('No valid method');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      }
    }
  });
}