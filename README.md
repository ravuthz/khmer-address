# Khmer Address package

To install dependencies:

```bash

bun add khmer-address

# or with other package manager such as npm, yarn, pnpm
npm install khmer-address --save
yarn add khmer-address
pnpm add khmer-address

```

Usage:

```ts
import {
  getAddressByCode,
  getAddressByParent,
  syncAddressFromRemote,
} from "khmer-address";

async function main() {
  const url =
    "https://raw.githubusercontent.com/ravuthz/khmer-address-data/master/data";

  // Load data from remote and save to local
  await syncAddressFromRemote(url, "./data");

  // Fetch and filter local data by code or parent code

  const p1 = await getAddressByCode("01"); //4
  console.log(p1);
  // {
  //   cd: "01",
  //   kh: "បន្ទាយមានជ័យ",
  //   en: "Banteay Meanchey",
  //   cl_kh: "ខេត្ត",
  //   cl_en: "Khaet",
  //   ll: "13.7989147,102.8862666",
  //   bb: [ "13.3579351", "14.2502283", "102.3338282", "103.4427283" ]
  // }

  const c1 = await getAddressByParent("0102"); //6
  console.log(c1);
  // [
  //   {
  //     cd: "010201",
  //     kh: "បន្ទាយនាង",
  //     en: "Banteay Neang",
  //     cl_kh: "ឃុំ",
  //     cl_en: "Khum",
  //     ll: "13.5104093,103.0177392",
  //     bb: [ "13.4904093", "13.5304093", "102.9977392", "103.0377392" ]
  //   },
  //   {
  //     cd: "010202",
  //     kh: "បត់ត្រង់",
  //     en: "Bat Trang",
  //     cl_kh: "ឃុំ",
  //     cl_en: "Khum",
  //     ll: "13.5262537,102.9725752",
  //     bb: [ "13.5062537", "13.5462537", "102.9525752", "102.9925752" ]
  //   },
  // ...
  // ]

  const c2 = await getAddressByParent("010201"); //8
  console.log(c2);
  // [
  //   {
  //     cd: "01020101",
  //     kh: "អូរធំ",
  //     en: "Ou Thum",
  //     cl_kh: "ភូមិ",
  //     cl_en: "Phum",
  //     ll: "",
  //     bb: []
  //     }, {
  //     cd: "01020102",
  //     kh: "ភ្នំ",
  //     en: "Phnum",
  //     cl_kh: "ភូមិ",
  //     cl_en: "Phum",
  //     ll: "",
  //     bb: []
  //  }
  // ...
  // ]

  const c3 = await getAddressByParent("01020101"); //10
  console.log(c3);
  // [
  //   {
  //     cd: "01020101",
  //     kh: "អូរធំ",
  //     en: "Ou Thum",
  //     cl_kh: "ភូមិ",
  //     cl_en: "Phum",
  //     ll: "",
  //     bb: []
  //   }
  // ]
}

main();
```

| Key   | Description             |
| ----- | ----------------------- |
| cd    | Code                    |
| kh    | Khmer name              |
| en    | English or Lantin name  |
| cl_kh | Khmer class             |
| cl_en | English or Lantin class |
| ll    | Latitude and longitude  |
| bb    | Bounding box            |

Check more about data

https://github.com/ravuthz/khmer-address-data
