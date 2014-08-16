var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

//var ds = app.dataSources.sqlserver2014;

var ds = loopback.createDataSource('sqlserver2014_2', {
    "connector": "mssql",
    "host": "54.86.105.83",
    "port": 1433,
    "database": "aspnet-RefuelService-20140711120721",
    "username": "sa",
    "password": ""
});

// Start with INVENTORY table and follow the primary/foreign relationships to discover associated tables
ds.discoverAndBuildModels('Refuels', {visited: {}, relations: true}, function (err, models) {
 
    // Now we have an object of models keyed by the model name
    // Find the 1st record for Inventory
    models.Refuels.findOne({}, function (err, inv) {
        if(err) {
            console.error(err);
            return;
        }
        console.log("\nRefuel ", inv);
 
        // Follow the product relation to get information about the product
        //inv.product(function (err, prod) {
        //    console.log("\nRefuel: ", prod);
        //    console.log("\n ------------- ");
        //});
    });
});

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
//   var path = require('path');
//   app.use(loopback.static(path.resolve(__dirname, '../client')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
