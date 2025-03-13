#! /bin/bash

cp -R * /debug/.
cd /debug
chown -R $GID:$GID .

python3 manage.py makemigrations usermanagement
python3 manage.py migrate

if [ "$DJANGO_SUPERUSER_USERNAME" ]
then
    python3 manage.py createsuperuser \
        --noinput \
        --user_name $DJANGO_SUPERUSER_USERNAME 
fi

python3 manage.py runserver 0.0.0.0:8000
