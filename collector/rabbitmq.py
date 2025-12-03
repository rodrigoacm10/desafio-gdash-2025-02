import pika
import json
from config import RABBITMQ_URL, RABBITMQ_QUEUE

def publish_snapshot(snapshot: dict):
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    body = json.dumps(snapshot).encode("utf-8")

    channel.basic_publish(
        exchange="",
        routing_key=RABBITMQ_QUEUE,
        body=body,
        properties=pika.BasicProperties(
            content_type="application/json",
            delivery_mode=2,   
        ),
    )
    print("[PYTHON] Snapshot publicado na fila.")
    connection.close()
