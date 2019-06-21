const express = require('express');
const nano = require("nano")('http://192.168.0.124:5984');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//set the spacing to prettify the json output when using res.json()
app.set('json spaces', 2);

// defining the main database variable.
const db = nano.use('notification');

//the main insert function. this is just a test!!
let InsertData = (body, title) => {
    if (body == "") {
        console.log('You cannot submit an empty body');
    } else {
        //define the object then define the inner value as the function varable
        var date = new Date();
        date = JSON.stringify(date)
        let data = {
            body: body,
            title: title,
            created_at: date
        };
        data.body = body
        data.title = title
        data.created_at = date
        // use the body value as an id in the database
        db.insert(data);
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

let getLastInserted = async () => {
    let body = await db.list({ include_docs: true });
    var result = body.rows.map((doc) => {
        return doc.doc;
    });
    //reversing the array to get the last created first
    result = result.reverse();
    //showing the first one ( the last created )
    console.log(result[0]);
    return result[0];

};


// This here worked perfectly using the map() function . it output the json file correctly
app.get('/', async (req, res) => {
    let body = await db.list({ include_docs: true });
    // console.log(body.rows)
    var result = body.rows.map((doc) => {
        return doc.doc;
    })
    //making it in revers order.
    result = result.sort((a, b) => { return b - a })
    res.send(result.reverse());
});

app.post('/', async (req, res) => {
    if (req.title == '' && req.body == '') {
        console.log("cannot send empty field")
    } else {
        var date = new Date();
        const body = req.body.body;
        const title = req.body.title;
        let data = {
            'body': body,
            'title': title,
            'created_at': date
        };
        // use the body value as an id in the database
        await db.insert(data);
        console.log('Data insertedd!');
        res.send("Data inserted succesfully")

    }
})


app.listen(3000, () => console.log('Running the server on port 3000'))