# khmer-address

To install dependencies:

```bash

bun add khmer-address

# or with other package manager such as npm, yarn, pnpm
npm install khmer-address --save
yarn add khmer-address
pnpm add khmer-address

```

Usage:

```bash

import { getAddressByCode, getAddressByParent, syncAddressFromRemote } from "khmer-address";

async function main() {

    const url = 'https://raw.githubusercontent.com/ravuthz/khmer-address-data/master/data';

    // Load data from remote and save to local
    await syncAddressFromRemote(url, './data');

    // Feture and filter local data by code or parent code

    const p1 = await getAddressByCode('01'); //4
    console.log(p1);

    const c1 = await getAddressByParent('0102'); //6
    console.log(c1);

    const c2 = await getAddressByParent('010201');//8
    console.log(c2);

    const c3 = await getAddressByParent('01020101');//10
    console.log(c3);
}

main();

```
