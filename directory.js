/**
 * Copyright 2015 Fábio Correia
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";

    var fs = require('fs');

    function DirectoryList(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on("input", function(msg) {
            var dirContent = [];
            if (config.directory) {
                fs.readdir(config.directory, function(err, files) {
                    if (err) {
                        node.error(err, msg);
                    } else {
                        files.forEach(function(f) {
                            var dirNode = {
                                "name": f,
                                "path":config.directory+"/"+f,
                                "isDir": fs.statSync(config.directory+"/"+f).isDirectory()
                            };
                            if(!config.onlydir || dirNode.isDir){
                                dirContent.push(dirNode);
                            }
                        });
                    }
                    if(config.multimessage){
                        var msgs = [];
                        dirContent.forEach(function(obj){
                            var newMessage = RED.util.cloneMessage(msg);
                            newMessage.payload = obj;
                            node.send(newMessage);
                        });
                    } else {
                        msg.payload = dirContent;
                        node.send(msg);
                    }
                });
            } else {
                node.error("Absolute path for directory not set", msg);
            }
        });
    }
    RED.nodes.registerType("directory", DirectoryList);
};
