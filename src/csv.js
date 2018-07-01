const fs = require('fs');
const csv = require('csv');

const csvmanager = {
    read: async (filename) => {
        const columns = [
            'date',
            'data',
            'value1',
            'value2',
        ];
        let ret = [];
        const parser = csv.parse({ columns });
        const readableStream = fs.createReadStream(filename, { encoding: 'utf-8' });

        asyncFunc = () => {
            return new Promise(function (resolve, reject) {
                readableStream.pipe(parser);

                parser.on('readable', () => {
                    var data;
                    while (data = parser.read()) {
                        ret.push(data);
                    }
                });

                parser.on('end', () => {
                    resolve();
                });
            });
        };

        await asyncFunc();
        return ret;
    },
};

module.exports = csvmanager;