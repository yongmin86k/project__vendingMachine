import VendingMachine from "./vending";

$(function() {
  let money = {};
  const coinTypes = {
    toonie: 2,
    loonie: 1,
    quarter: 0.25,
    dime: 0.1,
    nickel: 0.05
  };

  // Fetch data
  $.getJSON("./inventory.json", function(data) {
    const VEND = new VendingMachine(data);

    $.each(data.items, (_, item) => {
      const html = `
      <div class="list-container">
        <div class="list-img">
          <img
            src="${item.img}"
          />
        </div>
        <div class="list-info">
          <h1 class="list-id">${item.id}</h1>
          <div class="list-price">$${item.price.toFixed(2)}</div>
        </div>
      </div>
      `;
      $("#itemLists").append(html);
    });

    // Click and insert money
    $("#cadCoins").on("click", "div", function() {
      if (money[$(this).attr("id")]) {
        money[$(this).attr("id")]++;
      } else {
        money[$(this).attr("id")] = 1;
      }

      const amount = VEND._insertedMoney(money);

      $("#money").html(`$${amount.toFixed(2)}`);
    });

    // Click and select the item id
    $("#itemID").on("click", "button", function() {
      const value = $(this).val();
      if (isNaN(value)) {
        $("#id_1").html(value);
      } else {
        $("#id_2").html(value);
      }
    });

    // Submit
    $("#vend").on("click", function() {
      const itemID = $(".selectedItem")
        .text()
        .replace(/\s/g, "");

      $("section#result").html("");
      const result = VEND._dispenseItem(itemID, money);
      $("section#result").html(`
          <div class="dispensedItem">
            <p>Dispensed item:</p>
            <p>${result.returnedItem}</p>
          </div>
          <div class="dispensedCoins">
            <p>Changes: ${result.change.changeAmount}
            <p id="coins"></p>
          </div>
        `);

      Object.keys(coinTypes).forEach(type => {
        if (result.change[type]) {
          $("#coins").append(`<span>${type}: ${result.change[type]}</span>`);
        }
      });

      $("#money").html("$0.00");
      $("#id_1, #id_2").html("-");
      money = {};
    });
    //
  });
});
