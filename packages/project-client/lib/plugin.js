'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
    function Plugin() {
        _classCallCheck(this, Plugin);
    }

    _createClass(Plugin, [{
        key: 'preprocess',
        value: function preprocess() {}
    }, {
        key: 'postprocess',
        value: function postprocess() {}
    }], [{
        key: 'newInstance',
        value: function newInstance(name) {
            var dirname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();

            // const filepath = resolve.sync('project-client-plugin-' + name, { basedir: dirname });
            // const plugin = require(filepath);
            var plugin = require('project-client-plugin-' + name).default;
            return new plugin();
        }
    }]);

    return Plugin;
}();

exports.default = Plugin;