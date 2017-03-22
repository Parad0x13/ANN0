function generate_id(length) {
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for(var i = 0;i < length;i++)
		id += possible.charAt(Math.floor(Math.random() * possible.length));

	return id;
}