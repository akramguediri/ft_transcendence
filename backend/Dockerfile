FROM python:3.12.3-alpine3.20

WORKDIR /app/.
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/. .
RUN chmod +x script.sh 
CMD [ "sh", "./script.sh" ]
