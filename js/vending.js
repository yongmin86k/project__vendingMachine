class VendingMachine {
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

  _displayItems() {
    return this.inventory.items;
  }

  _currentBalance() {
    const coins = Object.keys(this.inventory.hasCoins);
    const balance = coins.reduce((acc, cur) => {
      const sum = this.coinTypes[cur] * this.inventory.hasCoins[cur];
      return acc + sum;
    }, 0);
    const current = {
      current: `$${balance.toFixed(2)}`,
      hasCoins: this.inventory.hasCoins
    };
    return current;
  }

  _insertedMoney(money) {
    const insertedCoins = Object.keys(money);
    const amountInserted = insertedCoins.reduce((acc, cur) => {
      const calculated = this.coinTypes[cur] * money[cur];
      return acc + calculated;
    }, 0);

    return amountInserted;
  }

  _findItemByID(itemID, money) {
    const selectedItem = this.inventory.items.filter(
      item => item.id === itemID
    );

    if (selectedItem.length < 1) {
      return new Error(`There is no item matches to ${itemID}`);
    } else if (money < selectedItem[0].price) {
      return new Error(
        `Please insert $${(selectedItem[0].price - money).toFixed(2)} more`
      );
    } else {
      return selectedItem[0];
    }
  }

  _returnChange(amountInserted, selectedItem) {
    const amountChange = amountInserted - selectedItem.price;

    // {changeAmount: 4.75, toonie: 2, quarter: 3}

    const returnedCoins = {
      changeAmount: `$${parseFloat(amountChange).toFixed(2)}`,
      remain: amountChange
    };
    this.arrCoinTypes.forEach(type => {
      const howMany = Math.floor(returnedCoins.remain / this.coinTypes[type]);
      if (howMany > 0) {
        returnedCoins[type] = howMany;
        returnedCoins.remain =
          returnedCoins.remain - this.coinTypes[type] * howMany;
      }
    });

    delete returnedCoins.remain;

    const currentStatement = this.arrCoinTypes.reduce((acc, cur) => {
      return acc + this.inventory.hasCoins[cur] * this.coinTypes[cur];
    }, 0);
    const isChange = parseFloat(returnedCoins.changeAmount.replace("$", ""));

    if (currentStatement < isChange) {
      return new Error(`There is no enough money in the vending machine`);
    } else {
      return returnedCoins;
    }
  }

  _updateInventory(itemID, insertedCoins, dispensedCoins) {
    const newItems = this.inventory.items.map(item => {
      if (itemID === item.id) {
        if (item.stock > 0) {
          item.stock--;
        } else {
          return new Error(`${itemID} is out of service.`);
        }
      }
      return item;
    });
    this.inventory.items = newItems;

    this.arrCoinTypes.map(coin => {
      if (insertedCoins[coin]) {
        this.inventory.hasCoins[coin] += insertedCoins[coin];
      }
      if (dispensedCoins[coin]) {
        this.inventory.hasCoins[coin] -= dispensedCoins[coin];
      }
    });
  }

  _dispenseItem(itemID, money) {
    const amountInserted = this._insertedMoney(money);
    const selectedItem = this._findItemByID(itemID, amountInserted);
    const amountChange = this._returnChange(amountInserted, selectedItem);

    this._updateInventory(itemID, money, amountChange);

    const item = {
      change: amountChange,
      returnedItem: selectedItem.name
    };

    return item;
  }
  //
}

export default VendingMachine;
