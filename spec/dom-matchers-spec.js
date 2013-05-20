describe("Jasmine DOM matchers", function() {
  describe("dom matcher", function() {
    it("checks element's css class name", function() {
      jasmine.sandbox.html("<div class='box block'></div>");

      expect(".box").toHaveClass("block");
      expect(".box").not.toHaveClass("box-missed");
    });

    it("checks element's css property", function() {
      jasmine.sandbox.html("<div class='box' style='width: 300px;'></div>");

      expect(".box").toHaveCss({ width: "300px" });
      expect(".box").not.toHaveCss({ height: "300px" });
    });

    it("checks if element exist", function() {
      jasmine.sandbox.html("<div class='box'></div>");

      expect(".box").toExist();
      expect($(".box")).toExist();
      expect(".box-missed").not.toExist();
    });

    it("checks element's attr", function() {
      jasmine.sandbox.append("<div name='aria' class='box'></div>");

      expect(".box").toHaveAttr("name", "aria");
      expect(".box").not.toHaveAttr("name", "block");
      expect(".box").not.toHaveAttr("type", "aria");
    });

    it("checks element's property");

    it("checks element's html", function() {
      var html = "<div>Text</div>";
      jasmine.sandbox.html(html);

      expect(jasmine.sandbox).toHaveHtml(html);
      expect(jasmine.sandbox).not.toHaveHtml(html + "<div></div>");
    });

    it("checks element's sub html", function() {
      jasmine.sandbox.html("<div>Text</div><div></div>");

      expect(jasmine.sandbox).toContainHtml("<div>Text</div>");
      expect(jasmine.sandbox).not.toContainHtml("<div><span></span></div>");
    });

    it("checks element's text", function() {
      jasmine.sandbox.html("<div>Text</div>");

      expect(jasmine.sandbox).toHaveText("Text");
      expect(jasmine.sandbox).not.toHaveText("Texts");
    });

    it("checks element's sub text", function() {
      jasmine.sandbox.html("<div>Text</div>");

      expect(jasmine.sandbox).toContainText("ex");
      expect(jasmine.sandbox).not.toContainText("exp");
    });

    it("checks element's value", function() {
      jasmine.sandbox.html("<input class='field' value='User'>");

      expect(".field").toHaveValue("User");
      expect(".field").not.toHaveValue("Users");
    });

    it("checks element's data", function() {
      jasmine.sandbox.html("<div class='box' data-name='aria'></div>");
      jasmine.sandbox.find(".box").data("type", "block");

      expect(".box").toHaveData("name", "aria");
      expect(".box").toHaveData("type", "block");

      expect(".box").not.toHaveData("name", "---");
      expect(".box").not.toHaveData("type", "---");
    });

    it("checks element's sub selector", function() {
      jasmine.sandbox.html("<div class='box block'></div>");

      expect(".box").toMatchSelector("div.block");
      expect(".box").not.toMatchSelector("span.block");
    });

    it("checks element's children selector", function() {
      jasmine.sandbox.html("<div class='box'><div class='child'></div></div>");

      expect(".box").toContainSelector("div.child");
      expect(".box").not.toContainSelector("span.child");
    });
  });
});
