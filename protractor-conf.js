exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./protractor/**-spec.js'],

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true
    }
};
