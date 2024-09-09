/*
  Purpose: Resets the height of the <textarea> to "auto". This removes any previously set height 
  to ensure that the element can shrink if necessary. By setting it to "auto", the browser 
  recalculates the height based on the content, as if it had no predefined height.
*/

/*
  scrollHeight: This property gives the height of the content inside the <textarea>, 
  including content that is not visible due to overflow. By setting the style.height to this value, 
  the text area will grow (or shrink) to fit all its content without the need for a scrollbar.
*/

export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const maxOffsetLeft = viewportWidth - cardWidth;
  const maxOffsetTop = viewportHeight - cardHeight;

  return {
    x:
      offsetLeft < 0
        ? 0
        : offsetLeft > maxOffsetLeft
        ? maxOffsetLeft
        : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop > maxOffsetTop ? maxOffsetTop : offsetTop,
  };
};

export const autoGrow = (textAreaRef) => {
  const { current } = textAreaRef;
  current.style.height = "auto";
  current.style.height = current.scrollHeight + "px";
};

export const setZIndex = (selectedCard) => {
  selectedCard.style.zIndex = 999;

  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    if (card !== selectedCard) {
      card.style.zIndex = selectedCard.style.zIndex - 1;
    }
  });
};

export const bodyParser = (value) => {
  try {
    JSON.parse(value);
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};
