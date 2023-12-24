import { getAddressByCode, getAddressByParent, syncAddressFromRemote } from "./src/index";

async function main() {
    const url = 'https://raw.githubusercontent.com/dwilkie/pumi/master/data';

    await syncAddressFromRemote(url, './data');

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