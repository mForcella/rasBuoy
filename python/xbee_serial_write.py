#!/usr/bin/evn python

import xbee
from socket import *

# destination tuple (address string, endpoint, profile id, cluster id)
DESTINATION = ("00:13:A2:00:40:CA:4C:43!",0xe8,0xc105,0x11)

# create socket, datagram mode, propietary transport
sd = socket(AF_XBEE, SOCK_DGRAM, XBS_PROT_TRANSPORT)

# bind to endpoint 0xe8 for digimesh
sd.bind(("", 0xe8, 0, 0))

# send to destination address
sd.sendto("Hello face!", 0, DESTINATION)

while True:
   sd.sendto("Hello face!", 0, DESTINATION)
   print 'Writing yaface'
   time.sleep(10)
