#!/bin/sh

cp -R * /debug/.
cd /debug
chown -R $GID:$GID .

/usr/local/bin/npm start
