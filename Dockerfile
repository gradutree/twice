FROM node
RUN mkdir -p /home/nodejs/app
COPY ./ /home/nodejs/app
WORKDIR /home/nodejs/app
RUN npm install --production
EXPOSE 8000
CMD node ./scraper/scrapperv2.js
CMD npm start