class test_Connector {
	constructor() {
		this.manageIcon();
	}

	manageIcon() {
		console.log("Managed");
		let icon = this.icon;
		if(icon == null)icon = new createjs.Container();

		let connection = icon.getChildByName("connection");
		if(connection == null)connection = new createjs.Shape();
		connection.name = "connection";
		connection.graphics.clear();
		if(this.shape == "square") {
			connection.graphics.beginFill("#69AB57").drawRoundRect(0, 0, this.size, this.size, this.roundRadius);
			connection.regX = this.size / 2;
			connection.regY = this.size / 2;
		}
		else if(this.shape == "circle") {
			connection.graphics.beginFill("#69AB57").drawCircle(0, 0, this.size);
			connection.regX = 0;
			connection.regY = 0;
		}

		connection.removeAllEventListeners("mouseover");
		connection.removeAllEventListeners("mouseout");
		if(this.isBouncy) {
			connection.on("mouseover", function inflate(evt) {
				createjs.Tween.get(connection, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
			});

			connection.on("mouseout", function deflate(evt) {
				createjs.Tween.get(connection, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 300, createjs.Ease.bounceOut);
			});
		}

		connection.removeAllEventListeners("mousedown");
		connection.on("mousedown", function(evt) {
			console.log("down");
		});

		connection.removeAllEventListeners("pressup");
		connection.on("pressup", function(evt) {
			console.log("up");
		});

		icon.addChild(connection);

		this.icon = icon;
	}

	get size() {
		if(this._size == null)this._size = 100;
		return this._size;
	}

	set size(v) {
		this._size = v;
		this.manageIcon();
	}

	get isRounded() {
		if(this._isRounded == null)this._isRounded = false;
		return this._isRounded;
	}

	set isRounded(v) {
		this._isRounded = v;
		this.manageIcon();
	}

	get roundRadius() {
		if(this.isRounded)return this.size * 0.1;
		return 0;
	}

	get shape() {
		if(this._shape == null)this._shape = "circle";
		return this._shape;
	}

	set shape(v) {
		if(v != "circle" && v != "square") {
			console.log("Tried to assign an incorrect shape");
			return;
		}
		this._shape = v;
		this.manageIcon();
	}

	get loc() {
		return {x: this.icon.x, y: this.icon.y};
	}

	set loc(v) {
		this.icon.x = v.x;
		this.icon.y = v.y;
	}

	setLoc(x, y) {
		this.loc = {x: x, y: y};
	}

	get isBouncy() {
		if(this._isBouncy == null)this._isBouncy = true;
		return this._isBouncy;
	}

	set isBouncy(v) {
		this._isBouncy = v;
		this.manageIcon();
	}
}

class test_ConnectorManager {
	constructor(_stage) {
		this.stage = _stage;
	}

	add(connector) {
		this.stage.addChild(connector.icon);
	}
}