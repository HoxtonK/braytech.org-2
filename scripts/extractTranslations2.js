"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Babel based translation extracter Mk.2
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const util = require("util");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { resolve, relative } = path;
const { parse } = babelParser;
const { promisify } = util;
const { default: traverse } = babelTraverse;
const regUnplaceholdify = /^#####/;
const placeholdify = (key) => `#####${key}`;
const unplaceholdify = (key) => key.replace(regUnplaceholdify, '');
const stableCompare = (a, b) => {
    if (a === b)
        return 0; // hello == hello
    const ua = unplaceholdify(a);
    const ub = unplaceholdify(b);
    const la = ua.toLowerCase();
    const lb = ub.toLowerCase();
    if (la === lb)
        return ua > ub ? 1 : -1; // Hello -> hello, #Hello -> hello
    return la > lb ? 1 : -1;
};
const MISSING_TRANSLATION = '🌐';
const INDENT = '    ';
const SOURCE_LOCALE = 'en'; // oy!
const ARG_VERBOSE = process.argv.includes('--verbose');
const ARG_SKIP_SORT = process.argv.includes('--skip-sort');
const ARG_STATS = process.argv.includes('--stats');
const FilesLogic = {
    glob: promisify(glob),
    read: promisify(fs.readFile),
    readJson: async (filename) => {
        try {
            return JSON.parse(await FilesLogic.read(filename, { encoding: 'utf8' }));
        }
        catch (e) {
            console.log('FilesLogic.readJson: failed to parse:', filename);
            throw new Error(e);
        }
    },
    write: promisify(fs.writeFile),
    getJSFileList: () => FilesLogic.glob(resolve(__dirname, '../src/**/*.js')),
    getJSONFileList: () => FilesLogic.glob(resolve(__dirname, '../public/static/locales/**/translation.json')),
    scrapeStrings: async (filename, sourceStrings) => {
        try {
            const code = (await FilesLogic.read(filename)).toString('utf8');
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'classProperties']
            });
            traverse(ast, {
                CallExpression: function (astPath) {
                    const node = astPath.node;
                    if (node && NodesLogic.isTFunction(node)) {
                        const keys = NodesLogic.getArgumentText(node);
                        if (keys && keys.size) {
                            keys.forEach(key => sourceStrings.add(key));
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
            console.log('>> ' + filename + ' <<');
            console.error('ScrapeStrings Failed: ' + e.message);
        }
    },
    sortSourceStrings(sourceStrings) {
        const keys = Array.from(sourceStrings);
        keys.sort(stableCompare);
        sourceStrings.clear();
        keys.forEach(sourceStrings.add.bind(sourceStrings));
    },
    sortTranslatedStrings(translatedStrings) {
        const entries = Object.entries(translatedStrings);
        entries.sort(([a], [b]) => stableCompare(a, b));
        entries.forEach(([key]) => delete translatedStrings[key]);
        entries.forEach(([key, value]) => (translatedStrings[key] = value));
    },
    addStrings(translatedStrings, sourceStrings, isSourceLocale) {
        const result = [];
        sourceStrings.forEach(key => {
            if (!translatedStrings[key]) {
                if (isSourceLocale) {
                    translatedStrings[key] = key;
                    return;
                }
                const placeholderKey = placeholdify(key);
                if (!translatedStrings[placeholderKey]) {
                    translatedStrings[placeholderKey] = MISSING_TRANSLATION;
                    result.push(key);
                }
            }
        });
        return result;
    },
    deprecateStrings(translatedStrings, sourceStrings) {
        const result = [];
        Object.keys(translatedStrings).forEach(rawKey => {
            const key = unplaceholdify(rawKey);
            // Add this line to retain unused translations
            // if (rawKey === key) return;
            if (!sourceStrings.has(key)) {
                delete translatedStrings[rawKey];
                result.push(key);
            }
        });
        return result;
    },
    countStrings(translatedStrings) {
        const keys = Object.keys(translatedStrings);
        const totalCount = keys.length;
        const notTranslated = keys.filter(key => regUnplaceholdify.test(key)).length;
        const translated = totalCount - notTranslated;
        return { translated, notTranslated };
    }
};
const NodesLogic = {
    isTFunction(node) {
        const { callee, arguments: args } = node;
        if (!(callee && args))
            return false;
        switch (callee.type) {
            case 'Identifier': {
                if (callee.name === 't')
                    return true;
                break;
            }
            case 'MemberExpression': {
                if (callee.property) {
                    const storage = new Set();
                    try
                    {
                        NodesLogic.diveNode(callee.property, storage);
                    }
                    catch (e)
                    {
                        console.log(e);
                        console.error('MemberExpression Parse Failed: ' + e.message);
                    }
                    if (storage.has('t'))
                        return true;
                }
            }
        }
        return false;
    },
    getArgumentText(node) {
        const { arguments: args = [] } = node;
        if (args.length !== 1) {
            //throw new Error(`Argument count was not 1. Found: ${args.length}`);
        }
        const arg = args[0];
        const storage = new Set();
        NodesLogic.diveNode(arg, storage);
        return storage;
    },
    diveNode(node, storage) {
        //complex argument scrapper
        switch (node.type) {
            case 'ConditionalExpression': {
                if (node.consequent && node.alternate) {
                    NodesLogic.diveNode(node.consequent, storage);
                    NodesLogic.diveNode(node.alternate, storage);
                    break;
                }
                throw new Error('ConditionalExpression missing consequent & alternate');
            }
            case 'Identifier': {
                if (node.name) {
                    storage.add(node.name);
                    break;
                }
                throw new Error('Identifier missing name');
            }
            case 'StringLiteral':
            case 'Literal': {
                if (node.value) {
                    storage.add(node.value);
                    break;
                }
                throw new Error('Literal missing value');
            }
            default:
                console.log(node);
                throw new Error(`Unsupported t() usage found: ${node.type}\n ${NodesLogic.serializeDbgLocInfo(node)}`);
        }
    },
    serializeDbgLocInfo(node) {
        const { loc } = node;
        if (!loc)
            return '@(unknown position)';
        return `@line ${loc.start.line}:${loc.start.column}`;
    }
};
(async () => {
    try {
        const sourcefiles = await FilesLogic.getJSFileList();
        let sourceStrings = new Set();
        let lastT = 0;
        let count = 0;
        for (let file of sourcefiles) {
            count++;
            if (Date.now() - lastT > 200 || count === sourcefiles.length) {
                lastT = Date.now();
                console.log(` Processing [${count}/${sourcefiles.length}]`, relative(resolve(__dirname, '..'), file));
            }
            await FilesLogic.scrapeStrings(file, sourceStrings);
        }
        // if you want to see current status activate following line:
        // await FilesLogic.write('tmp.dbg.json', JSON.stringify(Array.from(sourceStrings), null, 1));
        if (!ARG_SKIP_SORT)
            FilesLogic.sortSourceStrings(sourceStrings);
        const jsonFiles = await FilesLogic.getJSONFileList();
        count = 0;
        const result = {};
        for (let jsonFile of jsonFiles) {
            count++;
            const localeMatch = jsonFile.match(/\/([^/]+)\/translation.json$/);
            if (!localeMatch)
                throw new Error(`"${jsonFile}" did not match locale path signature`);
            const locale = localeMatch[1];
            console.log(`Merging [${count}/${jsonFiles.length}] ${locale}`);
            const translatedStrings = await FilesLogic.readJson(jsonFile);
            if (!translatedStrings)
                throw new Error(`Failed to parse ${jsonFile}.`);
            const addResult = await FilesLogic.addStrings(translatedStrings, sourceStrings, locale === SOURCE_LOCALE);
            const deprecateResult = await FilesLogic.deprecateStrings(translatedStrings, sourceStrings);
            if (!ARG_SKIP_SORT)
                FilesLogic.sortTranslatedStrings(translatedStrings);
            if (addResult.length) {
                console.log(` > Added ${addResult.length} strings`);
                if (ARG_VERBOSE)
                    console.log(INDENT + addResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
            }
            if (deprecateResult.length) {
                console.log(` > Removed ${deprecateResult.length} untranslated dead strings`);
                if (ARG_VERBOSE)
                    console.log(INDENT + deprecateResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
            }
            await FilesLogic.write(jsonFile, JSON.stringify(translatedStrings, null, 2), { encoding: 'utf-8' });
            if (ARG_STATS) {
                const { translated, notTranslated } = FilesLogic.countStrings(translatedStrings);
                result[locale.toLocaleLowerCase()] = {
                    translated,
                    notTranslated,
                    added: addResult,
                    removed: deprecateResult
                };
            }
        }
        if (ARG_STATS) {
            await FilesLogic.write('./src/data/translationStats/index.json', JSON.stringify(result, null, 2), { flag: 'w' });
        }
        console.log('done.');
        process.exit(0);
    }
    catch (error) {
        console.error('Failed: ', error.message);
        process.exit(1);
    }
})();
