const fs = require('fs');
const { NodeSSH } = require('node-ssh');

if (process.argv.length < 3) {
	console.error('Usage: node uploadFiles.js <filename>');
	process.exit(1);
}

const filename = process.argv[2];
// Read the file containing IP:pass pairs
const fileContent = fs.readFileSync('ips.txt', 'utf-8');
const ipPassPairs = fileContent.trim().split('\n');

// Iterate through each IP:pass pair
(async () => {
	for (const ipPass of ipPassPairs) {
		try {
			const [ip, password] = ipPass.split(':');
			const ssh = new NodeSSH();
			await ssh.connect({
				host: ip,
				username: 'root', // Change this to your username
				password: password
			})
			await ssh.putFile(filename, `/home/${filename}`);
			console.log(`File uploaded to ${ip}`);
			ssh.dispose();
		} catch (error) { 
			console.error(error);
		}
	}
})()