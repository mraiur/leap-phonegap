/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        initScene();

        rotateCube();


        var options = { frequency: 10 };
        var hh = (window.innerHeight/2);
        var hw = (window.innerWidth/2);
        var partY = hh / Math.PI;
        var partX = hw / Math.PI;
        var startDegree = 0;
        var x, y;

        watchID = navigator.accelerometer.watchAcceleration(function(acceleration){
            y = (acceleration.z.toFixed(4) * partY)+hh;
            cube.position.setY( y );
        }, function(){

        }, options);

        navigator.compass.getCurrentHeading(function(heading){
            startDegree = heading.trueHeading;
        }, function(){});
        navigator.compass.watchHeading(function(heading){
            x = ( heading.trueHeading - startDegree) * (Math.PI / 180);
            x = (x * partX)*-1;
            cube.position.setX( x );
        }, function(){}, { frequency: 10});

        var socket = io('http://192.168.1.200:5555');
        socket.on('connect', function (){
            socket.on('hand', function (data) {
                //cube.rotation.x += 0.01;
                cube.rotation.y += data.yaw;
                if( data.pitch > 0.5){
                    cube.position.setZ(cube.position.z + (data.direction[0]*-1) );
                }
            });
        });
    }
};
