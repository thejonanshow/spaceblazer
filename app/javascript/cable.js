import cable from "actioncable";
import Fingerprint2 from 'fingerprintjs2'

let cableUrl = document.head.querySelector("[name~=action-cable-url][content]").content;
let consumer;
let subscription;

function getFingerprint(createSubscriptionCallback) {
  if (window.requestIdleCallback) {
	requestIdleCallback(()=> {
	  new Fingerprint2().get((result, components)=> {
        createSubscriptionCallback(result);
	  })  
	})
  } else {
	setTimeout(()=> {
	  new Fingerprint2().get((result, components)=> {
        createSubscriptionCallback(result);
	  })  
	}, 500)
  }
}

function createSubscription(subscriber, channel, callbacks) {
  getFingerprint((deviceId)=> {
    consumer = consumer || cable.createConsumer(cableUrl + "/?device_id=" + deviceId);
    subscriber.id = deviceId;
	game.id = deviceId;
    subscriber[channel] = consumer.subscriptions.create(
      {
        channel: channel,
        device_id: subscriber.id
      },
      callbacks
    );
  });
}

export default createSubscription;
