const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const htttps = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));  //storing all the static files like css , images in a single public folder

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };


    const jsonData = JSON.stringify(data);  // for turning it into string in thr format of json


    //for posting data to the mailchimp

    const url = "https://us13.api.mailchimp.com/3.0/lists/18ba1e07f9";
    const apiKey = process.env.API_TOKEN;

    const options = {
        method: "POST",
        auth: "shriniket:"+apiKey
    }

    const request = htttps.request(url, options, function (response) {

          if  (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
          } else {
            res.send(__dirname + "/failure.html")
          }

            response.on("data", function(data) {
                console.log(JSON.parse(data));
            })
    })

    request.write(jsonData);
    request.end();



});

app.post("/failure", function(req, res) {
    res.redirect("/");
})


//for changing the the port no dynamically by the hosting service adding || 3000 for running locally 
app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port 3000");
})





