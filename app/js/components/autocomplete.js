export function attachAutocomplete({ input, suggestions }) {
  const list = document.createElement("div");

  list.className = "autocomplete-list";

  input.parentNode.appendChild(list);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    list.innerHTML = "";

    if (!value) {
      return;
    }

    const matches = suggestions.filter(item =>
      item.toLowerCase().includes(value)
    );

    matches.forEach(match => {
      const option = document.createElement("div");

      option.className = "autocomplete-option";

      option.textContent = match;

      option.addEventListener("click", () => {
        input.value = match;

        list.innerHTML = "";

        input.focus();
      });

      list.appendChild(option);
    });
  });
}
