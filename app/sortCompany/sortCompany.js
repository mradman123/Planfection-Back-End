// sort clients, services and servExecs in company
var _sort = function(company){
	try{
		// create sorted company
		var sortedCompany = company;

		// sort clients by firstName
		sortedCompany.clients = sortedCompany.clients.sort(function(a, b){

			return (a.firstName > b.firstName) - (a.firstName < b.firstName);
		});

		// sort services by name
		sortedCompany.services = sortedCompany.services.sort(function(a, b){

			return (a.name > b.name) - (a.name < b.name);
		});

		// sort services by name
		sortedCompany.servExecs = sortedCompany.servExecs.sort(function(a, b){

			return (a.name > b.name) - (a.name < b.name);
		});

		// return sorted company
		return sortedCompany;
	}
	catch(error){
		return company;
	}
}

// export company request functions
module.exports = {

	Sort: _sort
}