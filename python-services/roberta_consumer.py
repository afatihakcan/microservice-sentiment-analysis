import asyncio
import logging
from aio_pika import Message, connect
from aio_pika.abc import AbstractIncomingMessage
import json
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax


############### roBERTa configurations ###############
MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)


async def main() -> None:

    ############### RabbitMQ connections ###############

    # Perform connection
    connection = await connect("amqp://localhost/")
    # Creating a channel
    channel = await connection.channel()
    exchange = channel.default_exchange
    # Declaring queue
    queue = await channel.declare_queue("roberta-queue")

    async with queue.iterator() as qiterator:
        message: AbstractIncomingMessage

        async for message in qiterator:
            try:
                async with message.process(requeue=False):
                    assert message.reply_to and message.body is not None
                    body = json.loads(message.body.decode())

                    text = body.get("data")
                    assert text is not None

                    response = json.dumps(
                        polarity_scores_roberta(text)).encode(encoding='utf-8')

                    await exchange.publish(
                        Message(
                            body=response,
                            correlation_id=message.correlation_id,
                        ),
                        routing_key=message.reply_to,
                    )
                    print("Request complete")
            except Exception:
                logging.exception("Processing error for message %r", message)


def polarity_scores_roberta(text):
    encoded_text = tokenizer(text, return_tensors='pt')
    output = model(**encoded_text)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    scores_dict = {
        'roberta_neg': scores[0].item(),
        'roberta_neu': scores[1].item(),
        'roberta_pos': scores[2].item()
    }
    return scores_dict


if __name__ == "__main__":
    asyncio.run(main())
