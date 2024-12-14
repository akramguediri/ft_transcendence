FROM python:3.12.3-alpine3.20 AS base

WORKDIR /app/.
COPY requirements.txt .
RUN pip3 install -r requirements.txt

FROM base AS development
COPY . .
RUN chmod +x script.sh 
CMD [ "sh", "./script.sh" ]
