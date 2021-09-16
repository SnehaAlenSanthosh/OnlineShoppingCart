//mongodb module
const mongoClient=require('mongodb').MongoClient
//create object
const state={
    db:null
}
//to connect when var require is called from any file
module.exports.connect= function(done){
    //url
    const url='mongodb://localhost:27017'
    //since,engine is deprecated,
    //const client =new mongoClient(url,{useUnifiedTopology:true});
    //dbname
    const dbname='shopping'
    //create connection
    mongoClient.connect(url,{useUnifiedTopology:true},(err,data)=>{
        if(err) return done(err)
        //to pass data to defined db
        state.db=data.db(dbname)
        done()
    })
}
//to get data
module.exports.get=function(){
    return state.db
}
//go to app.js to mention var db and app.
//npm i mongodb-------in terminal to install npm mongodb driver