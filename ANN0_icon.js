function createANNIcon(ANN) {
	let retVal = new createjs.Container();

	let x = 0, y = 0, w = 100, h = 100;
	let rad = w * 0.1;
	let main = new createjs.Shape();
	main.graphics.beginFill("#69AB57").drawRoundRect(x, y, w, h, rad, rad, rad, rad);
	retVal.addChild(main);

	let left = new createjs.Shape();
	left.graphics.beginFill("#96B562").drawRect(x, y, rad, h);
	left.mask = main;
	retVal.addChild(left);

	let right = new createjs.Shape();
	right.graphics.beginFill("#4D9A5B").drawRect(w - rad, y, rad, h);
	right.mask = main;
	retVal.addChild(right);

	let inputs_count = ANN.inputs.length + 1;
	for(let d = 0;d < inputs_count;d++) {
		let barLength = 25, barHeight = 7;
		let offsetY = (-barHeight / 2) + (h / (inputs_count + 1));

		let bar = new createjs.Shape();
		bar.graphics.beginFill("#C5C370").drawRect(x, y, barLength, barHeight);
		bar.setTransform(-barLength, (d + 1) * offsetY);
		retVal.addChild(bar);

		let circleRadius = 8;
		let circle = new createjs.Shape();
		circle.graphics.beginFill("#C5C370").drawCircle(0, 0, circleRadius);
		circle.setTransform(bar.x, bar.y + barHeight / 2);
		circle.name = "input";
		circle.ANN = retVal;
		retVal.addChild(circle);

		circle.on("mouseover", function(evt) {
			createjs.Tween.get(evt.currentTarget, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
		});

		circle.on("mouseout", function(evt) {
			createjs.Tween.get(evt.currentTarget, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 500, createjs.Ease.bounceOut);
		});
	}

	let outputs_count = ANN.outputs.length + 1;
	for(let d = 0;d < outputs_count;d++) {
		let barLength = 25, barHeight = 7;
		let offsetY = (-barHeight / 2) + (h / (outputs_count + 1));

		let bar = new createjs.Shape();
		bar.graphics.beginFill("#3F8C71").drawRect(x, y, barLength, barHeight);
		bar.setTransform(w, (d + 1) * offsetY);
		retVal.addChild(bar);

		let circleRadius = 8;
		let circle = new createjs.Shape();
		circle.graphics.beginFill("#3F8C71").drawCircle(0, 0, circleRadius);
		circle.setTransform(bar.x + barLength, bar.y + barHeight / 2);
		circle.name = "output";
		circle.ANN = retVal;
		retVal.addChild(circle);

		circle.on("mouseover", function(evt) {
			createjs.Tween.get(evt.currentTarget, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
		});

		circle.on("mouseout", function(evt) {
			createjs.Tween.get(evt.currentTarget, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 500, createjs.Ease.bounceOut);
		});
	}

	retVal.on("mousedown", function(evt) {
		retVal.touchLocationX = evt.stageX - evt.currentTarget.x;
		retVal.touchLocationY = evt.stageY - evt.currentTarget.y;
		retVal.canMove = false;
		let objectName = evt.currentTarget.stage.getObjectUnderPoint(evt.stageX, evt.stageY).name;
		if(objectName != "input" && objectName != "output") {
			retVal.canMove = true;
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