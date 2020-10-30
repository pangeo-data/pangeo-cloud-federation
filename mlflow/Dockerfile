FROM python:3.8-slim-buster
RUN pip3 install mlflow==1.11.0

EXPOSE 80
ENV STATIC_PREFIX="/services/mlflow"
ENV HOST="0.0.0.0"

CMD mlflow server --host=${HOST} --static-prefix=${STATIC_PREFIX} --port=80 
