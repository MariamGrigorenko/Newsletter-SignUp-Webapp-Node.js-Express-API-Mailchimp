const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
// const path = require("path");
const https = require("https");

const app = express();

// *** Body Parser ***
app.use(bodyParser.urlencoded({ extended: true }));

// *** Static Folder ***
app.use(express.static(__dirname + "/public"));
// app.use("/public", express.static(path.join(__dirname, "public")));

// *** Tracking HTML File ***
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});


mailchimp.setConfig({
  apiKey: "{YOUR API KEY}",
  server: "{YOUR SERVER NUMBER => usxx}",
});

// *** Signup Route ***
app.post("/", function (req, res) {

  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  const listId = "{YOUR LIST ID}";

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },

      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log("Something went wrong.");
      res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.post("/success.html", function(req, res) {
  res.redirect("/");
})

app.post("/failure.html", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 4000, function () {
  console.log("Server started on port: 4000!");
  });
