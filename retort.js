function createRetort(request, response, fn){
    return function(){
        var args = [].slice.call(arguments);

        args = [request, response].concat(args);

        fn.apply(null, args);
    };
};

function Retorter(retorts){
    this.retorts = {
        ok: this.ok
        forbidden: this.forbidden
        unauthorised: this.unauthorised
        error: this.error
        redirect: this.redirect
    };

    if(retorts){
        for(var key in retorts){
            this.retorts[key] = retorts[key];
        }
    }
}
Retorter.prototype.ok = function(request, response, data){
    response.writeHead(200);
    response.end(data);
};
Retorter.prototype.forbidden = function(request, response, message){
    response.writeHead(403, message);
    response.end();
};
Retorter.prototype.unauthorised = function(request, response, message){
    response.writeHead(301, message);
    response.end();
};
Retorter.prototype.error = function(request, response, error){
    response.writeHead(500);
    response.end(data);
};
Retorter.prototype.redirect = function(request, response, location){
    response.writeHead(301, {Location: location});
    response.end();
};
Retorter.prototype.retort = function(request, response){
    var retorts = {};

    for(var key in this.retorts){
        retorts[key] = createRetort(request, response, this.retorts[key]);
    }

    response.retort = retorts;
};

module.exports = Retorter;