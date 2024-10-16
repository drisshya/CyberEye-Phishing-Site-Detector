var currentURL;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


	switch(request.method) {

		case "addUsername":
			addUsername(request.username);
			sendResponse({
			    status: true,
			    message:"sent from the background"
			});

			break;
		
		case "trustURL":
			addDomain(request.username,request.url);
			sendResponse({
			    status: true,
			    message:request.url+" trusted for "+request.username
			});

			break;

		case "setCurrentURL":
			currentURL = request.url;
			break;

		case "getCurrentURL":
			sendResponse({
			    status: true,
			    url:currentURL
			});
			
			break;

	}
});

function addUsername(username){

	var updatedUsername = [];

   	chrome.storage.local.get(['usernames'], function(data) {

   	

   	if(data.usernames){

	   	if(!data.usernames.includes(username)){

	   			updatedUsername = data.usernames;
	   			updatedUsername.push(username);
	   			chrome.storage.local.set({'usernames': updatedUsername});

	   			console.log("updated value is");
  				console.log(updatedUsername);

	   		}else{

	   			console.log('already logged');
	   		}
	   		
	   	}else{

	   		console.log("not set yet, setting");
	   		updatedUsername.push(username);
	   		chrome.storage.local.set({'usernames': updatedUsername});

	   		console.log("updated value is");
  			console.log(updatedUsername);
	   	}
   	
		
    });
}

function addDomain(username, domain){

	var updatedDomains = [];

	var key = username+"_domains";

   	chrome.storage.local.get([key], function(data) {

   	if(data[key]){

	   	if(!data[key].includes(domain)){

	   			updatedDomains = data[key];
	   			updatedDomains.push(domain);
	   			
	   			var obj= {};
				obj[key] = updatedDomains;
			
	   			chrome.storage.local.set(obj);

	   			console.log("updated the domain value is");
  				console.log(updatedDomains);

	   		}else{

	   			console.log('already logged');
	   		}
	   		
	   	}else{

	   		console.log("not set yet, setting domain ");
	   		updatedDomains.push(domain);

	   		var obj= {};
			obj[key] = updatedDomains;

	   		chrome.storage.local.set(obj);

	   		console.log("updated domain value is");
  			console.log(updatedDomains);
	   	}
   	
		
    });
}