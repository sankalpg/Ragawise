FROM python:3.6

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && chmod +x /usr/local/bin/dumb-init

RUN mkdir /code
RUN mkdir /webroot
RUN mkdir /data
WORKDIR /code

COPY requirements.txt /code
RUN pip --no-cache-dir install -r requirements.txt

COPY data/*.json /data/
COPY api/* /code/
COPY uwsgi.ini /code/
COPY src/ /webroot/src/
COPY index.html /webroot
COPY style/ /webroot/style/
