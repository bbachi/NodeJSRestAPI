import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
const expect = chai.expect;

var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(chaiHttp);



//This is just for testing unit test cases
describe('testing unit testing with dummy url', () => {
  it('should get the offer', function(done) {
        var result = chai.request('http://localhost:3080')
            .get('/gme/test')
            .end((err:any, res:any) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('dataAvailable').eql(true);
                done();
            });
    });
});


//This is override get url::should get the override offer if override present in the sdl
describe('override url with get request', () => {
  it('should get the override offer if present in sdl:::should be one object array', function(done) {
      var result = chai.request('http://localhost:3080')
            .get('/gme/override')
            .end((err:any, res:any) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('dataAvailable');
                var dataAvailable = res.body.dataAvailable;
                console.log("is data available:::::::"+dataAvailable);
                if(dataAvailable){
                    console.log("override offer is present in sdl, so validating result");
                    res.body.should.have.property('offerList').be.a('array');
                    var offerList = res.body.offerList;
                    expect(offerList).to.have.length(1);
                    expect(offerList[0]).to.have.all.keys(['content','name']);
                }else{
                    console.log("override offer is not present in sdl");
                }
                done();
            });
    });
});