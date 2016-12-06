/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    navdrawerContainer.classList.add('opened');
  }

  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
  
  
  
  function Database(){
  }
  
  Database.prototype = {
    getDatabase: function(){
      return firebase.database();
    }
  };
  
  function Table(database, hash, username){
    this.database = database;
    this.hash = hash;
    this.username = username;
    this.arr = [];
    
    
  }
  
  Table.prototype = {
    
    getTable: function(){
      return this.database.ref("Message").child(this.hash.substring(1)); //create query for group messages
    },
    
    sendMessage: function(message, userName){
      this.database.ref('Message').child(this.hash.substring(1)).push({
          message: message,
          group: this.hash,
          userName: userName,
          });
    },
    createChat: function(){
      var getMessage = function(db, hash) {
        var log = []; 
        db.ref("Message").child(hash.substring(1)).on('child_added', function(snapshot){
          var local = []; //create a localized array for each iteration: [groupHash, message, name]
             for (var key in snapshot.val()) { // iterate through table to get records
               if (snapshot.val().hasOwnProperty(key)) { //return only record data, not prototype data
                  var obj = snapshot.val()[key];
                  local.push(obj); //push array to hold all message data
               }
            }
            if(getUsername() === local[2]){
              $(".chatbox").append("<div class='chatmessage user' > <p class='' ><strong>" + local[2] + " : </strong>" + local[1] + " </p> </div><br>");
             }else{
              $(".chatbox").append("<div class='chatmessage' > <p class='' ><strong>" + local[2] + " : </strong>" + local[1] + " </p> </div><br>");
             }
          });
          return log;
      };
       return getMessage(this.database, this.hash);
    }
  };
  
  function build(hash){
    var chat =  $("<div />", { 
      id: hash 
    }).addClass("chatbox");
    $("main").append(chat);
    
  }
  
  function getHash(){
    return window.location.hash;
  }
  
  function getUsername(){
    return $("#username").val();
  }
  window.onload = function(){
    $(".noGroup").hide();
    if (getHash().length > 0){
      //if a table url, create table connection
      
      build(getHash);
      var newDatabase = new Database();
      var newTable = new Table(newDatabase.getDatabase(), getHash(), getUsername());
      
      newTable.createChat();
      
      $(".send").on('click', function(e){
        if(getUsername().length <=0 ){
          $(".holder").addClass("color--danger");
        }else{
          $(".holder").removeClass("color--danger").addClass("color--highlight");
          newTable.sendMessage($("#sendM").val(), getUsername());
        }
      });
    } 
  };
  
  

  window.onhashchange = function() { 
       $(".noGroup").hide();
    if (getHash().length > 0){
      //if a table url, create table connection
      $(".chatbox").remove();
      
      $(".send").off();      //remove events from previous use
      build(getHash);
      var newDatabase = new Database();
      var newTable = new Table(newDatabase.getDatabase(), getHash(), getUsername());
      newTable.createChat();
      
      $(".send").on('click', function(e){
        if(getUsername().length <=0 ){
          $(".holder").addClass("color--danger");
        }else{
          $(".holder").removeClass("color--danger").addClass("color--highlight");
          newTable.sendMessage($("#sendM").val(), getUsername());
        }
      });
    } 
  };
    
    
    
})();
