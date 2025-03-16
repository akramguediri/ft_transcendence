FROM python:3.12.3-alpine3.20 AS base

WORKDIR /app/.
COPY requirements.txt .
RUN pip install -r requirements.txt

FROM base AS development
COPY . .
RUN chmod +x script.sh 
CMD [ "sh", "./script.sh" ]

FROM base AS production
COPY . .
COPY ssl/certificate.crt /app/certificate.crt
COPY ssl/private.key /app/private.key
RUN chmod +x script.sh
CMD [ "sh", "./script.sh" ]