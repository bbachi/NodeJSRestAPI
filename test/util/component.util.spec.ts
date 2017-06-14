import { ComponentUtil } from '../../src/util/component.util';
import * as chai from 'chai';
const expect = chai.expect;

var compUtil: ComponentUtil;
before(function initialzeComponentUtil() {
    compUtil = new ComponentUtil();
});

//This is just for testing unit test cases
describe('ComponentUtil' , () => {
    
    describe('Generate trimmed and lowercase string for any input string', () => {
        it('should trim and lower input string', function() {
            var result = compUtil.trimAndLower("tRIM AND LOWER");
            result.should.be.eql('trimandlower');
        });
    });

    describe('Read dynamic promos from the cdconstants.json file with the key eg: autopay', () => {
        it('should read array with the key autopay', () => {
            var result = compUtil.getDynamicPromos("autopay");
            result.should.be.a('array');
            expect(result).to.have.length.above(0);
        });
    });


    describe('Check image urls in the content and prepend with gmehostinfo', () => {
        it("It should check the imageurls and prepend gmehostinfo");
    });

    describe('Check dynmaic variables in the content and replace with dynamic values', () => {
        it("It should check the dynamic varibales and replace with values");
    })

    describe('Check image urls in the content and prepend with gmehostinfo', () => {
        it("It should check the imageurls and prepend gmehostinfo");
    });

    describe('Check dynmaic variables in the content and replace with dynamic values', () => {
        it("It should check the dynamic varibales and replace with values");
    })

    describe('Check image urls in the content and prepend with gmehostinfo', () => {
        it("It should check the imageurls and prepend gmehostinfo");
    });

    describe('Check dynmaic variables in the content and replace with dynamic values', () => {
        it("It should check the dynamic varibales and replace with values");
    })

    describe('Check image urls in the content and prepend with gmehostinfo', () => {
        it("It should check the imageurls and prepend gmehostinfo");
    });

    describe('Check dynmaic variables in the content and replace with dynamic values', () => {
        it("It should check the dynamic varibales and replace with values");
    })
});
