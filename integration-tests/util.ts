/**
 * Created by marcb on 02.01.2017.
 */
import * as chai from 'chai';
import chaiHttp = require('chai-http');
const fixtures = require('pow-mongodb-fixtures').connect(process.env.MONGO_DATABASE, {host: process.env.MONGO_HOST});

chai.use(chaiHttp);

export class Util {
    public static setupTest(): any {
        return new Promise((resolve, reject) => {
            Util.waitForApp().then(() => {
                fixtures.clearAllAndLoad(__dirname + '/../migrations/data', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public static waitForApp(): any {
        return new Promise((resolve, reject) => {
            let counter: number = 0;
            setTimeout(() => {
                counter++;
                chai.request('https://' + process.env.HOST_URL + ':' + process.env.HOST_PORT).get('/')
                    .then(() => {
                        resolve();
                    }).catch(() => {
                    // Do nothing. The app should just continue until the counter has reached its max value
                    // If we throw the error here, then the tests will stop when the app is not reachable. We do not want that.
                });
                if (counter > 550) {
                    // Counter can't be 6 seconds, because that's the timeout already. Else an timeout exception is thrown.
                    reject('Time out. App did not start.');
                }
            }, 10)
        });
    }
}