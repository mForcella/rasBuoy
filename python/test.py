#! /usr/bin/python

from xbee import ZigBee
import serial
import time

def toHex(s):
    lst = []
    for ch in s:
        hv = hex(ord(ch)).replace('0x', '')
        if len(hv) == 1:
            hv = '0'+hv
        hv = '0x' + hv
        lst.append(hv)

def decodeReceivedFrame(data):
            source_addr_long = toHex(data['source_addr_long'])
            source_addr = toHex(data['source_addr'])
            id = data['id']
            samples = data['samples']
            options = toHex(data['options'])
            return [source_addr_long, source_addr, id, samples]

PORT = '/dev/ttyAMA0'
BAUD_RATE = 9600

# Open serial port
ser = serial.Serial(PORT, BAUD_RATE)

# Create API object
xbee = ZigBee(ser,escaped=True)

# Continuously read and print packets
while True:
    try:
        print "waiting"
        data = xbee.wait_read_frame()
	response = decodeReceivedFrame(data)
        print response
    except KeyboardInterrupt:
        break

ser.close()
