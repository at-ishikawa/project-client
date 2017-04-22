'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _rmdir = require('rmdir');

var _rmdir2 = _interopRequireDefault(_rmdir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
    function Command() {
        _classCallCheck(this, Command);

        this.readConfig();
    }

    _createClass(Command, [{
        key: 'readConfig',
        value: function readConfig() {
            this.projectConfigs = require('../configs.json');
            var userConfigFilePath = _os2.default.homedir() + '/.project-client.json';
            if (_fs2.default.existsSync(userConfigFilePath)) {
                var userConfig = _jsonfile2.default.readFileSync(userConfigFilePath);
                this.projectConfigs = Object.assign({}, this.projectConfigs, userConfig);
            }
        }
    }, {
        key: 'execute',
        value: function execute() {
            try {
                var _parseArguments = this.parseArguments(),
                    projectType = _parseArguments.projectType,
                    outputDirectory = _parseArguments.outputDirectory;

                var projectConfig = this.projectConfigs[projectType];
                var repository = projectConfig.repository;

                if (!outputDirectory && projectConfig.outputDirectory) {
                    outputDirectory = projectConfig.outputDirectory;
                }

                this.createProject(repository, outputDirectory);
            } catch (e) {
                console.error('Error: ' + e);
            }
        }
    }, {
        key: 'parseArguments',
        value: function parseArguments() {
            var subcommand = process.argv[2];
            var projectType = process.argv[3];
            var outputDirectory = process.argv[4];

            if (subcommand != 'create') {
                throw new Error('subcommand must be create');
            }

            if (!(projectType in this.projectConfigs)) {
                var possibleProjectTypes = Object.keys(this.projectConfigs);
                throw new Error(projectType + ' cannot be created. Possible project types are one of ' + possibleProjectTypes.join(", "));
            }

            if (outputDirectory == '.') {
                throw new Error('an output directory cannot be a current directory');
            }

            return {
                subcommand: subcommand,
                projectType: projectType,
                outputDirectory: outputDirectory
            };
        }
    }, {
        key: 'createProject',
        value: function createProject(repository, outputDirectory) {
            var command = "git " + ['clone', '--depth=1', repository, outputDirectory].join(" ");

            try {
                _child_process2.default.execSync(command);
                (0, _rmdir2.default)(outputDirectory + '/.git', function (error) {
                    if (error) {
                        console.error(error);
                    }
                });
            } catch (e) {
                throw new Error('' + e.toString());
            }
        }
    }]);

    return Command;
}();

exports.default = Command;