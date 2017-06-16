var dns = require('dns2');
var request1 = require('request');
//var Packet = require('packet');

var server = dns.createServer(function(request, send){
  //console.log(request);
  var response = new dns.Packet(request);
  var query = request.questions[0].name;
  console.log('New request for: ' +query);
  var type = request.questions[0].type;
  request1('https://dns.google.com/resolve?name=' + query + '&type=' + type, function(werror, wresponse, wbody){
    var gResponse = JSON.parse(wbody);
    //console.log(wbody);
    if(gResponse){
      //console.log(gResponse.Answer);
      response.header.qr = 1;
      response.header.ra = 1;
      try{
        if(gResponse.Answer[0].type == 5){
          response.answers.push({
            name: gResponse.Answer[1].name,
            type: gResponse.Answer[1].type,
            class: dns.Packet.CLASS.IN,
            ttl: gResponse.Answer[1].TTL,
            address: gResponse.Answer[1].data
          });
          //console.log(response);
          send(response);
        }
      }
      catch(e){
        //console.log(e)
      }

      try{
      response.answers.push({
        name: query,
        type: gResponse.Answer[0].type,
        class: dns.Packet.CLASS.IN,
        ttl: gResponse.Answer[0].TTL,
        address: gResponse.Answer[0].data
      });
      //console.log(response);
      send(response);
    }
    catch(e){
      console.log(e);
      if(gResponse.status == 3){
        response.answers.push({
          name: query,
          type: gResponse.Authority[0].type,
          class: dns.Packet.CLASS.IN,
          ttl: gResponse.Authority[0].TTL,
          address: gResponse.Authority[0].data
        });
        //console.log(response);
        send(response);
      }
    }
  }
    else{
      console.log('well.. fuck');
    }

  });




}).listen(53);
