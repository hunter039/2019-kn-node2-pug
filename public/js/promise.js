function init() {
    var date = getDays().then(function(d){
        console.log(d.getDay());
    });
}

function getDays(fn) {
    var d = new Date();
    var promise = new Promise(function(resolve, reject){
        resolve(d);
    });
    
}