$(function() {

	var currenturl = window.location;
	var sitebaseUrl = currenturl.protocol + "//" + currenturl.host + "/" + currenturl.pathname.split('/')[0];


	chrome.runtime.sendMessage({

		method: "setCurrentURL",
		url:sitebaseUrl
		
	});

	$('input').keyup(function() {


		var value = $(this).val().toLowerCase();

		if(value != ""){

			chrome.storage.local.get(['usernames'], function(data) {

				if(data.usernames.includes(value)){

					if(sitebaseUrl=="file:///"){

						$("*").hide();
						alert("This file is executing from your computer, not the internet, and could be sending your data elsewhere.\n\nThis is likely to be a phishing attempt. If you are a developer trying to run your local stript, we recommend using localhost.");

					}else{

						chrome.storage.local.get([value+'_domains'], function(data) {

							

							if(!(value+'_domains' in data)){

								

								$("*").hide();

								alert("This URL ('"+sitebaseUrl+"') is not one of your trusted urls with this username/email.\n\nThis could be a phishing attempt or you simply haven't added the URL to your trusted URLS yet.\n\nPlease open the Don't Phish Me extension and add it to your trusted URLs, then reload the page, in order to continue.")
		
							}

							else if(!data[value+'_domains'].includes(sitebaseUrl)){

								$("*").hide();

								alert("This URL ('"+sitebaseUrl+"') is not one of your trusted urls.\n\nThis could be a phishing attempt or you simply haven't added the URL to your trusted URLS yet.\n\nPlease open the Don't Phish Me extension and add it to your trusted URLs, then reload the page, in order to continue.")
								
							}
						});
					}
				}

			})
		}
	});
});