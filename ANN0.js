let stage;
let connections = [];

function manageConnections(ANN) {
	for(d in connections) {
		// [TODO] Find out if I really need to check both situations, can't I only do one?
		if(connections[d].name.includes(ANN.name) || connections[d].name.includes(ANN.name)) {
			connections[d].render();
		}
	}
}

class Connection {
	constructor(_output, _input) {
		this.output = _output;
		this.input = _input;
		this.name = "connection_" + this.output.name + "_" + this.input.name;
		this.render();
	}

	render() {
		let inputLoc = this.input.localToGlobal(0, 0);
		let outputLoc = this.output.localToGlobal(0, 0);

		let connection = stage.getChildByName(this.name);
		if(connection == null)connection = new createjs.Shape();
		connection.name = this.name;

		connection.graphics.clear();
		connection.graphics.setStrokeStyle(3).beginStroke("#FF6666");
		connection.graphics.moveTo(outputLoc.x, outputLoc.y);
		connection.graphics.lineTo(inputLoc.x, inputLoc.y);
		connection.graphics.endStroke();

		stage.addChild(connection);
		stage.setChildIndex(connection, 0);
	}
}

class ANN {
	// [TODO] Create a better name than constantValue, there's gotta be a correct term for this
	constructor(_constantValue = null) {
		this.constantValue = _constantValue;
		this.name = generate_id(3);
		this.inputs = [];
		this.input_weights = [];
		this.outputs = [];
		this.updateIcon();
	}

	updateIcon() {
		let x = 0, y = 0;

		if(this.icon != null) {
			x = this.icon.x;
			y = this.icon.y;
			stage.removeChild(this.icon);
		}

		this.icon = createANNIcon(this);
		stage.addChild(this.icon);
	}

	// [TODO] Find a better name for value(), there's gotta be an actual term for this
	value() {
		// Can be one of two things:
		// 1. Static value
		// 2. Value determined by equation weighing inputs
		if(this.constantValue != null) {
			return this.constantValue;
		}

		// Do equation here
		return 0;
	}
}

ANN.prototype.add_input = function(input) {
	// Need to do two things:
	// 1. Add to the inputs of the receiving ANN
	// 2. Add to the outputs of sending ANN
	this.inputs.push(input);
	this.input_weights.push(1.0);
	input.outputs.push(this);

	this.updateIcon();
	input.updateIcon();

	let connection = new Connection(stage.selectedOutput, stage.selectedInput);
	connections.push(connection);
	manageConnections(this);
}

function attemptConnection() {
	console.log("Attempting a connection");

	let input = stage.selectedInput.ANN;
	let output = stage.selectedOutput.ANN;

	if(output == input) {
		console.log("ANN cannot connect to itself");
		return;
	}

	input.add_input(output);
}

function init() {
	stage = new createjs.Stage("canvas");
	stage.mouseMoveOutside = true;
	stage.enableMouseOver();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);

	/*stage.on("mousedown", function(evt) {
		let object = evt.currentTarget.stage.getObjectUnderPoint(evt.stageX, evt.stageY);
		if(object != null && object.name.includes("output")) {
			stage.selectedOutput = object;
		}
	});

	stage.on("pressup", function(evt) {
		let object = evt.currentTarget.stage.getObjectUnderPoint(evt.stageX, evt.stageY);
		if(object != null && object.name.includes("input")) {
			stage.selectedInput = object;
			attemptConnection();
		}
	});

	a = new ANN(111);
	a.icon.x = 200;
	a.icon.y = 250;

	b = new ANN(222);
	b.icon.x = 500;
	b.icon.y = 250;*/

	let connectorManager = new test_ConnectorManager(stage);

	let connectorA = new test_Connector();
	connectorA.setLoc(200, 200);

	let connectorB = new test_Connector();
	connectorB.setLoc(500, 300);

	connectorManager.add(connectorA);
	connectorManager.add(connectorB);

//	a.add_output(b);
}