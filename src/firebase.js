var admin = require("firebase-admin");
var dotenv = require("dotenv");

const fbman = {
    // init
    init: function () {
        // .envから入力する
        const result = dotenv.config()

        admin.initializeApp({
            credential: admin.credential.cert(result.parsed),
            databaseURL: result.parsed.DATABASE_URL,
        });
    },

    // add user to firebase
    addUser: async function (mail, psw) {
        let ret = {};
        ret['mail'] = mail;

        let user = await admin.auth().getUserByEmail(mail)
            .then((user) => {
                // 存在するので作ってはダメ
                ret['result'] = false;
            })
            .catch(async (error) => {
                // 存在しないので作ってOK
                await admin.auth().createUser({
                    email: mail,
                    emailVerified: false,
                    password: psw,
                })
                    .then(function (userRecord) {
                        ret['result'] = true;
                    })
                    .catch(function (error) {
                        ret['result'] = false;
                    });
            });

        return ret;
    },

    // sign in user
    checkuser: async (mail, psw) => {
        let ret = false;

        let user = await admin.auth().getUserByEmail(mail)
            .then((user) => {
                // 存在するのでOKを返す
                ret = true;
            })
            .catch(async (error) => {
                // 存在しないのでNG
                ret = false
            });

        return ret;
    },

    // add data
    adddata: (kind, data) => {
        var db = admin.firestore();

        var docRef = db.collection(`machines`);
        for (let index = 0; index < data.length; index++) {
            docRef.doc(`data${index}`).set(data[index]);
        }
    },

    // get data
    getdata: async (kind) => {
        const db = admin.firestore();
        let ret = [];

        const refs = db.collection(`machines`);
        await refs.get().then((snapshot) => {
            snapshot.forEach(doc => {
                ret.push(doc.data());
            });
        });

        // await refs.getCollections().then(async collections => {
        //     collections.forEach((collection) => {
        //         collection.get().then((snapshot) => {
        //             snapshot.forEach((doc) => {
        //                 ret.push(doc.data());
        //             });
        //         });
        //     });
        // });

        // const asyncFunc = () => {
        //     return new Promise(((resolve, reject) => {
        //         refs.getCollections().then(async collections => {
        //             await collections.forEach((collection) => {
        //                 collection.get().then((snapshot) => {
        //                     snapshot.forEach((doc) => {
        //                         ret.push(doc.data());
        //                     });
        //                 });
        //             });

        //             resolve();
        //         });
        //     }));
        // };

        return ret;
    },
};

module.exports = fbman;


