FROM python:2.7

RUN mkdir /code
RUN mkdir /webroot
RUN mkdir /data
WORKDIR /code

COPY requirements.txt /code
RUN pip --no-cache-dir install -r requirements.txt

COPY data/*.json /data/
COPY api/* /code/
COPY src/ /webroot/src/
COPY index.html /webroot
COPY style/ /webroot/style/