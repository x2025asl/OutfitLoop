(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  const savedOutfitIds = storage.get("outfitloop-saved-looks", []);
  const savedLooks = Array.isArray(savedOutfitIds) ? savedOutfitIds : [];
  const savedCloset = storage.get("outfitloop-closet", CLOSET_STARTER_ITEMS);
  let closet = Array.isArray(savedCloset) ? savedCloset : CLOSET_STARTER_ITEMS.slice();
  const savedMarket = storage.get("outfitloop-market", []);
  let marketItems = MARKET_LISTINGS.concat(Array.isArray(savedMarket) ? savedMarket : []);
  const savedCreations = storage.get("outfitloop-created-looks", []);
  let createdLooks = Array.isArray(savedCreations) ? savedCreations : [];
  let activeOutfitFilter = "All looks";
  let activeMarketFilter = "Everything";
  let selectedClosetIds = [];
  let toastTimer;

  document.title = STARTUP.name + " — wear it, love it, loop it";

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) { return view.id === requested; });
    const target = document.getElementById(requested);
    const parentView = target && target.closest("[data-view]");
    const current = exists ? requested : parentView ? parentView.id : "home";

    views.forEach(function (view) { view.hidden = view.id !== current; });
    document.querySelectorAll(".main-nav a, .header-cta").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (!exists && parentView) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo(0, 0);
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function makeImage(src, alt, className) {
    const image = makeElement("img", className);
    image.src = src;
    image.alt = alt || "";
    image.loading = "lazy";
    image.addEventListener("error", function () {
      image.classList.add("image-unavailable");
      image.removeAttribute("src");
    }, { once: true });
    return image;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 3200);
  }

  function setActiveFilter(container, selected, setter, render) {
    container.querySelectorAll("button").forEach(function (button) {
      const active = button.dataset.filter === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    setter(selected);
    render();
  }

  function createFilterButtons(container, options, selected, setter, render) {
    options.forEach(function (option) {
      const button = makeElement("button", "filter-chip", option);
      button.type = "button";
      button.dataset.filter = option;
      button.setAttribute("aria-pressed", option === selected ? "true" : "false");
      if (option === selected) button.classList.add("is-active");
      button.addEventListener("click", function () { setActiveFilter(container, option, setter, render); });
      container.appendChild(button);
    });
  }

  function makeOutfitCard(item) {
    const card = makeElement("article", "outfit-card");
    const imageWrap = makeElement("div", "outfit-image-wrap");
    imageWrap.appendChild(makeImage(item.image, item.alt, "outfit-image"));
    const saveButton = makeElement("button", "save-look");
    const isSaved = savedLooks.indexOf(item.id) !== -1;
    saveButton.type = "button";
    saveButton.setAttribute("aria-label", isSaved ? "Remove saved look" : "Save this look");
    saveButton.setAttribute("aria-pressed", isSaved ? "true" : "false");
    saveButton.textContent = isSaved ? "♥" : "♡";
    saveButton.addEventListener("click", function () {
      const index = savedLooks.indexOf(item.id);
      if (index === -1) savedLooks.push(item.id);
      else savedLooks.splice(index, 1);
      if (!storage.set("outfitloop-saved-looks", savedLooks)) {
        showToast("Your browser couldn't save this look. Check your storage settings.");
      }
      renderOutfits();
    });
    imageWrap.appendChild(saveButton);
    card.appendChild(imageWrap);

    const detail = makeElement("div", "outfit-detail");
    const meta = makeElement("div", "outfit-meta");
    meta.append(makeElement("span", "style-label", item.style), makeElement("span", "like-count", "♡ " + item.likes));
    detail.append(meta, makeElement("h3", "", item.title), makeElement("p", "item-list", item.items));
    const byline = makeElement("div", "outfit-byline");
    byline.append(makeElement("span", "mini-avatar", item.creator.charAt(0)), makeElement("span", "", "Styled by " + item.creator));
    const shopLink = makeElement("a", "small-link", "Shop pre-loved →");
    shopLink.href = "#marketplace";
    byline.appendChild(shopLink);
    detail.appendChild(byline);
    card.appendChild(detail);
    return card;
  }

  const outfitGrid = document.getElementById("outfit-grid");
  const outfitEmpty = document.getElementById("outfit-empty");
  function renderOutfits() {
    const matches = OUTFITS.filter(function (item) {
      return activeOutfitFilter === "All looks" || item.style === activeOutfitFilter;
    });
    outfitGrid.replaceChildren.apply(outfitGrid, matches.map(makeOutfitCard));
    outfitEmpty.hidden = matches.length > 0;
  }

  function makeMarketCard(item) {
    const card = makeElement("article", "market-card");
    const imageWrap = makeElement("div", "market-image-wrap");
    imageWrap.appendChild(makeImage(item.image, item.alt, "market-image"));
    const offerText = item.offer === "swap" ? "Open to swaps" : item.offer === "both" ? "Sale or swap" : "For sale";
    imageWrap.appendChild(makeElement("span", "offer-badge", offerText));
    card.appendChild(imageWrap);

    const body = makeElement("div", "market-card-body");
    const heading = makeElement("div", "market-card-heading");
    heading.append(makeElement("h3", "", item.name), makeElement("span", "price-tag", item.price > 0 ? "$" + item.price : "Swap"));
    body.append(heading, makeElement("p", "market-description", item.description));
    const meta = makeElement("p", "market-meta", item.condition + " · " + item.category + " · " + item.seller);
    body.appendChild(meta);

    const action = makeElement("button", "button button-outline market-action", item.offer === "sale" ? "I'm interested →" : item.offer === "swap" ? "Ask to swap →" : "Buy or swap →");
    action.type = "button";
    action.addEventListener("click", function () {
      showToast("This is a prototype—no real purchases or swap requests are sent.");
    });
    body.appendChild(action);
    card.appendChild(body);
    return card;
  }

  const marketGrid = document.getElementById("market-grid");
  const marketEmpty = document.getElementById("market-empty");
  const marketSearch = document.getElementById("market-search");
  function renderMarket() {
    const query = marketSearch.value.trim().toLowerCase();
    const matches = marketItems.filter(function (item) {
      const searchable = (item.name + " " + item.category + " " + item.description + " " + item.seller).toLowerCase();
      const matchesSearch = searchable.indexOf(query) !== -1;
      const matchesType = activeMarketFilter === "Everything" ||
        (activeMarketFilter === "For sale" && (item.offer === "sale" || item.offer === "both")) ||
        (activeMarketFilter === "Open to swaps" && (item.offer === "swap" || item.offer === "both"));
      return matchesSearch && matchesType;
    });
    marketGrid.replaceChildren.apply(marketGrid, matches.map(makeMarketCard));
    marketEmpty.hidden = matches.length > 0;
  }

  function makeClosetCard(item) {
    const card = makeElement("label", "closet-card");
    const checkbox = makeElement("input", "closet-checkbox");
    checkbox.type = "checkbox";
    checkbox.value = item.id;
    checkbox.checked = selectedClosetIds.indexOf(item.id) !== -1;
    checkbox.setAttribute("aria-label", "Select " + item.name + " to style");
    checkbox.addEventListener("change", function () {
      if (checkbox.checked && selectedClosetIds.indexOf(item.id) === -1) selectedClosetIds.push(item.id);
      if (!checkbox.checked) selectedClosetIds = selectedClosetIds.filter(function (id) { return id !== item.id; });
      updateStylerButton();
    });
    card.append(checkbox, makeImage(item.image, item.alt || item.name, "closet-image"));
    const detail = makeElement("span", "closet-item-detail");
    detail.append(makeElement("strong", "", item.name), makeElement("small", "", item.category));
    card.appendChild(detail);
    return card;
  }

  const closetGrid = document.getElementById("closet-grid");
  function renderCloset() {
    selectedClosetIds = selectedClosetIds.filter(function (id) {
      return closet.some(function (item) { return item.id === id; });
    });
    closetGrid.replaceChildren.apply(closetGrid, closet.map(makeClosetCard));
    document.getElementById("closet-count").textContent = String(closet.length);
    document.getElementById("closet-empty").hidden = closet.length > 0;
    updateStylerButton();
  }

  function updateStylerButton() {
    const button = document.getElementById("create-outfit");
    button.disabled = selectedClosetIds.length < 2;
    const description = document.querySelector(".styler-panel p");
    description.textContent = selectedClosetIds.length < 2
      ? "Choose at least two pieces above to start styling."
      : selectedClosetIds.length + " pieces selected. Ready to make a look?";
  }

  function renderCreatedLooks() {
    const section = document.getElementById("created-outfits");
    const list = document.getElementById("created-outfit-list");
    section.hidden = createdLooks.length === 0;
    list.replaceChildren.apply(list, createdLooks.map(function (look) {
      const card = makeElement("article", "created-look");
      const names = makeElement("div", "created-look-items");
      look.items.forEach(function (item) {
        names.appendChild(makeImage(item.image, item.alt || item.name, ""));
      });
      card.append(names, makeElement("div", "created-look-caption", look.title));
      return card;
    }));
  }

  const wardrobeForm = document.getElementById("wardrobe-form");
  const imageInput = document.getElementById("piece-image");
  document.getElementById("list-piece").addEventListener("change", function (event) {
    document.getElementById("listing-options").hidden = !event.target.checked;
  });

  function readSelectedImage() {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return Promise.resolve(null);
    if (!file.type.startsWith("image/")) return Promise.reject(new Error("Please choose an image file."));
    if (file.size > 1500000) return Promise.reject(new Error("Choose an image smaller than 1.5 MB."));
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error("That image couldn't be read. Please try another one.")); };
      reader.readAsDataURL(file);
    });
  }

  wardrobeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const submitButton = wardrobeForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    readSelectedImage().then(function (uploadedImage) {
      const name = document.getElementById("piece-name").value.trim();
      const category = document.getElementById("piece-category").value;
      const listThisPiece = document.getElementById("list-piece").checked;
      const defaultImage = CLOSET_STARTER_ITEMS.find(function (item) { return item.category === category; }) || CLOSET_STARTER_ITEMS[0];
      const piece = {
        id: "closet-" + Date.now(),
        name: name,
        category: category,
        image: uploadedImage || defaultImage.image,
        alt: uploadedImage ? name : defaultImage.alt
      };
      closet.push(piece);
      const saved = storage.set("outfitloop-closet", closet);
      let marketSaved = true;
      if (listThisPiece) {
        const offerType = document.getElementById("listing-type").value;
        const price = Number(document.getElementById("listing-price").value) || 0;
        const listing = {
          id: "market-" + Date.now(),
          name: name,
          category: category,
          description: "A well-loved " + category.toLowerCase() + " piece, ready for its next chapter.",
          condition: "Very good",
          seller: "You",
          price: offerType === "swap" ? 0 : price,
          offer: offerType === "both" ? "both" : offerType,
          image: piece.image,
          alt: piece.alt
        };
        marketItems.push(listing);
        const savedListings = marketItems.filter(function (item) { return item.seller === "You"; });
        marketSaved = storage.set("outfitloop-market", savedListings);
        renderMarket();
      }
      renderCloset();
      wardrobeForm.reset();
      document.getElementById("listing-options").hidden = true;
      if (saved && marketSaved) {
        showToast(listThisPiece
          ? "Added to your closet and listed in the market!"
          : "Added to your closet!");
      } else {
        showToast("Added for this visit, but your browser couldn't save it. Check your storage settings.");
      }
    }).catch(function (error) {
      showToast(error.message);
    }).finally(function () {
      submitButton.disabled = false;
    });
  });

  document.getElementById("create-outfit").addEventListener("click", function () {
    const items = closet.filter(function (item) { return selectedClosetIds.indexOf(item.id) !== -1; });
    if (items.length < 2) return;
    const look = {
      title: items.map(function (item) { return item.name; }).join(" + "),
      items: items.map(function (item) { return { name: item.name, image: item.image, alt: item.alt }; })
    };
    createdLooks.unshift(look);
    if (!storage.set("outfitloop-created-looks", createdLooks)) {
      showToast("Look created, but your browser couldn't save it. Check your storage settings.");
    } else {
      showToast("Your new look is ready!");
    }
    selectedClosetIds = [];
    renderCloset();
    renderCreatedLooks();
  });

  createFilterButtons(document.getElementById("outfit-filters"),
    ["All looks", "Everyday", "Going out", "Street style"], activeOutfitFilter,
    function (value) { activeOutfitFilter = value; }, renderOutfits);
  createFilterButtons(document.getElementById("market-filters"),
    ["Everything", "For sale", "Open to swaps"], activeMarketFilter,
    function (value) { activeMarketFilter = value; }, renderMarket);

  marketSearch.addEventListener("input", renderMarket);
  window.addEventListener("hashchange", showView);
  renderOutfits();
  renderMarket();
  renderCloset();
  renderCreatedLooks();
  showView();
})();
