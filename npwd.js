'use strict';
var clipbd = require('copy-paste')
var scrypt = require('scrypt-async')
var prompt = require('prompt')
var colors = require('colors')

var write = function(x) {
	process.stdout.write(x)
}
process.on('SIGINT', process.exit)

var npwd = {
	scrypt: function(key, acc, cbk) {
		return scrypt(
			key,acc,17,
			8, 16, 800,
			cbk, 'hex'
		)
	},
	prompt: function(cbk) {
		prompt.message = 'npwd'.blue.bold
		prompt.delimiter = '>'
		prompt.start()
		prompt.get({
			properties: {
				key: {
					hidden: true,
					message: 'key',
					required: true
				},
				acc: {
					hidden: false,
					message: 'account',
					required: true
				}
			}
		}, cbk)
	},
	clearClipbd: function(cbk) {
		var c = 9
		var t = setInterval(function() {
			write(c.toString() + ' ')
			c--
		}, 1000)
		setTimeout(function() {
			clearInterval(t)
			clipbd.copy('', cbk)
		}, 9999)
		write(npwd.msg[2])
	},
	msg: [
		'Please wait... ',
		'Go!'.bgGreen,
		'Clearing clipboard in '
	]
}

npwd.prompt(function(err, res) {
	write(npwd.msg[0])
	res.acc = res.acc.toLowerCase()
	npwd.scrypt(
		res.key, res.acc,
		function(pwd) {
			clipbd.copy(pwd, function() {
				write(npwd.msg[1] + '\n')
				npwd.clearClipbd(function() {})
			})
		}
	)
})