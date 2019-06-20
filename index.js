const express = require('express');
const nano = require("nano")('localhost:5984');
const app = express();

app.use(express.json());
//set the spacing to prettify the json output when using res.json()
app.set('json spaces', 2);

// defining the main database variable.
const db = nano.use('notification');

//the main insert function. this is just a test!!
let InsertData = (body) => {
    if (body == "") {
        console.log('You cannot submit an empty body');
    } else {
        //define the object then define the inner value as the function varable
        let data = { body: body };
        data.body = body
        // use the body value as an id in the database
        db.insert(data, data.body);
        console.log('inserted');
    }
}

//function to list all the entries in the database
//it seems like there is no easy workaround to get a clean JSON file without the (offset, rows, result). 
// defining the data.rows in a variable then using the variable.doc seems to get it done though. 
//An alternative is to use a View and define a function to retain the values but must be done on every database and every Key\value .
//OBS!! this never worked correctly. the thing is when using foreach() it does not retain a promise and there is no why to wait untill all the values are processed to get it to the end variable.

// let getData = async () => {
//     let body = await db.list({ include_docs: true })
//     // console.log(body.rows)
//     body.rows.forEach(async (doc) => {
//         doc = await doc.doc
//         console.log(doc)
//         res.send(doc)
//     })
//}




// This here worked perfectly using the map() function . it output the json file correctly
app.get('/', async (req, res) => {
    let body = await db.list({ include_docs: true });
    // console.log(body.rows)
    var result = body.rows.map((doc) => {
        return doc.doc;
    })
    res.send(result);
});


app.listen(3000, () => console.log('Running..'))