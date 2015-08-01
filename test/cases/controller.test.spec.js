(function() {
    'use strict';

    var common = require("../common");
    var options = common.options;
    var assert = common.assert;
    var testingUtil = common.testingUtil;
    var util = common.util;
    var _ = common._;
    var mockGulpDest = common.mockGulpDest;
    var gulp = common.gulp;

    function beforeEach() {
        process.chdir(__dirname);
        testingUtil.mockPrompt({
                    module: 'module1',
                    fileName: 'default',
                    spec: true
                });
                util.setRuntimeMode('TEST');
    }

    it('should put the controller file in the correct directory', function(done) {
        beforeEach();
        gulp.start('controller').once('stop', function() {
            assert.that(mockGulpDest.basePath()).is.endingWith('src/app/components/module1');
            done();
        });
    });
    it('should put the correct controller filename', function(done) {
        beforeEach();
        gulp.start('controller').once('stop', function() {
            var files = [];
            // _.each(mockGulpDest.files(), function (item) {
            //   console.log('mockGulpDest', item);
            // });
            mockGulpDest.assertDestContains('default-controller.js');
            mockGulpDest.assertDestContains('default-controller.spec.js');
            done();
        });
    });

})();
