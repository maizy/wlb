if (window.wlb === undefined) {
  const SaveInput = function () {
    this.timeInput = null;
    this.lsKey = "input";
  };
  SaveInput.prototype.init = function () {
    this.timeInput = document.getElementById("time-input");
    this.ls = window.localStorage;
    if (this.ls) {
      this.timeInput.value = this.ls.getItem(this.lsKey);
      this.bindAll();
    }
  };
  SaveInput.prototype.bindAll = function () {
    this.timeInput.addEventListener("input", this.onValueChange.bind(this));
    this.timeInput.addEventListener("change", this.onValueChange.bind(this));
  };
  SaveInput.prototype.onValueChange = function () {
    const currentValue = this.timeInput.value;
    this.ls.setItem(this.lsKey, currentValue);
  };

  window.wlb = {
    init: function () {
      this.saveInput.init();
    },
    saveInput: new SaveInput(),
  };

  window.wlb.init();
}
