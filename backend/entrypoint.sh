#!/bin/bash

flask db migrate
flask db upgrade
python populate_db/populate.py
