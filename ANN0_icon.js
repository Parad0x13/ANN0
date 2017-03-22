// [TODO] Make it so that I don't recreate the icon every time. Simply update it
function createANNIcon(ANN) {
	let retVal = ANN.icon;
	if(retVal == null)retVal = new createjs.Container();

	let w = 100;
	let h = 100;
	let rad = w * 0.1;

	let main = retVal.getChildByName("main");
	if(main == null)main = new createjs.Shape();
	main.name = "main";
	main.graphics.clear();
	main.graphics.beginFill("#69AB57").drawRoundRect(0, 0, w, h, rad, rad, rad, rad);
	retVal.addChild(main);

	let left = retVal.getChildByName("left");
	if(left == null)left = new createjs.Shape();
	left.name = "left";
	left.graphics.clear();
	left.graphics.beginFill("#96B562").drawRect(0, 0, rad, h);
	left.mask = main;
	retVal.addChild(left);

	let right = retVal.getChildByName("right");
	if(right == null)right = new createjs.Shape();
	right.name = "right";
	right.graphics.clear();
	right.graphics.beginFill("#4D9A5B").drawRect(0, 0, rad, h);
	right.setTransform(w - rad, 0);
	right.mask = main;
	retVal.addChild(right);

	let inputCount = ANN.inputs.length + 1;
	for(let d = 0;d < inputCount;d++) {
		let barLength = 25, barHeight = 7;
		let offsetY = (-barHeight / 2) + (h / (inputCount + 1));

		let barName = "input_bar" + String(d);
		let bar = retVal.getChildByName(barName);
		if(bar == null)bar = new createjs.Shape();
		bar.name = barName;
		bar.graphics.clear();
		bar.graphics.beginFill("#C5C370").drawRect(0, 0, barLength, barHeight);
		bar.setTransform(-barLength, (d + 1) * offsetY);
		retVal.addChild(bar);

		let circleRadius = 8;

		let inputName = "input" + String(d);
		let input = retVal.getChildByName(inputName);
		if(input == null)input = new createjs.Shape();
		input.name = inputName;
		input.graphics.clear();
		input.graphics.beginFill("#C5C370").drawCircle(0, 0, circleRadius);
		input.setTransform(bar.x, bar.y + barHeight / 2);
		input.ANN = ANN;
		retVal.addChild(input);

		input.on("mouseover", function(evt) {
			createjs.Tween.get(input, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
		});

		input.on("mouseout", function(evt) {
			createjs.Tween.get(input, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 500, createjs.Ease.bounceOut);
		});
	}

	let outputCount = ANN.outputs.length + 1;
	for(let d = 0;d < outputCount;d++) {
		let barLength = 25, barHeight = 7;
		let offsetY = (-barHeight / 2) + (h / (outputCount + 1));

		let barName = "output_bar" + String(d);
		let bar = retVal.getChildByName(barName);
		if(bar == null)bar = new createjs.Shape();
		bar.name = barName;
		bar.graphics.clear();
		bar.graphics.beginFill("#3F8C71").drawRect(0, 0, barLength, barHeight);
		bar.setTransform(w, (d + 1) * offsetY);
		retVal.addChild(bar);

		let circleRadius = 8;

		let outputName = "output" + String(d);
		let output = retVal.getChildByName(outputName);
		if(output == null)output = new createjs.Shape();
		output.name = outputName;
		output.graphics.clear();
		output.graphics.beginFill("#3F8C71").drawCircle(0, 0, circleRadius);
		output.setTransform(bar.x + barLength, bar.y + barHeight / 2);
		output.ANN = ANN;
		retVal.addChild(output);

		output.on("mouseover", function(evt) {
			createjs.Tween.get(output, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
		});

		output.on("mouseout", function(evt) {
			createjs.Tween.get(output, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 500, createjs.Ease.bounceOut);
		});
	}

	retVal.on("mousedown", function(evt) {
		retVal.touchLocationX = evt.stageX - evt.currentTarget.x;
		retVal.touchLocationY = evt.stageY - evt.currentTarget.y;

		retVal.canMove = true;
		let objectName = evt.currentTarget.stage.getObjectUnderPoint(evt.stageX, evt.stageY).name;
		if(objectName.includes("input") || objectName.includes("output")) {
			retVal.canMove = false;
		}
	});

	retVal.on("pressmove", function(evt) {
		if(retVal.canMove) {
			evt.currentTarget.x = evt.stageX - retVal.touchLocationX;
			evt.currentTarget.y = evt.stageY - retVal.touchLocationY;
		}
	});

	return retVal;
}