FROM node
RUN mkdir -p /home/nodejs/app
COPY ./ /home/nodejs/app
WORKDIR /home/nodejs/app
RUN npm install --production
EXPOSE 8000
RUN apt-get update && apt-get install -y mongodb supervisor
RUN mkdir -p /data/db
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]
