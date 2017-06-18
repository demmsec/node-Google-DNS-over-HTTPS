class Logger {
    static error(msg) {
        this.log(`[Error] ${msg}`);
    }

    static info(msg) {
        this.log(`[Info] ${msg}`);
    }

    static log(msg) {
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;
        const formattedMsg = `${time} ${msg}`;
        console.log(formattedMsg);
    }
}

module.exports = Logger;
