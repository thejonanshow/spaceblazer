import cable from "actioncable";
import Fingerprint2 from 'fingerprintjs2'

let cableUrl = document.head.querySelector("[name~=action-cable-url][content]").content;
let consumer;

function getFingerprint(createChannelCallback) {
  if (window.requestIdleCallback) {
	requestIdleCallback(function () {
	  new Fingerprint2().get(function(result, components) {
        createChannelCallback(result);
	  })  
	})
  } else {
	setTimeout(function () {
	  new Fingerprint2().get(function(result, components) {
        createChannelCallback(result);
	  })  
	}, 500)
  }
}

function createChannel(...args) {
  if (consumer) {
    return consumer.subscriptions.create(...args);
  }
  else {
    getFingerprint((deviceId)=> {
      consumer = cable.createConsumer(cableUrl + "/?device_id=" + deviceId);
      return consumer.subscriptions.create(...args);
    });
  }
}

export default createChannel;
