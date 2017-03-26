class test_Connector {
	constructor() {
		this.name = generate_id(4);
		this.manageIcon();
	}

	// [TODO] Find a way to manage icon without having to remanage it several times
	manageIcon() {
		let connector = this;

		let icon = this.icon;
		if(icon == null)icon = new createjs.Shape();
		icon.name = this.name;

		icon.graphics.clear();
		if(this.shape == "square") {
			icon.graphics.beginFill("#69AB57").drawRoundRect(0, 0, this.size, this.size, this.roundRadius);
			icon.regX = this.size / 2;
			icon.regY = this.size / 2;
		}
		else if(this.shape == "circle") {
			icon.graphics.beginFill("#69AB57").drawCircle(0, 0, this.size / 2);
			icon.regX = 0;
			icon.regY = 0;
		}

		icon.removeAllEventListeners("mouseover");
		icon.removeAllEventListeners("mouseout");
		if(this.isBouncy) {
			icon.on("mouseover", function(evt) {
				createjs.Tween.get(icon, {loop: false}).to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.bounceOut);
			});

			icon.on("mouseout", function(evt) {
				createjs.Tween.get(icon, {loop: false}).to({scaleX: 1.0, scaleY: 1.0}, 300, createjs.Ease.bounceOut);
			});
		}

		if(connector.manager != null) {
			connector.manager.removeAllEventListeners("mousedown");
			icon.on("mousedown", function(evt) {
				connector.manager.selected_connector = connector;
				connector.manager.dispatchEvent("Connector_mousedown");
			});

			icon.removeAllEventListeners("pressmove");
			icon.on("pressmove", function(evt) {
				connector.manager.selected_connector = connector;
				var retVal = new createjs.Event("Connector_pressmove");
				retVal.stageX = evt.stageX;
				retVal.stageY = evt.stageY;
				connector.manager.dispatchEvent(retVal);
			});

			icon.removeAllEventListeners("pressup");
			icon.on("pressup", function(evt) {
				connector.manager.selected_connector = connector;
				connector.manager.dispatchEvent("Connector_pressup");
			});

			icon.on("mouseover", function(evt) {
				connector.manager.mouseover_connector = connector;
			});

			icon.on("mouseout", function(evt) {
				if(connector.manager.mouseover_connector == this)
					connector.manager.mouseover_connector = null;
			});
		}

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

class test_Connection {
	constructor(_a, _b, _stage) {
		this.a = _a;
		this.b = _b;
		this.stage = _stage;
	}

	get name() {
		return this.a.name + "_" + this.b.name;
	}

	render() {
		let line = stage.getChildByName(this.name);
		if(line == null)line = new createjs.Shape();
		line.name = this.name;

		line.graphics.clear();
		line.graphics.setStrokeStyle(3).beginStroke("#FF6666");
		line.graphics.moveTo(this.b.icon.x, this.b.icon.y);
		line.graphics.lineTo(this.a.icon.x, this.a.icon.y);
		line.graphics.endStroke();

		this.stage.addChild(line);
		this.stage.setChildIndex(line, 0);
	}

	removeFromScene() {
		let line = this.stage.getChildByName(this.name);
		if(line != null)this.stage.removeChild(line);
	}
}

class test_ConnectorManager {
	constructor(_stage) {
		this.stage = _stage;
		this.connectors = [];
		this.connections = [];

		createjs.EventDispatcher.initialize(test_ConnectorManager.prototype);

		this.on("Connector_mousedown", function(evt) {
			//
		});

		this.on("Connector_pressmove", function(evt) {
			this.tmpLine_render(evt.stageX, evt.stageY);
		});

		this.on("Connector_pressup", function(evt) {
			// [TODO] Add in functionality for different types of connectors
			// [TODO] Sanity check to ensure a connection doesn't already exist
			this.tmpLine_remove();
			if(this.selected_connector != null && this.mouseover_connector != null && this.selected_connector != this.mouseover_connector) {
				this.addConnection(new test_Connection(this.selected_connector, this.mouseover_connector, this.stage));
			}
		});
	}

	tmpLine_render(x, y) {
		let line = stage.getChildByName("temp_line");
		if(line == null)line = new createjs.Shape();
		line.name = "temp_line";

		line.graphics.clear();
		line.graphics.setStrokeStyle(3).beginStroke("#FF6666");
		line.graphics.moveTo(x, y);
		line.graphics.lineTo(this.selected_connector.icon.x, this.selected_connector.icon.y);
		line.graphics.endStroke();

		this.stage.addChild(line);
		this.stage.setChildIndex(line, 0);
	}

	tmpLine_remove() {
		let line = this.stage.getChildByName("temp_line");
		this.stage.removeChild(line);
	}

	addConnector(connector) {
		connector.manager = this;
		this.connectors.push(connector);
		this.stage.addChild(connector.icon);
	}

	addConnection(connection) {
		// [TODO] Sanity check to ensure both connectors are already in this.connectors
		this.connections.push(connection);
		connection.render();
	}

	removeConnection(connection) {
		connection.removeFromScene();
		let index = this.connections.indexOf(connection);
		if(index > -1)this.connections.splice(index, 1);
	}
}