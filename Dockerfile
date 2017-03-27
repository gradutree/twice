FROM node
RUN mkdir -p /home/nodejs/app
COPY ./twice /home/nodejs/app
WORKDIR /home/nodejs/app
RUN npm install --production
EXPOSE 3000
CMD node ./scraper/scrapperv2.js
CMD npm run build
CMD npm start