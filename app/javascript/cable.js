import cable from "actioncable";
import Fingerprint2 from 'fingerprintjs2'

let cableUrl = document.head.querySelector("[name~=action-cable-url][content]").content;
let consumer;
let subscription;

function getFingerprint(createChannelCallback) {
  if (window.requestIdleCallback) {
	requestIdleCallback(()=> {
	  new Fingerprint2().get((result, components)=> {
        createChannelCallback(result);
	  })  
	})
  } else {
	setTimeout(()=> {
	  new Fingerprint2().get((result, components)=> {
        createChannelCallback(result);
	  })  
	}, 500)
  }
}

function createChannel(subscriber, channel, callbacks) {
  if (consumer) {
    subscription = consumer.subscriptions.create(channel, callbacks);
  }
  else {
    getFingerprint((deviceId)=> {
      consumer = cable.createConsumer(cableUrl + "/?device_id=" + deviceId);
      subscriber.id = deviceId;
      subscription = consumer.subscriptions.create(channel, callbacks);
    });
  }
  return subscription;
}

export default createChannel;
