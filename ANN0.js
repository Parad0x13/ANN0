let stage;
let visualConnections = [];

class ANN {
	// [TODO] Create a better name than constantValue, there's gotta be a correct term for this
	constructor(_constantValue = null) {
		this.constantValue = _constantValue;
		this.id = generate_id(3);
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
}

function attemptConnection() {
	console.log("Attempting a connection");

	if(stage.selectedOutput.ANN === stage.selectedInput.ANN) {
		console.log("ANN cannot connect to itself");
		return;
	}

	stage.selectedInput.ANN.add_input(stage.selectedOutput.ANN);
}

function init() {
	stage = new createjs.Stage("canvas");
	stage.mouseMoveOutside = true;
	stage.enableMouseOver();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);

	stage.on("mousedown", function(evt) {
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
	b.icon.y = 250;

//	a.add_output(b);
}