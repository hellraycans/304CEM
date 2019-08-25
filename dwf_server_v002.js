var http = require('http');
var fs = require("fs");
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";



http.createServer(function(request, response) {
	

	//Homepage
	if(request.url === "/index"){
			sendFileContent(response, "index.html", "text/html");
		}
		else if(request.url === "/"){
			console.log("Requested URL is url" +request.url);
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
		}

	//reg
		else if(request.url==="/reg"){

			if (request.method === "POST") {
				console.log("reg");
				formData = '';
				msg = '';

			return request.on('data', function(data) {
			formData += data;

			console.log(formData);

				return request.on('end', function() {
					var user;
					user = qs.parse(formData);
					msg = JSON.stringify(user);


					info=formData.split("&");
					var a = [];
					for(i=0; i<info.length; i++){

					var d=info[i].split("=");

					a[i] = d[1];
					}

					console.log(a[0]);
					console.log(a[1]);


					stringMsg = JSON.parse(msg);
					MongoClient.connect(dbUrl, function(err, db) {

  						if (err) throw err;

						var dbo = db.db("logindb");

						var myobj = stringMsg;

						dbo.collection("users").findOne({"login":a[0]}, function(err, result) {
    					if (err) throw err;
    					console.log(result);

    					//check loginID

    					//if (result!=""){
    					if (result!=null){
							console.log("exist");
							response.end("User exist.");
						} else {
						dbo.collection("users").insertOne(myobj, function(err, res) {

    					if (err) throw err;

						console.log("1 document inserted");
						response.end("Created.")
						

						});

					}
					db.close();	
				});


				});

			});
			});

			} else {
			//form = publicPath + "ajaxSignupForm.html";
			sendFileContent(response, "index.html", "text/html");
			}
		}


		//update pw
		else if (request.url==="/updatepw"){

			if (request.method === "POST") {
			console.log("updatepw");
			formData = '';
			msg = '';
			
			return request.on('data', function(data) {
			formData += data;
			console.log(formData);


			return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            msg = JSON.stringify(user);

            info=formData.split("&");
			var a = [];
			for(i=0; i<info.length; i++){

			var d=info[i].split("=");

			a[i] = d[1];
			}

			console.log(a[0]);
			console.log(a[1]);



			MongoClient.connect(dbUrl, function(err, db) {

  			if (err) throw err;
  			var dbo = db.db("logindb");
 			var mypass = { "login":a[0] };
  			var passnewvalue = { $set: { "password":a[1]} };

  				dbo.collection("users").find(mypass).toArray(function(err, result) {
 				
    			if (err) throw err;
    			console.log(result);

    				if (result!=""){

  						dbo.collection("users").updateOne(mypass, passnewvalue, function(err, res) {
    		
    					if (err) throw err;
    					console.log("password updated");
    					response.end("Password changed.");
    		
    					db.close();

  						});
  					} else {
  						console.log("error");
    					response.end("User not exist");

  					}

				});

			});
			});
			});
		}
		}

		//get favlist
		else if(request.url==="/getfav"){

			if (request.method === "POST") {
            console.log("getfav");
			formData = '';
			msg = '';
			return request.on('data', function(data) {
			formData += data;
			console.log(formData);


			return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            msg = JSON.stringify(user);

            info=formData.split("&");
            var a = [];
            for(i=0; i<info.length; i++){

                var d=info[i].split("=");

            a[i] = d[1];
            }

            MongoClient.connect(dbUrl, function(err, db) {


			if (err) throw err;
			var dbo = db.db("logindb");
			var query = { "login":a[0] };
			
			dbo.collection("list").find(query).toArray(function(err, result) {	

    				if (err) throw err;
    				console.log(result);


    				console.log("favlist created");
    				response.end(JSON.stringify(result));

    				db.close();

  					});

					});
            
					});

				});

			}
		}



		//add fav
		else if(request.url==="/addfav"){

			if (request.method === "POST") {
            console.log("addfav");
			formData = '';
			msg = '';
			return request.on('data', function(data) {
			formData += data;
			console.log(formData);


			return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            msg = JSON.stringify(user);


            info=formData.split("&");
            var a = [];
            for(i=0; i<info.length; i++){

                var d=info[i].split("=");

            a[i] = d[1];
            }

            console.log(a[0]);
            console.log(a[1]);

       

			stringMsg = JSON.parse(msg);
            MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  						var dbo = db.db("logindb");

						var query = { "login":a[0] ,"fav":a[1] };

  					dbo.collection("list").find(query).toArray(function(err, result) {
 				
    				if (err) throw err;
    				
    				console.log(result);

    				if (result!=""){
						console.log("item exist");
						response.end("Item exist.");
						} else {

					var mylist = stringMsg;

					dbo.collection("list").insertOne(mylist, function(err, res) {

    				if (err) throw err;

    				console.log("1 item inserted");
    				response.end("Recorded!");

    				db.close();
  					});
					}
					});
            
					});

				});
			});

			}
		}

		//del fav
		else if(request.url==="/delfav"){

			if (request.method === "DELETE") {
            console.log("delfav");
			formData = '';
			msg = '';
			return request.on('data', function(data) {
			formData += data;
			console.log(formData);


			return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            msg = JSON.stringify(user);

            info=formData.split("&");
            var a = [];
            for(i=0; i<info.length; i++){

                var d=info[i].split("=");

            a[i] = d[1];
            }

            console.log(a[0]);
            console.log(a[1]);



            MongoClient.connect(dbUrl, function(err, db) {

  				if (err) throw err;

  					var dbo = db.db("logindb");

					var query = { "login":a[0] ,"fav":a[1] };
			
				dbo.collection("list").find(query).toArray(function(err, result) {
 				
    				if (err) throw err;
    				
    				console.log(result);

    					if (result==""){
						console.log("no record");
						response.end("No record.");
						} else {

  						dbo.collection("list").deleteOne(query, function(err, obj) {


    					if (err) throw err;

    					console.log("1 item deleted");
    					response.end("Remove!");

    					db.close();
							});
						}
  				});

			});

            
			});

			});

		}
		}

		//login
		else if(request.url==="/login"){

			if (request.method === "POST") {
            console.log("login");

            	//login check


            	formData = '';
				msg = '';

			return request.on('data', function(data) {
			formData += data;

			//console.log(formData);

				return request.on('end', function() {
					var user;
					user = qs.parse(formData);
					msg = JSON.stringify(user);

					info=formData.split("&");
					var a = [];
					for(i=0; i<info.length; i++){

					var d=info[i].split("=");

					a[i] = d[1];
					}

					console.log(a[0]);
					console.log(a[1]);

					stringMsg = JSON.parse(msg);

					//check PW


			MongoClient.connect(dbUrl, function(err, db) {

			if (err) throw err;
			var dbo = db.db("logindb");
			var query = { "login":a[0] ,"password":a[1] };
			
			dbo.collection("users").find(query).toArray(function(err, result) {

			//dbo.collection("users").findOne({"login":a[1]}, function(err, result) {
    					if (err) throw err;
    					console.log(result);

						//***check pw condition***

			    		if (result==""){
			    		//if (result.length==0){
						console.log("password incorrect");
						response.end("Password incorrect.");
						} else {
						console.log("success")
						return response.end("Success");	
					}


			db.close();
			
				});
			});



			});
			});

			// request.writeHead(200, {
            //  "Content-Type": "application/json",
            //  "Content-Length": msg.length
			// });
            //return request.end("okok");
            //response.end("Got it!");

			} else {
			//form = publicPath + "ajaxSignupForm.html";
			sendFileContent(response, "index.html", "text/html");

			}
	
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.bundle.min.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.min.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.jpg$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "image/jpg");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.min.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.min.css.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.min.js.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.css.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.png$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "image/png");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.ico$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/ico");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$][^.]*.ttf$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/font");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$][^.]*.woff$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/woff");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$][^.]*.ttf?spat4u$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/font");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$][^.]*.woff?spat4u$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/woff");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$][^.]*.woff2$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/woff2");
	}else if(/^\/[a-zA-Z0-9-._\/-/?/!/$]*.bundle.min.js.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}


	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
	
}).listen(9999)
console.log("server started");

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}
