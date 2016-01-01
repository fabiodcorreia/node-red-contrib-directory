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

    var fs = require("fs");
    var path = require("path");

    function DirectoryList(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var filter = config.filter;
        var dir = config.directory;
        var onlydir = config.onlydir;
        var dirContent = [];

        node.on("input", function(msg) {
            if (dir) {
                fs.readdir(dir, function(err, files) {
                    if (err) {
                        node.error(err, msg);
                    } else {
                        files.forEach(function(f) {
                            if (!filter || f.match(filter)) {
                                var dirNode = {
                                    "name": f,
                                    "path": path.join(dir, f),
                                    "isDir": fs.statSync(path.join(dir, f)).isDirectory()
                                };
                                if (!onlydir || dirNode.isDir) {
                                    dirContent.push(dirNode);
                                }
                            }
                        });
                    }
                    msg.payload = dirContent;
                    node.send(msg);
                });
            } else {
                node.error("Absolute path for directory not set", msg);
            }
        });
    }
    RED.nodes.registerType("directory list", DirectoryList);
};