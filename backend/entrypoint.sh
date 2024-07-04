#!/bin/bash

sleep 10

flask db migrate
flask db upgrade
python populate.py
python app.py
