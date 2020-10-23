module.exports = function(RED) {
    function checkValueNode(config) {
        RED.nodes.createNode(this,config);

        this.sensor = config.sensor;
        this.minimumValue = config.minimumValue;
        this.maximumValue = config.maximumValue;
        this.idealMinimumValue = config.idealMinimumValue;
        this.idealMaximumValue = config.idealMaximumValue;

        var node = this;
        node.on('input', function(msg) {
            var sensor = node.sensor;
            var minimumValue = node.minimumValue;
            var maximumValue = node.maximumValue;
            var idealMinimumValue = node.idealMinimumValue;
            var idealMaximumValue = node.idealMaximumValue;

            var inMsg = msg.payload;

            var value = inMsg.d[sensor].valor;
            var situation;

            if ((idealMinimumValue && idealMaximumValue && value >= idealMinimumValue && value <= idealMaximumValue) || 
                (idealMinimumValue && !idealMaximumValue && value >= idealMinimumValue) ||
                (!idealMinimumValue && idealMaximumValue && value <= idealMaximumValue)) {

                situation = "Within the ideal";
                node.status({fill:"blue", shape:"dot", text:"ideal"});
            } else if ((minimumValue && maximumValue && value >= minimumValue && value <= maximumValue) || 
                        (minimumValue && !maximumValue && value >= minimumValue) ||
                        (!minimumValue && maximumValue && value <= maximumValue)) {

                situation = "Within the limit";
                node.status({fill:"green", shape:"dot", text:"limit"});
            } else {
                situation = "Out of the limit";
                node.status({fill:"red", shape:"dot", text:"atention"});
            }

            var response = {"sensor": sensor, "valor": value, "situation": situation};
            msg.payload = response;

            msg.query = {"sensor": sensor};

            node.send(msg);
        });
    }
    
    RED.nodes.registerType("check-value", checkValueNode);
}