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

            // console.log(sensor);
            // console.log(minimumValue);
            // console.log(maximumValue);
            // console.log(idealMaximumValue);
            // console.log(idealMinimumValue);

            var inMsg = msg.payload;
            var response = {"sensor": sensor};

            // try {
                var value = inMsg.d[sensor].valor;
                response["value"] = value;
                
                if (value >= idealMinimumValue && value <= idealMaximumValue) {
                    response["situation"] = "Within the ideal";
                } else if (value >= minimumValue && value <= maximumValue) {
                    response["situation"] = "Within the limit";
                } else {
                    response["situation"] = "Out of the limit";
                }
            // } catch (err) {
            //     console.log(err);

            //     if (done) {
            //         done(err);
            //     } else {
            //         node.error(err, msg);
            //     }
            // }

            msg.payload = response;

            node.send(msg);
        });
    }
    
    RED.nodes.registerType("check-value", checkValueNode);
}