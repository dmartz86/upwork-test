// This was added because else all mocha requests throw a "Error: self signed certificate" exception.
// TODO: Integrate 'rejectUnauthorized: false' to fix this.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Created by Marc Bornträger on 02.12.16.
 */
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import https = require('https');
import {Util} from './util';

// TODO: Migrate app (Nodejs) to typescript
// import app from '../assets/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Home test', () => {

    before('setup app', (done) => {
        // Setup test doesn't need to be called before each method as the test does not require a DB. Only the app
        Util.setupTest().then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('should responds with initial web page', () => {
        return chai.request('https://' + process.env.HOST_URL + ':' + process.env.HOST_PORT).get('/')
            .then(res => {
                expect(res.status).to.equal(200);
            });
    });
});
