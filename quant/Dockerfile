FROM python:3.12-slim
WORKDIR /app

ARG SERVICE_PATH

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app/shared

COPY quant/shared /app/shared
COPY ${SERVICE_PATH}/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ${SERVICE_PATH}/app /app/app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

