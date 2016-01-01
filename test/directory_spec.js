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

var should = require("should");
var helper = require('./helper.js');
var directoryNode = require('../directory.js');

describe("Directory Node", function() {
    "use strict";

    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload().then(function() {
            helper.stopServer(done);
        });
    });

    describe("Directory list", function() {
        it("should output only directories on the current path", function(done) {
            var flow = [{
                "id": "n1",
                "type": "directory list",
                "directory": ".",
                "onlydir": true,
                "wires": [
                    ["n2"]
                ]
            }, {
                id: "n2",
                type: "helper"
            }];
            helper.load(directoryNode, flow, function() {
                helper.getNode("n2").on("input", function(msg) {
                    msg.should.have.a.property("payload");
                    msg.payload.should.not.containDeep([{
                        "isDir": false
                    }]);
                    done();
                });
                helper.getNode("n1").emit("input", {});
            });
        });

        it("should output files and directories on the current path", function(done) {
            var flow = [{
                "id": "n1",
                "type": "directory list",
                "directory": ".",
                "onlydir": false,
                "wires": [
                    ["n2"]
                ]
            }, {
                id: "n2",
                type: "helper"
            }];
            helper.load(directoryNode, flow, function() {
                helper.getNode("n2").on("input", function(msg) {
                    msg.should.have.a.property("payload");
                    msg.payload.should.containDeep([{
                        "isDir": false
                    }]);
                    done();
                });
                helper.getNode("n1").emit("input", {});
            });
        });

        it("should output files filtered", function(done) {
            var flow = [{
                "id": "n1",
                "type": "directory list",
                "directory": ".",
                "onlydir": false,
                "filter": "(\\.html|\\.json|\\.js)",
                "wires": [
                    ["n2"]
                ]
            }, {
                id: "n2",
                type: "helper"
            }];
            helper.load(directoryNode, flow, function() {
                helper.getNode("n2").on("input", function(msg) {
                    msg.should.have.a.property("payload");
                    msg.payload.should.not.containDeep([{
                        "isDir": true
                    }]);
                    msg.payload.should.containDeep([{
                        "name": "directory.js"
                    }, {
                        "name": "directory.html"
                    }, {
                        "name": "package.json"
                    }]);
                    done();
                });
                helper.getNode("n1").emit("input", {});
            });
        });
    });
});