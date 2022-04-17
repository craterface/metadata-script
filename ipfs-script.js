import { create } from "ipfs-http-client";
import * as fs from "fs";

const fileName = "hk.jpeg";
const NFT_NAME = "HiKitty";
const NFT_DESCRIPTION = "HKY";
const ATTRIBUTES = [
  {
    trait_type: "Author",
    value: "Hristo Fidanov",
  },
  {
    trait_type: "Camera",
    value: "NIKON D750",
  },
  {
    trait_type: "Resolution",
    value: "6016px x 3385 px",
  },
  {
    display_type: "date",
    trait_type: "Published",
    value: 1531951200,
  },
];

async function createMetadata(fileName, NFT_NAME, NFT_DESCRIPTION) {
  const formatName = (name) => name.trim().replaceAll(" ", "_");

  const fsReadImgData = fs.readFileSync("hk.jpeg");

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const ipfsFile = await ipfs.add(
    {
      path: fileName,
      content: fsReadImgData,
    },
    {
      wrapWithDirectory: true,
    }
  );

  const ipfLink = `https://ipfs.io/ipfs/${ipfsFile.cid}/${fileName}`;
  console.log(ipfLink);

  const nftData = {
    name: NFT_NAME,
    description: NFT_DESCRIPTION,
    image: ipfLink,
    attributes: ATTRIBUTES,
  };

  const nftJSON = JSON.stringify(nftData);
  const jsonPath = `${formatName(NFT_NAME)}.json`;
  const json = await ipfs.add(
    {
      path: jsonPath,
      content: nftJSON,
    },
    {
      wrapWithDirectory: true,
    }
  );
  const ipfsJsonLink = `https://ipfs.io/ipfs/${json.cid}/${jsonPath}`;
  return ipfsJsonLink;
}

const example_metadata = await createMetadata(
  fileName,
  NFT_NAME,
  NFT_DESCRIPTION
);
console.log(example_metadata);
