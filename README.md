## Rick the lock pick

A visual interface for training and recognizing audio patterns in real time.
[Live Demo](https://s3-us-west-2.amazonaws.com/sky-k/rick/index.html)


App currently errors out on chrome with below. Needs to account for the required gesture
```
The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu
(anonymous) @ app.js:12
```


Needs to be updated to use the new media streaming lib

https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
