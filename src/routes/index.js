// Created by snov on 28.08.2016.

export default function routes(osnova, app) {
  app = app || osnova.express;

  app.get('/health', function(req,res) {
    res.header(200).send('I am ok!');
  });

}