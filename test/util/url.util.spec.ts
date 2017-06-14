import { URLBin } from '../../src/util/url.util';
import * as chai from 'chai';
const expect = chai.expect;

var urlBin: URLBin;
before(function initialzeComponentUtil() {
    urlBin = new URLBin('EN','GM','');
});

//This is just for testing unit test cases
describe('URLBin' , () => {
    
    describe('Build url with input retention arrays', () => {
        it('should build url string for retention', function() {
            var result = urlBin.buildULRForRetentionQuery(["CEN","Early Touch","Late Touch Reminder"]);
            result.should.be.a('string');
        });
    });

    describe('Build empty url with input empty retention arrays', () => {
        it('should build empty url string for empty retention', function() {
            var result = urlBin.buildULRForRetentionQuery([]);
            result.should.be.eql('');
        });
    });


    describe('Build url with input services arrays', () => {
        it('should build url string for services', function() {
            var result = urlBin.buildULRForServicesQuery(["Auto Pay","Paperless"]);
            result.should.be.a('string');
        });
    });

    describe('Build empty url with input empty services arrays', () => {
        it('should build empty url string for empty services', function() {
            var result = urlBin.buildULRForServicesQuery([]);
            result.should.be.eql('');
        });
    });

    describe('Build url with input messages arrays', () => {
        it('should build url string for messages', function() {
            var result = urlBin.buildULRForMessagesQuery(["CEN","Early Touch","Late Touch Reminder"]);
            result.should.be.a('string');
        });
    });

    describe('Build empty url with input empty messages arrays', () => {
        it('should build empty url string for empty messages', function() {
            var result = urlBin.buildULRForMessagesQuery([]);
            result.should.be.eql('');
        });
    });

    describe('Build url with component presenstation', () => {
        it('should build component presentations', function() {
            var result = urlBin.buildUrlforComponentPresentations('http://txaixebxindxd01:13180/cd-service/gme/cdws/odata.svc/Components(ItemId=7144,PublicationId=123)');
            result.should.be.a('string');
        });
    });

    describe('Build empty url with component presenstation', () => {
        it('should build empty component presentations', function() {
            var result = urlBin.buildUrlforComponentPresentations('');
            result.should.be.eql('');
        });
    });
});
