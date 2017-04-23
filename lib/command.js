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

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

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
            this.parseArguments();
            if (!this.args) {
                return;
            }

            var _args = this.args,
                projectType = _args.projectType,
                outputDirectory = _args.outputDirectory;


            var projectConfig = this.projectConfigs[projectType];
            this.plugins = this.getPlugins(projectConfig.plugins);
            var repository = projectConfig.repository;

            if (!outputDirectory && projectConfig.outputDirectory) {
                // TODO change output directory to project type unless outputDirectory is not specified in config
                outputDirectory = projectConfig.outputDirectory;
            }

            this.preprocess();
            this.createProject(repository, outputDirectory);
            this.postprocess(outputDirectory);
        }
    }, {
        key: 'getPlugins',
        value: function getPlugins(pluginNames) {
            if (!pluginNames) {
                console.info('There is no plugins');
                return [];
            }

            if (!Array.isArray(pluginNames)) {
                pluginNames = [pluginNames];
            }
            return pluginNames.map(function (pluginName) {
                return _plugin2.default.newInstance(pluginName);
            });
        }
    }, {
        key: 'parseArguments',
        value: function parseArguments() {
            var subcommand = _process2.default.argv[2];
            var projectType = _process2.default.argv[3];
            var outputDirectory = _process2.default.argv[4];

            if (subcommand != 'create') {
                console.error('Error: subcommand must be create');
                return;
            }

            if (!(projectType in this.projectConfigs)) {
                var possibleProjectTypes = Object.keys(this.projectConfigs);
                console.error(projectType + ' cannot be created. Possible project types are one of ' + possibleProjectTypes.join(", "));
                return;
            }

            if (outputDirectory == '.') {
                console.error('an output directory cannot be a current directory');
                return;
            }

            this.args = {
                subcommand: subcommand,
                projectType: projectType,
                outputDirectory: outputDirectory
            };
        }
    }, {
        key: 'preprocess',
        value: function preprocess() {
            if (!this.plugins.length) {
                return;
            }

            console.info('Before create a project...');
            this.plugins.forEach(function (plugin) {
                return plugin.preprocess();
            });
        }
    }, {
        key: 'postprocess',
        value: function postprocess(outputDirectory) {
            if (!this.plugins.length) {
                return;
            }

            console.info('After create a project...');
            var currentDirectory = _process2.default.cwd();
            try {
                _process2.default.chdir(outputDirectory);
                this.plugins.forEach(function (plugin) {
                    return plugin.postprocess();
                });
            } finally {
                _process2.default.chdir(currentDirectory);
            }
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