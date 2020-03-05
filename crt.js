const CRTSH 	= "https://crt.sh/?q=%25."
const CRTSH_OUT = "&output=json"

function cleanUrl(fromDomain)
{
	url = fromDomain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
	return url;
}

function testDomainValidNamesRegExp(val) {
    let names = /^([a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)?([a-zA-Z0-9]([-a-zA-Z0-9]{0,252}[a-zA-Z0-9])?)\.([a-zA-Z]{2,63})$/;
    return names.test(val);
} 

function subdomainEnumeration(fromDomain)
{
	url = cleanUrl(fromDomain);
	if (url == "crt.sh") {return;} // remove self

	console.log("Getting subdomain from CERT on URL", url);
	let to_check = CRTSH + url + CRTSH_OUT;

	console.log("Fetching via ...", to_check);


	uniqueDomains = [];

	fetch(to_check, {
		redirect: "manual"
	}).then(function (response) {
		subdomains = [];
		if (response.status === 200) {
			response.json().then(function(data) {

				data.forEach(function(element) {
					subdomain = element["name_value"];
					if (testDomainValidNamesRegExp(subdomain)) {
						console.log(subdomain);
						subdomains.push(subdomain);
					}
				});

				const uniqueDomains = [...new Set(subdomains)]
				console.log("Found total " + uniqueDomains.length + " valid subdomains in URL " + fromDomain);
				console.log(uniqueDomains);
  				return uniqueDomains;
      		});
		}
		return false;
	}).then(function (text) {
		console.log("Text", text);
	});
}