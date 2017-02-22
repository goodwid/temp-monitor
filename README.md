## Temperature sensor

This uses a Dallas 18B20 one-wire module, and a 16x2 display using the HD44780 i2c backpack module.

Currently it polls the temp sensor every 5 seconds, then updates the display each time.  There is a button used to toggle C/F temperature display.


Coming soon: reporting temperature to home automation server at intervals.

Made using [ThingsSDK](http://thingssdk.com/).
