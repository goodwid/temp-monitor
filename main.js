/* globals NodeMCU I2C1 OneWire setWatch pinMode */


function main() {
  let fahrenheit = true;
  const interval = 3000;
  const TEMP = NodeMCU.D1;
  const TOGGLE = NodeMCU.D2;
  pinMode(TOGGLE, 'input_pullup');
  I2C1.setup({scl: NodeMCU.D4, sda: NodeMCU.D5});
  const lcd = require('HD44780').connectI2C(I2C1, 0x3f);
  const ow = new OneWire(TEMP);
  const sensor = require('DS18B20').connect(ow);
  const options = {
    repeat: true,
    edge: 'rising',
    debounce: 100
  };

  function reportTemp(f, cb) {
    sensor.getTemp(temp => {
      let dispTemp = 0;
      if (f) {  //convert to Fahrenheit
        dispTemp = (temp*(9/5)+32).toFixed(1);
        dispTemp += 'F';
      } else {
        dispTemp = temp.toFixed(1);
        dispTemp += 'C';
      }
      cb(dispTemp);
    });
  }
  lcd.print('Temp: ');

  setInterval(() => {
    lcd.setCursor(6, 0);
    reportTemp(fahrenheit, temp => {
      lcd.print(temp);
    });
  }, interval);

  setWatch(() => {
    fahrenheit = !fahrenheit;
    lcd.setCursor(0,1);
    const phrase = fahrenheit ? 'F' : 'C';
    lcd.print(`Switching to ${phrase}`);
    setTimeout(() => {
      lcd.setCursor(0,1);
      lcd.print('                ');
    }, interval);
  }, TOGGLE, options);
}
