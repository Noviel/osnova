// Created by snov on 22.06.2016.

/*********************************************
 *
 * express integration to osnova.
 *
 *********************************************/

function configure(express, app) {
  app.use(express.static(__dirname + '/public'));
  // top kek
}

export default configure;