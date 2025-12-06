import pika
import json
import time
from config import RABBITMQ_URL, RABBITMQ_QUEUE

def publish_snapshot(snapshot: dict):
    print("[PYTHON][RABBITMQ] Iniciando publish_snapshot()")
    print(f"[PYTHON][RABBITMQ] URL={RABBITMQ_URL} | QUEUE={RABBITMQ_QUEUE}")

    params = pika.URLParameters(RABBITMQ_URL)

    max_attempts = 5
    attempt = 0
    connection = None

    while connection is None:
        try:
            print(f"[PYTHON][RABBITMQ] Tentando conectar... tentativa {attempt}/{max_attempts}")
            connection = pika.BlockingConnection(params)
        except Exception as e:
            print(f"[PYTHON][RABBITMQ] ERRO ao conectar na tentativa {attempt}: {e}")
            if attempt < max_attempts:
                time.sleep(5)
            else:
                print("[PYTHON][RABBITMQ] Não conseguiu conectar ao RabbitMQ após várias tentativas.")
                raise

    try:
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

        body = json.dumps(snapshot).encode("utf-8")
        print(f"[PYTHON][RABBITMQ] Publicando mensagem. Tamanho do body: {len(body)} bytes")

        channel.basic_publish(
            exchange="",
            routing_key=RABBITMQ_QUEUE,
            body=body,
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2,  
            ),
        )
        print("[PYTHON][RABBITMQ] Snapshot publicado na fila com sucesso.")
    except Exception as e:
        print("[PYTHON][RABBITMQ] ERRO ao publicar snapshot:", e)
        raise
    finally:
        try:
            if connection and not connection.is_closed:
                connection.close()
                print("[PYTHON][RABBITMQ] Conexão com RabbitMQ fechada.")
        except Exception as e:
            print("[PYTHON][RABBITMQ] ERRO ao fechar conexão:", e)
