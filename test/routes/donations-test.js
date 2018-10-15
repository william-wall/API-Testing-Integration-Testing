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
    describe('POST /donations', function () {
        it('should return confirmation message and update datastore', function(done) {
            let donation = {
                paymenttype: 'Visa' ,
                amount: 1200,
                upvotes: 0
            };
            chai.request(server)
                .post('/donations')
                .send(donation)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Donation Added!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/donations')
                .end(function(err, res) {
                    let result = _.map(res.body, (donation) => {
                        return { paymenttype: donation.paymenttype,
                            amount: donation.amount };
                    }  );
                    expect(result).to.include( { paymenttype: 'Visa', amount: 1200  } );
                    done();
                });
        });  // end-after
    });
    describe('PUT /donations/:id/vote',  () => {
        it('should return a message and the donation upvoted by 1', function(done) {
            chai.request(server)
                .put('/donations/1000001/vote')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let donation = res.body.data ;
                    expect(donation).to.include( { id: 1000001, upvotes: 3  } );
                    done();
                });
            it('should return a 404 and a message for invalid donation id', function(done) {
                chai.request(server)
                    .put('/donations/1100001/vote')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'Invalid Donation Id!');
                        done();
                    });
            });
        });
    });

});