FROM node:6.9.2

RUN apt-get update

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

RUN mkdir -p $HOME
RUN chown -R app:app $HOME

USER app
WORKDIR $HOME/

VOLUME ["/home/app/uploads"]

EXPOSE 5001

CMD [ "npm", "start" ]
