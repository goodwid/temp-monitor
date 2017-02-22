/* globals NodeMCU I2C1 OneWire setWatch pinMode */
import configFactory from './config';


function main() {
  const { ssid, password, losantDeviceAuth, losandDeviceId} = configFactory();
  const wifi = require('Wifi');
  const options = {
    repeat: true,
    edge: 'rising',
    debounce: 100
  };
  const interval = 5000;
  const TEMP = NodeMCU.D1;
  const TOGGLE = NodeMCU.D2;
  const scl = NodeMCU.D5;
  const sda = NodeMCU.D6
  pinMode(TOGGLE, 'input_pullup');
  const ow = new OneWire(TEMP);
  I2C1.setup({scl, sda});
  const lcd = require('HD44780').connectI2C(I2C1, 0x3f);
  const sensor = require('DS18B20').connect(ow);
  let fahrenheit = true;


  function reportTemp(callback) {
    sensor.getTemp(temp => {
      callback(temp);
    });
  }
  lcd.print('Temp: ');
  wifi.connect(ssid, {password}, err => {
    if (err) console.log('Problem: ', err);
  });
  wifi.save();

  setInterval(() => {
    lcd.setCursor(6, 0);
    reportTemp(temp => {
      // losant.updateDeviceData({Temperature: temp}, (err, res) => {
      //   if (err) return console.log(err);
      //   console.log('losant response: ',res);
      // });
      let dispTemp = 0;
      if (fahrenheit) {  //convert to Fahrenheit
        dispTemp = (temp*(9/5)+32).toFixed(1);
        dispTemp += 'F';
      } else {
        dispTemp = temp.toFixed(1);
        dispTemp += 'C';
      }
      lcd.print(dispTemp);
    });
  }, interval);

  setWatch(() => {
    fahrenheit = !fahrenheit;
    lcd.setCursor(0,1);
    const phrase = fahrenheit ? 'F' : 'C';
    lcd.print(`Switching to ${phrase}`);
    lcd.setCursor(6, 0);
    setTimeout(() => {
      lcd.setCursor(0,1);
      lcd.print('                ');
      lcd.setCursor(6, 0);
    }, interval);
  }, TOGGLE, options);

}
