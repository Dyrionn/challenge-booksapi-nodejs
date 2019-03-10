const serviceUtil = require('../dist/utils/service-utils')
const assert = require('assert');


describe('service-utils', function(){

    describe('findNumberAroundTag', function(){

        it('dummy ', function() {
            assert.equal(1,1);
        })

        it('uppercase happy path that should always pass', function() {
            
            let textSample = "bfufii fh& &5% % ISBN1234567890123 gvhUUB";
            let stringToFind = "ISBN";

            assert.equal(serviceUtil.findNumberAroundTag(textSample, stringToFind, false), "1234567890123");
        })

        it('lowercase happy path that sould always pass', function() {
            
            let textSample = "bfufii fh& &5A a ISBN1234567890123 gvhUUB";
            let stringToFind = "isbn";

            assert.equal(serviceUtil.findNumberAroundTag(textSample, stringToFind, false), "1234567890123");
        })

        it('lowercase happy path using reverse search flag', function() {
            
            let textSample = 'test ui number 1234567890123 ISBN gvhUUB';
            let stringToFind = "isbn";

            assert.equal(serviceUtil.findNumberAroundTag(textSample, stringToFind, true), "1234567890123");
        })

        it('not found string', function() {
            
            let textSample = "bfufii fh& &5% % ABCDE1234567890123 gvhUUB";
            let stringToFind = "isbn";


            assert.notEqual(serviceUtil.findNumberAroundTag(textSample, stringToFind, false), "1234567890123");
        })

        it('find string but finds no numbers after it', function() {
            
            let textSample = "bfufii fh& &5% % ISBN  gvhUUB";
            let stringToFind = "isbn";

            assert.equal(serviceUtil.findNumberAroundTag(textSample, stringToFind, false), "");
        })
    })
})