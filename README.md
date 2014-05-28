# retorter

A request/response wrapper for use at the very last part of your routing.

## usage

Say you have a route:

    "abc/`id`": function(request, response, tokens){

    }

To respond ok with some data in the form of JSON, you would usually have to:


    "abc/`id`": function(request, response, tokens){
        someFunction(tokens.id, function(error, data){
            response.end(JSON.stringify(data));
        });
    }

Which isn't so bad, but then handle the error case

    "abc/`id`": function(request, response, tokens){
        someFunction(function(error, data){
            if(error){
                //Log maybe?
                console.log(error);

                // set the 500 code
                response.statusCode = 500;

                // API error, so stringify it.
                response.end(JSON.stringify(error));

                return;
            }

            response.end(JSON.stringify(data));
        });
    }

Again, not terrible, but usually API routers do the same thing over and over.

With retorter, you can define a set of actions that can be performed on a request, and use them to respond without having to do all that setup every time.

    var retorter = require('retort')({
        ok: function(request, response, data){
            response.statusCode = 200;

            // We are building a JSON API, so always stringify.
            response.end(JSON.stringify(data));
        },
        error: function(request, response, error){
            console.log(error);
            response.statusCode = 500;
            response.end(JSON.stringify(error));
        }
    });

then down in a route:

    "abc/`id`": retorter(function(retort, tokens){
        someFunction(tokens.id, function(error, data){
            if(error){
                return retort.error(error);
            }

            retort.ok(data);
        });
    })

Which, if you use something like [wraperr](https://www.npmjs.org/package/wraperr) can be even tighter:

    "abc/`id`": retorter(function(retort, tokens){
        someFunction(tokens.id, wraperr(retort.ok, retort.error));
    })

You can also get access to the origininal request and response objects via the passed in retort object

    "abc/`id`": retorter(function(retort, tokens){

        retort.request

        retort.response

    })

