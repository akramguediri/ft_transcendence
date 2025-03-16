#!/bin/bash

# Ensure working directory
cp -R * /debug/.
cd /debug

# Fix permissions (use chown only if necessary)
if [ "$(id -u)" = "0" ]; then
    chown -R "$GID:$GID" .
fi

# Apply migrations
python3 manage.py makemigrations
python3 manage.py makemigrations usermanagement
python3 manage.py migrate

# Create superuser if env variables exist
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')" | python3 manage.py shell
fi

# Start Django with Daphne for WebSockets support
exec daphne -e ssl:8000:privateKey=/app/private.key:certKey=/app/certificate.crt app.asgi:application