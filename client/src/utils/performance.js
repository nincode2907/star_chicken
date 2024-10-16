export const debounce = (fn, ms) => {
  let timer;

  return function () {
    const args = arguments;
    const context = this;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, ms);
  };
};

export const handleToUp = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
