import { RegistryTypes } from '../RegistryType';
import { RegistryItem } from '../RegistryItem';
import { DataItem, decodeToDataItem } from '../lib';
import { DataItemMap } from '../types';
import { CryptoKeypath } from '../CryptoKeypath';

enum Keys {
  keyPath = 1,
  curve,
  algo,
}

export enum Curve {
  secp256k1,
  ed25519
}

export enum DerivationAlgorithm {
  slip10,
  bip32ed25519
}

export class KeyDerivationSchema extends RegistryItem {
  getRegistryType = () => RegistryTypes.KEY_DERIVATION_SCHEMA;

  constructor(
    private keypath: CryptoKeypath,
    private curve: Curve = Curve.secp256k1,
    private algo: DerivationAlgorithm = DerivationAlgorithm.slip10,
  ) {
    super();
  }

  public getKeypath = (): CryptoKeypath => this.keypath;
  public getCurve = (): Curve => this.curve;
  public getAlgo = (): DerivationAlgorithm => this.algo;

  public toDataItem = (): DataItem => {
    const map: DataItemMap = {};
    const dataItem = this.getKeypath().toDataItem();
    dataItem.setTag(this.getKeypath().getRegistryType().getTag());
    map[Keys.keyPath] = dataItem;
    map[Keys.curve] = this.curve;
    map[Keys.algo] = this.algo;
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem): KeyDerivationSchema => {
    const map = dataItem.getData();
    const keypaths = CryptoKeypath.fromDataItem(map[Keys.keyPath]);
    const curve = map[Keys.curve];
    const algo = map[Keys.algo];
    return new KeyDerivationSchema(keypaths, curve, algo);
  };

  public static fromCBOR = (_cborPayload: Buffer): KeyDerivationSchema => {
    const dataItem = decodeToDataItem(_cborPayload);
    return KeyDerivationSchema.fromDataItem(dataItem);
  };
}
