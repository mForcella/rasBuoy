#!/usr/bin/evn python

from xbee import ZigBee
import serial
import time

ser = serial.Serial('/dev/ttyAMA0', 9600)

xbee = ZigBee(ser)

counter = 0

while True:
   try:
      msg = 'write counter: %d \n' %(counter)
      xbee.tx(dest_addr='\x00\x13\xa2\x00\x40\xe4\x27\x34',data=msg)
      print 'Writing count: %d \n' %(counter)
      time.sleep(10)
      counter += 1
   except KeyboardInterrupt:
      break

ser.close()
