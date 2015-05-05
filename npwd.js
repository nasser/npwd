'use strict';
var clipbd = require('copy-paste')
var scrypt = require('scrypt-async')
var prompt = require('prompt')
var colors = require('colors')

var stdout = process.stdout
process.on('SIGINT', process.exit)

var npwd = {
	scrypt: function(res, cbk) {
		res.acc = (
			'npwd'  + 
			res.acc +
			'npwd'
		)
		return scrypt(
			res.key, res.acc,
			17, 8, 16, 800,
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
	inClipbd: function(c, cbk) {
		var t = setInterval(function() {
			if (c === 0) {
				clearInterval(t)
				clipbd.copy('', cbk)
			}
			stdout.clearLine()
			stdout.cursorTo(0)
			stdout.write(
				npwd.msg[1].bgGreen + ' ' + c
			); c--
		}, 1000)
	},
	clear: function() {
		stdout.clearLine()
		stdout.cursorTo(0)
		stdout.write(npwd.msg[2].inverse)
		process.exit()
	},
	msg: [
		'Please wait...',
		'In clipboard!',
		'Cleared.'
	]
}

npwd.prompt(function(err, res) {
	stdout.write(npwd.msg[0])
	res.acc = res.acc.toLowerCase()
	npwd.scrypt(res, function(pwd) {
		clipbd.copy(pwd, function() {
			npwd.inClipbd(10, npwd.clear)
		})
	})
})
