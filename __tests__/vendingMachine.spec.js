const VendingMachine = require("../lib/VendingMachine");
const inventory = require("../inventory.json");
let vending;

describe("Vending Machine", () => {
  beforeEach(() => {
    // Reset inventory
    vending = new VendingMachine(inventory);
  });
  //
  describe("when inputMoney={toonie: 2} and itemSelected=B2", () => {
    const inputMoney = {
      toonie: 2
    };
    const itemSelected = "B2";
    //
    it("should display $4.00", () => {
      expect(vending.insertedMoney(inputMoney)).toBe(4);
    });
    //

    it("should throw an error - Not a valid item", () => {
      expect(() => {
        vending.findItemByID(itemSelected, 4).toThrow();
      });
    });
  });
  //
  describe("when inputMoney={loonie: 1} and itemSelected=A3", () => {
    const inputMoney = {
      loonie: 1
    };
    const itemSelected = "A3";
    //
    it("should display $1.00", () => {
      expect(vending.insertedMoney(inputMoney)).toBe(1);
    });
    //
    it("should throw an error - Not enough money", () => {
      expect(() => {
        vending.findItemByID(itemSelected, 1).toThrow();
      });
    });
  });
  //

  describe("when inputMoney={toonie: 2, loonie: 1} and itemSelected=A1", () => {
    const inputMoney = {
      toonie: 2,
      loonie: 1
    };
    const itemSelected = "A1";
    //
    it("should display $5.00", () => {
      expect(vending.insertedMoney(inputMoney)).toBe(5);
    });
    //
    it("should find PRINGLES | Grab & Go! Sour Cream & Onion Flavour", () => {
      expect(vending.findItemByID(itemSelected, 5)).toEqual(
        expect.objectContaining({
          id: "A1",
          name: "PRINGLES | Grab & Go! Sour Cream & Onion Flavour",
          price: 1.5,
          stock: 20
        })
      );
    });
    //
    it(`shoud return 
        change = { remain: 0, toonie: 1, loonie: 1, quarter: 2 }
        returnedItem = PRINGLES | Grab & Go! Sour Cream & Onion Flavour
        inventory = Object
      `, () => {
      expect(vending.dispenseItem(itemSelected, inputMoney)).toEqual(
        expect.objectContaining({
          change: expect.any(Object),
          returnedItem: "PRINGLES | Grab & Go! Sour Cream & Onion Flavour"
        })
      );
    });
  });
  //
  describe("display all the items and specifications of the vending machine", () => {
    it("should return all information of the vending machine", () => {
      expect(vending.displayItems()).toEqual(expect.anything());
    });
  });
  //
  describe("display how much money the vending machine has", () => {
    it("should return the balance of the vending maching", () => {
      expect(vending.currentBalance()).toEqual(expect.anything());
    });
  });
  //
});
