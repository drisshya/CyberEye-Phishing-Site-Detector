	$(function() {

		populateCurrentURL();
		populateUsernameChecklist();
		
		
		
		$("#protect-username").click(function() {
		
			var username = $("#username").val().trim().toLowerCase();
		
			if(username!=""){
		
				chrome.runtime.sendMessage({
		
					method: "addUsername",
					username: username
					
				}, function(response) {
		
					  var status = response.status;
		
					  if(status){
		
						  console.log("added "+username);
					  }
		
				});
		
				location.reload();
			}
		
		});
		
		
		$("#trust-url").click(function() {
		
			var url = $("#url").val().trim();
		
			if(url!="file:///" && url!=""){
		
				$('.checkbox-input').each(function(i, obj) {
				
					if($(obj).is(":checked")){
		
						chrome.runtime.sendMessage({
		
							method: "trustURL",
							username: $(obj).attr('value'),
							url:url
							
						}, function(response) {
		
							  var status = response.status;
		
							  if(status){
		
								  console.log("added "+response.message);
							  }
						});
		
					}
					
				});
		
				location.reload();
			}
		});
		
		
		$(document.body).on('click', '.view-trusted' ,function(){
		
			var username = $(this).attr('username');
		
			viewTrustedURLS(username);
		
		});
		
		
		$(document.body).on('click', '#goback' ,function(){
			location.reload();
		});
		
		
		$(document.body).on('click', '.remove-url' ,function(){
		
			var username = $(this).attr('username');
			var url = $(this).attr('url');
			removeURL(username,url);
		});
		
		$(document.body).on('click', '.revoke-trust' ,function(){
		
			var username = $(this).attr('username');
			var url = $(this).attr('url');
			revokeTrust(username,url);
		});
		
		$(document.body).on('click', '.remove-username' ,function(){
		
			var username = $(this).attr('username');
			removeUsername(username);
		});
		
		
		});
		
		
		function populateUsernameChecklist(){
		
			chrome.storage.local.get(['usernames'], function(data) {
		
					$("#username-checkbox-list").html("");
					if(data.usernames){
						data.usernames.forEach(function(username) {
		
							var key = username+"_domains";
		
							   chrome.storage.local.get([key], function(data) {
		
							   if(data[key]){
		
								   if(data[key].includes($("#url").val())){
		
		
									$("#username-checkbox-list").append("\
									<div class='checkbox disabled'>\
										  <label><input class='checkbox-input' type='checkbox' value='"+username+"' disabled checked>"+username+"</label>\
										   <span class='label label-primary revoke-trust' username='"+username+"' url='"+$("#url").val()+"'>Revoke trust for URL</span>\
											 <span class='label label-default view-trusted' username='"+username+"'>View Trusted URLS <span class='badge'>"+data[key].length+"</span> </span>\ \
											  <span class='label label-danger remove-username' username='"+username+"'>Delete Username</span>\
									</div>");
		
		
		
									   }else{
		
										   $("#username-checkbox-list").append("\
											<div class='checkbox'>\
												  <label><input class='checkbox-input' type='checkbox' value='"+username+"'>"+username+"</label>\
													<span class='label label-default view-trusted' username='"+username+"'>View Trusted URLS <span class='badge'>"+data[key].length+"</span> </span>\
													 <span class='label label-danger remove-username' username='"+username+"'>Delete Username</span>\
											</div>");
										   }
									   
								   }else{
		
		
										   $("#username-checkbox-list").append("\
											<div class='checkbox'>\
												  <label><input class='checkbox-input' type='checkbox' value='"+username+"'>"+username+"</label>\
													<span class='label label-default view-trusted' username='"+username+"'>View Trusted URLS <span class='badge'>0</span> </span>\
													<span class='label label-danger remove-username' username='"+username+"'>Delete Username</span>\
											</div>");
										   }
		
								   });	
						});
					}
			});
		}
		
		function populateCurrentURL(){
		
			chrome.runtime.sendMessage({
		
				method: "getCurrentURL",
				
			}, function(response) {
		
				  var status = response.status;
		
				  if(status){
		
					  if(response.url!="file:///"){
		
						  $("#url").val(response.url);
		
					  }
				  }
			});
		}
		
		function viewTrustedURLS(username){
		
		
			var key = username+"_domains";
			$("#add-user-names-addresses").hide();
			$("#view-trusted-urls").show();
			$("#view-trusted-urls").append("<h2>"+username+"</h2><br>");
		
			   chrome.storage.local.get([key], function(data) {
		
			   if(data[key]){
		
				   if(data[key].length > 0){
		
					   data[key].forEach(function(url) {
		
						   $("#view-trusted-urls").append("\
							<div>\
								  <label>"+url+"</label> <span class='label label-danger remove-url' username='"+username+"' url='"+url+"'>Delete URL</span>\
						</div>");
					});	
		
				   }else{
		
					   $("#view-trusted-urls").append("<p>No trusted urls for this username/email</p>");
				   }
		
					   
			}else{
		
		
				$("#view-trusted-urls").append("<p>No trusted urls for this username/email</p>");
		
				   }
		
			   $("#view-trusted-urls").append("<br><button class='btn btn-default' id='goback'>Go Back</button>");
		
			});   
		}
		
		function removeURL(username,url){
		
			var key = username+"_domains";
		
		
			   chrome.storage.local.get([key], function(data) {
		
			   if(data[key]){
		
		
				   if(data[key].includes(url)){
		
					   var index = data[key].indexOf(url);
					if (index !== -1) data[key].splice(index, 1);
		
					var obj= {};
					obj[key] = data[key];
					
					   chrome.storage.local.set(obj);
				   }
		
				   $("#view-trusted-urls").html("");
				   $("#view-trusted-urls").hide();
				   viewTrustedURLS(username)
		
					   
			}else{
		
				$("#view-trusted-urls").html("");
				$("#view-trusted-urls").hide();
				viewTrustedURLS(username)
		
				   }
		
			});
		}
		
		
		function revokeTrust(username,url){
		
			var key = username+"_domains";
		
		
			   chrome.storage.local.get([key], function(data) {
		
			   if(data[key]){
		
		
				   if(data[key].includes(url)){
		
					   var index = data[key].indexOf(url);
					if (index !== -1) data[key].splice(index, 1);
		
					var obj= {};
					obj[key] = data[key];
					
					   chrome.storage.local.set(obj);
				   }
		
		
				   location.reload();
		
					   
			}else{
		
				location.reload();
		
				   }
		
			});
		}
		
		
		function removeUsername(username){
		
			var key = username+"_domains";
			chrome.storage.local.remove([key]);
		
			   chrome.storage.local.get(['usernames'], function(data) {
		
			   if(data.usernames){
		
		
				   if(data["usernames"].includes(username)){
		
					   var index = data['usernames'].indexOf(username);
					if (index !== -1) data['usernames'].splice(index, 1);
		
					var obj= {};
					obj['usernames'] = data['usernames'];
					
					   chrome.storage.local.set(obj);
				   }
		
		
				   location.reload();
		
					   
			}else{
		
					location.reload();
		
				   }
		
			});
		}
		