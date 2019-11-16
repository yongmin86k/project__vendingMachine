// TODO:: pass the INVENTORY as PARAM
const _displayItems = async inventory => {
  return new Promise(resolve => {
    resolve(inventory);
  });
};

const _currentBalance = async (inventory, coinTypes) => {
  return new Promise(resolve => {
    const coins = Object.keys(inventory.hasCoins);
    const balance = coins.reduce((acc, cur) => {
      const sum = coinTypes[cur] * inventory.hasCoins[cur];
      return acc + sum;
    }, 0);
    const current = {
      current: `$${balance.toFixed(2)}`,
      hasCoins: { ...inventory.hasCoins }
    };
    resolve(current);
  });
};

const _insertedMoney = async (coinTypes, money) => {
  return new Promise(resolve => {
    const insertedCoins = Object.keys(money);
    const amountInserted = insertedCoins.reduce((acc, cur) => {
      const calculated = coinTypes[cur] * money[cur];
      return acc + calculated;
    }, 0);
    resolve(amountInserted);
  });
};

const _findItemByID = async (inventory, itemID, money) => {
  return new Promise((resolve, reject) => {
    const selectedItem = inventory.items.filter(item => item.id === itemID);
    selectedItem.length < 1
      ? reject({
          error: `There is no item matches to ${itemID}`
        })
      : money < selectedItem[0].price
      ? reject({
          error: `Please insert $${(selectedItem[0].price - money).toFixed(
            2
          )} more`
        })
      : resolve(selectedItem[0]);
  });
};

const _returnChange = async (
  coinTypes,
  arrCoinTypes,
  amountInserted,
  selectedItem
) => {
  return new Promise(resolve => {
    const amountChange = amountInserted - selectedItem.price;
    const returnedCoins = arrCoinTypes.reduce((acc, cur) => {
      const result = {
        changeAmount: `$${parseFloat(acc).toFixed(2)}`,
        remain: acc,
        ...acc
      };
      const howMany = Math.floor(result.remain / coinTypes[cur]);

      if (howMany > 0) {
        result[cur] = howMany;
        result.remain = result.remain - coinTypes[cur] * howMany;
      }
      return result;
    }, amountChange);

    delete returnedCoins.remain;

    resolve(returnedCoins);
  });
};

const _updateInventory = async (
  inventory,
  arrCoinTypes,
  itemID,
  insertedCoins,
  dispensedCoins
) => {
  return new Promise(resolve => {
    const newItems = inventory.items.map(item => {
      if (itemID === item.id) {
        item.stock--;
      }
      return item;
    });
    inventory.items = newItems;

    arrCoinTypes.map(coin => {
      if (insertedCoins[coin]) {
        inventory.hasCoins[coin] += insertedCoins[coin];
      }
      if (dispensedCoins[coin]) {
        inventory.hasCoins[coin] -= dispensedCoins[coin];
      }
    });
    resolve(true);
  });
};

const _dispenseItem = async (
  inventory,
  coinTypes,
  arrCoinTypes,
  itemID,
  money
) => {
  return new Promise(async resolve => {
    const amountInserted = await _insertedMoney(coinTypes, money);
    const selectedItem = await _findItemByID(inventory, itemID, amountInserted);
    const amountChange = await _returnChange(
      coinTypes,
      arrCoinTypes,
      amountInserted,
      selectedItem
    );

    await _updateInventory(
      inventory,
      arrCoinTypes,
      itemID,
      money,
      amountChange
    );

    const item = {
      change: amountChange,
      returnedItem: selectedItem.name
    };

    resolve(item);
  });
};

class _VendingMachine {
  constructor(inventory) {
    this.inventory = inventory;
    this.coinTypes = {
      toonie: 2,
      loonie: 1,
      quarter: 0.25,
      dime: 0.1,
      nickel: 0.05
    };
    this.arrCoinTypes = Object.keys(this.coinTypes);
  }
  //
  async displayItems() {
    const result = await _displayItems(this.inventory);
    return result;
  }
  //
  async currentBalance() {
    const result = await _currentBalance(this.inventory, this.coinTypes);
    return result;
  }
  //
  async insertedMoney(money) {
    const result = await _insertedMoney(this.coinTypes, money);
    return result;
  }
  //
  async findItemByID(itemID, money) {
    const result = await _findItemByID(this.inventory, itemID, money);
    return result;
  }
  //
  async returnChange(amountInserted, selectedItem) {
    const result = await _returnChange(
      this.coinTypes,
      this.arrCoinTypes,
      amountInserted,
      selectedItem
    );
    return result;
  }
  //
  async updateInventory(itemID, insertedCoins, dispensedCoins) {
    const result = await _updateInventory(
      itemID,
      insertedCoins,
      dispensedCoins
    );
    return result;
  }
  //
  async dispenseItem(money, itemID) {
    const result = await _dispenseItem(
      this.inventory,
      this.coinTypes,
      this.arrCoinTypes,
      itemID,
      money
    );

    return result;
  }
}

class VendingMachine extends _VendingMachine {
  constructor(inventory) {
    const asyncWrapperForSuper = async () => {
      super(inventory);
    };

    asyncWrapperForSuper();
  }
}

module.exports = VendingMachine;
