FROM python:3.8-slim-buster
RUN pip3 install mlflow==1.11.0 google-cloud-storage

EXPOSE 80
ENV STATIC_PREFIX="/services/mlflow"
ENV HOST="0.0.0.0"
ENV DEFAULT_ARTIFACT_ROOT="/"
ENV BACKEND_STORE_URI="file:///mlruns"

CMD echo "[starting mlflow]" \
 && echo "static-prefix: ${STATIC_PREFIX}" \
 && echo "backend-store-uri: ${BACKEND_STORE_URI}" \
 && echo "default-artifact-root: ${DEFAULT_ARTIFACT_ROOT}" \
 && mlflow server \
    --port=80 \
    --host=${HOST} \
    --static-prefix=${STATIC_PREFIX} \
    --backend-store-uri=${BACKEND_STORE_URI} \
    --default-artifact-root=${DEFAULT_ARTIFACT_ROOT} \
