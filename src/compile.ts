import JavascriptObfuscator from 'javascript-obfuscator';
import path from 'path';
import fs from 'fs-extra';

const compile = async (folderName: string) => {
	const resultsPath = path.join(__dirname, '..', 'result');
	try {
		await fs.opendir(resultsPath)
		await fs.rm(resultsPath, {
			recursive: true
		})
		await fs.mkdir(path.join(__dirname, '..', 'result'))
	} catch (err) {
		await fs.mkdir(path.join(__dirname, '..', 'result'))
	}

	const targetPath = path.join(process.cwd(), folderName);
	await fs.copy(targetPath, resultsPath, {
		
	});

	const resultsFolder = fs.readdirSync(resultsPath, { withFileTypes: true })
	resultsFolder.forEach(entry => modifyEntry(entry, resultsPath, ""))
}

const modifyEntry = (entry: fs.Dirent, p: string, prepend: string) => {
	if (entry.name.startsWith('.') || entry.name.endsWith(".min.js") || entry.name.endsWith(".min.css")) {
		return
	}

	console.log(prepend + entry.name)
	if (entry.isDirectory()) {
		const contents = fs.readdirSync(path.join(p, entry.name), { withFileTypes: true })
		contents.forEach(c => modifyEntry(c, path.join(p, entry.name), prepend + "\t"))
	} else {
		if (entry.name.endsWith(".js")) {
			const f = fs.readFileSync(path.join(p, entry.name)).toString()
			const res = JavascriptObfuscator.obfuscate(f)
			fs.writeFileSync(path.join(p, entry.name), res.getObfuscatedCode())
		}
	}
}

export default compile;