#!/usr/bin/evn python

import serial
import time

ser = serial.Serial('/dev/ttyAMA0', 9600)

counter = 0

while True:
   try:
      msg = 'write counter: %d \n' %(counter)
      ser.write("hello face")
      print 'Writing count: %d \n' %(counter)
      time.sleep(10)
      counter += 1
   except KeyboardInterrupt:
      break

ser.close()
