## testing

\$ NODE_ENV=test node index.js

## uploads

\$ git push heroku master

## schema design in MongoDB

https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1

# express.json()

Here is the explanation that should clear doubts on express.json() and express.urlencoded() and the use of body-parser. It took me some time to figure this out.

What is Middleware? It is those methods/functions/operations that are called BETWEEN processing the Request and sending the Response in your application method.

When talking about express.json() and express.urlencoded() think specifically about POST requests (i.e. the .post request object) and PUT Requests (i.e. the .put request object)

You DO NOT NEED express.json() and express.urlencoded() for GET Requests or DELETE Requests.

You NEED express.json() and express.urlencoded() for POST and PUT requests, because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request

Express provides you with middleware to deal with the (incoming) data (object) in the body of the request.

a. express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());

b. express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());

ALTERNATIVELY, I recommend using body-parser (it is an NPM package) to do the same thing. It is developed by the same peeps who built express and is designed to work with express. body-parser used to be part of express. Think of body-parser specifically for POST Requests (i.e. the .post request object) and/or PUT Requests (i.e. the .put request object).

In body-parser you can do

// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(bodyParser.urlencoded({ extended: false }));
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(bodyParser.urlencoded({ extended: true }));
shareimprove this answer
answered Aug 14 '18 at 14:53

Kean Amaral
1,17711 gold badge88 silver badges77 bronze badges
12
If you are using Express >= 4.16.0, body parser has been re-added under the methods express.json() and express.urlencoded(). – David Ferreira Mar 16 '19 at 17:58
4
app.use(bodyParser.urlencoded({ extended: true })); does not combine app.use(bodyParser.json()); and app.use(bodyParser.urlencoded({ extended: false }));: it does not handle application/json but only application/x-www-form-urlencoded. The extended options is used to specify whether bodyParser should parse URL-encoded data with qs (extended: true) or querystring (extended: false). – kimamula Jun 9 '19 at 4:14

## nodemailer

mailtemplate.js

href="http://localhost:3000/verify/${temporarytoken}"
href="https://yo.roozen.nl/verify/${temporarytoken}"
href="https://hetkookt.netlify.app/verify/${temporarytoken}"
