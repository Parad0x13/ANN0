class test_Connector {
	constructor() {
		this.manageIcon();
	}

	// [TODO] Find a way to manage icon without having to remanage it several times
	manageIcon() {
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
			connection.on("mouseover", function(evt) {
				createjs.Tween.get(connection, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
			});

			connection.on("mouseout", function(evt) {
				createjs.Tween.get(connection, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 300, createjs.Ease.bounceOut);
			});
		}

		let manager = this.manager;
		if(manager != null) {
			connection.removeAllEventListeners("mousedown");
			connection.on("mousedown", function(evt) {
				manager.selected_connection = this;
				manager.dispatchEvent("ConnectionPressed");
			});

			connection.removeAllEventListeners("pressmove");
			connection.on("pressmove", function(evt) {
				manager.selected_connection = this;
				var retVal = new createjs.Event("ConnectionPressmoved");
				retVal.stageX = evt.stageX;
				retVal.stageY = evt.stageY;
				manager.dispatchEvent(retVal);
			});

			connection.removeAllEventListeners("pressup");
			connection.on("pressup", function(evt) {
				manager.selected_connection = this;
				manager.dispatchEvent("ConnectionReleased");
			});

			connection.on("mouseover", function(evt) {
				manager.mouseover_connection = this;
			});

			connection.on("mouseout", function(evt) {
				if(manager.mouseover_connection == this)
					manager.mouseover_connection = null;
			});
		}

		icon.addChild(connection);

		this.icon = icon;
	}

	get size() {
		if(this._size == null)this._size = 25;
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

	get manager() {
		return this._manager;
	}

	set manager(v) {
		this._manager = v;
		this.manageIcon();
	}
}

class test_ConnectorManager {
	constructor(_stage) {
		this.stage = _stage;

		createjs.EventDispatcher.initialize(test_ConnectorManager.prototype);

		this.on("ConnectionPressed", function(evt) {
			console.log("Start drawing...");
		});

		this.on("ConnectionPressmoved", function(evt) {
			console.log("Continue drawing...");

			let inputLoc = this.selected_connection.localToGlobal(0, 0);
			let outputLoc = {x: evt.stageX, y: evt.stageY};

			let name = "line";
			let connection = stage.getChildByName(name);
			if(connection == null)connection = new createjs.Shape();
			connection.name = name;

			connection.graphics.clear();
			connection.graphics.setStrokeStyle(3).beginStroke("#FF6666");
			connection.graphics.moveTo(outputLoc.x, outputLoc.y);
			connection.graphics.lineTo(inputLoc.x, inputLoc.y);
			connection.graphics.endStroke();

			this.stage.addChild(connection);
			this.stage.setChildIndex(connection, 0);
		});

		this.on("ConnectionReleased", function(evt) {
			console.log("Connector has been released");
			// [TODO] Add in functionality for different types of connectors
			if(this.selected_connection != null && this.mouseover_connection != null && this.selected_connection != this.mouseover_connection) {
				console.log("Different connectors selected!");
			}
		});
	}

	add(connector) {
		connector.manager = this;
		this.stage.addChild(connector.icon);
	}
}