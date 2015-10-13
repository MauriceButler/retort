function createRetorter(rawRetorts){
    function retorter(fn){
        return function(request, response){
            var retorts = {};

            for(var key in retorter){
                retorts[key] = retorter[key].bind(retorter, request, response);
            }

            retorts.request = request;
            retorts.response = response;

            fn.apply(this, [retorts].concat(Array.prototype.slice.call(arguments, 2)));
        };
    }

    for(var key in rawRetorts){
        retorter[key] = rawRetorts[key];
    }

    return retorter;
}

module.exports = createRetorter;