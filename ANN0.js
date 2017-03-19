var canvas = new fabric.Canvas("canvas");

// In Fabric.js I couldn't find a way to easily grab the absolute location of an object on the canvas if it belongs to a group
// Because of this I have to figure it out manually by iterating the group chain and calculating everything myself... very annoying
// [TODO] Get rid of this whole thing and do it in a better way...
function test(object, offsetX = 0, offsetY = 0) {
	console.log("Attempting to find absolute location of:");
	console.log(object);
	var x = object.left;
	var y = object.top;

	if(object.group != null) {
		return test(object.group, x, y);
	}

	return x + offsetX;
}

canvas.observe('mouse:down', function(options) {
	pos = canvas.getPointer(options.e);
	console.log(options);
	//console.log("POSITION" + pos);
	//console.log(options.target);
	activeObj = canvas.getActiveObject();
	if(activeObj != null && activeObj._objects != null) {
		for(d in activeObj._objects) {
			if(activeObj._objects[d].id == "input") {
				console.log("Clicked: " + pos.x + ", " + pos.y);
				console.log(test(activeObj._objects[d]));
				//console.log(pos);
				//console.log(activeObj._objects[d]);
				//console.log("pressed input");
			}
		}
	}
	//console.log(activeObj._objects[0]);
	/*if(Math.abs(pos.x - activeObj.left) < 10 && Math.abs(pos.y - activeObj.top) < 30 && Math.abs(pos.y - activeObj.top) > 10) {
		console.log("connector selected");
	}*/
});

class ANN {
	// [TODO] Create a better name than constantValue, there's gotta be a correct term for this
	constructor(_constantValue = null) {
		this.constantValue = _constantValue;
		this.generate_id();
		this.inputs = [];
		this.input_weights = [];
		this.outputs = [];
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
		var x = 0;
		var y = 0;
		var width = 100;
		var height = 100;

		var main = new fabric.Rect({
			left: x,
			top: y,
			fill: "orange",
			width: width,
			height: height,
			rx: width * 0.1,
			ry: height * 0.1
		});
		main.id = "main";

		var name = new fabric.Text(this.id, {
			fontSize: width * 0.1
		});
		name.top = y + name.height / 2;
		name.left = x + width / 2 - name.width / 2;
		name.id = "name";

		var value = new fabric.Text(String(this.value()), {
			fontSize: width * 0.15
		});
		value.top = y + height / 2 - value.height / 2;
		value.left = x + width / 2 - value.width / 2;
		value.id = "value";

		// Time to add inputs!

		var inputs = [];
		var inputCount = this.inputs.length;
		for(var d=0;d<inputCount+1;d++) {
			var widgetHeight = 7;
			var widgetWidth = 20;
			var widgetRadius = 7;
			var bar = new fabric.Rect({
				left: x - widgetWidth,
				top: y,
				fill: "#334455",
				width: widgetWidth,
				height: widgetHeight
			});
			var connector = new fabric.Circle({
				left: bar.left - widgetRadius,
				top: bar.top - widgetRadius + bar.height / 2,
				radius: widgetRadius,
				fill: "#334455"
			});
			connector.id = "input";
			connector.index = d;

			inputs.push(bar);
			inputs.push(connector);
		}

		// Time to add outputs!

		//

		this.icon = new fabric.Group();
		this.icon.addWithUpdate(main);
		this.icon.addWithUpdate(name);
		this.icon.addWithUpdate(value);
		for(d in inputs) {
			this.icon.addWithUpdate(inputs[d]);
		}

		this.icon.hasRotatingPoint = false;
		this.icon.setControlsVisibility({mt: false, mb: false, ml: false, mr: false, bl: false, br: false, tl: false, tr: false, mtr: false});
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
	a.icon.left = 100;
	a.icon.top = 100;
	canvas.add(a.icon);

//	b = new ANN(222);
//	b.icon.left = 500;
//	b.icon.top = 150;
//	canvas.add(b.icon);

//	a.add_output(b);

//	a.log();
//	b.log();
}

main();