import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ToastController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {
    this.server_address = "ws://120.50.38.109:6700";
    
  }

  server_address: any;
  user_id: any;
  txt_message: any;
  user_id_to: any;
  list_msgs:any;

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      position: 'middle',
      message: msg,
      duration: 3000
    });
    toast.present();
  }


 

  websocket: WebSocket;
 

  connect() {
    var serv_address = this.server_address;

 
   
    this.websocket = new WebSocket(serv_address);


    this.websocket.addEventListener("open", (data) => {

      this.onOpen(data);
    });

    this.websocket.addEventListener("close" , (data) => {

      this.onClose(data);
    });

    this.websocket.addEventListener("message", (data) => {
      this.onMessage(data.data);
    });

    this.websocket.addEventListener("error", (data) => {
      this.onError(data);
    });
  
    
    
  }
 
  onOpen(evt) {

    this.writeToScreen("CONNECTED");
    
  }

  onClose(evt) {
    this.writeToScreen("DISCONNECTED");
  }

  onMessage(data) {

    try {

      console.log("Message Recived: " + data);
      var msg = JSON.parse(data);
      
      switch (msg.type) {
        case this.MessageType.CONNECTED:
          this.writeToScreen('Recived: Connected' );
          break;
        case this.MessageType.LOGIN_RESPONSE:
          //this.writeToScreen('<span style="color: blue;">Login Response: ' + msg.data + '</span>');
          this.writeToScreen('Login Response: ' + msg.data );
          break;
        
        case this.MessageType.RECIEVED:
          this.onReceivedHandler(msg.data);
          //this.wsSendMessage(ws, { 'type': MessageType.RECIEVED, 'data': msg.data });
          break;
        

      }
    } catch (e) {
      console.log("error in wsMessageHandler: " + e);
      this.wsSendMessage(JSON.stringify({"type": this.MessageType.ERROR, "data": "Error in message: " + e }));
    }


    //this.writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
    
  }

  onError(evt) {
    this.writeToScreen('<span style="color: red;">ERROR: ' + evt.data+'</span> ' ); 
  }
  sendMessage() {

    var msg: Message = new Message("text", this.user_id, this.user_id_to, this.txt_message, (new Date()).toString())

    this.wsSendMessage(JSON.stringify( { "type": this.MessageType.SEND, "data": JSON.stringify(msg) }));
    //this.writeToScreen("<span style='color: green;float: right;'>" + this.txt_message + "</span> ");
    this.writeToScreen("Sent: " + this.txt_message);
    this.txt_message = "";
  }

  wsSendMessage(message: String) {
    //this.writeToScreen("SENT: " + message);
    console.log(message);
    this.websocket.send(message);
  }

  doLogin()
  {
    this.wsSendMessage(JSON.stringify( {
      "type": this.MessageType.LOGIN, "data": JSON.stringify({ "user_id": this.user_id })
    }));
  }
    


  onReceivedHandler(message)
  {
    this.writeToScreen('Received:' + message.message )
    //this.writeToScreen('<span style="color: blue;"> ' + message.message + '</span>');
  }

  writeToScreen(message) {
    //this.list_msgs.push(message);
   

    this.presentToast( message);
  }

  MessageType = {
    CONNECTED: 0,
    LOGIN: 1,
    LOGIN_RESPONSE: 2,
    SIGNUP: 3,
    SIGNUP_RESPONSE: 4,
    SEND: 5,
    RECIEVED: 6,
    READ: 7,
    READ_RESPONSE: 8,
    BROADCAST: 9,
    ERROR: 10
  };


}

class Message {

  format: any;
  from: any;
  to: any;
  message: any;
  time:any;

  constructor(format, from, to, message, time) {
    this.format = format;
    this.from = from;
    this.to = to;
    this.message = message;
    this.time = time;
  }
}


