const VendingMachine = require("../lib/VendingMachine");
const inventory = require("../inventory.json");
let vending;

describe("Vending Machine", () => {
  beforeEach(() => {
    vending = new VendingMachine(inventory);
  });

  describe("when inputMoney={toonie: 2}", () => {
    const inputMoney = {
      toonie: 2
    };
    it("should display $4.00", () => {
      expect.assertions(1);
      return vending
        .insertedMoney(inputMoney)
        .then(result => expect(result).toBe(4));
    });
  });

  describe("when inputMoney={loonie: 1, quarter: 2} and itemSelected=B2", () => {
    const inputMoney = {
      loonie: 1,
      quarter: 2
    };
    const itemSelected = "Z2";
    it("should throw an error - Not a valid item", () => {
      expect.assertions(1);
      const money = vending.insertedMoney(inputMoney);
      return expect(vending.findItemByID(itemSelected, money)).rejects.toEqual({
        error: "There is no item matches to Z2"
      });
    });
  });

  describe("when inputMoney={loonie: 1} and itemSelected=A3", () => {
    const inputMoney = {
      loonie: 1
    };
    const itemSelected = "A3";
    it("should throw an error - Not enough money", async () => {
      expect.assertions(1);
      try {
        const money = await vending.insertedMoney(inputMoney);
        await vending.findItemByID(itemSelected, money);
      } catch (e) {
        expect(e).toEqual({
          error: "Please insert $1.00 more"
        });
      }
    });
  });

  describe("when inputMoney={toonie: 2, loonie: 1} and itemSelected=A1", () => {
    const inputMoney = {
      toonie: 2,
      loonie: 1
    };
    const itemSelected = "A1";
    it("should return the item= PRINGLES | Grab & Go! Sour Cream & Onion Flavour", () => {
      expect.assertions(1);
      const money = vending.insertedMoney(inputMoney);
      return vending.findItemByID(itemSelected, money).then(result =>
        expect(result).toEqual(
          expect.objectContaining({
            id: "A1",
            name: "PRINGLES | Grab & Go! Sour Cream & Onion Flavour",
            price: 1.5,
            stock: 20
          })
        )
      );
    });
  });

  describe("when inputMoney={toonie: 2, loonie: 2, quarter: 3} and itemSelected=A4", () => {
    const inputMoney = {
      toonie: 2,
      loonie: 2,
      quarter: 3
    };
    const itemSelected = "A4";
    it("should return the change= {changeAmount: 4.75, toonie: 2, quarter: 3}", async () => {
      expect.assertions(1);
      const money = await vending.insertedMoney(inputMoney);
      const item = await vending.findItemByID(itemSelected, money);

      return vending.returnChange(money, item).then(result =>
        expect(result).toEqual(
          expect.objectContaining({
            changeAmount: "$4.75",
            toonie: 2,
            quarter: 3
          })
        )
      );
    });
  });

  describe("when inputMoney={toonie: 2} and itemSelecfted=A1, but there isn't enough cash in the vending machine", () => {
    const inputMoney = {
      toonie: 2
    };
    const itemSelected = "A1";
    it("should return the error - No enough change", async () => {
      try {
        expect.assertions(1);
        const money = await vending.insertedMoney(inputMoney);
        const item = await vending.findItemByID(itemSelected, money);
        const result = await vending.returnChange(money, item);
        expect(result).toEqual(
          expect.objectContaining({
            changeAmount: "$2.50",
            quarter: 2,
            toonie: 1
          })
        );
      } catch (e) {
        expect(e).toEqual({
          error: `There is no enough money in the vending machine`
        });
      }
    });
  });

  describe("when inputMoney={toonie: 1, loonie: 2, quarter: 3} and itemSelected=A3", () => {
    const inputMoney = {
      toonie: 1,
      loonie: 2,
      quarter: 3
    };
    const itemSelected = "A3";
    it(`should return {change: {changeAmount: $2.75, quarter: 3, toonie: 1}, returnedItem: KETTLE | Sea Salt}`, async () => {
      try {
        expect.assertions(1);
        const result = await vending.dispenseItem(inputMoney, itemSelected);
        expect(result).toEqual(
          expect.objectContaining({
            change: {
              changeAmount: "$2.75",
              quarter: 3,
              toonie: 1
            },
            returnedItem: "KETTLE | Sea Salt"
          })
        );
      } catch (e) {
        expect(e).toEqual({
          error: `A3 is out of service.`
        });
      }
    });
  });

  describe("when refillItems= {A1: 5, A2: 5, A3: 5}", () => {
    const refillItems = {
      A1: 5,
      A2: 5,
      A3: 5
    };
    it(`should return the updated item inventory list`, async () => {
      expect.assertions(1);
      await vending.refillInventory(refillItems).then(result =>
        expect(result).toEqual([
          {
            id: "A1",
            name: "PRINGLES | Grab & Go! Sour Cream & Onion Flavour",
            price: 1.5,
            stock: 25,
            maxStock: 30,
            img:
              "https://assets.shop.loblaws.ca/products_jpeg/20666182003/en/20666182003_lrg_1_@1x.jpg"
          },
          {
            id: "A2",
            name: "Ding Dong Snack Mix",
            price: 2,
            stock: 20,
            maxStock: 20,
            img:
              "https://assets.shop.loblaws.ca/products_jpeg/20873128/en/20873128_lrg_1_@1x.jpg"
          },
          {
            id: "A3",
            name: "KETTLE | Sea Salt",
            price: 2,
            stock: 14,
            maxStock: 15,
            img:
              "https://assets.shop.loblaws.ca/products_jpeg/20887607002/en/20887607002_lrg_1_@1x.jpg"
          },
          {
            id: "A4",
            name: "KETTLE | New York Cheddar",
            price: 2,
            stock: 10,
            maxStock: 15,
            img:
              "https://assets.shop.loblaws.ca/products_jpeg/20887607001/en/20887607001_lrg_1_@1x.jpg"
          },
          {
            id: "A5",
            name: "KETTLE | Sea Salt & Vinegar",
            price: 2,
            stock: 10,
            maxStock: 15,
            img:
              "https://assets.shop.loblaws.ca/products_jpeg/20887607003/en/20887607003_lrg_1_@1x.jpg"
          }
        ])
      );
    });
  });

  describe("when resupplyCoins= {toonie: 50, loonie: 50, quarter: 50, dime: 50, nickel: 50}", () => {
    const resupplyCoins = {
      toonie: 50,
      loonie: 50,
      quarter: 50,
      dime: 50,
      nickel: 50
    };
    it(`should return {current: "$252.00", hasCoins: {toonie: 70, loonie: 72, quarter: 70, dime: 150, nickel: 150}}`, async () => {
      expect.assertions(1);
      await vending.resupplyCoins(resupplyCoins).then(result =>
        expect(result).toEqual(
          expect.objectContaining({
            current: "$252.00",
            hasCoins: {
              toonie: 70,
              loonie: 72,
              quarter: 70,
              dime: 150,
              nickel: 150
            }
          })
        )
      );
    });
  });

  describe("display all the items and specifications of the vending machine", () => {
    it("should return all information of the vending machine", () => {
      expect(vending.displayItems()).toEqual(expect.anything());
    });
  });

  describe("display how much money the vending machine has", () => {
    it("should return the balance of the vending maching", () => {
      expect(vending.currentBalance()).toEqual(expect.anything());
    });
  });
});
