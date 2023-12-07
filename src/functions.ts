import fs from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

let globalCache: any = {};

const YAML_URL = 'https://raw.githubusercontent.com/dwilkie/pumi/master';
const ROOT_DIR = join(import.meta.dir, '..');

export type LatLong = { lat: string, long: string };
export type GeoData = LatLong & {
    bounding_box: string[]
};

export const codeType: any = {
    2: 'provinces',
    4: 'districts',
    6: 'communes',
    8: 'villages',
};

export function writeJsonData(filePath: string, fileName: string, data: any) {
    const fullPath = join(ROOT_DIR, filePath, fileName);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        const text = JSON.stringify(data, null, 0);
        fs.writeFile(fullPath, text.replace(/\s\n/g, ''), 'utf8', (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
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

export async function saveAddressJson(name: string, path = 'data') {
    const result: any = await fetch(`${YAML_URL}/${path}/${name}.yml`).then(res => res.text()).then(yaml.load);
    const jsonData = formatAddress(result[name]);
    return writeJsonData(path, `${name}.json`, jsonData);
}

export async function loadAddressFromRemoteYaml(path = 'data') {
    await saveAddressJson('provinces', path);
    await saveAddressJson('districts', path);
    await saveAddressJson('communes', path);
    await saveAddressJson('villages', path);
}

export async function getAllAddress(type: string) {
    if (!globalCache[type]) {
        globalCache[type] = await import(`${ROOT_DIR}/data/${type}.json`).then(res => res.default);
    }
    return globalCache[type] || [];
}

export async function getAddressByCode(code: string) {
    const data = await getAllAddress(codeType[code.length]);
    return data.find((item: any) => item.cd === code);
}

export async function getAddressByParent(parent: string) {
    const len = parent.length + 2 > 8 ? 8 : parent.length + 2;
    // const len = Math.min(parent.length + 2, 8);
    const data = await getAllAddress(codeType[len]);
    return data.filter((item: any) => item.cd.startsWith(parent));
}