#!/usr/bin/env python
import pika

credentials = pika.PlainCredentials('pi','Jezebel32')
connection = pika.BlockingConnection(pika.ConnectionParameters(
        '192.168.1.102',
         5672,
         '/',
         credentials))

channel = connection.channel()

channel.queue_declare(queue='hello')

channel.basic_publish(exchange='',
                      routing_key='hello',
                      body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()
