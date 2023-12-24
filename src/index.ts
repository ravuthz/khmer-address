import fs from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

export type LatLong = { lat: string, long: string };
export type GeoData = LatLong & {
    bounding_box: string[]
};

let globalCache: any = {};

export const CODE_TYPE: any = {
    2: 'provinces',
    4: 'districts',
    6: 'communes',
    8: 'villages',
};

export function writeJsonData(filePath: string, fileName: string, data: any) {
    const fullPath = join(filePath, fileName);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        const text = JSON.stringify(data, null, 0);
        fs.writeFile(fullPath, text.replace(/\s\n/g, ''), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

export function readJsonData(filePath: string, fileName: string) {
    const fullPath = join(filePath, fileName);
    return new Promise((resolve, reject) => {
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

export function formatAddress(data: any) {
    if (!data) {
        return null;
    }
    return Object.keys(data).map(cd => {
        const item = data[cd];

        let ll = "";
        let bb: string[] = [];
        let geodata = {};

        if (geodata = item['geodata']) {
            const { lat, long, bounding_box } = geodata as GeoData;
            bb = bounding_box;
            ll = `${lat},${long}`;
        }

        return {
            cd,
            kh: item['name']['km'],
            en: item['name']['latin'],
            cl_kh: item['administrative_unit']['km'],
            cl_en: item['administrative_unit']['latin'],
            ll,
            bb,
        }
    });
}

export async function saveAddressFromRemote(url: string, name: string, path: string) {
    const localPath = join(path, `${name}.json`);
    if (fs.existsSync(localPath)) {
        console.log(`The local ${localPath} already exists.`);
        return;
    }
    const result: any = await fetch(url).then(res => res.text()).then(yaml.load);
    const jsonData = formatAddress(result[name]);
    return writeJsonData(path, `${name}.json`, jsonData);
}

export async function syncAddressFromRemote(url: string, localPath = './data') {
    const addressKeys: string[] = Object.values(CODE_TYPE);
    console.log(`Syncing address data from remote ... ${url}`);
    return await Promise.allSettled(addressKeys.map((key) => {
        return saveAddressFromRemote(`${url}/${key}.yml`, key, localPath);
    }));
}

export async function getAllAddress(type: string, localPath: string) {
    if (!globalCache[type]) {
        globalCache[type] = await readJsonData(localPath, `${type}.json`);
    }
    return globalCache[type] || [];
}

export async function getAddressByCode(code: string, localPath = './data') {
    const data = await getAllAddress(CODE_TYPE[code.length], localPath);
    return data.find((item: any) => item.cd === code);
}

export async function getAddressByParent(parent: string, localPath = './data') {
    const len = parent.length + 2 > 8 ? 8 : parent.length + 2;
    // const len = Math.min(parent.length + 2, 8);
    const data = await getAllAddress(CODE_TYPE[len], localPath);
    return data.filter((item: any) => item.cd.startsWith(parent));
}