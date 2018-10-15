let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));

describe('Donations', function (){
    // TODO
});

describe('Donations', function (){
    describe('GET /donations',  () => {
        it('should return all the donations in an array', function(done) {
            chai.request(server)
                .get('/donations')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (donation) => {
                        return { id: donation.id,
                            amount: donation.amount }
                    });
                    expect(result).to.include( { id: 1000000, amount: 1600  } );
                    expect(result).to.include( { id: 1000001, amount: 1100  } );
                    done();
                });
        });
    });
});