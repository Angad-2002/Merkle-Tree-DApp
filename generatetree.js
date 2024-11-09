const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// List of transaction hashes
const transactions = [
    '0x67987d84767bbf0c830140706dbce5bd35ae7042724b39c199e2d033c2ab12a9',
    '0x1d986b952fd45cd36e89e8edf8746b8670f7c70e26c199fd3303d7d7eb14f350',
    '0x7c3fccb80a3d8e049cc26a60974d26fdb3af52b47de102f1f31b41c9b97745b8',
    '0x3902376cea529be89e98216b207f727992d2c062137543fde8e2b8b17edf61c4',
    '0xa848b0360a805b8180613dee9df5d9046ef7c383e2f09ee1cd1d7474675b6adf',
    '0x710d8d5032afc930a17bd9f259e837bd2229c1cd029ebaca09c007a56d27aef4',
    '0xc4ae75c49876a60aa11bbfb20f598662ac2d80b71e16b4938513cd166eeed9ed',
    '0xceb461c57c858155def9b82a5e00943c2d350eda5ca1e121ecd966cd038dd67d',
    '0xd1793da736ac1b9fa1c7edaadd73de0a0e305915960da8a744eb4d18b16c307c',
    '0x7cabdbc8cd174022fec089ce6fc61d13d226852d91e4fad2901ca1f1924bc0ed',
    '0x503e01046a5153a13729e9a9bb79edf64ce699ffacad1273db00f198f29d7b98',
    '0x28296f2274352d7d1b1580a8fa6019063ece2e92be68a17e78b0fc78cdb38e26',
    '0x3d1a79551b85a5ef6bf3ca48941bb113d0d28d65502d13d2f0ef951ca734ef0f',
    '0x77f4924d14522918fdc22b3c3ea82830d9d8424fffb4bbfe46f1210305debbaf',
    '0x803c93c000a04645ef6df3c0f18d31891b0ce841d75bbbf55563bdeb4aefa4cc',
    '0x1edb1473f4cc13ac98ef379a210750997e6479b0e26ef2931ccece6d1b3ea259',
    '0xeebca4ad4f5d116a8ef80bc84c9484c851087a13600212fa4e4774c3e65f5307',
    '0x3643125397a3b690ae9bcce31b0d5fdc582d9c00fb480882b47fd91cf8bfcea6',
    '0xe817adc532d2f6b798af31d24ea933a0e2fb84fac0ab7e50421bd6bf57af212d',
    '0x64e41fd1ba6ec2196a16f15e649c123d5af98abd32d0633da6615f571ac6ab83',
    '0x6014a911a3cf1a28a833c07f2482306a086382b8bb4b53e4f4cb3285e950106d',
    '0xbd56aed3a5c68173daf7e90d8647188bf99c092ac2466c267456781e365bf163',
    '0xa56a80ee040146929d161dab30aa62867911aee184a1c0e3d82e1d572c12e498',
    '0x5031b8c518f29a9a8dae1d27afe481cd6c07021c40d8578016df8ff936f6c645',
    '0x8a2a4b532f1207778b47573ac7cda130613192e9868b87aba0245e246db00c7b',
    '0xda38eb1b1f254782d54af451a4d3d75ba40059d46e832626651de7c32f128cae',
    '0xbbd8b25e4dffefb3e323d017e94290e12fc8f6d835cce5ea56488eb1da1f11b7',
    '0x5ec406701341c716584262771ebb12ce0c46d9fb44e736aabab0996dc80d9dd7',
    '0x5734f7748dbfbba72d0e1991a9cb6d062124db66ca90c068a925a84f7486588a',
    '0x3be2970c0b205481e25f01ea73ebc79f7131f74ece7c27b00b4e82696b51f21f',
    '0xd4765d647ee37e6890264c62cafff8463875455dde71834c42a0a1d5902d1c9a',
    '0x7a6fdbec8d3810d3ec7588ee0ee3369e38a77107f4488b3976702869f67dc758',
    '0x6aaba8b11a69b3da48a91507f3640630e35771ec7a3bf043e2f53d0d4386e84d',
    '0x8d71335638e073867d41ba3c4561dec6d0a6a1aa7666597e000712f4495bcace',
    '0x845f9abffa3d2eb639d5af088180a2dbb69ca1b16ddbe1338926aa5a1435cf73',
    '0xe96b0f9c46b1355754d76c61deae351194d40dab2ab47f754ed196a66dbff6c2',
    '0x8f7d8c1a7f037f73a7f1e98e79e7a01bc93fea8fc574886a684fd0cb8eed517a',
    '0xe70db2f7734840762bb56beacc899f9fe7d073933f270de5062fdcdfa6d1c70b',
    '0x4c583e4f7c482262201f6f7e5beef9c622c7c1b6316bc5a4ccb1778576d36b9e',
    '0x53cb793d755dfe6226b3d31d7c5a276943785498ac206cda6e42540936d7a417',
    '0x23a1af0ed63549a02f28b81a8c9954aa69055558bfc29c933e8983a0073e9d24',
    '0x19acc6d751bc075f801b35aae06a21a83cb7bc036014fcc9fcab489b2aba2606',
    '0x0c2e59cc35ceb049cdb5441a67eef351f41a7bea6014be483a02dd7a0fa0f30c',
    '0xd41e46b78e1124e77194ad2320482d7111c2d12095559c654f50a372297fda1b',
    '0x4525fd4116a9ba0163a578796ad9fec271034d77692ef0a3340baa04dccbac7d',
    '0x62e2cf02f424882c5aad3f2a1fe6f6078348aa1a9d8e9d206072b26f7b1ba3386',
    '0x90b44c6ad7c3f8daaa6c6185f55abf0339ca823d68290b943fe99cf8010bfa40',
    '0x6de29ebd156fd72842e5295a869d9b4f7f631277e5f72b3dbb300742eb09e84d',
    '0x7ab2a2f93b9a6d16ef924fcd5acbc13ba1b2b0b7d597778a94ea00a586b1c340',
    '0x6c36d20898eaf7e808adfaafc7b2d05abf65f1323a8fe03016ab8a1891b7be72',
    '0x9abac69b6ca382df3b1c030249a908d57881d7845f78a0622b5929fc11cd2347',
    '0x1c90878f1e870b8c5e2c48250a94697470ccbc6ff5cfd240d07605d8e4a02b1f'
];

// Create a Merkle Tree using the transaction hashes
const leaves = transactions.map(tx => keccak256(tx));  // Hash the transactions
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

// Get the Merkle root
const root = tree.getRoot().toString('hex');

console.log('Merkle Root:', root);

// To verify a transaction's inclusion in the Merkle Tree:
const transactionToVerify = '0x7c3fccb80a3d8e049cc26a60974d26fdb3af52b47de102f1f31b41c9b97745b8';  // Example: Verify the first transaction
const proof = tree.getProof(keccak256(transactionToVerify));  // Generate proof for the transaction

console.log('Proof for Transaction:', transactionToVerify);
console.log(proof);

const isVerified = tree.verify(proof, keccak256(transactionToVerify), root);
console.log('Transaction verified:', isVerified);  // should return true
