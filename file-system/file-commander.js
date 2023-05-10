const fs = require('fs/promises');

const commands = {
    CREATE_FILE: 'create a file',
};


(async () => {
    // watch the command file
    const watcher = fs.watch('./command.txt');

    // open the command file
    const commandFileHandler = await fs.open('./command.txt', 'r');

    // register a function to an event on the commandFileHandler
    commandFileHandler.on('change', commandReader);

    // async iterator
    for await (let event of watcher) {
        if (event.eventType !== "change") continue;

        // emit change event and pass the handler
        commandFileHandler.emit('change', commandFileHandler);
    }
})();

/**
 * @param {fs.FileHandle} fileHandler 
 * @returns {undefined}
 */
async function commandReader(fileHandler) {
    // read the command file
    // getting file size in bytes
    const fileSize = (await fileHandler.stat()).size;

    // don't read empty file
    if(fileSize === 0) return;

    // allocating a buffer of size = fileSize
    const buffer = Buffer.alloc(fileSize);

    // offset is where to start writing data in the buffer
    const offset = 0; // 0 -> start of the buffer

    // length is the amount of bytes we want to read from the file
    const length = fileSize; // read the whole file

    // The location where to begin reading data from the file
    const position = 0; // from the start

    await fileHandler.read(
        buffer,
        offset,
        length,
        position
    );
    const fileContent = buffer.toString('utf-8');
    commandExecutor(fileContent);
}

/**
 * @param {string} command
 * @returns {undefined}
 */
function commandExecutor(command) {

    const commander = new Commander()

    if(command.includes(commands.CREATE_FILE)){
        const path = command.substring(commands.CREATE_FILE.length).trim();
        commander.createFile(path)
    }
    
}

class Commander {
    /**
     * @param {String} path 
     */
    async createFile(path){
        (await fs.open(path, 'w')).close()
    }
}