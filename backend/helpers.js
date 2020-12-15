const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount['project_id']}.firebaseio.com`,
});

module.exports = {
    getTag(language) {
        switch(language) {
            case 'python':
                return 'palcode/python:' + (process.env.PAL_PYTHON_VERSION || '3.9.1');
            case 'nodejs':
                return 'palcode/node:' + (process.env.PAL_NODEJS_VERSION || '14.15.1');
            case 'bash':
                return 'palcode/bash:' + (process.env.PAL_BASH_VERSION || '1.0.0');
        }
    },
    getLanguageDefaultFile(language) {
        switch (language) {
            case 'python':
                return 'index.py';
            case 'nodejs':
                return 'index.js';
            case 'bash':
                return 'main.sh';
        }
    },
    isValidLanguage(language) {
        return ['python', 'nodejs', 'bash'].includes(language);
    },
    getStorageRoot() {
        return process.env.PAL_STORAGE_ROOT;
    },
    getFirebase() {
        return admin;
    }
}
