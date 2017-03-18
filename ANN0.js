var canvas = new fabric.Canvas("canvas");

class ANN {
	// [TODO] Create a better name than constantValue, there's gotta be a correct term for this
	constructor(_constantValue = null) {
		this.constantValue = _constantValue;
		this.generate_id();
		this.inputs = [];
		this.input_weights = [];
		this.outputs = [];

		this.x = 0;
		this.y = 0;
		this.width = 100;
		this.height = 100;
		this.createIcon();
	}

	generate_id() {
		var id = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		for(var i=0;i < 3;i++)
			id += possible.charAt(Math.floor(Math.random() * possible.length));

		this.id = id;
	}

	createIcon() {
		this.x = 200;
		this.y = 150;

		var main = new fabric.Rect({
			left: this.x,
			top: this.y,
			fill: "orange",
			width: this.width,
			height: this.height,
			rx: this.width * 0.1,
			ry: this.height * 0.1
		});

		var left = new fabric.Rect({
			left: this.x,
			top: this.y,
			fill: "green",
			width: 20,
			height: this.height
		});

		this.icon = new fabric.Group();
		this.icon.addWithUpdate(main);
		this.icon.addWithUpdate(left);

		this.icon.hasRotatingPoint = false;
	}

	log() {
		console.log(this.id + " = " + this.value());
		var max = Math.max(this.inputs.length, this.outputs.length);
		for(var d=0;d<max;d++) {
			var inputString = "\t   ->";
			var outputString = "->\t";
			var input_weight = "\t";
			var output_value = "\t";

			if(this.inputs.length > d) {
				inputString = "\t" + this.inputs[d].id + "->";
				input_weight = "w" + this.input_weights[d].toFixed(2);
			}
			if(this.outputs.length > d) {
				outputString = "->" + this.outputs[d].id;
				output_value = this.value();
			}

			console.log(inputString + "[" + input_weight + "\t" + output_value + "]" + outputString);
		}
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
}

ANN.prototype.add_output = function(output) {
	// Need to do two things:
	// 1. Add to the outputs of receiving ANN
	// 2. Add to the inputs of the sending ANN
	this.outputs.push(output);
	output.inputs.push(this);
	output.input_weights.push(1.0);
}

function main() {
	a = new ANN(111);
	b = new ANN(222);

	a.add_output(b);

	a.log();
	b.log();
}

main();