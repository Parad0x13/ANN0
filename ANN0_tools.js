function generate_id(length) {
	let id = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for(let i = 0;i < length;i++)
		id += possible.charAt(Math.floor(Math.random() * possible.length));

	return id;
}