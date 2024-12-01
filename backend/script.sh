#! /bin/bash

cp -R * /debug/.
cd /debug
chown -R $GID:$GID .

python manage.py makemigrations usermanagement
python manage.py migrate

if [ "$DJANGO_SUPERUSER_USERNAME" ]
then
    python manage.py createsuperuser \
        --noinput \
        --user_name $DJANGO_SUPERUSER_USERNAME 
fi

python manage.py runserver 0.0.0.0:8000
