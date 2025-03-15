#! /bin/bash

# Ensure working directory
cp -R * /debug/.
cd /debug

# Fix permissions (use chown only if necessary)
if [ "$(id -u)" = "0" ]; then
    chown -R "$GID:$GID" .
fi

# Apply migrations
python3 manage.py makemigrations
python3 manage.py migrate

# Create superuser if env variables exist
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python3 manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL"
fi

# Start Django with Daphne for WebSockets support
exec daphne -b 0.0.0.0 -p 8000 app.asgi:application
