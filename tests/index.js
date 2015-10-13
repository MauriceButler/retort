var test = require('tape'),
    createRetorter = require('../');

test('createRetorter returns a function with rawRetorts', function(t){
    t.plan(3);

    var rawRetorts = {
            foo: function(){},
            bar: function(){}
        };

    var retorter = createRetorter(rawRetorts);

    t.equal(typeof retorter, 'function', 'returned a function');
    t.equal(retorter.foo, rawRetorts.foo, 'foo was added');
    t.equal(retorter.bar, rawRetorts.bar, 'bar was added');
});

test('createRetorter combines request and response and passes as first parmeter', function(t){
    t.plan(4);

    var retorter = createRetorter(),
        testRequest = {},
        testResponse = {},
        routeFunction = retorter(function(retort, a, b){
            t.equal(retort.request, testRequest, 'request was correct instance');
            t.equal(retort.response, testResponse, 'response was correct instance');
            t.equal(a, 123, 'a param correct');
            t.equal(b, 456, 'b param correct');
        });

    routeFunction(testRequest, testResponse, 123, 456);
});

test('retort has raw functions on it and binds to request response', function(t){
    t.plan(3);

    var rawRetorts = {
            foo: function(request, response, data){
                t.equal(request, testRequest, 'request was correct instance');
                t.equal(response, testResponse, 'response was correct instance');
                t.equal(data, 123, 'data was correct');
            }
        },
        retorter = createRetorter(rawRetorts),
        testRequest = {},
        testResponse = {},
        routeFunction = retorter(function(retort){
            retort.foo(123);
        });

    routeFunction(testRequest, testResponse);
});