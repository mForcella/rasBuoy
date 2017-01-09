#! /usr/bin/python

# Import and init an XBee device
from xbee import XBee,ZigBee
import serial

ser = serial.Serial('/dev/ttyAMA0', 9600)

# Use an XBee 802.15.4 device
# To use with an XBee ZigBee device, replace with:
#xbee = ZigBee(ser)
xbee = XBee(ser)

# Set remote DIO pin 2 to low (mode 4)
xbee.remote_at(
  dest_addr='\x56\x78',
  command='D2',
  parameter='\x04')

xbee.remote_at(
  dest_addr='\x56\x78',
  command='WR')
