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

  currentBalance() {
    const coins = Object.keys(this.inventory.hasCoins);
    const balance = coins.reduce((acc, cur) => {
      const sum = this.coinTypes[cur] * this.inventory.hasCoins[cur];
      return acc + sum;
    }, 0);
    const current = {
      current: `$${balance.toFixed(2)}`,
      hasCoins: { ...this.inventory.hasCoins }
    };

    return current;
  }

  displayItems() {
    return this.inventory;
  }

  insertedMoney(money) {
    const insertedCoins = Object.keys(money);
    const amountInserted = insertedCoins.reduce((acc, cur) => {
      const calculated = this.coinTypes[cur] * money[cur];
      return acc + calculated;
    }, 0);

    return amountInserted;
  }

  findItemByID(itemID, money) {
    const selectedItem = this.inventory.items.filter(
      item => item.id === itemID
    );
    if (selectedItem.length < 1) {
      throw `There is no item matches to ${itemID} `;
    }
    if (money < selectedItem[0].price) {
      throw `Please insert ${selectedItem[0].price - money} more`;
    }

    return selectedItem[0];
  }

  returnChange(amountInserted, selectedItem) {
    const amountChange = amountInserted - selectedItem.price;
    const returnedCoins = this.arrCoinTypes.reduce((acc, cur) => {
      const result = {
        changeAmount: `$${parseFloat(acc).toFixed(2)}`,
        remain: acc,
        ...acc
      };
      const howMany = Math.floor(result.remain / this.coinTypes[cur]);

      if (howMany > 0) {
        result[cur] = howMany;
        result.remain = result.remain - this.coinTypes[cur] * howMany;
      }
      return result;
    }, amountChange);

    delete returnedCoins.remain;

    return returnedCoins;
  }

  updateInventory(itemID, insertedCoins, dispensedCoins) {
    const newItems = this.inventory.items.map(item => {
      if (itemID === item.id) {
        item.stock--;
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

  dispenseItem(itemID, money) {
    const amountInserted = this.insertedMoney(money);
    const selectedItem = this.findItemByID(itemID, amountInserted);
    const amountChange = this.returnChange(amountInserted, selectedItem);
    this.updateInventory(itemID, money, amountChange);

    const item = {
      change: amountChange,
      returnedItem: selectedItem.name
    };

    return item;
  }
}

module.exports = VendingMachine;
